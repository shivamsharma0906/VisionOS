import { useState } from "react";
import { useVision } from "../context/VisionContext";

const WeeklyAIReview = () => {
  const { data } = useVision();
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeeklyReview = async () => {
    setLoading(true);

    const res = await fetch("/api/ai/weekly-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vision: data.visionStatement,
        goals: data.finalGoals,
        areas: data.areas,
        streak: data.streak,
      }),
    });

    const result = await res.json();
    setReview(result.reply);
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>Weekly AI Review</h2>

      <button onClick={getWeeklyReview}>
        {loading ? "Analyzing..." : "Generate Weekly Review"}
      </button>

      {review && <p className="advice">{review}</p>}
    </div>
  );
};

export default WeeklyAIReview;
