import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Compass, Target, TrendingUp, Sparkles, ArrowRight,
  CheckCircle2, Layout, Zap, Rocket, Palette,
  Brain, Shield, Activity, Terminal
} from "lucide-react";

// --- TYPING EFFECT HOOK ---
const useTypingEffect = (words: string[], speed = 150, pause = 2000) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const timeout2 = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(timeout2);
  }, []);

  // Typing logic
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), pause);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 75 : speed, parseInt(Math.random() * 350)));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words, speed, pause]);

  return `${words[index].substring(0, subIndex)}${blink ? "|" : " "}`;
};

const Landing = () => {
  const navigate = useNavigate();
  const typingText = useTypingEffect(["Vision", "Chaos", "Future", "Legacy", "2026"], 150, 2000);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200 font-sans">

      {/* --- CYBER GRID BACKGROUND --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d40a_1px,transparent_1px),linear-gradient(to_bottom,#06b6d40a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

      {/* Vibrant Ambient Glows - Cyber-Executive Palette */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-900/50 rounded-full blur-[120px] -z-10" />

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-2xl border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
            {/* Logo Box */}
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">VisionOS</span>
          </div>
          <div className="flex items-center gap-6">
            <Button variant="ghost" className="hidden md:inline-flex text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/login")} className="bg-cyan-500 hover:bg-cyan-400 text-black rounded-full px-6 py-5 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all font-bold tracking-wide">
              Initialize Protocol
            </Button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-20">

            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-10 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              System v2.0 Online
            </div>

            {/* Headline with Typing Effect */}
            <h1 className="font-sans text-5xl md:text-8xl font-extrabold leading-[1.1] mb-8 tracking-tight text-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Architect your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 font-serif italic pr-4">
                {typingText}
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Stop relying on willpower. Build an <span className="text-cyan-400 font-medium">operating system</span> for your life using AI-driven design, identity shifting, and algorithmic habit tracking.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 w-full sm:w-auto">
              <Button size="lg" onClick={() => navigate("/login")} className="h-14 px-10 text-lg bg-white text-black hover:bg-cyan-50 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all w-full sm:w-auto font-bold flex items-center gap-2">
                <Terminal className="w-5 h-5" /> Execute Setup
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white rounded-full w-full sm:w-auto backdrop-blur-md">
                Protocol Walkthrough
              </Button>
            </div>
          </div>

          {/* 3D DASHBOARD PREVIEW */}
          <div className="relative mt-4 perspective-[2000px] group animate-in fade-in zoom-in-95 duration-1000 delay-500">
            {/* The Floating Card */}
            <div className="relative mx-auto max-w-6xl bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden transform rotate-x-6 group-hover:rotate-x-0 transition-transform duration-700 ease-out ring-1 ring-white/5">

              {/* Fake UI Header */}
              <div className="h-10 bg-slate-900/80 backdrop-blur-md border-b border-white/5 flex items-center px-6 gap-4 justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                </div>
                <div className="flex bg-slate-800/50 rounded-full px-4 py-1 border border-white/5 items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">VisionOS_Dashboard.exe</span>
                </div>
                <div className="w-10" />
              </div>

              {/* Fake Dashboard Content */}
              <div className="p-8 grid grid-cols-12 gap-6 bg-gradient-to-b from-[#0B1120] to-[#0f172a] min-h-[600px] relative">

                {/* Sidebar */}
                <div className="col-span-12 md:col-span-3 space-y-4 hidden md:block border-r border-white/5 pr-6">
                  <div className="h-10 w-full bg-cyan-500/10 rounded-lg border border-cyan-500/20 flex items-center px-4 gap-3 text-cyan-400 text-sm font-bold">
                    <Layout className="w-4 h-4" /> Dashboard
                  </div>
                  <div className="h-10 w-full hover:bg-white/5 rounded-lg flex items-center px-4 gap-3 text-slate-400 text-sm transition-colors">
                    <Target className="w-4 h-4" /> Goals
                  </div>
                  <div className="h-10 w-full hover:bg-white/5 rounded-lg flex items-center px-4 gap-3 text-slate-400 text-sm transition-colors">
                    <Brain className="w-4 h-4" /> AI Architect
                  </div>

                  <div className="mt-12 p-4 rounded-xl bg-slate-900 border border-white/5">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-3">
                      <Activity className="w-3 h-3 text-emerald-400" /> SYSTEM STATUS
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mb-2 overflow-hidden">
                      <div className="w-[78%] bg-cyan-500 h-full rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>OPTIMIZATION</span>
                      <span>78%</span>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="col-span-12 md:col-span-9 grid grid-cols-3 gap-6">
                  {/* Header Area */}
                  <div className="col-span-3 h-48 rounded-2xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-cyan-500/10 relative p-8 flex items-center overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full" />
                    <div className="relative z-10">
                      <h3 className="text-3xl font-bold text-white mb-2">Morning, Visionary.</h3>
                      <p className="text-slate-400">Your systems are operating at peak efficiency.</p>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="col-span-1 h-32 bg-slate-900/50 border border-white/5 rounded-2xl p-5 hover:border-cyan-500/30 transition-colors group/card">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400"><Target className="w-5 h-5" /></div>
                      <span className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded">+12%</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">8 Active</div>
                    <div className="text-xs text-slate-500">Strategic Objectives</div>
                  </div>

                  <div className="col-span-1 h-32 bg-slate-900/50 border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 transition-colors group/card">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><TrendingUp className="w-5 h-5" /></div>
                      <span className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded">ON TRACK</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">₹8.5L</div>
                    <div className="text-xs text-slate-500">Net Worth Growth</div>
                  </div>

                  <div className="col-span-1 h-32 bg-slate-900/50 border border-white/5 rounded-2xl p-5 hover:border-purple-500/30 transition-colors group/card">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400"><Zap className="w-5 h-5" /></div>
                      <span className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded">98% SCORE</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">Day 42</div>
                    <div className="text-xs text-slate-500">Consistency Streak</div>
                  </div>

                  {/* Bottom Area */}
                  <div className="col-span-3 h-64 bg-slate-900/30 border border-white/5 rounded-2xl border-dashed flex items-center justify-center text-slate-600 font-mono text-sm">
                    [ SYSTEM VISUALIZATION MODULE LOADING... ]
                  </div>

                </div>
              </div>
            </div>

            {/* Glow under the card */}
            <div className="absolute -inset-1 top-10 bg-cyan-500/20 blur-[100px] -z-10 rounded-[50px] opacity-50" />
          </div>
        </div>
      </section>

      {/* --- PROTOCOL SECTION --- */}
      <section className="py-32 px-6 relative bg-slate-950/50 border-y border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-500 to-transparent" />
                <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase">The Methodology</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Identity Shifting, <br />
                <span className="text-slate-500">Not Just Goal Setting.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Most vision boards are just pretty pictures. VisionOS uses the <strong>Cyber-Executive Protocol</strong> to align your subconscious identity with your conscious targets.
              </p>

              <div className="space-y-6">
                {[
                  { title: "Define The Operator", desc: "Select your archetype (Architect, Hacker, Scaler) to calibrate the system." },
                  { title: "Architect The Environment", desc: "Design a digital workspace that reinforces your new identity 24/7." },
                  { title: "Automate Execution", desc: "Turn vague desires into binary daily protocols (0 or 1)." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center font-bold text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">{item.title}</h4>
                      <p className="text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/10 blur-[80px] rounded-full" />
              <div className="relative grid gap-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 shadow-xl backdrop-blur-xl translate-x-8">
                  <Brain className="w-8 h-8 text-purple-400 mb-4" />
                  <div className="h-2 w-24 bg-purple-500/20 rounded mb-2" />
                  <div className="h-2 w-full bg-slate-800 rounded" />
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] backdrop-blur-xl -translate-x-4 z-10">
                  <Terminal className="w-8 h-8 text-cyan-400 mb-4" />
                  <div className="h-2 w-32 bg-cyan-500/20 rounded mb-2" />
                  <div className="h-2 w-full bg-slate-800 rounded" />
                  <div className="h-2 w-3/4 bg-slate-800 rounded mt-2" />
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 shadow-xl backdrop-blur-xl translate-x-4">
                  <Shield className="w-8 h-8 text-emerald-400 mb-4" />
                  <div className="h-2 w-24 bg-emerald-500/20 rounded mb-2" />
                  <div className="h-2 w-full bg-slate-800 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Command Center Modules</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Fully integrated suite of tools designed for high-performance living.</p>
        </div>

        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Brain, color: "text-purple-400", title: "AI Coach", desc: "24/7 Strategic Advisor" },
            { icon: Target, color: "text-cyan-400", title: "Goal Tracking", desc: "OKRs & KPIs" },
            { icon: Activity, color: "text-emerald-400", title: "Bio-Rhythms", desc: "Energy Management" },
            { icon: Layout, color: "text-blue-400", title: "Visual Board", desc: "Dynamic Manifestation" }
          ].map((feature, i) => (
            <div key={i} className="group p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all cursor-default">
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-[40px] bg-gradient-to-b from-[#0f172a] to-[#0B1120] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl border border-cyan-500/20 group">

            {/* Animations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-all duration-1000" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 group-hover:bg-blue-600/20 transition-all duration-1000" />

            <div className="relative z-10">
              <h2 className="font-sans text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Ready to Upgrade?
              </h2>
              <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto">
                Your old operating system got you here. <br />
                <span className="text-cyan-400">VisionOS</span> takes you there.
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="h-16 px-12 text-xl font-bold rounded-full shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:scale-105 transition-all bg-cyan-500 text-black hover:bg-cyan-400"
              >
                Access System
              </Button>
              <p className="mt-6 text-xs text-slate-600 font-mono">v2.0.4 STABLE // SECURE CONNECTION</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#0B1120]">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white border border-white/10">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="font-serif font-bold tracking-tight text-white">VisionOS</span>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-cyan-400 transition-colors">Manifesto</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Login</a>
          </div>

          <p className="text-sm text-slate-600 font-mono">
            SYSTEM ONLINE
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;