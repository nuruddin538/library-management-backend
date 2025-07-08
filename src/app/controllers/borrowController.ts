import { Request, Response } from "express";
import mongoose from "mongoose";
import Book, { IBook } from "../models/Book";
import Borrow, { IBorrow } from "../models/Borrow";
import { availableMemory } from "process";

interface BorrowRequest {
  quantity: number;
  dueDate: Date;
}

// Borrow a book
export const borrowBook = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const { quantity, dueDate } = req.body as BorrowRequest;

  // Validate input
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
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

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find book with session
    const book = await Book.findById(bookId).session(session);

    if (!book) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(400).json({ message: "Book not found" });
    }

    // Check available copies
    if (book.copies < quantity) {
      await session.abortTransaction();
      await session.endSession();
      res.status(400).json({
        message: "Not enough copies available",
        available: book.copies,
        requested: quantity,
      });
    }

    // Create borrow record
    const borrow = new Borrow({
      book: bookId,
      quantity,
      dueDate,
    });

    const newBorrow = await borrow.save({ session });

    // Update book copies
    book.copies -= quantity;
    book.available = book.copies > 0;
    await book.save({ session });

    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      message: "Book borrowed successfully",
      borrow: newBorrow,
      remainingCopies: book.copies,
    });
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();

    if (err instanceof mongoose.Error.ValidationError) {
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
};

// Get borrow summary
export const getBorrowSummary = async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
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
  } catch (err) {
    res.status(500).json({
      message: "Error fetching borrow summary",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
