'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, Bell, Search, BarChart3, Shield, Cpu, Workflow, Globe, Lock } from 'lucide-react';

const features = [
    {
        icon: Activity,
        title: 'Real-Time Streaming',
        description: 'Watch logs flow in real-time with sub-10ms latency. Pure WebSocket streaming — no polling, no delays.',
        accent: 'red',
        span: 'col-span-1 md:col-span-2',
        tall: true,
    },
    {
        icon: Search,
        title: 'Intelligent Search',
        description: 'Full-text search across billions of log entries. Filter by severity, service, or timestamp instantly.',
        accent: 'orange',
        span: 'col-span-1',
        tall: false,
    },
    {
        icon: Bell,
        title: 'Smart Alerts',
        description: 'AI-powered anomaly detection that learns your patterns. Get notified before incidents escalate.',
        accent: 'amber',
        span: 'col-span-1',
        tall: false,
    },
    {
        icon: BarChart3,
        title: 'Visual Analytics',
        description: 'Beautiful dashboards that transform raw logs into actionable insights with interactive real-time charts.',
        accent: 'rose',
        span: 'col-span-1',
        tall: false,
    },
    {
        icon: Shield,
        title: 'Incident Response',
        description: 'Automated incident timeline with root cause analysis. Resolve production issues 10x faster.',
        accent: 'red',
        span: 'col-span-1',
        tall: false,
    },
    {
        icon: Cpu,
        title: 'System Workflows',
        description: 'Visual workflow builder to automate log processing pipelines. Design, test, and deploy in minutes.',
        accent: 'orange',
        span: 'col-span-1',
        tall: false,
    },
    {
        icon: Workflow,
        title: 'Pipeline Orchestration',
        description: 'Chain multiple log sources, transformations, and destinations with a drag-and-drop pipeline builder.',
        accent: 'amber',
        span: 'col-span-1 md:col-span-2',
        tall: false,
    },
    {
        icon: Lock,
        title: 'Enterprise Security',
        description: 'SOC 2 Type II. End-to-end encryption, RBAC, audit trails, and SSO out of the box.',
        accent: 'red',
        span: 'col-span-1',
        tall: false,
    },
];

const accentMap: Record<string, { bg: string; iconBg: string; text: string; glow: string; border: string }> = {
    red: { bg: 'from-red-50 to-red-50/50', iconBg: 'bg-red-50', text: 'text-red-500', glow: 'group-hover:shadow-red-100/50', border: 'group-hover:border-red-200' },
    orange: { bg: 'from-orange-50 to-orange-50/50', iconBg: 'bg-orange-50', text: 'text-orange-500', glow: 'group-hover:shadow-orange-100/50', border: 'group-hover:border-orange-200' },
    amber: { bg: 'from-amber-50 to-amber-50/50', iconBg: 'bg-amber-50', text: 'text-amber-500', glow: 'group-hover:shadow-amber-100/50', border: 'group-hover:border-amber-200' },
    rose: { bg: 'from-rose-50 to-rose-50/50', iconBg: 'bg-rose-50', text: 'text-rose-500', glow: 'group-hover:shadow-rose-100/50', border: 'group-hover:border-rose-200' },
};

export default function FeaturesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section id="features" ref={ref} className="relative py-28 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />
            <div className="absolute inset-0 bg-dot-pattern-light" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-red-200 to-transparent" />

            {/* Ambient glow */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-50/50 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-50/50 rounded-full blur-3xl" />

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
                        Features
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-5">
                        Everything you need to{' '}
                        <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                            ship with confidence
                        </span>
                    </h2>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        From real-time log streaming to AI-powered incident response — LogOps gives your engineering team superpowers.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {features.map((feature, i) => {
                        const colors = accentMap[feature.accent];
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                                transition={{ duration: 0.5, delay: i * 0.06 }}
                                className={`group relative p-7 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1 ${feature.span} ${colors.glow} ${colors.border} ${feature.tall ? 'md:row-span-2' : ''}`}
                            >
                                {/* Gradient fill on hover */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                <div className="relative">
                                    <div className={`w-12 h-12 rounded-xl ${colors.iconBg} border border-gray-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300`}>
                                        <feature.icon className={`w-6 h-6 ${colors.text}`} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                                </div>

                                {/* Bottom accent line */}
                                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-red-500 to-rose-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Highlight card mini dashboard */}
                                {feature.tall && (
                                    <div className="relative mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                <span className="text-[11px] text-emerald-600 font-mono font-semibold">LIVE</span>
                                            </div>
                                            <span className="text-[11px] text-gray-400 font-mono">prod-cluster</span>
                                        </div>
                                        {/* Mini sparkline bars */}
                                        <div className="flex items-end gap-[3px] h-16">
                                            {Array.from({ length: 32 }).map((_, bi) => (
                                                <div
                                                    key={bi}
                                                    className="flex-1 bg-gradient-to-t from-red-400/60 to-red-300/30 rounded-t-sm transition-all duration-300"
                                                    style={{
                                                        height: `${20 + Math.sin(bi * 0.5) * 30 + Math.random() * 25}%`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-mono">
                                            <span>00:00</span>
                                            <span className="text-red-500 font-semibold">2.4M events/s</span>
                                            <span>now</span>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
