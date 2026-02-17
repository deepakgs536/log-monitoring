'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Activity, Shield, Zap, Terminal, ArrowRight, CheckCircle2, Play, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

const LOG_LINES = [
    { time: '10:42:01', level: 'INFO', color: 'text-emerald-400', msg: 'Service "auth-api" health check passed' },
    { time: '10:42:03', level: 'WARN', color: 'text-amber-400', msg: 'Response latency exceeded 200ms on /api/users' },
    { time: '10:42:05', level: 'INFO', color: 'text-emerald-400', msg: 'Deployed build v3.14.2 to production cluster' },
    { time: '10:42:06', level: 'ERROR', color: 'text-red-400', msg: 'Connection timeout to postgres-primary:5432' },
    { time: '10:42:08', level: 'INFO', color: 'text-emerald-400', msg: 'Auto-scaling group increased to 4 instances' },
    { time: '10:42:09', level: 'DEBUG', color: 'text-blue-400', msg: 'Cache hit ratio: 94.2% (redis-cluster-01)' },
    { time: '10:42:11', level: 'WARN', color: 'text-amber-400', msg: 'Memory usage at 78% on worker-node-03' },
    { time: '10:42:12', level: 'INFO', color: 'text-emerald-400', msg: 'SSL certificate renewed for *.logops.io' },
    { time: '10:42:14', level: 'ERROR', color: 'text-red-400', msg: 'Rate limit exceeded for client IP 192.168.1.42' },
    { time: '10:42:15', level: 'INFO', color: 'text-emerald-400', msg: 'Backup completed: 2.4GB compressed (S3)' },
];

const MARQUEE_LOGOS = ['Vercel', 'Stripe', 'Linear', 'Notion', 'Figma', 'Supabase', 'Shopify', 'Datadog', 'Cloudflare', 'GitLab'];

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 8,
    duration: Math.random() * 6 + 6,
}));

const METRICS = [
    { icon: TrendingUp, label: 'Throughput', value: '2.4M/s', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Clock, label: 'P99 Latency', value: '4.2ms', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: AlertTriangle, label: 'Error Rate', value: '0.003%', color: 'text-amber-500', bg: 'bg-amber-50' },
];

export default function HeroSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [visibleLines, setVisibleLines] = useState(0);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const terminalY = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const particles = useMemo(() => PARTICLES, []);

    useEffect(() => {
        if (isInView) {
            const interval = setInterval(() => {
                setVisibleLines((prev) => {
                    if (prev >= LOG_LINES.length) { clearInterval(interval); return prev; }
                    return prev + 1;
                });
            }, 350);
            return () => clearInterval(interval);
        }
    }, [isInView]);

    return (
        <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
            {/* Light background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-red-50/20 to-rose-50/30" />
            <div className="absolute inset-0 bg-dot-pattern opacity-50" />

            {/* Animated particles */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-red-300/20 animate-particle-float pointer-events-none"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                    }}
                />
            ))}

            {/* Gradient orbs */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-red-100/30 via-rose-50/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-orange-50/30 to-transparent rounded-full blur-3xl" />

            {/* Animated rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-red-100/30 rounded-full animate-spin-slow opacity-40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-red-50/20 rounded-full animate-spin-slow opacity-20" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />

            <motion.div style={{ opacity: heroOpacity }} className="relative max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                {/* Left */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/80 backdrop-blur-sm border border-red-100 rounded-full shadow-sm"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                        </span>
                        <span className="text-sm font-semibold text-red-700">Live — 2.4M logs/sec ingested</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl md:text-6xl lg:text-[4.75rem] font-black text-gray-900 leading-[1.05] tracking-tight"
                    >
                        See every{' '}
                        <span className="bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">signal</span>
                        <br />
                        <span className="text-gray-400">in the noise.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed"
                    >
                        Real-time log monitoring, intelligent anomaly detection, and instant incident response — all in one stunning console built for modern DevOps.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-wrap gap-4"
                    >
                        <Link href="/console"
                            className="group inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-full shadow-2xl shadow-red-300/40 hover:shadow-red-400/50 hover:scale-105 active:scale-[0.98] transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                            <span className="relative">Start Monitoring Free</span>
                            <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href="#features"
                            className="group inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm hover:shadow-xl hover:border-gray-300 hover:scale-105 active:scale-[0.98] transition-all duration-300"
                        >
                            <Play className="w-4 h-4 text-red-500 fill-red-500" />
                            Watch Demo
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.7, delay: 0.45 }}
                        className="flex flex-wrap items-center gap-x-5 gap-y-2"
                    >
                        {['No credit card required', 'Free forever plan', 'Setup in 2 min'].map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[13px] text-gray-400">
                                <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Right: Terminal */}
                <motion.div
                    initial={{ opacity: 0, x: 80, rotateY: -10 }}
                    animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
                    transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    style={{ y: terminalY }}
                    className="relative hidden lg:block"
                >
                    {/* Glow behind terminal */}
                    <div className="absolute -inset-4 bg-gradient-to-br from-red-200/30 via-rose-200/20 to-orange-100/20 rounded-3xl blur-2xl" />

                    <div className="relative rounded-2xl bg-white border border-gray-200/80 shadow-2xl shadow-red-100/30 overflow-hidden scan-line">
                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer" />
                                <div className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-500 transition-colors cursor-pointer" />
                                <div className="w-3 h-3 rounded-full bg-emerald-400 hover:bg-emerald-500 transition-colors cursor-pointer" />
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <div className="flex items-center gap-1.5 px-3 py-0.5 bg-white rounded-md border border-gray-200 text-xs text-gray-400 font-mono">
                                    <Terminal className="w-3 h-3" />
                                    logops stream --live --cluster=prod
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-950 font-mono text-[12.5px] h-[320px] overflow-hidden">
                            <div className="space-y-1.5">
                                {LOG_LINES.slice(0, visibleLines).map((line, i) => (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex items-start gap-3 group hover:bg-white/5 px-1 -mx-1 rounded transition-colors cursor-pointer"
                                    >
                                        <span className="text-gray-600 shrink-0">{line.time}</span>
                                        <span className={`font-bold shrink-0 w-16 ${line.color}`}>[{line.level}]</span>
                                        <span className="text-gray-400 group-hover:text-gray-200 transition-colors">{line.msg}</span>
                                    </motion.div>
                                ))}
                                {visibleLines < LOG_LINES.length && (
                                    <span className="inline-block w-2 h-5 bg-red-400 animate-typewriter-cursor ml-1 rounded-sm" />
                                )}
                            </div>
                        </div>

                        <div className="px-4 py-2 bg-gray-900 border-t border-gray-800 flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                </span>
                                Connected
                            </div>
                            <span className="text-gray-500">prod-cluster-us-east-1</span>
                            <span className="text-gray-600">↑ 2.4M/s</span>
                        </div>
                    </div>

                    {/* Floating metric cards */}
                    {METRICS.map((metric, i) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 1.2 + i * 0.4, duration: 0.5 }}
                            className={`absolute px-4 py-3 bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl shadow-red-100/20 flex items-center gap-3 ${i === 0 ? '-left-14 top-14 animate-float' : i === 1 ? '-right-10 bottom-24 animate-float-slow' : '-left-8 bottom-6 animate-float-slow'}`}
                            style={i === 2 ? { animationDelay: '2s' } : undefined}
                        >
                            <div className={`w-10 h-10 rounded-xl ${metric.bg} flex items-center justify-center`}>
                                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-900">{metric.value}</div>
                                <div className="text-[11px] text-gray-400">{metric.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

        </section>
    );
}
