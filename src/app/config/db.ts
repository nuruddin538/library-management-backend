import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/library"
    );
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
