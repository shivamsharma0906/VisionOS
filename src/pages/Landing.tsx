import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Compass, Target, TrendingUp, Sparkles, ArrowRight, Star, Users } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Compass className="w-6 h-6" />,
      title: "Discover Your Direction",
      description: "Answer guided psychological questions to uncover your true values and priorities for 2026.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Build Your Vision",
      description: "Our AI helps you craft specific, measurable goals and organizes them into a beautiful visual board.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Track Real Progress",
      description: "Don't just dream. Weekly check-ins and monthly reviews keep you accountable and moving forward.",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden selection:bg-primary/20 selection:text-primary">

      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">Vision Board</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:inline-flex" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/login")} className="rounded-full px-6">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative">
        <div className="container mx-auto max-w-4xl text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            New: AI Goal Suggestions for 2026
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-semibold text-foreground leading-[1.1] mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Design your life with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">clarity, not confusion.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Stop making generic resolutions. Use our AI-guided system to build a vision board that actually drives action, tracking, and results.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="h-14 px-8 text-lg font-medium rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all w-full sm:w-auto"
            >
              Create My Vision (Free) <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            {/* <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg font-medium rounded-full w-full sm:w-auto"
            >
              View Demo
            </Button> */}
          </div>

          {/* Mini Social Proof */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                    <Users className="w-3 h-3 opacity-50" />
                  </div>
                ))}
              </div>
              <span>10,000+ users</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 px-6 bg-secondary/30 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
              From chaos to clarity in 3 steps
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Most vision boards are just pretty pictures. Ours is a productivity system disguised as art.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group p-8 rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-3xl bg-primary p-12 md:p-20 text-center relative overflow-hidden">
            {/* Decor circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <h2 className="relative font-serif text-3xl md:text-5xl font-semibold text-primary-foreground mb-6">
              Ready to design your 2026?
            </h2>
            <p className="relative text-lg text-primary-foreground/90 mb-10 max-w-xl mx-auto">
              Join thousands of others who are trading confusion for clarity. It takes less than 5 minutes to start.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/login")}
              className="relative h-14 px-10 text-lg font-medium rounded-full shadow-lg"
            >
              Start for Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50 bg-background">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-serif font-semibold text-foreground">Vision Board</span>
          </div>

          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2026 Vision Board Platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;