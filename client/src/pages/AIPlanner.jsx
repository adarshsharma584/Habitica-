import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Sparkles, Send, User, Bot, Download, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PlanGraph from '../components/PlanGraph';
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
    const messagesEndRef = useRef(null);

    const handleAddToDashboard = async (planData) => {
        try {
            // 1. Create the plan
            const plan = await dispatch(createPlan({
                title: planData.title,
                description: `AI-generated routine for ${planData.title}`
            })).unwrap();

            // 2. Extract habits from children
            // Daily Routine items, Roadmap milestones, etc.
            const habitsToSave = [];
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
        if (!input.trim() || isGenerating) return;

        const currentInput = input;
        setInput('');

        // 1. Add user message to state
        const userMessage = {
            id: Date.now(),
            type: 'user',
            role: 'user',
            content: currentInput
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setIsTyping(true);
        setIsGenerating(true);

        try {
            // 2. Send full history to backend
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/generate-plan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: updatedMessages })
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
                        content: "✨ I've analyzed your responses and generated your personalized plan! Here is the interactive visualization of your routine:"
                    };

                    const graphMsg = {
                        id: Date.now() + 2,
                        type: 'graph',
                        role: 'ai',
                        data: data.data.plan // Pass the plan object inside data.data
                    };

                    setMessages(prev => [...prev, successMsg, graphMsg]);
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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col  w-full relative">
            {/* Chat Container */}
            <Card className="flex-1 flex flex-col bg-transparent border-none overflow-hidden shadow-xl rounded-2xl min-h-0 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

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
                                <div className={`flex flex-col gap-2 ${message.type === 'graph' ? 'w-full' : 'max-w-[85%]'}`}>
                                    {message.type === 'graph' ? (
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
                <div className="p-4 bg-background border-t border-border/50">
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={isGenerating ? "Thinking..." : "Type your answer..."}
                            className="flex-1 bg-secondary/10 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/20 h-11"
                            disabled={isTyping || isGenerating}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping || isGenerating}
                            className="h-11 px-5 shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={18} />}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
