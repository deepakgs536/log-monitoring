'use client';

import { useEffect, useState } from 'react';
import { LogStats, TimeRange } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { AlertPanel } from '@/components/dashboard/AlertPanel';
import { TelemetryChart } from '@/components/dashboard/TelemetryChart';
import { DistributionDonut } from '@/components/dashboard/DistributionDonut';
import { LogFeedTable } from '@/components/dashboard/LogFeedTable';
import { IncidentTimeline } from '@/components/dashboard/IncidentTimeline';
import { SimulationControls } from '@/components/dashboard/SimulationControls';
import { THEME } from '@/components/dashboard/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Terminal, ShieldAlert, Zap, ChevronUp, ChevronDown } from 'lucide-react';

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
        <div className="flex flex-col min-h-screen xl:h-screen xl:overflow-hidden bg-[#f8fafc] selection:bg-blue-100">
            {/* Header - Fixed */}
            <header className="h-16 flex-shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between z-30 sticky top-0 xl:static">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                        <Activity className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="hidden xs:block">
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">LogOps Console</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Intelligence Layer v2.0</p>
                    </div>
                </div>
                <DashboardHeader isLive={isLive} timeRange={timeRange} setTimeRange={setTimeRange} />
            </header>

            <div className="flex-1 flex flex-col min-h-0 bg-[#f8fafc] xl:overflow-hidden overflow-y-auto xl:overflow-y-hidden">
                {/* Layer 1: System Overview */}
                <section className="min-h-fit xl:h-[38vh] flex-shrink-0 border-b border-slate-200 bg-white overflow-hidden flex flex-col">
                    <div className="p-4 xl:px-6 xl:py-4 flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 xl:gap-6 h-full">
                            {/* KPIs - 2x2 on mobile, 4-row on desktop */}
                            <div className="col-span-1 md:col-span-2 xl:col-span-12">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xl:gap-8 mb-4 xl:mb-2">
                                    <MetricCard
                                        label="Health" value={stats.metrics.healthScore} unit="%" color={stats.metrics.healthScore > 80 ? THEME.success : stats.metrics.healthScore > 50 ? THEME.secondary : THEME.critical}
                                        desc="System integrity" compact
                                    />
                                    <MetricCard
                                        label="TPS" value={stats.metrics.logsPerSecond} unit="LPS" color={THEME.primary}
                                        desc="Ingestion rate" compact
                                    />
                                    <MetricCard
                                        label="Error" value={(stats.metrics.errorRate * 100).toFixed(1)} unit="%" color={THEME.critical}
                                        desc="Failure rate" compact
                                    />
                                    <MetricCard
                                        label="Latency" value={stats.metrics.avgLatency} unit="ms" color={THEME.secondary}
                                        desc="Response time" compact
                                    />
                                </div>
                            </div>

                            {/* Main Overview Graphics */}
                            <div className="col-span-1 md:col-span-2 xl:col-span-8 min-h-[300px] xl:h-[calc(100%-60px)]">
                                <TelemetryChart data={stats.timeline} alerts={stats.alerts} />
                            </div>
                            <div className="col-span-1 md:col-span-2 xl:col-span-4 min-h-[300px] xl:h-[calc(100%-60px)]">
                                <DistributionDonut data={stats.distribution} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Layer 2: Investigation Workspace */}
                <section className="flex-1 min-h-fit xl:min-h-0 bg-slate-50/50 flex flex-col xl:flex-row">
                    <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 h-full gap-0">
                        {/* Logs Stream */}
                        <div className="col-span-1 xl:col-span-8 flex flex-col border-b xl:border-b-0 xl:border-r border-slate-200 min-h-[500px] xl:h-full">
                            <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-10">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-slate-400" />
                                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Live Log Stream</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-blue-600 uppercase">Streaming</span>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/20">
                                <LogFeedTable logs={stats.recentLogs} alerts={stats.alerts} />
                            </div>
                        </div>

                        {/* Incident Triage */}
                        <div className="col-span-1 xl:col-span-4 flex flex-col xl:h-full min-h-fit xl:min-h-0">
                            <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center gap-2 sticky top-0 z-10">
                                <ShieldAlert className="w-4 h-4 text-slate-400" />
                                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Incident Feed</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto xl:overflow-y-auto custom-scrollbar bg-white">
                                <div className="p-4 space-y-6">
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <AlertPanel alerts={stats.alerts} />
                                    </div>
                                    <IncidentTimeline alerts={stats.alerts} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

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
