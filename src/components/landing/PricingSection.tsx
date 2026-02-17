'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';

const plans = [
    {
        name: 'Free',
        price: { monthly: 0, annual: 0 },
        description: 'Perfect for small teams and side projects.',
        features: [
            { name: 'Up to 1GB logs/day', included: true },
            { name: '7-day retention', included: true },
            { name: '3 team members', included: true },
            { name: 'Basic alerts', included: true },
            { name: 'Community support', included: true },
            { name: 'AI anomaly detection', included: false },
            { name: 'Custom dashboards', included: false },
            { name: 'SSO & RBAC', included: false },
        ],
        cta: 'Get Started Free',
        popular: false,
    },
    {
        name: 'Pro',
        price: { monthly: 49, annual: 39 },
        description: 'For growing teams that need more power.',
        features: [
            { name: 'Up to 50GB logs/day', included: true },
            { name: '30-day retention', included: true },
            { name: 'Unlimited team members', included: true },
            { name: 'Advanced alerts', included: true },
            { name: 'Priority support', included: true },
            { name: 'AI anomaly detection', included: true },
            { name: 'Custom dashboards', included: true },
            { name: 'SSO & RBAC', included: false },
        ],
        cta: 'Start Pro Trial',
        popular: true,
    },
    {
        name: 'Enterprise',
        price: { monthly: null, annual: null },
        description: 'For organizations with advanced needs.',
        features: [
            { name: 'Unlimited logs/day', included: true },
            { name: 'Custom retention', included: true },
            { name: 'Unlimited team members', included: true },
            { name: 'Advanced alerts', included: true },
            { name: 'Dedicated support', included: true },
            { name: 'AI anomaly detection', included: true },
            { name: 'Custom dashboards', included: true },
            { name: 'SSO & RBAC', included: true },
        ],
        cta: 'Contact Sales',
        popular: false,
    },
];

export default function PricingSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <section id="pricing" ref={ref} className="relative py-28 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50" />
            <div className="absolute inset-0 bg-dot-pattern-light" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-red-200 to-transparent" />
            <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-red-50/40 rounded-full blur-3xl" />

            <div className="relative max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full text-xs font-bold text-red-600 mb-6 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        Pricing
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-5">
                        Simple,{' '}
                        <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                            transparent
                        </span>{' '}
                        pricing
                    </h2>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        Start free. Scale when you&apos;re ready. No hidden fees, no surprises.
                    </p>
                </motion.div>

                {/* Toggle */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-3 mb-14"
                >
                    <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
                    <button
                        onClick={() => setIsAnnual(!isAnnual)}
                        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isAnnual ? 'bg-red-500' : 'bg-gray-300'}`}
                    >
                        <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${isAnnual ? 'translate-x-7' : ''}`} />
                    </button>
                    <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-400'}`}>Annual</span>
                    {isAnnual && (
                        <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-bold text-emerald-600">
                            Save 20%
                        </span>
                    )}
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                            className={`relative p-8 rounded-2xl border transition-all duration-300 ${plan.popular
                                ? 'bg-white border-red-200 shadow-2xl shadow-red-100/50 scale-[1.02]'
                                : 'bg-white border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-full text-xs font-bold text-white shadow-lg shadow-red-200/50 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                            <p className="text-sm text-gray-400 mb-6">{plan.description}</p>

                            <div className="mb-6">
                                {plan.price.monthly !== null ? (
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-extrabold text-gray-900">
                                            ${isAnnual ? plan.price.annual : plan.price.monthly}
                                        </span>
                                        <span className="text-gray-400 text-sm">/mo</span>
                                    </div>
                                ) : (
                                    <div className="text-4xl font-extrabold text-gray-900">Custom</div>
                                )}
                            </div>

                            <Link
                                href="/console"
                                className={`group block w-full text-center px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 mb-8 ${plan.popular
                                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-200/40 hover:shadow-red-300/60 hover:scale-105'
                                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:scale-105'
                                    }`}
                            >
                                <span className="inline-flex items-center gap-1.5">
                                    {plan.cta}
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                            </Link>

                            <ul className="space-y-3">
                                {plan.features.map((f) => (
                                    <li key={f.name} className="flex items-center gap-3 text-sm">
                                        {f.included ? (
                                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                        ) : (
                                            <X className="w-4 h-4 text-gray-300 shrink-0" />
                                        )}
                                        <span className={f.included ? 'text-gray-700' : 'text-gray-400'}>{f.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
