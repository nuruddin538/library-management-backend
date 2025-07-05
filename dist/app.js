"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bookRoutes_1 = __importDefault(require("./app/routes/bookRoutes"));
const borrowRoutes_1 = __importDefault(require("./app/routes/borrowRoutes"));
const db_1 = __importDefault(require("./app/config/db"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Database connection
(0, db_1.default)();
// Routes
app.use("/api/books", bookRoutes_1.default);
app.use("/api/borrow", borrowRoutes_1.default);
// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});
exports.default = app;
