'use client';

import { Log, Alert } from '@/lib/types';

interface LogFeedTableProps {
    logs: Log[];
    alerts: Alert[];
    compact?: boolean;
}

export const LogFeedTable = ({ logs, alerts, compact = false }: LogFeedTableProps) => {
    const getLevelStyles = (level: string) => {
        // Different badges for compact (dark terminal) vs standard (light card)
        if (compact) {
            switch (level) {
                case 'error': return { badge: 'text-red-400 bg-red-900/20 border-red-900/50', dot: 'bg-red-500' };
                case 'warn': return { badge: 'text-amber-400 bg-amber-900/20 border-amber-900/50', dot: 'bg-amber-500' };
                case 'info': return { badge: 'text-blue-400 bg-blue-900/20 border-blue-900/50', dot: 'bg-blue-500' };
                default: return { badge: 'text-emerald-400 bg-emerald-900/20 border-emerald-900/50', dot: 'bg-emerald-500' };
            }
        }
        switch (level) {
            case 'error': return { badge: 'bg-red-50 text-red-600 border-red-100', dot: 'bg-red-500' };
            case 'warn': return { badge: 'bg-amber-50 text-amber-600 border-amber-100', dot: 'bg-amber-500' };
            case 'info': return { badge: 'bg-blue-50 text-blue-600 border-blue-100', dot: 'bg-blue-500' };
            default: return { badge: 'bg-emerald-50 text-emerald-600 border-emerald-100', dot: 'bg-emerald-500' };
        }
    };

    if (compact) {
        return (
            <div className="w-full font-mono text-[11px]">
                <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-gray-800/50">
                        {logs.length === 0 ? (
                            <tr><td className="p-4 text-center text-gray-500 italic">No active streams...</td></tr>
                        ) : logs.map((log, i) => {
                            const styles = getLevelStyles(log.level);
                            return (
                                <tr key={`${log.timestamp}-${i}`} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-1.5 px-3 text-gray-500 w-24 whitespace-nowrap">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </td>
                                    <td className="py-1.5 px-2 w-20">
                                        <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${styles.badge}`}>
                                            {log.level}
                                        </span>
                                    </td>
                                    <td className="py-1.5 px-2 text-gray-300 truncate max-w-[180px] xl:max-w-[240px]">
                                        <span className="text-gray-500 mr-2">[{log.service}]</span>
                                        {log.message}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="overflow-x-auto overflow-y-auto max-h-[500px] custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/80 sticky top-0 z-10">
                            <th className="w-1 px-0"></th>
                            <th className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Timestamp</th>
                            <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Service</th>
                            <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Level</th>
                            <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" />
                                        <p className="text-sm font-medium text-gray-400">Waiting for telemetry data...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : logs.map((log, i) => {
                            const styles = getLevelStyles(log.level);
                            return (
                                <tr
                                    key={`${log.timestamp}-${i}`}
                                    className="group hover:bg-gray-50/80 transition-colors cursor-pointer animate-row-in opacity-0"
                                    style={{ animationDelay: `${i * 25}ms` }}
                                >
                                    <td className="p-0 border-none">
                                        <div className={`w-[3px] h-full min-h-[44px] ${log.level === 'error' ? 'bg-red-500' : log.level === 'warn' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                    </td>
                                    <td className="py-3 px-5">
                                        <span className="text-[11px] font-mono font-medium text-gray-500 tabular-nums">
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg border ${styles.badge}`}>
                                            {log.service}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                                            <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{log.level}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 max-w-md lg:max-w-2xl truncate">
                                        <span className="text-[12px] font-medium text-gray-600">
                                            {log.message}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
