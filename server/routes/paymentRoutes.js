const express = require('express');
const router = express.Router();
const razorpay = require('../razorpay');
const crypto = require('crypto');


router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency,
      receipt: 'receipt_order_' + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
   console.error('❌ Razorpay order creation failed:', error); // ← this is crucial
   res.status(500).json({ error: error.message || 'Error creating Razorpay order' });
  }
});


// 2. ✅ Add Verification Route Here

router.post('/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // ✅ Add these console logs for debugging
  console.log('Received from frontend:');
  console.log('razorpay_order_id:', razorpay_order_id);
  console.log('razorpay_payment_id:', razorpay_payment_id);
  console.log('razorpay_signature:', razorpay_signature);

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ status: "failure", message: "Missing required fields" });
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  console.log('Generated expectedSignature:', expectedSignature);

  if (expectedSignature === razorpay_signature) {
    console.log('✅ Payment verification successful');
    return res.status(200).json({ status: "success", message: "Payment verified" });
  } else {
    console.log('❌ Signature mismatch!');
    return res.status(400).json({ status: "failure", message: "Invalid signature" });
  }
});

module.exports = router;