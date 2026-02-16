'use client';

import { Alert } from '@/lib/types';

interface AlertPanelProps {
    alerts: Alert[];
    onSelectAlert: (alert: Alert) => void;
    selectedAlertId?: string;
}

export const AlertPanel = ({ alerts, onSelectAlert, selectedAlertId }: AlertPanelProps) => {
    if (!alerts || alerts.length === 0) return null;

    return (
        <div className="space-y-4 animate-row-in">
            <div className="flex items-center gap-2 px-1">
                <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted">System Incidents</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        onClick={() => onSelectAlert(alert)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${selectedAlertId === alert.id
                            ? 'bg-elevated border-accent-purple/50 shadow-soft scale-[1.02]'
                            : 'bg-card border-border shadow-soft hover:bg-surface hover:scale-[1.01]'
                            }`}
                    >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${selectedAlertId === alert.id ? 'w-1.5' : 'w-1'
                            } ${alert.severity === 'critical' ? 'bg-error' : 'bg-warn'}`} />

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between text-[9px] font-bold text-muted uppercase tracking-widest">
                                <span className={alert.severity === 'critical' ? 'text-error' : 'text-warn'}>
                                    {alert.severity === 'critical' ? '🔴 Critical' : '🟠 Warning'}
                                </span>
                                <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                            </div>

                            <div className="min-w-0">
                                <h4 className="text-[13px] font-bold text-foreground mb-1 leading-tight line-clamp-1">{alert.message}</h4>
                                <p className="text-[10px] text-secondary leading-relaxed font-medium line-clamp-2">
                                    {alert.metadata?.rationale || 'Anomaly detected via statistical pattern variance.'}
                                </p>
                            </div>

                            {alert.confidence !== undefined && (
                                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                    <div className="flex gap-3">
                                        <div className="text-[8px] font-bold">
                                            <span className="text-muted/60 uppercase block mb-0.5">Baseline</span>
                                            <span className="text-secondary font-mono">{alert.metadata?.averageRate?.toFixed(1) ?? '--'}</span>
                                        </div>
                                        <div className="text-[8px] font-bold">
                                            <span className="text-muted/60 uppercase block mb-0.5">Threshold</span>
                                            <span className="text-error font-mono">{alert.metadata?.threshold ?? 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded-full border text-[9px] font-bold flex items-center gap-1 ${alert.confidence > 90 ? 'bg-success/10 border-success/20 text-success' :
                                        'bg-warning/10 border-warning/20 text-warning'
                                        }`}>
                                        <span>{alert.confidence}%</span>
                                        <span className="text-[8px] opacity-70 uppercase tracking-wider">Confidence</span>
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
