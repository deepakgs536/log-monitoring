'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Rectangle } from 'recharts';
import { THEME } from '@/lib/constants';
import { Activity } from 'lucide-react';

interface ServiceActivityChartProps {
    data: { name: string; value: number }[];
}

export function ServiceActivityChart({ data }: ServiceActivityChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <Activity className="w-8 h-8 opacity-20" />
                <p className="text-xs font-medium">No service activity data</p>
            </div>
        );
    }

    // Sort data for better visualization in column chart
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    return (
        <div className="h-full w-full flex flex-col p-4">
            <div className="flex-1 min-h-[0] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={sortedData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                        barSize={40}
                    >
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="#E11D48" stopOpacity={0.6} />
                            </linearGradient>
                            <filter id="shadow" height="200%">
                                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#EF4444" floodOpacity="0.25" />
                            </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.4} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 500 }}
                            dy={10}
                        />
                        {/* Hide Y Axis for cleaner look */}
                        <YAxis hide />

                        <Tooltip
                            cursor={{ fill: '#FEF2F2', opacity: 0.6 }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white/95 backdrop-blur-xl border border-red-100 shadow-xl shadow-red-100/20 rounded-xl p-3">
                                            <p className="text-xs font-bold text-gray-900 mb-1">{payload[0].payload.name}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                <p className="text-xs font-medium text-gray-500">
                                                    <span className="text-gray-900 font-bold font-mono">{payload[0].value}</span> events
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="value"
                            fill="url(#barGradient)"
                            radius={[6, 6, 6, 6]}
                            filter="url(#shadow)"
                            activeBar={<Rectangle fill="#B91C1C" stroke="#991B1B" strokeWidth={0} />}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
