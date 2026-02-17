'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Terminal, Cloud, Container, GitBranch, BarChart3, Shield, Cpu, Webhook, Database, Server } from 'lucide-react';

const INTEGRATIONS = [
    { name: 'AWS', icon: Cloud, color: 'text-orange-500' },
    { name: 'Docker', icon: Container, color: 'text-blue-500' },
    { name: 'Kubernetes', icon: Cpu, color: 'text-blue-400' },
    { name: 'GitHub', icon: GitBranch, color: 'text-gray-700' },
    { name: 'Grafana', icon: BarChart3, color: 'text-orange-400' },
    { name: 'Datadog', icon: Shield, color: 'text-purple-500' },
    { name: 'Vercel', icon: Server, color: 'text-gray-700' },
    { name: 'Webhooks', icon: Webhook, color: 'text-green-500' },
    { name: 'PostgreSQL', icon: Database, color: 'text-blue-500' },
];

const ORBIT_ITEMS = INTEGRATIONS.slice(0, 8);

export default function IntegrationSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section id="integrations" ref={ref} className="relative py-28 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50" />
            <div className="absolute inset-0 bg-dot-pattern-light" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-50/40 rounded-full blur-3xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-red-200 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full text-xs font-bold text-red-600 mb-6 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        Integrations
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-5">
                        Connects to{' '}
                        <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                            everything
                        </span>{' '}
                        you use
                    </h2>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        One-click integrations with all your favorite tools. Ship logs from any source in minutes.
                    </p>
                </motion.div>

                {/* Orbit Visualization */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative w-full max-w-lg mx-auto aspect-square mb-0"
                >
                    {/* Orbit rings */}
                    <div className="absolute inset-[15%] border border-gray-200/60 rounded-full" />
                    <div className="absolute inset-[5%] border border-gray-100/60 rounded-full" />
                    <div className="absolute inset-0 border border-gray-100/40 rounded-full" />

                    {/* Center LogOps logo */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-red-200/50 z-10">
                        <Terminal className="w-10 h-10 text-white" />
                    </div>
                    {/* Center pulse */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-red-200/30 animate-ping" style={{ animationDuration: '3s' }} />

                    {/* Orbiting icons */}
                    {ORBIT_ITEMS.map((item, i) => {
                        const angle = (360 / ORBIT_ITEMS.length) * i;
                        const radius = 42;
                        const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                        const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

                        return (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                className="absolute w-14 h-14 -ml-7 -mt-7 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-1 hover:shadow-lg hover:border-gray-300 hover:scale-110 transition-all duration-300 cursor-pointer group z-10"
                                style={{ left: `${x}%`, top: `${y}%` }}
                            >
                                <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                                <span className="text-[8px] font-bold text-gray-400 group-hover:text-gray-600 transition-colors">{item.name}</span>
                            </motion.div>
                        );
                    })}

                    {/* Connecting lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                        {ORBIT_ITEMS.map((item, i) => {
                            const angle = (360 / ORBIT_ITEMS.length) * i;
                            const radius = 42;
                            const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                            const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
                            return (
                                <motion.line
                                    key={item.name}
                                    x1="50" y1="50" x2={x} y2={y}
                                    stroke="rgba(239, 68, 68, 0.08)"
                                    strokeWidth="0.3"
                                    initial={{ pathLength: 0 }}
                                    animate={isInView ? { pathLength: 1 } : {}}
                                    transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                                />
                            );
                        })}
                    </svg>
                </motion.div>

            </div>
        </section>
    );
}
