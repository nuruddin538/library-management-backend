"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const borrowController_1 = require("../controllers/borrowController");
const router = (0, express_1.Router)();
router.post("/:bookId", borrowController_1.borrowBook);
router.get("/summary", borrowController_1.getBorrowSummary);
exports.default = router;
