import { Request, Response } from "express";
import Book from "../models/Book";
import Borrow from "../models/Borrow";

// Borrow a book
export const borrowBook = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const { quantity, dueDate } = req.body;

  try {
    // Find book with session
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(400).json({ message: "Book not found" });
    }

    // Check available copies
    if (quantity > book.copies) {
      return res.status(400).json({
        message: "Not enough copies available",
      });
    }

    // Create borrow record
    const borrow = new Borrow({
      book: bookId,
      quantity,
      dueDate: new Date(dueDate),
    });

    await borrow.save();

    // Update book copies
    book.copies -= quantity;
    book.available = book.copies > 0;
    await book.save();

    res.status(201).json({ success: true, data: borrow });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error borrowing book",
      error: err,
    });
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
    res.status(200).json({ success: true, data: summary });
  } catch (err) {
    console.error("Summary error:" err)
    res.status(500).json({
      success: false,
      message: "Error fetching borrow summary",
    });
  }
};
