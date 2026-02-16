import fs from 'fs/promises';
import path from 'path';
import { Log, Alert, DashboardMetrics, LogStats, TimeRange } from '../lib/types';

const LOG_FILE = path.join(process.cwd(), 'storage/logs.ndjson');

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

function getGranularity(range: TimeRange): number {
    const granularities: Record<TimeRange, number> = {
        '1m': 1000,                // 1 second
        '1h': 60 * 1000,           // 1 minute
        '1d': 60 * 60 * 1000,      // 1 hour
        '1w': 6 * 60 * 60 * 1000,  // 6 hours
        '1M': 24 * 60 * 60 * 1000, // 1 day
        '1y': 30 * 24 * 60 * 60 * 1000 // 1 month
    };
    return granularities[range];
}

const ALERT_FILE = path.join(process.cwd(), 'storage/alerts.ndjson');

async function saveAlert(alert: Alert) {
    try {
        await fs.appendFile(ALERT_FILE, JSON.stringify(alert) + '\n');
    } catch (e) {
        console.error('Failed to save alert:', e);
    }
}

async function getRecentAlerts(limit: number = 10): Promise<Alert[]> {
    try {
        const content = await fs.readFile(ALERT_FILE, 'utf-8');
        return content.trim().split('\n')
            .filter(Boolean)
            .map(line => JSON.parse(line))
            .slice(-limit)
            .reverse();
    } catch (e) {
        return [];
    }
}

async function detectAnomalies(logs: Log[], windowMs: number): Promise<Alert[]> {
    const alerts: Alert[] = [];
    const now = Date.now();

    if (logs.length === 0) return [];

    const shortWindow = 5000;
    const longWindow = 30000;

    const shortLogs = logs.filter(l => l.timestamp >= now - shortWindow);
    const longLogs = logs.filter(l => l.timestamp >= now - longWindow);

    if (shortLogs.length === 0) return [];

    const currentRate = shortLogs.length / (shortWindow / 1000);
    const averageRate = longLogs.length / (longWindow / 1000);

    // 1. Spike Detection with Explanation
    if (currentRate > averageRate * 2 && averageRate > 1) {
        const contributorMap = new Map<string, number>();
        for (const log of shortLogs) contributorMap.set(log.service, (contributorMap.get(log.service) || 0) + 1);
        const topService = Array.from(contributorMap.entries()).sort((a, b) => b[1] - a[1])[0];

        const confidence = Math.min(98, Math.floor((currentRate / (averageRate * 2)) * 70 + 20));

        const alert: Alert = {
            id: `spike-${now}`,
            type: 'spike',
            severity: 'critical',
            service: topService[0],
            message: `Traffic spike: ${currentRate.toFixed(1)} logs/sec in '${topService[0]}'.`,
            timestamp: now,
            metadata: {
                currentRate: Number(currentRate.toFixed(1)),
                averageRate: Number(averageRate.toFixed(1)),
                threshold: '2.0x',
                confidence,
                rationale: `Current throughput (${currentRate.toFixed(1)} LPS) is significantly higher than the 30s baseline (${averageRate.toFixed(1)} LPS).`,
                contributor: topService[0]
            }
        };
        alerts.push(alert);
        await saveAlert(alert);
    }

    // 2. Error Burst Detection with Explanation
    const errorLogs = shortLogs.filter(l => l.level === 'error');
    const errorRate = shortLogs.length > 0 ? errorLogs.length / shortLogs.length : 0;

    if (errorRate > 0.3 && shortLogs.length > 5) {
        const errorContributorMap = new Map<string, number>();
        for (const log of errorLogs) errorContributorMap.set(log.service, (errorContributorMap.get(log.service) || 0) + 1);
        const topErrorService = Array.from(errorContributorMap.entries()).sort((a, b) => b[1] - a[1])[0];

        const confidence = Math.min(99, Math.floor((errorRate / 0.3) * 60 + 40));

        const alert: Alert = {
            id: `burst-${now}`,
            type: 'error_burst',
            severity: 'critical',
            service: topErrorService[0],
            message: `High error rate (${(errorRate * 100).toFixed(1)}%) in '${topErrorService[0]}'.`,
            timestamp: now,
            metadata: {
                errorRate: Number((errorRate * 100).toFixed(1)),
                threshold: '30.0%',
                confidence,
                rationale: `Error density has exceeded the 30% safety threshold, primarily driven by ${topErrorService[0]}.`,
                source: topErrorService[0]
            }
        };
        alerts.push(alert);
        await saveAlert(alert);
    }

    // 3. Repetition Detection with Explanation
    const messageCounts = new Map<string, number>();
    for (const log of shortLogs) messageCounts.set(log.message, (messageCounts.get(log.message) || 0) + 1);

    for (const [msg, count] of messageCounts.entries()) {
        if (count > 20) {
            const sourceService = logs.find(l => l.message === msg)?.service || 'unknown';
            const alert: Alert = {
                id: `spam-${now}`,
                type: 'repetition',
                severity: 'warn',
                service: sourceService,
                message: `Repeat pattern in '${sourceService}'.`,
                timestamp: now,
                metadata: {
                    count,
                    threshold: '20 events/5s',
                    confidence: 95,
                    rationale: `Message "${msg.substring(0, 30)}..." repeated ${count} times in 5 seconds, indicating a potential loop or attack.`,
                    message: msg
                }
            };
            alerts.push(alert);
            await saveAlert(alert);
            break;
        }
    }

    return alerts;
}

