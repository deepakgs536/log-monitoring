'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
    { name: 'Sarah Chen', role: 'SRE Lead at CloudScale', content: 'LogOps cut our mean-time-to-resolution by 70%. The real-time streaming and anomaly detection are game-changers for our on-call team.', rating: 5, avatar: 'SC' },
    { name: 'Marcus Rodriguez', role: 'VP Engineering at DataFlow', content: 'We migrated from three different logging tools to LogOps. The unified dashboard and intelligent alerts saved us over $40K/month.', rating: 5, avatar: 'MR' },
    { name: 'Priya Sharma', role: 'DevOps Engineer at RocketScale', content: 'Setting up LogOps took literally 3 minutes. The search performance is incredible — we query across 2TB of logs in under a second.', rating: 5, avatar: 'PS' },
    { name: 'James Wilson', role: 'CTO at FinTechPro', content: 'The SOC 2 compliance and enterprise security features made LogOps the obvious choice. Our auditors love the comprehensive audit trails.', rating: 5, avatar: 'JW' },
    { name: 'Aisha Patel', role: 'Platform Lead at MegaCorp', content: 'LogOps workflow builder replaced our entire custom pipeline. We went from 2 weeks of building to 2 hours of drag-and-drop.', rating: 5, avatar: 'AP' },
    { name: 'David Kim', role: 'Founding Engineer at StartupAI', content: 'As a small team, the free tier gives us enterprise-grade monitoring. The AI anomaly detection caught a memory leak we missed for months.', rating: 5, avatar: 'DK' },
    { name: 'Elena Volkov', role: 'Head of Infra at ScaleOps', content: 'The multi-region support was the deciding factor. We have teams in 12 countries, and LogOps handles our compliance requirements effortlessly.', rating: 5, avatar: 'EV' },
    { name: 'Tom Nakamura', role: 'Staff SRE at Finova', content: 'Pipeline orchestration in LogOps saved us 40+ engineering hours per sprint. The drag-and-drop builder is incredibly intuitive.', rating: 5, avatar: 'TN' },
];

const ROW1 = testimonials.slice(0, 4);
const ROW2 = testimonials.slice(4, 8);

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
    return (
        <div className="w-[380px] shrink-0 mx-3 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-red-50 hover:border-gray-200 transition-all duration-300 group cursor-pointer">
            {/* Stars */}
            <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
            </div>
            {/* Quote */}
            <div className="relative mb-5">
                <Quote className="absolute -top-1 -left-1 w-8 h-8 text-red-100 fill-red-100" />
                <p className="relative text-sm text-gray-600 leading-relaxed pl-4 group-hover:text-gray-700 transition-colors">
                    &ldquo;{t.content}&rdquo;
                </p>
            </div>
            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {t.avatar}
                </div>
                <div>
                    <div className="text-sm font-bold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                </div>
            </div>
        </div>
    );
}

export default function TestimonialsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section id="testimonials" ref={ref} className="relative py-28 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50/50" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-red-200 to-transparent" />
            <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-red-50/30 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-50/30 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-6 mb-14">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full text-xs font-bold text-red-600 mb-6 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        Testimonials
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-5">
                        Loved by{' '}
                        <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                            engineering teams
                        </span>{' '}
                        worldwide
                    </h2>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        See why hundreds of teams trust LogOps for their mission-critical observability.
                    </p>
                </motion.div>
            </div>

            {/* Auto-scrolling rows */}
            <div className="space-y-6">
                {/* Row 1 — scrolls right */}
                <div className="flex overflow-hidden">
                    <div className="flex animate-marquee whitespace-nowrap">
                        {[...ROW1, ...ROW1].map((t, i) => (
                            <TestimonialCard key={`r1-${i}`} t={t} />
                        ))}
                    </div>
                    <div className="flex animate-marquee whitespace-nowrap" aria-hidden>
                        {[...ROW1, ...ROW1].map((t, i) => (
                            <TestimonialCard key={`r1d-${i}`} t={t} />
                        ))}
                    </div>
                </div>

                {/* Row 2 — scrolls left (reverse) */}
                <div className="flex overflow-hidden">
                    <div className="flex animate-marquee-reverse whitespace-nowrap">
                        {[...ROW2, ...ROW2].map((t, i) => (
                            <TestimonialCard key={`r2-${i}`} t={t} />
                        ))}
                    </div>
                    <div className="flex animate-marquee-reverse whitespace-nowrap" aria-hidden>
                        {[...ROW2, ...ROW2].map((t, i) => (
                            <TestimonialCard key={`r2d-${i}`} t={t} />
                        ))}
                    </div>
                </div>
            </div>

            {/* fade edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        </section>
    );
}
