'use client';

import { Log, Alert } from '@/lib/types';

interface LogFeedTableProps {
    logs: Log[];
    alerts: Alert[];
}

export const LogFeedTable = ({ logs, alerts }: LogFeedTableProps) => {
    return (
        <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden">
            <div className="border-b border-border p-6 flex items-center justify-between bg-surface/30">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary">Log Triage Engine</h2>
                </div>
                <span className="text-[10px] font-bold text-muted font-mono tracking-tighter">Auto-Refreshing Stream</span>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[500px] custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-border bg-surface">
                            <th className="w-1 px-0"></th>
                            <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-muted">Timestamp</th>
                            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Service</th>
                            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Level</th>
                            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center">
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted animate-pulse">Waiting for incoming telemetry...</p>
                                </td>
                            </tr>
                        ) : logs.map((log, i) => (
                            <tr
                                key={`${log.timestamp}-${i}`}
                                className={`group hover:bg-elevated bg-surface transition-colors cursor-pointer animate-row-in opacity-0 ${alerts.some(a => a.metadata?.message === log.message) ? 'bg-warning/0' : ''
                                    }`}
                                style={{ animationDelay: `${i * 30}ms` }}
                            >
                                <td className="p-0 border-none">
                                    <div className={`w-1 h-full min-h-[44px] ${log.level === 'error' ? 'bg-error' :
                                        log.level === 'warn' ? 'bg-warning' :
                                            log.level === 'info' ? 'bg-info' : 'bg-success'
                                        }`} />
                                </td>
                                <td className="py-3 px-6">
                                    <span className="text-[10px] font-bold text-muted font-mono tracking-tight tabular-nums">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-opacity-90 border ${log.level === 'error' ? 'bg-error-soft text-error border-error/20' :
                                        log.level === 'warn' ? 'bg-warning-soft text-warning border-warning/20' :
                                            log.level === 'info' ? 'bg-info-soft text-info border-info/20' :
                                                'bg-success-soft text-success border-success/20'
                                        }`}>
                                        {log.service}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${log.level === 'error' ? 'bg-error shadow-glow-error' :
                                            log.level === 'warn' ? 'bg-warning shadow-glow-warning' :
                                                log.level === 'info' ? 'bg-info shadow-glow-info' : 'bg-success shadow-glow-success'
                                            }`} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{log.level}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 max-w-md lg:max-w-2xl truncate">
                                    <span className="text-[11px] font-semibold text-secondary">
                                        {log.message}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
