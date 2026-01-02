import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useVision } from "../context/VisionContext";
import confetti from "canvas-confetti";
import {
  Sparkles, Calendar as CalendarIcon,
  Check, Wallet, Plus, Trash2, X,
  Edit2, Zap, MoreVertical, Flame,
  ChevronLeft, ChevronRight, Quote, Play, Pause, RotateCcw, Maximize2,
  Image as ImageIcon, Brain, Activity, Clock, Trophy, Link as LinkIcon, Target,
  TrendingUp, Anchor, Wind, BarChart3, Save, Ban
} from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";

// --- HELPER FUNCTIONS ---

const parseIncomeString = (incomeStr: string): number => {
  if (!incomeStr) return 0;
  try {
    const cleanStr = incomeStr.toString().toLowerCase();
    const num = parseFloat(cleanStr.replace(/[^0-9.]/g, ''));

    if (isNaN(num)) return 0;

    if (cleanStr.includes('lakh') || cleanStr.includes('lac')) return num * 100000;
    if (cleanStr.includes('cr') || cleanStr.includes('crore')) return num * 10000000;
    if (cleanStr.includes('k')) return num * 1000;

    return num;
  } catch (e) { return 0; }
};

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const getYearProgress = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return Math.round((day / 365) * 100);
};

// --- COMPONENTS ---

