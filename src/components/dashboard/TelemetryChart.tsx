'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea } from 'recharts';
import { THEME } from './constants';
import { Alert } from '@/lib/types';

interface TelemetryChartProps {
    data: any[];
    alerts: Alert[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-soft min-w-[140px]">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{data.time}</p>
                <div className="space-y-1.5">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{entry.name}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-900 tabular-nums">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export const TelemetryChart = ({ data, alerts }: TelemetryChartProps) => {
    // Identify anomaly zones for ReferenceArea
    const anomalyZones = alerts.filter(a => a.severity === 'critical').map(a => ({
        x1: new Date(a.timestamp - 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        x2: new Date(a.timestamp + 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        color: a.type === 'spike' ? THEME.primary : THEME.critical
    }));

    return (
        <div className="bg-white p-4 xl:p-8 rounded-3xl border border-slate-200 shadow-soft relative overflow-hidden flex flex-col h-full transition-all">
            <div className="flex items-center justify-between mb-4 xl:mb-8">
                <div>
                    <h2 className="text-sm xl:text-lg font-bold text-slate-900 leading-tight">Telemetry Performance</h2>
                    <p className="text-[8px] xl:text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">Statistical anomaly zones highlighted</p>
                </div>

                <div className="hidden lg:flex gap-4">
                    {['info', 'warn', 'error'].map(level => (
                        <div key={level} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: level === 'info' ? THEME.primary : level === 'warn' ? THEME.secondary : THEME.critical }} />
                            <span className="text-[10px] font-bold uppercase text-slate-500">{level}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full min-h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorInfo" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.1} />
                                <stop offset="95%" stopColor={THEME.primary} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorWarn" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={THEME.secondary} stopOpacity={0.1} />
                                <stop offset="95%" stopColor={THEME.secondary} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={THEME.critical} stopOpacity={0.1} />
                                <stop offset="95%" stopColor={THEME.critical} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={THEME.grid} />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: THEME.textMuted, fontSize: 10, fontWeight: 600 }}
                            dy={10}
                            padding={{ left: 20, right: 20 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: THEME.textMuted, fontSize: 10, fontWeight: 600 }}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        {/* Shaded Anomaly Zones */}
                        {anomalyZones.map((zone, i) => (
                            <ReferenceArea
                                key={i}
                                x1={zone.x1}
                                x2={zone.x2}
                                fill={zone.color}
                                fillOpacity={0.05}
                                stroke="transparent"
                            />
                        ))}

                        <Area
                            type="monotone"
                            dataKey="info"
                            stroke={THEME.primary}
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorInfo)"
                            isAnimationActive={false}
                            dot={(props: any) => {
                                const hasAlert = alerts.some(a => a.type === 'spike' && Math.abs(a.timestamp - props.payload.timestamp) < 30000);
                                if (hasAlert) return (
                                    <g key={props.cx}>
                                        <circle cx={props.cx} cy={props.cy} r={6} fill={THEME.primary} className="animate-ping opacity-20" />
                                        <circle cx={props.cx} cy={props.cy} r={3} fill={THEME.primary} stroke="#white" strokeWidth={2} />
                                    </g>
                                );
                                return <></>;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="warn"
                            stroke={THEME.secondary}
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorWarn)"
                            isAnimationActive={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="error"
                            stroke={THEME.critical}
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorError)"
                            isAnimationActive={false}
                            dot={(props: any) => {
                                const hasAlert = alerts.some(a => a.type === 'error_burst' && Math.abs(a.timestamp - props.payload.timestamp) < 30000);
                                if (hasAlert) return (
                                    <g key={props.cx}>
                                        <circle cx={props.cx} cy={props.cy} r={6} fill={THEME.critical} className="animate-ping opacity-20" />
                                        <circle cx={props.cx} cy={props.cy} r={3} fill={THEME.critical} stroke="white" strokeWidth={2} />
                                    </g>
                                );
                                return <></>;
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
