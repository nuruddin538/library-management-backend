import { Request, Response, Router } from "express";
import { borrowBook, getBorrowSummary } from "../controllers/borrowController";

const router = Router();

router.post("/:bookId", async (req: Request, res: Response) => {
  try {
    await borrowBook(req, res);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});
router.get("/summary", getBorrowSummary);

export default router;
