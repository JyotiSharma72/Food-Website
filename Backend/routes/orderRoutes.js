const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Place an order
router.post('/', async (req, res) => {
    const { userId, items, totalAmount, deliveryAddress } = req.body;
    try {
        const order = new Order({ user: userId, items, totalAmount, deliveryAddress });
        await order.save();
        res.json({ message: 'Order placed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all orders (for admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('user');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
