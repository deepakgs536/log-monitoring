import { Activity, AlertTriangle, Terminal, BarChart2, Settings, TrendingUp, ShieldAlert, Zap, LayoutDashboard, FileText, Hexagon } from 'lucide-react';

export const THEME = {
    // Base Palette - Core Neutral System
    background: '#F6F8FB', // bg-page
    surface: '#FFFFFF', // bg-surface
    card: '#FFFFFF', // bg-surface
    elevated: '#EBEDF1', // bg-muted (Side panels)

    // Borders & Dividers
    border: '#E5E7EB', // Neutral Gray 200
    divider: '#9CA3AF', // Neutral Gray 400

    // Text
    textPrimary: '#353536',
    textSecondary: '#706F70',
    textMuted: '#9A9CA3',
    textDisabled: '#D4D8DF',

    // Status / Semantic
    info: '#2252A0', // blue-main
    success: '#1B7E74', // green-main
    warning: '#C99500', // orange-main
    error: '#D43B3B', // red-main

    // Accents
    accentPurple: '#2252A0', // Mapped to Primary Blue
    accentPink: '#D43B3B', // Mapped to Red
    accentCyan: '#3566B6', // blue-soft
    accentGreen: '#1B7E74', // green-main
    accentYellow: '#C99500', // orange-main

    // Soft / Glow Bases - Container Backgrounds
    infoSoft: '#E0ECFF', // blue-bg
    successSoft: '#D4F7F2', // green-bg
    warningSoft: '#FFF3C2', // orange-bg
    errorSoft: '#FBE0E0', // red-bg
};

export const TIME_RANGES: { value: string; label: string }[] = [
    { value: '1m', label: '1m' },
    { value: '1h', label: '1h' },
    { value: '1d', label: '1d' },
    { value: '1w', label: '1w' },
    { value: '1M', label: '1M' },
    { value: '1y', label: '1y' },
];

export const NAV_ITEMS = [
    { label: 'Console', path: '/console', icon: Activity },
    { label: 'Incidents', path: '/incidents', icon: AlertTriangle },
    { label: 'Logs', path: '/logs', icon: Terminal },
    { label: 'Analytics', path: '/analytics', icon: BarChart2 },
    { label: 'Settings', path: '/settings', icon: Settings },
];

export const SIMULATION_SCENARIOS = [
    {
        id: 'spike',
        label: 'Traffic Spike',
        icon: TrendingUp,
        color: 'accent-cyan',
        description: 'Simulate 500% traffic surge'
    },
    {
        id: 'failure',
        label: 'Cascading Failure',
        icon: AlertTriangle,
        color: 'error',
        description: 'Trigger dependent service failures'
    },
    {
        id: 'attack',
        label: 'DDoS Attack',
        icon: ShieldAlert,
        color: 'warning',
        description: 'Simulate malicious traffic patterns'
    },
    {
        id: 'recovery',
        label: 'System Recovery',
        icon: Activity,
        color: 'success',
        description: 'Restore system to healthy state'
    },
] as const;
