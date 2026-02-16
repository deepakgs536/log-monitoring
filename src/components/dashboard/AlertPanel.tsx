'use client';

import { Alert } from '@/lib/types';

interface AlertPanelProps {
    alerts: Alert[];
}

export const AlertPanel = ({ alerts }: AlertPanelProps) => {
    if (!alerts || alerts.length === 0) return null;

    return (
        <div className="space-y-4 animate-row-in">
            <div className="flex items-center gap-2 px-1">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">System Incidents</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {alerts.map((alert) => (
                    <div key={alert.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50 group relative overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${alert.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-500'}`} />

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                <span className={alert.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'}>
                                    {alert.severity === 'critical' ? '🔴 Critical' : '🟠 Warning'}
                                </span>
                                <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                            </div>

                            <div className="min-w-0">
                                <h4 className="text-[13px] font-bold text-slate-900 mb-1 leading-tight line-clamp-1">{alert.message}</h4>
                                <p className="text-[10px] text-slate-500 leading-relaxed font-medium line-clamp-2">
                                    {alert.metadata?.rationale || 'Anomaly detected via statistical pattern variance.'}
                                </p>
                            </div>

                            {alert.metadata?.confidence && (
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <div className="flex gap-3">
                                        <div className="text-[8px] font-bold">
                                            <span className="text-slate-300 uppercase block mb-0.5">Baseline</span>
                                            <span className="text-slate-500 font-mono">{alert.metadata.averageRate ?? '30.0%'}</span>
                                        </div>
                                        <div className="text-[8px] font-bold">
                                            <span className="text-slate-300 uppercase block mb-0.5">Threshold</span>
                                            <span className="text-rose-500 font-mono">{alert.metadata.threshold}</span>
                                        </div>
                                    </div>
                                    <div className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[9px] font-bold text-emerald-600">
                                        {alert.metadata.confidence}%
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
