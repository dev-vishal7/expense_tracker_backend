import express, { Request, Response } from "express";
import Category from "../models/category.model";
import auth from "../middleware/auth";
import { Types } from "mongoose";

const router = express.Router();

// Create a new category
router.post("/", auth, async (req: any, res: Response) => {
  const { title, description } = req.body;
  try {
    const category = new Category({
      title,
      description,
      user: req.user, // The user id from the token
    });
    await category.save();
    res.status(201).json(category); // Return created category
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Server error");
  }
});

// Get all categories
router.get("/", auth, async (req: any, res: Response) => {
  try {
    // const categories = await Category.find({ user: req.user }).lean();
    const categories = await Category.aggregate([
      {
        $match: {
          user: new Types.ObjectId(req.user),
        },
      },
      {
        $lookup: {
          from: "transactions",
          localField: "_id",
          foreignField: "category",
          as: "transactions",
        },
      },
    ]);
    console.log("categories", categories);
    res.json(categories); // Return array of categories
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get a category by ID
router.get("/:id", auth, async (req: Request, res: any) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.json(category); // Return the single category
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Update an existing category
router.put("/:id", auth, async (req: Request, res: any) => {
  const { title, description } = req.body;
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true } // Return the updated category
    );

    if (!category) {
      return res.status(404).send("Category not found");
    }

    res.json(category); // Return the updated category
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete a category
router.delete("/:id", auth, async (req: Request, res: any) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.json({ message: "Category deleted successfully" }); // Return success message
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
