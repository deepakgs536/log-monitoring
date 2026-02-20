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

        // Use simple stream reading
        const fileStream = require('fs').createReadStream(logFile, { encoding: 'utf8' });
        const rl = require('readline').createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let results: Log[] = [];

        // We process lines forward since it's a stream. We'll collect matches, and at the end take the last N items for reverse-chronological order.
        for await (const line of rl) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            try {
                const log: Log = JSON.parse(trimmed);

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

                // Optional: To avoid memory blowing up mid-stream, we could cap the array.
                // However, we want the NEWEST logs (end of file) so we have to trim the oldest (front).
                // Doing this on every push is O(n), so we'll just let it accumulate matches (filtered sets are usually small)
                // If it gets too large, we trim the start.
                if (params.limit && results.length > params.limit * 2) {
                    results = results.slice(-params.limit); // Keep only the latest 
                }

            } catch (e) {
                // Ignore parse errors on individual lines
                continue;
            }
        }

        // We want the most recent logs first, so we return the end of the array reversed
        if (params.limit && results.length > params.limit) {
            results = results.slice(-params.limit);
        }

        return results.reverse();
    } catch (error) {
        console.error(`Error querying logs for app ${appId}:`, error);
        return [];
    }
}
