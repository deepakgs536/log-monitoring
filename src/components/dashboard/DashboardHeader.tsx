'use client';

import { TIME_RANGES } from './constants';

interface DashboardHeaderProps {
    isLive: boolean;
    timeRange: string;
    setTimeRange: (range: any) => void;
}

export const DashboardHeader = ({ isLive, timeRange, setTimeRange }: DashboardHeaderProps) => {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-lg border border-slate-200/50">
                {TIME_RANGES.filter(r => ['1h', '24h', '7d'].includes(r.value)).map((range) => (
                    <button
                        key={range.value}
                        onClick={() => setTimeRange(range.value)}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${timeRange === range.value
                            ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {range.label}
                    </button>
                ))}
            </div>

            <div className="h-4 w-[1px] bg-slate-200 mx-1" />

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold tracking-widest uppercase transition-all duration-500 ${isLive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : 'bg-rose-50 text-rose-700 border-rose-100'
                }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                {isLive ? 'Live System Feed' : 'Stream Paused'}
            </div>
        </div>
    );
};
