import express from "express";
import cors from "cors";
import bookRoutes from "./app/routes/bookRoutes";
import borrowRoutes from "./app/routes/borrowRoutes";

import connectDB from "./app/config/db";

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://library-management-frontend-ecru.vercel.app",
    ],
    credentials: true,
  })
);

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
