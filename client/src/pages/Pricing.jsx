import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Check, Sparkles, X, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Pricing() {
    const tiers = [
        {
            name: "Starter",
            price: "$0",
            description: "No more excuses. Start building consistency today.",
            features: [
                "Track up to 3 habits",
                "Basic analytics",
                "7-day history",
                "Manual routine planning"
            ],
            notIncluded: [
                "AI Routine Architect",
                "Unlimited history",
                "Advanced charts"
            ],
            cta: "start_free",
            popular: false,
            color: "border-white/10"
        },
        {
            name: "Pro",
            price: "$9",
            period: "/month",
            description: "For those obsessed with optimization.",
            features: [
                "Unlimited habits",
                "AI Routine Architect (GPT-4o)",
                "Full analytics suite",
                "Unlimited history",
                "Calendar integration",
                "Priority support"
            ],
            notIncluded: [],
            cta: "start_trial",
            popular: true,
            color: "border-primary shadow-2xl shadow-primary/20"
        },
        {
            name: "Lifetime",
            price: "$199",
            period: "/once",
            description: "Commit to the long game. Pay once, own it forever.",
            features: [
                "Everything in Pro",
                "Lifetime access",
                "Early access to beta features",
                "Exclusive community badge"
            ],
            notIncluded: [],
            cta: "get_lifetime",
            popular: false,
            color: "border-accent shadow-xl shadow-accent/10"
        }
    ];

    return (
        <div className="animate-in fade-in duration-500">
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-5xl mx-auto space-y-20 relative z-10">
                    <div className="text-center space-y-6">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                            Invest in Your <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">Future Self.</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            The cost of inconsistency is high. The cost of Habitica is... actually pretty low.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {tiers.map((tier, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="h-full"
                            >
                                <Card className={`h-full flex flex-col relative bg-card/50 backdrop-blur-sm border ${tier.color} transition-transform hover:-translate-y-2 duration-300`}>
                                    {tier.popular && (
                                        <div className="absolute -top-5 left-0 right-0 flex justify-center">
                                            <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-primary/40 uppercase tracking-widest border border-white/20">
                                                <Zap size={12} fill="currentColor" /> Best Value
                                            </span>
                                        </div>
                                    )}
                                    <div className={`absolute inset-0 bg-gradient-to-b ${tier.popular ? 'from-primary/5' : 'from-white/5'} to-transparent opacity-50 pointer-events-none`} />

                                    <CardHeader className="pb-8 pt-8">
                                        <CardTitle className="text-2xl text-white font-bold">{tier.name}</CardTitle>
                                        <CardDescription className="text-base text-gray-400 mt-2">{tier.description}</CardDescription>
                                        <div className="mt-6 flex items-baseline gap-1">
                                            <span className="text-5xl font-black text-white">{tier.price}</span>
                                            {tier.period && <span className="text-gray-500 font-medium">{tier.period}</span>}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 space-y-6">
                                        <div className="space-y-4">
                                            {tier.features.map((feature, j) => (
                                                <div key={j} className="flex items-start gap-3 text-sm">
                                                    <div className={`mt-0.5 w-5 h-5 rounded-full ${tier.popular ? 'bg-primary text-white' : 'bg-white/10 text-gray-300'} flex items-center justify-center shrink-0`}>
                                                        <Check size={12} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-gray-300">{feature}</span>
                                                </div>
                                            ))}
                                            {tier.notIncluded.map((feature, j) => (
                                                <div key={j} className="flex items-start gap-3 text-sm opacity-50">
                                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-transparent border border-white/10 flex items-center justify-center shrink-0">
                                                        <X size={12} />
                                                    </div>
                                                    <span className="text-gray-500">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-8">
                                        <Link to="/dashboard" className="w-full">
                                            <Button
                                                className={`w-full h-12 text-base font-bold rounded-xl ${tier.popular ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                                            >
                                                {tier.cta === 'start_free' && "Start For Free"}
                                                {tier.cta === 'start_trial' && "Start 14-Day Free Trial"}
                                                {tier.cta === 'get_lifetime' && "Get Lifetime Access"}
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center pt-10 border-t border-white/5">
                        <p className="text-gray-500">
                            Enterprise or Team? <Link to="/contact" className="text-primary hover:text-accent transition-colors font-medium">Contact Sales</Link>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
