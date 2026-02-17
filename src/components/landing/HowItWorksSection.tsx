'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Upload, Search, Zap, Bell } from 'lucide-react';

const steps = [
    {
        icon: Upload,
        number: '01',
        title: 'Connect Your Sources',
        description: 'Integrate in minutes. Ship logs from any source — Kubernetes, AWS, Docker, custom apps. One line of config is all you need.',
        details: ['Kubernetes', 'Docker', 'AWS CloudWatch', 'Custom SDKs'],
        code: 'npx logops init --source=k8s',
    },
    {
        icon: Search,
        number: '02',
        title: 'Search & Analyze',
        description: 'Instantly query across all your logs with lightning-fast full-text search. Filter, aggregate, and drill down into any pattern.',
        details: ['Full-text search', 'Regex patterns', 'Saved queries', 'Auto-complete'],
        code: 'logops query "error AND timeout" --last=1h',
    },
    {
        icon: Zap,
        number: '03',
        title: 'Detect Anomalies',
        description: 'Our AI engine continuously learns your system behavior and surfaces anomalies before they become incidents.',
        details: ['ML-powered', 'Pattern learning', 'Threshold rules', 'Trend analysis'],
        code: 'logops detect --model=auto --sensitivity=high',
    },
    {
        icon: Bell,
        number: '04',
        title: 'Alert & Respond',
        description: 'Get notified instantly through Slack, PagerDuty, email, or webhooks. Automated runbooks kick in to resolve issues.',
        details: ['Slack & Teams', 'PagerDuty', 'Auto-runbooks', 'Escalation chains'],
        code: 'logops alert create --via=slack,pagerduty',
    },
];

export default function HowItWorksSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const lineHeight = useTransform(scrollYProgress, [0.1, 0.8], ['0%', '100%']);

    return (
        <section id="how-it-works" ref={ref} className="relative py-28 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50" />
            <div className="absolute inset-0 bg-dot-pattern-light" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-red-200 to-transparent" />

            <div className="relative max-w-5xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full text-xs font-bold text-red-600 mb-6 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        How it Works
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-5">
                        From zero to{' '}
                        <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                            observability
                        </span>{' '}
                        in minutes
                    </h2>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        Four simple steps to complete log monitoring coverage for your entire infrastructure.
                    </p>
                </motion.div>

                {/* Vertical Timeline */}
                <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[2px] bg-gray-100">
                        <motion.div
                            className="w-full bg-gradient-to-b from-red-500 to-rose-500 rounded-full"
                            style={{ height: lineHeight }}
                        />
                    </div>

                    <div className="space-y-16">
                        {steps.map((step, i) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.6, delay: i * 0.15 }}
                                    className={`relative flex items-start gap-6 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-red-500 z-10 mt-6 shadow-sm">
                                        <div className="absolute inset-0 rounded-full bg-red-200/50 animate-ping" style={{ animationDuration: '3s', animationDelay: `${i * 0.5}s` }} />
                                    </div>

                                    {/* Spacer for mobile */}
                                    <div className="w-16 shrink-0 md:hidden" />

                                    {/* Content card */}
                                    <div className={`flex-1 ${isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                                        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-red-50 hover:border-gray-200 transition-all duration-300 group">
                                            <div className={`flex items-center gap-3 mb-4 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                                                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <step.icon className="w-5 h-5 text-red-500" />
                                                </div>
                                                <div>
                                                    <span className="text-red-400 text-xs font-mono font-bold">STEP {step.number}</span>
                                                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 leading-relaxed mb-4">{step.description}</p>

                                            {/* Code snippet — kept dark for contrast */}
                                            <div className="p-3 rounded-lg bg-gray-950 border border-gray-200 font-mono text-xs text-gray-400 mb-4">
                                                <span className="text-gray-600">$</span>{' '}
                                                <span className="text-red-400">{step.code}</span>
                                            </div>

                                            <div className={`flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
                                                {step.details.map((detail) => (
                                                    <span
                                                        key={detail}
                                                        className="px-3 py-1 text-xs font-semibold bg-gray-50 text-gray-500 rounded-full border border-gray-100 group-hover:bg-red-50 group-hover:text-red-600 group-hover:border-red-100 transition-colors"
                                                    >
                                                        {detail}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Other side spacer for desktop */}
                                    <div className="hidden md:block flex-1" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
