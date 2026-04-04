import { Log, LogQueryParams } from './types';

export async function queryLogs(appId: string, params: LogQueryParams): Promise<Log[]> {
    // Volatile mode: We don't store logs to disk anymore due to Serverless limitations (Vercel).
    // The frontend receives logs via WebSocket for real-time visualization.
    // Querying historical logs returns an empty dataset.
    return [];
}
