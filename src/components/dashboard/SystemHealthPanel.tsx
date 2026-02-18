import React from 'react';
import { SystemMetrics } from '@/lib/types';
import { Activity, Database, Server, Workflow, Shield } from 'lucide-react';

interface SystemHealthPanelProps {
    metrics: SystemMetrics;
}

export const SystemHealthPanel = ({ metrics }: SystemHealthPanelProps) => {
    const statusConfig = {
        healthy: { label: 'System Optimal', color: 'text-red-700', bg: 'bg-red-50/50', icon: 'bg-red-500', border: 'border-red-100' },
        degraded: { label: 'Performance Degraded', color: 'text-amber-700', bg: 'bg-amber-50/50', icon: 'bg-amber-500', border: 'border-amber-100' },
        critical: { label: 'Critical Failure', color: 'text-red-900', bg: 'bg-red-100/50', icon: 'bg-red-600', border: 'border-red-200' }
    };

    const status = statusConfig[metrics.status];

    return (
        <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-white/60 backdrop-blur-xl shadow-sm transition-all hover:shadow-md hover:shadow-red-500/5 group">
            {/* Premium Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500/20 via-red-500/40 to-red-500/20 opacity-50" />

            <div className="p-4 sm:p-5">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${status.bg} ${status.border} border shadow-sm`}>
                            <Activity className={`w-4 h-4 ${status.color}`} />
                        </div>
                        <div>
                            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">System Reliability</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="relative flex h-2 w-2">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.icon}`} />
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${status.icon}`} />
                                </div>
                                <span className={`text-sm font-bold tracking-tight ${status.color}`}>
                                    {status.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Uptime</p>
                            <p className="text-sm font-mono font-bold text-gray-900 tabular-nums">99.99%</p>
                        </div>
                        <div className={`p-2 rounded-lg bg-white border border-gray-100 text-gray-400 shadow-sm`}>
                            <Shield className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Buffer Status */}
                    <div className="relative group/card overflow-hidden rounded-xl border border-red-100/50 bg-white/50 p-3.5 hover:bg-white hover:border-red-200/60 hover:shadow-sm transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ingestion Buffer</span>
                            <Database className="w-3.5 h-3.5 text-red-200 group-hover/card:text-red-400 transition-colors" />
                        </div>
                        <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-xl font-black text-gray-900 tabular-nums tracking-tight">{metrics.bufferSize.toFixed(1)}</span>
                            <span className="text-[10px] font-bold text-gray-400">%</span>
                        </div>
                        <div className="h-1.5 w-full bg-red-100/30 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-600 shadow-[0_0_10px_rgba(239,68,68,0.4)] transition-all duration-500"
                                style={{ width: `${metrics.bufferSize}%` }}
                            />
                        </div>
                    </div>

                    {/* Processing Latency */}
                    <div className="relative group/card overflow-hidden rounded-xl border border-red-100/50 bg-white/50 p-3.5 hover:bg-white hover:border-red-200/60 hover:shadow-sm transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Detection Lag</span>
                            <Workflow className="w-3.5 h-3.5 text-red-200 group-hover/card:text-red-400 transition-colors" />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-xl font-black tabular-nums tracking-tight ${metrics.detectionLatency > 500 ? 'text-red-600' : 'text-gray-900'
                                }`}>
                                {metrics.detectionLatency}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400">ms</span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                            <div className={`h-1 w-1 rounded-full ${metrics.detectionLatency > 200 ? 'bg-amber-400' : 'bg-red-400'}`} />
                            <span className="text-[10px] font-medium text-gray-400">Internal Loop</span>
                        </div>
                    </div>

                    {/* Active Streams */}
                    <div className="relative group/card overflow-hidden rounded-xl border border-red-100/50 bg-white/50 p-3.5 hover:bg-white hover:border-red-200/60 hover:shadow-sm transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active Streams</span>
                            <Server className="w-3.5 h-3.5 text-red-200 group-hover/card:text-red-400 transition-colors" />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-gray-900 tabular-nums tracking-tight">{metrics.activeStreams}</span>
                        </div>
                        <div className="mt-2 text-[10px] font-medium text-gray-400">
                            Across 3 clusters
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
