import fs from 'fs/promises';
import path from 'path';
import { Log } from './types';

const STORAGE_DIR = path.join(process.cwd(), 'storage');

// Ensure app storage directory exists
const ensureAppStorage = async (appId: string) => {
    const appDir = path.join(STORAGE_DIR, appId);
    try {
        await fs.mkdir(appDir, { recursive: true });
    } catch (err) {
        console.error(`Failed to create storage directory for app ${appId}:`, err);
    }
    return appDir;
};

export async function appendBatch(appId: string, logs: Log[]): Promise<void> {
    if (logs.length === 0) return;

    const data = logs.map(log => JSON.stringify(log)).join('\n') + '\n';

    try {
        const appDir = await ensureAppStorage(appId);
        const logFile = path.join(appDir, 'logs.ndjson');
        await fs.appendFile(logFile, data, 'utf8');
    } catch (err) {
        console.error(`Failed to write logs to disk for app ${appId}:`, err);
    }
}
