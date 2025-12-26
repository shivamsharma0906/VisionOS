import { useState } from "react";
import { useVision } from "../context/VisionContext";
// import ReactMarkdown from 'react-markdown'; // Optional: for bolding/lists

const AICoach = () => {
  const { data } = useVision(); 
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Safety check: Do we have enough data to ask the AI?
  const hasData = data && data.visionStatement && data.finalGoals?.length > 0;

  const getAdvice = async () => {
    if (!hasData) return;

    try {
      setLoading(true);
      setError("");
      setAdvice(""); // Clear previous advice while thinking

      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vision: data.visionStatement || "",
          // SAFE MAP: Use optional chaining and fallback
          goals: data.finalGoals?.map((g) => g.text) || [],
          areas: data.areas || [],
          streak: data.streak || 0,
        }),
      });

      // Handle non-200 errors better
      if (!res.ok) {
        const errData = await res.json().catch(() => ({})); // Prevent crash if body isn't JSON
        throw new Error(errData.message || `Server Error: ${res.status}`);
      }

      const result = await res.json();
      setAdvice(result.reply);
      
    } catch (err) {
      console.error("Coach Error:", err);
      setError(err.message || "AI is taking a nap. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card ai-coach-container">
      <div className="header-row">
        <h2>🤖 AI Vision Coach</h2>
      </div>

      {!hasData ? (
        <p className="hint-text">
          Fill out your Vision and Goals first to unlock AI coaching!
        </p>
      ) : (
        <button 
          onClick={getAdvice} 
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Analyzing your goals..." : "Get Coach Advice"}
        </button>
      )}

      {error && <div className="error-banner">{error}</div>}

      {advice && (
        <div className="advice-box animate-fade-in">
          <h4>💡 Coach Insight</h4>
          {/* This style ensures new lines from the AI are respected */}
          <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
            {advice}
          </div>
        </div>
      )}
    </div>
  );
};

export default AICoach;