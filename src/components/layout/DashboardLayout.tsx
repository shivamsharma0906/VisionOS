import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Sparkles, Maximize2, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen bg-background font-sans selection:bg-primary/30 text-foreground">
            {/* Sidebar - Hidden on mobile, visible on desktop */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden">

                {/* Mobile Header */}
                <header className="md:hidden flex h-16 items-center justify-between border-b border-white/10 bg-card/50 backdrop-blur-xl px-6">
                    <div className="flex items-center gap-2 font-serif text-lg font-bold text-white">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                            <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        VisionOS
                    </div>
                    {/* Add Mobile Menu Toggle Here if needed */}
                </header>

                {/* Global Dashboard Header (Desktop mainly) */}
                {!/* You can add a top bar here if you want actions like "Focus Mode" to always be visible, or keep it in VisionBoard.tsx but use the layout for structure. 
           For now, I'll add a simple placeholder or keeping it minimal to let pages define their specific headers if needed, OR move the VisionBoard header here.
           Let's move the generic actions here.
        */ false}

                <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                    {/* Background Atmosphere */}
                    <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0 mix-blend-overlay"></div>
                    <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none z-0" />
                    <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none z-0" />

                    <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
