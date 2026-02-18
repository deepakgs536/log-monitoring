'use client';

import { SystemGraph } from '@/components/workflow/SystemGraph';
import { ArrowLeft, GitBranch, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function WorkflowPage() {
    const cardVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: (i: number) => ({
            opacity: 1, y: 0,
            transition: { delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
        })
    };

    const cards = [
        {
            title: 'Ingestion Pipeline',
            desc: 'High-throughput write path designed for batch processing. Uses a memory buffer to optimize disk I/O and Socket.IO for immediate real-time feedback.',
        },
        {
            title: 'Storage Strategy',
            desc: 'Logs are persisted in NDJSON format for append-only performance. The Stats Service reads from this single source of truth to compute metrics.',
        },
        {
            title: 'Read Path',
            desc: 'Separate services for statistical aggregation (Stats Service) and detailed log inspection (Log Reader), ensuring dashboard snappiness.',
        },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <motion.header
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 mb-6 transition-all duration-300 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200/50">
                        <GitBranch className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Data Flow</h1>
                        <p className="text-gray-400 mt-1 max-w-2xl text-sm font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-red-400" />
                            Interactive visualization of the log ingestion, processing, and retrieval architecture
                        </p>
                    </div>
                </div>
            </motion.header>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
                <SystemGraph />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.title}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        className="p-6 bg-white rounded-2xl border border-gray-100 shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/40 via-rose-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-red-500 to-rose-400" />
                            <h3 className="font-bold text-gray-900">{card.title}</h3>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
