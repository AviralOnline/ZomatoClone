const { CreateUser, GetAllUsers, DeleteUser, LoginUser, UpdateUser } = require('../Controller/UserController');
const express = require('express');
const upload = require('../Midleware/UploadMidleware');
const { authMiddleware, adminMiddleware } = require('../Midleware/AuthMilderware');
const router = express.Router();

router.post('/signup', upload.single('image'), CreateUser);
router.get('/all', adminMiddleware, GetAllUsers);
router.delete('/:id', adminMiddleware, DeleteUser);
router.put('/:id', authMiddleware, upload.single('image'), UpdateUser);
router.post('/login', LoginUser);
router.get('/me', authMiddleware, (req, res) => {
    res.status(200).json({ user: req.user });
});

module.exports = router;