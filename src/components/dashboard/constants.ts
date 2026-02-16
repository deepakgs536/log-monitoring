export const THEME = {
    // Base Palette
    background: '#050816',
    surface: '#0B1022',
    card: '#121935',
    elevated: '#182042',

    // Borders & Dividers
    border: '#242B55',
    divider: '#1C2347',

    // Text
    textPrimary: '#F2F5FF',
    textSecondary: '#AAB2D9',
    textMuted: '#6B739F',
    textDisabled: '#434A73',

    // Status / Semantic
    info: '#5B8CFF',
    success: '#3CFF7C',
    warning: '#FFC447',
    error: '#FF4D6D',

    // Accents
    accentPurple: '#7A6CFF',
    accentPink: '#FF3DAA',
    accentCyan: '#2CE6FF',
    accentGreen: '#3CFF7C',
    accentYellow: '#FFC447',

    // Soft / Glow Bases (for use in JS logic if needed, though mostly CSS classes)
    infoSoft: 'rgba(91,140,255,0.12)',
    successSoft: 'rgba(60,255,124,0.15)',
    warningSoft: 'rgba(255,196,71,0.15)',
    errorSoft: 'rgba(255,77,109,0.15)',
};

export const TIME_RANGES: { value: string; label: string }[] = [
    { value: '1m', label: '1m' },
    { value: '1h', label: '1h' },
    { value: '1d', label: '1d' },
    { value: '1w', label: '1w' },
    { value: '1M', label: '1M' },
    { value: '1y', label: '1y' },
];
