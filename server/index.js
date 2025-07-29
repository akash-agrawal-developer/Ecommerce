const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/order');
const Order = require('./models/Order');
const auth = require('./routes/auth')
const User = require('./models/user.js');
const authMiddleware = require('./middleware/authmiddleware.js'); 

const app = express();  

app.use(cors());
app.use(express.json());
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth',auth);

const cartschema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   id: { type: String, required: true }, 
   title: String,
   price: Number,
   image: String,
   quantity: Number,
});

const cartModel = new mongoose.model('cartModel',cartschema);


app.get('/cart', authMiddleware, async (req, res) => {
  try {
    console.log("🛡️ [Backend] req.userId:", req.userId);

    if (!req.userId) {
      return res.status(400).json({ error: "Missing or invalid token" });
    }

    const cart = await cartModel.find({ userId: req.userId });
    console.log("📦 [Backend] Cart fetched:", cart);
    res.json(cart);
  } catch (err) {
    console.error("❌ [Backend] Error fetching cart:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});






// ✅ Complete POST /cart route



app.post('/cart', authMiddleware, async (req, res) => {
  try {
    const { product } = req.body;

    if (!product || !(product.id || product._id)) {
      return res.status(400).json({ error: "Invalid product data" });
    }

    const id = product.id || product._id; // normalize
    const { title, price, image } = product;

    // Check if product already exists in cart
    const existing = await cartModel.findOne({ userId: req.userId, id });

    if (existing) {
      // Update quantity if product already exists
      existing.quantity = (existing.quantity ?? 1) + 1;
      await existing.save();
      return res.json(existing);
    } else {
      const newProduct = new cartModel({
        userId: req.userId, // ✅ required for schema validation
        id,                 // ✅ Make sure to include `id` (product id)
        title,
        price,
        image,
        quantity: 1,
      });
      await newProduct.save();
      return res.json(newProduct);
    }
  } catch (err) {
    console.error("Error saving to cart:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});






// delete for deleting the cart from cart.jsx

app.delete('/cart/:id', authMiddleware, async(req,res) => {
   const {id} = req.params;
   try{
      await cartModel.deleteOne({ userId: req.userId, _id: req.params.id });
      res.status(200).send({ message: "deleted successfully"});
   } catch(err){
      res.status(500).send({error: 'failed to delete'});
   }
   
});


// 🔹 PUT: Increment quantity by ID
app.put('/cart/:id/increment', authMiddleware, async (req, res) => {
  try {
    const item = await cartModel.findOne({ _id: req.params.id, userId: req.userId });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.quantity = (item.quantity ?? 1) + 1;
    await item.save();

     res.json(item); // ✅ return full updated item
  } catch (err) {
    console.error('Error incrementing:', err.message);
    res.status(500).json({ error: 'Server error during increment' });
  }
});



app.put('/cart/:id/decrement', authMiddleware, async(req,res) => {
  try {
     const item = await cartModel.findOne({ _id: req.params.id, userId: req.userId });
     if(!item) return res.status(400).json({ error: 'Item not found '});
     if((item.quantity ?? 1)>1){
     item.quantity = (item.quantity ?? 1) - 1;}
     await item.save();
     res.json(item);
  } catch(err) {
     console.error('Error decrementing:', err.message);
     res.status(500).json({ error : 'server error during decrement'});
  }
});




mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
.then(() => {
  console.log("✅ Mongoose is connected");
  app.listen(5000, () => console.log("🚀 Server is running on http://localhost:5000"));
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});