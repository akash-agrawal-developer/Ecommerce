// server/routes/order.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // your Mongoose model
const authMiddleware = require('../middleware/authmiddleware.js'); 


router.post('/', authMiddleware, async (req, res) => {

    console.log("🛬 Order save request received");
  console.log("👤 From user:", req.userId);
  console.log("📦 Order body:", req.body);

  try {
 
    console.log('📦 Received order payload:', req.body);

    const { items, totalAmount, paymentId, orderId } = req.body;
    
     console.log('❌ Missing fields in order:', { items, totalAmount, paymentId, orderId });

    const newOrder = new Order({
      userId: userId,
      items,
      totalAmount,
      paymentId,
      orderId,
      status: 'confirmed',
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Order save failed:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/', authMiddleware,async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});




module.exports = router;
