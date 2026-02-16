import React from 'react';
import { SystemMetrics } from '@/lib/types';
import { THEME } from './constants';
import { Activity, Database, Server, Workflow } from 'lucide-react';

interface SystemHealthPanelProps {
    metrics: SystemMetrics;
}

export const SystemHealthPanel = ({ metrics }: SystemHealthPanelProps) => {
    return (
        <div className="bg-card rounded-3xl border border-border shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${metrics.status === 'healthy' ? 'bg-success-soft text-success' :
                            metrics.status === 'degraded' ? 'bg-warning-soft text-warning' :
                                'bg-error-soft text-error'
                        }`}>
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xs font-black text-foreground uppercase tracking-widest">System Reliability</h2>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${metrics.status === 'healthy' ? 'text-success' :
                                metrics.status === 'degraded' ? 'text-warning' :
                                    'text-error'
                            }`}>
                            {metrics.status === 'healthy' ? 'Operational' :
                                metrics.status === 'degraded' ? 'Degraded Performance' :
                                    'Critical System Failure'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] text-muted uppercase font-bold">Uptime</p>
                        <p className="text-xs font-mono text-foreground">99.98%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Buffer Status */}
                <div className="bg-surface rounded-xl p-4 border border-border relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-2 relative z-10">
                        <span className="text-[10px] font-bold text-muted uppercase">Ingestion Buffer</span>
                        <Database className="w-4 h-4 text-secondary opacity-50" />
                    </div>
                    <div className="flex items-end gap-1 mb-2 relative z-10">
                        <span className="text-2xl font-black text-foreground">{metrics.bufferSize.toFixed(1)}</span>
                        <span className="text-sm font-bold text-muted mb-1">%</span>
                    </div>
                    <div className="h-1.5 w-full bg-elevated rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${metrics.bufferSize > 90 ? 'bg-error shadow-glow-error' :
                                    metrics.bufferSize > 60 ? 'bg-warning shadow-glow-warning' :
                                        'bg-success shadow-glow-success'
                                }`}
                            style={{ width: `${metrics.bufferSize}%` }}
                        />
                    </div>
                </div>

                {/* Processing Latency */}
                <div className="bg-surface rounded-xl p-4 border border-border relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-muted uppercase">Detection Lag</span>
                        <Workflow className="w-4 h-4 text-secondary opacity-50" />
                    </div>
                    <div className="flex items-end gap-1 relative z-10">
                        <span className={`text-2xl font-black ${metrics.detectionLatency > 1000 ? 'text-error' :
                                metrics.detectionLatency > 300 ? 'text-warning' :
                                    'text-foreground'
                            }`}>
                            {metrics.detectionLatency}
                        </span>
                        <span className="text-sm font-bold text-muted mb-1">ms</span>
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-muted flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${metrics.detectionLatency > 500 ? 'bg-warning' : 'bg-success'
                            }`} />
                        Internal loop time
                    </div>
                </div>

                {/* Active Streams */}
                <div className="bg-surface rounded-xl p-4 border border-border relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-muted uppercase">Active Streams</span>
                        <Server className="w-4 h-4 text-secondary opacity-50" />
                    </div>
                    <div className="flex items-end gap-1 relative z-10">
                        <span className="text-2xl font-black text-foreground">{metrics.activeStreams}</span>
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-muted">
                        Ingestion clusters: 3
                    </div>
                </div>
            </div>
        </div>
    );
};
