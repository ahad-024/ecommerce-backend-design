const express = require("express");
const mongoose = require("mongoose");

const app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const Product = require("./models/products");


app.get("/", async (req, res) => {
  try {
    const products = await Product.find().limit(4);
    res.render("home", { products });
  } catch (err) {
    res.send(err.message);
  }
});


app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("products", { products });
  } catch (err) {
    res.send(err.message);
  }
});


app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("productDetails", { product });
  } catch (err) {
    res.send("Product not found");
  }
});


app.get("/add-sample", async (req, res) => {
  try {
    await Product.insertMany([
      {
        name: "Shoes",
        price: 2000,
        category: "Fashion",
        image: "https://via.placeholder.com/150",
        description: "Comfortable shoes",
        stock: 10
      },
      {
        name: "Watch",
        price: 5000,
        category: "Accessories",
        image: "https://via.placeholder.com/150",
        description: "Stylish watch",
        stock: 5
      }
    ]);

    res.send("Sample Data Added");
  } catch (err) {
    res.send(err.message);
  }
});


app.get("/search", async (req, res) => {
  try {
    const query = req.query.q || "";

    const products = await Product.find({
      name: { $regex: query, $options: "i" }
    });

    res.render("products", { products });
  } catch (err) {
    res.send(err.message);
  }
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});