import { useState } from "react";
import { useVision } from "../context/VisionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Brain, Sparkles, Loader2, FileText } from "lucide-react";

const WeeklyAIReview = () => {
  const { data } = useVision();
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  // Safety check
  const hasData = data && (data.visionStatement || data.finalGoals?.length > 0);

  const getWeeklyReview = async () => {
    setLoading(true);

    try {
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

      if (!res.ok) throw new Error("Failed to generate review");

      const result = await res.json();
      setReview(result.reply);
    } catch (err) {
      console.error(err);
      // Ideally show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-4">
      <Card className="w-full max-w-3xl bg-card border-white/10 shadow-2xl relative overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
            <Brain className="w-6 h-6 text-indigo-400" />
          </div>
          <CardTitle className="text-3xl font-serif">Weekly Strategy Review</CardTitle>
          <CardDescription>
            AI-powered analysis of your weekly execution and strategic alignment.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!hasData ? (
            <div className="text-center p-8 bg-secondary/20 rounded-xl border border-white/5 border-dashed">
              <p className="text-muted-foreground">Please set up your Vision Board first.</p>
            </div>
          ) : (
            <>
              {review ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="absolute top-4 right-4 text-xs font-mono text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded bg-indigo-500/5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Generated
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none leading-relaxed text-gray-200 whitespace-pre-wrap font-sans">
                    {review}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-50">
                  <FileText className="w-12 h-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Ready to process your weekly data points. Click the button below to generate your executive summary.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>

        {hasData && (
          <CardFooter className="flex justify-center pb-8">
            <Button
              onClick={getWeeklyReview}
              disabled={loading}
              size="lg"
              className="h-12 px-8 rounded-full font-bold bg-white text-black hover:bg-gray-200 transition-all shadow-xl shadow-white/10"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing Performance...</>
              ) : (
                <><Brain className="w-4 h-4 mr-2" /> Generate Review</>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default WeeklyAIReview;

