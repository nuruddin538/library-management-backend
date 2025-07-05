import { Router } from "express";
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  updatebook,
} from "../controllers/bookController";

const router = Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", createBook);
router.put("/:id", updatebook);
router.delete("/:id", deleteBook);

export default router;
