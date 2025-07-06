import { Request, Response, Router } from "express";
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  updatebook,
} from "../controllers/bookController";

const router = Router();

router.get("/", getBooks);
router.get("/:id", async (req: Request, res: Response) => {
  try {
    await getBookById(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/", createBook);
router.put("/:id", async (req: Request, res: Response) => {
  try {
    await updatebook(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/:id", async (req: Response, res: Response) => {
  try {
    await deleteBook(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
