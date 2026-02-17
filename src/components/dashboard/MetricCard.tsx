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
        if (typeof trend === 'string') {
            const isGood = ['Normal', 'Healthy', 'Fast', 'Optimal'].includes(trend);
            return isGood ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;
        }
        return trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;
    };

    const getTrendColor = () => {
        if (!trend) return '';
        if (typeof trend === 'string') {
            const isGood = ['Normal', 'Healthy', 'Fast', 'Optimal'].includes(trend);
            return isGood ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50';
        }
        return trend.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50';
    };

    if (compact) {
        return (
            <div className={`relative p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-100/80 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-red-100/20 hover:-translate-y-1 flex-1 min-w-0 flex flex-col justify-center overflow-hidden group console-metric-glow ${isHealth && numValue < 50 ? 'border-red-200 bg-red-50/30' : ''}`}>
                {/* Left accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(to bottom, ${color}, transparent)` }} />
                {/* Hover glow background */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-50/0 to-rose-50/0 group-hover:from-red-50/30 group-hover:to-rose-50/20 transition-all duration-500" />
                <div className="relative flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide truncate">{label}</span>
                    {trend && typeof trend === 'string' && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${getTrendColor()}`}>
                            {getTrendIcon()}
                            {trend}
                        </span>
                    )}
                </div>
                <div className="relative flex items-baseline gap-1.5">
                    <span className={`text-2xl font-bold tracking-tight text-gray-900 ${isHealth && numValue < 70 ? 'text-red-600' : ''}`}>
                        <AnimatedNumber value={numValue} />
                    </span>
                    {unit && <span className="text-xs font-semibold text-gray-400">{unit}</span>}
                </div>
                <p className="relative text-[10px] font-medium text-gray-400 mt-1 truncate">{desc}</p>
            </div>
        );
    }

    return (
        <div className={`relative p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-100/80 shadow-sm group hover:shadow-xl hover:shadow-red-100/20 hover:-translate-y-1 transition-all duration-500 overflow-hidden console-metric-glow ${isHealth && numValue < 50 ? 'ring-2 ring-red-200' : ''}`}>
            {/* Animated top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />
            {/* Hover glow background */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-50/0 to-rose-50/0 group-hover:from-red-50/30 group-hover:to-rose-50/20 transition-all duration-500" />

            <div className="relative flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${color}12` }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    </div>
                    <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
                </div>
                {trend && typeof trend === 'string' && (
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${getTrendColor()}`}>
                        {getTrendIcon()}
                        {trend}
                    </span>
                )}
            </div>

            <div className={`relative mb-1.5 flex items-baseline gap-2 ${isHealth ? 'group-hover:scale-[1.02] transition-transform' : ''}`}>
                <span className={`text-3xl font-bold tracking-tight tabular-nums text-gray-900 ${isHealth && numValue < 70 ? 'text-red-600' : ''}`}>
                    <AnimatedNumber value={numValue} />
                </span>
                {unit && <span className="text-sm font-semibold text-gray-400">{unit}</span>}
            </div>
            <p className="relative text-[11px] font-medium text-gray-400">{desc}</p>
        </div>
    );
};
