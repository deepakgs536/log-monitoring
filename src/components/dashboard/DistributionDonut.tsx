'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { THEME } from './constants';
import { PieChart as PieIcon, Info, AlertTriangle, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

interface DistributionDonutProps {
    data: { name: string; value: number }[];
}

export const DistributionDonut = ({ data }: DistributionDonutProps) => {
    const getChartColor = (name: string) => {
        const level = name.toLowerCase();
        if (level === 'info') return THEME.info;
        if (level === 'warn') return THEME.warning;
        if (level === 'error') return THEME.error;
        if (level === 'healthy') return THEME.success;
        return THEME.textMuted;
    };

    const totalEvents = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="bg-white p-5 xl:p-7 rounded-2xl border border-gray-100/80 shadow-sm relative overflow-hidden flex flex-col h-full hover:shadow-xl hover:border-gray-200 transition-all duration-500 group">
            {/* Animated Red accent line */}

            <div className="flex items-center gap-3.5 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-100 flex items-center justify-center shadow-sm shadow-red-100/50 group-hover:scale-105 transition-transform duration-500">
                    <PieIcon className="w-5 h-5 text-red-500" />
                </div>
                <div>
                    <h2 className="text-[15px] font-extrabold text-gray-900 leading-tight tracking-tight">Event Mix</h2>
                    <p className="text-[11px] font-bold text-gray-400 mt-0.5 uppercase tracking-wide">Service Health Distribution</p>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[220px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data.length > 0 ? data : [{ name: 'none', value: 1 }]}
                            cx="50%"
                            cy="50%"
                            innerRadius={75}
                            outerRadius={95}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={6}
                        >
                            {data.length > 0 ? (
                                data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={getChartColor(entry.name)}
                                        className="transition-all duration-300 hover:opacity-80 stroke-white stroke-2"
                                    />
                                ))
                            ) : (
                                <Cell key="cell-none" fill="#F1F5F9" />
                            )}
                        </Pie>
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const d = payload[0].payload;
                                    return (
                                        <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-xl px-4 py-2 shadow-xl shadow-gray-200/50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getChartColor(d.name) }} />
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{d.name}</span>
                                            </div>
                                            <p className="text-lg font-extrabold text-gray-900 mt-0.5 tabular-nums">{d.value}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Label with glow and animation */}
                <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <div className="relative flex flex-col items-center justify-center">
                        <div className="absolute -inset-10 rounded-full bg-red-50/0 group-hover:bg-red-50/40 blur-2xl transition-all duration-700" />
                        <motion.div
                            key={totalEvents}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative z-10"
                        >
                            <p className="text-3xl font-extrabold text-gray-900 tracking-tighter tabular-nums drop-shadow-sm">
                                {totalEvents}
                            </p>
                            <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mt-1">Total Events</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                    { key: 'info', icon: Info, label: 'Info' },
                    { key: 'warn', icon: AlertTriangle, label: 'Warn' },
                    { key: 'error', icon: AlertOctagon, label: 'Error' }
                ].map(({ key, icon: Icon, label }) => {
                    const val = data.find(d => d.name === key)?.value || 0;
                    return (
                        <div key={key} className="p-3.5 rounded-xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default group/card">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon className="w-3.5 h-3.5 transition-colors" style={{ color: getChartColor(key) }} />
                                <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-widest">{label}</span>
                            </div>
                            <p className="text-xl font-bold text-gray-900 tabular-nums tracking-tight group-hover/card:scale-105 transition-transform duration-300 origin-left">{val}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
