import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVision } from "../context/VisionContext";
import {
  Terminal, Layers, Shield, Rocket,
  ChevronRight, X, Sparkles, CheckCircle2,
  Cpu, Activity, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../components/ThemeToggle";

// --- THEME DATA ---
const OPERATOR_CLASSES = [
  { id: 'Architect', label: 'The Architect', icon: Layers, desc: 'Designing systems & foundations', color: 'text-blue-400' },
  { id: 'Hacker', label: 'The Hacker', icon: Terminal, desc: 'Rapid iteration & problem solving', color: 'text-cyan-400' },
  { id: 'Scaler', label: 'The Scaler', icon: Activity, desc: 'Optimizing for growth & leverage', color: 'text-purple-400' },
  { id: 'Admin', label: 'The Admin', icon: Shield, desc: 'Governance & stability control', color: 'text-orange-400' },
];

const PACKAGES = [
  { id: 'Career', label: 'Career & Business', desc: 'Professional Growth' },
  { id: 'Wealth', label: 'Wealth & Finance', desc: 'Financial Freedom' },
  { id: 'Vitality', label: 'Health & Vitality', desc: 'Physical Energy' },
  { id: 'Mastery', label: 'Mind & Mastery', desc: 'Skill Acquisition' },
  { id: 'Family', label: 'Relationships', desc: 'Network & Bonds' },
  { id: 'Adventure', label: 'Experiences', desc: 'Travel & Fun' },
];

// SUGGESTIONS DATA
const INCOME_SUGGESTIONS = ["1,00,000", "3,00,000", "5,00,000", "10,00,000"];
const SAVINGS_SUGGESTIONS = ["50,000", "200,000", "1,00,000", "5,00,000"];
const GOAL_SUGGESTIONS = ["Build a SaaS Product", "Buy a Dream Home", "Run a Marathon", "Read 50 Books"];
const HABIT_SUGGESTIONS = ["05:00 AM Gym", "Read 30 Mins", "Deep Work 4h", "Meditation"];

const ENV_VARS = [
  {
    id: 'big_goal',
    key: 'NORTH_STAR',
    label: 'Primary Objective',
    placeholder: 'e.g. Build a SaaS Empire',
    type: 'string',
    suggestions: GOAL_SUGGESTIONS
  },
  {
    id: 'monthly_income',
    key: 'TARGET_INCOME',
    label: 'Monthly Target (₹)',
    placeholder: 'e.g. 5,00,000',
    type: 'text',
    suggestions: INCOME_SUGGESTIONS
  },
  {
    id: 'current_savings',
    key: 'SAFETY_NET',
    label: 'Current Savings (₹)',
    placeholder: 'e.g. 1,00,000',
    type: 'text',
    suggestions: SAVINGS_SUGGESTIONS
  },
];

const PROTOCOLS = [
  {
    id: 'good_habit',
    key: 'DAILY_PROTOCOL',
    label: 'Keystone Habit',
    placeholder: 'e.g. 05:00 Gym Session',
    comment: 'High priority action',
    suggestions: HABIT_SUGGESTIONS
  },
  {
    id: 'bad_habit',
    key: 'RESTRICTION',
    label: 'Anti-Habit',
    placeholder: 'e.g. Doomscrolling',
    comment: 'Avoid at all costs',
    suggestions: ["No Social Media < 12PM", "No Junk Food", "Limit Screen Time"]
  },
];

const MILESTONE_SUGGESTIONS = [
  "Launch MVP",
  "Get First 10 Customers",
  "Run 5km without stopping",
  "Read 12 books this year",
  "Save ₹1 Lakh",
  "Create a YouTube Channel"
];

const Wizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { saveWithData } = useVision(); // Updated destructuring
  const [step, setStep] = useState(0);
  const [bootSequence, setBootSequence] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // --- FORM STATE ---
  const [operatorClass, setOperatorClass] = useState("");
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [features, setFeatures] = useState([{ id: 1, text: "" }]);
  const [isDeploying, setIsDeploying] = useState(false);

  // --- PARSE URL PARAMS ---
  useEffect(() => {
    const focus = searchParams.get('focus');
    if (focus) {
      // Find matching package
      const pkg = PACKAGES.find(p => p.id.toLowerCase() === focus.toLowerCase());
      if (pkg) {
        setBootSequence(false);
        setStep(2); // Jump to Dependencies
        setDependencies(prev => prev.includes(pkg.id) ? prev : [...prev, pkg.id]);
        addLog(`Focus Mode: ${pkg.label} initialized.`);
      }
    }
  }, [searchParams]);

  // --- BOOT SEQUENCE EFFECT ---
  useEffect(() => {
    if (bootSequence) {
      const sequence = [
        "Initializing VisionOS...",
        "Loading system modules...",
        "Calibrating user preferences...",
        "Ready."
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLogs(prev => [...prev, `> ${sequence[i]}`]);
        i++;
        if (i >= sequence.length) {
          clearInterval(interval);
          setTimeout(() => {
            setBootSequence(false);
            setStep(1);
          }, 800);
        }
      }, 600);
      return () => clearInterval(interval);
    }
  }, [bootSequence]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, step]);

  // --- HANDLERS ---
  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} ${msg}`]);

  const handleNext = () => {
    addLog(`Step ${step} confirmed.`);
    setStep(s => s + 1);
  };

  const toggleDependency = (id: string, label: string) => {
    if (dependencies.includes(id)) {
      setDependencies(prev => prev.filter(d => d !== id));
      addLog(`Removed module: ${label}`);
    } else if (dependencies.length < 3) {
      setDependencies(prev => [...prev, id]);
      addLog(`Added module: ${label}`);
    } else {
      addLog(`Limit reached (Max 3 areas)`);
    }
  };

  const handleEnvChange = (id: string, val: string) => {
    setEnvVars(prev => ({ ...prev, [id]: val }));
  };

  const handleFeatureChange = (id: number, val: string) => {
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, text: val } : f));
  };

  const addFeature = (text: string) => {
    // Only prevent if the LAST feature is empty, to allow filling previous ones
    const lastFeature = features[features.length - 1];
    if (lastFeature && lastFeature.text.trim() === "" && text === "") return;

    if (features.length >= 5) return;
    setFeatures(prev => [...prev, { id: Date.now(), text }]);
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    addLog("Compiling Blueprint...");

    try {
      // 1. Construct Complete Data Object
      const formattedGoals = features
        .filter(g => g.text.trim() !== "")
        .map(g => ({
          id: g.id,
          text: g.text,
          type: "Realistic" as const,
          subTasks: []
        }));

      // Sanitize numeric fields (remove commas) before saving
      const cleanAnswers = { ...envVars };
      ['monthly_income', 'current_savings'].forEach(key => {
        if (cleanAnswers[key]) {
          cleanAnswers[key] = cleanAnswers[key].replace(/,/g, '');
        }
      });

      // 2. Atomic Save (Updates State & Backend synchronously)
      await saveWithData({
        lifeStage: operatorClass,
        areas: dependencies,
        answers: cleanAnswers,
        visionStatement: envVars['big_goal'] || '',
        finalGoals: formattedGoals
      });

      addLog("Configuration Saved.");
      addLog("Setup Complete. Launching Dashboard...");

      // Allow user to see the success message briefly
      setTimeout(() => navigate('/vision-board'), 1500);

    } catch (e) {
      console.error(e);
      addLog("Error: Connection Failed");
      setIsDeploying(false);
    }
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (step) {
      case 1: // CLASS SELECTION
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="font-mono text-cyan-400 mb-4 flex items-center gap-2">
              <span className="text-yellow-400">Step 1:</span> Initialize Identity
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {OPERATOR_CLASSES.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => { setOperatorClass(cls.id); addLog(`Identity selected: ${cls.label}`); }}
                  className={cn(
                    "group relative p-5 rounded-2xl border text-left transition-all duration-300 glass-button",
                    operatorClass === cls.id
                      ? "border-cyan-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] bg-indigo-500/20"
                      : "hover:border-white/20 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn("p-2 rounded-lg bg-white/5", cls.color)}>
                      <cls.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-foreground text-lg">{cls.label}</span>
                    {operatorClass === cls.id && <CheckCircle2 className="w-5 h-5 text-cyan-400 ml-auto" />}
                  </div>
                  <div className="text-sm text-muted-foreground pl-[3.25rem]">
                    {cls.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2: // DEPENDENCIES
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="font-mono text-cyan-400 mb-4 flex items-center gap-2">
              <span className="text-yellow-400">Step 2:</span> Select Focus Areas <span className="text-muted-foreground text-xs ml-2">(Max 3)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PACKAGES.map((pkg) => {
                const isSelected = dependencies.includes(pkg.id);
                return (
                  <button
                    key={pkg.id}
                    onClick={() => toggleDependency(pkg.id, pkg.label)}
                    disabled={!isSelected && dependencies.length >= 3}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border font-medium text-sm transition-all duration-200 glass-button",
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500/50 text-cyan-400 shadow-glow"
                        : "text-muted-foreground hover:border-white/20 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                    )}
                  >
                    <span className="text-base">{pkg.label}</span>
                    <span className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-muted-foreground">{pkg.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3: // ENV VARS
        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="font-mono text-cyan-400 mb-4 flex items-center gap-2">
              <span className="text-yellow-400">Step 3:</span> Configuration & Metrics
            </div>

            {ENV_VARS.map((env) => (
              <div key={env.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2">
                    {env.label}
                    <span className="text-[10px] font-mono text-muted-foreground bg-white/5 px-1.5 rounded">{env.key}</span>
                  </label>
                </div>

                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/50 rounded-l-md group-focus-within:bg-indigo-400 transition-colors" />
                  <input
                    autoFocus={env.id === 'big_goal'}
                    type={env.type}
                    value={envVars[env.id] || ''}
                    onChange={(e) => handleEnvChange(env.id, e.target.value)}
                    placeholder={env.placeholder}
                    className="w-full glass-card border rounded-r-md py-3 px-4 text-foreground focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-muted-foreground"
                  />
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap gap-2">
                  {env.suggestions.map(sugg => (
                    <button
                      key={sugg}
                      onClick={() => handleEnvChange(env.id, sugg)}
                      className="text-[10px] px-2 py-1 rounded glass-button text-muted-foreground transition-colors"
                    >
                      {sugg}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 4: // PROTOCOLS
        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="font-mono text-cyan-400 mb-4 flex items-center gap-2">
              <span className="text-yellow-400">Step 4:</span> Define Protocols
            </div>

            {PROTOCOLS.map((proto) => (
              <div key={proto.id} className="space-y-3 p-5 rounded-2xl glass-card">
                <div className="flex justify-between items-center text-xs font-mono text-muted-foreground mb-1">
                  <span className="text-foreground font-bold uppercase tracking-wider">{proto.label}</span>
                  <span>{proto.comment}</span>
                </div>
                <div className="flex gap-2 text-sm font-mono items-center">
                  <ChevronRight className="w-4 h-4 text-emerald-500" />
                  <input
                    value={envVars[proto.id] || ''}
                    onChange={(e) => handleEnvChange(proto.id, e.target.value)}
                    placeholder={proto.placeholder}
                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground h-8"
                  />
                </div>
                {/* Suggestions */}
                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-white/5">
                  {proto.suggestions.map(sugg => (
                    <button
                      key={sugg}
                      onClick={() => handleEnvChange(proto.id, sugg)}
                      className="text-[10px] px-2 py-1 rounded glass-button text-muted-foreground transition-colors"
                    >
                      + {sugg}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 5: // RELEASE FEATURES
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="font-mono text-cyan-400 mb-4 flex items-center gap-2">
              <span className="text-yellow-400">Step 5:</span> Set Strategic Milestones
            </div>

            <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
              {features.map((feat, idx) => (
                <div key={feat.id} className="flex border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <div className="w-12 bg-white/5 flex items-center justify-center text-xs text-muted-foreground font-mono border-r border-white/5 select-none">{idx + 1}</div>
                  <div className="flex-1 flex items-center px-4">
                    <input
                      value={feat.text}
                      onChange={(e) => handleFeatureChange(feat.id, e.target.value)}
                      placeholder={idx === 0 ? "e.g. Launch Beta Version" : "Add another milestone..."}
                      className="flex-1 bg-transparent py-4 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground font-medium"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addFeature("");
                      }}
                    />
                    {features.length > 1 && (
                      <button onClick={() => setFeatures(features.filter(f => f.id !== feat.id))} className="text-muted-foreground hover:text-red-500 px-3 opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>
                    )}
                  </div>
                </div>
              ))}
              {features.length < 5 && (
                <button onClick={() => addFeature("")} className="w-full py-3 bg-white/5 hover:bg-white/10 text-xs text-cyan-400 font-bold uppercase tracking-wider transition-colors border-t border-white/5">
                  + Add Milestone
                </button>
              )}
            </div>

            {/* Suggestions for Milestones */}
            <div className="space-y-2">
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1">Suggested Milestones</div>
              <div className="flex flex-wrap gap-2">
                {MILESTONE_SUGGESTIONS.map((sugg, i) => (
                  <button
                    key={i}
                    onClick={() => addFeature(sugg)}
                    className="text-[10px] px-3 py-1.5 rounded-full glass-button text-muted-foreground transition-all cursor-pointer"
                  >
                    + {sugg}
                  </button>
                ))}
              </div>
            </div>

          </div>
        );

      default: return null;
    }
  };

  const isStepValid = () => {
    if (step === 1) return operatorClass !== "";
    if (step === 2) return dependencies.length >= 1;
    if (step === 3) return envVars['big_goal'] && envVars['monthly_income'];
    if (step === 4) return envVars['good_habit'];
    if (step === 5) return features.some(f => f.text.trim() !== ""); // At least one goal
    return false;
  };

  // --- UI RENDER ---
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 font-sans selection:bg-indigo-500/30 relative overflow-hidden transition-colors duration-500">

      {/* Background Ambience */}
      <div className="fixed inset-0 grid-lines opacity-[0.03] pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-3xl relative">

        {/* WINDOW FRAME */}
        <div className="glass-card rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5 backdrop-blur-3xl">

          {/* TITLE BAR */}
          <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-5 justify-between select-none">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
            </div>
            <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="tracking-wide">VISION_OS // SETUP</span>
            </div>
            <div className="w-10" />
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="p-8 md:p-10 min-h-[550px] flex flex-col relative">

            {/* Initial Boot Logs */}
            <div className="space-y-1 mb-8 text-xs font-mono text-muted-foreground">
              {logs.map((log, i) => (
                <div key={i} className="opacity-70 animate-in fade-in duration-200">{log}</div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Wizard Step Content */}
            {!bootSequence && step > 0 && (
              <div className="flex-1 flex flex-col">

                {/* Dynamic Content */}
                <div className="flex-1 relative animate-in zoom-in-95 duration-500">
                  {renderContent()}
                </div>

                {/* Navigation Footer */}
                <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground font-medium">
                    SETUP PROGRESS: {Math.round((step / 5) * 100)}%
                  </div>

                  {step < 5 ? (
                    <button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="flex items-center gap-2 bg-cyan-500 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20"
                    >
                      Next Step <ChevronRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <button
                      onClick={handleDeploy}
                      disabled={!isStepValid() || isDeploying}
                      className="flex items-center gap-2 bg-cyan-500 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
                    >
                      {isDeploying ? <Loader2 className="w-3 h-3 animate-spin" /> : <Rocket className="w-3 h-3" />}
                      {isDeploying ? "INITIALIZING..." : "LAUNCH VISION"}
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Wizard;