'use client';

import { AnimatedNumber } from './AnimatedNumber';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: number | string;
    unit?: string;
    color: string;
    desc: string;
    trend?: string | { isPositive: boolean; percent: string };
    compact?: boolean;
}

export const MetricCard = ({ label, value, unit, color, desc, trend, compact }: MetricCardProps) => {
    const isHealth = label === 'System Health' || label === 'Health';
    const numValue = Number(value);

    const getTrendIcon = () => {
        if (!trend) return null;
        const up = <TrendingUp className="w-3 h-3" />;
        const down = <TrendingDown className="w-3 h-3" />;

        if (typeof trend === 'string') {
            const isGood = ['Normal', 'Healthy', 'Fast', 'Optimal'].includes(trend);
            return isGood ? up : down;
        }
        return trend.isPositive ? up : down;
    };

    const getTrendColor = () => {
        if (!trend) return '';
        const good = 'text-red-600 bg-red-50 border-red-100';
        const bad = 'text-gray-600 bg-gray-100 border-gray-200';

        if (typeof trend === 'string') {
            const isGood = ['Normal', 'Healthy', 'Fast', 'Optimal'].includes(trend);
            return isGood ? good : bad;
        }
        return trend.isPositive ? good : bad; // Simplification: assume positive trend is "good" or use red for "active"
    };

    // Compact Premium Red Design
    if (compact) {
        return (
            <div className={`relative p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-red-100 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-red-500/10 hover:-translate-y-0.5 group overflow-hidden ${isHealth && numValue < 80 ? 'ring-1 ring-red-400 bg-red-50/30' : ''}`}>

                {/* Subtle Red Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-red-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Accent Bar */}
                <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-red-500/20 rounded-r-full group-hover:bg-red-500/50 transition-colors" />

                <div className="relative flex flex-col items-start gap-3">
                    <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                        <div className={`w-1.5 h-1.5 rounded-full ${isHealth ? (numValue > 90 ? 'bg-red-500' : 'bg-red-500 animate-pulse') : 'bg-red-200 group-hover:bg-red-400 transition-colors'}`} />
                    </div>

                    <div className="flex items-baseline gap-1.5">
                        <span className={`text-2xl sm:text-3xl font-black tracking-tight ${isHealth && numValue < 80 ? 'text-red-600' : 'text-gray-900'}`}>
                            <AnimatedNumber value={numValue} />
                        </span>
                        {unit && <span className="text-[10px] font-bold text-gray-500 self-end mb-1">{unit}</span>}
                    </div>

                    <div className="w-full h-px bg-red-100/50" />

                    <p className="text-[10px] font-medium text-gray-400 truncate w-full flex items-center justify-between">
                        <span>{desc}</span>
                        {trend && (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                                {getTrendIcon()}
                            </span>
                        )}
                    </p>
                </div>
            </div>
        );
    }

    // Default Full Card (fallback or standard usage)
    return (
        <div className="relative p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-red-100 shadow-sm transition-all hover:shadow-lg hover:shadow-red-500/5 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-red-50/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            {/* Content similar to above but larger padding/text would go here if needed */}
            <div className="relative">
                {/* Reuse compact logic or expand for detail view */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                <div className="mt-2 text-3xl font-black text-gray-900">
                    <AnimatedNumber value={numValue} />
                    {unit && <span className="text-sm text-gray-400 ml-1 font-bold">{unit}</span>}
                </div>
                <p className="mt-2 text-xs font-medium text-gray-500">{desc}</p>
            </div>
        </div>
    );
};
