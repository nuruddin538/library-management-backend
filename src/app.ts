import express from "express";
import cors from "cors";
import bookRoutes from "./app/routes/bookRoutes";
import borrowRoutes from "./app/routes/borrowRoutes";

import connectDB from "./app/config/db";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

export default app;
