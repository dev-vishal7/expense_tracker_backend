import express, { Request, Response } from "express";
import Transaction from "../models/transaction.model";
import auth from "../middleware/auth";
import { Types } from "mongoose";

const router = express.Router();

// Create a new transaction for the specified category
router.post("/:cid/transactions", auth, async (req: any, res: Response) => {
  const { amount, note, transactionDate } = req.body;
  const { cid } = req.params;
  console.log("cid", req.params);
  try {
    const transaction = new Transaction({
      category: cid,
      amount,
      note,
      transactionDate,
    });
    await transaction.save();
    res.status(201).json(transaction); // Return created transaction
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get all transactions for the specified category
router.get("/:cid/transactions", auth, async (req: Request, res: Response) => {
  const { cid } = req.params;

  try {
    const transactions = await Transaction.find({ category: cid });
    res.json(transactions); // Return array of transactions
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get a single transaction by ID for the specified category
router.get("/:cid/transactions/:tid", auth, async (req: any, res: any) => {
  const { cid, tid } = req.params;

  try {
    const transaction = await Transaction.findOne({
      _id: tid,
      category: cid,
    });
    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }
    res.json(transaction); // Return the single transaction
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Update an existing transaction
router.put("/:cid/transactions/:tid", auth, async (req: any, res: any) => {
  const { cid, tid } = req.params;
  const { amount, note, transactionDate } = req.body;

  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: new Types.ObjectId(tid) },
      { amount, note, transactionDate, category: cid },
      { new: true } // Return the updated transaction
    );

    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }

    res.json(transaction); // Return the updated transaction
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete a transaction
router.delete(
  "/:cid/transactions/:tid",
  auth,
  async (req: Request, res: any) => {
    const { cid, tid } = req.params;
    console.log("req.params", req.params);
    try {
      const transaction = await Transaction.findOneAndDelete({
        _id: new Types.ObjectId(tid),
        category: new Types.ObjectId(cid),
      });
      if (!transaction) {
        return res.status(404).send("Transaction not found");
      }
      res.json({ message: "Transaction deleted successfully" }); // Return success message
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

export default router;
