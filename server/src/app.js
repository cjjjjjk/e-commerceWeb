const express = require(`express`);
const productRoutes = require(`./routes/productRoutes`);
const dotenv = require(`dotenv`);

dotenv.config({ path: `./.env` });

const app = express();

app.use(express.json());

app.use(`/products`, productRoutes);

module.exports = app;
