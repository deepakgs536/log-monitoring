import React from 'react';
import { SystemMetrics } from '@/lib/types';
import { Activity, Database, Server, Workflow, Shield } from 'lucide-react';

interface SystemHealthPanelProps {
    metrics: SystemMetrics;
}

export const SystemHealthPanel = ({ metrics }: SystemHealthPanelProps) => {
    const statusConfig = {
        healthy: { label: 'Operational', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'bg-emerald-500', border: 'border-emerald-100' },
        degraded: { label: 'Degraded Performance', color: 'text-amber-600', bg: 'bg-amber-50', icon: 'bg-amber-500', border: 'border-amber-100' },
        critical: { label: 'Critical System Failure', color: 'text-red-600', bg: 'bg-red-50', icon: 'bg-red-500', border: 'border-red-100' }
    };

    const status = statusConfig[metrics.status];

    return (
        <div className="console-card-premium p-5">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${status.bg} ${status.border} border transition-all duration-300 group-hover:scale-105`}>
                        <Activity className={`w-4 h-4 ${status.color}`} />
                    </div>
                    <div>
                        <h2 className="text-[13px] font-bold text-gray-900 leading-none">System Reliability</h2>
                        <div className="flex items-center gap-2 mt-1.5">
                            <div className="relative">
                                <div className={`w-1.5 h-1.5 rounded-full ${status.icon} ${metrics.status !== 'healthy' ? 'animate-pulse' : ''}`} />
                                {metrics.status === 'healthy' && (
                                    <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping opacity-30" />
                                )}
                            </div>
                            <span className={`text-[11px] font-semibold leading-none ${status.color}`}>
                                {status.label}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Uptime</p>
                        <p className="text-sm font-mono font-bold text-gray-900">99.98%</p>
                    </div>
                    <div className={`p-2.5 rounded-xl ${status.bg} ${status.border} border`}>
                        <Shield className={`w-4 h-4 ${status.color}`} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Buffer Status */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100/80 relative overflow-hidden group hover:bg-white hover:border-red-100/50 hover:shadow-md hover:shadow-red-50/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2 relative z-10">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ingestion Buffer</span>
                        <Database className="w-3.5 h-3.5 text-gray-300 group-hover:text-red-300 transition-colors duration-300" />
                    </div>
                    <div className="flex items-end gap-1 mb-2 relative z-10">
                        <span className="text-2xl font-bold text-gray-900 tabular-nums">{metrics.bufferSize.toFixed(1)}</span>
                        <span className="text-[10px] font-bold text-gray-400 mb-1">%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200/80 rounded-full overflow-hidden relative">
                        <div
                            className={`h-full rounded-full transition-all duration-700 ease-out relative ${metrics.bufferSize > 90 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                                metrics.bufferSize > 60 ? 'bg-gradient-to-r from-amber-300 to-amber-400' :
                                    'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                }`}
                            style={{ width: `${metrics.bufferSize}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                        </div>
                    </div>
                </div>

                {/* Processing Latency */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100/80 relative overflow-hidden group hover:bg-white hover:border-red-100/50 hover:shadow-md hover:shadow-red-50/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Detection Lag</span>
                        <Workflow className="w-3.5 h-3.5 text-gray-300 group-hover:text-red-300 transition-colors duration-300" />
                    </div>
                    <div className="flex items-end gap-1 relative z-10">
                        <span className={`text-2xl font-bold tabular-nums ${metrics.detectionLatency > 1000 ? 'text-red-600' :
                            metrics.detectionLatency > 300 ? 'text-amber-600' :
                                'text-gray-900'
                            }`}>
                            {metrics.detectionLatency}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 mb-1">ms</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-400 flex items-center gap-1.5 font-medium">
                        <div className={`w-1.5 h-1.5 rounded-full ${metrics.detectionLatency > 500 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                        Internal loop time
                    </div>
                </div>

                {/* Active Streams */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100/80 relative overflow-hidden group hover:bg-white hover:border-red-100/50 hover:shadow-md hover:shadow-red-50/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Streams</span>
                        <Server className="w-3.5 h-3.5 text-gray-300 group-hover:text-red-300 transition-colors duration-300" />
                    </div>
                    <div className="flex items-end gap-1 relative z-10">
                        <span className="text-2xl font-bold text-gray-900 tabular-nums">{metrics.activeStreams}</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-400 font-medium">
                        Ingestion clusters: 3
                    </div>
                </div>
            </div>
        </div>
    );
};
