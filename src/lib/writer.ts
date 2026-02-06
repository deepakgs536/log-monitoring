import fs from 'fs/promises';
import path from 'path';
import { Log } from './types';

const STORAGE_DIR = path.join(process.cwd(), 'storage');
const LOG_FILE = path.join(STORAGE_DIR, 'logs.ndjson');

// Ensure storage directory exists
const initStorage = async () => {
    try {
        await fs.mkdir(STORAGE_DIR, { recursive: true });
    } catch (err) {
        console.error('Failed to create storage directory:', err);
    }
};

// Initialize on module load (or could be lazy)
initStorage();

export async function appendBatch(logs: Log[]): Promise<void> {
    if (logs.length === 0) return;

    const data = logs.map(log => JSON.stringify(log)).join('\n') + '\n';

    try {
        await fs.appendFile(LOG_FILE, data, 'utf8');
    } catch (err) {
        console.error('Failed to write logs to disk:', err);
        // In a real system, we might retry or fallback to a dead-letter queue.
    }
}
