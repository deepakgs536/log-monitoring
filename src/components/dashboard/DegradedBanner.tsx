import React from 'react';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import { SystemMetrics } from '@/lib/types';

interface DegradedBannerProps {
    metrics: SystemMetrics;
}

export const DegradedBanner = ({ metrics }: DegradedBannerProps) => {
    if (metrics.status === 'healthy') return null;

    const isCritical = metrics.status === 'critical';

    return (
        <div className={`w-full mb-6 rounded-2xl border p-4 flex items-center justify-between relative overflow-hidden transition-all duration-300 ${isCritical
            ? 'bg-red-50/80 border-red-200 animate-border-pulse'
            : 'bg-amber-50/80 border-amber-200'
            }`}>
            {/* Animated glow background for critical */}
            {isCritical && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-100/0 via-red-100/40 to-red-100/0 animate-shimmer" />
            )}

            <div className="relative flex items-center gap-4">
                <div className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-300 ${isCritical
                    ? 'bg-red-100 text-red-600 animate-pulse shadow-md shadow-red-200/50'
                    : 'bg-amber-100 text-amber-600'
                    }`}>
                    {isCritical ? <AlertTriangle className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                    <h3 className={`text-sm font-bold ${isCritical ? 'text-red-700' : 'text-amber-700'}`}>
                        {isCritical ? 'System Critical: Backpressure Detected' : 'Performance Degraded'}
                    </h3>
                    <p className={`text-xs mt-0.5 ${isCritical ? 'text-red-600/80' : 'text-amber-600/80'}`}>
                        {isCritical
                            ? `Buffer at ${metrics.bufferSize.toFixed(1)}% - Events are being dropped to preserve system integrity.`
                            : `Processing latency is higher than normal (${metrics.detectionLatency}ms). Auto-scaling in progress.`
                        }
                    </p>
                </div>
            </div>
            {isCritical && (
                <div className="relative px-3 py-1 bg-red-100 border border-red-200 rounded-lg text-[10px] font-bold text-red-600 uppercase tracking-wider animate-pulse shadow-sm shadow-red-200/30">
                    Fail-Safe Active
                </div>
            )}
        </div>
    );
};
