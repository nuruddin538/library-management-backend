import mongoose, { Document, Schema } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description: string;
  copies: number;
  available: boolean;
}

const BookSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    copies: { type: Number, required: true, default: 1 },
    available: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBook>("Book", BookSchema);
