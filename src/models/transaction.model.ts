import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  category: mongoose.Schema.Types.ObjectId;
  amount: number;
  note: string;
  transactionDate: Date | string | number;
}

const transactionSchema: Schema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  amount: { type: Number, required: true },
  note: { type: String },
  transactionDate: { type: Date || String || Number, required: true },
});

export default mongoose.model<ITransaction>("Transaction", transactionSchema);
