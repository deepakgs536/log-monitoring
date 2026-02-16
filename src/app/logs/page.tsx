'use client';

import { useState, useEffect } from 'react';
import { LogStats } from '@/lib/types';
import { LogFeedTable } from '@/components/dashboard/LogFeedTable';
import { Search, Filter } from 'lucide-react';

export default function LogsPage() {
    const [stats, setStats] = useState<LogStats | null>(null);

    useEffect(() => {
        // Reuse stats API for now, optimized log API would be better later
        fetch('/api/stats?timeRange=1h').then(res => res.json()).then(setStats);
    }, []);

    return (
        <div className="p-8 space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Log Explorer</h1>
                    <p className="text-muted text-sm mt-1">Deep dive into raw telemetry streams.</p>
                </div>
            </header>

            <div className="bg-card rounded-2xl border border-border p-4 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        type="text"
                        placeholder="Search logs (service, message, trace_id)..."
                        className="w-full bg-surface border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary"
                    />
                </div>
                <button className="px-4 py-2 bg-surface hover:bg-elevated rounded-xl border border-border text-sm font-bold text-muted flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {stats && (
                <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden min-h-[600px]">
                    <div className="flex-1 overflow-x-auto custom-scrollbar">
                        <LogFeedTable logs={stats.recentLogs} alerts={stats.alerts} />
                    </div>
                </div>
            )}
        </div>
    );
}
