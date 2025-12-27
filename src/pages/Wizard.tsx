import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Sparkles, Briefcase, DollarSign, Heart,
  Brain, Compass, Users, Plus, X, Ban,
  Target, Crown, TrendingUp, Anchor, Activity, MousePointerClick,
  Lightbulb, CheckCircle2, Zap, Rocket
} from "lucide-react";

// --- CONSTANTS ---
const LIFE_STAGES = [
  { id: 'Builder', label: 'The Builder', icon: <Anchor className="w-6 h-6" />, desc: 'Laying foundations. Focused on stability & systems.' },
  { id: 'Scaler', label: 'The Scaler', icon: <TrendingUp className="w-6 h-6" />, desc: 'Growing rapidly. Focused on leverage & speed.' },
  { id: 'Leader', label: 'The Leader', icon: <Crown className="w-6 h-6" />, desc: 'Guiding others. Focused on vision & culture.' },
  { id: 'Monk', label: 'The Monk', icon: <Activity className="w-6 h-6" />, desc: 'Deep focus. Prioritizing peace & mastery.' },
];

const AREAS = [
  { id: 'Career', icon: <Briefcase className="w-5 h-5" /> },
  { id: 'Wealth', icon: <DollarSign className="w-5 h-5" /> },
  { id: 'Vitality', icon: <Heart className="w-5 h-5" /> },
  { id: 'Mastery', icon: <Brain className="w-5 h-5" /> },
  { id: 'Adventure', icon: <Compass className="w-5 h-5" /> },
  { id: 'Family', icon: <Users className="w-5 h-5" /> },
];

const VITAL_QUESTIONS = [
  {
    id: 'big_goal',
    label: 'The North Star',
    sub: 'One major outcome that makes everything else easier.',
    icon: <Target className="w-5 h-5 text-indigo-400" />,
    placeholder: 'e.g. Build a ₹10 Cr Business',
    presets: [
      "Build a ₹1 Cr/Year Business",
      "Buy a Home for Parents",
      "Clear UPSC / CAT Exam",
      "Retire by Age 40",
      "Travel to 10 Countries"
    ]
  },
  {
    id: 'monthly_income',
    label: 'Financial Fuel',
    sub: 'The monthly net income required to fund your ideal lifestyle.',
    icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
    placeholder: 'e.g. ₹1.5 Lakh/Month',
    presets: [
      "₹50,000 (Starter)",
      "₹1 Lakh/Month (Freedom)",
      "₹3 Lakhs/Month (Comfort)",
      "₹10 Lakhs/Month (Wealth)"
    ]
  },
  {
    id: 'good_habit',
    label: 'The Non-Negotiable',
    sub: 'The one daily protocol that guarantees your success.',
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    placeholder: 'e.g. 1 hour of Yoga/Gym',
    presets: [
      "Wake up at 5 AM",
      "Daily Gym/Yoga",
      "Read 10 Pages",
      "Invest 20% of Salary",
      "4 Hours Deep Work"
    ]
  },
  {
    id: 'bad_habit',
    label: 'The Anchor',
    sub: 'The single biggest distraction holding you back right now.',
    icon: <Ban className="w-5 h-5 text-red-400" />,
    placeholder: 'e.g. Scrolling Instagram Reels',
    presets: [
      "Doomscrolling Reels/Shorts",
      "Ordering Food Daily",
      "Procrastination",
      "Oversleeping",
      "Sugar Addiction"
    ]
  },
];

const OBJECTIVE_SUGGESTIONS = [
  "Build Emergency Fund (₹5L)",
  "Launch Side Hustle",
  "Get Promoted",
  "Run Half Marathon",
  "Read 24 Books",
  "Take Parents on Trip",
  "Start YouTube Channel",
  "Pay off Loan",
  "Learn New Language",
  "Meditate 100 Days"
];

