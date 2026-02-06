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
