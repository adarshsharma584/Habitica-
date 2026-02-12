import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { User, Mail, Calendar, Target, TrendingUp, LogOut, Shield, Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { logout } from '../store/authSlice';

export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { habits, history } = useSelector((state) => state.habits);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        dispatch(logout());
        navigate('/login');
    };

    // Calculate user stats
    const totalHabits = habits.length;
    const totalCompletions = Object.values(history).reduce((sum, day) => sum + day.length, 0);
    const daysTracked = Object.keys(history).length;
    const avgCompletionRate = daysTracked > 0
        ? Math.round((totalCompletions / (daysTracked * totalHabits || 1)) * 100)
        : 0;

    // Get user initials for avatar
    const getInitials = (email) => {
        if (!email) return 'U';
        return email.charAt(0).toUpperCase();
    };

    const userEmail = user?.email || 'user@example.com';
    const joinedDate = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recently';

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
                <p className="text-muted-foreground">Manage your account and track your progress</p>
            </div>

            {/* User Info Card */}
            <Card className="border-border/50">
                <CardHeader>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {getInitials(userEmail)}
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-2xl">{userEmail.split('@')[0]}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <Mail size={14} />
                                {userEmail}
                            </CardDescription>
                            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                <Calendar size={12} />
                                Joined {joinedDate}
                            </p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-border/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Target className="text-primary" size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalHabits}</p>
                                <p className="text-sm text-muted-foreground">Total Habits</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-emerald-500/10">
                                <TrendingUp className="text-emerald-500" size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalCompletions}</p>
                                <p className="text-sm text-muted-foreground">Completions</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-blue-500/10">
                                <Calendar className="text-blue-500" size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{avgCompletionRate}%</p>
                                <p className="text-sm text-muted-foreground">Avg. Rate</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Account Settings */}
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your preferences and security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button variant="ghost" className="w-full justify-start h-12 border border-border/50 hover:bg-secondary/50">
                        <Bell className="mr-3 h-5 w-5 text-muted-foreground" />
                        <div className="flex-1 text-left">
                            <p className="font-medium">Notifications</p>
                            <p className="text-xs text-muted-foreground">Manage your notification preferences</p>
                        </div>
                    </Button>

                    <Button variant="ghost" className="w-full justify-start h-12 border border-border/50 hover:bg-secondary/50">
                        <Shield className="mr-3 h-5 w-5 text-muted-foreground" />
                        <div className="flex-1 text-left">
                            <p className="font-medium">Privacy & Security</p>
                            <p className="text-xs text-muted-foreground">Update password and security settings</p>
                        </div>
                    </Button>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        variant="destructive"
                        className="w-full justify-start h-12"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
