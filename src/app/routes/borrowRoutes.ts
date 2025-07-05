import { Router } from "express";
import { borrowBook, getBorrowSummary } from "../controllers/borrowController";

const router = Router();

router.post("/:bookId", borrowBook);
router.get("/summary", getBorrowSummary);

export default router;
