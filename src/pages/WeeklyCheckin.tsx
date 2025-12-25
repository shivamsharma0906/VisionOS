import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useVision } from "../context/VisionContext";
import { 
  CheckCircle2, AlertCircle, XCircle, ArrowRight, 
  ChevronLeft, Trophy, Target, ListTodo, MoveRight, 
  MousePointerClick, Lightbulb 
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- SMART SUGGESTIONS ---
const REFLECTION_WINS = [
  "Prioritized this first thing",
  "Blocked distraction-free time",
  "Felt energetic and focused",
  "Broke it down into small steps",
  "Used the 2-minute rule"
];

const REFLECTION_BLOCKERS = [
  "Procrastinated until too late",
  "Got distracted by social media",
  "Unexpected urgent work came up",
  "Felt overwhelmed by the size",
  "Forgot to schedule it"
];

const NEXT_STEP_IDEAS = [
  "Schedule in Calendar for Mon 9AM",
  "Do it for just 5 minutes",
  "Ask a friend for accountability",
  "Prepare materials the night before",
  "Review my 'Why' statement"
];

const WeeklyCheckin = () => {
  const navigate = useNavigate();
  const { data } = useVision();
  
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  
  // Data Collection State
  const [responses, setResponses] = useState<Record<number, 'yes' | 'somewhat' | 'no'>>({});
  const [reflections, setReflections] = useState<Record<number, string>>({});
  const [nextSteps, setNextSteps] = useState<Record<number, string>>({}); 
  
  const [isComplete, setIsComplete] = useState(false);

  const goals = data.finalGoals || [];

  // --- SAFETY CHECK ---
  if (goals.length === 0 && !isComplete) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center flex-col gap-4 p-6">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
           <Target className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-zinc-900">No Objectives Found</h2>
        <p className="text-zinc-500 text-center max-w-md">
          You haven't set any strategic goals for 2026 yet. Go back to the dashboard to set them up.
        </p>
        <Button onClick={() => navigate('/board')} className="bg-zinc-900 text-white">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  const currentGoal = goals[currentGoalIndex];
  const currentResponse = currentGoal ? responses[currentGoal.id] : undefined;
  const currentReflection = currentGoal ? (reflections[currentGoal.id] || "") : "";
  const currentNextStep = currentGoal ? (nextSteps[currentGoal.id] || "") : "";

  // --- HANDLERS ---
  const handleResponse = (response: 'yes' | 'somewhat' | 'no') => {
    if(currentGoal) {
        setResponses(prev => ({ ...prev, [currentGoal.id]: response }));
        // Clear reflection when switching response types to avoid confusion
        setReflections(prev => ({ ...prev, [currentGoal.id]: "" })); 
    }
  };

  const addReflection = (text: string) => {
    if(currentGoal) {
      const existing = reflections[currentGoal.id] || "";
      const newValue = existing ? `${existing} ${text}` : text;
      setReflections(prev => ({ ...prev, [currentGoal.id]: newValue }));
    }
  };

  const setNextStepPreset = (text: string) => {
    if(currentGoal) {
      setNextSteps(prev => ({ ...prev, [currentGoal.id]: text }));
    }
  };

  const handleNext = () => {
    if (currentGoalIndex < goals.length - 1) {
      setCurrentGoalIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  // Select suggestions based on response
  const currentSuggestions = currentResponse === 'no' ? REFLECTION_BLOCKERS : REFLECTION_WINS;

  // --- COMPLETED REPORT ---
  if (isComplete) {
    const yesCount = Object.values(responses).filter(r => r === 'yes').length;
    const totalCount = goals.length;
    const percentage = totalCount > 0 ? Math.round((yesCount / totalCount) * 100) : 0;

    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full animate-in zoom-in duration-500">
          <div className="text-center mb-8">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-zinc-900 shadow-xl shadow-zinc-900/20 mb-6">
               <Trophy className="w-10 h-10 text-green-500" />
             </div>
             <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-2">Weekly Report</h1>
             <p className="text-zinc-500">{percentage >= 80 ? "Outstanding execution." : "Review and recalibrate."}</p>
          </div>
          
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm mb-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
             <div className="relative z-10 text-center">
               <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Performance Score</span>
               <div className="text-7xl font-serif font-bold text-zinc-900 my-4">{percentage}%</div>
               <div className="flex items-center justify-center gap-2 text-sm font-medium">
                  <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> {yesCount} Achieved</span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-zinc-500">{totalCount} Objectives</span>
               </div>
             </div>
          </div>

          <Button onClick={() => navigate("/board")} size="lg" className="w-full h-16 rounded-xl bg-zinc-900 text-white text-lg font-bold hover:bg-zinc-800 shadow-lg">
            Return to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // --- ACTIVE CHECK-IN ---
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col">
      
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between bg-white border-b border-zinc-100">
        <Button variant="ghost" size="sm" onClick={() => navigate('/board')} className="text-zinc-400 hover:text-zinc-900">
           <ChevronLeft className="w-4 h-4 mr-1" /> Exit
        </Button>
        <div className="flex items-center gap-2">
           <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
             Goal {currentGoalIndex + 1} / {goals.length}
           </span>
           <div className="w-20 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-600 transition-all duration-300" 
                   style={{ width: `${((currentGoalIndex) / goals.length) * 100}%` }} />
           </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-2xl mx-auto w-full">
        
        {/* Goal Card */}
        <div className="w-full bg-white border border-zinc-200 p-6 rounded-3xl shadow-sm mb-8">
           <div className="flex items-center gap-2 mb-2">
              <span className="bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                {currentGoal.type || "Objective"}
              </span>
           </div>
           <h2 className="text-2xl font-serif font-bold text-zinc-900 mb-6">
             "{currentGoal.text}"
           </h2>

           {/* Subtask Context */}
           {currentGoal.subTasks && currentGoal.subTasks.length > 0 && (
             <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
               <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                 <ListTodo className="w-3 h-3" /> Planned Tasks
               </div>
               <div className="space-y-2">
                 {currentGoal.subTasks.map((t: { text: string; done: boolean }, i: number) => (
                   <div key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                     <div className={cn("w-2 h-2 rounded-full", t.done ? "bg-green-500" : "bg-zinc-300")} />
                     <span className={t.done ? "line-through opacity-50" : ""}>{t.text}</span>
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>

        {/* 1. STATUS */}
        <h3 className="text-lg font-medium text-zinc-900 mb-6 text-center">Did you make progress this week?</h3>
        
        <div className="grid grid-cols-3 gap-4 w-full mb-8">
          <button onClick={() => handleResponse('yes')} className={cn("h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02]", currentResponse === 'yes' ? "border-green-600 bg-green-50 text-green-700" : "border-zinc-200 bg-white hover:border-green-600")}>
            <CheckCircle2 className="w-6 h-6" /> <span className="font-bold text-sm">Yes</span>
          </button>
          <button onClick={() => handleResponse('somewhat')} className={cn("h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02]", currentResponse === 'somewhat' ? "border-amber-500 bg-amber-50 text-amber-700" : "border-zinc-200 bg-white hover:border-amber-500")}>
            <AlertCircle className="w-6 h-6" /> <span className="font-bold text-sm">Sort of</span>
          </button>
          <button onClick={() => handleResponse('no')} className={cn("h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02]", currentResponse === 'no' ? "border-red-500 bg-red-50 text-red-700" : "border-zinc-200 bg-white hover:border-red-500")}>
            <XCircle className="w-6 h-6" /> <span className="font-bold text-sm">No</span>
          </button>
        </div>

        {/* 2 & 3. REFLECTION & NEXT STEPS (Expandable) */}
        <div className={cn("w-full overflow-hidden transition-all duration-500 ease-out space-y-6", currentResponse ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0")}>
          
          {/* Reflection */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1 mb-2 block">
              {currentResponse === 'no' ? "What blocked you?" : "What worked well?"}
            </label>
            <Textarea
              placeholder="Type or click a suggestion..."
              value={currentReflection}
              onChange={(e) => setReflections(prev => ({ ...prev, [currentGoal.id]: e.target.value }))}
              className="resize-none border-zinc-200 bg-white p-4 rounded-xl min-h-[80px] focus:ring-zinc-900/10 mb-3"
            />
            {/* 🟢 Suggestions Chips */}
            <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-zinc-400 mr-1">
                   <Lightbulb className="w-3 h-3" /> Ideas:
                </span>
                {currentSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => addReflection(suggestion)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-600 hover:border-zinc-900 hover:bg-zinc-50 transition-all active:scale-95"
                  >
                    {suggestion}
                  </button>
                ))}
            </div>
          </div>

          {/* Next Step */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1 mb-2 block">Focus for next week</label>
            <div className="relative mb-3">
              <MoveRight className="absolute left-3 top-3.5 w-4 h-4 text-zinc-400" />
              <Input 
                placeholder="One specific action..."
                value={currentNextStep}
                onChange={(e) => setNextSteps(prev => ({ ...prev, [currentGoal.id]: e.target.value }))}
                className="pl-9 h-12 rounded-xl bg-white border-zinc-200 focus:ring-zinc-900/10"
              />
            </div>
            {/* 🟢 Suggestions Chips */}
            <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-zinc-400 mr-1">
                   <MousePointerClick className="w-3 h-3" /> Select:
                </span>
                {NEXT_STEP_IDEAS.map((idea) => (
                  <button
                    key={idea}
                    onClick={() => setNextStepPreset(idea)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-600 hover:border-zinc-900 hover:bg-zinc-50 transition-all active:scale-95"
                  >
                    {idea}
                  </button>
                ))}
            </div>
          </div>

        </div>

        {/* Next Button */}
        <div className="mt-10 w-full">
          <Button
            onClick={handleNext}
            disabled={!currentResponse}
            size="lg"
            className="w-full h-14 rounded-xl bg-zinc-900 text-white text-base font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 disabled:opacity-0 disabled:translate-y-4"
          >
            {currentGoalIndex < goals.length - 1 ? 'Next Objective' : 'Complete Review'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

      </div>
    </div>
  );
};

export default WeeklyCheckin;