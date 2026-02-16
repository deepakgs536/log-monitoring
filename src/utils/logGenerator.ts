import { Log, LogLevel } from '../lib/types';

const SERVICES = ['user-service', 'payment-service', 'auth-service', 'analytics-service'];
const LEVELS: LogLevel[] = ['info', 'warn', 'error'];
const MESSAGES = [
    'User logged in',
    'Payment processed',
    'Database connection failed',
    'Cache miss',
    'API latency high',
    'New order created'
];

// Simple random ID generator to avoid external dependencies
function generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function generateLog(): Log {
    const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
    const rand = Math.random() * 100;
    let level: LogLevel;
    if (rand < 5) {
        level = 'error';
    } else if (rand < 15) {
        level = 'warn';
    } else {
        level = 'info';
    }
    const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    const latency = Math.floor(Math.random() * 500); // 0-500ms

    return {
        timestamp: Date.now(),
        service,
        level,
        message,
        latency,
        requestId: generateId()
    };
}

export function generateBatch(size: number): Log[] {
    return Array.from({ length: size }, () => generateLog());
}
