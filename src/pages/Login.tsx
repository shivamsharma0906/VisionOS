import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useVision } from "../context/VisionContext";
import { registerUser, loginUser } from "../lib/api";
import { Sparkles, ArrowRight, Loader2, Lock, Mail, Phone, Calendar } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { updateData, refresh } = useVision();

  // --- STATE ---
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    age: ""
  });
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

    // Basic validation
    if (!formData.email || !formData.password) return;
    if (!isLogin && (!formData.phone || !formData.age)) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let response;

      if (isLogin) {
        response = await loginUser({ email: formData.email, password: formData.password });
      } else {
        // Send all data including phone and age during registration
        response = await registerUser(formData);
      }

      console.log("Auth Success:", response);

      // 1. Save Token
      localStorage.setItem("token", response.token);
      
      // 2. CRITICAL FIX: Save Age for Dashboard
      if (response.user && response.user.age) {
        localStorage.setItem("userAge", response.user.age);
      }

      // 3. Refresh Data (Load user data from backend)
      if (refresh) await refresh();

      // 4. Update Context
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateData('userId' as any, response.user.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateData('isGuest' as any, false);

      // 5. SMART REDIRECT LOGIC
      if (isLogin) {
        // Returning User -> Go directly to Vision Board
        navigate("/vision-board");
      } else {
        // New User -> Go to Wizard to setup profile
        navigate("/wizard");
      }

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

      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
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
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-4">

            {error && (
              <div className="p-3 text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-lg animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* EMAIL INPUT (Always Visible) */}
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  required
                  disabled={isLoading}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500/50 transition-all"
                />
              </div>

              {/* NEW FIELDS: PHONE & AGE (Only Visible in Sign Up Mode) */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4 fade-in duration-300">
                  {/* Phone Input */}
                  <div className="relative group col-span-2 sm:col-span-1">
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <Input
                      id="phone"
                      placeholder="Phone"
                      type="tel"
                      required
                      disabled={isLoading}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12 pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500/50 transition-all"
                    />
                  </div>

                  {/* Age Input */}
                  <div className="relative group col-span-2 sm:col-span-1">
                    <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <Input
                      id="age"
                      placeholder="Age"
                      type="number"
                      min="1"
                      max="120"
                      required
                      disabled={isLoading}
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="h-12 pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500/50 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* PASSWORD INPUT (Always Visible) */}
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  required
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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