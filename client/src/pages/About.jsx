import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Target, Heart, Zap, Award, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <div className="flex flex-col relative overflow-hidden bg-slate-950">

            {/* Ambient Background Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />

            {/* Hero Section */}
            <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-6 overflow-hidden">
                <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-primary-foreground border border-white/10 backdrop-blur-md"
                    >
                        <Award size={16} className="text-primary" />
                        <span className="text-xs font-bold tracking-[0.2em] uppercase">The Science of Consistency</span>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-white">
                        ENGINEERING <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-emerald-400 to-accent">HUMAN POTENTIAL.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-medium max-w-3xl mx-auto">
                        In a world of fleeting motivation, we build the systems that protect your progress.
                        Habitica is more than a tracker; it's a <span className="text-white">Neural Integrity Engine.</span>
                    </p>
                </div>
            </section>

            {/* Values (Bento Grid) */}
            <section className="py-24 px-6 relative z-10">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-6 gap-6">
                        {/* Featured Goal */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="md:col-span-4 h-[450px] rounded-[3rem] bg-slate-900 border border-white/5 p-12 flex flex-col justify-between group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Target size={180} />
                            </div>
                            <div className="space-y-6 z-10">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <Target size={32} />
                                </div>
                                <h3 className="text-4xl font-black text-white leading-tight">Precision Over Willpower.</h3>
                                <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                                    Willpower is a finite biological resource. We replace it with automated precision, using AI to engineer routines that don't depend on how you "feel" today.
                                </p>
                            </div>
                            <div className="z-10 flex items-center gap-4">
                                <div className="h-[2px] w-24 bg-primary" />
                                <span className="text-xs font-black text-primary uppercase tracking-widest">Systematic Execution</span>
                            </div>
                        </motion.div>

                        {/* High Energy Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="md:col-span-2 h-[450px] rounded-[3rem] bg-linear-to-br from-accent/20 to-slate-900 border border-white/10 p-10 flex flex-col justify-between"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                                <Zap size={28} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-white">Neural Adaptation.</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Our algorithms learn your failure points—the 4 PM slumps, the weekend drops—and build defensive routines to keep your momentum alive.
                                </p>
                            </div>
                        </motion.div>

                        {/* Tribe Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="md:col-span-3 h-[400px] rounded-[3rem] bg-slate-900 border border-white/5 p-12 flex flex-col justify-between"
                        >
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800" />
                                ))}
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-white">The Elite Tribe.</h3>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    Success is social. Join a global network of high-performers who push the boundaries of what's possible with human discipline.
                                </p>
                            </div>
                        </motion.div>

                        {/* Momentum Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="md:col-span-3 h-[400px] rounded-[3rem] bg-linear-to-br from-primary/10 to-slate-900 border border-primary/10 p-12 flex flex-col justify-between overflow-hidden relative"
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none">
                                <TrendingUp size={300} strokeWidth={1} />
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                                <Sparkles size={28} />
                            </div>
                            <div className="space-y-4 z-10">
                                <h3 className="text-3xl font-black text-white">Visual Velocity.</h3>
                                <p className="text-slate-400 text-lg leading-relaxed text-balance">
                                    Momentum you can see. We use military-grade data visualization to show you exactly how close you are to your next evolution.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* The Genesis (Story) */}
            <section className="py-24 px-6 relative">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row gap-20 items-center">
                        <div className="flex-1 space-y-10">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">From Spreadsheet <br />to SaaS.</h2>
                                <div className="h-1 w-32 bg-primary rounded-full" />
                            </div>

                            <div className="space-y-6 text-xl text-slate-400 leading-relaxed font-medium">
                                <p>
                                    It started as an obsession. We were high-performers who reached the limit of willpower. We realized that the difference between the top 1% and everyone else wasn't effort—it was <span className="text-white">infrastructure.</span>
                                </p>
                                <p>
                                    We spent 2 years analyzing habit data, behavioral psychology, and AI-driven scheduling. Habitica is the result: a tracker that thinks, adapts, and wins with you.
                                </p>
                                <p className="text-white font-black italic border-l-8 border-primary pl-8 text-2xl py-4">
                                    "We didn't build a checklist. We built a mirror for your future self."
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 w-full relative">
                            <motion.div
                                whileHover={{ scale: 1.02, rotateY: -5 }}
                                className="relative z-10 p-10 rounded-[3rem] bg-slate-900 border border-white/10 shadow-2xl overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-primary/5 blur-[80px]" />
                                <div className="relative space-y-10">
                                    <div className="flex justify-between items-center text-slate-500 uppercase text-xs font-black tracking-widest">
                                        <span>Build Status</span>
                                        <span className="text-primary">Staging Release</span>
                                    </div>
                                    <div className="space-y-8">
                                        {[
                                            { label: "AI Core", progress: "98%" },
                                            { label: "Neural Mapping", progress: "85%" },
                                            { label: "Tribe Network", progress: "92%" }
                                        ].map((stat, i) => (
                                            <div key={i} className="space-y-3">
                                                <div className="flex justify-between text-sm font-bold">
                                                    <span className="text-white">{stat.label}</span>
                                                    <span className="text-slate-500">{stat.progress}</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: stat.progress }}
                                                        transition={{ duration: 1, delay: i * 0.2 }}
                                                        className="h-full bg-linear-to-r from-primary to-emerald-400"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-6 flex items-center justify-center gap-4">
                                        <div className="p-4 rounded-full bg-white/5 border border-white/10">
                                            <Heart className="text-red-500 fill-red-500/20" />
                                        </div>
                                        <div>
                                            <p className="font-black text-white uppercase text-sm">Built with obsession.</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">San Francisco • 2026</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Decorative Grid */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(16,185,129,0.05)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-40 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 blur-[120px] pointer-events-none" />
                <div className="container mx-auto max-w-4xl text-center space-y-10 relative z-10">
                    <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">Your Potential is <br />Mathematical.</h2>
                    <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
                        Stop guessing. Start engineering. The first step to your new routine is 10 seconds away.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/ai-planner">
                            <Button size="lg" className="h-20 px-12 text-xl rounded-full font-black shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                                Architect Your Routine
                            </Button>
                        </Link>
                        <Link to="/pricing">
                            <Button variant="ghost" size="lg" className="h-20 px-12 text-xl rounded-full font-bold text-white hover:bg-white/5 border border-white/10 group">
                                Elite Pricing <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </Link>
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
