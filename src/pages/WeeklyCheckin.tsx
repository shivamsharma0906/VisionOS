import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVision } from "../context/VisionContext";
import confetti from "canvas-confetti";
import {
  ArrowRight, ChevronLeft, Trophy, Target,
  Lightbulb, Activity, Rocket, Zap, Brain,
  Flame, TrendingUp, CheckCircle2, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const WeeklyCheckin = () => {
  const navigate = useNavigate();
  const { data } = useVision();
  const goals = data.finalGoals || [];

  const [step, setStep] = useState(0); // 0 = Intro, 1...N = Goals, N+1 = Summary
  const [responses, setResponses] = useState<Record<number, 'yes' | 'somewhat' | 'no'>>({});
  const [wins, setWins] = useState<Record<number, string>>({});
  const [lessons, setLessons] = useState<Record<number, string>>({});

  const currentGoalIndex = step - 1;
  const currentGoal = goals[currentGoalIndex];

  const handleNext = () => {
    if (step < goals.length) {
      setStep(s => s + 1);
    } else {
      setStep(goals.length + 1); // Summary
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 } });
    }
  };

  const handleResponse = (val: 'yes' | 'somewhat' | 'no') => {
    if (currentGoal) {
      setResponses(p => ({ ...p, [currentGoal.id]: val }));
      // Auto advance if valid, or let them click next
    }
  };

  if (goals.length === 0) return <div className="h-screen flex items-center justify-center text-white">No goals found.</div>;

  // --- 1. INTRO SCREEN ---
  if (step === 0) {
    return (
      <div className="h-screen w-full bg-background text-white flex flex-col items-center justify-center relative overflow-hidden p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black" />
        <div className="relative z-10 text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Activity className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight">Weekly Sync</h1>
          <p className="text-xl text-gray-400 max-w-lg mx-auto">"Protocol 001: Review, Refine, Re-engage. Honesty is the only metric that matters."</p>
          <button onClick={() => setStep(1)} className="group relative px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:bg-gray-200 transition-all flex items-center gap-2 mx-auto">
            Start Review <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // --- 3. SUMMARY SCREEN ---
  if (step > goals.length) {
    const score = Math.round((Object.values(responses).filter(r => r === 'yes').length / goals.length) * 100);
    return (
      <div className="h-screen w-full bg-background text-white p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
          <header className="flex justify-between items-center">
            <h2 className="text-3xl font-serif font-bold">Execution Report</h2>
            <button onClick={() => navigate('/vision-board')} className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Exit Protocol</button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <div className="text-6xl font-serif font-bold mb-2">{score}%</div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-500">Execution Score</div>
            </div>
            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Key Wins</h3>
              <div className="space-y-4">
                {goals.map(g => wins[g.id] && (
                  <div key={g.id} className="flex gap-4 items-start">
                    <div className="w-1 h-full min-h-[2rem] bg-emerald-500/50 rounded-full" />
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 opacity-75">{g.text}</div>
                      <div className="text-lg text-white font-medium">"{wins[g.id]}"</div>
                    </div>
                  </div>
                ))}
                {Object.keys(wins).length === 0 && <span className="text-gray-600 italic">No specific wins recorded.</span>}
              </div>
            </div>
          </div>

          <div className="bg-card border border-white/5 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-500" /> Focus For Next Week</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map(g => (
                <div key={g.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-gray-300 text-sm truncate pr-4">{g.text}</span>
                  {responses[g.id] === 'yes' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Activity className="w-5 h-5 text-amber-500" />}
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => navigate('/vision-board')} className="w-full py-6 bg-white text-black font-bold rounded-2xl text-xl hover:bg-gray-200 transition-colors">Complete & Sync</button>
        </div>
      </div>
    );
  }

  // --- 2. GOAL WIZARD STEPS ---
  return (
    <div className="h-screen w-full bg-background text-white flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/5">
        <div className="h-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: `${(step / goals.length) * 100}%` }} />
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-12 flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-500 key={currentGoal.id}">
        <div className="mb-8">
          <span className="text-[10px] font-mono text-gray-500 border border-white/10 px-2 py-1 rounded-md uppercase tracking-widest">Objective {step} / {goals.length}</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-12">{currentGoal.text}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-4">Did you hit your benchmarks?</label>
              <div className="flex gap-4">
                {[
                  { id: 'yes', label: 'Yes', icon: Rocket, activeClass: 'bg-emerald-500 border-emerald-500 text-black' },
                  { id: 'somewhat', label: 'Sorta', icon: Zap, activeClass: 'bg-yellow-500 border-yellow-500 text-black' },
                  { id: 'no', label: 'No', icon: Activity, activeClass: 'bg-red-500 border-red-500 text-black' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onClick={() => handleResponse(opt.id as any)}
                    className={cn(
                      "flex-1 h-20 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-2 transition-all duration-300",
                      responses[currentGoal.id] === opt.id ? opt.activeClass : "bg-white/5 hover:bg-white/10 text-gray-400"
                    )}
                  >
                    <opt.icon className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`space-y-6 transition-opacity duration-500 ${responses[currentGoal.id] ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 focus-within:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-emerald-400"><Trophy className="w-4 h-4" /><span className="text-[10px] font-bold uppercase">Weekly Win</span></div>
              <textarea
                value={wins[currentGoal.id] || ''}
                onChange={e => setWins({ ...wins, [currentGoal.id]: e.target.value })}
                className="w-full bg-transparent border-none text-base text-white placeholder:text-gray-600 resize-none focus:ring-0 p-0"
                placeholder="What's one thing you are proud of?"
                rows={2}
              />
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 focus-within:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-amber-400"><Lightbulb className="w-4 h-4" /><span className="text-[10px] font-bold uppercase">Lesson Learned</span></div>
              <textarea
                value={lessons[currentGoal.id] || ''}
                onChange={e => setLessons({ ...lessons, [currentGoal.id]: e.target.value })}
                className="w-full bg-transparent border-none text-base text-white placeholder:text-gray-600 resize-none focus:ring-0 p-0"
                placeholder="What blocked you? How will you fix it?"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <button onClick={handleNext} disabled={!responses[currentGoal.id]} className="px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            Continue <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCheckin;