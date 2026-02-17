import fs from 'fs/promises';
import path from 'path';
import { Log, LogQueryParams } from './types';

const STORAGE_DIR = path.join(process.cwd(), 'storage');

export async function queryLogs(appId: string, params: LogQueryParams): Promise<Log[]> {
    try {
        const logFile = path.join(STORAGE_DIR, appId, 'logs.ndjson');

        // Check if file exists
        try {
            await fs.access(logFile);
        } catch {
            return [];
        }

        const fileContent = await fs.readFile(logFile, 'utf8');
        const lines = fileContent.split('\n');
        const results: Log[] = [];

        // Process in reverse to get newest first
        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i].trim();
            if (!line) continue;

            try {
                const log: Log = JSON.parse(line);

                // Apply filters
                if (params.level && params.level !== 'all' && log.level !== params.level) continue;
                if (params.service && params.service !== 'all' && log.service !== params.service) continue;

                if (params.startTime && log.timestamp < params.startTime) continue;
                if (params.endTime && log.timestamp > params.endTime) continue;

                if (params.search) {
                    const searchLower = params.search.toLowerCase();
                    const matches =
                        log.message.toLowerCase().includes(searchLower) ||
                        log.service.toLowerCase().includes(searchLower) ||
                        log.requestId.toLowerCase().includes(searchLower) ||
                        (log.metadata && JSON.stringify(log.metadata).toLowerCase().includes(searchLower));

                    if (!matches) continue;
                }

                results.push(log);

                if (params.limit && results.length >= params.limit) {
                    break;
                }
            } catch (e) {
                console.warn('Failed to parse log line:', line);
                continue;
            }
        }

        return results;
    } catch (error) {
        console.error(`Error querying logs for app ${appId}:`, error);
        return [];
    }
}
