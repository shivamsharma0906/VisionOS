import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VisionProvider } from "@/context/VisionContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Wizard from "./pages/Wizard";
import VisionSummary from "./pages/VisionSummary";
import VisionBoard from "./pages/VisionBoard";
import WeeklyCheckin from "./pages/WeeklyCheckin";
import NotFound from "./pages/NotFound";
import AICoach from "./pages/AICoach";
import WeeklyAIReview from "./pages/WeeklyAIReview";
import Calendar from "./pages/Calendar";

const queryClient = new QueryClient();

import DashboardLayout from "@/components/layout/DashboardLayout";

const App = () => {
  // 1. Check if we are in development mode (localhost)
  // If you are using Vite, 'import.meta.env.DEV' is automatically true locally
  const isDev = import.meta.env.DEV;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <VisionProvider>
          <Toaster />
          <Sonner />

          {/* 2. Conditionally set the basename */}
          {/* Localhost uses '/' */}
          {/* GitHub Pages uses '/VisionOS' */}
          <BrowserRouter basename={isDev ? "/" : "/VisionOS"}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />

              {/* User Journey */}
              <Route path="/wizard/*" element={<Wizard />} />
              <Route path="/summary" element={<VisionSummary />} />

              {/* Authenticated Dashboard Routes */}
              <Route element={<DashboardLayout />}>
                <Route path="/vision-board" element={<VisionBoard />} />
                <Route path="/weekly-checkin" element={<WeeklyCheckin />} />
                <Route path="/weekly-ai-review" element={<WeeklyAIReview />} />
                <Route path="/ai-coach" element={<AICoach />} />
                <Route path="/calendar" element={<Calendar />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </VisionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;