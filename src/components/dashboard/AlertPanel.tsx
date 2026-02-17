'use client';

import { Alert } from '@/lib/types';
import { AlertTriangle, Clock, ChevronRight, Zap, RefreshCw } from 'lucide-react';

interface AlertPanelProps {
    alerts: Alert[];
    onSelectAlert?: (alert: Alert) => void;
    selectedAlertId?: string;
}

export const AlertPanel = ({ alerts, onSelectAlert, selectedAlertId }: AlertPanelProps) => {
    if (!alerts || alerts.length === 0) return null;

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'spike': return <Zap className="w-4 h-4" />;
            case 'error_burst': return <AlertTriangle className="w-4 h-4" />;
            case 'repetition': return <RefreshCw className="w-4 h-4" />;
            default: return <AlertTriangle className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2 px-1 mb-1">
                <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 animate-ping opacity-25" />
                </div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Active Incidents</h2>
                <span className="ml-auto text-[11px] font-semibold text-red-500 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">{alerts.length}</span>
            </div>

            {/* Alert Cards */}
            <div className="grid grid-cols-1 gap-3">
                {alerts.map((alert) => {
                    const isSelected = selectedAlertId === alert.id;
                    const isCritical = alert.severity === 'critical';

                    return (
                        <div
                            key={alert.id}
                            onClick={() => onSelectAlert?.(alert)}
                            className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer group overflow-hidden ${isSelected
                                ? 'bg-white border-red-200 shadow-lg shadow-red-100/40 ring-1 ring-red-100'
                                : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 hover:translate-y-[-1px]'
                                }`}
                        >
                            {/* Left accent stripe */}
                            <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl transition-all ${isCritical
                                    ? isSelected ? 'bg-gradient-to-b from-red-500 to-rose-400' : 'bg-red-400'
                                    : isSelected ? 'bg-gradient-to-b from-amber-400 to-orange-400' : 'bg-amber-400'
                                }`} />

                            <div className="flex items-start gap-3 pl-2">
                                {/* Icon */}
                                <div className={`mt-0.5 p-2 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${isCritical
                                        ? 'bg-red-50 text-red-500'
                                        : 'bg-amber-50 text-amber-500'
                                    }`}>
                                    {getTypeIcon(alert.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-[10px] font-semibold uppercase tracking-wide ${isCritical ? 'text-red-500' : 'text-amber-500'
                                            }`}>
                                            {isCritical ? 'Critical' : 'Warning'}
                                        </span>
                                        <div className="flex items-center gap-1 text-gray-400">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-[10px] font-medium tabular-nums">
                                                {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="text-[13px] font-semibold text-gray-900 mb-1 leading-tight line-clamp-1">{alert.message}</h4>
                                    <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-1">
                                        {alert.metadata?.rationale || 'Anomaly detected via statistical pattern variance.'}
                                    </p>

                                    {/* Metrics Footer */}
                                    {alert.confidence !== undefined && (
                                        <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-gray-50">
                                            <div className="flex gap-4">
                                                <div className="text-[10px]">
                                                    <span className="text-gray-400 block mb-0.5">Baseline</span>
                                                    <span className="text-gray-600 font-mono font-semibold tabular-nums">{alert.metadata?.averageRate?.toFixed(1) ?? '--'}</span>
                                                </div>
                                                <div className="text-[10px]">
                                                    <span className="text-gray-400 block mb-0.5">Threshold</span>
                                                    <span className="text-red-500 font-mono font-semibold">{alert.metadata?.threshold ?? 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${(alert.confidence || 0) > 90
                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                                    : 'bg-amber-50 border-amber-200 text-amber-600'
                                                }`}>
                                                {alert.confidence}% conf.
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Chevron */}
                                <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-red-400 transition-colors shrink-0 mt-2 group-hover:translate-x-0.5" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
