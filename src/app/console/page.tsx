'use client';

import { useEffect, useState } from 'react';
import { LogStats, TimeRange } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { TelemetryChart } from '@/components/dashboard/TelemetryChart';
import { DistributionDonut } from '@/components/dashboard/DistributionDonut';
import { LogFeedTable } from '@/components/dashboard/LogFeedTable';
import { SimulationControls } from '@/components/dashboard/SimulationControls';
import { SystemHealthPanel } from '@/components/dashboard/SystemHealthPanel';
import { DegradedBanner } from '@/components/dashboard/DegradedBanner';
import { THEME } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Terminal, ShieldAlert, Zap, ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';


export default function Dashboard() {
    const [stats, setStats] = useState<LogStats | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>('1h');
    const [isLive, setIsLive] = useState(true);
    const [isSimulationOpen, setIsSimulationOpen] = useState(false);


    useEffect(() => {
        let interval: NodeJS.Timeout;

        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/stats?timeRange=${timeRange}`);
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
    }, [timeRange, isLive]);

    if (!stats) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0f172a]">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-blue-500/20" />
                    <div className="text-center space-y-2">
                        <p className="text-lg font-bold text-white tracking-[0.2em] uppercase">Initializing Console</p>
                        <p className="text-xs text-slate-400 font-mono">Syncing telemetry streams...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30 text-foreground">

            {/* Header - Fixed */}
            <header className="h-20 flex-shrink-0 border-b border-border bg-background/80 backdrop-blur-md px-6 flex items-center justify-between z-30 sticky top-0">
                <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center shadow-sm border border-border">
                            <Activity className="w-7 h-7 text-accent-cyan" />
                        </div>
                        <div className="hidden xs:block">
                            <h1 className="text-xl font-bold text-foreground tracking-tight leading-none">LogOps Console</h1>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1.5">Intelligence Layer v2.0</p>
                        </div>
                    </div>
                    <DashboardHeader isLive={isLive} timeRange={timeRange} setTimeRange={setTimeRange} />
                </div>
            </header>

            <main className="flex-1 flex flex-col bg-background">
                <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 space-y-4">
                    {/* Layer 0: System Reliability & Notifications */}
                    <div className="space-y-4">
                        <DegradedBanner metrics={stats.system} />
                        <SystemHealthPanel metrics={stats.system} />
                    </div>

                    {/* Layer 1: System Overview */}
                    <section className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            <MetricCard
                                label="Health" value={stats.metrics.healthScore} unit="%" color={stats.metrics.healthScore > 80 ? THEME.success : stats.metrics.healthScore > 50 ? THEME.warning : THEME.error}
                                desc="System integrity" compact
                            />
                            <MetricCard
                                label="TPS" value={stats.metrics.logsPerSecond} unit="LPS" color={THEME.accentPurple}
                                desc="Ingestion rate" compact
                            />
                            <MetricCard
                                label="Error" value={(stats.metrics.errorRate * 100).toFixed(1)} unit="%" color={THEME.error}
                                desc="Failure rate" compact
                            />
                            <MetricCard
                                label="Latency" value={stats.metrics.avgLatency} unit="ms" color={THEME.accentCyan}
                                desc="Response time" compact
                            />
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                            {/* Main Overview Graphics */}
                            <div className="xl:col-span-8 bg-card rounded-3xl border border-border shadow-sm overflow-hidden min-h-[450px]">
                                <TelemetryChart data={stats.timeline} alerts={stats.alerts} />
                            </div>
                            <div className="xl:col-span-4 bg-card rounded-3xl border border-border shadow-sm overflow-hidden min-h-[450px]">
                                <DistributionDonut data={stats.distribution} />
                            </div>
                        </div>
                    </section>

                    {/* Layer 2: Investigation Workspace */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-muted" />
                                <h2 className="text-sm font-bold text-secondary uppercase tracking-widest">System Workspace</h2>
                            </div>
                            <Link
                                href="/incidents"
                                className="px-4 py-2 bg-surface border border-border text-foreground rounded-xl text-xs font-bold hover:bg-elevated transition-colors shadow-sm flex items-center gap-2"
                            >
                                <ShieldAlert className="w-4 h-4 text-accent-pink" />
                                View Incidents
                            </Link>
                        </div>

                        {/* Logs Stream - Full Width */}
                        <div className="flex flex-col bg-card rounded-3xl border border-border shadow-sm overflow-hidden min-h-[600px]">
                            <div className="px-6 py-4 border-b border-border bg-card flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
                                    <h2 className="text-xs font-bold text-foreground uppercase tracking-widest">Live Log Stream</h2>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-muted uppercase tracking-widest">
                                    <span>Real-time Telemetry</span>
                                    <span className="text-primary">Auto-syncing</span>
                                </div>
                            </div>
                            <div className="flex-1 overflow-x-auto custom-scrollbar bg-card">
                                <LogFeedTable logs={stats.recentLogs} alerts={stats.alerts} />
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Layer 3: Simulation Lab (Expandable Drawer) */}
            <div className="flex-shrink-0 z-40 bg-white border-t border-slate-200 sticky bottom-0 xl:static">
                <button
                    onClick={() => setIsSimulationOpen(!isSimulationOpen)}
                    className="w-full h-10 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-[0.2em] group bg-white"
                >
                    <Zap className={`w-3 h-3 transition-colors ${isSimulationOpen ? 'text-blue-500' : 'text-slate-400'}`} />
                    Simulation Lab
                    {isSimulationOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
                <AnimatePresence>
                    {isSimulationOpen && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="bg-slate-900 overflow-hidden"
                        >
                            <div className="p-8 max-w-4xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 h-6 px-2 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">
                                            Control Plane
                                        </div>
                                        <h3 className="text-xl font-bold text-white tracking-tight">Active Scenarios</h3>
                                        <p className="text-sm text-slate-400">Trigger failure patterns to validate system resilience and alert propagation.</p>
                                    </div>
                                    <div className="flex justify-center bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-inner">
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
