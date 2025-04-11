const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");

const Product = require(`./models/productModel`);

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/v1/users", userRoutes);
app.use(`/api/v1/categories`, categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
