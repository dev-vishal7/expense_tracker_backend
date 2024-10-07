import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/user.model";

const router = express.Router();

// Register
router.post(
  "/register/",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req: any, res: any) => {
    console.log("in regs", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({
        firstName,
        lastName,
        email,
        password: await bcrypt.hash(password, 10),
      });

      await user.save();

      const token = jwt.sign({ id: user._id }, "secretKey", {
        expiresIn: "24h",
      });
      res.json({ token });
    } catch (err) {
      console.log("err", err);
      res.status(500).send("Server error");
    }
  }
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id }, "secretKey", {
        expiresIn: "24h",
      });
      res.json({ token });
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

export default router;
