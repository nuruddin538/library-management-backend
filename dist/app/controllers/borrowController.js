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
const Book_1 = __importDefault(require("../models/Book"));
const Borrow_1 = __importDefault(require("../models/Borrow"));
// Borrow a book
const borrowBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    const { quantity, dueDate } = req.body;
    try {
        const book = yield Book_1.default.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (quantity > book.copies) {
            return res.status(400).json({ message: "Not enough copies available" });
        }
        // Create borrow record
        const newBorrow = new Borrow_1.default({
            book: bookId,
            quantity,
            dueDate: new Date(dueDate),
        });
        yield newBorrow.save();
        // Update book copies
        book.copies -= quantity;
        book.available = book.copies > 0;
        yield book.save();
        res.status(201).json(newBorrow);
    }
    catch (err) {
        res.status(500).json({ message: "Error borrowing book", error: err });
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
                    totalQuantity: { $sum: "$quantity" },
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
                    bookTitle: "$bookDetails.title",
                    isbn: "$bookDetails.isbn",
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json(summary);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Error fetching borrow summary", error: err });
    }
});
exports.getBorrowSummary = getBorrowSummary;
