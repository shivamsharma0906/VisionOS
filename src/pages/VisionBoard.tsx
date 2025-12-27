import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVision } from "../context/VisionContext";
import confetti from "canvas-confetti";
import {
  Sparkles, Calendar as CalendarIcon,
  Check, Wallet, Plus, Trash2, X, 
  Edit2, Download, Zap, MoreVertical, Flame,
  ChevronLeft, ChevronRight, Quote, Play, Pause, RotateCcw, Maximize2,
  Image as ImageIcon, Brain, Activity, Clock, Trophy, Link as LinkIcon, Target
} from "lucide-react";

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

const ProgressRing = ({ radius, stroke, progress, color }: { radius: number, stroke: number, progress: number, color: string }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    </div>
  );
};

// --- HELPER FUNCTIONS ---
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const getGreeting = () => {
    const hour = new Date().getHours();
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

// --- TYPES ---
interface SubTask {
  text: string;
  done: boolean;
}

interface Goal {
  id: number;
  text: string;
  type: string;
  subTasks: SubTask[];
}

interface DailyTask {
  id: number;
  text: string;
  done: boolean;
  linkedGoalId?: number | null; 
}

const VisionBoard = () => {
  const navigate = useNavigate();
  const { data, toggleSubTask } = useVision();

  // --- 1. GOALS STATE (FIXED) ---
  // We use "as Goal[]" to tell TypeScript to trust the structure coming from context
  const [goals, setGoals] = useState<Goal[]>(() => (data.finalGoals as Goal[]) || []);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalText, setNewGoalText] = useState("");

  // --- 2. DAILY RITUALS (With Goal Linking) ---
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([
    { id: 1, text: "Morning Meditation (10m)", done: true, linkedGoalId: null },
    { id: 2, text: "Deep Work Session (2h)", done: false, linkedGoalId: null },
  ]);
  const [newTaskInput, setNewTaskInput] = useState("");
  const [selectedGoalLink, setSelectedGoalLink] = useState<number | string>(""); 
  const [isAddingTask, setIsAddingTask] = useState(false);

  // --- 3. OTHER STATE ---
  const [lifeAge, setLifeAge] = useState(25); 
  const [isEditingAge, setIsEditingAge] = useState(false);
  const [heatmapData] = useState(() => Array.from({ length: 30 }, () => Math.floor(Math.random() * 80) + 10));
  const [brainDump, setBrainDump] = useState(() => localStorage.getItem("vision_braindump") || "");
  const [isSaved, setIsSaved] = useState(true);
  const [xp, setXp] = useState(1250);
  
  const [finance, setFinance] = useState({
    currency: '₹',
    monthlyIncome: 80000, 
    monthlyBudget: 50000,
    spentSoFar: 12450, 
  });
  const [isEditingFinance, setIsEditingFinance] = useState(false);
  const [tempFinance, setTempFinance] = useState(finance);

  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null); 
  const [events, setEvents] = useState([
    { id: 1, date: "2025-12-25", title: "Project Deadline", type: "work" },
    { id: 2, date: "2026-06-09", title: "My Birthday", type: "general" }, 
  ]);
  const [newEvent, setNewEvent] = useState({ title: "", type: "general" });

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [timer, setTimer] = useState(25 * 60); 
  const [isActive, setIsActive] = useState(false);
  const [isDreamVaultOpen, setIsDreamVaultOpen] = useState(false);

  // Derived Gamification
  const level = Math.floor(xp / 1000);
  const nextLevelXp = (level + 1) * 1000;
  const xpProgress = ((xp % 1000) / 1000) * 100;

  // --- EFFECTS ---
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem("vision_braindump", brainDump);
      setIsSaved(true);
    }, 1000);
    return () => clearTimeout(handler);
  }, [brainDump]);

  const handleBrainDumpChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsSaved(false);
    setBrainDump(e.target.value);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  // --- HANDLERS ---
  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setTimer(25 * 60); };
  const adjustTimer = (minutes: number) => setTimer(prev => Math.max(60, prev + minutes * 60));
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTaskToggle = (goalId: number, taskId: number) => {
    toggleSubTask(goalId, taskId);
    setGoals(prevGoals => prevGoals.map(g => {
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
      setDailyTasks([
        ...dailyTasks, 
        { 
            id: Date.now(), 
            text: newTaskInput, 
            done: false,
            linkedGoalId: selectedGoalLink ? Number(selectedGoalLink) : null
        }
      ]);
      setNewTaskInput("");
      setSelectedGoalLink("");
      setIsAddingTask(false);
    }
  };

  const deleteDailyTask = (id: number) => setDailyTasks(prev => prev.filter(t => t.id !== id));
  const saveFinance = () => { setFinance(tempFinance); setIsEditingFinance(false); };
  const getSavingsRate = () => Math.round(((finance.monthlyIncome - finance.spentSoFar) / finance.monthlyIncome) * 100);

  const handleAddGoal = () => {
    if(!newGoalText.trim()) return;
    const newGoalObj: Goal = {
      id: Date.now(),
      text: newGoalText,
      type: "Strategic",
      subTasks: [
        { text: "Define Phase 1", done: false },
        { text: "First Milestone", done: false }
      ]
    };
    setGoals(prev => [...prev, newGoalObj]);
    setNewGoalText("");
    setIsAddingGoal(false);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
  };

  // Calendar
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const changeMonth = (offset: number) => setCurrentDate(new Date(year, month + offset, 1));
  const handleDateClick = (day: number) => setSelectedDate(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  
  const addEvent = () => {
    if (newEvent.title && selectedDate) {
      setEvents([...events, { id: Date.now(), date: selectedDate, ...newEvent }]);
      setNewEvent({ title: "", type: "general" });
      setSelectedDate(null);
    }
  };
  const deleteEvent = (id: number) => setEvents(prev => prev.filter(e => e.id !== id));
  const hasEvent = (day: number) => {
     const checkDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
     return events.some(e => e.date === checkDate);
  };
  const currentMonthEvents = events.filter(e => {
    const [eYear, eMonth] = e.date.split('-');
    return parseInt(eYear) === year && parseInt(eMonth) === month + 1;
  }).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden relative">

      {/* --- MODALS --- */}
      
      {/* Dream Vault */}
      {isDreamVaultOpen && (
        <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 animate-in fade-in zoom-in-95">
           <button onClick={() => setIsDreamVaultOpen(false)} className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white"><X className="w-8 h-8" /></button>
           <h2 className="text-3xl font-serif font-bold text-white mb-8">The Vault</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
              {["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800"].map((src, i) => (
                <div key={i} className="group relative aspect-video rounded-2xl overflow-hidden border border-white/10 hover:border-white/50 transition-all cursor-pointer">
                   <img src={src} alt="Dream" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddingGoal && (
        <div className="fixed inset-0 z-50 bg-[#050505]/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
           <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl relative">
              <button onClick={() => setIsAddingGoal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400"><Target className="w-5 h-5" /></div>
                 <h3 className="text-xl font-bold text-white">New Objective</h3>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="text-xs text-gray-500 uppercase font-bold ml-1 block mb-2">Goal Statement</label>
                    <input 
                       autoFocus
                       value={newGoalText}
                       onChange={(e) => setNewGoalText(e.target.value)}
                       placeholder="e.g. Launch the SaaS MVP by Q3..."
                       className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                       onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                    />
                 </div>
                 <button onClick={handleAddGoal} className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all">Commit to Goal</button>
              </div>
           </div>
        </div>
      )}

      {/* Zen Focus Mode */}
      {isFocusMode && (
        <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center animate-in fade-in duration-500">
           <div className="absolute top-6 right-6">
              <button onClick={() => setIsFocusMode(false)} className="p-2 text-gray-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
           </div>
           <div className="text-center space-y-8 relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
                 <Zap className="w-4 h-4 fill-purple-400" /> Deep Work Mode
              </div>
              <div className="flex items-center justify-center gap-8 select-none">
                 {!isActive && <button onClick={() => adjustTimer(-5)} className="text-gray-600 hover:text-white transition-colors text-2xl font-light p-4">-5</button>}
                 <div className="text-[120px] font-mono font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">{formatTime(timer)}</div>
                 {!isActive && <button onClick={() => adjustTimer(5)} className="text-gray-600 hover:text-white transition-colors text-2xl font-light p-4">+5</button>}
              </div>
              <div className="flex items-center justify-center gap-6">
                 <button onClick={toggleTimer} className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                    {isActive ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-1" />}
                 </button>
                 <button onClick={resetTimer} className="w-16 h-16 rounded-full border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors"><RotateCcw className="w-6 h-6" /></button>
              </div>
           </div>
        </div>
      )}

      {/* --- ATMOSPHERE --- */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50 mix-blend-overlay"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* --- HEADER --- */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#050505]/60 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <span className="font-serif font-bold tracking-wide text-gray-200">VisionOS</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsFocusMode(true)} className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors mr-4"><Maximize2 className="w-4 h-4" /> Focus Mode</button>
            <button onClick={() => setIsDreamVaultOpen(true)} className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"><ImageIcon className="w-4 h-4" /> Dream Vault</button>
            <ShimmerButton onClick={() => navigate("/weekly-checkin")}>Weekly Sync</ShimmerButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-28 pb-20 relative z-10">

        {/* --- HERO: MOTIVATION --- */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-500">System Online</span>
           </div>
           <h1 className="font-serif text-4xl md:text-5xl font-medium text-white mb-4">{getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Shivam</span>.</h1>
           <div className="flex items-start gap-3 max-w-2xl">
              <Quote className="w-5 h-5 text-gray-600 shrink-0 mt-1 rotate-180" />
              <p className="text-lg text-gray-400 font-light leading-relaxed">"Ambition is the path to success. Persistence is the vehicle you arrive in. Build with focus today."</p>
           </div>
        </div>

        {/* --- ANALYTICS DECK --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
           <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                 <div className="flex items-center gap-2 mb-4 text-gray-400"><Clock className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Time</span></div>
                 <div className="space-y-4">
                    <div>
                       <div className="flex justify-between text-[10px] uppercase text-gray-500 mb-1"><span>Year Progress</span><span>{getYearProgress()}%</span></div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${getYearProgress()}%` }} /></div>
                    </div>
                    <div>
                       <div className="flex justify-between text-[10px] uppercase text-gray-500 mb-1">
                          <span className="flex items-center gap-1">Life {isEditingAge ? <input autoFocus type="number" value={lifeAge} onChange={(e) => setLifeAge(Number(e.target.value))} onBlur={() => setIsEditingAge(false)} onKeyDown={(e) => e.key === 'Enter' && setIsEditingAge(false)} className="w-8 bg-white/10 text-white text-[10px] rounded px-1 outline-none"/> : <span className="flex items-center cursor-pointer hover:text-white" onClick={() => setIsEditingAge(true)}>(Age {lifeAge}/90) <Edit2 className="w-2 h-2 ml-1" /></span>}</span>
                          <span>{Math.round((lifeAge/90)*100)}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-purple-500" style={{ width: `${(lifeAge/90)*100}%` }} /></div>
                    </div>
                 </div>
              </div>
              <p className="text-[10px] text-gray-600 mt-4 italic">"Memento Mori. Act now."</p>
           </div>

           <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 flex flex-col relative group">
              <div className="flex items-center justify-between mb-2 text-gray-400">
                 <div className="flex items-center gap-2"><Brain className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Brain Dump</span></div>
                 {isSaved ? <span className="text-[10px] text-emerald-500 fade-in">Saved</span> : <span className="text-[10px] text-gray-600">Typing...</span>}
              </div>
              <textarea value={brainDump} onChange={handleBrainDumpChange} placeholder="Clear your mind..." className="flex-1 bg-transparent border-none resize-none text-sm text-gray-300 placeholder:text-gray-700 focus:outline-none custom-scrollbar" />
           </div>

           <div className="md:col-span-2 flex flex-col gap-6">
              <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-4 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center"><Trophy className="w-5 h-5 text-yellow-500" /></div>
                 <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1"><span className="font-bold text-white">Level {level}</span><span className="text-gray-500">{xp} / {nextLevelXp} XP</span></div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500" style={{ width: `${xpProgress}%` }} /></div>
                 </div>
              </div>
              <div className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-3xl p-6">
                 <div className="flex items-center gap-2 mb-4 text-gray-400"><Activity className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Consistency</span></div>
                 <div className="flex items-end gap-1 h-16">
                    {heatmapData.map((height, i) => { const opacity = Math.max(0.3, height / 100); return (<div key={i} className="flex-1 bg-emerald-500 rounded-sm hover:bg-emerald-400 transition-colors cursor-pointer" style={{ height: `${height}%`, opacity }} title={`Day ${i+1}`} />)})}
                 </div>
              </div>
           </div>
        </div>

        {/* --- WIDGETS LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* HABITS */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 flex flex-col hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2"><Flame className="w-5 h-5 text-orange-500 fill-orange-500/20" /><h3 className="font-bold text-gray-200">Rituals</h3></div>
               <span className="text-[10px] font-mono text-gray-500 border border-white/5 px-2 py-1 rounded-md">TODAY</span>
            </div>
            <div className="flex-1 space-y-2">
               {dailyTasks.map(task => (
                 <div key={task.id} onClick={() => toggleDailyTask(task.id)} className={`group relative flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-300 ${task.done ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-transparent hover:border-white/10 hover:bg-white/10'}`}>
                    <div className="flex items-center gap-3">
                       <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300 ${task.done ? 'bg-green-500 text-black scale-100' : 'bg-white/10 scale-90 group-hover:scale-100'}`}>{task.done && <Check className="w-3.5 h-3.5 stroke-[3px]" />}</div>
                       
                       <div className="flex flex-col">
                          <span className={`text-sm font-medium transition-colors ${task.done ? 'text-green-500/50 line-through' : 'text-gray-300'}`}>{task.text}</span>
                          {/* GOAL LINK TAG */}
                          {task.linkedGoalId && (
                             <div className="flex items-center gap-1 mt-0.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${goals.find(g => g.id === task.linkedGoalId)?.type === 'Strategic' ? 'bg-purple-500' : 'bg-indigo-500'}`} />
                                <span className="text-[9px] text-gray-500">{goals.find(g => g.id === task.linkedGoalId)?.text.substring(0, 15)}...</span>
                             </div>
                          )}
                       </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteDailyTask(task.id); }} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                 </div>
               ))}
               
               {isAddingTask ? (
                 <div className="space-y-2 mt-2 animate-in fade-in slide-in-from-top-1 bg-white/5 p-3 rounded-xl border border-white/10">
                   <input autoFocus className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="New ritual..." value={newTaskInput} onChange={(e) => setNewTaskInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addDailyTask()} />
                   
                   {/* GOAL LINK SELECTOR */}
                   <div className="flex items-center gap-2">
                      <LinkIcon className="w-3 h-3 text-gray-500" />
                      <select 
                        className="bg-transparent text-[10px] text-gray-400 outline-none border-none cursor-pointer w-full"
                        value={selectedGoalLink}
                        onChange={(e) => setSelectedGoalLink(e.target.value)}
                      >
                         <option value="">Link to Goal (Optional)</option>
                         {goals.map(g => <option key={g.id} value={g.id} className="bg-slate-900 text-gray-300">{g.text.substring(0, 25)}...</option>)}
                      </select>
                   </div>

                   <button onClick={addDailyTask} className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-lg transition-colors">Add Task</button>
                 </div>
               ) : (
                 <button onClick={() => setIsAddingTask(true)} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white mt-4 transition-colors uppercase tracking-wider"><Plus className="w-3 h-3" /> Add Ritual</button>
               )}
            </div>
          </div>

          {/* FINANCE */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0f0f0f] to-[#050505] border border-white/10 rounded-3xl p-6">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
             <div className="flex justify-between items-start mb-8 relative z-10">
                <div><h3 className="flex items-center gap-2 font-bold text-gray-200"><Wallet className="w-5 h-5 text-emerald-400" /> Command</h3><p className="text-xs text-gray-500 mt-1">Financial Health</p></div>
                <button onClick={() => setIsEditingFinance(!isEditingFinance)} className="text-gray-600 hover:text-white transition-colors">{isEditingFinance ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}</button>
             </div>
             {isEditingFinance ? (
                <div className="space-y-4 relative z-10"><div className="grid grid-cols-2 gap-4"><div className="space-y-1"><label className="text-[10px] text-gray-500 uppercase">Income</label><input type="number" value={tempFinance.monthlyIncome} onChange={(e) => setTempFinance({...tempFinance, monthlyIncome: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none" /></div><div className="space-y-1"><label className="text-[10px] text-gray-500 uppercase">Spent</label><input type="number" value={tempFinance.spentSoFar} onChange={(e) => setTempFinance({...tempFinance, spentSoFar: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none" /></div></div><button onClick={saveFinance} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors">Update Metrics</button></div>
             ) : (
                <div className="flex items-center justify-between relative z-10"><div><div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Available</div><div className="text-3xl font-mono font-medium text-white tracking-tight">{finance.currency}{(finance.monthlyIncome - finance.spentSoFar).toLocaleString()}</div><div className="mt-4 flex items-center gap-2 text-xs text-gray-400"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span>Savings Rate: <span className="text-white font-mono">{getSavingsRate()}%</span></span></div></div><div className="relative"><ProgressRing radius={45} stroke={6} progress={getSavingsRate()} color="#10B981" /><div className="absolute inset-0 flex items-center justify-center"><Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" /></div></div></div>
             )}
             <div className="mt-8 pt-4 border-t border-white/5 relative z-10"><div className="flex justify-between text-[10px] uppercase text-gray-500 mb-2"><span>Monthly Burn</span><span>{Math.round((finance.spentSoFar / finance.monthlyIncome) * 100)}%</span></div><div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${(finance.spentSoFar / finance.monthlyIncome) * 100}%` }} /></div></div>
          </div>

          {/* CALENDAR */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 flex flex-col hover:border-white/10 transition-colors relative overflow-hidden">
             {selectedDate && (
               <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-20 flex items-center justify-center p-6 animate-in fade-in zoom-in-95">
                 <div className="w-full space-y-4"><div className="flex justify-between items-center"><h4 className="text-lg font-bold text-white">Add Reminder</h4><button onClick={() => setSelectedDate(null)}><X className="w-5 h-5 text-gray-500" /></button></div><div className="text-sm text-purple-400 font-mono mb-2">{selectedDate}</div><input autoFocus className="w-full bg-transparent border-b border-white/20 text-lg text-white py-2 focus:outline-none focus:border-purple-500" placeholder="Event Title..." value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} onKeyDown={e => e.key === 'Enter' && addEvent()} /><div className="flex gap-2">{['general', 'work', 'money'].map(type => (<button key={type} onClick={() => setNewEvent({...newEvent, type})} className={`px-3 py-1 rounded-full text-xs capitalize border ${newEvent.type === type ? 'bg-purple-500 border-purple-500 text-white' : 'border-white/10 text-gray-500'}`}>{type}</button>))}</div><button onClick={addEvent} className="w-full bg-white text-black font-bold py-3 rounded-xl mt-4 hover:bg-gray-200 transition-colors">Set Reminder</button></div>
               </div>
             )}
             <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-purple-500" /><h3 className="font-bold text-gray-200">{monthNames[month]} <span className="text-gray-500">{year}</span></h3></div><div className="flex gap-1"><button onClick={() => changeMonth(-1)} className="p-1 hover:bg-white/10 rounded"><ChevronLeft className="w-4 h-4 text-gray-400" /></button><button onClick={() => changeMonth(1)} className="p-1 hover:bg-white/10 rounded"><ChevronRight className="w-4 h-4 text-gray-400" /></button></div></div>
             <div className="grid grid-cols-7 text-center mb-2">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (<div key={d} className="text-[10px] text-gray-600 font-bold">{d}</div>))}</div>
             <div className="grid grid-cols-7 gap-1 text-center mb-4">{Array.from({ length: firstDay }).map((_, i) => (<div key={`empty-${i}`} className="h-8" />))}{Array.from({ length: daysInMonth }).map((_, i) => { const day = i + 1; const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear(); const hasEventToday = hasEvent(day); return (<div key={day} onClick={() => handleDateClick(day)} className={`h-8 w-8 mx-auto flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all relative ${isToday ? 'bg-purple-600 text-white font-bold' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}><span className="text-xs">{day}</span>{hasEventToday && (<span className="w-1 h-1 rounded-full bg-purple-400 absolute bottom-1" />)}</div>) })}</div>
             <div className="mt-auto border-t border-white/5 pt-3"><div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Important Dates ({monthNames[month]})</div><div className="space-y-2 max-h-[100px] overflow-y-auto custom-scrollbar">{currentMonthEvents.length > 0 ? (currentMonthEvents.map(e => (<div key={e.id} className="flex items-center group/event"><div className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center border mr-3 ${e.type === 'work' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : e.type === 'money' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-purple-500/30 bg-purple-500/10 text-purple-400'}`}><span className="text-[10px] font-bold leading-none">{e.date.split('-')[2]}</span></div><div className="flex-1 min-w-0"><div className="text-xs text-gray-300 truncate font-medium">{e.title}</div><div className="text-[9px] text-gray-600 uppercase">{e.type}</div></div><button onClick={() => deleteEvent(e.id)} className="opacity-0 group-hover/event:opacity-100 text-gray-600 hover:text-red-500"><Trash2 className="w-3 h-3" /></button></div>))) : (<div className="text-xs text-gray-600 italic py-2 text-center">No events this month.</div>)}</div></div>
          </div>
        </div>

        {/* --- 4. ROADMAP --- */}
        <div className="mb-8 flex items-end justify-between border-b border-white/5 pb-4">
           <div><h2 className="font-serif text-3xl font-medium text-white mb-1">Strategic Roadmap</h2><p className="text-sm text-gray-500">The path to your vision.</p></div>
           <button onClick={() => setIsAddingGoal(true)} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider transition-colors"><Plus className="w-4 h-4" /> New Objective</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {goals.map((goal, idx) => (
              <div key={goal.id} className="group relative bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 overflow-hidden">
                 <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] group-hover:bg-indigo-500/10 transition-colors duration-500" />
                 <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6"><span className="text-[10px] font-mono text-gray-600 uppercase border border-white/5 px-2 py-1 rounded">OBJ-{idx + 1}</span><MoreVertical className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white" /></div>
                    <h3 className="text-xl font-medium text-white mb-8 min-h-[3.5rem] leading-relaxed group-hover:text-indigo-300 transition-colors">{goal.text}</h3>
                    {(() => {
                        const total = goal.subTasks?.length || 0;
                        const completed = goal.subTasks?.filter((t: { done: boolean }) => t.done).length || 0;
                        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
                        return (
                           <div>
                              <div className="flex justify-between text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold"><span>Progress</span><span className="text-white">{percent}%</span></div>
                              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-6"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${percent}%` }} /></div>
                              <div className="space-y-3">
                                 {goal.subTasks?.slice(0, 2).map((task, i) => (
                                    <div key={i} onClick={() => handleTaskToggle(goal.id, i)} className="flex items-center gap-3 cursor-pointer group/task">
                                       <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-300 ${task.done ? 'bg-indigo-600 border-indigo-600' : 'border-white/20 bg-transparent group-hover/task:border-indigo-500'}`}>{task.done && <Check className="w-3 h-3 text-white" />}</div>
                                       <span className={`text-sm ${task.done ? 'text-gray-600 line-through' : 'text-gray-300'}`}>{task.text}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        );
                    })()}
                 </div>
              </div>
           ))}
           <button onClick={() => setIsAddingGoal(true)} className="border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-gray-600 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300 min-h-[300px] gap-4 group">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"><Plus className="w-6 h-6" /></div><span className="text-sm font-bold uppercase tracking-wider">Initialize Objective</span>
           </button>
        </div>

      </main>
    </div>
  );
};

export default VisionBoard;