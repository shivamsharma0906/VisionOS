import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(year, month + offset, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    // State for events
    const [events, setEvents] = useState([
        { id: 1, title: "Deep Work Session", time: "08:00", type: "work", date: new Date().toISOString().split('T')[0] },
        { id: 2, title: "Weekly Strategy Review", time: "18:00", type: "strategic", date: new Date().toISOString().split('T')[0] },
    ]);
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    // Helpers
    const handleAddEvent = () => {
        if (!newEventTitle) return;
        const dateStr = selectedDay
            ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
            : new Date().toISOString().split('T')[0];

        const newEvent = {
            id: Date.now(),
            title: newEventTitle,
            time: "09:00", // Default time
            type: "general",
            date: dateStr
        };
        setEvents([...events, newEvent]);
        setNewEventTitle("");
        setIsAddingEvent(false);
        setSelectedDay(null);
    };

    const handleDeleteEvent = (id: number) => {
        setEvents(events.filter(e => e.id !== id));
    };

    const hasEventOnDay = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.find(e => e.date === dateStr);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            {/* Add Event Modal Overlay */}
            {isAddingEvent && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-3xl" onClick={() => setIsAddingEvent(false)}>
                    <div className="bg-card border border-white/10 p-6 rounded-2xl w-80 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-white mb-4">Add Event</h3>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Event Title"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white mb-4 focus:outline-none focus:border-indigo-500"
                            value={newEventTitle}
                            onChange={(e) => setNewEventTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddEvent()}
                        />
                        <div className="flex gap-2">
                            <Button onClick={handleAddEvent} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">Add</Button>
                            <Button variant="ghost" onClick={() => setIsAddingEvent(false)} className="flex-1 text-gray-400 hover:text-white">Cancel</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Calendar</h1>
                    <p className="text-gray-400">Manage your time and strategic milestones.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleToday} className="border-white/10 text-gray-300 hover:text-white">Today</Button>
                    <Button onClick={() => setIsAddingEvent(true)} className="bg-primary hover:bg-primary/90 text-white"><Plus className="w-4 h-4 mr-2" /> Add Event</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Calendar View */}
                <Card className="lg:col-span-2 bg-card border-white/10 shadow-xl overflow-hidden relative">
                    <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-white">{monthNames[month]} {year}</h2>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)} className="hover:bg-white/5"><ChevronLeft className="w-5 h-5" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => changeMonth(1)} className="hover:bg-white/5"><ChevronRight className="w-5 h-5" /></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-7 text-center mb-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} className="text-sm font-medium text-gray-500 uppercase tracking-wider">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="min-h-[100px] border border-transparent" />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                                const daysEvent = hasEventOnDay(day);

                                return (
                                    <div
                                        key={day}
                                        onClick={() => { setSelectedDay(day); setIsAddingEvent(true); }}
                                        className={`min-h-[100px] p-2 rounded-xl border transition-all cursor-pointer group hover:border-white/20 hover:bg-white/5 ${isToday ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-transparent border-white/5'}`}
                                    >
                                        <div className={`text-sm font-medium mb-2 ${isToday ? 'text-indigo-400' : 'text-gray-400 group-hover:text-white'}`}>{day}</div>
                                        {/* Dynamic Events */}
                                        {events.filter(e => e.date === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`).map(ev => (
                                            <div key={ev.id} onClick={(e) => { e.stopPropagation(); handleDeleteEvent(ev.id); }} className="px-2 py-1 mb-1 rounded bg-indigo-500/20 border border-indigo-500/30 text-[10px] text-indigo-300 truncate hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 transition-colors" title="Click to delete">
                                                {ev.title}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar / Upcoming */}
                <div className="space-y-6">
                    <Card className="bg-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-lg">Upcoming Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {events.slice(0, 5).map((event) => (
                                <div key={event.id} className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                                    <div className={`p-2 rounded-lg ${event.type === 'work' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                        <CalendarIcon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-white">{event.title}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
                                            <span>{event.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {events.length === 0 && <p className="text-xs text-center text-gray-500 italic py-4">No upcoming events.</p>}
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-white/10 border-dashed">
                        <CardContent className="p-6 text-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                                <Plus className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-sm font-medium text-white">Sync External Calendar</h3>
                            <p className="text-xs text-gray-500">Connect Google Calendar or Outlook to see all your meetings in one place.</p>
                            <Button variant="outline" size="sm" className="mt-2 border-white/10 hover:bg-white/5">Connect</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
