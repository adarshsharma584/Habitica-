import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            let msg = error.message;
            if (msg === "Invalid login credentials") {
                msg = "Invalid credentials. Please check your password or confirm your email address.";
            }
            setError(msg);
        } else {
            navigate('/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-500">
            <div className="w-full max-w-md space-y-8 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-primary/20 blur-[100px] pointer-events-none rounded-full" />

                <div className="text-center relative z-10">
                    <Link to="/" className="inline-flex items-center gap-2 font-bold text-3xl tracking-tighter mb-8 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Sparkles size={20} fill="currentColor" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Habitica</span>
                    </Link>
                </div>

                <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl relative z-10">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight text-white">Welcome back</CardTitle>
                        <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Email</label>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50"
                                />
                            </div>

                            {error && (
                                <div className="text-red-400 text-sm p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                    {error}
                                </div>
                            )}

                            <Button disabled={loading} type="submit" className="w-full font-bold h-11 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
