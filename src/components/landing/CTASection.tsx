'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const AVATARS = ['SC', 'MR', 'PS', 'JW', 'AP'];

export default function CTASection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section id="cta" ref={ref} className="relative py-32 overflow-hidden">
            {/* Light gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/60 via-white to-rose-50/60" />
            <div className="absolute inset-0 bg-dot-pattern-light" />

            {/* Floating glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-red-100/40 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-100/40 rounded-full blur-3xl animate-float-slow" />

            <div className="relative max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 mb-8 shadow-2xl shadow-red-200/50"
                    >
                        <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                        Ready to tame<br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">your logs?</span>
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join 500+ engineering teams who trust LogOps for real-time observability.
                        Start for free — no credit card, no vendor lock-in.
                    </p>

                    {/* Email signup form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-10"
                    >
                        <div className="relative flex-1 w-full">
                            <input
                                type="email"
                                placeholder="Enter your work email"
                                className="w-full px-5 py-4 rounded-full bg-white border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all shadow-sm"
                            />
                        </div>
                        <Link
                            href="/console"
                            className="group relative inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-full shadow-xl shadow-red-200/40 hover:shadow-red-300/60 hover:scale-105 active:scale-[0.98] transition-all duration-300 overflow-hidden whitespace-nowrap"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                            <span className="relative">Get Started</span>
                            <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Social proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="flex items-center justify-center gap-3"
                    >
                        <div className="flex -space-x-2">
                            {AVATARS.map((a, i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white text-[10px] font-bold border-2 border-white"
                                >
                                    {a}
                                </div>
                            ))}
                        </div>
                        <span className="text-sm text-gray-400">
                            Join <span className="text-gray-900 font-semibold">500+</span> teams already using LogOps
                        </span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
