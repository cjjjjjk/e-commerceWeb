const mongoose = require("mongoose");
const dotenv = require(`dotenv`);
dotenv.config({ path: "./.env" });

const DB = process.env.MONGO_URI.replace(
  `<MONGO_PASSWORD>`,
  process.env.MONGO_PASSWORD
);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
