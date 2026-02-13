import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Sparkles, Send, User, Bot, Download, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PlanGraph from '../components/PlanGraph';
import OptimizationPlan from '../components/OptimizationPlan';
import { createPlan } from '../store/plansSlice';
import { addHabit } from '../store/habitsSlice';

export default function AIPlanner() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    // ... roles ...
    const [messages, setMessages] = useState([
        {
            id: 'init',
            type: 'ai',
            role: 'ai',
            content: "👋 Hi there! I'm your AI Routine Architect. I'll help you create a personalized habit plan. Let's start with your main goal. What would you like to achieve?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedPersonas, setSelectedPersonas] = useState([]);
    const [showPersonaOverlay, setShowPersonaOverlay] = useState(true);
    const [questionAnswers, setQuestionAnswers] = useState({});
    const messagesEndRef = useRef(null);

    const parseQuestions = (text) => {
        if (!text) return [];
        // Match numbered patterns like "1. Question text" or "1) Question text"
        const lines = text.split('\n');
        const questions = [];
        const questionRegex = /^(\d+[\.\)])\s*(.+)$/;

        lines.forEach(line => {
            const match = line.trim().match(questionRegex);
            if (match) {
                questions.push({
                    id: match[1],
                    label: match[2].trim()
                });
            }
        });
        return questions;
    };

    // ONLY show questions if the absolute latest message is from the AI
    const lastMessage = messages[messages.length - 1];
    const currentQuestions = lastMessage?.role === 'ai' ? parseQuestions(lastMessage?.content) : [];

    const personaOptions = [
        { id: 'student', label: 'Student', icon: '🎓' },
        { id: 'professional', label: 'Working Professional', icon: '💼' },
        { id: 'household', label: 'Household Woman', icon: '🏠' },
        { id: 'retired', label: 'Retired Civilian', icon: '🌳' }
    ];

    const togglePersona = (personaLabel) => {
        setSelectedPersonas(prev => {
            if (prev.includes(personaLabel)) {
                return prev.filter(p => p !== personaLabel);
            }
            if (prev.length < 2) {
                return [...prev, personaLabel];
            }
            // If already 2, replace the first one with the new one
            return [prev[1], personaLabel];
        });
    };

    const handleStartArchitecting = () => {
        if (selectedPersonas.length > 0) {
            setShowPersonaOverlay(false);
        }
    };

    const handleAddToDashboard = async (planData) => {
        try {
            // New structure check
            const title = planData.goal_analysis?.goal || planData.plan?.title || "My AI Plan";
            const schedule = planData.optimized_daily_schedule || [];

            // 1. Create the plan
            const plan = await dispatch(createPlan({
                title: title,
                description: `AI-optimized routine for ${title}`
            })).unwrap();

            // 2. Extract habits
            const habitsToSave = [];

            if (schedule.length > 0) {
                // New format: optimized_daily_schedule
                schedule.forEach(item => {
                    habitsToSave.push({
                        name: `${item.time_block}: ${item.activity}`,
                        frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        color: 'bg-primary',
                        plan_id: plan.id
                    });
                });
            } else if (planData.children) {
                // Compatibility with legacy format
                planData.children.forEach(section => {
                    if (section.children) {
                        section.children.forEach(item => {
                            habitsToSave.push({
                                name: item.title,
                                frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                color: section.title.includes('Routine') ? 'bg-primary' : 'bg-blue-500',
                                plan_id: plan.id
                            });
                        });
                    }
                });
            }

            // 3. Save all habits
            await Promise.all(habitsToSave.map(h => dispatch(addHabit(h)).unwrap()));

            // 4. Redirect
            navigate('/my-plans');
        } catch (error) {
            console.error("Failed to save plan:", error);
            alert("Failed to add plan to dashboard. Please check your connection.");
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        const isForm = currentQuestions.length > 0;
        let finalContent = '';

        if (isForm) {
            // Concatenate all answers
            finalContent = currentQuestions
                .map(q => `${q.id} ${questionAnswers[q.id] || 'N/A'}`)
                .join('\n');

            // Validate at least some input
            if (!Object.values(questionAnswers).some(val => val.trim())) return;
        } else {
            if (!input.trim() || isGenerating) return;
            finalContent = input;
        }

        let currentInput = finalContent;

        // Add persona context if selected
        if (selectedPersonas.length > 0) {
            const personaContext = `[Context: User identifies as ${selectedPersonas.join(' and ')}] `;
            currentInput = personaContext + currentInput;
        }

        // Reset inputs
        setInput('');
        setQuestionAnswers({});

        // 1. Add user message to state
        const userMessage = {
            id: Date.now(),
            type: 'user',
            role: 'user',
            content: finalContent // Display original input to user
        };

        const updatedMessagesForAI = [...messages, { ...userMessage, content: currentInput }];
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        setIsGenerating(true);

        try {
            // 2. Send full history to backend
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/generate-plan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: updatedMessagesForAI })
            });

            const data = await response.json();
            setIsTyping(false);
            setIsGenerating(false);

            if (data.success) {
                if (data.type === 'plan' && data.data) {
                    // AI generated the plan
                    const successMsg = {
                        id: Date.now() + 1,
                        type: 'ai',
                        role: 'ai',
                        content: "✨ I've analyzed your responses and generated your personalized Life Optimization Plan!"
                    };

                    const planMsg = {
                        id: Date.now() + 2,
                        type: 'plan', // Changed from graph to plan
                        role: 'ai',
                        data: data.data
                    };

                    setMessages(prev => [...prev, successMsg, planMsg]);
                } else if (data.type === 'text') {
                    // AI asked another question
                    const aiMessage = {
                        id: Date.now() + 1,
                        type: 'ai',
                        role: 'ai',
                        content: data.content
                    };
                    setMessages(prev => [...prev, aiMessage]);
                }
            } else {
                throw new Error(data.error || 'Failed to process request');
            }
        } catch (error) {
            console.error('AI Planner error:', error);
            setIsTyping(false);
            setIsGenerating(false);
            const errorMsg = {
                id: Date.now() + 1,
                type: 'ai',
                role: 'ai',
                content: `❌ Sorry, I encountered an error: ${error.message}. Please try again.`
            };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col  w-full relative overflow-hidden overflow-y-scroll  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Persona Overlay */}
            <AnimatePresence>
                {showPersonaOverlay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl"
                    >
                        <Card className="max-w-xl w-full bg-slate-900/50 border-white/10 p-8 sm:p-12 shadow-2xl h-[calc(100vh-50px)] relative overflow-hidden text-center space-y-8 overflow-y-scroll  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <div className="space-y-4">
                                {/* <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2">
                                    <Sparkles size={32} />
                                </div> */}
                                <h2 className="text-3xl font-black text-white tracking-tight">Who are we building for?</h2>
                                <p className="text-slate-400 text-lg">Select up to two roles to help me architect your routine.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {personaOptions.map((persona) => (
                                    <button
                                        key={persona.id}
                                        onClick={() => togglePersona(persona.label)}
                                        className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${selectedPersonas.includes(persona.label)
                                            ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/20'
                                            : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <span className="text-3xl">{persona.icon}</span>
                                        <span className="font-bold text-sm tracking-wide">{persona.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={handleStartArchitecting}
                                    disabled={selectedPersonas.length === 0}
                                    className="w-full h-14 text-lg font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-transform active:scale-95 disabled:opacity-50"
                                >
                                    Start Architecting Routine
                                </Button>
                                <p className="mt-4 text-xs text-slate-500 font-medium italic">
                                    {selectedPersonas.length > 0
                                        ? `Selected: ${selectedPersonas.join(' & ')}`
                                        : 'Please select at least one role to continue'}
                                </p>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Container */}
            <Card className="flex-1 flex flex-col bg-transparent border-none overflow-hidden shadow-xl rounded-2xl min-h-0 overflow-y-scroll scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                    <AnimatePresence>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${message.role === 'ai'
                                    ? 'bg-gradient-to-br from-primary to-accent text-white shadow-md'
                                    : 'bg-secondary text-foreground'
                                    }`}>
                                    {message.role === 'ai' ? <Bot size={18} /> : <User size={18} />}
                                </div>

                                {/* Message Content */}
                                <div className={`flex flex-col gap-2 ${message.type === 'graph' || message.type === 'plan' ? 'w-full' : 'max-w-[85%]'}`}>
                                    {message.type === 'plan' ? (
                                        <div className="w-full">
                                            <OptimizationPlan data={message.data} onSave={handleAddToDashboard} />
                                        </div>
                                    ) : message.type === 'graph' ? (
                                        <div className="w-full bg-transparent border-none rounded-2xl overflow-hidden min-h-[800px]">
                                            <PlanGraph data={{ plan: message.data }} />
                                            <div className="p-3 bg-transparent flex justify-end gap-2 text-xs">
                                                <Button size="sm" variant="ghost" className="h-7 gap-1 text-[10px] uppercase tracking-wider text-muted-foreground hover:bg-white/10">
                                                    <Download size={12} /> Save PDF
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 gap-1 text-[10px] uppercase tracking-wider bg-white/5 border-white/10 text-white"
                                                    onClick={() => handleAddToDashboard(message.data)}
                                                >
                                                    <Layout size={12} /> Add to Dashboard
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`rounded-2xl px-4 py-3 shadow-sm ${message.role === 'ai'
                                            ? 'bg-background border border-border/50 text-foreground'
                                            : 'bg-primary text-primary-foreground'
                                            }`}>
                                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                                {message.content}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mt-1">
                                <Bot size={18} className="text-white" />
                            </div>
                            <div className="bg-background border border-border/50 rounded-2xl px-4 py-3 shadow-sm">
                                <div className="flex gap-1.5 items-center">
                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-background border-t border-border/50 space-y-4">
                    {/* Persona Display Tags */}
                    {selectedPersonas.length > 0 && !showPersonaOverlay && (
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2">Architecting For:</span>
                            {selectedPersonas.map((persona) => (
                                <div
                                    key={persona}
                                    className="px-3 py-1 rounded-lg text-[11px] font-black bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider"
                                >
                                    {persona}
                                </div>
                            ))}
                            <button
                                onClick={() => setShowPersonaOverlay(true)}
                                className="text-[10px] font-bold text-slate-500 hover:text-primary transition-colors ml-2 underline underline-offset-2"
                            >
                                Change
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {currentQuestions.length > 0 ? (
                            <Card className="p-6 bg-secondary/5 border-dashed border-primary/20 space-y-6">
                                <div className="flex items-center gap-2 mb-4 border-b border-primary/10 pb-4">
                                    <Sparkles size={18} className="text-primary animate-pulse" />
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-primary">Detail Architect</h3>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Structured Analysis for Better Optimization</p>
                                    </div>
                                </div>
                                <div className="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        {currentQuestions.map((q) => (
                                            <div key={q.id} className="space-y-2">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-black">{q.id.replace(/[\.\)]/, '')}</span>
                                                    {q.label}
                                                </label>
                                                <Input
                                                    value={questionAnswers[q.id] || ''}
                                                    onChange={(e) => setQuestionAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                                    placeholder="Type your answer..."
                                                    className="bg-slate-900/50 border-white/5 focus:border-primary/40 h-11 text-sm rounded-xl transition-all"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-primary/10 flex justify-between items-center gap-4">
                                    <p className="text-[10px] text-slate-500 italic font-medium">Please answer at least one detail to continue architecting.</p>
                                    <Button
                                        onClick={handleSend}
                                        disabled={isGenerating}
                                        className="gap-2 h-12 px-10 shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-wider transition-all active:scale-95"
                                    >
                                        Architect Plan <Send size={16} />
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <div className="flex gap-3">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={isGenerating ? "Processing your blueprint..." : "Describe your goals or routine..."}
                                    className="flex-1 bg-slate-900/50 border border-white/5 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 rounded-2xl p-4 text-sm min-h-[60px] max-h-[200px] resize-none outline-none transition-all placeholder:text-slate-600"
                                    disabled={isTyping || isGenerating}
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping || isGenerating}
                                    className="h-14 px-6 shadow-xl shadow-primary/20 transition-all active:scale-95 self-end bg-primary hover:bg-primary/90 rounded-2xl"
                                >
                                    {isGenerating ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={20} />}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
