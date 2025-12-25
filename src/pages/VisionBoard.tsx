import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useVision } from "../context/VisionContext";
import confetti from "canvas-confetti";
import {
  Palette, ArrowRight, Target, Sparkles, Calendar as CalendarIcon,
  LayoutDashboard, Check, Wallet, Plus, Trash2, 
  TrendingUp, Save, X, Edit2, Activity, Download
} from "lucide-react";

// --- THEMES ---
const stylePresets = [
  {
    id: 'minimal',
    label: 'Minimal',
    bgClass: 'bg-[#FAFAF9]',
    preview: 'bg-[#FAFAF9] border-zinc-200'
  },
  {
    id: 'dark',
    label: 'Focus',
    bgClass: 'dark bg-zinc-950 text-foreground',
    preview: 'bg-zinc-900 border-zinc-700'
  },
];

const affirmations = [
  "I execute with precision and purpose.",
  "My ambition is matched by my discipline.",
  "I am building a life of freedom.",
];

const VisionBoard = () => {
  const navigate = useNavigate();
  const { data, toggleSubTask } = useVision();

  const [selectedStyle, setSelectedStyle] = useState('minimal');
  const [showStylePicker, setShowStylePicker] = useState(false);

  // --- 1. FINANCE STATE ---
  const [finance, setFinance] = useState({
    currency: '₹',
    monthlyIncome: 80000, 
    monthlyBudget: 50000,
    spentSoFar: 12450, 
    yearlySavingsGoal: 500000,
    savedSoFar: 125000
  });
  const [isEditingFinance, setIsEditingFinance] = useState(false);
  const [tempFinance, setTempFinance] = useState(finance);

  // --- 2. EDITABLE DAILY TASKS STATE ---
  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, text: "Morning Meditation (10m)", done: true },
    { id: 2, text: "Deep Work Session (2h)", done: false },
    { id: 3, text: "Review Finances", done: false },
  ]);
  const [newTaskInput, setNewTaskInput] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  // --- 3. EDITABLE CALENDAR EVENTS ---
  const [events, setEvents] = useState([
    { id: 1, date: "Today", title: "SIP Deduction", type: "money" },
    { id: 2, date: "Oct 24", title: "Project Deadline", type: "work" },
  ]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", type: "general" });

  const currentStyle = stylePresets.find(s => s.id === selectedStyle) || stylePresets[0];
  const goals = (data.finalGoals && data.finalGoals.length > 0) ? data.finalGoals : [];

  // --- HANDLERS ---

  const handleTaskToggle = (goalId: number, taskId: number) => {
    toggleSubTask(goalId, taskId);
    confetti({ particleCount: 20, spread: 40, origin: { y: 0.6 }, colors: ['#10B981', '#3B82F6'] });
  };

  const toggleDailyTask = (id: number) => {
    setDailyTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };
  const addDailyTask = () => {
    if (newTaskInput.trim()) {
      setDailyTasks([...dailyTasks, { id: Date.now(), text: newTaskInput, done: false }]);
      setNewTaskInput("");
      setIsAddingTask(false);
    }
  };
  const deleteDailyTask = (id: number) => {
    setDailyTasks(prev => prev.filter(t => t.id !== id));
  };

  const saveFinance = () => {
    setFinance(tempFinance);
    setIsEditingFinance(false);
  };

  // 🟢 NEW: Financial Health Score Logic
  const calculateHealthScore = () => {
    const currentSavings = finance.monthlyIncome - finance.spentSoFar;
    const score = Math.max(0, Math.round((currentSavings / finance.monthlyIncome) * 100));

    let color = 'text-green-500';
    if (score < 20) { color = 'text-red-500'; }
    else if (score < 50) { color = 'text-orange-500'; }

    return { score, color };
  };

  const getBudgetHealth = () => {
    const percent = Math.round((finance.spentSoFar / finance.monthlyBudget) * 100);
    let color = 'bg-primary';
    let label = 'Healthy';
    if (percent > 90) { color = 'bg-red-500'; label = 'Critical'; }
    else if (percent > 75) { color = 'bg-orange-500'; label = 'Caution'; }
    return { percent, color, label };
  };

  // Events
  const addEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([...events, { id: Date.now(), ...newEvent }]);
      setNewEvent({ title: "", date: "", type: "general" });
      setIsAddingEvent(false);
    }
  };
  const deleteEvent = (id: number) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleContinue = () => { navigate("/weekly-checkin"); };

  return (
    <div className={`min-h-screen transition-all duration-700 ease-in-out font-sans selection:bg-primary/20 ${currentStyle.bgClass}`}>

      <div className="fixed inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-150 mix-blend-multiply dark:opacity-[0.02] dark:mix-blend-normal" />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/40 backdrop-blur-md supports-[backdrop-filter]:bg-white/10 dark:bg-black/20 dark:border-white/10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-serif text-lg font-semibold tracking-tight text-foreground/90">VisionOS</span>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <button onClick={() => setShowStylePicker(!showStylePicker)} className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 bg-white/50 hover:bg-white text-foreground/70 shadow-sm border border-black/5 hover:shadow-md dark:bg-zinc-800/50 dark:hover:bg-zinc-800">
              <Palette className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Theme</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" className="rounded-full px-5 shadow-lg shadow-primary/20" onClick={handleContinue}>
              Check-in <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
        {/* Theme Picker */}
        {showStylePicker && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-in zoom-in-95 slide-in-from-top-2">
            <div className="flex items-center gap-2 p-2 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-full ring-1 ring-black/5">
              {stylePresets.map((style) => (
                <button key={style.id} onClick={() => setSelectedStyle(style.id)} className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${selectedStyle === style.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                  <span className={`w-3 h-3 rounded-full border ${style.preview}`} />
                  <span className="text-xs font-semibold">{style.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-6 py-12 max-w-7xl relative z-10">

        {/* --- 1. MANIFESTO --- */}
        <section className="mb-12">
          <div className="bg-card/40 backdrop-blur-xl border border-foreground/5 shadow-sm rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
            <div className="relative z-10 max-w-3xl">
              <span className="text-8xl font-serif text-foreground/5 font-black absolute -top-10 -left-6 select-none">“</span>
              <h1 className="relative z-10 font-serif text-2xl md:text-3xl leading-relaxed text-foreground/90 font-medium">
                {data.visionStatement || "Your vision is being generated..."}
              </h1>
              <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground font-mono">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5">
                  <Target className="w-3.5 h-3.5" />
                  <span>{goals.length} Strategic Goals</span>
                </div>
                <span className="italic opacity-70">"Mastering {(data.areas || []).slice(0, 3).join(', ')}"</span>
              </div>
            </div>
            <div className="hidden md:block text-right border-l border-foreground/10 pl-8 min-w-[200px]">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-2">Daily Mantra</span>
              <p className="font-serif text-lg italic text-foreground/80">"{affirmations[0]}"</p>
            </div>
          </div>
        </section>

        {/* --- 2. DAILY OPERATIONS --- */}
        <h2 className="font-serif text-xl font-semibold text-foreground mb-6 flex items-center gap-2 px-2">
          <LayoutDashboard className="w-5 h-5 text-primary" /> Daily Operations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

          {/* A. EDITABLE DAILY FOCUS */}
          <div className="bg-card/40 backdrop-blur-md border border-foreground/5 rounded-[1.5rem] p-6 shadow-sm hover:bg-card/60 transition-all flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-sm uppercase tracking-wide flex items-center gap-2 text-foreground/80">
                <Check className="w-4 h-4 text-green-500" /> Daily Habits
              </h3>
              <span className="text-[10px] font-mono bg-foreground/5 px-2 py-1 rounded text-muted-foreground">Today</span>
            </div>
            <div className="space-y-3 flex-1">
              {dailyTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between group p-1 rounded hover:bg-foreground/5 transition-colors">
                  <div onClick={() => toggleDailyTask(task.id)} className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${task.done ? 'bg-green-500 border-green-500' : 'border-foreground/20 group-hover:border-green-500'}`}>
                      {task.done && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-sm ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.text}</span>
                  </div>
                  <button onClick={() => deleteDailyTask(task.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {isAddingTask ? (
                <div className="flex items-center gap-2 mt-4 animate-in fade-in slide-in-from-top-1">
                  <Input
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="New habit..."
                    className="h-8 text-xs bg-background/50"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && addDailyTask()}
                  />
                  <Button size="icon" className="h-8 w-8" onClick={addDailyTask}><Check className="w-3 h-3" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsAddingTask(false)}><X className="w-3 h-3" /></Button>
                </div>
              ) : (
                <button onClick={() => setIsAddingTask(true)} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary mt-4 pl-1 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Task
                </button>
              )}
            </div>
          </div>

          {/* B. EDITABLE FINANCE COMMAND WITH HEALTH SCORE */}
          <div className="bg-card/40 backdrop-blur-md border border-foreground/5 rounded-[1.5rem] p-6 shadow-sm hover:bg-card/60 transition-all relative">
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-sm uppercase tracking-wide flex items-center gap-2 text-foreground/80">
                  <Wallet className="w-4 h-4 text-blue-500" /> Finance
                </h3>
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded w-fit ${getBudgetHealth().percent > 90 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-600'}`}>
                  {getBudgetHealth().label} Budget
                </span>
              </div>

              {!isEditingFinance && (
                <div className="flex flex-col items-end">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path className="text-foreground/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className={`${calculateHealthScore().color} transition-all duration-1000`} strokeDasharray={`${calculateHealthScore().score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    </svg>
                    <div className={`absolute text-[10px] font-bold ${calculateHealthScore().color}`}>{calculateHealthScore().score}</div>
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground mt-1 uppercase">Health Score</span>
                </div>
              )}

              <Button variant="ghost" size="icon" className="h-6 w-6 absolute top-6 right-6 text-muted-foreground hover:text-foreground" onClick={() => setIsEditingFinance(!isEditingFinance)}>
                {isEditingFinance ? <X className="w-3 h-3" /> : <Edit2 className="w-3 h-3" />}
              </Button>
            </div>

            {isEditingFinance ? (
              // EDIT MODE
              <div className="space-y-4 animate-in fade-in">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Monthly Income</label>
                  <Input type="number" value={tempFinance.monthlyIncome} onChange={(e) => setTempFinance({ ...tempFinance, monthlyIncome: Number(e.target.value) })} className="h-8 bg-background/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Monthly Budget</label>
                  <Input type="number" value={tempFinance.monthlyBudget} onChange={(e) => setTempFinance({ ...tempFinance, monthlyBudget: Number(e.target.value) })} className="h-8 bg-background/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Spent So Far</label>
                  <Input type="number" value={tempFinance.spentSoFar} onChange={(e) => setTempFinance({ ...tempFinance, spentSoFar: Number(e.target.value) })} className="h-8 bg-background/50" />
                </div>
                <Button size="sm" className="w-full mt-2" onClick={saveFinance}><Save className="w-3 h-3 mr-2" /> Save Changes</Button>
              </div>
            ) : (
              // VIEW MODE
              <>
                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted-foreground">Oct Spending</span>
                    <span className="font-mono font-medium">{finance.currency}{finance.spentSoFar.toLocaleString()} / {finance.currency}{finance.monthlyBudget.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${getBudgetHealth().color}`}
                      style={{ width: `${getBudgetHealth().percent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-foreground/5">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Activity className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-wide">Savings Rate: {calculateHealthScore().score}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Implied Savings</span>
                    <span className="font-mono font-bold text-green-600 dark:text-green-400">
                      {finance.currency}{(finance.monthlyIncome - finance.spentSoFar).toLocaleString()}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* C. EDITABLE CALENDAR */}
          <div className="bg-card/40 backdrop-blur-md border border-foreground/5 rounded-[1.5rem] p-6 shadow-sm hover:bg-card/60 transition-all flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-sm uppercase tracking-wide flex items-center gap-2 text-foreground/80">
                <CalendarIcon className="w-4 h-4 text-orange-500" /> Key Dates
              </h3>
              {isAddingEvent ? (
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsAddingEvent(false)}><X className="w-3 h-3" /></Button>
              ) : (
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => setIsAddingEvent(true)}><Plus className="w-3 h-3" /></Button>
              )}
            </div>

            <div className="space-y-4 flex-1">
              {isAddingEvent && (
                <div className="bg-background/40 p-3 rounded-xl border border-border mb-4 animate-in fade-in slide-in-from-top-2 space-y-2">
                  <Input placeholder="Event Title" className="h-8 text-xs" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                  <div className="flex gap-2">
                    <Input placeholder="Date (e.g. Oct 25)" className="h-8 text-xs flex-1" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
                    <select
                      className="h-8 text-xs bg-background border rounded px-2"
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    >
                      <option value="general">General</option>
                      <option value="money">Money</option>
                      <option value="alert">Alert</option>
                    </select>
                  </div>
                  <Button size="sm" className="w-full h-8 text-xs" onClick={addEvent}>Add Event</Button>
                </div>
              )}

              {events.map(event => (
                <div key={event.id} className="flex items-center gap-3 group justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      flex flex-col items-center justify-center w-10 h-10 rounded-xl border text-xs font-bold leading-none transition-colors
                      ${event.type === 'alert' ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800' : 'bg-background border-border text-foreground'}
                    `}>
                      <span>{event.date.includes(' ') ? event.date.split(' ')[1] : '24'}</span>
                      <span className="text-[8px] uppercase font-normal opacity-70">
                        {event.date.includes(' ') ? event.date.split(' ')[0] : 'Today'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1 group-hover:text-primary transition-colors">{event.title}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        {event.type === 'money' ? 'Financial' : event.type === 'alert' ? 'High Priority' : 'General'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => deleteEvent(event.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* --- 3. GOALS GRID --- */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2 px-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Strategic Roadmap
          </h2>
          <Button variant="ghost" size="sm" className="hidden md:flex rounded-full text-muted-foreground hover:text-foreground">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {goals.map((goal, idx) => (
            <div
              key={goal.id}
              className="group bg-card/60 backdrop-blur-md border border-foreground/5 rounded-[1.5rem] p-6 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-background border border-foreground/5 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all shadow-sm">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-0.5">
                      Obj. {idx + 1}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${goal.type === 'Realistic' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                        'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      }`}>
                      {goal.type}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="font-medium text-lg text-foreground mb-6 leading-snug min-h-[3.5rem] group-hover:text-primary transition-colors">
                {goal.text}
              </h3>

              {(() => {
                const total = goal.subTasks?.length || 0;
                // Explicit Type Fix
                const completed = goal.subTasks?.filter((t: { done: boolean }) => t.done).length || 0;
                const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

                return (
                  <div className="bg-background/50 rounded-2xl p-4 border border-foreground/5">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Progress</span>
                      <span className="text-xl font-serif text-primary">{percent}%</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {goal.subTasks?.slice(0, 2).map((task, i) => (
                        <div key={i} className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100" onClick={() => handleTaskToggle(goal.id, i)}>
                          <div className={`w-3.5 h-3.5 rounded-full border border-foreground/20 flex items-center justify-center transition-colors ${task.done ? 'bg-primary border-primary' : ''}`}>
                            {task.done && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                          </div>
                          <span className={`text-xs truncate text-foreground ${task.done ? 'line-through opacity-50' : ''}`}>{task.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })()}
            </div>
          ))}

          {/* Add New Goal Card */}
          <button
            onClick={() => navigate('/wizard')}
            className="border-2 border-dashed border-foreground/10 rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all group min-h-[280px]"
          >
            <div className="w-14 h-14 rounded-full bg-foreground/5 group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="font-medium">Add Strategic Goal</span>
          </button>
        </div>

      </main>
    </div>
  );
};

export default VisionBoard;