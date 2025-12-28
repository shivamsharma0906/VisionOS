import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import aiCoachRoutes from "./routes/aiCoach.js";
import visionRoutes from "./routes/vision.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// 👇 UPDATED CORS SETTINGS
app.use(cors({
  origin: [
    "http://localhost:5173",                      // Vite Localhost
    "http://localhost:8080",                      // Alternate Localhost
    "https://shivamsharma0906.github.io"          // 🟢 YOUR GITHUB WEBSITE
  ],
  credentials: true,                              // Allow cookies/auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Backend working!");
});

// Routes
app.use("/api/ai", aiCoachRoutes);
app.use("/api/vision", visionRoutes);
app.use("/api/auth", authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});