import { useState } from "react";
import { useVision } from "../context/VisionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Bot, Sparkles, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Optional, if you have it, else use div
import { ScrollArea } from "@/components/ui/scroll-area"; // Optional

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
          goals: data.finalGoals?.map((g) => g.text) || [],
          areas: data.areas || [],
          streak: data.streak || 0,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server Error: ${res.status}`);
      }

      const result = await res.json();
      setAdvice(result.reply);

    } catch (err: any) {
      console.error("Coach Error:", err);
      setError(err.message || "AI is taking a nap. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-4">
      <Card className="w-full max-w-2xl bg-card border-white/10 shadow-2xl relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">AI Vision Coach</CardTitle>
          <CardDescription>
            Get personalized strategic advice based on your current vision and goals.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {!hasData ? (
            <div className="text-center p-6 bg-secondary/20 rounded-xl border border-white/5">
              <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Fill out your Vision and Goals first to unlock AI coaching!</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm text-center">
                  {error}
                </div>
              )}

              {advice ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative animate-in fade-in duration-500">
                  <div className="flex items-center gap-2 mb-4 text-primary font-bold text-sm uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> Insight
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none leading-relaxed text-gray-200" style={{ whiteSpace: "pre-wrap" }}>
                    {advice}
                  </div>
                </div>
              ) : (
                !loading && (
                  <div className="text-center py-8 text-muted-foreground text-sm italic">
                    "I'm ready to analyze your trajectory. Click below to begin."
                  </div>
                )
              )}
            </>
          )}
        </CardContent>

        {hasData && (
          <CardFooter className="flex justify-center pb-8">
            <Button
              onClick={getAdvice}
              disabled={loading}
              size="lg"
              className="w-full sm:w-auto min-w-[200px] h-12 rounded-full font-bold shadow-lg shadow-primary/20"
            >
              {loading ? (
                <><Sparkles className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
              ) : (
                <><Bot className="w-4 h-4 mr-2" /> {advice ? "Ask Again" : "Generate Analysis"}</>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AICoach;
