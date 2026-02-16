'use client';

import { useEffect, useState } from 'react';
import { Alert, LogStats, TimeRange } from '@/lib/types';
import { AlertPanel } from '@/components/dashboard/AlertPanel';
import { IncidentTimeline } from '@/components/dashboard/IncidentTimeline';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Activity, ShieldAlert } from 'lucide-react';

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
        <div className="flex flex-col min-h-screen bg-background">
            <header className="h-20 flex-shrink-0 border-b border-border bg-background/80 backdrop-blur-md px-6 flex items-center justify-between z-30 sticky top-0">
                <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="p-2 hover:bg-elevated rounded-xl transition-colors text-muted hover:text-foreground"
                        >
                            <Activity className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-foreground tracking-tight leading-none text-center">Incident Feed</h1>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1.5">Monitoring Active Criticalities</p>
                        </div>
                    </div>
                    <DashboardHeader isLive={isLive} timeRange={timeRange} setTimeRange={setTimeRange} />
                </div>
            </header>

            <main className="flex-1 bg-background">
                <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                        <div className="xl:col-span-8 space-y-8">
                            <div className="bg-card rounded-3xl border border-border shadow-premium overflow-hidden">
                                <div className="px-8 py-5 border-b border-border bg-card flex items-center justify-between">
                                    <h2 className="text-xs font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
                                        Active Detection Stream
                                    </h2>
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
                                        Last updated: {new Date().toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="p-8">
                                    <AlertPanel alerts={stats.alerts} onSelectAlert={function (alert: Alert): void {
                                        throw new Error('Function not implemented.');
                                    }} />
                                </div>
                            </div>
                        </div>

                        <div className="xl:col-span-4 space-y-8 h-full">
                            <div className="bg-card rounded-3xl border border-border shadow-premium p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <ShieldAlert className="w-5 h-5 text-muted" />
                                    <h2 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">Timeline Analysis</h2>
                                </div>
                                <IncidentTimeline alerts={stats.alerts} />
                            </div>

                            <div className="bg-surface border border-border rounded-3xl p-8 shadow-premium text-foreground">
                                <h3 className="text-sm font-bold mb-3 text-foreground">Triage Protocol</h3>
                                <p className="text-xs text-secondary leading-relaxed">
                                    All incidents are automatically classified by the intelligence layer.
                                    Critical alerts require immediate investigation via the Log Stream.
                                </p>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="mt-6 w-full py-3 bg-card hover:bg-elevated border border-divider rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all text-foreground"
                                >
                                    Return to Console
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