const ShimmerButton = ({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) => (
  <button
    onClick={onClick}
    className={`relative inline-flex h-9 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 ${className}`}
  >
    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 py-1 text-xs font-medium text-white backdrop-blur-3xl">
      {children}
    </span>
  </button>
);

// --- TYPES ---
interface SubTask { text: string; done: boolean; }
interface Goal { id: number; text: string; type: string; progress?: number; subTasks: SubTask[]; }
interface DailyTask { id: number; text: string; done: boolean; linkedGoalId?: number | null; }

const VisionBoard = () => {
  const navigate = useNavigate();
  const { data, toggleSubTask } = useVision();

  // --- STATE ---

  // 1. Goals
  const [goals, setGoals] = useState<Goal[]>(() => {
    // Ensure existing goals have a progress field if missing
    const savedGoals = localStorage.getItem("vision_goals");
    if (savedGoals) return JSON.parse(savedGoals);

    // Fallback to data from context
    const initialGoals = (data.finalGoals as Goal[]) || [];
    return initialGoals.map(g => ({ ...g, progress: g.progress ?? 0 }));
  });

  // Persist goals whenever they change
  useEffect(() => {
    localStorage.setItem("vision_goals", JSON.stringify(goals));
  }, [goals]);

  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalText, setNewGoalText] = useState("");
  // Roadmap Edit State
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);
  const [tempProgress, setTempProgress] = useState(0);

  // 2. Daily Rituals
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => {
    const saved = localStorage.getItem("vision_dailies");
    if (saved) return JSON.parse(saved);

    // Hydrate from Wizard Data (Context)
    const wizardHabit = data.answers?.['good_habit'];
    if (wizardHabit) {
      return [{ id: 1, text: wizardHabit, done: false, linkedGoalId: null }];
    }
    return [];
  });

  const [newTaskInput, setNewTaskInput] = useState("");
  const [selectedGoalLink, setSelectedGoalLink] = useState<number | string>("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  // 3. User Data
  const [lifeAge, setLifeAge] = useState(() => {
    const saved = localStorage.getItem('userAge');
    // Hydrate from Context if available and not saved
    if (!saved && data.answers?.['age']) return Number(data.answers['age']);
    if (!saved && (data as any).user?.age) return Number((data as any).user.age);
    return saved ? Number(saved) : 25;
  });
  const [isEditingAge, setIsEditingAge] = useState(false);

  // 4. Finance
  const [finance, setFinance] = useState(() => {
    const saved = localStorage.getItem("vision_finance");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.income !== undefined) return parsed;
    }
    // Hydrate from Wizard Context
    const wizardIncome = data.answers?.['monthly_income'] ? Number(data.answers['monthly_income']) : 0;
    return { income: wizardIncome, expenses: 0, currency: '₹' };
  });
  const [isEditingFinance, setIsEditingFinance] = useState(false);
  const [tempFinance, setTempFinance] = useState(finance);

  // 5. Calendar & Events
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<{ id: number; date: string; title: string; type: string; }[]>([]);
  const [newEvent, setNewEvent] = useState({ title: "", type: "general" });

  // 6. UI & Gamification
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [timer, setTimer] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isDreamVaultOpen, setIsDreamVaultOpen] = useState(false);
  const [heatmapData] = useState(() => Array.from({ length: 30 }, () => Math.floor(Math.random() * 80) + 10));
  const [brainDump, setBrainDump] = useState(() => localStorage.getItem("vision_braindump") || "");
  const [isSaved, setIsSaved] = useState(true);
  const [xp, setXp] = useState(() => Number(localStorage.getItem("vision_xp")) || 1250);
  const [timelineTab, setTimelineTab] = useState<'now' | '1y' | '3y' | '5y'>('now');

  // New: Editing Projection
  const [isEditingProjectionIncome, setIsEditingProjectionIncome] = useState(false);
  const [tempProjectionIncome, setTempProjectionIncome] = useState(finance.income); // Use finance.income directly

  // New: Goal Decomposition State
  const [decomposedGoal, setDecomposedGoal] = useState<{
    goal: Goal;
    monthly: string[];
    weekly: string[];
    daily: string[];
  } | null>(null);

  const handleDecompose = (goal: Goal) => {
    // Simulated AI Decomposition
    setDecomposedGoal({
      goal,
      monthly: ["Define core requirements & scope", "Research market & competitors", "Create MVP Architecture", "Draft marketing launch plan"],
      weekly: ["Set up repository & environment", "Implement core feature A", "Design basic UI/UX mockups", "Run initial user tests"],
      daily: ["Initialize project repo", "Install key dependencies", "Write README.md", "Commit initial boilerplate"]
    });
  };

  // --- USER HANDLERS ---
  const [userName, setUserName] = useState(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return localStorage.getItem("userName") || (data as any).user?.name || "Visionary";
  });

  // --- EFFECTS ---
  useEffect(() => {
    if (data.finalGoals && data.finalGoals.length > 0) {
      setGoals(data.finalGoals as Goal[]);
    }
  }, [data.finalGoals]);

  useEffect(() => { localStorage.setItem("vision_dailies", JSON.stringify(dailyTasks)); }, [dailyTasks]);
  useEffect(() => { localStorage.setItem("vision_finance", JSON.stringify(finance)); }, [finance]);
  useEffect(() => { localStorage.setItem("vision_xp", xp.toString()); }, [xp]);

  // Sync Finance & Habits from Context (Wizard Updates)
  useEffect(() => {
    if (data.answers?.['monthly_income']) {
      const newIncome = Number(data.answers['monthly_income']);
      if (newIncome !== finance.income) {
        setFinance(prev => ({ ...prev, income: newIncome }));
      }
    }
    if (data.answers?.['good_habit']) {
      const habit = data.answers['good_habit'];
      setDailyTasks(prev => {
        if (prev.some(t => t.text === habit)) return prev;
        return [...prev, { id: Date.now(), text: habit, done: false, linkedGoalId: null }];
      });
    }
  }, [data.answers]);

  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem("vision_braindump", brainDump);
      setIsSaved(true);
    }, 1000);
    return () => clearTimeout(handler);
  }, [brainDump]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && isActive) {
      setIsActive(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setXp(p => p + 100);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  // --- LOGIC: MOMENTUM & PROJECTION ---
  const momentum = useMemo(() => {
    const totalRituals = dailyTasks.length;
    const completedRituals = dailyTasks.filter(t => t.done).length;
    const ritualScore = totalRituals ? (completedRituals / totalRituals) * 100 : 0;

    const totalSubtasks = goals.reduce((acc, g) => acc + (g.subTasks?.length || 0), 0);
    const completedSubtasks = goals.reduce((acc, g) => acc + (g.subTasks?.filter(s => s.done).length || 0), 0);
    const goalScore = totalSubtasks ? (completedSubtasks / totalSubtasks) * 100 : 0;

    const xpScore = Math.min(100, (xp / 5000) * 100);

    return Math.round((ritualScore * 0.4) + (goalScore * 0.4) + (xpScore * 0.2));
  }, [dailyTasks, goals, xp]);

  const getProjection = (period: 'now' | '1y' | '3y' | '5y') => {
    let years = 0;
    if (period === '1y') years = 1;
    if (period === '3y') years = 3;
    if (period === '5y') years = 5;

    let status: 'High Growth' | 'Stable' | 'Drifting' = 'Stable';
    let growthRate = 0.05;

    // Adjusted Thresholds
    if (momentum >= 20) { status = 'High Growth'; growthRate = 0.15; }
    else if (momentum < 20) { status = 'Drifting'; growthRate = 0.05; }

    // UPDATED: Calculate Annual Income (Monthly * 12)
    const annualBase = finance.income * 12;
    const projectedIncome = Math.round(annualBase * Math.pow((1 + growthRate), years));

    let careerText = "Establishing foundations.";
    let skillText = "Competent";
    let healthText = "Maintained";
    let narrative = "You are currently building your base.";

    if (status === 'High Growth') {
      if (years === 1) { careerText = "Rapid Acceleration"; skillText = "Specialist"; healthText = "Optimized"; narrative = "Your consistency is creating a compound effect. Opportunities are finding you."; }
      if (years === 3) { careerText = "Market Leader"; skillText = "Expert"; healthText = "Peak Performance"; narrative = "You have separated yourself from the pack. Your systems run on autopilot."; }
      if (years === 5) { careerText = "Industry Icon"; skillText = "Master"; healthText = "Ageless"; narrative = "You are living the vision you wrote down 5 years ago. Total freedom."; }
    } else if (status === 'Stable') {
      if (years >= 1) narrative = "Steady progress. You are moving forward, but there is room to accelerate.";
    } else {
      narrative = "Entropy is setting in. Re-align your daily actions to change this trajectory.";
      healthText = "Declining";
    }

    if (period === 'now') {
      careerText = "Current Role";
      skillText = "Building";
      healthText = "Baseline";
      narrative = "Every action you take today writes the history of your future.";
    }

    return { status, projectedIncome, careerText, skillText, healthText, narrative, growthRate };
  };

  const projection = getProjection(timelineTab);
  const level = Math.floor(xp / 1000);
  const nextLevelXp = (level + 1) * 1000;
  const xpProgress = ((xp % 1000) / 1000) * 100;

  // --- HANDLERS ---

  const handleBrainDumpChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsSaved(false);
    setBrainDump(e.target.value);
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setTimer(25 * 60); };
  const adjustTimer = (minutes: number) => setTimer(prev => Math.max(60, prev + minutes * 60));

  const handleTaskToggle = (goalId: number, taskId: number) => {
    toggleSubTask(goalId, taskId);
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const newSub = [...g.subTasks];
        newSub[taskId] = { ...newSub[taskId], done: !newSub[taskId].done };
        return { ...g, subTasks: newSub };
      }
      return g;
    }));
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 }, colors: ['#A78BFA', '#34D399'] });
    setXp(prev => prev + 50);
  };

  const toggleDailyTask = (id: number) => {
    setDailyTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    const task = dailyTasks.find(t => t.id === id);
    if (task && !task.done) {
      confetti({ particleCount: 15, spread: 30, origin: { y: 0.5 }, colors: ['#ffffff'], scalar: 0.5 });
      setXp(prev => prev + 20);
    }
  };

  const addDailyTask = () => {
    if (newTaskInput.trim()) {
      setDailyTasks([...dailyTasks, { id: Date.now(), text: newTaskInput, done: false, linkedGoalId: selectedGoalLink ? Number(selectedGoalLink) : null }]);
      setNewTaskInput("");
      setSelectedGoalLink("");
      setIsAddingTask(false);
    }
  };

  const deleteDailyTask = (id: number) => setDailyTasks(prev => prev.filter(t => t.id !== id));
  const saveFinance = () => { setFinance(tempFinance); setIsEditingFinance(false); };

  // Save edited monthly base income
  const saveProjectionIncome = () => {
    const newFinance = { ...finance, income: tempProjectionIncome }; // Using 'income' not 'monthlyIncome'
    setFinance(newFinance);
    localStorage.setItem("vision_finance", JSON.stringify(newFinance));
    setIsEditingProjectionIncome(false);
  };

  const getSavingsRate = () => Math.round(((finance.income - finance.expenses) / finance.income) * 100);

  const handleAddGoal = () => {
    if (!newGoalText.trim()) return;
    const newGoalObj: Goal = {
      id: Date.now(),
      text: newGoalText,
      type: "Strategic",
      subTasks: [{ text: "Define Phase 1", done: false }, { text: "First Milestone", done: false }]
    };
    setGoals(prev => [...prev, newGoalObj]);
    setNewGoalText("");
    setIsAddingGoal(false);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
  };

  // --- WIZARD DATA INTEGRATION ---
  const identity = data.lifeStage || "Visionary";
  const focusAreas = data.areas || [];
  const savings = Number(data.answers?.['current_savings']) || 0;
  const antiHabit = data.answers?.['bad_habit'];

  return (
    <>
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {decomposedGoal && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95" onClick={() => setDecomposedGoal(null)}>
          <div className="max-w-4xl w-full glass-card rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-border flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2 text-blue-400 font-mono text-xs uppercase tracking-widest"><Brain className="w-4 h-4" /> System Breakdown</div>
                <h2 className="text-3xl font-serif font-bold text-foreground">{decomposedGoal.goal.text}</h2>
              </div>
              <button onClick={() => setDecomposedGoal(null)} className="p-2 hover:bg-secondary rounded-full transition-colors"><X className="w-6 h-6 text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
              {/* Monthly */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-foreground font-bold"><CalendarIcon className="w-4 h-4 text-cyan-400" /> Monthly Milestones</div>
                <div className="space-y-3">
                  {decomposedGoal.monthly.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-mono">{i + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Weekly */}
              <div className="p-6 space-y-4 bg-secondary/30">
                <div className="flex items-center gap-2 text-foreground font-bold"><Clock className="w-4 h-4 text-blue-400" /> Weekly Sprints</div>
                <div className="space-y-3">
                  {decomposedGoal.weekly.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 text-blue-400 flex items-center justify-center text-xs font-mono">{i + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Daily */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-foreground font-bold"><Flame className="w-4 h-4 text-emerald-400" /> Daily Actions</div>
                <div className="space-y-3">
                  {decomposedGoal.daily.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <div className="mt-0.5"><div className="w-3 h-3 border border-emerald-500/50 rounded-sm"></div></div>
                      <span>{step}</span>
                    </div>
                  ))}
                  <button className="w-full py-2 mt-4 border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 rounded-lg transition-all">Add to Rituals</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Focus Mode Overlay */}
      {isFocusMode && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center animate-in fade-in duration-500">

          <div className="absolute top-6 right-6">
            <button onClick={() => setIsFocusMode(false)} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><X className="w-6 h-6" /></button>
          </div>

          <div className="text-center space-y-8 relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-purple-500/20 text-cyan-400 text-sm font-medium">
              <Zap className="w-4 h-4 fill-purple-400" /> Deep Work Mode
            </div>

            <div className="flex items-center justify-center gap-8 select-none">
              {!isActive && <button onClick={() => adjustTimer(-5)} className="text-muted-foreground hover:text-foreground transition-colors text-2xl font-light p-4">-5</button>}
              <div className="text-[120px] font-mono font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground">{formatTime(timer)}</div>
              {!isActive && <button onClick={() => adjustTimer(5)} className="text-muted-foreground hover:text-foreground transition-colors text-2xl font-light p-4">+5</button>}
            </div>

            <div className="flex items-center justify-center gap-6">
              <button onClick={toggleTimer} className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-110 transition-transform">
                {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>
              <button onClick={resetTimer} className="w-16 h-16 rounded-full border border-border text-foreground flex items-center justify-center hover:bg-secondary transition-colors"><RotateCcw className="w-6 h-6" /></button>
            </div>
          </div>

        </div>
      )}

      <div className="animate-in fade-in duration-700">

        {/* --- HERO: MOTIVATION --- */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-500">System Online</span>
            </div>

            {/* Identity Badge */}
            <div className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-purple-500/20 text-[10px] font-mono uppercase text-cyan-400 tracking-wider">
              {identity}
            </div>

            {/* Focus Areas */}
            <div className="flex gap-2">
              {focusAreas.map(area => (
                <span key={area} className="px-2 py-0.5 rounded-md bg-secondary/50 border border-border text-[10px] text-muted-foreground uppercase tracking-wider">
                  {area}
                </span>
              ))}
            </div>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4">{getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{userName}</span>.</h1>
          <div className="flex items-start gap-3 max-w-2xl">
            <Quote className="w-5 h-5 text-muted-foreground shrink-0 mt-1 rotate-180" />
            <p className="text-lg text-muted-foreground font-light leading-relaxed">"{data.visionStatement || "Ambition is the path to success. Persistence is the vehicle you arrive in. Build with focus today."}"</p>
          </div>
        </div>

        {/* --- ANALYTICS DECK --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Year Progress */}
          <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-muted-foreground"><Clock className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Time</span></div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] uppercase text-muted-foreground mb-1"><span>Year Progress</span><span>{getYearProgress()}%</span></div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${getYearProgress()}%` }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] uppercase text-muted-foreground mb-1">
                    <span className="flex items-center gap-1">Life {isEditingAge ? <input autoFocus type="number" value={lifeAge} onChange={(e) => setLifeAge(Number(e.target.value))} onBlur={() => setIsEditingAge(false)} onKeyDown={(e) => e.key === 'Enter' && setIsEditingAge(false)} className="w-8 bg-secondary text-foreground text-[10px] rounded px-1 outline-none" /> : <span className="flex items-center cursor-pointer hover:text-foreground" onClick={() => setIsEditingAge(true)}>(Age {lifeAge}/90) <Edit2 className="w-2 h-2 ml-1" /></span>}</span>
                    <span>{Math.round((lifeAge / 90) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden"><div className="h-full bg-cyan-500" style={{ width: `${(lifeAge / 90) * 100}%` }} /></div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-4 italic">"Memento Mori. Act now."</p>
          </div>

          {/* --- FINANCE CARD --- */}
          {/* --- FINANCE CARD (Original Layout with Overlap Fix) --- */}
          <div className="glass-card rounded-3xl p-6 flex flex-col justify-between relative group cursor-pointer" onClick={() => setIsEditingFinance(true)}>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 className="w-4 h-4 text-muted-foreground" /></div>

            {isEditingFinance || finance.income === 0 ? (
              <div className="space-y-4 animate-in fade-in" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-2 mb-2 text-emerald-400"><Wallet className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Financial Setup</span></div>
                <div>
                  <label className="text-[10px] uppercase text-muted-foreground font-bold">Monthly Income</label>
                  <input type="number" value={tempFinance.income} onChange={e => setTempFinance({ ...tempFinance, income: Number(e.target.value) })} className="w-full bg-secondary border border-border rounded p-2 text-foreground text-sm focus:border-emerald-500 outline-none" placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-muted-foreground font-bold">Monthly Expenses</label>
                  <input type="number" value={tempFinance.expenses} onChange={e => setTempFinance({ ...tempFinance, expenses: Number(e.target.value) })} className="w-full bg-secondary border border-border rounded p-2 text-foreground text-sm focus:border-red-500 outline-none" placeholder="0" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={saveFinance} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg">Save</button>
                  {finance.income > 0 && <button onClick={() => setIsEditingFinance(false)} className="flex-1 bg-secondary hover:bg-secondary/80 text-muted-foreground text-xs font-bold py-2 rounded-lg">Cancel</button>}
                </div>
              </div>
            ) : (
              <div className="relative h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  {/* LEFT: Command & Available */}
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-2 mb-4 text-emerald-400"><Wallet className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Command</span></div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Available</span>
                      <div className="text-3xl font-mono font-medium text-foreground truncate">₹{finance.income - finance.expenses}</div>

                      {/* Integrated Savings Display */}
                      <div className="flex items-center justify-between text-xs mt-2 pr-2">
                        <span className="text-muted-foreground">Safety Net</span>
                        <span className="font-mono">₹{savings.toLocaleString()}</span>
                      </div>
                      <div className="h-1 w-full bg-secondary rounded-full overflow-hidden mt-1">
                        {/* Arbitrary goal of 10L for safety net visualization */}
                        <div className="h-full bg-emerald-500/50" style={{ width: `${Math.min(100, (savings / 1000000) * 100)}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Circular Chart (Flex Item now, no longer absolute overlap) */}
                  <div className="pt-2">
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
                      <Zap className="w-6 h-6 text-emerald-500" />
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray={`${100 - (finance.income > 0 ? Math.round((finance.expenses / finance.income) * 100) : 0)}, 100`} />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* BOTTOM: Monthly Burn */}
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] uppercase text-muted-foreground mb-2"><span>Monthly Burn</span><span>{finance.income > 0 ? Math.round((finance.expenses / finance.income) * 100) : 0}%</span></div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${finance.expenses > finance.income ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min((finance.expenses / finance.income) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>



          <div className="glass-card rounded-3xl p-6 flex flex-col relative group">
            <div className="flex items-center justify-between mb-2 text-muted-foreground">
              <div className="flex items-center gap-2"><Brain className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Brain Dump</span></div>
              {isSaved ? <span className="text-[10px] text-emerald-500 fade-in">Saved</span> : <span className="text-[10px] text-muted-foreground">Typing...</span>}
            </div>
            <textarea value={brainDump} onChange={handleBrainDumpChange} placeholder="Clear your mind..." className="flex-1 bg-transparent border-none resize-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none custom-scrollbar" />
          </div>

          {/* --- FOCUS PROTOCOL --- */}
          <div className="md:col-span-2 glass-card rounded-3xl p-6 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform duration-500 md:order-1">
                <Zap className="w-8 h-8 text-purple-400 fill-current" />
              </div>

              <div className="flex-1 md:order-2">
                <h3 className="text-xl font-bold text-white mb-2">Deep Work Protocol</h3>
                <p className="text-sm text-slate-400 mb-6 max-w-sm">
                  Initiate a 45-minute focused execution block. Eliminate all distractions and execute on your primary objective.
                </p>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <button onClick={() => setIsFocusMode(true)} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                    <Play className="w-3 h-3 fill-current" /> Engage System
                  </button>
                  <div className="text-xs font-mono text-slate-500">
                    STATUS: <span className="text-emerald-400">READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- FUTURE TIMELINE --- */}
        <div className="mb-16 animate-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
            <div className={`absolute -top-[50%] -right-[10%] w-[50%] h-[100%] rounded-full blur-[120px] transition-colors duration-1000 opacity-20 ${projection.status === 'High Growth' ? 'bg-emerald-600' : projection.status === 'Stable' ? 'bg-blue-600' : 'bg-yellow-600'}`} />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-muted-foreground" /> Future Projection
                  </h2>
                  <p className="text-muted-foreground text-sm">Based on your current momentum of <span className="font-bold text-foreground">{momentum}%</span></p>
                </div>

                <div className="flex bg-secondary rounded-full p-1 border border-border">
                  {(['now', '1y', '3y', '5y'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setTimelineTab(tab)}
                      className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${timelineTab === tab ? 'bg-background text-foreground shadow-lg scale-105' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <div className={`p-5 rounded-2xl border border-white/5 bg-white/5 flex flex-col items-start justify-between min-h-[140px] transition-all duration-500 ${projection.status === 'High Growth' ? 'shadow-[0_0_20px_rgba(16,185,129,0.15)] border-emerald-500/30' : projection.status === 'Stable' ? 'border-indigo-500/30' : 'border-yellow-500/30'}`}>
                  <div className="flex justify-between w-full">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Trajectory</span>
                    {projection.status === 'High Growth' ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : projection.status === 'Stable' ? <Anchor className="w-4 h-4 text-blue-400" /> : <Wind className="w-4 h-4 text-yellow-400" />}
                  </div>
                  <div>
                    <div className={`text-xl font-bold mb-1 ${projection.status === 'High Growth' ? 'text-emerald-400' : projection.status === 'Stable' ? 'text-blue-400' : 'text-yellow-400'}`}>{projection.status}</div>
                    <div className="text-xs text-gray-500 leading-tight">Compounding rate: +{Math.round(projection.growthRate * 100)}%</div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-white/5 bg-white/5 flex flex-col justify-between min-h-[140px] relative group/income">
                  <div className="flex justify-between w-full">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Annual Projection</span>
                    <button
                      onClick={() => setIsEditingProjectionIncome(!isEditingProjectionIncome)}
                      className="text-gray-600 hover:text-white transition-colors"
                    >
                      {isEditingProjectionIncome ? <X className="w-4 h-4" /> : <Edit2 className="w-3 h-3" />}
                    </button>
                  </div>

                  {isEditingProjectionIncome ? (
                    <div className="mt-2 animate-in fade-in slide-in-from-bottom-1">
                      <label className="text-[9px] text-gray-500 uppercase">Monthly Base</label>
                      <input
                        type="number"
                        autoFocus
                        value={tempProjectionIncome}
                        onChange={(e) => setTempProjectionIncome(Number(e.target.value))}
                        className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-lg text-white outline-none mb-2"
                      />
                      <button
                        onClick={saveProjectionIncome}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase py-1.5 rounded transition-colors flex items-center justify-center gap-1"
                      >
                        <Save className="w-3 h-3" /> Save
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl font-mono text-white mb-1 tracking-tight">{finance.currency}{projection.projectedIncome.toLocaleString()}</div>
                      <div className="h-1 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                        {/* Progress bar relative to double current income */}
                        <div className="h-full bg-white transition-all duration-1000" style={{ width: `${Math.min(100, (projection.projectedIncome / ((finance.income * 12) * 2)) * 100)}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 rounded-2xl border border-white/5 bg-white/5 flex flex-col justify-between min-h-[140px] space-y-4">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Career Phase</div>
                    <div className="text-sm font-bold text-white">{projection.careerText}</div>
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                    <div className="flex-1">
                      <div className="text-[9px] text-gray-500 uppercase mb-1">Skill Depth</div>
                      <div className="text-xs text-indigo-300 font-medium">{projection.skillText}</div>
                    </div>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <div className="flex-1">
                      <div className="text-[9px] text-gray-500 uppercase mb-1">Vitality</div>
                      <div className="text-xs text-emerald-300 font-medium">{projection.healthText}</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent flex items-center">
                  <p className="text-sm text-gray-300 leading-relaxed font-light italic">
                    "{projection.narrative}"
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* --- WIDGETS LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* HABITS */}
          <div className="glass-card rounded-3xl p-6 flex flex-col hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2"><Flame className="w-5 h-5 text-orange-500 fill-orange-500/20" /><h3 className="font-bold text-foreground">Rituals</h3></div>
              <span className="text-[10px] font-mono text-muted-foreground border border-border px-2 py-1 rounded-md">TODAY</span>
            </div>

            {/* Integrated Anti-Habit Section */}
            {antiHabit && (
              <div className="mb-4 p-3 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center rounded bg-red-500/10 text-red-400"><Ban className="w-3 h-3" /></div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wide">Restriction</span>
                  <span className="text-sm text-foreground/80 font-medium line-through decoration-red-500/50">{antiHabit}</span>
                </div>
              </div>
            )}

            <div className="flex-1 space-y-2">
              {dailyTasks.map(task => (
                <div key={task.id} onClick={() => toggleDailyTask(task.id)} className={`group relative flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-300 ${task.done ? 'bg-green-500/5 border-green-500/20' : 'bg-secondary/30 border-transparent hover:border-border hover:bg-secondary/50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300 ${task.done ? 'bg-green-500 text-black scale-100' : 'bg-secondary scale-90 group-hover:scale-100'}`}>{task.done && <Check className="w-3.5 h-3.5 stroke-[3px]" />}</div>

                    <div className="flex flex-col">
                      <span className={`text-sm font-medium transition-colors ${task.done ? 'text-green-500/50 line-through' : 'text-foreground'}`}>{task.text}</span>
                      {task.linkedGoalId && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${goals.find(g => g.id === task.linkedGoalId)?.type === 'Strategic' ? 'bg-cyan-500' : 'bg-indigo-500'}`} />
                          <span className="text-[9px] text-muted-foreground">{goals.find(g => g.id === task.linkedGoalId)?.text.substring(0, 15)}...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteDailyTask(task.id); }} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
              {isAddingTask ? (
                <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded-xl border border-border animate-in fade-in">
                  <input autoFocus value={newTaskInput} onChange={e => setNewTaskInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addDailyTask()} placeholder="New ritual..." className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground" />
                  <button onClick={addDailyTask} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Add</button>
                </div>
              ) : (
                <button onClick={() => setIsAddingTask(true)} className="w-full py-3 border border-dashed border-border rounded-xl text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-secondary/20 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-3 h-3" /> Add Habit
                </button>
              )}
            </div>
          </div>

          {/* ROADMAP */}
          <div className="glass-card md:col-span-2 rounded-3xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2"><Target className="w-5 h-5 text-purple-500" /><h3 className="font-bold text-foreground">Strategic Roadmap</h3></div>
              <button onClick={() => setIsAddingGoal(true)} className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              {isAddingGoal && (
                <div className="bg-secondary/20 border border-border rounded-2xl p-4 animate-in fade-in zoom-in-95">
                  <input
                    autoFocus
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                    placeholder="What is your next strategic objective?"
                    className="w-full bg-transparent border-b border-border pb-2 mb-3 text-lg font-bold text-foreground focus:outline-none focus:border-purple-500 transition-colors placeholder:text-muted-foreground/50"
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setIsAddingGoal(false)} className="px-4 py-2 rounded-xl text-xs font-bold uppercase text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">Cancel</button>
                    <button onClick={handleAddGoal} className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase shadow-lg shadow-purple-500/20 transition-all">Add Objective</button>
                  </div>
                </div>
              )}
              {goals.map(goal => (
                <div key={goal.id} className="group border border-border bg-secondary/20 rounded-2xl p-4 hover:border-purple-500/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-8 rounded-full ${goal.type === 'Strategic' ? 'bg-cyan-500' : 'bg-indigo-500'}`} />
                      <div>
                        <h4 className="font-bold text-foreground">{goal.text}</h4>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{goal.type}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDecompose(goal)} className="p-2 hover:bg-secondary rounded-lg text-blue-400" title="AI Breakdown"><Brain className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="pl-5 space-y-2">
                    {goal.subTasks?.map((sub, idx) => (
                      <div key={idx} onClick={() => handleTaskToggle(goal.id, idx)} className="flex items-center gap-3 cursor-pointer group/sub">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${sub.done ? 'bg-cyan-500 border-purple-500' : 'border-gray-600 group-hover/sub:border-purple-400'}`}>
                          {sub.done && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm ${sub.done ? 'text-cyan-400/50 line-through' : 'text-muted-foreground group-hover/sub:text-foreground'}`}>{sub.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {goals.length === 0 && (
                <div className="text-center py-10 opacity-50">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-500">No active objectives.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisionBoard;