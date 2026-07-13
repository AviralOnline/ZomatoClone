const express = require('express');
const { GetAllProducts, CreateProduct, UpdateProduct } = require('../Controller/ProductController');
const { vendorAuthMiddleware } = require('../Midleware/VendorAuthMiddleware');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'zamato-secret-key';
const User = require('../Models/UserModel');

const router = express.Router();

const vendorOrAdminAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Token missing.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'vendor') {
      req.vendor = decoded;
      return next();
    } else {
      const user = await User.findByPk(decoded.id);
      if (user && user.isAdmin && !user.isBlocked) {
        req.user = user;
        return next();
      }
    }
    return res.status(403).json({ error: 'Forbidden. Vendor or Admin access required.' });
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
};

router.get('/', GetAllProducts);
router.get('/vendor/me', vendorAuthMiddleware, GetAllProducts);
router.post('/', vendorAuthMiddleware, CreateProduct);
router.put('/:id', vendorOrAdminAuthMiddleware, UpdateProduct);

module.exports = router;
