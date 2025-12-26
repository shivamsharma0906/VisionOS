import express from "express";
import Vision from "../models/VisionModel.js";

const router = express.Router();

// SAVE vision
router.post("/", async (req, res) => {
  try {
    const vision = new Vision(req.body);
    await vision.save();
    res.json({ message: "Vision saved successfully" });
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ error: err.message });
  }
});

// FETCH vision
router.get("/:userId", async (req, res) => {
  try {
    console.log("📥 Fetch request for user:", req.params.userId);

    const vision = await Vision.findOne({
      userId: req.params.userId
    });

    console.log("📤 Vision found:", vision);
    res.json(vision);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
