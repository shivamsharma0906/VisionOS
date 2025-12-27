import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useVision } from "../context/VisionContext";
import { registerUser, loginUser } from "../lib/api"; 
import { Sparkles, ArrowRight, Loader2, Lock, Mail } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { updateData } = useVision();
  
  // --- STATE ---
  const [isLogin, setIsLogin] = useState(true); 
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // --- HANDLERS ---
  const handleGuestMode = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateData('isGuest' as any, true);
    navigate("/wizard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setIsLoading(true);
    setError("");

    try {
      let response;
      
      if (isLogin) {
        response = await loginUser(formData);
      } else {
        response = await registerUser(formData);
      }

      console.log("Auth Success:", response);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateData('userId' as any, response.userId); 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateData('isGuest' as any, false);
      
      navigate("/wizard");

    } catch (err: unknown) {
      console.error("Auth Error:", err);
      const errorObj = err as { error?: string; message?: string };
      setError(errorObj.error || errorObj.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden flex items-center justify-center p-6 font-sans selection:bg-indigo-500/30">
      
      {/* --- BACKGROUND FX (Matches Landing Page) --- */}
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] -z-10" />

      {/* --- GLASS CARD CONTAINER --- */}
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20 mb-6">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mb-2">
            {isLogin ? "Welcome back" : "Design your future"}
          </h1>
          <p className="text-slate-400 text-sm">
            {isLogin 
              ? "Enter your credentials to access your vision board." 
              : "Create an account to start tracking your goals."}
          </p>
        </div>

        {/* Glass Form Container */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Top highlight line */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3 text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-lg animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  required
                  disabled={isLoading}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-12 pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500/50 transition-all"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  required
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="h-12 pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <Button 
              disabled={isLoading} 
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-indigo-500/25 transition-all duration-300"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Please wait...</>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950/50 px-2 text-slate-500 rounded backdrop-blur-md">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={handleGuestMode}
            className="w-full h-12 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            Continue as Guest <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
          </Button>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-8">
          © 2026 Vision Board OS. Secure & Encrypted.
        </p>
      </div>
    </div>
  );
};

export default Login;