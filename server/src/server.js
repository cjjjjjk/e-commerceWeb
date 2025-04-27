const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
require("./config/passport");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cartRoutes = require("./routes/cartRoutes");

const Product = require(`./models/productModel`);

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors());
app.use(morgan("dev"));

app.use("/api/v1/users", userRoutes);
app.use(`/api/v1/categories`, categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/carts", cartRoutes);

function getPreloadHref(path, query) {
  var reg = new RegExp(`([A-Za-z0-9\\-\\/]+)?`);
  var matches = path.match(reg, "g");
  if (!matches) {
    return "";
  }
  var baseAPIUrl = "http://localhost:5000/api/v1"; // Local backend URL
  var uri = matches[3] || "/";
  var href;
  var productReg = /product\/([\dA-Z\-]+)/;
  var productMatches = uri.match(productReg);
  href = `${path}`;

  return href;
}

// 🔹 Search API Route
app.get("/api/v1/search", async (req, res) => {
  try {
    const searchTerm = req.query.query;
    if (!searchTerm) return res.json([]);

    // 🔹 Search for products in MongoDB
    const results = await Product.find({
      name: { $regex: searchTerm, $options: "i" },
    }).limit(10);

    // 🔹 Modify results with `getPreloadHref`
    const modifiedResults = results.map((product) => ({
      ...product._doc, // Spread product details
      preloadHref: getPreloadHref(`/product/${product.id}`, searchTerm), // Construct dynamic URL
    }));

    res.json(modifiedResults);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