export async function getLogStats(timeRange: TimeRange = '1h'): Promise<LogStats> {
    try {
        const fileContent = await fs.readFile(LOG_FILE, 'utf-8');
        const lines = fileContent.trim().split('\n');

        const now = Date.now();
        const rangeMs = getTimeRangeMs(timeRange);
        const cutoffTime = now - rangeMs;
        const granularity = getGranularity(timeRange);

        const allLogs: Log[] = [];
        for (const line of lines) {
            try {
                if (line.trim()) {
                    const log = JSON.parse(line);
                    if (log.timestamp >= cutoffTime) {
                        allLogs.push(log);
                    }
                }
            } catch (e) { }
        }

        // Window for metrics calculation (Last 30s)
        const windowMs = 30000;
        const metricLogs = allLogs.filter(l => l.timestamp >= now - windowMs);

        const lps = metricLogs.length / (windowMs / 1000);
        const errCount = metricLogs.filter(l => l.level === 'error').length;
        const errRate = metricLogs.length > 0 ? errCount / metricLogs.length : 0;
        const avgLat = metricLogs.length > 0 ? metricLogs.reduce((acc, l) => acc + (l.latency || 0), 0) / metricLogs.length : 0;

        const currentAlerts = await detectAnomalies(allLogs, windowMs);
        const historicalAlerts = await getRecentAlerts(15);

        // Merge and deduplicate (by ID)
        const alerts = [...currentAlerts, ...historicalAlerts.filter(h => !currentAlerts.some(c => c.id === h.id))].slice(0, 15);

        // System Health Scoring
        // Base 100, minus penalties for errors and anomalies
        const errorPenalty = Math.min(40, errRate * 100);
        const alertPenalty = Math.min(40, alerts.filter(a => a.severity === 'critical' && a.timestamp > now - 60000).length * 15);
        const healthScore = Math.max(0, Math.floor(100 - errorPenalty - alertPenalty));

        const metrics: DashboardMetrics = {
            logsPerSecond: Number(lps.toFixed(2)),
            errorRate: Number(errRate.toFixed(2)),
            avgLatency: Number(avgLat.toFixed(0)),
            healthScore
        };

        const distributionMap = new Map<string, number>();
        const timelineMap = new Map<string, { info: number; warn: number; error: number; timestamp: number }>();

        for (let t = cutoffTime; t < now - granularity; t += granularity) {
            const date = new Date(t);
            const timeKey = formatTimeKey(date, timeRange);
            timelineMap.set(timeKey, { info: 0, warn: 0, error: 0, timestamp: t });
        }

        for (const log of allLogs) {
            const level = log.level || 'unknown';
            distributionMap.set(level, (distributionMap.get(level) || 0) + 1);

            const date = new Date(log.timestamp);
            const timeKey = formatTimeKey(date, timeRange);

            if (timelineMap.has(timeKey)) {
                const existing = timelineMap.get(timeKey)!;
                if (level === 'info') existing.info++;
                else if (level === 'warn') existing.warn++;
                else if (level === 'error') existing.error++;
            }
        }

        const distribution = Array.from(distributionMap.entries()).map(([name, value]) => ({ name, value }));

        const timeline = Array.from(timelineMap.entries())
            .map(([time, data]) => ({ time, ...data }))
            .sort((a, b) => a.timestamp - b.timestamp);

        return {
            distribution,
            timeline,
            total: allLogs.length,
            recentLogs: allLogs.slice(-15).reverse(),
            metrics,
            alerts
        };
    } catch (error) {
        console.error('Error reading stats:', error);
        return {
            distribution: [],
            timeline: [],
            total: 0,
            recentLogs: [],
            metrics: { logsPerSecond: 0, errorRate: 0, avgLatency: 0, healthScore: 100 },
            alerts: []
        };
    }
}
