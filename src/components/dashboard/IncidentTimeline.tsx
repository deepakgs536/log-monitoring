'use client';

import { Alert } from '@/lib/types';

interface IncidentTimelineProps {
    alerts: Alert[];
}

export const IncidentTimeline = ({ alerts }: IncidentTimelineProps) => {
    // Sort alerts by timestamp descending
    const sortedAlerts = [...alerts].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);

    if (alerts.length === 0) {
        return (
            <div className="p-8 rounded-3xl border border-border bg-card shadow-soft h-full flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mb-4">
                    <span className="text-xl">📜</span>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1">No Incidents Yet</h3>
                <p className="text-[10px] text-muted max-w-[150px]">Narrative logs will appear here during system anomalies.</p>
            </div>
        );
    }

    return (
        <div className="p-8 rounded-3xl border border-border bg-card shadow-soft h-full">
            <div className="flex items-center gap-2 mb-8">
                <span className="text-xs">📜</span>
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted">Incident Narrative</h3>
            </div>

            <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-divider">
                {sortedAlerts.map((alert, idx) => (
                    <div key={alert.id} className="relative pl-6 group">
                        <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-card shadow-sm transition-transform group-hover:scale-125 ${alert.severity === 'critical' ? 'bg-error shadow-glow-error' : 'bg-warning shadow-glow-warning'
                            }`} />
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-muted">
                                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter ${alert.type === 'spike' ? 'bg-info-soft text-info' : 'bg-error-soft text-error'
                                    }`}>{alert.type}</span>
                            </div>
                            <p className="text-[11px] font-semibold text-foreground leading-tight">
                                {alert.type === 'spike' && `Traffic surge detected in ${alert.service}`}
                                {alert.type === 'error_burst' && `Error escalation in ${alert.service}`}
                                {alert.type === 'repetition' && `Spam pattern identified`}
                            </p>
                            {alert.metadata?.contributor && (
                                <p className="text-[9px] text-secondary italic">Affected: {alert.metadata.contributor}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
