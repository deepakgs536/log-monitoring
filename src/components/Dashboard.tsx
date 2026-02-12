'use client';

import { useEffect, useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

type TimeRange = '1m' | '1h' | '1d' | '1w' | '1M' | '1y';

interface LogStats {
    distribution: { name: string; value: number }[];
    timeline: { time: string; info: number; warn: number; error: number }[];
    total: number;
}

// Unified Darkened Soft Theme Palette
const THEME = {
    appBg: '#D1D9E6',
    cardSurface: '#DBE2EF',
    border: '#C6D2E1',
    primary: '#5256D8',     // Info / Primary Accent
    secondary: '#E89005',   // Warning
    critical: '#DC2626',    // Error
    accentPink: '#D946EF',  // Highlighting
    success: '#10B981',
    textPrimary: '#1E293B',
    textMuted: '#475569',
    white: '#FFFFFF',
};

const TIME_RANGES: { value: TimeRange; label: string }[] = [
    { value: '1m', label: '1m' },
    { value: '1h', label: '1h' },
    { value: '1d', label: '1d' },
    { value: '1w', label: '1w' },
    { value: '1M', label: '1M' },
    { value: '1y', label: '1y' },
];

// Custom Hollow Dot for Line Graph
const CustomDot = (props: any) => {
    const { cx, cy, stroke } = props;
    if (cx === undefined || cy === undefined) return null;

    return (
        <svg x={cx - 4} y={cy - 4} width={8} height={8}>
            <circle
                cx={4}
                cy={4}
                r={3}
                stroke={stroke}
                strokeWidth={2}
                fill={THEME.cardSurface}
            />
        </svg>
    );
};

// Custom label for Pie Chart segments
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.08) return null;

    return (
        <text
            x={x}
            y={y}
            fill="#ffffff"
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[12px] font-bold pointer-events-none"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div
                className="bg-white/80 backdrop-blur-md border rounded-2xl p-4 shadow-xl min-w-[140px]"
                style={{ borderColor: THEME.border }}
            >
                <p className="text-[11px] font-black uppercase tracking-[0.1em] mb-3" style={{ color: THEME.textMuted }}>{data.time}</p>
                <div className="space-y-2">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-8">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-sm font-bold capitalize" style={{ color: THEME.textMuted }}>{entry.name}</span>
                            </div>
                            <span className="text-sm font-black tabular-nums" style={{ color: THEME.textPrimary }}>{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export function Dashboard() {
    const [stats, setStats] = useState<LogStats | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>('1h');

    const fetchStats = async () => {
        try {
            const res = await fetch(`/api/stats?timeRange=${timeRange}`);
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 2000);
        return () => clearInterval(interval);
    }, [timeRange]);

    if (!stats) return (
        <div className="flex items-center justify-center min-h-screen bg-[#D1D9E6]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[#5256D8] border-t-transparent rounded-full animate-spin" />
                <p className="font-bold text-sm tracking-widest uppercase text-[#475569]">Syncing Stream</p>
            </div>
        </div>
    );

    const getChartColor = (name: string) => {
        const level = name.toLowerCase();
        if (level === 'info') return THEME.primary;
        if (level === 'warn') return THEME.secondary;
        if (level === 'error') return THEME.critical;
        return THEME.textMuted;
    };

    return (
        <div
            className="p-4 sm:p-10 space-y-10 min-h-screen font-sans antialiased text-[#1E293B] bg-[#D1D9E6]"
        >
            {/* Soft Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-[#1E293B]">
                    <div className="w-1.5 h-8 rounded-full bg-[#5256D8] opacity-80" />
                    Log Intelligence
                </h1>

                <div className="inline-flex p-1 bg-white/50 backdrop-blur rounded-xl border border-[#C6D2E1]">
                    {TIME_RANGES.map((range) => (
                        <button
                            key={range.value}
                            onClick={() => setTimeRange(range.value)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 ${timeRange === range.value
                                ? 'bg-white text-[#5256D8] shadow-sm'
                                : 'text-[#475569] hover:text-[#1E293B]'
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-10">
                {/* Analytics Chart */}
                <div className="bg-[#DBE2EF] p-6 sm:p-10 rounded-[2.5rem] border border-[#C6D2E1] relative transition-all duration-500 shadow-none">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-xl font-black tracking-tight text-[#1E293B]">Analytics</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 text-[#475569]">Activity Stream</p>
                        </div>

                        <div className="hidden sm:flex gap-3">
                            {['info', 'warn', 'error'].map(level => (
                                <div key={level} className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getChartColor(level) }} />
                                    <span className="text-[10px] font-black uppercase text-[#475569]">{level}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid
                                    strokeDasharray="5 5"
                                    vertical={false}
                                    stroke="#C6D2E1"
                                />
                                <XAxis
                                    dataKey="time"
                                    axisLine={false}
                                    tickLine={false}
                                    stroke="#475569"
                                    style={{ fontSize: '11px', fontWeight: 800 }}
                                    dy={20}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    stroke="#475569"
                                    style={{ fontSize: '11px', fontWeight: 800 }}
                                    tickCount={6}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#C6D2E1', strokeWidth: 1, strokeDasharray: '5 5' }} />

                                {['info', 'warn', 'error'].map((level) => (
                                    <Area
                                        key={level}
                                        type="monotone"
                                        dataKey={level}
                                        stroke={getChartColor(level)}
                                        strokeWidth={2.5}
                                        fill="transparent"
                                        dot={false}
                                        activeDot={{ r: 5, strokeWidth: 2, fill: THEME.white, stroke: getChartColor(level) }}
                                        animationDuration={1200}
                                        animationEasing="ease-in-out"
                                    />
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart */}
                <div className="bg-[#DBE2EF] p-6 sm:p-10 rounded-[2.5rem] border border-[#C6D2E1] shadow-none overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-black tracking-tight text-[#1E293B]">Distribution</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 text-[#475569]">Event Mix</p>
                        </div>
                    </div>

                    <div className="h-[360px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.distribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={85}
                                    outerRadius={125}
                                    paddingAngle={6}
                                    dataKey="value"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    stroke="none"
                                    animationBegin={0}
                                    animationDuration={1200}
                                    animationEasing="ease-in-out"
                                >
                                    {stats.distribution.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={getChartColor(entry.name)}
                                            className="hover:opacity-90 transition-opacity cursor-pointer"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: THEME.white,
                                        borderRadius: '20px',
                                        border: `1px solid ${THEME.border}`,
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 text-[#475569]">Total</p>
                            <p className="text-5xl font-black leading-none tracking-tighter tabular-nums text-[#1E293B]">
                                {stats.total > 1000 ? `${(stats.total / 1000).toFixed(1)}k` : stats.total}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metric Cards (Unified Darker Theme) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { key: 'info', label: 'Healthy Info', value: stats.distribution.find(d => d.name === 'info')?.value || 0, color: THEME.primary, desc: 'Stable events' },
                    { key: 'warn', label: 'Active Alerts', value: stats.distribution.find(d => d.name === 'warn')?.value || 0, color: THEME.secondary, desc: 'Needs review' },
                    { key: 'error', label: 'Critical', value: stats.distribution.find(d => d.name === 'error')?.value || 0, color: THEME.critical, desc: 'Urgent action' },
                    { key: 'total', label: 'Throughput', value: stats.total, color: THEME.textMuted, desc: 'Total tracked' },
                ].map((item) => (
                    <div
                        key={item.key}
                        className="p-8 rounded-[2rem] border border-[#C6D2E1] bg-[#DBE2EF] shadow-none transition-all duration-300 hover:bg-white/80"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#475569]">{item.label}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-4xl font-black tracking-tighter tabular-nums text-[#1E293B]">{item.value.toLocaleString()}</span>
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-tight text-[#475569]">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
