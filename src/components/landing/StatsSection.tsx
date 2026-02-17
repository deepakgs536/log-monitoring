'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
    { value: 2400000, suffix: '+', label: 'Logs processed per second', format: 'short' },
    { value: 99.99, suffix: '%', label: 'Platform uptime SLA', format: 'decimal' },
    { value: 500, suffix: '+', label: 'Enterprise teams', format: 'number' },
    { value: 4.2, suffix: 'ms', label: 'Average query latency', format: 'decimal' },
    { value: 40, suffix: '%', label: 'Cost reduction average', format: 'number' },
    { value: 70, suffix: '%', label: 'Faster incident resolution', format: 'number' },
];

function formatNumber(value: number, format: string, progress: number): string {
    const current = value * progress;
    if (format === 'short') {
        if (current >= 1000000) return (current / 1000000).toFixed(1) + 'M';
        if (current >= 1000) return Math.round(current / 1000) + 'K';
        return Math.round(current).toString();
    }
    if (format === 'decimal') return current.toFixed(current > 10 ? 2 : 1);
    return Math.round(current).toLocaleString();
}

function AnimatedCounter({ value, suffix, format }: { value: number; suffix: string; format: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        const duration = 2000;
        const start = performance.now();
        function tick(now: number) {
            const elapsed = now - start;
            const p = Math.min(elapsed / duration, 1);
            setProgress(1 - Math.pow(1 - p, 3));
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }, [isInView, value]);

    return (
        <span ref={ref} className="tabular-nums">
            {formatNumber(value, format, progress)}{suffix}
        </span>
    );
}

export default function StatsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section id="stats" ref={ref} className="relative py-24 overflow-hidden">
            {/* Red gradient background — kept vibrant for contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-rose-600 to-red-500" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_50%)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
                        Numbers that speak for themselves
                    </h2>
                    <p className="text-red-200 text-lg">Trusted by engineering teams at the world&apos;s best companies</p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="group text-center p-6 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm hover:bg-white/15 hover:border-white/20 transition-all duration-300"
                        >
                            <div className="text-3xl md:text-4xl font-extrabold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} format={stat.format} />
                            </div>
                            <div className="text-red-200 text-sm font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
