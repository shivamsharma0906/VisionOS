import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Target,
    Calendar,
    Sparkles,
    Settings,
    LogOut,
    Brain,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVision } from "@/context/VisionContext";
import { deleteVisionData } from "@/lib/api";
import { toast } from "sonner"; // Assuming sonner or use-toast is available, or just alert

const sidebarItems = [
    { icon: LayoutDashboard, label: "Vision Board", href: "/vision-board" },
    { icon: Target, label: "Weekly Sync", href: "/weekly-checkin" },
    { icon: Brain, label: "AI Coach", href: "/ai-coach" },
    { icon: Calendar, label: "Calendar", href: "/calendar" }, // Placeholder if not exists
];

export function Sidebar() {
    const location = useLocation();

    return (
        <div className="hidden sticky top-0 h-screen w-64 flex-col border-r border-white/10 bg-card/30 backdrop-blur-xl md:flex shrink-0">
            <div className="p-6">
                <div className="flex items-center gap-2 font-serif text-xl font-bold text-white">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    VisionOS
                </div>
            </div>

            <div className="flex-1 space-y-1 px-3 py-4">
                {sidebarItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-gray-500 group-hover:text-white")} />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <div className="border-t border-white/10 p-4 space-y-2">
                <Button onClick={() => { localStorage.clear(); window.location.href = '/'; }} variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 mb-2">
                    <LogOut className="h-4 w-4" /> Sign Out
                </Button>

                <Button
                    onClick={async () => {
                        if (confirm("⚠️ HARD RESET: This will wipe all your goals, tasks, and settings. Are you sure?")) {
                            try {
                                const userId = localStorage.getItem("userId"); // Assuming this is stored
                                if (userId) await deleteVisionData(userId);
                                localStorage.clear();
                                window.location.href = '/wizard';
                            } catch (e) {
                                alert("Reset failed. Local data cleared.");
                                localStorage.clear();
                                window.location.href = '/wizard';
                            }
                        }
                    }}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-600 hover:text-red-500 hover:bg-red-500/20"
                >
                    <Zap className="h-4 w-4" /> Reset All Data
                </Button>
            </div>
        </div>
    );
}
