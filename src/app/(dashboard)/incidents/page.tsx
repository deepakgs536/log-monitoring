'use client';

import { useEffect, useState } from 'react';
import { LogStats, TimeRange } from '@/lib/types';
import { AlertPanel } from '@/components/dashboard/AlertPanel';
import { IncidentTimeline } from '@/components/dashboard/IncidentTimeline';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function IncidentsPage() {
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
                console.error('Failed to fetch incidents:', error);
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

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="font-bold text-slate-900">Active Incident Feed</h2>
                        </div>
                        <AlertPanel alerts={stats.alerts} />
                    </div>
                </div>
                <div className="space-y-6">
                    <IncidentTimeline alerts={stats.alerts} />
                </div>
            </div>
        </div>
    );
}
