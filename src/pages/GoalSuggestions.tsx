import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useVision } from "../context/VisionContext"; 
import { Goal } from "../types/vision"; // Import types for safety
import { ArrowLeft, ArrowRight, Sparkles, Plus, Check } from "lucide-react";

const GoalSuggestions = () => {
  const navigate = useNavigate();
  // 🟢 FIX 1: Get existing data, updater, and the suggestion engine
  const { data, updateData, getSuggestions } = useVision();
  
  // State to track which suggestions the user has clicked
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [suggestions, setSuggestions] = useState<Goal[]>([]);

  // Load suggestions on mount
  useEffect(() => {
    const aiSuggestions = getSuggestions();
    setSuggestions(aiSuggestions);
  }, [getSuggestions]);

  const toggleSuggestion = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    // 🟢 FIX 2: Merge Manual Goals (Step 3) + Selected AI Goals (Step 4)
    const selectedGoals = suggestions.filter(g => selectedIds.includes(g.id));
    
    // We combine the existing goals (data.finalGoals) with the new selected ones
    const combinedGoals = [...(data.finalGoals || []), ...selectedGoals];

    // Save the complete list
    updateData('finalGoals', combinedGoals);
    
    // 🟢 FIX 3: Navigate to the Summary Page
    navigate("/wizard/summary");
  };

  const handleBack = () => {
    navigate("/wizard/step3");
  };

  // Progress = 80% (Step 4 of 5)
  const progress = 80;

  return (
    <div className="min-h-screen bg-background px-6 py-8 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        
        {/* Progress Bar */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
             <span>Step 4 of 5</span>
             <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">
            AI Recommendations
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Based on your focus areas ({data.areas.join(", ")}), here are some high-impact habits and goals you might want to add.
          </p>
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {suggestions.map((goal, index) => {
            const isSelected = selectedIds.includes(goal.id);
            return (
              <div
                key={goal.id}
                onClick={() => toggleSuggestion(goal.id)}
                className={`
                  relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                  flex items-start gap-3 group animate-in fade-in slide-in-from-bottom-8
                  ${isSelected 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'}
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Checkbox Icon */}
                <div className={`
                  mt-1 h-5 w-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors
                  ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'}
                `}>
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />}
                </div>

                <div>
                  <h3 className="font-medium text-foreground">{goal.text}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                      {goal.type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-auto max-w-2xl mx-auto w-full">
          <Button variant="ghost" onClick={handleBack} className="gap-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Button
            onClick={handleFinish}
            className="gap-2 px-8"
          >
            Finalize Vision
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalSuggestions;