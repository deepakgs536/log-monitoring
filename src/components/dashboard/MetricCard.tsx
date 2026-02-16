'use client';

import { AnimatedNumber } from './AnimatedNumber';

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

    if (compact) {
        return (
            <div
                className={`p-4 rounded-3xl border border-border bg-card shadow-sm transition-all hover:bg-elevated hover:shadow-sm flex-1 min-w-0 flex flex-col justify-center ${isHealth && Number(value) < 50 ? 'border-error bg-error/5' : ''}`}
                style={{ borderColor: isHealth ? undefined : `${color}30` }} // Subtle border highlight using accent color
            >
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-secondary truncate">{label}</span>
                    {trend && typeof trend === 'string' && (
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${trend === 'Normal' || trend === 'Healthy' || trend === 'Fast' || trend === 'Optimal'
                            ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                            }`}>{trend}</span>
                    )}
                </div>
                <div className="flex items-baseline gap-2">
                    <span
                        className={`text-xl font-bold tracking-tight text-foreground ${isHealth && Number(value) < 70 ? 'text-error' : ''}`}
                        style={{ textShadow: `0 0 20px ${color}40` }} // Subtle text glow
                    >
                        <AnimatedNumber value={Number(value)} />
                    </span>
                    {unit && <span className="text-[10px] font-bold text-muted">{unit}</span>}
                </div>
                <p className="text-[9px] font-medium text-muted mt-1 truncate">{desc}</p>
            </div>
        );
    }

    return (
        <div className={`p-8 rounded-3xl border border-border bg-card shadow-sm group hover:translate-y-[-2px] transition-all duration-300 relative overflow-hidden ${isHealth && Number(value) < 50 ? 'ring-2 ring-error/20' : ''}`}>
            {isHealth && (
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-4xl">🛡️</span>
                </div>
            )}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isHealth && Number(value) < 70 ? 'animate-ping' : ''}`} style={{ backgroundColor: color }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
                </div>
                {trend && typeof trend === 'string' && (
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${trend === 'Normal' || trend === 'Healthy' || trend === 'Fast' || trend === 'Optimal'
                        ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600 animate-pulse'
                        }`}>{trend}</span>
                )}
            </div>
            <div className={`mb-2 flex items-baseline gap-2 ${isHealth ? 'text-slate-900 group-hover:scale-105 transition-transform' : ''}`}>
                <span className={`text-3xl font-bold tracking-tight tabular-nums text-slate-900 ${isHealth && Number(value) < 70 ? 'text-rose-600' : ''}`}>
                    <AnimatedNumber value={Number(value)} />
                </span>
                {unit && <span className="text-sm font-bold text-slate-400">{unit}</span>}
            </div>
            <p className="text-[10px] font-medium text-slate-400">{desc}</p>
        </div>
    );
};
