'use client';

import { Alert } from '@/lib/types';
import { ScrollText, AlertTriangle, Zap, RefreshCw, Clock } from 'lucide-react';

interface IncidentTimelineProps {
    alerts: Alert[];
}

export const IncidentTimeline = ({ alerts }: IncidentTimelineProps) => {
    const sortedAlerts = [...alerts].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);

    if (alerts.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                    <ScrollText className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">No Incidents Yet</h3>
                <p className="text-[11px] text-gray-400 max-w-[200px] leading-relaxed">
                    Incident timeline will populate automatically during system anomalies.
                </p>
            </div>
        );
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'spike': return <Zap className="w-3 h-3" />;
            case 'error_burst': return <AlertTriangle className="w-3 h-3" />;
            case 'repetition': return <RefreshCw className="w-3 h-3" />;
            default: return <AlertTriangle className="w-3 h-3" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'spike': return 'bg-blue-50 text-blue-500 border-blue-100';
            case 'error_burst': return 'bg-red-50 text-red-500 border-red-100';
            case 'repetition': return 'bg-purple-50 text-purple-500 border-purple-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-400" />
                    <h3 className="text-[13px] font-bold text-gray-900">Timeline</h3>
                </div>
                <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                    Last {sortedAlerts.length}
                </span>
            </div>

            {/* Timeline */}
            <div className="px-6 py-4 space-y-0 relative">
                {/* Timeline Line */}
                <div className="absolute left-[38px] top-6 bottom-6 w-[2px] rounded-full" />

                {sortedAlerts.map((alert, i) => (
                    <div key={alert.id} className="relative pl-10 py-3 group">
                        {/* Dot */}
                        <div className="absolute left-[16px] top-[14px]">
                            <div className={`w-[14px] h-[14px] rounded-full border-[3px] border-white shadow-sm transition-transform group-hover:scale-125 ${alert.severity === 'critical'
                                ? 'bg-red-500'
                                : 'bg-amber-400'
                                }`} />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono text-gray-400 tabular-nums">
                                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                                <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide border ${getTypeColor(alert.type)}`}>
                                    {getTypeIcon(alert.type)}
                                    {alert.type.replace('_', ' ')}
                                </span>
                            </div>
                            <p className="text-[12px] font-medium text-gray-700 leading-snug">
                                {alert.type === 'spike' && `Traffic surge detected in ${alert.service}`}
                                {alert.type === 'error_burst' && `Error escalation in ${alert.service}`}
                                {alert.type === 'repetition' && `Spam pattern identified in ${alert.service}`}
                            </p>
                            {alert.metadata?.contributor && (
                                <p className="text-[10px] text-gray-400">Source: {alert.metadata.contributor}</p>
                            )}
                        </div>

                        {/* Hover connector */}
                        <div className="absolute left-[45px] top-[24px] w-4 h-[1px] bg-gray-100 group-hover:bg-red-200 transition-colors" />
                    </div>
                ))}
            </div>
        </div>
    );
};
