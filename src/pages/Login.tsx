import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useVision } from "../context/VisionContext";
import { registerUser, loginUser, deleteUserAccount } from "../lib/api";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  Phone,
  Calendar,
  Target
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { updateData, refresh } = useVision();

  // --- STATE ---
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "", // Added name field
    phone: "",
    age: "",
    primaryFocus: "" // Added new field
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOverwrite, setShowOverwrite] = useState(false);

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

    // Enhanced Validation for Sign Up
    if (!isLogin) {
      if (!formData.name || !formData.phone || !formData.age || !formData.primaryFocus) {
        setError("Please fill in all fields, including your Name and Primary Focus.");
        return;
      }
    }

    setIsLoading(true);
    setError("");

    try {
      let response;

      if (isLogin) {
        response = await loginUser({ email: formData.email, password: formData.password });
      } else {
        // Send all data including phone, age, and focus
        response = await registerUser(formData);
      }

      console.log("Auth Success:", response);

      // 1. Save Token
      localStorage.setItem("token", response.token);

      // 2. Save User Details for Dashboard
      if (response.user) {
        if (response.user.age) localStorage.setItem("userAge", response.user.age);
        // Fix: Prioritize backend name (for login), then form name (for signup), then keep existing, then fallback
        const existingName = localStorage.getItem("userName");
        const nameToSave = response.user.name || formData.name || existingName || "Visionary";
        localStorage.setItem("userName", nameToSave);
        if (formData.primaryFocus) localStorage.setItem("userFocus", formData.primaryFocus);
        // Save ID for deletion/references
        if (response.user.id) localStorage.setItem("userId", response.user.id);
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
        navigate("/vision-board");
      } else {
        // Pass the focus to the wizard via URL or it will be read from localStorage
        navigate(`/wizard?focus=${formData.primaryFocus}`);
      }

    } catch (err: unknown) {
      console.error("Auth Error:", err);
      const errorObj = err as { error?: string; message?: string };
      setError(errorObj.error || errorObj.message || "Authentication failed. Please try again.");

      // If user exists, offer to overwrite
      if (errorObj.message?.includes("already exists")) {
        setShowOverwrite(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverwrite = async () => {
    if (!confirm(`Are you sure you want to delete the account for ${formData.email} and start fresh? This cannot be undone.`)) return;

    setIsLoading(true);
    try {
      await deleteUserAccount(formData.email);
      // After delete, try signing up again immediately
      await handleSubmit({ preventDefault: () => { } } as React.FormEvent);
      setShowOverwrite(false); // Reset UI
    } catch (e) {
      setError("Failed to delete account. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex items-center justify-center p-6 font-sans selection:bg-primary/30">

      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] -z-10" />

      {/* --- GLASS CARD CONTAINER --- */}
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">

        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20 mb-6">
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

            {showOverwrite && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg animate-in slide-in-from-top-2 flex flex-col gap-2">
                <p className="text-sm text-red-300">Account exists. Overwrite to start fresh?</p>
                <Button
                  type="button"
                  onClick={handleOverwrite}
                  variant="destructive"
                  size="sm"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Yes, Overwrite Account
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {/* NAME INPUT (Only in Sign Up) */}
              {!isLogin && (
                <div className="relative group animate-in slide-in-from-top-2">
                  <div className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                  <Input
                    id="name"
                    placeholder="Full Name"
                    type="text"
                    required
                    disabled={isLoading}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 pl-10 text-base"
                  />
                </div>
              )}

              {/* EMAIL INPUT (Always Visible) */}
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  required
                  disabled={isLoading}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 pl-10 text-base"
                />
              </div>

              {/* NEW FIELDS: PHONE, AGE, FOCUS (Only Visible in Sign Up Mode) */}
              {!isLogin && (
                <div className="space-y-4 animate-in slide-in-from-top-4 fade-in duration-300">

                  {/* Phone & Age Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Phone Input */}
                    <div className="relative group col-span-2 sm:col-span-1">
                      <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                      <Input
                        id="phone"
                        placeholder="Phone"
                        type="tel"
                        required
                        disabled={isLoading}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-12 pl-10 text-base"
                      />
                    </div>

                    {/* Age Input */}
                    <div className="relative group col-span-2 sm:col-span-1">
                      <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
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
                        className="h-12 pl-10 text-base"
                      />
                    </div>
                  </div>

                  {/* Primary Focus Selector */}
                  <div className="relative group">
                    <Target className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors z-10" />
                    <select
                      id="primaryFocus"
                      required
                      disabled={isLoading}
                      value={formData.primaryFocus}
                      onChange={(e) => setFormData({ ...formData, primaryFocus: e.target.value })}
                      className="w-full h-12 pl-10 pr-4 bg-secondary/50 border border-white/10 rounded-md text-white placeholder:text-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all appearance-none cursor-pointer outline-none text-sm"
                    >
                      <option value="" disabled className="bg-card text-slate-500">Select Primary Life Focus</option>
                      <option value="Career" className="bg-card">Career</option>
                      <option value="Business" className="bg-card">Business</option>
                      <option value="Health" className="bg-card">Health</option>
                      <option value="Money" className="bg-card">Money</option>
                      <option value="Relationships" className="bg-card">Relationships</option>
                      <option value="Self Growth" className="bg-card">Self Growth</option>
                    </select>
                    {/* Custom Arrow for Select */}
                    <div className="absolute right-3 top-4 pointer-events-none text-slate-500">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>

                </div>
              )}

              {/* PASSWORD INPUT (Always Visible) */}
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  required
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 pl-10 text-base"
                />
              </div>
            </div>

            <Button
              disabled={isLoading}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-indigo-500/25 transition-all duration-300"
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
              <span className="bg-card/50 px-2 text-slate-500 rounded backdrop-blur-md">Or continue with</span>
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
              className="font-medium text-cyan-400 hover:text-indigo-300 underline underline-offset-4 transition-colors"
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