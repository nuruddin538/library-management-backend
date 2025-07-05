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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updatebook = exports.createBook = exports.getBookById = exports.getBooks = void 0;
const Book_1 = __importDefault(require("../models/Book"));
// Get all books
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield Book_1.default.find();
        res.status(200).json(books);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching books", error: err });
    }
});
exports.getBooks = getBooks;
// Get a single book by ID
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book_1.default.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching book", error: err });
    }
});
exports.getBookById = getBookById;
// Create a new book
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, author, genre, isbn, description, copies } = req.body;
    try {
        const newBook = new Book_1.default({
            title,
            author,
            genre,
            isbn,
            description,
            copies,
            available: copies > 0,
        });
        const savedBook = yield newBook.save();
        res.status(201).json(savedBook);
    }
    catch (err) {
        res.status(400).json({ message: "Error creating book", error: err });
    }
});
exports.createBook = createBook;
// Update a book
const updatebook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { copies } = _a, updateData = __rest(_a, ["copies"]);
        const updatedBook = yield Book_1.default.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, updateData), { copies, available: copies > 0 }), { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(updatedBook);
    }
    catch (err) {
        res.status(400).json({ message: "Error updating book", error: err });
    }
});
exports.updatebook = updatebook;
// Delete a Book
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedBook = yield Book_1.default.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting book", error: err });
    }
});
exports.deleteBook = deleteBook;
