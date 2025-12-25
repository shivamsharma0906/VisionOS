import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useVision } from "../context/VisionContext"; // Correct relative path
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const questions = [
  {
    id: "stage",
    title: "What's your current stage in life?",
    subtitle: "This helps us tailor your journey",
    options: [
      { value: "Student", label: "Student", description: "Focused on learning and growth" },
      { value: "Professional", label: "Working Professional", description: "Building my career" },
      { value: "Entrepreneur", label: "Entrepreneur", description: "Running or starting a business" },
      { value: "Creator", label: "Creator", description: "Creating content or art" },
    ],
  },
  {
    id: "planningStyle",
    title: "How do you usually plan your life?",
    subtitle: "Be honest — there's no wrong answer",
    options: [
      { value: "structured", label: "Very structured", description: "I love detailed plans and schedules" },
      { value: "somewhat", label: "Somewhat structured", description: "I plan the big things" },
      { value: "flow", label: "I go with the flow 😅", description: "Plans? What plans?" },
    ],
  },
  {
    id: "struggle",
    title: "What's your biggest struggle right now?",
    subtitle: "We'll help you overcome this",
    options: [
      { value: "focus", label: "Focus", description: "Too many distractions" },
      { value: "consistency", label: "Consistency", description: "Starting strong but fading" },
      { value: "direction", label: "Direction", description: "Not sure what I want" },
      { value: "motivation", label: "Motivation", description: "Hard to get started" },
    ],
  },
  {
    id: "riskAppetite",
    title: "How comfortable are you with taking risks?",
    subtitle: "This shapes your goal recommendations",
    options: [
      { value: "safe", label: "Play it safe", description: "Steady and predictable wins" },
      { value: "balanced", label: "Balanced approach", description: "Calculated risks only" },
      { value: "aggressive", label: "Go big or go home", description: "High risk, high reward" },
    ],
  },
];

const PersonalityDiscovery = () => {
  const navigate = useNavigate();
  // 🟢 FIX 1: Use 'updateData' from our Context
  const { updateData } = useVision();
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = questions[currentQuestionIdx];
  const selectedValue = answers[question.id];

  // Calculate Progress
  const progress = ((currentQuestionIdx + 1) / questions.length) * 100;

  const handleSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // 🟢 FIX 2: Save 'stage' to 'lifeStage' in context
      updateData('lifeStage', answers.stage || 'Individual');
      
      // 🟢 FIX 3: Navigate to the correct Wizard route
      navigate("/wizard/step2");
    }
  };

  const handleBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    } else {
      navigate("/"); // Go back to login/home
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        
        {/* Simple Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
             <span>Step 1 of 5</span>
             <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">
            {question.title}
          </h1>
          <p className="text-lg text-muted-foreground">{question.subtitle}</p>
        </div>

        {/* Options Grid */}
        <div className="grid gap-4 mb-12">
          {question.options.map((option) => {
            const isSelected = selectedValue === option.value;
            return (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200
                  flex items-center justify-between group
                  ${isSelected 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'}
                `}
              >
                <div>
                  <h3 className="font-medium text-lg mb-1">{option.label}</h3>
                  <p className="text-muted-foreground text-sm">{option.description}</p>
                </div>
                
                {/* Check Icon */}
                <div className={`
                  h-6 w-6 rounded-full flex items-center justify-center transition-colors
                  ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-transparent border border-muted-foreground/30'}
                `}>
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-auto">
          <Button variant="ghost" onClick={handleBack} className="gap-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!selectedValue}
            className="gap-2 px-8"
          >
            {currentQuestionIdx < questions.length - 1 ? "Next" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalityDiscovery;