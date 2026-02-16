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
        <div className={`w-full mb-6 rounded-2xl border p-4 flex items-center justify-between shadow-soft ${isCritical
                ? 'bg-error-soft border-error/30'
                : 'bg-warning-soft border-warning/30'
            }`}>
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl flex items-center justify-center ${isCritical ? 'bg-error text-white animate-pulse' : 'bg-warning text-warning-foreground'
                    }`}>
                    {isCritical ? <AlertTriangle className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                    <h3 className={`text-sm font-bold uppercase tracking-widest ${isCritical ? 'text-error' : 'text-warning'
                        }`}>
                        {isCritical ? 'System Critical: Backpressure Detected' : 'Performance Degraded'}
                    </h3>
                    <p className={`text-xs mt-0.5 ${isCritical ? 'text-error/80' : 'text-warning/80'}`}>
                        {isCritical
                            ? `Buffer at ${metrics.bufferSize.toFixed(1)}% - Events are being dropped to preserve system integrity.`
                            : `Processing latency is higher than normal (${metrics.detectionLatency}ms). Auto-scaling in progress.`
                        }
                    </p>
                </div>
            </div>
            {isCritical && (
                <div className="px-3 py-1 bg-error/20 border border-error/30 rounded-lg text-[10px] font-bold text-error uppercase tracking-wider animate-pulse">
                    Fail-Safe Active
                </div>
            )}
        </div>
    );
};
