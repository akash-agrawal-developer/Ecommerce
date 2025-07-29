const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      title: String,
      price: Number,
      quantity: Number,
      productId: mongoose.Schema.Types.ObjectId,
    }
  ],
  totalAmount: Number,
  paymentId: String,
  orderId: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order',orderSchema);