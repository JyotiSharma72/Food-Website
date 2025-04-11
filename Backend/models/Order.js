// backend/models/Order.js
const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    deliveryAddress: { type: String },
    orderDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', orderSchema);
