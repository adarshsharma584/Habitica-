import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPlans, deletePlan } from '../store/plansSlice';
import { fetchHabits, fetchHabitLogs, addHabit, toggleHabitCompletion, deleteHabit } from '../store/habitsSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Modal } from '../components/ui/modal';
import {
    Plus, Trash2, ChevronLeft, ChevronRight,
    Sparkles, Layout, Calendar as CalendarIcon,
    BarChart3, Flame, CheckCircle2, TrendingUp, Circle,
    ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <Card className="border-border/50">
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

export default function MyPlans() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { plans, loading: plansLoading } = useSelector((state) => state.plans);
    const { habits, history } = useSelector((state) => state.habits);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
    const [newHabitName, setNewHabitName] = useState("");
    const [currentDate, setCurrentDate] = useState(new Date());

    const today = new Date().toLocaleDateString('en-CA');

    useEffect(() => {
        dispatch(fetchPlans());
    }, [dispatch]);

    useEffect(() => {
        if (selectedPlan) {
            dispatch(fetchHabits(selectedPlan.id));
            dispatch(fetchHabitLogs());
        }
    }, [dispatch, selectedPlan]);

    const handleAddHabit = async (e) => {
        e.preventDefault();
        if (!newHabitName.trim() || !selectedPlan) return;

        const newHabit = {
            name: newHabitName,
            frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            color: 'bg-primary',
            plan_id: selectedPlan.id
        };

        try {
            await dispatch(addHabit(newHabit)).unwrap();
            setNewHabitName("");
            setIsHabitModalOpen(false);
        } catch (error) {
            console.error("Failed to add habit:", error);
        }
    };

    const handleDeletePlan = async (e, planId) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this plan and all its habits?")) {
            await dispatch(deletePlan(planId));
            if (selectedPlan?.id === planId) setSelectedPlan(null);
        }
    };

    // --- Dashboard Logic (Mirrored from Dashboard.jsx) ---
    const todaysCompleted = history[today] || [];
    const completionRate = habits.length > 0 ? Math.round((todaysCompleted.filter(id => habits.some(h => h.id === id)).length / habits.length) * 100) : 0;

    const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    const gridItems = [];
    for (let i = 0; i < firstDay; i++) gridItems.push(null);
    for (let i = 1; i <= daysInMonth; i++) gridItems.push(i);

    const getWeekDates = () => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const dates = [];
        const startOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        for (let i = 0; i < 7; i++) {
            const date = new Date(now);
            date.setDate(now.getDate() + startOffset + i);
            dates.push({
                date: date.toLocaleDateString('en-CA'),
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNumber: date.getDate(),
                isPast: date < new Date(now.setHours(0, 0, 0, 0)),
                isToday: date.toLocaleDateString('en-CA') === today
            });
        }
        return dates;
    };
    const weekDates = getWeekDates();

    const calculateWeeklyData = () => {
        return weekDates.map(day => {
            const completedCount = history[day.date]?.filter(id => habits.some(h => h.id === id)).length || 0;
            const completionRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
            return { day: day.dayName, completion: completionRate };
        });
    };

    const calculateStreak = () => {
        let streak = 0;
        const sortedDates = Object.keys(history).sort().reverse();
        for (const date of sortedDates) {
            const completedHabits = history[date]?.filter(id => habits.some(h => h.id === id)).length || 0;
            if (completedHabits > 0) streak++; else break;
        }
        return streak;
    };

    const calculateWeeklyConsistency = () => {
        const pastDays = weekDates.filter(d => d.isPast || d.isToday);
        if (pastDays.length === 0) return 0;
        let totalCompletion = 0;
        pastDays.forEach(day => {
            const completedCount = history[day.date]?.filter(id => habits.some(h => h.id === id)).length || 0;
            if (habits.length > 0) totalCompletion += (completedCount / habits.length) * 100;
        });
        return Math.round(totalCompletion / pastDays.length);
    };

    const getHabitStatus = (habitId, dateStr, isPast, isToday) => {
        const isCompleted = history[dateStr]?.includes(habitId);
        if (!isPast && !isToday) return null;
        if (isCompleted) return 'completed';
        return 'missed';
    };

    // --- Rendering ---

    if (!selectedPlan) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Plans</h1>
                        <p className="text-muted-foreground">Manage and track your AI-generated routines.</p>
                    </div>
                </div>

                {plansLoading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 rounded-2xl bg-secondary/20 animate-pulse" />
                        ))}
                    </div>
                ) : plans.length === 0 ? (
                    <Card className="border-dashed border-2 bg-transparent">
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                            <Sparkles className="w-12 h-12 text-primary/40 mb-4" />
                            <h3 className="text-xl font-semibold">No saved plans yet</h3>
                            <p className="text-muted-foreground max-w-sm mt-2">
                                Head over to the AI Planner to generate a personalized routine and save it here.
                            </p>
                            <Button className="mt-6 gap-2" variant="outline" onClick={() => window.location.href = '/ai-planner'}>
                                Go to AI Planner
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <motion.div
                                key={plan.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedPlan(plan)}
                                className="cursor-pointer"
                            >
                                <Card className="h-full border-border/50 hover:border-primary/50 transition-colors bg-secondary/5 relative group">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl">{plan.title}</CardTitle>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive h-8 w-8"
                                                onClick={(e) => handleDeletePlan(e, plan.id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                        <CardDescription className="line-clamp-2">
                                            {plan.description || "Personalized Routine"}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                                            <CalendarIcon size={14} />
                                            Created {new Date(plan.created_at).toLocaleDateString()}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Plan Detail View (Dashboard Style)
    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto px-4 py-6">
            <header className="flex flex-col gap-4">
                <Button
                    variant="ghost"
                    onClick={() => setSelectedPlan(null)}
                    className="w-fit gap-2 -ml-2 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft size={16} /> Back to My Plans
                </Button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{selectedPlan.title}</h1>
                        <p className="text-muted-foreground">{selectedPlan.description || "Daily progress and insights."}</p>
                    </div>
                    <Button onClick={() => setIsHabitModalOpen(true)} className="gap-2">
                        <Plus size={16} /> New Habit
                    </Button>
                </div>
            </header>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    icon={Flame}
                    label="Current Streak"
                    value={`${calculateStreak()} Days`}
                    trend="Keep it going!"
                    color="bg-orange-500 text-orange-500"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Plan Completion"
                    value={`${todaysCompleted.filter(id => habits.some(h => h.id === id)).length}/${habits.length}`}
                    trend={`${completionRate}% today`}
                    color="bg-emerald-500 text-emerald-500"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Consistency"
                    value={`${calculateWeeklyConsistency()}%`}
                    trend="Weekly Average"
                    color="bg-blue-500 text-blue-500"
                />
                <StatCard
                    icon={Circle}
                    label="Habits in Plan"
                    value={habits.length}
                    color="bg-purple-500 text-purple-500"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    {/* Weekly tracker (Mirrored UI) */}
                    <Card className="border-border/50 overflow-hidden">
                        <CardHeader>
                            <CardTitle>Daily Progress Record</CardTitle>
                            <CardDescription>Maintaining this plan's habits</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <div className="grid grid-cols-8 gap-2 mb-4 border-b border-border/50 pb-4">
                                    <div className="text-sm font-bold opacity-50 px-2">Habits</div>
                                    {weekDates.map(d => (
                                        <div key={d.date} className={cn("text-center p-2 rounded-xl", d.isToday && "bg-primary/10 border border-primary/20")}>
                                            <div className="text-xs font-bold text-primary">{d.dayName}</div>
                                            <div className="text-[10px] opacity-70">{d.dayNumber}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    {habits.map(habit => (
                                        <div key={habit.id} className="grid grid-cols-8 gap-2 items-center group">
                                            <div className="px-2 truncate text-sm font-semibold">{habit.name}</div>
                                            {weekDates.map(day => {
                                                const status = getHabitStatus(habit.id, day.date, day.isPast, day.isToday);
                                                return (
                                                    <button
                                                        key={day.date}
                                                        disabled={!day.isPast && !day.isToday}
                                                        onClick={() => dispatch(toggleHabitCompletion({ habitId: habit.id, date: day.date }))}
                                                        className="flex justify-center text-xl hover:scale-125 transition-transform disabled:opacity-20"
                                                    >
                                                        {status === 'completed' ? '✅' : status === 'missed' ? '❌' : '⚪'}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Simple Calendar (Mirrored UI) */}
                    <Card className="border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Plan Calendar</CardTitle>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}><ChevronLeft size={16} /></Button>
                                <span className="text-sm font-bold min-w-[100px] text-center">{monthName}</span>
                                <Button variant="ghost" size="icon" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}><ChevronRight size={16} /></Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-[10px] uppercase font-bold text-muted-foreground pb-2">{d}</div>)}
                                {gridItems.map((date, i) => {
                                    const dateStr = date ? `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}` : null;
                                    const completed = dateStr ? history[dateStr]?.filter(id => habits.some(h => h.id === id)).length : 0;
                                    const isToday = dateStr === today;
                                    return (
                                        <div key={i} className={cn("aspect-square flex flex-col items-center justify-center rounded-lg relative", !date && "invisible", isToday && "bg-primary/20", date && "hover:bg-secondary/40")}>
                                            <span className="text-xs">{date}</span>
                                            {completed > 0 && <div className="w-1 h-1 bg-primary rounded-full mt-0.5" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

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
                                <BarChart data={calculateWeeklyData()}>
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

            <Modal isOpen={isHabitModalOpen} onClose={() => setIsHabitModalOpen(false)} title="Add Custom Habit to Plan">
                <form onSubmit={handleAddHabit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">New Goal Item</label>
                        <Input
                            placeholder="e.g. Mastery Session - 1 Hour"
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsHabitModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Add to Plan</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
