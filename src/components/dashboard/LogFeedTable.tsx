'use client';

import { Log, Alert } from '@/lib/types';

interface LogFeedTableProps {
    logs: Log[];
    alerts: Alert[];
}

export const LogFeedTable = ({ logs, alerts }: LogFeedTableProps) => {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="border-b border-slate-100 p-6 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Log Triage Engine</h2>
                </div>
                <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">Auto-Refreshing Stream</span>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[500px] custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-slate-50 bg-slate-50/20">
                            <th className="w-1 px-0"></th>
                            <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Service</th>
                            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Level</th>
                            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center">
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 animate-pulse">Waiting for incoming telemetry...</p>
                                </td>
                            </tr>
                        ) : logs.map((log, i) => (
                            <tr
                                key={`${log.timestamp}-${i}`}
                                className={`group hover:bg-slate-50/50 transition-colors cursor-pointer animate-row-in opacity-0 ${alerts.some(a => a.metadata?.message === log.message) ? 'bg-amber-50/50 animate-glow-pulse' : ''
                                    }`}
                                style={{ animationDelay: `${i * 30}ms` }}
                            >
                                <td className="p-0 border-none">
                                    <div className={`w-1 h-full min-h-[44px] ${log.level === 'error' ? 'bg-rose-500' :
                                        log.level === 'warn' ? 'bg-amber-500' :
                                            log.level === 'info' ? 'bg-blue-500' : 'bg-emerald-500'
                                        }`} />
                                </td>
                                <td className="py-3 px-6">
                                    <span className="text-[10px] font-bold text-slate-500 font-mono tracking-tight tabular-nums">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border text-opacity-90 ${log.level === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                                        log.level === 'warn' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                            log.level === 'info' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                                'bg-emerald-50 text-emerald-800 border-emerald-200'
                                        }`}>
                                        {log.service}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${log.level === 'error' ? 'bg-rose-600 shadow-[0_0_8px_rgba(220,38,38,0.4)]' :
                                            log.level === 'warn' ? 'bg-amber-600' :
                                                log.level === 'info' ? 'bg-blue-600' : 'bg-emerald-600'
                                            }`} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{log.level}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 max-w-md lg:max-w-2xl truncate">
                                    <span className="text-[11px] font-semibold text-slate-800">
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
