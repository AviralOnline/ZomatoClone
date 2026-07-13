const User = require('../Models/UserModel');
const { generateToken } = require('../Midleware/AuthMilderware');

const CreateUser = async (req, res) => {
    try {
        const { mobile, password } = req.body || {};

        // Handle image: on Railway multer uses memoryStorage (buffer),
        // locally it uses diskStorage (filename on disk).
        let imagePath = null;
        if (req.file) {
            if (req.file.buffer) {
                // Railway / memoryStorage — encode as base64 data URL
                const base64 = req.file.buffer.toString('base64');
                imagePath = `data:${req.file.mimetype};base64,${base64}`;
            } else {
                // Local / diskStorage — relative path served via /uploads
                imagePath = `/uploads/${req.file.filename}`;
            }
        }

        if (!mobile || !password) {
            return res.status(400).json({ error: 'Mobile and password are required' });
        }

        const existingUser = await User.findOne({ where: { mobile } });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const isAdmin = mobile === 'admin@zomato.com';

        const newuser = await User.create({
            mobile,
            password,
            image: imagePath,
            isAdmin,
            isBlocked: false,
        });

        const token = generateToken(newuser);

        res.status(201).json({ message: 'User created successfully', user: newuser, token });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const GetAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const DeleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.status(200).json({ message: 'User deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const LoginUser = async (req, res) => {
    try {
        const { mobile, password } = req.body || {};

        if (!mobile || !password) {
            return res.status(400).json({ error: 'Mobile and password are required' });
        }

        const user = await User.findOne({ where: { mobile } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ error: 'Your account is blocked. Please contact support.' });
        }
        else if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        else {
            const token = generateToken(user);
            res.status(200).json({ message: 'Login successful', user, token });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const UpdateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const requestingUser = req.user;

        const userToUpdate = await User.findByPk(id);
        if (!userToUpdate) {
            return res.status(404).json({ error: 'User not found' });
        }

        const dbRequestingUser = await User.findByPk(requestingUser.id);
        const isRequestingAdmin = dbRequestingUser && dbRequestingUser.isAdmin;

        if (Number(requestingUser.id) !== Number(id) && !isRequestingAdmin) {
            return res.status(403).json({ error: 'Forbidden. You cannot update another user\'s profile.' });
        }

        const { mobile, password, isBlocked, isAdmin } = req.body || {};

        let imagePath = userToUpdate.image;
        if (req.file) {
            if (req.file.buffer) {
                const base64 = req.file.buffer.toString('base64');
                imagePath = `data:${req.file.mimetype};base64,${base64}`;
            } else {
                imagePath = `/uploads/${req.file.filename}`;
            }
        }

        if (isBlocked !== undefined && isRequestingAdmin) {
            userToUpdate.isBlocked = isBlocked;
        }
        if (isAdmin !== undefined && isRequestingAdmin) {
            userToUpdate.isAdmin = isAdmin;
        }

        if (mobile !== undefined) {
            userToUpdate.mobile = mobile;
        }
        if (password !== undefined) {
            userToUpdate.password = password;
        }
        userToUpdate.image = imagePath;

        await userToUpdate.save();

        res.status(200).json({ message: 'User updated successfully', user: userToUpdate });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { CreateUser, GetAllUsers, DeleteUser, LoginUser, UpdateUser };
