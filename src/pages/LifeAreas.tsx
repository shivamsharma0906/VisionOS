import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useVision } from "../context/VisionContext"; // Correct Context Import
import { ArrowLeft, ArrowRight, Check, Briefcase, DollarSign, Brain, Heart, Compass, Users } from "lucide-react";

// Define the available areas
const areas = [
  { id: "Career", label: "Career / Studies", desc: "Professional growth and education", icon: Briefcase },
  { id: "Income", label: "Income / Business", desc: "Financial goals and ventures", icon: DollarSign },
  { id: "Skills", label: "Skills", desc: "Learning and mastering abilities", icon: Brain },
  { id: "Health", label: "Health", desc: "Physical and mental wellness", icon: Heart },
  { id: "Lifestyle", label: "Lifestyle", desc: "Daily habits and routines", icon: Compass },
  { id: "Relationships", label: "Relationships", desc: "Connections with others", icon: Users },
];

const LifeAreas = () => {
  const navigate = useNavigate();
  // 🟢 FIX 1: Get 'data' and 'toggleArea' from Context
  const { data, toggleArea } = useVision();

  // Use data.areas from context (persisted selection)
  const selectedCount = data.areas.length;

  const handleNext = () => {
    // 🟢 FIX 2: Navigate to the correct Wizard Step
    if (selectedCount >= 1) {
      navigate("/wizard/step3");
    }
  };

  const handleBack = () => {
    navigate("/wizard/step1");
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        
        {/* Progress Bar (Step 2 of 5) */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
             <span>Step 2 of 5</span>
             <span>40%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: '40%' }} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Choose your focus areas
          </h1>
          <p className="text-lg text-muted-foreground">
            Select at least 1 area you want to focus on this year
          </p>
          <p className={`mt-2 text-sm font-medium ${selectedCount >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            {selectedCount} selected
          </p>
        </div>

        {/* Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-3xl mx-auto">
          {areas.map((area) => {
            const isSelected = data.areas.includes(area.id);
            const Icon = area.icon;
            
            return (
              <div
                key={area.id}
                onClick={() => toggleArea(area.id)} // 🟢 FIX 3: Use Context Toggle
                className={`
                  relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200
                  flex items-start gap-4 group
                  ${isSelected 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'}
                `}
              >
                {/* Icon */}
                <div className={`
                  p-3 rounded-lg transition-colors
                  ${isSelected ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}
                `}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-1">{area.label}</h3>
                  <p className="text-muted-foreground text-sm">{area.desc}</p>
                </div>
                
                {/* Check Circle */}
                {isSelected && (
                  <div className="absolute top-6 right-6 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-auto max-w-2xl mx-auto w-full">
          <Button variant="ghost" onClick={handleBack} className="gap-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={selectedCount === 0}
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

export default LifeAreas;