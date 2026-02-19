'use client';

import { useEffect, useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { LogStats, TimeRange } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { TelemetryChart } from '@/components/dashboard/TelemetryChart';
import { DistributionDonut } from '@/components/dashboard/DistributionDonut';
import { ServiceActivityChart } from '@/components/dashboard/ServiceActivityChart';
import { LogFeedTable } from '@/components/dashboard/LogFeedTable';
import { SimulationControls } from '@/components/dashboard/SimulationControls';
import { SystemHealthPanel } from '@/components/dashboard/SystemHealthPanel';
import { DegradedBanner } from '@/components/dashboard/DegradedBanner';
import { THEME } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldAlert, Zap, ChevronUp, ChevronDown, Activity, Radio, Sparkles, Layers, BarChart3, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2.5 + 1,
    delay: Math.random() * 6,
    duration: Math.random() * 5 + 7,
}));

export default function Dashboard() {
    const { currentApp } = useApp();
    const [stats, setStats] = useState<LogStats | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>('1h');
    const [isLive, setIsLive] = useState(true);
    const [isSimulationOpen, setIsSimulationOpen] = useState(false);

    const particles = useMemo(() => PARTICLES, []);

    useEffect(() => {
        if (!currentApp) return;

        let interval: NodeJS.Timeout;

        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/stats?appId=${currentApp.id}&timeRange=${timeRange}`);
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };

        fetchStats();
        if (isLive) {
            interval = setInterval(fetchStats, 2000);
        }

        return () => clearInterval(interval);
    }, [currentApp, timeRange, isLive]);

    if (!stats) {
        return (
            <div className="flex items-center justify-center h-screen relative overflow-hidden">
                {/* Ambient orbs */}
                <div className="console-ambient-orb w-[500px] h-[500px] bg-red-200/30 top-0 right-0" />
                <div className="console-ambient-orb w-[400px] h-[400px] bg-rose-200/20 bottom-0 left-0" />

                {/* Particles */}
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute rounded-full bg-red-300/25 animate-particle-float pointer-events-none"
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

                <div className="relative flex flex-col items-center gap-7">
                    {/* Premium spinner with breathing glow */}
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 rounded-full border-[3px] border-red-100/60" />
                        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-red-500 animate-spin" />
                        <div className="absolute inset-2 rounded-full border-[2px] border-transparent border-b-rose-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                        <div className="absolute inset-4 rounded-full border-[1.5px] border-transparent border-t-orange-300/60 animate-spin" style={{ animationDuration: '1.5s' }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200/50">
                                <Activity className="w-4 h-4 text-white animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-base font-black text-gray-900 tracking-tight">Initializing Console</p>
                        <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5 justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                            Loading telemetry data...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 28, scale: 0.95, filter: 'blur(4px)' },
        visible: (i: number) => ({
            opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
            transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
        })
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } }
    };

    return (
        <div className="flex flex-col min-h-screen text-gray-900 relative">

            {/* Ambient background orbs */}
            <div className="console-ambient-orb w-[600px] h-[600px] bg-red-200/20 -top-40 -right-40 fixed" />
            <div className="console-ambient-orb w-[500px] h-[500px] bg-rose-200/15 bottom-0 -left-32 fixed" />
            <div className="console-ambient-orb w-[300px] h-[300px] bg-orange-100/20 top-1/2 right-1/4 fixed" />

            <main className="flex-1 flex flex-col relative z-10">
                <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 space-y-4">
                    {/* Layer 0: System Reliability & Notifications */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-4"
                    >
                        <DegradedBanner metrics={stats.system} />
                        <SystemHealthPanel metrics={stats.system} />
                    </motion.div>

                    {/* Section Divider */}
                    <div className="section-divider" />

                    {/* Layer 1: Metric Cards — Staggered Entrance */}
                    {/* Layer 1: Key Metrics & Top Services (Combined) */}
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">

                        {/* Left Column: Metrics Grid (2x2) */}
                        <motion.div
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="lg:col-span-5 flex flex-col gap-4"
                        >
                            <div className="flex items-center gap-2.5 mb-1">
                                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red-500 to-rose-400" />
                                <BarChart3 className="w-4 h-4 text-red-400" />
                                <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Key Metrics</h2>
                                <div className="flex-1 section-divider ml-3" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 h-full">
                                {[
                                    { label: 'Health', value: stats.metrics.healthScore, unit: '%', color: stats.metrics.healthScore > 80 ? THEME.success : stats.metrics.healthScore > 50 ? THEME.warning : THEME.error, desc: 'System integrity' },
                                    { label: 'TPS', value: stats.metrics.logsPerSecond, unit: 'LPS', color: THEME.accentPurple, desc: 'Ingestion rate' },
                                    { label: 'Error', value: (stats.metrics.errorRate * 100).toFixed(1), unit: '%', color: THEME.error, desc: 'Failure rate' },
                                    { label: 'Latency', value: stats.metrics.avgLatency, unit: 'ms', color: THEME.accentCyan, desc: 'Response time' },
                                ].map((card, i) => (
                                    <motion.div key={card.label} custom={i} initial="hidden" animate="visible" variants={cardVariants} className="h-full">
                                        <MetricCard {...card} compact />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right Column: Service Activity Chart (Top Services) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-7 flex flex-col"
                        >
                            {/* Header for Top Services */}
                            <div className="flex items-center gap-2.5 mb-5 hidden lg:flex">
                                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red-500 to-rose-400" />
                                <TrendingUp className="w-4 h-4 text-red-400" />
                                <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Top Services</h2>
                                <div className="flex-1 section-divider ml-3" />
                            </div>

                            <div className="flex-1 console-card-premium min-h-[300px] lg:min-h-0 p-1">
                                <ServiceActivityChart data={stats.serviceDistribution} />
                            </div>
                        </motion.div>
                    </section>

                    {/* Section Divider */}
                    <div className="section-divider" />

                    {/* Layer 2: Main Telemetry Charts */}
                    <motion.section
                        initial="hidden" animate="visible" variants={sectionVariants}
                        className="grid grid-cols-1 lg:grid-cols-[70%_28%] gap-4"
                    >
                        <div className="console-card-premium min-h-[400px]">
                            <TelemetryChart data={stats.timeline} alerts={stats.alerts} />
                        </div>
                        <div className="console-card-premium min-h-[400px]">
                            <DistributionDonut data={stats.distribution} />
                        </div>
                    </motion.section>

                    {/* Section Divider */}
                    <div className="section-divider" />

                    {/* Layer 2: Investigation Workspace */}
                    <motion.section
                        initial="hidden" animate="visible" variants={sectionVariants}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red-500 to-rose-400" />
                                <Terminal className="w-4 h-4 text-red-400" />
                                <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">System Workspace</h2>
                                <div className="flex-1 section-divider ml-3" />
                            </div>
                            <Link
                                href="/incidents"
                                className="group px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl text-xs font-bold hover:from-red-600 hover:to-rose-600 hover:shadow-xl hover:shadow-red-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
                                <ShieldAlert className="w-3.5 h-3.5 relative" />
                                <span className="relative">View Incidents</span>
                            </Link>
                        </div>

                        {/* Logs Stream — Premium Card */}
                        <div className="flex flex-col console-card-premium max-h-[500px]">
                            <div className="px-6 py-4 border-b border-gray-100/80 bg-gradient-to-r from-white via-white to-red-50/40 flex items-center justify-between relative">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping opacity-25" />
                                    </div>
                                    <h2 className="text-[13px] font-bold text-gray-900">Live Log Stream</h2>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-red-500 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100 animate-border-pulse">
                                        Streaming
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-[11px] font-medium text-gray-400">
                                    <div className="flex items-center gap-1.5">
                                        <Radio className="w-3 h-3 text-red-400 animate-pulse" />
                                        <span>Real-time Telemetry</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-x-auto custom-scrollbar">
                                <LogFeedTable logs={stats.recentLogs} alerts={stats.alerts} />
                            </div>
                        </div>
                    </motion.section>
                </div>
            </main>

            {/* Layer 3: Simulation Lab — Enhanced */}
            <div className="flex-shrink-0 z-40 console-glass-strong border-t border-red-100/30 sticky bottom-0">
                <button
                    onClick={() => setIsSimulationOpen(!isSimulationOpen)}
                    className={`w-full h-12 flex items-center justify-center gap-2.5 text-[11px] font-bold transition-all uppercase tracking-wider group relative overflow-hidden ${isSimulationOpen
                        ? 'text-red-500 bg-red-50/60'
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50/30'
                        }`}
                >
                    {isSimulationOpen && <div className="absolute inset-0 bg-gradient-to-r from-red-50/0 via-red-50/40 to-red-50/0 animate-shimmer" />}
                    <Zap className={`w-3.5 h-3.5 transition-all duration-300 relative ${isSimulationOpen ? 'text-red-500 scale-110' : 'text-gray-400 group-hover:text-red-400 group-hover:scale-110'}`} />
                    <span className="relative">Simulation Lab</span>
                    {isSimulationOpen ? <ChevronDown className="w-4 h-4 relative" /> : <ChevronUp className="w-4 h-4 relative" />}
                </button>
                <AnimatePresence>
                    {isSimulationOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-gradient-to-b from-red-50/40 to-white/80 border-t border-red-100/30 overflow-hidden relative"
                        >
                            {/* Decorative orbs inside simulation panel */}
                            <div className="console-ambient-orb w-[300px] h-[300px] bg-red-200/15 -top-20 -right-20" />
                            <div className="console-ambient-orb w-[200px] h-[200px] bg-rose-200/10 bottom-0 left-0" />

                            <div className="p-8 max-w-4xl mx-auto relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div className="space-y-3">
                                        <div className="inline-flex items-center gap-2 h-6 px-3 bg-red-50 text-red-500 rounded-full border border-red-100 text-[10px] font-bold uppercase tracking-widest">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                            Control Plane
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Active Scenarios</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">Trigger failure patterns to validate system resilience and alert propagation.</p>
                                    </div>
                                    <div className="flex justify-center console-card-premium p-6">
                                        <SimulationControls />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
