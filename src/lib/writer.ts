import { Log } from './types';

export async function appendBatch(appId: string, logs: Log[]): Promise<void> {
    // Volatile mode: do not write to disk. Logs are processed and broadcasted live only.
    if (logs.length === 0) return;
    
    // In volatile mode, we intentionally discard the batch here to avoid read-only fs crashes on Vercel.
    // The logs have already been broadcasted via WebSockets in `ingestionService.ts`.
}
