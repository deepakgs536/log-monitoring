export type LogLevel = 'info' | 'warn' | 'error';

export interface Log {
    timestamp: number;
    service: string;
    level: LogLevel;
    message: string;
    latency: number; // in ms
    requestId: string;
}

requestId: string;
}

export type AlertType = 'spike' | 'error_burst' | 'repetition' | 'latency';
export type Severity = 'info' | 'warn' | 'critical';

export interface SystemMetrics {
    ingestionRate: number;    // logs/sec (internal ingestion)
    bufferSize: number;       // 0-100%
    detectionLatency: number; // ms
    activeStreams: number;
    droppedEvents: number;
    status: 'healthy' | 'degraded' | 'critical';
}

export interface Alert {
    id: string;
    type: AlertType;
    severity: Severity;
    service: string;
    message: string;
    timestamp: number;
    confidence: number; // 0-100% reliability score
    metadata?: {
        currentRate?: number;
        averageRate?: number;
        threshold?: string;
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
    system: SystemMetrics;
    alerts: Alert[];
}

export type SimulationScenario = 'normal' | 'spike' | 'failure' | 'attack' | 'recovery';
