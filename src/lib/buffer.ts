import { Log } from './types';
import { appendBatch } from './writer';

const FLUSH_THRESHOLD = 100;
const FLUSH_INTERVAL_MS = 2000;

let buffer: Log[] = [];
let flushTimer: NodeJS.Timeout | null = null;

export function push(log: Log): void {
    buffer.push(log);

    if (buffer.length >= FLUSH_THRESHOLD) {
        flush();
    }
}

async function flush() {
    if (buffer.length === 0) return;

    const batch = [...buffer];
    buffer = []; // clear buffer immediately to allow new writes

    // Async write - strictly fire and forget from the API's perspective
    // We don't await this in the main flow, but we catch errors inside writer.
    await appendBatch(batch);
}

// Auto-flush timer
if (!flushTimer) {
    flushTimer = setInterval(() => {
        flush();
    }, FLUSH_INTERVAL_MS);
}

// Optional: cleanup method if needed (e.g. for testing)
export function cleanup() {
    if (flushTimer) {
        clearInterval(flushTimer);
        flushTimer = null;
    }
}
