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
        <div className="relative overflow-hidden rounded-xl border border-red-100 bg-white/80 backdrop-blur-md shadow-lg group h-[60px] flex items-center px-6 transition-all hover:shadow-xl hover:shadow-red-500/10">

            <div className="flex items-center gap-6 w-full">
                {/* Title & Status */}
                <div className="flex flex-col border-r border-red-100 pr-6 min-w-[200px] justify-center">
                    <div className="flex items-center gap-2 mb-0.5">
                        <Activity className={`w-4 h-4 ${status.color}`} />
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-widest leading-none">System Reliability</span>
                    </div>
                    <div className="flex items-center gap-1.5 pl-0.5">
                        <div className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.icon}`} />
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${status.icon}`} />
                        </div>
                        <span className={`text-sm font-bold tracking-tight ${status.color} leading-none`}>
                            {status.label}
                        </span>
                    </div>
                </div>

                {/* Metrics Row */}
                <div className="flex items-center justify-between flex-1 px-4">
                    {/* Buffer Status */}
                    <div className="flex flex-col justify-center">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Ingestion Buffer</span>
                        <div className="flex items-center gap-2">
                            <div className="w-[90px] h-1.5 bg-red-100/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-500"
                                    style={{ width: `${metrics.bufferSize}%` }}
                                />
                            </div>
                            <span className="text-lg font-mono font-black text-gray-800 tracking-tight leading-none">{metrics.bufferSize.toFixed(1)}%</span>
                        </div>
                    </div>

                    {/* Processing Latency */}
                    <div className="flex flex-col pl-6 border-l border-red-50 justify-center">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Detection Lag</span>
                        <div className="flex items-baseline gap-1.5">
                            <Workflow className="w-3.5 h-3.5 text-red-300 relative top-0.5" />
                            <span className={`text-lg font-mono font-black tracking-tighter leading-none ${metrics.detectionLatency > 500 ? 'text-red-600' : 'text-gray-900'}`}>
                                {metrics.detectionLatency}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400">ms</span>
                        </div>
                    </div>

                    {/* Active Streams */}
                    <div className="flex flex-col pl-6 border-l border-red-50 justify-center">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Active Streams</span>
                        <div className="flex items-center gap-1.5">
                            <Server className="w-3.5 h-3.5 text-red-300" />
                            <span className="text-lg font-mono font-black text-gray-900 tracking-tighter leading-none">{metrics.activeStreams}</span>
                        </div>
                    </div>
                </div>

                {/* Uptime (Far Right) */}
                <div className="flex flex-col items-end justify-center gap-0.5 border-l border-red-100 pl-6 ml-auto h-full py-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Uptime</span>
                    <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-lg font-mono font-black text-gray-900 leading-none">99.99%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
