'use client';

import { useState, useEffect } from 'react';
import { LogStats } from '@/lib/types';
import { TelemetryChart } from '@/components/dashboard/TelemetryChart';
import { DistributionDonut } from '@/components/dashboard/DistributionDonut';
import { motion } from 'framer-motion';
import { BarChart3, Sparkles } from 'lucide-react';

export default function AnalyticsPage() {
    const [stats, setStats] = useState<LogStats | null>(null);

    useEffect(() => {
        fetch('/api/stats?timeRange=24h').then(res => res.json()).then(setStats);
    }, []);

    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
    } as const;

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <motion.header
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3.5"
            >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200/50">
                    <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900">System Analytics</h1>
                    <p className="text-gray-400 text-sm mt-0.5 font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-red-400" />
                        Historical performance and trend analysis
                    </p>
                </div>
            </motion.header>

            {stats && (
                <motion.div
                    initial="hidden" animate="visible" variants={sectionVariants}
                    className="grid grid-cols-1 xl:grid-cols-12 gap-6"
                >
                    <div className="xl:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-premium overflow-hidden min-h-[500px] hover:shadow-premium-hover transition-all duration-500 group relative">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/40 via-rose-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-red-500 to-rose-400" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Traffic Trends (24h)</h3>
                        </div>
                        <TelemetryChart data={stats.timeline} alerts={stats.alerts} />
                    </div>
                    <div className="xl:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-premium overflow-hidden min-h-[500px] hover:shadow-premium-hover transition-all duration-500 group relative">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/40 via-rose-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-red-500 to-rose-400" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Log Distribution</h3>
                        </div>
                        <DistributionDonut data={stats.distribution} />
                    </div>
                </motion.div>
            )}
        </div>
    );
}
