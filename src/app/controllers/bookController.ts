import { Request, Response } from "express";
import Book, { IBook } from "../models/Book";

// Get all books
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books", error: err });
  }
};

// Get a single book by ID
export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: "Error fetching book", error: err });
  }
};

// Create a new book
export const createBook = async (req: Request, res: Response) => {
  const { title, author, genre, isbn, description, copies } = req.body;

  try {
    const newBook: IBook = new Book({
      title,
      author,
      genre,
      isbn,
      description,
      copies,
      available: copies > 0,
    });
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ message: "Error creating book", error: err });
  }
};

// Update a book
export const updatebook = async (req: Request, res: Response) => {
  try {
    const { copies, ...updateData } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        ...updateData,
        copies,
        available: copies > 0,
      },
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: "Error updating book", error: err });
  }
};

// Delete a Book
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting book", error: err });
  }
};
