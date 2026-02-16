'use client';

import { useEffect, useState } from 'react';
import { LogStats, TimeRange } from '@/lib/types';
import { TelemetryChart } from '@/components/dashboard/TelemetryChart';
import { DistributionDonut } from '@/components/dashboard/DistributionDonut';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { THEME } from '@/components/dashboard/constants';

export default function TelemetryPage() {
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
                console.error('Failed to fetch telemetry:', error);
            }
        };

        fetchStats();
        if (isLive) {
            interval = setInterval(fetchStats, 2000);
        }

        return () => clearInterval(interval);
    }, [timeRange, isLive]);

    if (!stats) return null;

    return (
        <div className="p-6 lg:p-10 space-y-8">
            <DashboardHeader isLive={isLive} timeRange={timeRange} setTimeRange={setTimeRange} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { key: 'info', label: 'Healthy', value: stats.distribution.find((d: any) => d.name === 'info')?.value || 0, color: THEME.success, desc: 'Normal events' },
                    { key: 'warn', label: 'Warnings', value: stats.distribution.find((d: any) => d.name === 'warn')?.value || 0, color: THEME.secondary, desc: 'Active alerts' },
                    { key: 'error', label: 'Critical', value: stats.distribution.find((d: any) => d.name === 'error')?.value || 0, color: THEME.critical, desc: 'Failure events' },
                    { key: 'total', label: 'Total Logs', value: stats.total, color: THEME.primary, desc: 'Total throughput' },
                ].map((item) => (
                    <MetricCard
                        key={item.key} label={item.label} value={item.value} color={item.color}
                        desc={item.desc}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                <TelemetryChart data={stats.timeline} alerts={stats.alerts} />
                <DistributionDonut data={stats.distribution} />
            </div>
        </div>
    );
}
