import { Request, Response } from "express";
import Book from "../models/Book";
import Borrow from "../models/Borrow";

// Borrow a book
export const borrowBook = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const { quantity, dueDate } = req.body;

  if (!bookId || !quantity || !dueDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.copies < quantity) {
      return res.status(400).json({ message: "Not enough copies available" });
    }

    // Create borrow record
    const newBorrow = await Borrow.create({
      book: bookId,
      quantity,
      dueDate,
    });

    // Update book copies
    book.copies -= quantity;
    book.available = book.copies > 0;
    await book.save();
    res.status(201).json(newBorrow);
  } catch (err) {
    res.status(500).json({ message: "Error borrowing book", error: err });
  }
};

// Get borrow summary
export const getBorrowSummary = async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
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
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching borrow summary", error: err });
  }
};
