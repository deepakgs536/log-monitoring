'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea } from 'recharts';
import { THEME } from '@/lib/constants';
import { Alert } from '@/lib/types';
import { BarChart3, Info, AlertTriangle, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

interface TelemetryChartProps {
    data: any[];
    alerts: Alert[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl shadow-gray-200/50 min-w-[200px] ring-1 ring-gray-100"
            >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100/50">
                    <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">{data.time}</p>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                </div>
                <div className="space-y-3">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-6 group">
                            <div className="flex items-center gap-2.5">
                                <div className="w-3 h-3 rounded-md shadow-sm transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: entry.color }} />
                                <span className="text-[11px] font-bold text-gray-500 capitalize tracking-tight">{entry.name}</span>
                            </div>
                            <span className="text-sm font-mono font-bold text-gray-900 tabular-nums">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    }
    return null;
};

export const TelemetryChart = ({ data, alerts }: TelemetryChartProps) => {
    const anomalyZones = alerts.filter(a => a.severity === 'critical').map(a => ({
        x1: new Date(a.timestamp - 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        x2: new Date(a.timestamp + 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        color: a.type === 'spike' ? THEME.infoSoft : THEME.errorSoft
    }));

    return (
        <div className="bg-white p-5 xl:p-7 rounded-2xl border border-gray-100/80 shadow-sm relative overflow-hidden flex flex-col h-full hover:shadow-xl hover:border-gray-200 transition-all duration-500 group">
            {/* Animated Red accent top line */}

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-100 flex items-center justify-center shadow-sm shadow-red-100/50 group-hover:scale-105 transition-transform duration-500">
                        <BarChart3 className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-[15px] font-extrabold text-gray-900 leading-tight tracking-tight">Telemetry Performance</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Real-time Monitoring</p>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex gap-3">
                    {[
                        { level: 'info', label: 'Info', color: THEME.info, icon: Info },
                        { level: 'warn', label: 'Warn', color: THEME.warning, icon: AlertTriangle },
                        { level: 'error', label: 'Error', color: THEME.error, icon: AlertOctagon },
                    ].map(({ level, label, color, icon: Icon }) => (
                        <div key={level} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all duration-300">
                            <Icon className="w-3 h-3" style={{ color }} />
                            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">{label}</span>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full min-h-[280px] relative z-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorInfo" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={THEME.info} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={THEME.info} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorWarn" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={THEME.warning} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={THEME.warning} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={THEME.error} stopOpacity={0.25} />
                                <stop offset="95%" stopColor={THEME.error} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }}
                            dy={15}
                            padding={{ left: 20, right: 20 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }}
                            dx={-5}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#EF4444', strokeWidth: 1, strokeDasharray: '4 4' }} />

                        {anomalyZones.map((zone, i) => (
                            <ReferenceArea
                                key={i}
                                x1={zone.x1}
                                x2={zone.x2}
                                fill={zone.color}
                                fillOpacity={0.3}
                                stroke="transparent"
                            />
                        ))}

                        <Area
                            type="monotone"
                            dataKey="info"
                            stroke={THEME.info}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorInfo)"
                            animationDuration={1500}
                            dot={(props: any) => {
                                const hasAlert = alerts.some(a => a.type === 'spike' && Math.abs(a.timestamp - props.payload.timestamp) < 30000);
                                if (hasAlert) return (
                                    <g key={props.cx}>
                                        <circle cx={props.cx} cy={props.cy} r={8} fill={THEME.info} className="animate-ping opacity-30" />
                                        <circle cx={props.cx} cy={props.cy} r={3.5} fill={THEME.info} stroke="#fff" strokeWidth={2} />
                                    </g>
                                );
                                return <></>;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="warn"
                            stroke={THEME.warning}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorWarn)"
                            animationDuration={1500}
                        />
                        <Area
                            type="monotone"
                            dataKey="error"
                            stroke={THEME.error}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorError)"
                            animationDuration={1500}
                            dot={(props: any) => {
                                const hasAlert = alerts.some(a => a.type === 'error_burst' && Math.abs(a.timestamp - props.payload.timestamp) < 30000);
                                if (hasAlert) return (
                                    <g key={props.cx}>
                                        <circle cx={props.cx} cy={props.cy} r={8} fill={THEME.error} className="animate-ping opacity-40" />
                                        <circle cx={props.cx} cy={props.cy} r={3.5} fill={THEME.error} stroke="#fff" strokeWidth={2} />
                                    </g>
                                );
                                return <></>;
                            }}
                        />

                        {alerts.filter(a => a.severity === 'critical').map((alert) => (
                            <ReferenceArea
                                key={`line-${alert.id}`}
                                x1={new Date(alert.timestamp - 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                x2={new Date(alert.timestamp + 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                strokeOpacity={0}
                                fill={alert.type === 'spike' ? THEME.info : THEME.error}
                                fillOpacity={0.1}
                                label={{
                                    value: '⚠ DETECTED',
                                    position: 'insideTop',
                                    fill: alert.type === 'spike' ? THEME.info : THEME.error,
                                    fontSize: 9,
                                    fontWeight: 800,
                                    dy: -10
                                }}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
