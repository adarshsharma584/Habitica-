import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Mail, MessageCircle, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Contact() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                setStatus('error');
                setErrorMsg(data.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
            setErrorMsg('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black tracking-tight text-white mb-4">Let's Talk.</h1>
                            <p className="text-gray-400 text-xl leading-relaxed">
                                We read every message. Whether you have a feature request or just want to share your winning streak, we're listening.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-5 group">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">Email Us</h3>
                                    <p className="text-primary hover:underline cursor-pointer">partners@habitica.ai</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 group">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 group-hover:scale-110 transition-transform">
                                    <MessageCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">Live Chat</h3>
                                    <p className="text-gray-400">Available Mon-Fri, 9am - 5pm EST</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-white">Send us a message</CardTitle>
                            <CardDescription>We usually respond within 24 hours.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {status === 'success' ? (
                                <div className="py-12 flex flex-col items-center text-center space-y-4 animate-in zoom-in duration-300">
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                                    <p className="text-gray-400">Thanks for reaching out. Our team will get back to you soon.</p>
                                    <Button onClick={() => setStatus('idle')} variant="outline" className="mt-4">
                                        Send another message
                                    </Button>
                                </div>
                            ) : (
                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">First Name</label>
                                            <Input
                                                id="firstName"
                                                required
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="Jane"
                                                className="bg-background/50 border-white/10 focus:border-primary/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Last Name</label>
                                            <Input
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Doe"
                                                className="bg-background/50 border-white/10 focus:border-primary/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Email</label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="jane@example.com"
                                            className="bg-background/50 border-white/10 focus:border-primary/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Subject</label>
                                        <Input
                                            id="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="Feature request..."
                                            className="bg-background/50 border-white/10 focus:border-primary/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Message</label>
                                        <textarea
                                            id="message"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full min-h-[150px] rounded-md border border-white/10 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 text-white placeholder:text-gray-600"
                                            placeholder="How can we help?"
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                            <AlertCircle size={16} />
                                            {errorMsg}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                                    >
                                        {status === 'loading' ? (
                                            <>Submitting... <Loader2 className="ml-2 w-4 h-4 animate-spin" /></>
                                        ) : (
                                            <>Send Message <Send className="ml-2 w-4 h-4" /></>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
