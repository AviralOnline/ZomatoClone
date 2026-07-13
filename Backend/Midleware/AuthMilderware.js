const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'zamato-secret-key';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, mobile: user.mobile, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Token missing.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
};

const adminMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Token missing.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Dynamic import to avoid circular dependency
    const User = require('../Models/UserModel');
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden. Admin access required.' });
    }
    if (user.isBlocked) {
      return res.status(403).json({ error: 'Forbidden. Account is blocked.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
};

module.exports = { authMiddleware, adminMiddleware, generateToken };
