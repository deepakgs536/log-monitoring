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
            <div className="bg-surface/90 backdrop-blur-md border border-border rounded-xl p-3 shadow-soft min-w-[140px]">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">{data.time}</p>
                <div className="space-y-1.5">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-[10px] font-bold text-secondary uppercase tracking-tight">{entry.name}</span>
                            </div>
                            <span className="text-[10px] font-bold text-foreground tabular-nums">{entry.value}</span>
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
        color: a.type === 'spike' ? THEME.successSoft : THEME.errorSoft
    }));

    return (
        <div className="bg-card p-4 xl:p-8 rounded-3xl border border-border shadow-soft relative overflow-hidden flex flex-col h-full transition-all">
            <div className="flex items-center justify-between mb-4 xl:mb-8">
                <div>
                    <h2 className="text-sm xl:text-lg font-bold text-foreground leading-tight">Telemetry Performance</h2>
                    <p className="text-[8px] xl:text-[10px] font-semibold uppercase tracking-wider text-muted mt-0.5">Statistical anomaly zones highlighted</p>
                </div>

                <div className="hidden lg:flex gap-4">
                    {['info', 'warn', 'error'].map(level => (
                        <div key={level} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{
                                backgroundColor: level === 'info' ? THEME.info : level === 'warn' ? THEME.warning : THEME.error,
                                boxShadow: `0 0 10px ${level === 'info' ? THEME.infoSoft : level === 'warn' ? THEME.warningSoft : THEME.errorSoft}`
                            }} />
                            <span className="text-[10px] font-bold uppercase text-secondary">{level}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full min-h-[240px]">
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
                                <stop offset="5%" stopColor={THEME.error} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={THEME.error} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={THEME.divider} strokeOpacity={0.5} />
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
                                fillOpacity={1}
                                stroke="transparent"
                            />
                        ))}

                        <Area
                            type="monotone"
                            dataKey="info"
                            stroke={THEME.info}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorInfo)"
                            isAnimationActive={false}
                            dot={(props: any) => {
                                const hasAlert = alerts.some(a => a.type === 'spike' && Math.abs(a.timestamp - props.payload.timestamp) < 30000);
                                if (hasAlert) return (
                                    <g key={props.cx}>
                                        <circle cx={props.cx} cy={props.cy} r={6} fill={THEME.info} className="animate-ping opacity-20" />
                                        <circle cx={props.cx} cy={props.cy} r={3} fill={THEME.info} stroke={THEME.background} strokeWidth={2} />
                                    </g>
                                );
                                return <></>;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="warn"
                            stroke={THEME.warning}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorWarn)"
                            isAnimationActive={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="error"
                            stroke={THEME.error}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorError)"
                            isAnimationActive={false}
                            dot={(props: any) => {
                                const hasAlert = alerts.some(a => a.type === 'error_burst' && Math.abs(a.timestamp - props.payload.timestamp) < 30000);
                                if (hasAlert) return (
                                    <g key={props.cx}>
                                        <circle cx={props.cx} cy={props.cy} r={6} fill={THEME.error} className="animate-ping opacity-20" />
                                        <circle cx={props.cx} cy={props.cy} r={3} fill={THEME.error} stroke={THEME.background} strokeWidth={2} />
                                        <foreignObject x={props.cx - 12} y={props.cy - 30} width={24} height={24}>
                                            <div className="w-6 h-6 flex items-center justify-center">
                                                <div className="w-1.5 h-4 bg-error rounded-full shadow-glow-error" />
                                            </div>
                                        </foreignObject>
                                    </g>
                                );
                                return <></>;
                            }}
                        />

                        {/* Detection Pins Layer */}
                        {alerts.filter(a => a.severity === 'critical').map((alert) => (
                            <ReferenceArea
                                key={`line-${alert.id}`}
                                x1={new Date(alert.timestamp - 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                x2={new Date(alert.timestamp + 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                strokeOpacity={0}
                                fill={alert.type === 'spike' ? THEME.info : THEME.error}
                                fillOpacity={0.05}
                                label={{
                                    value: '⚠ DETECTED',
                                    position: 'insideTop',
                                    fill: alert.type === 'spike' ? THEME.info : THEME.error,
                                    fontSize: 8,
                                    fontWeight: 800
                                }}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
