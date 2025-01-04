const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true }, // total price for the order (price * quantity)
  date: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order2', OrderSchema);
module.exports = Order;
