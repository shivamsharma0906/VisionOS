import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useVision } from "../context/VisionContext"; 
import { ArrowLeft, ArrowRight, Target, Sparkles } from "lucide-react";

const SmartQuestions = () => {
  const navigate = useNavigate();
  // 🟢 FIX 1: Get data and updater from Context
  const { data, updateData } = useVision();
  const [inputs, setInputs] = useState<Record<string, string>>({});

  // 🟢 FIX 2: Safety Check - If no areas selected, go back to Step 2
  useEffect(() => {
    if (!data.areas || data.areas.length === 0) {
      navigate("/wizard/step2");
    }
  }, [data.areas, navigate]);

  const handleInputChange = (area: string, value: string) => {
    setInputs((prev) => ({ ...prev, [area]: value }));
  };

  const handleNext = () => {
    // 🟢 FIX 3: Convert answers into the 'Goal' format required by our Context
    const generatedGoals = data.areas.map((area, index) => ({
      id: Date.now() + index, // Generate a unique ID
      text: inputs[area] || `${area} Goal`, // Use user input or default
      type: "Realistic", // Default type
      subTasks: [] // Empty subtasks to start
    }));

    // Save to global context
    updateData('finalGoals', generatedGoals);
    
    // Navigate to Step 4
    navigate("/wizard/step4");
  };

  const handleBack = () => {
    navigate("/wizard/step2");
  };

  // Calculate progress (Step 3 of 5 = 60%)
  const progress = 60;

  return (
    <div className="min-h-screen bg-background px-6 py-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
             <span>Step 3 of 5</span>
             <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center gap-2 mb-2 text-primary">
            <Target className="w-5 h-5" />
            <span className="font-medium">Define your targets</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">
            What does success look like?
          </h1>
          <p className="text-lg text-muted-foreground">
            Set one main goal for each area you selected.
          </p>
        </div>

        {/* Dynamic Inputs based on Step 2 Choices */}
        <div className="space-y-6 mb-12">
          {data.areas.map((area) => (
            <div key={area} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <label className="block text-sm font-medium mb-2 text-foreground">
                For your <span className="text-primary font-semibold">{area}</span>:
              </label>
              <div className="relative">
                <Input 
                  placeholder={`e.g., Launch my MVP, Run a 5k...`}
                  value={inputs[area] || ""}
                  onChange={(e) => handleInputChange(area, e.target.value)}
                  className="h-14 pl-4 pr-10 text-lg rounded-xl border-2 focus-visible:ring-0 focus-visible:border-primary transition-all"
                />
                <Sparkles className="absolute right-4 top-4 w-5 h-5 text-muted-foreground/50 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-auto">
          <Button variant="ghost" onClick={handleBack} className="gap-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            // Disable if they haven't typed anything for at least one area
            disabled={Object.keys(inputs).length === 0}
            className="gap-2 px-8"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SmartQuestions;