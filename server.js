// Ivory Cathey 

// backend for the AJAX data has a landing page. creates the server and allows requests. 
// signup sned JSON via AJAX, req.body = JSON sent, sever logs it, sends back success response + confirmation 
// just a model, nothing can save or process, just a log. fake API for AJAX goes somewhere
// terrible class

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/conferenceDB")
  .then(() => {
    console.log("Connected to MongoDB successfully.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  category: String,
  unit: String,
  price: Number,
  info: String,
  image: String
});

const cartSchema = new mongoose.Schema({
  id: String,
  title: String,
  category: String,
  unit: String,
  price: Number,
  info: String,
  image: String,
  quantity: Number
});

const shippingSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  participationType: String,
  sessions: [String],
  submittedAt: String
});

const billingSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  cardType: String,
  cardNumber: String,
  cardExp: String,
  code: String,
  items: Array,
  submittedAt: String
});

const returnSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  productName: String,
  price: String,
  reason: String,
  condition: String,
  details: String,
  submittedAt: String
});

const Product = mongoose.model("Product", productSchema);
const Cart = mongoose.model("Cart", cartSchema);
const Shipping = mongoose.model("Shipping", shippingSchema);
const Billing = mongoose.model("Billing", billingSchema);
const Return = mongoose.model("Return", returnSchema);

async function seedProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { id: "NYC-1DAY", title: "NYC 1-Day Pass", category: "NYC", unit: "Pass", price: 40, info: "Pick any single day", image: "NewYorkSkyline.jpg" },
      { id: "NYC-WEND", title: "NYC Weekend Pass", category: "NYC", unit: "Pass", price: 80, info: "Attend full event", image: "NewYorkSkyline.jpg" },
      { id: "NYC-VIP", title: "NYC VIP Pass", category: "NYC", unit: "Pass", price: 120, info: "All-access + food & drinks", image: "NewYorkSkyline.jpg" },
      { id: "MIA-1DAY", title: "Miami 1-Day Pass", category: "Miami", unit: "Pass", price: 40, info: "Pick any single day", image: "MiamiSkyline.jpg" },
      { id: "MIA-WEND", title: "Miami Weekend Pass", category: "Miami", unit: "Pass", price: 80, info: "Attend full event", image: "MiamiSkyline.jpg" },
      { id: "MIA-VIP", title: "Miami VIP Pass", category: "Miami", unit: "Pass", price: 120, info: "All-access + food & drinks", image: "MiamiSkyline.jpg" },
      { id: "LA-1DAY", title: "LA 1-Day Pass", category: "LA", unit: "Pass", price: 40, info: "Pick any single day", image: "LosAngelesSkyline.jpg" },
      { id: "LA-WEND", title: "LA Weekend Pass", category: "LA", unit: "Pass", price: 80, info: "Attend full event", image: "LosAngelesSkyline.jpg" },
      { id: "LA-VIP", title: "LA VIP Pass", category: "LA", unit: "Pass", price: 120, info: "All-access + food & drinks", image: "LosAngelesSkyline.jpg" }
    ]);
    console.log("Products seeded.");
  }
}

mongoose.connection.once("open", async () => {
  await seedProducts();
});

app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get("/api/cart", async (req, res) => {
  const cart = await Cart.find();
  res.json(cart);
});

app.post("/api/cart", async (req, res) => {
  console.log("cart hit", req.body);

  const item = req.body;
  const existing = await Cart.findOne({ id: item.id });

  if (existing) {
    existing.quantity += 1;
    await existing.save();
    return res.json(existing);
  }

  const newItem = await Cart.create(item);
  res.json(newItem);
});

app.delete("/api/cart/:id", async (req, res) => {
  await Cart.deleteOne({ id: req.params.id });
  res.json({ success: true });
});

app.delete("/api/cart", async (req, res) => {
  await Cart.deleteMany({});
  res.json({ success: true });
});

app.post("/api/shipping", async (req, res) => {
  console.log("shipping hit", req.body);
  const record = await Shipping.create(req.body);
  res.json({ success: true, record });
});

app.get("/api/shipping", async (req, res) => {
  const shipping = await Shipping.find();
  res.json(shipping);
});

app.post("/api/billing", async (req, res) => {
  console.log("billing hit", req.body);
  const record = await Billing.create(req.body);
  res.json({ success: true, record });
});

app.get("/api/billing", async (req, res) => {
  const billing = await Billing.find();
  res.json(billing);
});

app.post("/api/returns", async (req, res) => {
  console.log("returns hit", req.body);
  const record = await Return.create(req.body);
  res.json({ success: true, record });
});

app.get("/api/returns", async (req, res) => {
  const returns = await Return.find();
  res.json(returns);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
