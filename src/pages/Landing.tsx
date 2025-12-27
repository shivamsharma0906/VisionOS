import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Compass, Target, TrendingUp, Sparkles, ArrowRight, 
  CheckCircle2, Layout, Zap, Rocket, Palette 
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    // changed bg-background to bg-slate-950 (Dark Mode Base)
    <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200 font-sans">
      
      {/* --- COLORFUL BACKGROUND FX --- */}
      {/* Grid Pattern with lower opacity */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
      
      {/* Vibrant Ambient Glows - The "Colors" */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] -z-10" />

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
            {/* Colorful Logo Box */}
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-lg font-bold tracking-tight text-white">VisionOS</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:inline-flex text-slate-400 hover:text-white hover:bg-white/5" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/login")} className="bg-white text-slate-950 hover:bg-slate-200 rounded-full px-5 shadow-lg transition-all font-medium">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-32 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
            
            {/* Animated Badge - Darker style */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8 shadow-[0_0_15px_rgba(99,102,241,0.3)] animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              AI Goal Suggestions for 2026
            </div>

            {/* Headline with Gradient Text */}
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight text-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Turn your <span className="text-slate-500 line-through decoration-indigo-500 decoration-2">chaos</span> into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">crystal clear vision.</span>
            </h1>

            {/* Subhead */}
            <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              The first vision board that talks back. Use AI to clarify your values, generate specific roadmap steps, and track your progress visually.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 w-full sm:w-auto">
              <Button size="lg" onClick={() => navigate("/login")} className="h-12 px-8 text-base bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all w-full sm:w-auto border border-indigo-400/20">
                Start Building <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white rounded-full w-full sm:w-auto">
                View Demo
              </Button>
            </div>
          </div>

          {/* 3D Mockup Visual - Dark Mode Style */}
          <div className="relative mt-12 perspective-[2000px] group animate-in fade-in zoom-in-95 duration-1000 delay-500">
            {/* The Floating Card */}
            <div className="relative mx-auto max-w-4xl bg-slate-900 border border-white/10 rounded-xl shadow-2xl shadow-indigo-500/10 overflow-hidden transform rotate-x-12 group-hover:rotate-x-0 transition-transform duration-700 ease-out">
              {/* Fake UI Header */}
              <div className="h-8 bg-slate-800/50 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              </div>
              
              {/* Fake Dashboard Content */}
              <div className="p-6 grid grid-cols-12 gap-4 bg-gradient-to-b from-slate-900 to-slate-900/50">
                {/* Sidebar */}
                <div className="col-span-3 space-y-3 hidden sm:block">
                  <div className="h-8 w-full bg-indigo-500/10 rounded-md border border-indigo-500/10" />
                  <div className="h-4 w-3/4 bg-slate-800 rounded-md" />
                  <div className="h-4 w-1/2 bg-slate-800 rounded-md" />
                  <div className="h-32 w-full bg-slate-800/30 rounded-lg mt-8 border border-dashed border-slate-700" />
                </div>
                {/* Main Content */}
                <div className="col-span-12 sm:col-span-9 grid grid-cols-2 gap-4">
                   <div className="col-span-2 h-24 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-lg border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-serif italic">
                      "2026: The Year of Expansion"
                   </div>
                   <div className="h-32 bg-slate-800/40 border border-white/5 rounded-lg p-4 relative overflow-hidden group/card hover:border-indigo-500/30 transition-colors">
                      <div className="absolute top-0 right-0 p-2"><Target className="w-4 h-4 text-indigo-400" /></div>
                      <div className="w-12 h-12 rounded-full bg-indigo-500/20 mb-2 flex items-center justify-center text-indigo-400"><Rocket className="w-6 h-6"/></div>
                      <div className="h-4 w-2/3 bg-slate-700 rounded mb-2" />
                      <div className="h-2 w-full bg-slate-700/50 rounded" />
                   </div>
                   <div className="h-32 bg-slate-800/40 border border-white/5 rounded-lg p-4 relative overflow-hidden group/card hover:border-emerald-500/30 transition-colors">
                      <div className="absolute top-0 right-0 p-2"><TrendingUp className="w-4 h-4 text-emerald-400" /></div>
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 mb-2 flex items-center justify-center text-emerald-400"><Zap className="w-6 h-6"/></div>
                      <div className="h-4 w-1/2 bg-slate-700 rounded mb-2" />
                      <div className="h-2 w-full bg-slate-700/50 rounded" />
                   </div>
                </div>
              </div>
            </div>
            
            {/* Glow under the card */}
            <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl -z-10 rounded-[30px]" />
          </div>
        </div>
      </section>

      {/* --- FEATURES BENTO GRID --- */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-white">More than just images.</h2>
            <p className="text-slate-400">A complete productivity system disguised as art.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Large Card - Purple Gradient */}
            <div className="md:col-span-2 row-span-1 md:row-span-2 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-md p-8 flex flex-col justify-between hover:border-purple-500/30 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-600/20 transition-colors" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-6 border border-purple-500/20">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2 text-white">Psychological Discovery</h3>
                <p className="text-slate-400 max-w-sm">We don't ask "what do you want?" We ask "who are you?" Our AI helps uncover values you didn't know you had.</p>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full opacity-30" />
            </div>

            {/* Tall Card - Dark with Checkmarks */}
            <div className="md:col-span-1 md:row-span-2 rounded-3xl border border-white/10 bg-slate-900/50 p-8 flex flex-col hover:-translate-y-1 hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-900/0 to-emerald-900/10 pointer-events-none" />
               <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20">
                  <Zap className="w-6 h-6" />
                </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-white">Daily Momentum</h3>
              <p className="text-slate-400 text-sm mb-8">Weekly check-ins that take 60 seconds but keep you aligned for 52 weeks.</p>
              
              <div className="mt-auto space-y-3 z-10">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div className="h-2 w-20 bg-slate-700 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Small Card 1 - Blue */}
            <div className="md:col-span-1 rounded-3xl border border-white/10 bg-slate-900/30 p-8 hover:bg-slate-800/50 hover:border-blue-500/30 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                 <Layout className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
                 <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">Auto-Layout</span>
              </div>
              <h3 className="font-bold text-lg text-white">Smart Boards</h3>
              <p className="text-sm text-slate-400 mt-2">Drag, drop, and let AI organize the chaos.</p>
            </div>

             {/* Small Card 2 - Amber */}
            <div className="md:col-span-1 rounded-3xl border border-white/10 bg-slate-900/30 p-8 hover:bg-slate-800/50 hover:border-amber-500/30 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                 <Palette className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform" />
                 <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">Premium</span>
              </div>
              <h3 className="font-bold text-lg text-white">Aesthetic Styles</h3>
              <p className="text-sm text-slate-400 mt-2">Turn pictures into measurable data points.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-[40px] bg-gradient-to-br from-indigo-900 to-purple-900 p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-purple-900/50 border border-white/10">
            {/* Abstract Shapes */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6">
                Design your 2026 today.
              </h2>
              <p className="text-lg text-indigo-100 mb-10 max-w-xl mx-auto">
                Join thousands of others who are trading confusion for clarity. No credit card required.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/login")}
                className="h-14 px-10 text-lg font-medium rounded-full shadow-xl shadow-black/20 hover:scale-105 transition-transform bg-white text-indigo-900 hover:bg-indigo-50"
              >
                Start for Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 border-t border-white/5 bg-slate-950">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold tracking-tight text-white">VisionOS</span>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Twitter</a>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 VisionOS Inc.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;