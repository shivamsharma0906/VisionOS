import React, { useState, useEffect } from "react";
import { 
  ArrowRight, Sparkles, Briefcase, DollarSign, Heart, 
  Brain, Compass, Users, Plus, X, Zap, Ban, 
  Target, Crown, TrendingUp, Anchor, Activity, MousePointerClick, 
  Lightbulb, CheckCircle2
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
    icon: <Target className="w-5 h-5 text-green-600" />, 
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
    icon: <DollarSign className="w-5 h-5 text-green-600" />, 
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
    icon: <Zap className="w-5 h-5 text-green-600" />, 
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
    icon: <Ban className="w-5 h-5 text-red-600" />, 
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
      alert('🎉 Blueprint Generated! Your 2026 vision is locked in.');
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
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-green-600 selection:text-white pb-32">
      
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`, 
          backgroundSize: '40px 40px' 
        }} />
      </div>

      {/* Progress Bar - Black & Green */}
      <div className="fixed top-0 left-0 h-1.5 bg-green-600 z-[60] transition-all duration-300" 
           style={{ width: `${scrollProgress * 100}%` }} />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b-2 border-zinc-900">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-lg">
               <span className="font-serif font-bold text-xl">V</span>
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight text-zinc-900">VISIONARY</span>
              <span className="block text-[10px] text-zinc-600 font-semibold">Strategic Blueprint 2026</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border-2 border-zinc-900">
              <div className={`w-2.5 h-2.5 rounded-full ${completionScore === 100 ? 'bg-green-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-sm font-bold text-white">{completionScore}%</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 max-w-4xl pt-16 relative z-10">
        
        {/* Hero Section */}
        <div className="mb-24 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider mb-8 shadow-xl">
            <Sparkles className="w-4 h-4 text-green-500" /> 
            <span>Your Future Starts Here</span>
          </div>
          
          <h1 className="font-serif text-6xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
            Design Your
            <span className="block mt-2 text-green-600">
              Legendary 2026
            </span>
          </h1>
          
          <p className="text-xl text-zinc-700 max-w-2xl mx-auto leading-relaxed font-medium mb-4">
            Four powerful questions. One transformative vision.
          </p>
          <p className="text-base text-zinc-500 font-medium">
            Join 10,000+ people who've already built their blueprint
          </p>
        </div>

        {/* --- STEP 1: IDENTITY --- */}
        <section className="mb-24">
           <div className="text-center mb-10">
             <h2 className="font-serif text-4xl font-bold mb-4 text-zinc-900">
               Choose Your Operator Mode
             </h2>
             <p className="text-zinc-600 text-lg font-medium">What defines your primary focus this year?</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LIFE_STAGES.map((stage) => (
              <div 
                key={stage.id}
                onClick={() => setLifeStage(stage.id)}
                className={`cursor-pointer relative p-8 rounded-2xl border-2 transition-all duration-300 group ${
                  lifeStage === stage.id 
                    ? "border-green-600 bg-green-600 text-white shadow-2xl scale-105" 
                    : "border-zinc-900 bg-white hover:border-green-600 hover:shadow-xl hover:scale-[1.02]"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl transition-all ${
                    lifeStage === stage.id ? "bg-white/20" : "bg-zinc-100 group-hover:bg-green-50"
                  }`}>
                    {stage.icon}
                  </div>
                  {lifeStage === stage.id && (
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3 text-zinc-900" style={lifeStage === stage.id ? {color: 'white'} : {}}>
                  {stage.label}
                </h3>
                <p className={`text-sm leading-relaxed font-medium ${lifeStage === stage.id ? "text-white/90" : "text-zinc-600"}`}>
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --- STEP 2: FOCUS --- */}
        <section className="mb-24">
           <div className="text-center mb-10">
             <h2 className="font-serif text-4xl font-bold mb-4 text-zinc-900">
               Select Focus Areas
             </h2>
             <p className="text-zinc-600 text-lg font-medium mb-3">Choose up to 3 domains for maximum impact</p>
             <div className="text-base font-bold text-zinc-900">
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
                  className={`h-16 px-8 rounded-xl border-2 flex items-center gap-3 font-bold text-base transition-all duration-300 ${
                    isActive 
                      ? "bg-green-600 border-green-600 text-white shadow-xl scale-110" 
                      : isDisabled
                      ? "bg-zinc-100 border-zinc-300 text-zinc-400 cursor-not-allowed"
                      : "bg-white border-zinc-900 text-zinc-900 hover:border-green-600 hover:bg-green-50 hover:scale-105"
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
             <h2 className="font-serif text-4xl font-bold mb-4 text-zinc-900">
               Define Your Vital Metrics
             </h2>
             <p className="text-zinc-600 text-lg font-medium">Click presets or write your own • Answer at least 3</p>
           </div>

          <div className="space-y-8">
            {VITAL_QUESTIONS.map((q, idx) => (
               <div key={q.id} className="group bg-white border-2 border-zinc-900 rounded-2xl overflow-hidden hover:border-green-600 hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col md:flex-row">
                    {/* Icon Section */}
                    <div className="hidden md:flex w-24 items-center justify-center bg-zinc-900 border-r-2 border-zinc-900">
                      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center">
                        {q.icon}
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="flex-1 p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">METRIC {idx + 1}</span>
                          </div>
                          <label className="text-2xl font-bold text-zinc-900 block mb-2">
                            {q.label}
                          </label>
                          <p className="text-sm text-zinc-600 font-medium">{q.sub}</p>
                        </div>
                        {answers[q.id] && (
                          <CheckCircle2 className="w-7 h-7 text-green-600" />
                        )}
                      </div>
                      
                      <input 
                        type="text"
                        placeholder={q.placeholder}
                        value={answers[q.id] || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-full h-14 px-5 border-2 border-zinc-900 text-lg font-semibold text-zinc-900 placeholder:text-zinc-400 bg-white focus:border-green-600 focus:ring-2 focus:ring-green-600/20 rounded-xl transition-all outline-none"
                      />
                      
                      {/* Presets */}
                      <div className="mt-6 pt-6 border-t-2 border-zinc-100">
                        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-zinc-600">
                          <MousePointerClick className="w-4 h-4" /> Quick Select
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {q.presets.map((preset) => (
                            <button
                              key={preset}
                              onClick={() => handleAnswerChange(q.id, preset)}
                              className="px-5 py-3 rounded-xl bg-zinc-100 border-2 border-zinc-900 text-sm font-bold text-zinc-900 hover:bg-green-600 hover:border-green-600 hover:text-white hover:scale-105 transition-all active:scale-95"
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
        <section className="mb-28">
           <div className="bg-zinc-50 rounded-2xl p-10 border-2 border-zinc-900">
             <div className="flex items-center justify-between mb-8">
               <div>
                 <h3 className="font-serif text-3xl font-bold text-zinc-900 mb-2">Your Strategic Goals</h3>
                 <p className="text-zinc-600 font-medium">Add 1-5 concrete objectives for 2026</p>
               </div>
               <button 
                 onClick={addGoalField} 
                 disabled={goals.length >= 5}
                 className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center hover:bg-green-600 hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
               >
                 <Plus className="w-6 h-6" />
               </button>
             </div>
             
             {/* Goal Inputs */}
             <div className="space-y-4 mb-8">
              {goals.map((goal, index) => (
                <div key={goal.id} className="flex gap-4 items-center group">
                   <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-lg">
                     {index + 1}
                   </div>
                   <input 
                     type="text"
                     placeholder="Define a clear, measurable objective..."
                     value={goal.text}
                     onChange={(e) => updateGoal(goal.id, e.target.value)}
                     className="flex-1 h-14 px-5 bg-white border-2 border-zinc-900 text-base font-semibold text-zinc-900 placeholder:text-zinc-400 rounded-xl focus:border-green-600 focus:ring-2 focus:ring-green-600/20 transition-all outline-none"
                   />
                   {goals.length > 1 && (
                     <button 
                       onClick={() => removeGoal(goal.id)} 
                       className="w-10 h-10 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50 border-2 border-transparent hover:border-red-600 transition-all"
                     >
                       <X className="w-5 h-5 mx-auto" />
                     </button>
                   )}
                </div>
              ))}
             </div>

             {/* Goal Suggestions */}
             <div className="border-t-2 border-zinc-200 pt-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-base font-bold text-zinc-900">Popular Goals</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {OBJECTIVE_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => addPresetGoal(suggestion)}
                      className="px-5 py-3 rounded-xl border-2 border-zinc-900 bg-white text-sm font-bold text-zinc-900 hover:border-green-600 hover:bg-green-600 hover:text-white hover:scale-105 transition-all active:scale-95"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
             </div>
           </div>
        </section>

      </main>

      {/* FLOATING CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t-2 border-zinc-900 shadow-2xl">
        <div className="container mx-auto px-6 py-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="hidden md:block">
              <div className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Blueprint Status</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {[
                    lifeStage,
                    selectedAreas.length > 0,
                    Object.keys(answers).length >= 3,
                    goals.filter(g => g.text.trim()).length >= 1
                  ].map((completed, idx) => (
                    <div key={idx} className={`h-2 rounded-full transition-all ${
                      completed ? 'bg-green-600 w-12' : 'bg-zinc-300 w-12'
                    }`} />
                  ))}
                </div>
                <span className="text-xl font-bold text-zinc-900">{completionScore}%</span>
              </div>
            </div>
            
            <button 
              onClick={handleSubmit} 
              disabled={!isValid || isSubmitting} 
              className={`group flex items-center gap-4 px-10 h-16 rounded-xl text-lg font-bold transition-all ${
                isValid && !isSubmitting
                  ? "bg-green-600 text-white hover:bg-green-700 hover:scale-105 shadow-xl shadow-green-600/30"
                  : "bg-zinc-300 text-zinc-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-6 h-6 animate-spin" /> 
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Generate Blueprint</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
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