const Wizard = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // --- FORM STATE ---
  const [lifeStage, setLifeStage] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [goals, setGoals] = useState([{ id: 1, text: "" }]);
  const [answers, setAnswers] = useState({});

  // --- HANDLERS ---
  const handleScroll = () => {
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    setScrollProgress(Number(totalScroll / windowHeight));
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnswerChange = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }));
  const toggleArea = (id) => {
    if (selectedAreas.includes(id)) {
      setSelectedAreas(prev => prev.filter(a => a !== id));
    } else if (selectedAreas.length < 3) {
      setSelectedAreas(prev => [...prev, id]);
    }
  };

  const addGoalField = () => {
    if (goals.length < 5) setGoals([...goals, { id: Date.now(), text: "" }]);
  };
  const updateGoal = (id, text) => setGoals(goals.map(g => g.id === id ? { ...g, text } : g));
  const removeGoal = (id) => { if (goals.length > 1) setGoals(goals.filter(g => g.id !== id)); };

  const addPresetGoal = (text) => {
    const emptyGoal = goals.find(g => g.text.trim() === "");
    if (emptyGoal) {
      updateGoal(emptyGoal.id, text);
    } else if (goals.length < 5) {
      setGoals([...goals, { id: Date.now(), text }]);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const visionData = {
      lifeStage,
      areas: selectedAreas,
      answers,
      goals: goals.filter(g => g.text.trim() !== ""),
      createdAt: new Date().toISOString()
    };
    
    console.log('Vision Data:', visionData);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/vision-board");
    }, 1500);
  };

  // Calculate completion
  const getCompletionPercentage = () => {
    let score = 0;
    if (lifeStage) score += 25;
    if (selectedAreas.length > 0) score += 25;
    if (Object.keys(answers).length >= 3) score += 25;
    if (goals.filter(g => g.text.trim()).length >= 1) score += 25;
    return score;
  };

  const isValid = lifeStage && selectedAreas.length > 0 && goals[0].text.length > 0 && Object.keys(answers).length >= 3;
  const completionScore = getCompletionPercentage();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 pb-32 relative">

      {/* --- BACKGROUND FX --- */}
      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
      {/* Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Progress Bar - Gradient */}
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-[60] transition-all duration-300 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
        style={{ width: `${scrollProgress * 100}%` }} />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight text-white">VisionOS</span>
              <span className="block text-[10px] text-slate-400 font-medium">Strategic Blueprint 2026</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/10">
              <div className={`w-2 h-2 rounded-full ${completionScore === 100 ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-500'}`} />
              <span className="text-xs font-medium text-slate-300">{completionScore}% Ready</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 max-w-4xl pt-16 relative z-10">

        {/* Hero Section */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium uppercase tracking-wider mb-6 shadow-sm">
            <Rocket className="w-3 h-3" />
            <span>Setup Wizard</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            Design Your
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Legendary 2026
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Four powerful questions. One transformative vision. <br />
            Let's build your blueprint for the year ahead.
          </p>
        </div>

        {/* --- STEP 1: IDENTITY --- */}
        <section className="mb-24">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold mb-3 text-white">
              Choose Your Operator Mode
            </h2>
            <p className="text-slate-400 text-base">What defines your primary focus this year?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {LIFE_STAGES.map((stage) => (
              <div
                key={stage.id}
                onClick={() => setLifeStage(stage.id)}
                className={`cursor-pointer relative p-6 rounded-2xl border transition-all duration-300 group ${lifeStage === stage.id
                    ? "border-indigo-500 bg-indigo-600/10 shadow-[0_0_30px_rgba(99,102,241,0.15)]"
                    : "border-white/10 bg-white/5 hover:border-indigo-500/50 hover:bg-white/10"
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl transition-all ${lifeStage === stage.id ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400 group-hover:text-indigo-400"
                    }`}>
                    {stage.icon}
                  </div>
                  {lifeStage === stage.id && (
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <h3 className={`font-serif text-xl font-bold mb-2 ${lifeStage === stage.id ? "text-white" : "text-slate-200"}`}>
                  {stage.label}
                </h3>
                <p className={`text-sm leading-relaxed ${lifeStage === stage.id ? "text-indigo-200" : "text-slate-500"}`}>
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --- STEP 2: FOCUS --- */}
        <section className="mb-24">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold mb-3 text-white">
              Select Focus Areas
            </h2>
            <p className="text-slate-400 text-base mb-4">Choose up to 3 domains for maximum impact</p>
            <div className={`inline-block px-3 py-1 rounded-md text-sm font-bold ${selectedAreas.length === 3 ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
              {selectedAreas.length}/3 selected
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {AREAS.map((area) => {
              const isActive = selectedAreas.includes(area.id);
              const isDisabled = !isActive && selectedAreas.length >= 3;
              return (
                <button
                  key={area.id}
                  onClick={() => toggleArea(area.id)}
                  disabled={isDisabled}
                  className={`h-14 px-6 rounded-xl border flex items-center gap-3 font-medium text-sm transition-all duration-300 ${isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 border-transparent text-white shadow-lg shadow-indigo-500/20 scale-105"
                      : isDisabled
                        ? "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-50"
                        : "bg-slate-900/50 border-white/10 text-slate-300 hover:border-indigo-400 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  {area.icon}
                  {area.id}
                </button>
              )
            })}
          </div>
        </section>

        {/* --- STEP 3: VITAL QUESTIONS --- */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold mb-3 text-white">
              Define Your Vital Metrics
            </h2>
            <p className="text-slate-400 text-base">Click presets or write your own • Answer at least 3</p>
          </div>

          <div className="space-y-6">
            {VITAL_QUESTIONS.map((q, idx) => (
              <div key={q.id} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                  {/* Icon Section */}
                  <div className="hidden md:flex w-20 items-center justify-center bg-slate-900/30 border-r border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                      {q.icon}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded">METRIC {idx + 1}</span>
                        </div>
                        <label className="text-xl font-bold text-white block mb-1">
                          {q.label}
                        </label>
                        <p className="text-sm text-slate-400">{q.sub}</p>
                      </div>
                      {answers[q.id] && (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 animate-in zoom-in" />
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder={q.placeholder}
                      value={answers[q.id] || ""}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="w-full h-14 px-5 border border-white/10 text-lg text-white placeholder:text-slate-600 bg-slate-950/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-xl transition-all outline-none"
                    />

                    {/* Presets */}
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <MousePointerClick className="w-3 h-3" /> Quick Select
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {q.presets.map((preset) => (
                          <button
                            key={preset}
                            onClick={() => handleAnswerChange(q.id, preset)}
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-slate-300 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all active:scale-95"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- STEP 4: GOALS --- */}
        <section className="mb-32">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 md:p-10 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 relative z-10">
              <div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">Your Strategic Goals</h3>
                <p className="text-slate-400 text-sm">Add 1-5 concrete objectives for 2026</p>
              </div>
              <button
                onClick={addGoalField}
                disabled={goals.length >= 5}
                className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Goal Inputs */}
            <div className="space-y-4 mb-8 relative z-10">
              {goals.map((goal, index) => (
                <div key={goal.id} className="flex gap-4 items-center group animate-in slide-in-from-bottom-2 fade-in duration-300">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 border border-white/5 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    placeholder="Define a clear, measurable objective..."
                    value={goal.text}
                    onChange={(e) => updateGoal(goal.id, e.target.value)}
                    className="flex-1 h-12 px-4 bg-slate-950/50 border border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none"
                  />
                  {goals.length > 1 && (
                    <button
                      onClick={() => removeGoal(goal.id)}
                      className="w-8 h-8 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <X className="w-4 h-4 mx-auto" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Goal Suggestions */}
            <div className="border-t border-white/10 pt-8 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-bold text-slate-300">Popular Ideas</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {OBJECTIVE_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => addPresetGoal(suggestion)}
                    className="px-3 py-2 rounded-lg border border-dashed border-slate-700 text-xs font-medium text-slate-400 hover:border-indigo-500 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FLOATING CTA (HUD Style) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-t border-white/10">
        <div className="container mx-auto px-6 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="hidden md:block">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Blueprint Status</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {[
                    lifeStage,
                    selectedAreas.length > 0,
                    Object.keys(answers).length >= 3,
                    goals.filter(g => g.text.trim()).length >= 1
                  ].map((completed, idx) => (
                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${completed ? 'bg-indigo-500 w-8 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-slate-800 w-8'
                      }`} />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className={`group flex items-center justify-center gap-3 px-8 h-12 rounded-full text-base font-bold transition-all w-full md:w-auto ${isValid && !isSubmitting
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Generate Blueprint</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Wizard;