import { Log } from './types';
import { appendBatch } from './writer';

const FLUSH_THRESHOLD = 100;
const FLUSH_INTERVAL_MS = 2000;

// Map of appId -> buffer
const buffers: Map<string, Log[]> = new Map();
let flushTimer: NodeJS.Timeout | null = null;

export function push(appId: string, log: Log): void {
    if (!buffers.has(appId)) {
        buffers.set(appId, []);
    }

    const buffer = buffers.get(appId)!;
    buffer.push(log);

    if (buffer.length >= FLUSH_THRESHOLD) {
        flushApp(appId);
    }
}

async function flushApp(appId: string) {
    const buffer = buffers.get(appId);
    if (!buffer || buffer.length === 0) return;

    const batch = [...buffer];
    buffers.set(appId, []); // Limit memory usage by clearing reference, though new array created above

    // Async write
    await appendBatch(appId, batch);
}

async function flushAll() {
    for (const appId of buffers.keys()) {
        await flushApp(appId);
    }
}

// Auto-flush timer
if (!flushTimer) {
    flushTimer = setInterval(() => {
        flushAll();
    }, FLUSH_INTERVAL_MS);
}

export function cleanup() {
    if (flushTimer) {
        clearInterval(flushTimer);
        flushTimer = null;
    }
}
