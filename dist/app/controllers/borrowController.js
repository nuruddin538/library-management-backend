"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBorrowSummary = exports.borrowBook = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Book_1 = __importDefault(require("../models/Book"));
const Borrow_1 = __importDefault(require("../models/Borrow"));
// Borrow a book
const borrowBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    const { quantity, dueDate } = req.body;
    // Validate input
    if (!mongoose_1.default.Types.ObjectId.isValid(bookId)) {
        res.status(400).json({ message: "Invalid book ID" });
    }
    if (!quantity || !dueDate) {
        res.status(400).json({ message: "Missing required fields" });
    }
    if (quantity <= 0 || !Number.isInteger(quantity)) {
        res.status(400).json({ message: "Quantity must be a positive integer" });
    }
    if (new Date(dueDate) <= new Date()) {
        res.status(400).json({ message: "Due data must be in the future" });
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Find book with session
        const book = yield Book_1.default.findById(bookId).session(session);
        if (!book) {
            yield session.abortTransaction();
            yield session.endSession();
            return res.status(400).json({ message: "Book not found" });
        }
        // Check available copies
        if (book.copies < quantity) {
            yield session.abortTransaction();
            yield session.endSession();
            res.status(400).json({
                message: "Not enough copies available",
                available: book.copies,
                requested: quantity,
            });
        }
        // Create borrow record
        const borrow = new Borrow_1.default({
            book: bookId,
            quantity,
            dueDate,
        });
        const newBorrow = yield borrow.save({ session });
        // Update book copies
        book.copies -= quantity;
        book.available = book.copies > 0;
        yield book.save({ session });
        yield session.commitTransaction();
        yield session.endSession();
        res.status(201).json({
            message: "Book borrowed successfully",
            borrow: newBorrow,
            remainingCopies: book.copies,
        });
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        if (err instanceof mongoose_1.default.Error.ValidationError) {
            res.status(400).json({
                message: "Validation error",
                error: err.message,
            });
        }
        // res.status(500).json({
        //   message: "Error borrowing book",
        //   error: err instanceof Error ? err.message : "Unknown error",
        // });
        res.status(500).json({
            message: "Error borrowing book",
            error: err instanceof Error ? err.message : "Unknow error",
        });
    }
});
exports.borrowBook = borrowBook;
// Get borrow summary
const getBorrowSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield Borrow_1.default.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalBorrowed: { $sum: "$quantity" },
                    activeBorrows: {
                        $sum: {
                            $cond: [{ $gt: ["$dueDate", new Date()] }, "$quantity", 0],
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails",
                },
            },
            {
                $unwind: "$bookDetails",
            },
            {
                $project: {
                    bookId: "$_id",
                    bookTitle: "$bookDetails.title",
                    author: "$bookDetails.isbn",
                    totalBorrow: 1,
                    activeBorrows: 1,
                    availableCopies: {
                        $subtract: ["$bookDetails.copies", "$totalBorrowed"],
                    },
                    _id: 0,
                },
            },
        ]);
        res.status(200).json({
            message: "Borrow summary retrieved successfully",
            data: summary,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error fetching borrow summary",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
});
exports.getBorrowSummary = getBorrowSummary;
