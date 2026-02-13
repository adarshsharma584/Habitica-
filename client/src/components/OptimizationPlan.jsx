import React from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    Target,
    Zap,
    Layout,
    Youtube,
    Globe,
    Apple,
    Wrench,
    Lightbulb,
    Brain,
    Calendar,
    ArrowRight,
    ExternalLink,
    CheckSquare,
    Sparkles
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

export default function OptimizationPlan({ data, onSave }) {
    if (!data) return null;

    const {
        goal_analysis,
        routine_summary,
        optimized_daily_schedule,
        weekly_strategy,
        mental_balance_plan,
        productivity_methods,
        recommended_resources,
        extra_tips
    } = data;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-4xl mx-auto space-y-12 py-8"
        >
            {/* Header / Goal Analysis */}
            <motion.section variants={item} className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <Target size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Goal Optimization</h2>
                </div>

                <Card className="p-8 bg-slate-900/40 border-white/5 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${goal_analysis?.difficulty_level === 'High'
                            ? 'bg-red-500/10 border-red-500/20 text-red-500'
                            : goal_analysis?.difficulty_level === 'Moderate'
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                : 'bg-green-500/10 border-green-500/20 text-green-500'
                            }`}>
                            {goal_analysis?.difficulty_level} Intensity
                        </span>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">
                                {goal_analysis?.goal}
                            </h3>
                            <p className="text-slate-400 font-medium flex items-center gap-2">
                                <Calendar size={16} /> Target Deadline: {goal_analysis?.deadline}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5 text-left">
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Key Focus Areas</h4>
                                <div className="flex flex-wrap gap-2">
                                    {goal_analysis?.key_focus_areas?.map((focus, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs font-bold text-slate-200 border border-white/5">
                                            {focus}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Routine Summary</h4>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black text-primary">{routine_summary?.available_productive_hours}h</span>
                                        <span className="text-[10px] text-slate-500 uppercase font-black">Daily Productive</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/5" />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-300">Energy Strategy</span>
                                        <span className="text-[10px] text-slate-500 font-medium">{routine_summary?.energy_alignment_strategy}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.section>

            {/* Optimized Schedule - Timeline View */}
            <motion.section variants={item} className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                            <Clock size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Optimized Daily Schedule</h2>
                    </div>
                    <div className="hidden sm:block h-px flex-1 mx-8 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="space-y-4 relative">
                    <div className="absolute left-[20px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-slate-800 to-transparent opacity-20" />

                    {optimized_daily_schedule?.map((slot, i) => (
                        <div key={i} className="group relative pl-12">
                            <div className="absolute left-0 top-1.5 w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center z-10 group-hover:border-primary/50 transition-colors">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                            </div>

                            <Card className="p-6 bg-slate-900/30 border-white/5 hover:border-white/10 transition-all text-left">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-primary uppercase tracking-widest">{slot.time_block}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                                            <span className="text-xs font-bold text-slate-500 italic">{slot.purpose}</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-white tracking-tight">{slot.activity}</h4>
                                    </div>
                                    <ArrowRight className="hidden sm:block text-slate-700 group-hover:text-primary transition-colors" size={20} />
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* Weekly Strategy */}
            {weekly_strategy?.length > 0 && (
                <motion.section variants={item} className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600">
                            <Layout size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Weekly Strategy</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                        {weekly_strategy.map((strategy, i) => (
                            <Card key={i} className="p-6 bg-slate-900/40 border-white/5 border-l-2 border-l-blue-600 shadow-xl overflow-hidden group">
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">Phase {i + 1}</span>
                                <p className="text-sm font-bold text-slate-200 leading-relaxed group-hover:text-white transition-colors">
                                    {typeof strategy === 'string' ? strategy : strategy.strategy || strategy.title || JSON.stringify(strategy)}
                                </p>
                            </Card>
                        ))}
                    </div>
                </motion.section>
            )}

            {/* Strategies & Wellness */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                <motion.section variants={item} className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                            <Brain size={20} />
                        </div>
                        <h3 className="font-black text-white tracking-tight">Mental Balance Plan</h3>
                    </div>
                    <div className="space-y-3">
                        {mental_balance_plan?.map((plan, i) => (
                            <div key={i} className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                <span className="text-sm font-medium text-slate-300 leading-relaxed">
                                    {typeof plan === 'string' ? plan : plan.activity || plan.title || JSON.stringify(plan)}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.section>

                <motion.section variants={item} className="space-y-6 text-left">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                            <Zap size={20} />
                        </div>
                        <h3 className="font-black text-white tracking-tight">Productivity Methods</h3>
                    </div>
                    <div className="space-y-3">
                        {productivity_methods?.map((method, i) => (
                            <div key={i} className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                                <CheckSquare size={16} className="text-purple-500 mt-1 shrink-0" />
                                <span className="text-sm font-medium text-slate-300 leading-relaxed">
                                    {typeof method === 'string' ? method : method.title || JSON.stringify(method)}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </div>

            {/* Resources */}
            <motion.section variants={item} className="space-y-8 pt-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                        <Globe size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Curated Resources</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {recommended_resources?.youtube_videos?.map((vid, i) => (
                        <Card key={i} className="p-6 bg-slate-900/40 border-white/5 hover:border-red-500/20 transition-all text-left flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                                        <Youtube size={20} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Video</span>
                                </div>
                                <div>
                                    <h5 className="font-bold text-white mb-2 line-clamp-2 leading-tight">{vid.title}</h5>
                                    <p className="text-xs text-slate-500 italic line-clamp-2 leading-relaxed">{vid.why_recommended}</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="mt-6 w-full gap-2 text-xs font-bold py-2 bg-white/5 hover:bg-red-500 hover:text-white transition-all" onClick={() => window.open(vid.url, '_blank')}>
                                Watch Tutorial <ExternalLink size={12} />
                            </Button>
                        </Card>
                    ))}

                    {recommended_resources?.articles_or_websites?.map((art, i) => (
                        <Card key={i} className="p-6 bg-slate-900/40 border-white/5 hover:border-primary/20 transition-all text-left flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Globe size={20} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Article</span>
                                </div>
                                <div>
                                    <h5 className="font-bold text-white mb-2 line-clamp-2 leading-tight">{art.title}</h5>
                                    <p className="text-xs text-slate-500 italic line-clamp-2 leading-relaxed">{art.why_recommended}</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="mt-6 w-full gap-2 text-xs font-bold py-2 bg-white/5 hover:bg-primary hover:text-white transition-all" onClick={() => (art.url ? window.open(art.url, '_blank') : null)}>
                                Read Article <ExternalLink size={12} />
                            </Button>
                        </Card>
                    ))}

                    {recommended_resources?.diet_resources?.map((diet, i) => (
                        <Card key={i} className="p-6 bg-slate-900/40 border-white/5 hover:border-green-500/20 transition-all text-left flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                                        <Apple size={20} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Diet Plan</span>
                                </div>
                                <div>
                                    <h5 className="font-bold text-white mb-2 line-clamp-2 leading-tight">
                                        {typeof diet === 'string' ? diet : diet.title || diet.food || "Nutrition Guide"}
                                    </h5>
                                    {diet.why_recommended && (
                                        <p className="text-xs text-slate-500 italic line-clamp-2 leading-relaxed">{diet.why_recommended}</p>
                                    )}
                                </div>
                            </div>
                            {diet.url && (
                                <Button variant="ghost" className="mt-6 w-full gap-2 text-xs font-bold py-2 bg-white/5 hover:bg-green-500 hover:text-white transition-all" onClick={() => window.open(diet.url, '_blank')}>
                                    View Nutrition <ExternalLink size={12} />
                                </Button>
                            )}
                        </Card>
                    ))}

                    {recommended_resources?.productivity_tools?.map((tool, i) => (
                        <Card key={i} className="p-6 bg-slate-900/40 border-white/5 hover:border-amber-500/20 transition-all text-left flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                                        <Wrench size={20} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Tool</span>
                                </div>
                                <div>
                                    <h5 className="font-bold text-white mb-2 line-clamp-2 leading-tight">
                                        {typeof tool === 'string' ? tool : tool.title || tool.name || "Utility"}
                                    </h5>
                                    {tool.why_recommended && (
                                        <p className="text-xs text-slate-500 italic line-clamp-2 leading-relaxed">{tool.why_recommended}</p>
                                    )}
                                </div>
                            </div>
                            {tool.url && (
                                <Button variant="ghost" className="mt-6 w-full gap-2 text-xs font-bold py-2 bg-white/5 hover:bg-amber-500 hover:text-white transition-all" onClick={() => window.open(tool.url, '_blank')}>
                                    Try Tool <ExternalLink size={12} />
                                </Button>
                            )}
                        </Card>
                    ))}
                </div>
            </motion.section>

            {/* Extra Tips */}
            <motion.section variants={item} className="pt-8">
                <Card className="p-8 bg-gradient-to-br from-primary/10 to-purple-600/10 border-primary/20 relative overflow-hidden text-left">
                    <div className="absolute -right-8 -bottom-8 p-12 text-primary/10 rotate-12">
                        <Lightbulb size={120} />
                    </div>
                    <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                        <Sparkles className="text-primary" /> Pro Tips for Consistency
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                        {extra_tips?.map((tip, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="p-1 rounded bg-primary/20 text-primary mt-1">
                                    <ArrowRight size={10} />
                                </div>
                                <p className="text-sm font-medium text-slate-300 leading-relaxed">
                                    {typeof tip === 'string' ? tip : tip.tip || tip.title || JSON.stringify(tip)}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.section>

            {/* Bottom Actions */}
            <motion.div variants={item} className="flex justify-center gap-4 pt-8">
                <Button
                    onClick={() => onSave(data)}
                    className="h-12 px-8 bg-white text-slate-900 font-black hover:bg-slate-200 shadow-2xl"
                >
                    Add to Dashboard
                </Button>
                <Button variant="outline" className="h-12 px-8 border-white/10 bg-white/5 text-white font-black hover:bg-white/10">
                    Download PDF
                </Button>
            </motion.div>
        </motion.div>
    );
}
