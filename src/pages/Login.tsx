import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useVision } from "../context/VisionContext";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { updateData } = useVision();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestMode = () => {
    updateData('isGuest', true);
    navigate("/wizard");
  };

  const handleEmailLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) return;
    setIsLoading(true);

    // Simulate auth delay
    setTimeout(() => {
      updateData('isGuest', false);
      navigate("/wizard");
    }, 800);
  };

  return (
    // 🟢 FIX 1: Use 'h-screen' to force full viewport height without scrollbars
    <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden">

      {/* LEFT SIDE: Brand - Set to h-full to fill the vertical space */}
      <div className="hidden bg-zinc-900 lg:flex lg:flex-col relative h-full text-white p-10 dark:border-r">

        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2 text-lg font-medium">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-zinc-900">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-serif tracking-wide">Vision Board OS</span>
        </div>

        {/* Content Centered Vertically */}
        <div className="relative z-10 my-auto max-w-lg">
          <h2 className="font-serif text-4xl font-semibold leading-tight mb-8">
            "The gap between where you are and where you want to be is <span className="text-primary-foreground/90 italic">focus</span>."
          </h2>
          <div className="space-y-6 text-zinc-300">
            <div className="flex items-center gap-4">
              <div className="p-1 rounded-full bg-white/10"><CheckCircle2 className="w-5 h-5" /></div>
              <span className="text-lg">Psychology-backed goal discovery</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-1 rounded-full bg-white/10"><CheckCircle2 className="w-5 h-5" /></div>
              <span className="text-lg">AI-generated actionable roadmaps</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-1 rounded-full bg-white/10"><CheckCircle2 className="w-5 h-5" /></div>
              <span className="text-lg">Private, local-first data storage</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-auto flex justify-between text-sm text-zinc-500 font-medium">
          <p>© 2026 Vision Board Inc.</p>
          <p>v2.0.1 (Beta)</p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form - Set to h-full to center content vertically */}
      <div className="flex items-center justify-center h-full px-6 lg:px-8 bg-background">
        <div className="mx-auto grid w-full max-w-[400px] gap-6">

          {/* Mobile Logo (Only shows on small screens) */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-white">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>

          <div className="grid gap-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Login</h1>
            <p className="text-muted-foreground">
              Enter your email below to access your board
            </p>
          </div>

          <div className="grid gap-4 mt-2">
            <form onSubmit={handleEmailLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-lg border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all"
                  />
                </div>
                <Button disabled={isLoading || !email} className="h-12 rounded-lg text-base font-medium shadow-md">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-current animate-bounce" />
                      Signing In...
                    </span>
                  ) : (
                    "Sign In with Email"
                  )}
                </Button>
              </div>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-background px-4 text-muted-foreground font-medium">
                  OR CONTINUE AS GUEST
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={handleGuestMode}
              className="h-12 rounded-lg border-zinc-200 hover:bg-zinc-50 hover:text-foreground group"
            >
              Try Demo Version
              <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:translate-x-1 transition-all" />
            </Button>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Login;