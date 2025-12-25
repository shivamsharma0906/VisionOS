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
            
            {/* The User Journey */}
            <Route path="/wizard/*" element={<Wizard />} />
            
            {/* 🟢 2. Add this route so the Wizard has somewhere to go */}
            <Route path="/summary" element={<VisionSummary />} />
            
            <Route path="/board" element={<VisionBoard />} />
            <Route path="/weekly-checkin" element={<WeeklyCheckin />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </VisionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;