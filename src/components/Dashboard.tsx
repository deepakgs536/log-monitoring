'use client';

import { useEffect, useState } from 'react';
import { Alert, LogStats, TimeRange } from '@/lib/types';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { MetricCard } from './dashboard/MetricCard';
import { AlertPanel } from './dashboard/AlertPanel';
import { TelemetryChart } from './dashboard/TelemetryChart';
import { DistributionDonut } from './dashboard/DistributionDonut';
import { LogFeedTable } from './dashboard/LogFeedTable';
import { IncidentTimeline } from './dashboard/IncidentTimeline';
import { THEME } from './dashboard/constants';

export default function Dashboard() {
    const [stats, setStats] = useState<LogStats | null>(null);
    const [prevStats, setPrevStats] = useState<LogStats | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>('1h');
    const [isLive, setIsLive] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/stats?timeRange=${timeRange}`);
                const data = await res.json();
                setStats(current => {
                    if (current) setPrevStats(current);
                    return data;
                });
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
            <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Initializing Core...</p>
                </div>
            </div>
        );
    }

    const calculateTrend = (key: string, currentValue: number) => {
        if (!prevStats) return null;
        let prevValue = 0;
        if (key === 'total') prevValue = prevStats.total;
        else prevValue = prevStats.distribution.find((d: any) => d.name === key)?.value || 0;

        if (prevValue === 0) return null;
        const diff = currentValue - prevValue;
        const percent = (diff / prevValue) * 100;
        return { isPositive: diff >= 0, percent: Math.abs(percent).toFixed(1) };
    };

    return (
        <div className="p-6 sm:p-12 space-y-12 min-h-screen font-sans antialiased text-slate-900 bg-[#f8fafc]">
            <DashboardHeader isLive={isLive} timeRange={timeRange} setTimeRange={setTimeRange} />

            <AlertPanel alerts={stats.alerts} />

            <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-8">
                <div className="space-y-8">
                    <TelemetryChart data={stats.timeline} alerts={stats.alerts} />
                    <LogFeedTable logs={stats.recentLogs} alerts={stats.alerts} />
                </div>
                <div className="space-y-8">
                    <DistributionDonut data={stats.distribution} />
                    <IncidentTimeline alerts={stats.alerts} />
                </div>
            </div>

            {/* Intelligence Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <MetricCard
                    label="System Health" value={stats.metrics.healthScore} unit="%" color={stats.metrics.healthScore > 80 ? THEME.success : stats.metrics.healthScore > 50 ? THEME.secondary : THEME.critical}
                    desc="Weighted operational score" trend={stats.metrics.healthScore > 90 ? 'Optimal' : stats.metrics.healthScore > 70 ? 'Degraded' : 'CRITICAL'}
                />
                <MetricCard
                    label="Throughput" value={stats.metrics.logsPerSecond} unit="LPS" color={THEME.primary}
                    desc="Logs per second (30s window)" trend={stats.metrics.logsPerSecond > 50 ? 'High load' : 'Normal'}
                />
                <MetricCard
                    label="Error Rate" value={(stats.metrics.errorRate * 100).toFixed(1)} unit="%" color={THEME.critical}
                    desc="Failure percentage" trend={stats.metrics.errorRate > 0.1 ? 'Unstable' : 'Healthy'}
                />
                <MetricCard
                    label="Avg Latency" value={stats.metrics.avgLatency} unit="ms" color={THEME.secondary}
                    desc="Request response time" trend={stats.metrics.avgLatency > 500 ? 'Slow' : 'Fast'}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { key: 'info', label: 'Healthy', value: stats.distribution.find((d: any) => d.name === 'info')?.value || 0, color: THEME.success, desc: 'Normal events' },
                    { key: 'warn', label: 'Warnings', value: stats.distribution.find((d: any) => d.name === 'warn')?.value || 0, color: THEME.secondary, desc: 'Active alerts' },
                    { key: 'error', label: 'Critical', value: stats.distribution.find((d: any) => d.name === 'error')?.value || 0, color: THEME.critical, desc: 'Failure events' },
                    { key: 'total', label: 'Total Logs', value: stats.total, color: THEME.primary, desc: 'Total throughput' },
                ].map((item) => (
                    <MetricCard
                        key={item.key} label={item.label} value={item.value} color={item.color}
                        desc={item.desc} trend={calculateTrend(item.key, item.value) || undefined}
                    />
                ))}
            </div>
        </div>
    );
}
