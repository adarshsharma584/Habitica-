import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, BarChart2, User, Sparkles, Bell, Layout as LayoutIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const NavItem = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={cn(
            "flex flex-col items-center justify-center w-full p-2 rounded-xl transition-all duration-200",
            active
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        )}
    >
        <Icon size={24} className={cn("mb-1", active && "fill-current/20")} />
        <span className="text-[10px] font-medium">{label}</span>
    </Link>
);

const DesktopNavItem = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm font-medium",
            active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        )}
    >
        <Icon size={18} />
        {label}
    </Link>
);

export default function Layout() {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/ai-planner", icon: Sparkles, label: "AI Planner" },
        { to: "/my-plans", icon: LayoutIcon, label: "My Plans" },
        { to: "/profile", icon: User, label: "Profile" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Top Navigation (Desktop) */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent bg-background/80 backdrop-blur-md hidden md:block",
                    isScrolled && "border-border shadow-sm"
                )}
            >
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center text-white">
                            <Sparkles size={18} fill="currentColor" />
                        </div>
                        <span>Habitica<span className="text-primary">.ai</span></span>
                    </Link>

                    <nav className="flex items-center gap-2">
                        {navItems.map((item) => (
                            <DesktopNavItem
                                key={item.to}
                                {...item}
                                active={location.pathname === item.to}
                            />
                        ))}
                    </nav>

                    {/* Notification Bell - Only show when authenticated */}
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 hover:bg-secondary/50 rounded-lg transition-colors">
                            <Bell size={20} className="text-muted-foreground" />
                            {/* Red dot badge for unread notifications */}
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>

                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 pb-24 md:pt-20 md:pb-8 pt-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom Navigation (Mobile) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-lg border-t border-border z-50 pb-safe">
                <div className="flex items-center justify-around p-2">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.to}
                            {...item}
                            active={location.pathname === item.to}
                        />
                    ))}
                </div>
            </nav>
        </div>
    );
}
