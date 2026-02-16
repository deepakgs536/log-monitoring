'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { THEME } from './constants';

interface DistributionDonutProps {
    data: { name: string; value: number }[];
}

export const DistributionDonut = ({ data }: DistributionDonutProps) => {
    const getChartColor = (name: string) => {
        const level = name.toLowerCase();
        if (level === 'info') return THEME.primary;
        if (level === 'warn') return THEME.secondary;
        if (level === 'error') return THEME.critical;
        if (level === 'healthy') return THEME.success;
        return THEME.textMuted;
    };

    return (
        <div className="bg-white p-4 xl:p-8 rounded-3xl border border-slate-200 shadow-soft relative overflow-hidden flex flex-col h-full">
            <h2 className="text-sm xl:text-lg font-bold text-slate-900 leading-tight">Event Mix</h2>
            <p className="text-[8px] xl:text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5 mb-4 xl:mb-8">Service Health Distro</p>

            <div className="flex-1 w-full min-h-[220px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data.length > 0 ? data : [{ name: 'none', value: 1 }]}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={95}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.length > 0 ? (
                                data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getChartColor(entry.name)} />
                                ))
                            ) : (
                                <Cell key="cell-none" fill={THEME.grid} />
                            )}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute top-[62%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">
                        {data.reduce((acc, curr) => acc + curr.value, 0)}
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Events</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
                {['info', 'warn', 'error'].map(level => {
                    const val = data.find(d => d.name === level)?.value || 0;
                    return (
                        <div key={level} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getChartColor(level) }} />
                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider font-mono">{level}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900 tabular-nums">{val}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
