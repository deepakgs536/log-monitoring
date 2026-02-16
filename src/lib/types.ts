export type LogLevel = 'info' | 'warn' | 'error';

export interface Log {
    timestamp: number;
    service: string;
    level: LogLevel;
    message: string;
    latency: number; // in ms
    requestId: string;
}

export interface IngestionResponse {
    accepted: number;
    rejected: number;
}

export type AlertType = 'spike' | 'error_burst' | 'repetition' | 'latency';
export type Severity = 'info' | 'warn' | 'critical';

export interface Alert {
    id: string;
    type: AlertType;
    severity: Severity;
    service: string;
    message: string;
    timestamp: number;
    metadata?: {
        currentRate?: number;
        averageRate?: number;
        threshold?: string;
        confidence?: number;
        rationale?: string;
        contributor?: string;
        source?: string;
        errorRate?: number;
        count?: number;
        message?: string;
    };
}

export interface DashboardMetrics {
    logsPerSecond: number;
    errorRate: number;
    avgLatency: number;
    healthScore: number;
}

export type TimeRange = '1m' | '1h' | '1d' | '1w' | '1M' | '1y';

export interface LogStats {
    distribution: { name: string; value: number }[];
    timeline: { time: string; info: number; warn: number; error: number; timestamp: number }[];
    total: number;
    recentLogs: Log[];
    metrics: DashboardMetrics;
    alerts: Alert[];
}
