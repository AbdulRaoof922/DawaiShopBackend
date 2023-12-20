const express = require("express");
//crud operation
const createRoutes = require('./routes/create');
const readRoutes = require('./routes/read');
const updateRoutes = require('./routes/update');
const deleteRoutes = require('./routes/delete');
const addUserRouter = require('./routes/adduser');
const DeletingUser = require('./routes/DeletingUser');

const app = express();
const cors = require("cors");

require("dotenv").config();
const connectDB = require("./Database/Database");
const User = require("./models/User");
const Product = require('./models/Product');
connectDB();
app.use(cors());
app.use(express.json());
//crud route
app.use('/admin', createRoutes);
app.use('/admin', readRoutes);
app.use('/admin', updateRoutes);
app.use('/admin', deleteRoutes);
app.use('/admin', addUserRouter);
app.use('/admin', DeletingUser);

app.get("/", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});



app.post("/signup", async (req, res) => {
  const { email, password ,name} = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    } else {
      // const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({ name,email, password:password });

      await newUser.save();

      return res.status(201).json({ message: "User created" });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "An error occurred during signup",
      error: error.message,
    });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(req.body.password !== user.password){
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({
        message: "An error occurred during login",
        error: error.message,
      });
  }
});

// CRUD operations for Product

// Create a new product
app.post("/admin/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Error creating product", error: error.message });
  }
});

// Get all products
app.get("/admin/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

// Get a single product by id
app.get("/admin/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
});

// Update a product
app.patch("/admin/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Error updating product", error: error.message });
  }
});

// Delete a product
app.delete("/admin/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
});


module.exports = app;
