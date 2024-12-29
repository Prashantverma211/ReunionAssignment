import mongoose from "mongoose";
const dotenv = require("dotenv");

dotenv.config();

//-------------------------------- Connect To Database --------------------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.dbUrl as string);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", (error as Error).message);
    process.exit(1);
  }
};

//-------------------------------- Handle Server Error --------------------------------
const gracefulShutdown = async () => {
  console.log("Shutting down gracefully...");
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
};

export { connectDB, gracefulShutdown };
