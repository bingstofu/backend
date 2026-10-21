import { Router, type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { requireAuth } from "../middleware/auth";

export const authRouter = Router();

// REGISTER ROUTE
authRouter.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Name, email, and password are required" });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "fallback_secret_change_me",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
});

// LOGIN ROUTE
authRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "fallback_secret_change_me",
      { expiresIn: "7d" }
    );

    const userObj = user.toJSON();

    res.json({
      token,
      user: userObj,
    });
  } catch (err) {
    next(err);
  }
});

// GET CURRENT USER PROFILE
authRouter.get("/me", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});