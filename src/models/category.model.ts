import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  title: string;
  description: string;
  user: mongoose.Schema.Types.ObjectId; // Link the category to the user who created it
}

const categorySchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Foreign key reference
});

export default mongoose.model<ICategory>("Category", categorySchema);
