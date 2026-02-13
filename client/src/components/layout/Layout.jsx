import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, BarChart2, User, Sparkles, Bell, Layout as LayoutIcon, X, Check, MessageSquare, Info } from 'lucide-react';
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
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Plan Architected",
            description: "Your new study plan is ready to review.",
            time: "2 mins ago",
            type: "success",
            icon: Sparkles,
            unread: true
        },
        {
            id: 2,
            title: "Daily Goal Met",
            description: "Congratulations! You completed all tasks today.",
            time: "1 hour ago",
            type: "achievement",
            icon: CheckSquare,
            unread: true
        },
        {
            id: 3,
            title: "AI Suggestion",
            description: "Try moving your deep work session to 9 AM.",
            time: "5 hours ago",
            type: "info",
            icon: MessageSquare,
            unread: false
        }
    ]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navItems = [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/ai-planner", icon: Sparkles, label: "AI Planner" },
        { to: "/my-plans", icon: LayoutIcon, label: "My Plans" },
        { to: "/profile", icon: User, label: "Profile" },
    ];

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
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
                    <div className="flex items-center gap-3 relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className={cn(
                                "relative p-2 rounded-lg transition-all",
                                isNotificationsOpen ? "bg-primary/10 text-primary" : "hover:bg-secondary/50 text-muted-foreground"
                            )}
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border-2 border-background"></span>
                            )}
                        </button>

                        <Link
                            to="/profile"
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                location.pathname === "/profile" ? "bg-primary/10 text-primary" : "hover:bg-secondary/50 text-muted-foreground"
                            )}
                        >
                            <User size={20} />
                        </Link>

                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                                    className="absolute top-full right-0 mt-2 w-80 bg-popover/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl overflow-hidden z-[100]"
                                >
                                    <div className="p-4 border-b border-border flex items-center justify-between">
                                        <h3 className="font-bold text-sm tracking-tight text-foreground">Notifications</h3>
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                                        >
                                            Mark all as read
                                        </button>
                                    </div>

                                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                                        {notifications.length > 0 ? (
                                            <div className="divide-y divide-border">
                                                {notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => markAsRead(notif.id)}
                                                        className={cn(
                                                            "p-4 cursor-pointer transition-all hover:bg-secondary/30 relative group",
                                                            notif.unread && "bg-primary/5"
                                                        )}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className={cn(
                                                                "p-2 rounded-xl h-fit",
                                                                notif.type === 'success' ? "bg-green-500/10 text-green-500" :
                                                                    notif.type === 'achievement' ? "bg-amber-500/10 text-amber-500" :
                                                                        "bg-blue-500/10 text-blue-500"
                                                            )}>
                                                                <notif.icon size={16} />
                                                            </div>
                                                            <div className="flex-1 space-y-1">
                                                                <div className="flex justify-between items-start">
                                                                    <p className="text-xs font-bold text-foreground leading-none">{notif.title}</p>
                                                                    <span className="text-[9px] text-muted-foreground font-medium uppercase">{notif.time}</span>
                                                                </div>
                                                                <p className="text-[11px] text-muted-foreground leading-relaxed">{notif.description}</p>
                                                            </div>
                                                        </div>
                                                        {notif.unread && (
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-12 flex flex-col items-center justify-center text-center opacity-50">
                                                <Bell size={32} className="mb-2 text-muted-foreground" />
                                                <p className="text-xs font-medium text-muted-foreground">No new notifications</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3 bg-secondary/20 border-t border-border">
                                        <button className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
                                            View All Activity
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
