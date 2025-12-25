import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useVision } from "../context/VisionContext";
import { VisionData } from "../types/vision";
import { Sparkles, ArrowRight, Fingerprint, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- HELPER: NEW LOGIC WITH 10 QUESTIONS ---
const generateSummary = (data: VisionData): string => {
  // Safety check
  if (!data || !data.areas) {
    return "In 2026, you are becoming a focused individual who prioritizes growth. With clear goals guiding your path, you are building discipline and creating a life aligned with your deepest values.";
  }

  // 1. Extract Identity
  const stageMap: Record<string, string> = {
    Student: 'Ambitions Learner',
    Professional: 'Driven Leader',
    Entrepreneur: 'Visionary Builder',
    Creator: 'Creative Force',
  };
  const identity = stageMap[data.lifeStage] || data.lifeStage || 'Visionary';

  // 2. Extract Answers (with fallbacks if they skipped some)
  const answers = data.answers || {};
  const income = answers['monthly_income'] || 'financial abundance';
  const wakeUp = answers['wake_up'] || 'early';
  const skill = answers['skill_master'] || 'high-value skills';
  const bigGoal = answers['big_goal'] || 'your biggest dreams';
  const badHabit = answers['bad_habit'] || 'distractions';
  
  // 3. Construct the "Manifesto" Narrative
  // "In 2026, you are evolving into a top-tier [Identity]. By waking up at [Time] and mastering [Skill], you are building the discipline to generate [Income]. You are leaving behind [Bad Habit] to achieve [Big Goal], creating a reality that finally matches your ambition."
  
  return `In 2026, you are evolving into a top-tier ${identity}. By waking up at ${wakeUp} and mastering ${skill}, you are building the discipline to generate ${income}. You are leaving behind ${badHabit} to achieve ${bigGoal}, creating a reality that finally matches your ambition.`;
};

const VisionSummary = () => {
  const navigate = useNavigate();
  const { data, updateData } = useVision();

  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Generate the text ONCE based on data
  const fullSummary = useMemo(() => generateSummary(data), [data]);

  // Save to context if changed
  useEffect(() => {
    if (data.visionStatement !== fullSummary) {
      updateData('visionStatement', fullSummary);
    }
  }, [fullSummary, data.visionStatement, updateData]);

  // Typing Animation
  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let index = 0;
    
    const typeInterval = setInterval(() => {
      if (index < fullSummary.length) {
        setDisplayedText(fullSummary.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 20); // 20ms speed
    
    return () => clearInterval(typeInterval);
  }, [fullSummary]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans selection:bg-primary/20">
      
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-multiply"></div>
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* --- Main Content Card --- */}
      <div className="w-full max-w-4xl relative z-10 animate-in fade-in zoom-in duration-700">
        
        {/* Header Metadata */}
        <div className="flex items-center justify-between text-xs md:text-sm font-mono text-muted-foreground uppercase tracking-widest mb-6 px-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Blueprint Generated</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>2026 Vision</span>
          </div>
        </div>

        {/* The Paper Card */}
        <div className="bg-card border border-border shadow-2xl shadow-primary/5 rounded-[2px] md:rounded-lg p-8 md:p-16 relative overflow-hidden">
          
          {/* Decorative Corner Lines */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-primary/20" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-primary/20" />

          {/* The Manifesto Text */}
          <div className="relative z-10 min-h-[180px] md:min-h-[240px] flex items-center justify-center">
            <h1 className="font-serif text-2xl md:text-4xl md:leading-[1.5] text-center text-foreground font-medium">
              <span className="opacity-40 text-6xl absolute -top-8 -left-4 font-serif">“</span>
              {displayedText}
              {isTyping && <span className="inline-block w-2 h-8 md:h-10 ml-1 bg-accent animate-pulse align-middle" />}
              {!isTyping && <span className="opacity-40 text-6xl align-bottom leading-3 ml-2 font-serif">”</span>}
            </h1>
          </div>

          {/* Signature / Identity Section */}
          <div className={`mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 transition-opacity duration-700 ${isTyping ? 'opacity-0' : 'opacity-100'}`}>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Identity Assigned</p>
                <p className="font-serif text-lg font-medium capitalize text-foreground">
                  {data.lifeStage ? `${data.lifeStage} Architect` : 'Visionary'}
                </p>
              </div>
            </div>

            <div className="h-full hidden md:block w-px bg-border mx-4" />

            {/* Action Button */}
            <Button 
              onClick={() => navigate('/board')}
              size="lg"
              className="w-full md:w-auto font-medium h-14 px-8 text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1"
            >
              Confirm & Enter Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

        </div>

        {/* Bottom Note */}
        <p className={`text-center mt-8 text-muted-foreground text-sm font-mono transition-opacity duration-1000 delay-500 ${isTyping ? 'opacity-0' : 'opacity-100'}`}>
          [ System ready. Your year begins now. ]
        </p>

      </div>
    </div>
  );
};

export default VisionSummary;