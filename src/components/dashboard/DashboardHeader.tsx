'use client';

import { TIME_RANGES } from './constants';

interface DashboardHeaderProps {
    isLive: boolean;
    timeRange: string;
    setTimeRange: (range: any) => void;
}

export const DashboardHeader = ({ isLive, timeRange, setTimeRange }: DashboardHeaderProps) => {
    return (
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 bg-surface p-1.5 rounded-xl border border-border shadow-soft">
                {TIME_RANGES.filter(r => ['1h', '24h', '7d'].includes(r.value)).map((range) => (
                    <button
                        key={range.value}
                        onClick={() => setTimeRange(range.value)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${timeRange === range.value
                            ? 'bg-elevated text-foreground shadow-soft border border-divider'
                            : 'text-muted hover:text-foreground hover:bg-elevated/50'
                            }`}
                    >
                        {range.label}
                    </button>
                ))}
            </div>

            <div className="h-6 w-[1px] bg-divider mx-1" />

            <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border text-[10px] font-black tracking-widest uppercase transition-all duration-500 shadow-soft ${isLive
                ? 'bg-success/10 text-success border-success/20'
                : 'bg-error/10 text-error border-error/20'
                }`}>
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-error'}`} />
                {isLive ? 'Live System Feed' : 'Stream Paused'}
            </div>
        </div>
    );
};
