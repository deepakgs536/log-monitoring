'use client';

import { useEffect, useState } from 'react';
import { LogStats, TimeRange } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { AlertPanel } from '@/components/dashboard/AlertPanel';
import { TelemetryChart } from '@/components/dashboard/TelemetryChart';
import { THEME } from '@/components/dashboard/constants';

export default function Overview() {
    const [stats, setStats] = useState<LogStats | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>('1h');
    const [isLive, setIsLive] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/stats?timeRange=${timeRange}`);
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
    }, [timeRange, isLive]);

    if (!stats) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Intelligence...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-700">
            <DashboardHeader isLive={isLive} timeRange={timeRange} setTimeRange={setTimeRange} />

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    label="System Health"
                    value={stats.metrics.healthScore}
                    unit="%"
                    color={stats.metrics.healthScore > 80 ? THEME.success : stats.metrics.healthScore > 50 ? THEME.secondary : THEME.critical}
                    desc="Weighted operational score"
                    trend={stats.metrics.healthScore > 90 ? 'Optimal' : stats.metrics.healthScore > 70 ? 'Degraded' : 'CRITICAL'}
                />
                <MetricCard
                    label="Throughput"
                    value={stats.metrics.logsPerSecond}
                    unit="LPS"
                    color={THEME.primary}
                    desc="Logs per second (30s window)"
                    trend={stats.metrics.logsPerSecond > 50 ? 'High load' : 'Normal'}
                />
                <MetricCard
                    label="Error Rate"
                    value={(stats.metrics.errorRate * 100).toFixed(1)}
                    unit="%"
                    color={THEME.critical}
                    desc="Failure percentage"
                    trend={stats.metrics.errorRate > 0.1 ? 'Unstable' : 'Healthy'}
                />
                <MetricCard
                    label="Avg Latency"
                    value={stats.metrics.avgLatency}
                    unit="ms"
                    color={THEME.secondary}
                    desc="Request response time"
                    trend={stats.metrics.avgLatency > 500 ? 'Slow' : 'Fast'}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
                <div className="space-y-8">
                    <TelemetryChart data={stats.timeline} alerts={stats.alerts} />
                </div>
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900">Critical Alerts</h3>
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full border border-rose-100">Live</span>
                        </div>
                        <AlertPanel alerts={stats.alerts.filter(a => a.severity === 'critical').slice(0, 5)} />
                        {stats.alerts.filter(a => a.severity === 'critical').length === 0 && (
                            <div className="p-8 text-center">
                                <p className="text-sm text-slate-400">No critical issues detected</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
