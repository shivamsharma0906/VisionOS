import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useVision } from "../context/VisionContext";
import confetti from "canvas-confetti";
import { 
  CheckCircle2, AlertCircle, XCircle, ArrowRight, 
  ChevronLeft, Trophy, Target, ListTodo, MoveRight, 
  Lightbulb, Sparkles, Activity, Rocket, Zap, Brain, 
  ShieldAlert, Coffee, Flame, TrendingUp, Award
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- CONSTANTS ---
const INSIGHT_TAGS = {
  positive: [
    { label: "Deep Work", icon: Brain },
    { label: "Early Start", icon: Coffee },
    { label: "High Energy", icon: Zap },
    { label: "No Distractions", icon: ShieldAlert },
  ],
  negative: [
    { label: "Social Media", icon: ShieldAlert },
    { label: "Poor Sleep", icon: Coffee },
    { label: "Procrastination", icon: Activity },
    { label: "Overwhelmed", icon: Brain },
  ]
};

const NEXT_STEP_IDEAS = [
  "Schedule blocks in Calendar",
  "Reduce scope by 50%",
  "Find an accountability partner",
  "Prepare environment tonight",
  "Review 'Why' statement"
];

// --- COMPONENTS ---
const StreakBadge = ({ streak }: { streak: number }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full animate-in fade-in slide-in-from-top-4">
    <div className="relative">
        <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
        <div className="absolute inset-0 bg-orange-500/50 blur-lg rounded-full" />
    </div>
    <span className="font-bold text-orange-400 font-mono text-sm">{streak} Day Streak</span>
  </div>
);

const WeeklyCheckin = () => {
  const navigate = useNavigate();
  const { data } = useVision();
  
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  
  // Data State
  const [responses, setResponses] = useState<Record<number, 'yes' | 'somewhat' | 'no'>>({});
  const [reflections, setReflections] = useState<Record<number, string>>({});
  const [nextSteps, setNextSteps] = useState<Record<number, string>>({});
  const [tags, setTags] = useState<Record<number, string[]>>({});
  
  // Gamification State
  const [streak, setStreak] = useState(0); // Mock streak
  const [xpGained, setXpGained] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const goals = data.finalGoals || [];
  const currentGoal = goals[currentGoalIndex];
  const currentResponse = currentGoal ? responses[currentGoal.id] : undefined;
  
  // Handlers
  const handleResponse = (response: 'yes' | 'somewhat' | 'no') => {
    if(currentGoal) {
        setResponses(prev => ({ ...prev, [currentGoal.id]: response }));
        // Add minimal XP for answering
        setXpGained(prev => prev + 15);
    }
  };

  const toggleTag = (tag: string) => {
    if(!currentGoal) return;
    setTags(prev => {
        const currentTags = prev[currentGoal.id] || [];
        if(currentTags.includes(tag)) return { ...prev, [currentGoal.id]: currentTags.filter(t => t !== tag) };
        return { ...prev, [currentGoal.id]: [...currentTags, tag] };
    });
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
      // Complete
      setIsComplete(true);
      setStreak(prev => prev + 1); // Increase streak
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#F97316', '#34D399'] });
    }
  };

  // --- NO GOALS STATE ---
  if (goals.length === 0 && !isComplete) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center flex-col gap-6 p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        <div className="relative z-10 w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-gray-400">
           <Target className="w-10 h-10" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <h2 className="font-serif text-3xl font-bold text-white mb-3">No Objectives Found</h2>
          <Button onClick={() => navigate(-1)} size="lg" className="bg-white text-black hover:bg-gray-200 font-bold rounded-full px-8 mt-4">
            <ChevronLeft className="w-4 h-4 mr-2" /> Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // --- SUMMARY REPORT (END SCREEN) ---
  if (isComplete) {
    const yesCount = Object.values(responses).filter(r => r === 'yes').length;
    const totalCount = goals.length;
    const percentage = totalCount > 0 ? Math.round((yesCount / totalCount) * 100) : 0;

    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-3xl w-full relative z-10">
          <div className="text-center mb-10">
             <StreakBadge streak={streak} />
             <h1 className="font-serif text-5xl font-bold text-white mt-6 mb-2">Protocol Complete</h1>
             <p className="text-gray-400">You've gained <span className="text-yellow-400 font-bold">+{xpGained} XP</span> for your consistency.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
             {/* Score Card */}
             <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Execution</span>
                <div className="text-6xl font-serif font-bold text-white mb-2">{percentage}%</div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
                   <TrendingUp className="w-3 h-3" /> Top Tier
                </div>
             </div>

             {/* Breakdown */}
             <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col gap-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Summary</span>
                <div className="space-y-3 overflow-y-auto max-h-[160px] custom-scrollbar pr-2">
                   {goals.map((g) => (
                      <div key={g.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-white/5">
                         <span className="text-gray-300 truncate flex-1 mr-4">{g.text}</span>
                         {responses[g.id] === 'yes' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                         {responses[g.id] === 'somewhat' && <Activity className="w-4 h-4 text-amber-500" />}
                         {responses[g.id] === 'no' && <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <Button onClick={() => navigate(-1)} className="w-full h-14 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all">
            <ChevronLeft className="w-5 h-5 mr-2" /> Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // --- MAIN CHECK-IN INTERFACE (SPLIT VIEW) ---
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden selection:bg-emerald-500/30">
      
      {/* Background FX */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 px-6 py-6 flex items-center justify-between bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-gray-400 hover:text-white hover:bg-white/5 rounded-full px-4">
           <ChevronLeft className="w-4 h-4 mr-1" /> Exit
        </Button>
        <StreakBadge streak={streak} />
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5">
           <Activity className="w-3 h-3 text-emerald-400" />
           <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
             {currentGoalIndex + 1} / {goals.length}
           </span>
        </div>
      </header>

      {/* Split Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 max-w-7xl mx-auto w-full relative z-10">
        
        {/* LEFT COLUMN: THE MISSION (Goal Context) */}
        <div className="flex flex-col justify-center h-full">
           <div className="relative p-8 rounded-[2.5rem] bg-white/5 border border-white/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {currentGoal.type || "Strategic"}
                    </span>
                    <Sparkles className="w-4 h-4 text-gray-600" />
                </div>
                
                <h2 className="text-3xl lg:text-5xl font-serif font-medium text-white mb-8 leading-tight">
                  {currentGoal.text}
                </h2>

                {currentGoal.subTasks && currentGoal.subTasks.length > 0 && (
                  <div className="space-y-4">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <ListTodo className="w-3 h-3" /> Milestones
                    </div>
                    <div className="grid gap-3">
                      {currentGoal.subTasks.map((t: { text: string; done: boolean }, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
                          <div className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                            t.done ? "bg-emerald-500 border-emerald-500" : "border-gray-600"
                          )}>
                              {t.done && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                          </div>
                          <span className={cn("text-sm text-gray-300", t.done ? "line-through text-gray-600" : "")}>
                            {t.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: THE DEBRIEF (Inputs) */}
        <div className="flex flex-col justify-center h-full space-y-6">
           
           {/* Question */}
           <div>
             <h3 className="text-2xl font-bold text-gray-200 mb-2">Weekly Execution Status</h3>
             <p className="text-gray-500 text-sm">Did you make measurable progress on this objective?</p>
           </div>
        
           {/* Response Buttons */}
           <div className="grid grid-cols-3 gap-4">
             {[
               { id: 'yes', icon: Rocket, label: 'Crushed It', color: 'emerald' },
               { id: 'somewhat', icon: Activity, label: 'Progress', color: 'amber' },
               { id: 'no', icon: XCircle, label: 'Missed', color: 'red' }
             ].map((opt) => (
               <button 
                 key={opt.id}
                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
                 onClick={() => handleResponse(opt.id as any)} 
                 className={cn(
                   "h-28 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group",
                   currentResponse === opt.id
                     ? `border-${opt.color}-500 bg-${opt.color}-500/10 text-${opt.color}-400 shadow-[0_0_20px_rgba(0,0,0,0.3)]` 
                     : "border-white/10 bg-white/5 text-gray-500 hover:bg-white/10 hover:border-white/20 hover:text-white"
                 )}
               >
                 <opt.icon className={cn("w-7 h-7 transition-transform duration-500", currentResponse === opt.id && "scale-110")} /> 
                 <span className="font-bold text-xs uppercase tracking-wide">{opt.label}</span>
               </button>
             ))}
           </div>

           {/* Deep Dive (Conditional) */}
           {currentResponse && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
               
               {/* Quick Tags */}
               <div className="flex flex-wrap gap-2">
                  {(currentResponse === 'no' ? INSIGHT_TAGS.negative : INSIGHT_TAGS.positive).map((tag) => {
                     const isSelected = (tags[currentGoal.id] || []).includes(tag.label);
                     return (
                        <button
                           key={tag.label}
                           onClick={() => toggleTag(tag.label)}
                           className={cn(
                              "px-3 py-2 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-2 uppercase tracking-wide",
                              isSelected 
                                ? "bg-white text-black border-white" 
                                : "bg-transparent text-gray-500 border-white/10 hover:border-white/30 hover:text-white"
                           )}
                        >
                           <tag.icon className="w-3 h-3" /> {tag.label}
                        </button>
                     )
                  })}
               </div>

               {/* Reflection & Plan */}
               <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-1">
                  <Textarea
                     placeholder={currentResponse === 'no' ? "What specific obstacle stopped you?" : "What was the key leverage point?"}
                     value={reflections[currentGoal.id] || ""}
                     onChange={(e) => setReflections(prev => ({ ...prev, [currentGoal.id]: e.target.value }))}
                     className="w-full bg-transparent border-none text-white placeholder:text-gray-700 resize-none focus:ring-0 min-h-[100px] p-4 text-base"
                  />
                  <div className="border-t border-white/5 p-2">
                     <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl">
                        <MoveRight className="w-4 h-4 text-emerald-500" />
                        <Input 
                           placeholder="Protocol for next week..."
                           value={nextSteps[currentGoal.id] || ""}
                           onChange={(e) => setNextSteps(prev => ({ ...prev, [currentGoal.id]: e.target.value }))}
                           className="border-none bg-transparent h-auto p-0 text-sm focus-visible:ring-0 placeholder:text-gray-600"
                        />
                     </div>
                     <div className="flex gap-2 mt-2 px-1 pb-1">
                        {NEXT_STEP_IDEAS.slice(0, 3).map((idea) => (
                           <button key={idea} onClick={() => setNextStepPreset(idea)} className="text-[9px] text-gray-600 hover:text-indigo-400 transition-colors border border-white/5 rounded px-2 py-1">
                              {idea}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Continue Button */}
               <Button
                 onClick={handleNext}
                 className="w-full h-16 rounded-2xl text-lg font-bold transition-all shadow-2xl bg-white text-black hover:bg-gray-200"
               >
                 {currentGoalIndex < goals.length - 1 ? 'Next Objective' : 'Complete Review'}
                 <ArrowRight className="w-5 h-5 ml-2" />
               </Button>

             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default WeeklyCheckin;