import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Sparkles, Menu, X, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
            {/* Navbar */}
            <nav className="border-b border-white/5 backdrop-blur-xl sticky top-0 z-50 bg-background/50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-950/50 border border-white/10 flex items-center justify-center shadow-lg backdrop-blur-md group-hover:border-primary/30 group-hover:shadow-primary/20 transition-all duration-300">
                            <Sparkles className="text-primary w-5 h-5 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)] transition-transform group-hover:scale-110" fill="currentColor" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white group-hover:opacity-90 transition-opacity">
                            Habitica<span className="text-primary">.</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/about" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">About</Link>
                        <Link to="/pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</Link>
                        <Link to="/contact" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Contact</Link>
                        {isAuthenticated ? (
                            <Link to="/profile">
                                <Button className="rounded-full px-6 font-semibold bg-primary text-white hover:bg-primary/90 flex items-center gap-2">
                                    <User size={16} />
                                    Profile
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/signup">
                                <Button className="rounded-full px-6 font-semibold bg-white text-black hover:bg-gray-200">
                                    Get Started
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-gray-400 hover:text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Nav Dropdown */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl"
                        >
                            <div className="flex flex-col p-6 gap-4">
                                <Link to="/about" className="text-lg font-medium p-2 hover:bg-white/5 rounded-lg text-gray-300">About</Link>
                                <Link to="/pricing" className="text-lg font-medium p-2 hover:bg-white/5 rounded-lg text-gray-300">Pricing</Link>
                                <Link to="/contact" className="text-lg font-medium p-2 hover:bg-white/5 rounded-lg text-gray-300">Contact</Link>
                                {isAuthenticated ? (
                                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full mt-4 rounded-xl flex items-center justify-center gap-2" size="lg">
                                            <User size={20} />
                                            Profile
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full mt-4 rounded-xl" size="lg">Get Started</Button>
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Page Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="py-16 border-t border-white/5 bg-black/20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-950/50 border border-white/10 flex items-center justify-center shadow-lg hover:border-primary/30 transition-colors">
                                    <Sparkles className="text-primary w-4 h-4 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" fill="currentColor" />
                                </div>
                                <span className="font-bold text-xl tracking-tight text-white">
                                    Habitica<span className="text-primary">.</span>
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                The AI-powered consistency engine for high performers. Build habits that stick, effortlessly.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 text-white">Product</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                                <li><Link to="/ai-planner" className="hover:text-primary transition-colors">AI Planner</Link></li>
                                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 text-white">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 text-white">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
                        <p className="text-xs text-gray-600">© 2026 Habitica AI Inc.</p>
                        <div className="flex gap-4">
                            {/* Social placeholders */}
                            <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-primary/20 transition-colors" />
                            <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-primary/20 transition-colors" />
                            <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-primary/20 transition-colors" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
