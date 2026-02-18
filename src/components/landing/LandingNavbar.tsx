'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Menu, X, Terminal, ArrowUpRight } from 'lucide-react';

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'How it Works', href: '#how-it-works' },
];

export default function LandingNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const scrollProgress = useMotionValue(0);
    const smoothProgress = useSpring(scrollProgress, { stiffness: 100, damping: 30 });

    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 20);
        const total = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.set(total > 0 ? window.scrollY / total : 0);
    }, [scrollProgress]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Intersection Observer for active section
    useEffect(() => {
        const ids = navLinks.map((l) => l.href.replace('#', '')).filter(Boolean);
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(`#${entry.target.id}`);
                    }
                });
            },
            { rootMargin: '-40% 0px -55% 0px' }
        );

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-white/80 backdrop-blur-2xl shadow-[0_2px_40px_rgba(0,0,0,0.06)] border-b border-gray-100'
                    : 'bg-transparent'
                    }`}
            >
                {/* Scroll progress bar */}
                <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-red-500 via-rose-500 to-orange-400"
                    style={{ width: smoothProgress.get() > 0 ? `${smoothProgress.get() * 100}%` : '0%', scaleX: smoothProgress }}
                    initial={{ transformOrigin: '0%' }}
                />

                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-red-200/50 group-hover:shadow-red-300/60 transition-all group-hover:scale-110 duration-300">
                            <Terminal className="w-5 h-5 relative z-10" />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="font-bold text-lg text-gray-900 tracking-tight">
                            Log<span className="bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">Ops</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`relative px-4 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 ${activeSection === link.href
                                    ? 'text-gray-900'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {link.label}
                                {activeSection === link.href && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute inset-0 bg-gray-100 rounded-lg border border-gray-200/60"
                                        style={{ zIndex: -1 }}
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </a>
                        ))}
                        <div className="w-[1px] h-6 bg-gray-200 mx-2" />
                        <Link
                            href="/dataflow"
                            className="group ml-1 px-5 py-2 text-[13px] font-semibold text-red-500 border border-red-500 rounded-full shadow-lg shadow-red-200/30 hover:shadow-red-300/50 hover:scale-105 active:scale-[0.98] transition-all duration-300 inline-flex items-center gap-1.5"
                        >
                            System Data Flow
                        </Link>
                        <Link
                            href="/console"
                            className="group ml-1 px-5 py-2 text-[13px] font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-full shadow-lg shadow-red-200/30 hover:shadow-red-300/50 hover:scale-105 active:scale-[0.98] transition-all duration-300 inline-flex items-center gap-1.5"
                        >
                            Open Console
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-gray-100 px-6 pb-6"
                    >
                        <div className="flex flex-col gap-1 pt-4">
                            {navLinks.map((link) => (
                                <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                                    className={`text-base font-medium py-3 px-3 rounded-xl transition-all ${activeSection === link.href
                                        ? 'text-red-600 bg-red-50'
                                        : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <Link href="/console"
                                className="mt-3 px-5 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-full text-center shadow-lg shadow-red-200/30"
                            >
                                Open Console →
                            </Link>
                        </div>
                    </motion.div>
                )}
            </motion.nav>
        </>
    );
}
