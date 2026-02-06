import { Log, LogLevel } from './types';

export function validateLog(log: any): log is Log {
    if (typeof log !== 'object' || log === null) return false;

    // Check required fields existence and types
    const hasTimestamp = typeof log.timestamp === 'number';
    const hasService = typeof log.service === 'string' && log.service.length > 0;
    const hasLevel = ['info', 'warn', 'error'].includes(log.level);
    const hasMessage = typeof log.message === 'string'; // Allow empty strings? User said "message length" validation, let's keep it simple for now or strictly non-empty if strictly interpreted.
    // User said "message length", usually means max length or just check it exists. Let's assume just string for now.
    const hasLatency = typeof log.latency === 'number';
    const hasRequestId = typeof log.requestId === 'string' && log.requestId.length > 0;

    if (!hasTimestamp || !hasService || !hasLevel || !hasMessage || !hasLatency || !hasRequestId) {
        return false;
    }

    // Additional sanity checks
    // Timestamp sanity: reasonable range (e.g., not from year 1970 or 3000)?
    // User said "timestamp sanity". Let's ensure it's positive.
    if (log.timestamp <= 0) return false;

    // Message length check (e.g. max 5000 chars)
    if (log.message.length > 5000) return false;

    return true;
}
