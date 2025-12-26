import express from "express";

const router = express.Router();

router.post("/coach", async (req, res) => {
  const { vision, goals } = req.body;

  // Temporary mock response (NO AI)
  res.json({
    reply: `✅ Backend working!
Vision received: ${vision}
Goals received: ${goals?.join(", ")}
This is a mock response (AI disabled).`
  });
});

export default router;
