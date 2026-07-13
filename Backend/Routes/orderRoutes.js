const express = require('express');
const { CreateOrder, ConfirmPayment, GetMyOrders, GetVendorOrders, GetAllOrders, GetOrderById, GetOrdersByUserId, UpdateOrder, DeleteOrder } = require('../Controller/OrderController');
const { authMiddleware, adminMiddleware } = require('../Midleware/AuthMilderware');
const { vendorAuthMiddleware } = require('../Midleware/VendorAuthMiddleware');

const router = express.Router();

router.post('/', authMiddleware, CreateOrder);
router.post('/payment/confirm', authMiddleware, ConfirmPayment);
router.get('/my', authMiddleware, GetMyOrders);
router.get('/vendor', vendorAuthMiddleware, GetVendorOrders);

// Admin Routes
router.get('/all', adminMiddleware, GetAllOrders);
router.get('/:id', authMiddleware, GetOrderById);
router.get('/user/:userId', adminMiddleware, GetOrdersByUserId);
router.put('/:id', adminMiddleware, UpdateOrder);
router.delete('/:id', adminMiddleware, DeleteOrder);

module.exports = router;
