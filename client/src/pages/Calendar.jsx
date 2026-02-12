import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleHabitCompletion } from '../store/habitsSlice';
import { Card, CardContent } from '../components/ui/card';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function CalendarPage() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dispatch = useDispatch();
    const { habits, history } = useSelector((state) => state.habits);

    // State for current date visualization
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null); // Date string YYYY-MM-DD
    const [isDayModalOpen, setIsDayModalOpen] = useState(false);

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        if (!day) return;
        const month = currentDate.getMonth() + 1; // 0-indexed match to 1-indexed string if using library, but let's manual
        const year = currentDate.getFullYear();
        // Format to YYYY-MM-DD local
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDate(dateStr);
        setIsDayModalOpen(true);
    };

    const toggleHabitForDate = (habitId) => {
        if (!selectedDate) return;
        dispatch(toggleHabitCompletion({ habitId, date: selectedDate }));
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    // Generate grid items
    const gridItems = [];
    for (let i = 0; i < firstDay; i++) {
        gridItems.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        gridItems.push(i);
    }

    // Helper to get completion data for a grid day
    const getDayData = (day) => {
        if (!day) return null;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const completed = history[dateStr] || [];
        // Calculate strict completion %? Or just show dots.
        // Let's show up to 3 dots
        return { completed, dateStr };
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Schedule</h1>
                    <p className="text-muted-foreground">View and manage your consistency journey.</p>
                </div>
                <div className="flex items-center gap-2 bg-card border border-white/10 p-1 rounded-lg">
                    <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="hover:bg-white/10"><ChevronLeft size={16} /></Button>
                    <span className="font-bold min-w-[120px] text-center text-white">{monthName} {year}</span>
                    <Button variant="ghost" size="icon" onClick={handleNextMonth} className="hover:bg-white/10"><ChevronRight size={16} /></Button>
                </div>
            </div>

            <Card className="border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="grid grid-cols-7 border-b border-white/10 bg-muted/20">
                        {days.map(day => (
                            <div key={day} className="p-4 text-center text-sm font-bold text-gray-400 border-r border-white/5 last:border-r-0">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)]">
                        {gridItems.map((date, i) => {
                            const data = getDayData(date);
                            const isToday = date === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

                            return (
                                <div
                                    key={i}
                                    onClick={() => handleDateClick(date)}
                                    className={`p-3 border-b border-r border-white/5 last:border-r-0 transition-all relative group ${!date ? 'bg-black/20 pointer-events-none' : 'hover:bg-white/5 cursor-pointer'}`}
                                >
                                    {date && (
                                        <>
                                            <span className={cn(
                                                "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-2",
                                                isToday ? "bg-primary text-primary-foreground font-bold" : "text-gray-400"
                                            )}>
                                                {date}
                                            </span>

                                            <div className="space-y-1">
                                                {/* Show indicators for completed habits */}
                                                {data.completed.map(habitId => {
                                                    const habit = habits.find(h => h.id === habitId);
                                                    if (!habit) return null;
                                                    return (
                                                        <div key={habitId} className="flex items-center gap-1.5 text-xs text-white/70">
                                                            <div className={cn("w-1.5 h-1.5 rounded-full", habit.color || "bg-primary")} />
                                                            <span className="truncate max-w-[80px] hidden lg:block">{habit.name}</span>
                                                        </div>
                                                    );
                                                })}
                                                {/* If nothing completed but habits exist, maybe show empty state? nah */}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Day Detail Modal */}
            <Modal isOpen={isDayModalOpen} onClose={() => setIsDayModalOpen(false)} title={`Habits for ${selectedDate}`}>
                <div className="space-y-4">
                    {habits.length === 0 && <p className="text-muted-foreground text-center">No habits configured.</p>}
                    {habits.map(habit => {
                        const isCompleted = selectedDate && history[selectedDate]?.includes(habit.id);
                        return (
                            <div key={habit.id}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                                onClick={() => toggleHabitForDate(habit.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center transition-colors", isCompleted ? "bg-primary border-primary" : "border-muted-foreground")}>
                                        {isCompleted && <CheckCircle2 size={12} className="text-white" />}
                                    </div>
                                    <span className={cn("font-medium", isCompleted && "text-muted-foreground line-through")}>{habit.name}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-end pt-4">
                    <Button onClick={() => setIsDayModalOpen(false)}>Done</Button>
                </div>
            </Modal>
        </div>
    );
}
