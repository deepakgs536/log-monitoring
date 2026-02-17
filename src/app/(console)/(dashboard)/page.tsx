'use client';

import { useEffect, useState } from 'react';
import { LogStats, TimeRange } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { AlertPanel } from '@/components/dashboard/AlertPanel';
import { TelemetryChart } from '@/components/dashboard/TelemetryChart';
import { THEME } from '@/components/dashboard/constants';
import { motion } from 'framer-motion';
import { Activity, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Overview() {
    const { currentApp } = useApp();
    const [stats, setStats] = useState<LogStats | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>('1h');
    const [isLive, setIsLive] = useState(true);

    useEffect(() => {
        if (!currentApp) return;

        let interval: NodeJS.Timeout;

        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/stats?timeRange=${timeRange}&appId=${currentApp.id}`);
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };

        fetchStats();
        if (isLive) {
            interval = setInterval(fetchStats, 2000);
        }

        return () => clearInterval(interval);
    }, [timeRange, isLive, currentApp]);

    if (!stats) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-5">
                    <div className="relative w-14 h-14">
                        <div className="absolute inset-0 rounded-full border-[3px] border-red-100" />
                        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-red-500 animate-spin" />
                        <div className="absolute inset-2 rounded-full border-[2px] border-transparent border-b-rose-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Activity className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading Intelligence...</p>
                </div>
            </div>
        );
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 24, scale: 0.97 },
        visible: (i: number) => ({
            opacity: 1, y: 0, scale: 1,
            transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
        })
    };

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <DashboardHeader isLive={isLive} timeRange={timeRange} setTimeRange={setTimeRange} />
            </motion.div>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'System Health', value: stats.metrics.healthScore, unit: '%', color: stats.metrics.healthScore > 80 ? THEME.success : stats.metrics.healthScore > 50 ? THEME.warning : THEME.error, desc: 'Weighted operational score', trend: stats.metrics.healthScore > 90 ? 'Optimal' : stats.metrics.healthScore > 70 ? 'Degraded' : 'CRITICAL' },
                    { label: 'Throughput', value: stats.metrics.logsPerSecond, unit: 'LPS', color: THEME.accentPurple, desc: 'Logs per second (30s window)', trend: stats.metrics.logsPerSecond > 50 ? 'High load' : 'Normal' },
                    { label: 'Error Rate', value: (stats.metrics.errorRate * 100).toFixed(1), unit: '%', color: THEME.error, desc: 'Failure percentage', trend: stats.metrics.errorRate > 0.1 ? 'Unstable' : 'Healthy' },
                    { label: 'Avg Latency', value: stats.metrics.avgLatency, unit: 'ms', color: THEME.accentCyan, desc: 'Request response time', trend: stats.metrics.avgLatency > 500 ? 'Slow' : 'Fast' },
                ].map((card, i) => (
                    <motion.div key={card.label} custom={i} initial="hidden" animate="visible" variants={cardVariants}>
                        <MetricCard {...card} />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8"
            >
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-premium overflow-hidden hover:shadow-premium-hover transition-all duration-500 group relative">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/40 via-rose-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <TelemetryChart data={stats.timeline} alerts={stats.alerts} />
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-premium overflow-hidden hover:shadow-premium-hover transition-all duration-500 group relative">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/40 via-rose-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">Critical Alerts</h3>
                            <span className="px-2.5 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold rounded-full border border-red-100">Live</span>
                        </div>
                        <AlertPanel alerts={stats.alerts.filter(a => a.severity === 'critical').slice(0, 5)} />
                        {stats.alerts.filter(a => a.severity === 'critical').length === 0 && (
                            <div className="p-8 text-center">
                                <p className="text-sm text-gray-400">No critical issues detected</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
