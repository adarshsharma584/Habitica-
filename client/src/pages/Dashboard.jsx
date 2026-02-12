import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addHabit, toggleHabitCompletion, deleteHabit, fetchHabits, fetchHabitLogs } from '../store/habitsSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Modal } from '../components/ui/modal';
import { CheckCircle2, Circle, Flame, TrendingUp, Plus, Trash2, ChevronLeft, ChevronRight, Sparkles, Calendar as CalendarIcon, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <Card>
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
                {trend && <p className="text-xs text-emerald-500 mt-1">{trend}</p>}
            </div>
            <div className={cn("p-3 rounded-full opacity-20", color)}>
                <Icon size={24} className="opacity-100" />
            </div>
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { habits, history } = useSelector((state) => state.habits);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newHabitName, setNewHabitName] = useState("");
    const [currentDate, setCurrentDate] = useState(new Date());

    const today = new Date().toLocaleDateString('en-CA');
    const todaysCompleted = history[today] || [];

    useEffect(() => {
        if (habits.length === 0) {
            dispatch(fetchHabits());
            dispatch(fetchHabitLogs());
        }
    }, [dispatch, habits.length]);

    const handleAddHabit = async (e) => {
        e.preventDefault();
        if (!newHabitName.trim()) return;

        const newHabit = {
            name: newHabitName,
            frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            color: 'bg-primary'
        };

        try {
            await dispatch(addHabit(newHabit)).unwrap();
            setNewHabitName("");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to add habit:", error);
            alert(`Error adding habit: ${error.message || error.error_description || "Unknown error"}`);
        }
    };

    const toggleHabit = (habitId) => {
        dispatch(toggleHabitCompletion({ habitId, date: today }));
    };

    const completionRate = habits.length > 0 ? Math.round((todaysCompleted.length / habits.length) * 100) : 0;

    // Calendar helpers
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const gridItems = [];
    for (let i = 0; i < firstDay; i++) gridItems.push(null);
    for (let i = 1; i <= daysInMonth; i++) gridItems.push(i);

    const getDayData = (day) => {
        if (!day) return null;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const completed = history[dateStr] || [];
        return { completed, dateStr };
    };


    // Weekly tracker helpers - define first since analytics depend on it
    const getWeekDates = () => {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const dates = [];

        // Start from Monday (adjust if today is Sunday)
        const startOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

        for (let i = 0; i < 7; i++) {
            const date = new Date(now);
            date.setDate(now.getDate() + startOffset + i);
            dates.push({
                date: date.toLocaleDateString('en-CA'), // YYYY-MM-DD
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNumber: date.getDate(),
                isPast: date < new Date(now.setHours(0, 0, 0, 0)),
                isToday: date.toLocaleDateString('en-CA') === today
            });
        }
        return dates;
    };

    const weekDates = getWeekDates();

    // Calculate real analytics from user data
    const calculateWeeklyData = () => {
        return weekDates.map(day => {
            if (!day.isPast && !day.isToday) {
                return { day: day.dayName, completion: 0 };
            }

            const completedCount = history[day.date]?.length || 0;
            const totalHabits = habits.length;
            const completionRate = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

            return {
                day: day.dayName,
                completion: completionRate
            };
        });
    };

    const weeklyData = calculateWeeklyData();

    // Calculate current streak
    const calculateStreak = () => {
        let streak = 0;
        const sortedDates = Object.keys(history).sort().reverse();

        for (const date of sortedDates) {
            const completedHabits = history[date]?.length || 0;
            if (completedHabits > 0) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    };

    const currentStreak = calculateStreak();

    // Calculate weekly consistency (average completion rate for the week)
    const calculateWeeklyConsistency = () => {
        const pastDays = weekDates.filter(d => d.isPast || d.isToday);
        if (pastDays.length === 0) return 0;

        let totalCompletion = 0;
        pastDays.forEach(day => {
            const completedCount = history[day.date]?.length || 0;
            const totalHabits = habits.length;
            if (totalHabits > 0) {
                totalCompletion += (completedCount / totalHabits) * 100;
            }
        });

        return Math.round(totalCompletion / pastDays.length);
    };

    const weeklyConsistency = calculateWeeklyConsistency();


    const getHabitStatus = (habitId, dateStr, isPast, isToday) => {
        const isCompleted = history[dateStr]?.includes(habitId);

        // If it's a future date, show nothing
        if (!isPast && !isToday) return null;

        // If completed, show green check
        if (isCompleted) return 'completed';

        // If it's past or today and not completed, show red X
        if (isPast || isToday) return 'missed';

        return null;
    };

    const toggleWeeklyHabit = (habitId, dateStr) => {
        dispatch(toggleHabitCompletion({ habitId, date: dateStr }));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! You're on a roll today.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => navigate('/ai-planner')} variant="outline" className="gap-2">
                        <Sparkles size={16} /> AI Planner
                    </Button>
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                        <Plus size={16} /> New Habit
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    icon={Flame}
                    label="Current Streak"
                    value={currentStreak > 0 ? `${currentStreak} Days` : "0 Days"}
                    trend={currentStreak > 0 ? "Keep it going!" : "Start today!"}
                    color="bg-orange-500 text-orange-500"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Habits Done"
                    value={`${todaysCompleted.length}/${habits.length}`}
                    trend={`${completionRate}% completion`}
                    color="bg-emerald-500 text-emerald-500"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Weekly Consistency"
                    value={`${weeklyConsistency}%`}
                    trend={weeklyConsistency >= 70 ? "Great work!" : "Keep pushing!"}
                    color="bg-blue-500 text-blue-500"
                />
                <StatCard
                    icon={Circle}
                    label="Total Habits"
                    value={habits.length}
                    color="bg-purple-500 text-purple-500"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Habits & Calendar */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Weekly Habit Tracker */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle>Weekly Habit Tracker</CardTitle>
                            <CardDescription>Track your habits across the week</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {habits.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                                    <p>No habits yet. Start small.</p>
                                    <Button variant="link" onClick={() => setIsModalOpen(true)}>+ Create one</Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <div className="min-w-full">
                                        {/* Header Row */}
                                        <div className="grid grid-cols-8 gap-2 mb-3">
                                            <div className="font-semibold text-sm text-muted-foreground px-3 py-2">
                                                Daily Habits
                                            </div>
                                            {weekDates.map((day) => (
                                                <div
                                                    key={day.date}
                                                    className={cn(
                                                        "text-center px-2 py-2 rounded-lg text-xs font-medium transition-colors",
                                                        day.isToday && "bg-primary/20 text-primary border border-primary/50"
                                                    )}
                                                >
                                                    <div className="font-bold">{day.dayName}</div>
                                                    <div className="text-[10px] text-muted-foreground">{day.dayNumber}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Habit Rows */}
                                        <div className="space-y-2">
                                            {habits.map((habit) => (
                                                <div
                                                    key={habit.id}
                                                    className="grid grid-cols-8 gap-2 items-center py-2 px-1 rounded-lg hover:bg-secondary/20 transition-colors group"
                                                >
                                                    {/* Habit Name */}
                                                    <div className="px-2 flex items-center justify-between">
                                                        <span className="text-sm font-medium truncate">{habit.name}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80 h-6 w-6"
                                                            onClick={() => dispatch(deleteHabit(habit.id))}
                                                        >
                                                            <Trash2 size={12} />
                                                        </Button>
                                                    </div>

                                                    {/* Day Checkboxes */}
                                                    {weekDates.map((day) => {
                                                        const status = getHabitStatus(habit.id, day.date, day.isPast, day.isToday);
                                                        return (
                                                            <div
                                                                key={day.date}
                                                                className="flex items-center justify-center"
                                                            >
                                                                <button
                                                                    onClick={() => toggleWeeklyHabit(habit.id, day.date)}
                                                                    disabled={!day.isPast && !day.isToday}
                                                                    className={cn(
                                                                        "text-xl transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed",
                                                                        status === 'completed' && "hover:opacity-80",
                                                                        status === 'missed' && "hover:opacity-80"
                                                                    )}
                                                                >
                                                                    {status === 'completed' && '✅'}
                                                                    {status === 'missed' && '❌'}
                                                                    {!status && '⚪'}
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Mini Calendar */}
                    <Card className="border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarIcon size={20} />
                                    Calendar
                                </CardTitle>
                                <CardDescription>Your consistency journey</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg">
                                <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8">
                                    <ChevronLeft size={16} />
                                </Button>
                                <span className="font-semibold min-w-[120px] text-center text-sm">{monthName} {year}</span>
                                <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8">
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-7 gap-1">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                    <div key={i} className="text-center text-xs font-semibold text-muted-foreground p-2">{day}</div>
                                ))}
                                {gridItems.map((date, i) => {
                                    const data = getDayData(date);
                                    const isToday = date === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                                    const completionCount = data?.completed.length || 0;

                                    return (
                                        <div
                                            key={i}
                                            className={cn(
                                                "aspect-square p-1 text-center rounded-lg text-xs flex flex-col items-center justify-center transition-all",
                                                !date && "invisible",
                                                date && "hover:bg-secondary/50 cursor-pointer",
                                                isToday && "bg-primary/20 border border-primary/50 font-bold"
                                            )}
                                        >
                                            {date && (
                                                <>
                                                    <span className={cn("text-xs", isToday && "text-primary")}>{date}</span>
                                                    {completionCount > 0 && (
                                                        <div className="flex gap-0.5 mt-0.5">
                                                            {Array.from({ length: Math.min(completionCount, 3) }).map((_, i) => (
                                                                <div key={i} className="w-1 h-1 rounded-full bg-primary" />
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Analytics & AI */}
                <div className="space-y-6">
                    {/* Weekly Analytics */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 size={20} />
                                Weekly Progress
                            </CardTitle>
                            <CardDescription>Last 7 days completion rate</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                                    <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                    <Bar dataKey="completion" fill="#10B981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* AI Quick Planner */}
                    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles size={20} className="text-primary" />
                                AI Suggestions
                            </CardTitle>
                            <CardDescription>Get personalized habit recommendations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 rounded-lg bg-secondary/20 border border-border/50">
                                <p className="text-sm font-medium mb-1">💧 Stay Hydrated</p>
                                <p className="text-xs text-muted-foreground">Drink 8 glasses of water daily</p>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary/20 border border-border/50">
                                <p className="text-sm font-medium mb-1">🧘 Morning Meditation</p>
                                <p className="text-xs text-muted-foreground">Start your day with 10 min mindfulness</p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full mt-2"
                                size="sm"
                                onClick={() => navigate('/ai-planner')}
                            >
                                <Sparkles size={14} className="mr-2" />
                                Get Custom Plan
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create Habit Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Habit">
                <form onSubmit={handleAddHabit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Habit Name</label>
                        <Input
                            placeholder="e.g. Read 10 pages"
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Create Habit</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
