import express from "express";
import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ email, password });
    const savedUser = await newUser.save();

    // Return the user ID so frontend can use it
    res.status(201).json({ 
      userId: savedUser._id, 
      email: savedUser.email 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({ 
      userId: user._id, 
      email: user.email 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;