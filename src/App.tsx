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
import VisionSummary from "./pages/VisionSummary"; // 🟢 1. Import this
import VisionBoard from "./pages/VisionBoard";
import WeeklyCheckin from "./pages/WeeklyCheckin";
import NotFound from "./pages/NotFound";
import AICoach from "./pages/AICoach";
import WeeklyAIReview from "./pages/WeeklyAIReview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <VisionProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* User Journey */}
            <Route path="/wizard/*" element={<Wizard />} />
            <Route path="/summary" element={<VisionSummary />} />
            <Route path="/vision-board" element={<VisionBoard />} />

            {/* Weekly */}
            <Route path="/weekly-checkin" element={<WeeklyCheckin />} />
            <Route path="/weekly-ai-review" element={<WeeklyAIReview />} />

            {/* AI Coach (on-demand) */}
            <Route path="/ai-coach" element={<AICoach />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </VisionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;
