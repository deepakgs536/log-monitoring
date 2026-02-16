'use client';

import { useEffect, useState } from 'react';
import { LogStats, TimeRange } from '@/lib/types';
import { LogFeedTable } from '@/components/dashboard/LogFeedTable';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function LogsPage() {
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
                console.error('Failed to fetch logs:', error);
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
        <div className="p-6 lg:p-10 space-y-6">
            <DashboardHeader isLive={isLive} timeRange={timeRange} setTimeRange={setTimeRange} />
            <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-bold text-slate-900">Live Log Stream</h2>
                    <p className="text-xs text-slate-500">Real-time ingestion from all distributed services</p>
                </div>
                <LogFeedTable logs={stats.recentLogs} alerts={stats.alerts} />
            </div>
        </div>
    );
}
