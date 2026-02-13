import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addHabit, toggleHabitCompletion, deleteHabit, fetchHabits, fetchHabitLogs } from '../store/habitsSlice';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle2, Plus, Trash2, X, Loader2, Square, CheckSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Habits() {
    const dispatch = useDispatch();
    const { habits, history, loading } = useSelector((state) => state.habits);
    const { user } = useSelector((state) => state.auth);

    const [newHabit, setNewHabit] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (user && habits.length === 0) {
            dispatch(fetchHabits());
            dispatch(fetchHabitLogs());
        }
    }, [dispatch, user, habits.length]);

    const handleToggle = (id) => {
        const today = new Date().toLocaleDateString('en-CA');
        dispatch(toggleHabitCompletion({ habitId: String(id), date: today }));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newHabit.trim()) return;

        await dispatch(addHabit({
            name: newHabit,
            frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Default to daily
            color: 'bg-primary'
        }));

        setNewHabit('');
        setIsAdding(false);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this habit?")) {
            dispatch(deleteHabit(id));
        }
    };

    // Helper to check completion for today
    const isCompletedToday = (habitId) => {
        const today = new Date().toLocaleDateString('en-CA');
        return history[today]?.some(id => String(id) === String(habitId));
    };

    // Calculate generic streak (mock logic for now, or based on history)
    const getStreak = (habitId) => {
        // Real streak calculation would require traversing history backwards
        return 0;
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
                    <p className="text-muted-foreground">Manage your daily routines.</p>
                </div>
                <Button onClick={() => setIsAdding(!isAdding)} size="icon" variant={isAdding ? "destructive" : "default"}>
                    {isAdding ? <X size={20} /> : <Plus size={20} />}
                </Button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleAdd}
                        className="overflow-hidden"
                    >
                        <Card className="mb-6 border-primary/50">
                            <CardContent className="pt-6 flex gap-2">
                                <Input
                                    placeholder="Enter new habit name..."
                                    value={newHabit}
                                    onChange={(e) => setNewHabit(e.target.value)}
                                    autoFocus
                                />
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : "Add"}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {habits.map((habit) => {
                    const completed = isCompletedToday(habit.id);
                    return (
                        <motion.div
                            key={habit.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Card className={cn("transition-all", completed ? "bg-secondary/20 border-transparent" : "hover:border-primary/30")}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleToggle(habit.id)}
                                            className={cn(
                                                "w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                                                completed ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" : "border-muted-foreground hover:border-emerald-500/50"
                                            )}
                                        >
                                            {completed ? <CheckSquare size={18} fill="currentColor" fillOpacity={0.2} /> : <Square size={18} />}
                                        </button>

                                        <div>
                                            <h3 className={cn("font-medium text-lg transition-all", completed && "text-muted-foreground line-through")}>
                                                {habit.name}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <span>Daily</span>
                                                {/* <span>•</span>
                                                <span className={cn(habit.streak > 0 && "text-orange-500 font-medium")}>
                                                    {habit.streak} day streak
                                                </span> */}
                                            </div>
                                        </div>
                                    </div>

                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(habit.id)}>
                                        <Trash2 size={18} />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}

                {habits.length === 0 && !loading && (
                    <div className="text-center py-12 text-muted-foreground">
                        No habits found. Start by adding one!
                    </div>
                )}
            </div>
        </div>
    );
}
