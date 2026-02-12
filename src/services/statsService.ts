import fs from 'fs/promises';
import path from 'path';
import { Log } from '../lib/types';

const LOG_FILE = path.join(process.cwd(), 'storage/logs.ndjson');

export type TimeRange = '1m' | '1h' | '1d' | '1w' | '1M' | '1y';

export interface LogStats {
    distribution: { name: string; value: number }[];
    timeline: { time: string; info: number; warn: number; error: number }[];
    total: number;
}

function getTimeRangeMs(range: TimeRange): number {
    const ranges: Record<TimeRange, number> = {
        '1m': 60 * 1000,           // 1 minute
        '1h': 60 * 60 * 1000,       // 1 hour
        '1d': 24 * 60 * 60 * 1000,  // 1 day
        '1w': 7 * 24 * 60 * 60 * 1000,  // 1 week
        '1M': 30 * 24 * 60 * 60 * 1000, // 1 month (30 days)
        '1y': 365 * 24 * 60 * 60 * 1000 // 1 year
    };
    return ranges[range];
}

function formatTimeKey(date: Date, range: TimeRange): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    switch (range) {
        case '1m': // Show seconds
            return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        case '1h': // Show minutes
            return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
        case '1d': // Show hours
            return `${pad(date.getHours())}:00`;
        case '1w':
        case '1M': // Show days
            return `${date.getMonth() + 1}/${date.getDate()}`;
        case '1y': // Show months
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return monthNames[date.getMonth()];
        default:
            return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }
}

export async function getLogStats(timeRange: TimeRange = '1h'): Promise<LogStats> {
    try {
        const fileContent = await fs.readFile(LOG_FILE, 'utf-8');
        const lines = fileContent.trim().split('\n');

        const now = Date.now();
        const rangeMs = getTimeRangeMs(timeRange);
        const cutoffTime = now - rangeMs;

        const logs: Log[] = [];
        for (const line of lines) {
            try {
                if (line.trim()) {
                    const log = JSON.parse(line);
                    // Filter by time range
                    if (log.timestamp >= cutoffTime) {
                        logs.push(log);
                    }
                }
            } catch (e) {
                // Skip invalid lines
            }
        }

        const distributionMap = new Map<string, number>();
        const timelineMap = new Map<string, { info: number; warn: number; error: number }>();

        for (const log of logs) {
            // Distribution
            const level = log.level || 'unknown';
            distributionMap.set(level, (distributionMap.get(level) || 0) + 1);

            // Timeline (group by appropriate granularity)
            const date = new Date(log.timestamp);
            const timeKey = formatTimeKey(date, timeRange);

            const existing = timelineMap.get(timeKey) || { info: 0, warn: 0, error: 0 };
            if (level === 'info') existing.info++;
            else if (level === 'warn') existing.warn++;
            else if (level === 'error') existing.error++;

            timelineMap.set(timeKey, existing);
        }

        const distribution = Array.from(distributionMap.entries()).map(([name, value]) => ({ name, value }));

        // Sort timeline by time
        const timeline = Array.from(timelineMap.entries())
            .map(([time, counts]) => ({ time, ...counts }))
            .sort((a, b) => a.time.localeCompare(b.time));

        return {
            distribution,
            timeline,
            total: logs.length
        };
    } catch (error) {
        console.error('Error reading stats:', error);
        return { distribution: [], timeline: [], total: 0 };
    }
}
