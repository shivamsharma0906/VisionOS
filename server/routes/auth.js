import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { email, password, phone, age } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      phone,
      age,
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { 
        id: user._id, 
        email: user.email, 
        age: user.age, 
        phone: user.phone 
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { 
        id: user._id, 
        email: user.email, 
        age: user.age, 
        phone: user.phone 
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --- NEW DELETE ROUTE ---
// Usage: Send a DELETE or GET request to http://localhost:5000/api/auth/delete/user@email.com
router.use("/delete/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const deletedUser = await User.findOneAndDelete({ email });
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: `Successfully deleted user: ${email}` });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;