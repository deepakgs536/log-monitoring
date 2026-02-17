import { TimeRange } from '@/lib/types';
import { ExportMenu } from '@/components/dashboard/ExportMenu';

interface DashboardHeaderProps {
    isLive: boolean;
    timeRange: TimeRange;
    setTimeRange?: (range: TimeRange) => void;
}

const TIME_OPTIONS: { value: TimeRange; label: string }[] = [
    { value: '15m', label: '15m' },
    { value: '1h', label: '1h' },
    { value: '6h', label: '6h' },
    { value: '24h', label: '24h' },
    { value: '7d', label: '7d' },
];

export const DashboardHeader = ({ isLive, timeRange, setTimeRange }: DashboardHeaderProps) => {
    return (
        <div className="flex items-center gap-3">
            {/* Live Indicator — enhanced with glow ring */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 ${isLive
                ? 'bg-red-50/80 backdrop-blur-sm border-red-200 shadow-sm shadow-red-100/50 animate-pulse-glow-red'
                : 'bg-gray-50/80 backdrop-blur-sm border-gray-200'
                }`}>
                <div className="relative">
                    <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500' : 'bg-gray-400'}`} />
                    {isLive && <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 animate-ping opacity-40" />}
                </div>
                <span className={`text-[11px] font-bold ${isLive ? 'text-red-600' : 'text-gray-500'}`}>
                    {isLive ? 'Live' : 'Paused'}
                </span>
            </div>

            <div className="h-6 w-px bg-gray-200/60" />

            {/* Time Range Pills — premium */}
            <div className="flex items-center bg-white/60 backdrop-blur-sm p-1 rounded-xl border border-gray-200/50 shadow-sm">
                {TIME_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => setTimeRange && setTimeRange(opt.value)}
                        disabled={!setTimeRange}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 ${timeRange === opt.value
                            ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md shadow-red-200/50 scale-[1.02]'
                            : 'text-gray-500 hover:text-gray-800 hover:bg-white/80 hover:shadow-sm active:scale-95'
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            <div className="h-6 w-px bg-gray-200/60" />

            <ExportMenu showIncidents={true} showSummary={true} />
        </div>
    );
};
