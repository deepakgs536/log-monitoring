'use client';

import { useState, useEffect } from 'react';
import { LogStats } from '@/lib/types';
import { TelemetryChart } from '@/components/dashboard/TelemetryChart';
import { DistributionDonut } from '@/components/dashboard/DistributionDonut';

export default function AnalyticsPage() {
    const [stats, setStats] = useState<LogStats | null>(null);

    useEffect(() => {
        fetch('/api/stats?timeRange=24h').then(res => res.json()).then(setStats);
    }, []);

    return (
        <div className="p-8 space-y-6">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">System Analytics</h1>
                <p className="text-muted text-sm mt-1">Historical performance and trend analysis.</p>
            </header>

            {stats && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    <div className="xl:col-span-8 bg-card rounded-3xl border border-border shadow-soft overflow-hidden min-h-[500px]">
                        <div className="p-6 border-b border-border">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted">Traffic Trends (24h)</h3>
                        </div>
                        <TelemetryChart data={stats.timeline} alerts={stats.alerts} />
                    </div>
                    <div className="xl:col-span-4 bg-card rounded-3xl border border-border shadow-soft overflow-hidden min-h-[500px]">
                        <div className="p-6 border-b border-border">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted">Log Distribution</h3>
                        </div>
                        <DistributionDonut data={stats.distribution} />
                    </div>
                </div>
            )}
        </div>
    );
}
