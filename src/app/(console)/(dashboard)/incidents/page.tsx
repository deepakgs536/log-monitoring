'use client';

import { useEffect, useState } from 'react';
import { Alert, LogStats, TimeRange } from '@/lib/types';
import { AlertPanel } from '@/components/dashboard/AlertPanel';
import { IncidentTimeline } from '@/components/dashboard/IncidentTimeline';
import { IncidentDrawer } from '@/components/dashboard/IncidentDrawer';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ShieldAlert, AlertTriangle, ArrowLeft, Zap, Activity, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import AppSelector from '../../../../components/layout/AppSelector';

import { useConsole } from '@/context/ConsoleContext';

export default function IncidentsPage() {
    const [stats, setStats] = useState<LogStats | null>(null);
    const { timeRange, isLive, setTimeRange } = useConsole();
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/stats?timeRange=${timeRange}`);
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch incidents:', error);
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
            <div className="flex items-center justify-center min-h-screen bg-[#F6F8FB]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-[3px] border-red-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-gray-400">Loading incident feed...</p>
                </div>
            </div>
        );
    }

    const criticalCount = stats.alerts.filter(a => a.severity === 'critical').length;
    const warningCount = stats.alerts.filter(a => a.severity === 'warn').length;

    return (
        <div className="min-h-screen bg-[#F6F8FB]">

            {/* Summary Stats Strip */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-50/60 border border-red-100/60">
                            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-red-600">{criticalCount}</p>
                                <p className="text-[10px] font-medium text-red-400 uppercase tracking-wider">Critical</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-50/60 border border-amber-100/60">
                            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-amber-600">{warningCount}</p>
                                <p className="text-[10px] font-medium text-amber-400 uppercase tracking-wider">Warnings</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-blue-50/60 border border-blue-100/60">
                            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-blue-600">{stats.alerts.length}</p>
                                <p className="text-[10px] font-medium text-blue-400 uppercase tracking-wider">Total Events</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-50/60 border border-green-100/60">
                            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-green-600">{stats.metrics.healthScore}%</p>
                                <p className="text-[10px] font-medium text-green-400 uppercase tracking-wider">Health</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

                    {/* Left: Active Detection Stream */}
                    <div className="xl:col-span-8 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Section Header */}
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping opacity-20" />
                                    </div>
                                    <h2 className="text-[13px] font-bold text-gray-900">Active Detection Stream</h2>
                                    <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                                        {stats.alerts.length} events
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="text-[11px] font-medium">
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </div>
                            </div>

                            {/* Alert Panel */}
                            <div className="p-5">
                                <AlertPanel
                                    alerts={stats.alerts}
                                    onSelectAlert={(alert) => setSelectedAlert(alert)}
                                    selectedAlertId={selectedAlert?.id}
                                />

                                {stats.alerts.length === 0 && (
                                    <div className="py-16 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
                                            <ShieldAlert className="w-7 h-7 text-green-400" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-1">All Clear</h3>
                                        <p className="text-xs text-gray-400 max-w-[240px]">No active incidents detected. System is operating within normal parameters.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="xl:col-span-4 space-y-6">

                        {/* Timeline */}
                        <IncidentTimeline alerts={stats.alerts} />

                        {/* Triage Protocol Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
                            {/* Subtle red accent corner */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-50 to-transparent rounded-bl-[80px]" />

                            <div className="relative">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-5 rounded-full bg-gradient-to-b from-red-500 to-rose-400" />
                                    <h3 className="text-sm font-bold text-gray-900">Triage Protocol</h3>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed mb-5">
                                    All incidents are automatically classified by the intelligence layer.
                                    Critical alerts require immediate investigation via the Log Stream.
                                </p>

                                <div className="space-y-2 mb-5">
                                    <div className="flex items-center gap-2 text-[11px]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        <span className="text-gray-600">Critical — Immediate response required</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        <span className="text-gray-600">Warning — Investigate within SLA window</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        <span className="text-gray-600">Info — Advisory, no action required</span>
                                    </div>
                                </div>

                                <Link
                                    href="/console"
                                    className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-lg shadow-red-200/40 transition-all flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-red-200/50"
                                >
                                    <Activity className="w-4 h-4" />
                                    Open Console
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Incident Detail Drawer */}
            <IncidentDrawer alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
        </div>
    );
}
