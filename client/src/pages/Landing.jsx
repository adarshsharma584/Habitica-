import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Sparkles, CheckCircle, BarChart, Calendar, Star, ArrowRight, Zap, Trophy, Flame, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';


export default function Landing() {
    return (
        <div className="flex flex-col relative overflow-hidden bg-slate-950">

            {/* Ambient Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />

            {/* Hero Section */}
            <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-6 overflow-hidden">
                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8 text-left"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-primary-foreground border border-white/10 backdrop-blur-md">
                                <Sparkles size={16} className="text-primary" />
                                <span className="text-sm font-bold tracking-tight uppercase">The Evolution of Productivity</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-white">
                                ENGINEER <br />
                                YOUR <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-emerald-400 to-accent">MOMENTUM.</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-400 max-w-xl leading-relaxed font-medium">
                                Forget generic habit trackers. Habitica uses <span className="text-white">Neural Adaptation AI</span> to build routines that evolve with your performance.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                                <Link to="/ai-planner">
                                    <Button size="lg" className="h-16 px-10 text-lg rounded-full font-black shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                                        Start Your Journey
                                    </Button>
                                </Link>
                                <Link to="/pricing">
                                    <Button variant="ghost" size="lg" className="h-16 px-10 text-lg rounded-full font-bold text-white hover:bg-white/5 group">
                                        View Pricing <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex items-center gap-6 pt-8">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-gradient-to-tr from-slate-800 to-slate-700 shadow-xl" />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-400 font-bold">
                                    Joined by <span className="text-white">5,240+</span> performance seekers
                                </p>
                            </div>
                        </motion.div>

                        {/* Interactive Floating Preview */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                            animate={{ opacity: 1, scale: 1, rotateY: -5 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative z-20 p-4 rounded-[2.5rem] bg-slate-900/50 backdrop-blur-3xl border border-white/10 shadow-[0_0_100px_rgba(16,185,129,0.15)] overflow-hidden">
                                <div className="bg-slate-800/50 rounded-2xl p-6 mb-4 flex items-center justify-between border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                                    </div>
                                    <div className="h-2 w-32 bg-slate-700/50 rounded-full" />
                                </div>
                                <div className="space-y-6">
                                    <div className="h-32 rounded-xl bg-linear-to-br from-emerald-500/20 to-transparent p-6 border border-emerald-500/10">
                                        <div className="h-2 w-24 bg-emerald-500/40 rounded-full mb-4" />
                                        <div className="h-1 w-full bg-slate-700/30 rounded-full mb-2" />
                                        <div className="h-1 w-5/6 bg-slate-700/30 rounded-full" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-24 rounded-xl bg-slate-800/40 border border-white/5" />
                                        <div className="h-24 rounded-xl bg-slate-800/40 border border-white/5" />
                                    </div>
                                    <div className="h-20 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <Sparkles className="text-primary w-8 h-8 animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            {/* Floating Decorative Elements */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute top-[-20px] right-[-20px] z-30 p-4 rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 shadow-2xl"
                            >
                                <TrendingUp className="text-emerald-400 w-6 h-6" />
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                                className="absolute bottom-[40px] left-[-40px] z-30 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
                            >
                                <Flame className="text-orange-500 w-6 h-6" />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trusted By (Infinite Marquee) */}
            <section className="py-20 border-y border-white/5 bg-slate-900/20 backdrop-blur-sm overflow-hidden">
                <div className="container mx-auto px-6 mb-12 text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-[0.3em] font-black">Trusted by Elite Teams Worldwide</p>
                </div>

                <div className="flex overflow-hidden group">
                    <div className="flex space-x-12 animate-marquee whitespace-nowrap py-4">
                        {Array(4).fill(['NEXUS', 'OBLIVION', 'VORTEX', 'SYNTH', 'ECHO', 'PULSE', 'QUANTUM']).flat().map((logo, i) => (
                            <span key={i} className="text-4xl md:text-5xl font-black tracking-tighter text-slate-700 hover:text-primary transition-colors cursor-default select-none px-4 italic opacity-50 hover:opacity-100">
                                {logo}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee 30s linear infinite;
                }
                .group:hover .animate-marquee {
                    animation-play-state: paused;
                }
            `}</style>

            {/* Features (Bento Grid) */}
            <section className="py-32 relative">
                <div className="container mx-auto px-6">
                    <div className="text-left mb-20 space-y-4">
                        <div className="flex items-center gap-2 text-primary uppercase tracking-[0.2em] font-black text-xs">
                            <Zap size={14} fill="currentColor" />
                            <span>Core Engine Features</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">The Consistency Operating System.</h2>
                        <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">Built for those who demand more from their routine.</p>
                    </div>

                    <div className="grid md:grid-cols-6 gap-6">
                        {/* Featured Card 1 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-3 h-[400px] rounded-[2.5rem] bg-slate-900 border border-white/5 p-10 flex flex-col justify-between group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles size={120} />
                            </div>
                            <div className="space-y-4 z-10">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Sparkles size={24} />
                                </div>
                                <h3 className="text-3xl font-black text-white">Context-Aware AI Architect</h3>
                                <p className="text-slate-400 text-lg leading-relaxed">Most apps just list habits. Ours analyzes your performance patterns, energy levels, and schedule to build the perfect roadmap.</p>
                            </div>
                            <div className="z-10 bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                <span className="text-xs font-bold text-primary uppercase">Active Adaptation</span>
                            </div>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-3 h-[400px] rounded-[2.5rem] bg-linear-to-br from-primary/20 to-slate-900 border border-primary/20 p-10 flex flex-col justify-between group"
                        >
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                                    <Trophy size={24} />
                                </div>
                                <h3 className="text-3xl font-black text-white">Dopamine Engineering</h3>
                                <p className="text-slate-200/80 text-lg leading-relaxed">Gamified streaks and visual momentum feedback that make discipline feel like your favorite RPG.</p>
                            </div>
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900" />)}
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold">+500</div>
                            </div>
                        </motion.div>

                        {/* Smaller Cards */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-2 h-[300px] rounded-[2.5rem] bg-slate-900 border border-white/5 p-8 flex flex-col justify-between"
                        >
                            <BarChart size={32} className="text-accent" />
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">Deep Performance Data</h4>
                                <p className="text-slate-500 text-sm">Quantify your discipline with military-grade analytics.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-2 h-[300px] rounded-[2.5rem] bg-slate-900 border border-white/5 p-8 flex flex-col justify-between"
                        >
                            <Calendar size={32} className="text-orange-400" />
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">Adaptive Sprints</h4>
                                <p className="text-slate-500 text-sm">The system shifts your goals as your life gets busier.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-2 h-[300px] rounded-[2.5rem] bg-linear-to-br from-accent/20 to-slate-900 border border-white/5 p-8 flex flex-col justify-between"
                        >
                            <Zap size={32} className="text-white fill-white" />
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">Instant Validation</h4>
                                <p className="text-slate-500 text-sm">Real-time reward loops for every successfully tracked habit.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* The Science section */}
            <section className="py-24 bg-slate-900/50">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="rounded-[3rem] border border-white/10 p-12 md:p-20 bg-slate-900 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-accent to-primary" />
                        <div className="flex flex-col md:flex-row gap-16 items-center">
                            <div className="flex-1 space-y-6">
                                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Neural Routine Science.</h2>
                                <p className="text-slate-400 text-lg leading-relaxed italic">
                                    "Traditional habit tracking fails because it assumes willpower is constant. Habitica treats consistency as a biological system that needs optimization."
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle size={20} className="text-primary" />
                                        <span className="text-slate-300 font-medium">85% increase in habit retention vs. static apps</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle size={20} className="text-primary" />
                                        <span className="text-slate-300 font-medium">Adaptive difficulty preventing "Burnout Loops"</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-10 bg-white/5 rounded-3xl border border-white/10">
                                <TrendingUp size={80} className="text-primary mb-4" />
                                <span className="text-4xl font-black text-white">4.2x</span>
                                <span className="text-xs text-slate-500 uppercase font-black tracking-widest mt-2">Retention Rate</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl md:text-6xl font-black text-center mb-24 text-white">Used by Modern Titans.</h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                quote: "I used to break every streak after 3 days. Habitica analyzed my energy lows and moved my gym sessions to 4 PM. 150 days later, I haven't missed once.",
                                author: "Alex Sterling",
                                role: "Tech Founder"
                            },
                            {
                                quote: "The AI routine designer is terrifyingly accurate. It knew I'd quit my diet on weekends and built specific 'Safety Routines' to catch me.",
                                author: "Maria Velez",
                                role: "Pro Athlete"
                            },
                            {
                                quote: "Sleek, obsidian, and powerful. Finally, a tool that respects the complexity of building a high-performance life.",
                                author: "Jared Crane",
                                role: "Performance Coach"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                className="bg-slate-900 border border-white/5 p-10 rounded-[2.5rem] relative"
                            >
                                <div className="absolute top-[-20px] left-10">
                                    <div className="flex gap-1 text-primary">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                    </div>
                                </div>
                                <p className="text-xl font-medium text-slate-200 leading-relaxed mb-8 italic">"{item.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10" />
                                    <div>
                                        <p className="font-black text-white uppercase text-sm">{item.author}</p>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-widest">{item.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Simplified Pricing Section */}
            <section className="py-24 bg-slate-950">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto rounded-[4rem] bg-linear-to-b from-slate-900 to-slate-950 border border-white/10 p-12 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 blur-[100px] pointer-events-none" />
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">Ready to Master Consistency?</h2>
                        <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">Join the new era of high performance. No credit card required to start your first plan.</p>

                        <div className="grid md:grid-cols-2 gap-8 text-left">
                            <div className="p-8 rounded-3xl bg-slate-800/20 border border-white/5">
                                <h4 className="text-primary font-black uppercase text-xs tracking-widest mb-4">The Free Tier</h4>
                                <div className="text-4xl font-black text-white mb-6">$0 <span className="text-lg text-slate-500">/ forever</span></div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle size={16} className="text-primary" /> 3 AI Roadmaps / month</li>
                                    <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle size={16} className="text-primary" /> Basic Habit Tracking</li>
                                    <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle size={16} className="text-primary" /> Community Leaderboards</li>
                                </ul>
                                <Link to="/signup" className="w-full">
                                    <Button className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold border border-white/10">Start for Free</Button>
                                </Link>
                            </div>
                            <div className="p-8 rounded-3xl bg-primary/10 border border-primary/20 relative">
                                <div className="absolute top-4 right-4 bg-primary text-black text-[10px] font-black px-2 py-1 rounded-full uppercase">Most Popular</div>
                                <h4 className="text-primary font-black uppercase text-xs tracking-widest mb-4">Elite Access</h4>
                                <div className="text-4xl font-black text-white mb-6">$19 <span className="text-lg text-slate-500">/ month</span></div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2 text-sm text-slate-200"><CheckCircle size={16} className="text-primary fill-primary/20" /> Unlimited AI Generations</li>
                                    <li className="flex items-center gap-2 text-sm text-slate-200"><CheckCircle size={16} className="text-primary fill-primary/20" /> Advanced Neural Analytics</li>
                                    <li className="flex items-center gap-2 text-sm text-slate-200"><CheckCircle size={16} className="text-primary fill-primary/20" /> Context-Aware Reminders</li>
                                </ul>
                                <Link to="/signup" className="w-full">
                                    <Button className="w-full h-12 rounded-xl bg-primary hover:bg-emerald-400 text-black font-black font-sans">Get Elite Access</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary">
                            <Sparkles size={20} className="text-black" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white italic underline decoration-primary decoration-4">HABITICA.AI</span>
                    </div>
                    <div className="flex items-center gap-8 text-sm text-slate-500 font-bold uppercase tracking-widest">
                        <Link to="/about" className="hover:text-white transition-colors">About</Link>
                        <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">© 2026 Habitica Consistency Engine. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
