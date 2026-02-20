import { Log } from './types';
import { appendBatch } from './writer';

const FLUSH_THRESHOLD = 100;
const FLUSH_INTERVAL_MS = 2000;

// Map of appId -> buffer
const buffers: Map<string, Log[]> = new Map();

declare global {
    // eslint-disable-next-line no-var
    var flushTimer: NodeJS.Timeout | null;
}

if (typeof global.flushTimer === 'undefined') {
    global.flushTimer = null;
}

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

    try {
        // Async write
        await appendBatch(appId, batch);
    } catch (e) {
        console.error(`Failed to flush batch for app ${appId}, requeuing ${batch.length} logs`, e);
        // Re-queue logs at the beginning of the new buffer to preserve order as best as possible
        const currentBuffer = buffers.get(appId) || [];
        buffers.set(appId, [...batch, ...currentBuffer]);
    }
}

async function flushAll() {
    for (const appId of buffers.keys()) {
        await flushApp(appId);
    }
}

// Auto-flush timer
if (!global.flushTimer) {
    global.flushTimer = setInterval(() => {
        flushAll();
    }, FLUSH_INTERVAL_MS);
}

export function cleanup() {
    if (global.flushTimer) {
        clearInterval(global.flushTimer);
        global.flushTimer = null;
    }
}
