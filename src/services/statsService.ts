
import fs from 'fs/promises';
import path from 'path';
import { Log, Alert, DashboardMetrics, LogStats, TimeRange, SystemMetrics, SimulationScenario } from '../lib/types';
import { TIME_RANGES, SIMULATION_SCENARIOS } from '../lib/constants';

const STORAGE_DIR = path.join(process.cwd(), 'storage');

// Helper to get time range value
function getTimeRangeMs(range: TimeRange): number {
    const ranges: Record<TimeRange, number> = {
        '1m': 60 * 1000,
        '15m': 15 * 60 * 1000,
        '1h': 60 * 60 * 1000,
        '6h': 6 * 60 * 60 * 1000,
        '12h': 12 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '1d': 24 * 60 * 60 * 1000,
        '1w': 7 * 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '1M': 30 * 24 * 60 * 60 * 1000,
        '1y': 365 * 24 * 60 * 60 * 1000
    };
    return ranges[range] || 60 * 60 * 1000;
}

// ... existing formatTimeKey and getGranularity functions ...

function formatTimeKey(date: Date, range: TimeRange): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    switch (range) {
        case '1m':
            return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} `;
        case '1h':
            return `${pad(date.getHours())}:${pad(date.getMinutes())} `;
        case '1d':
            return `${pad(date.getHours())}:00`;
        case '1w':
        case '1M':
            return `${date.getMonth() + 1}/${date.getDate()}`;
        case '1y':
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return monthNames[date.getMonth()];
        default:
            return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }
}

function getGranularity(range: TimeRange): number {
    const granularities: Record<TimeRange, number> = {
        '1m': 1000,
        '15m': 10 * 1000,
        '1h': 60 * 1000,
        '6h': 15 * 60 * 1000,
        '12h': 30 * 60 * 1000,
        '24h': 60 * 60 * 1000,
        '1d': 60 * 60 * 1000,
        '1w': 6 * 60 * 60 * 1000,
        '7d': 6 * 60 * 60 * 1000,
        '1M': 24 * 60 * 60 * 1000,
        '1y': 30 * 24 * 60 * 60 * 1000
    };
    return granularities[range] || 60 * 1000;
}

async function saveAlert(appId: string, alert: Alert) {
    try {
        const appOpsDir = path.join(STORAGE_DIR, appId);
        await fs.mkdir(appOpsDir, { recursive: true });
        const alertFile = path.join(appOpsDir, 'alerts.ndjson');
        await fs.appendFile(alertFile, JSON.stringify(alert) + '\n');
    } catch (e) {
        console.error(`Failed to save alert for app ${appId}:`, e);
    }
}

async function getRecentAlerts(appId: string, limit: number = 10): Promise<Alert[]> {
    try {
        const alertFile = path.join(STORAGE_DIR, appId, 'alerts.ndjson');
        const content = await fs.readFile(alertFile, 'utf-8');
        return content.trim().split('\n')
            .filter(Boolean)
            .map(line => JSON.parse(line))
            .slice(-limit)
            .reverse();
    } catch (e) {
        return [];
    }
}

let currentScenario: SimulationScenario = 'normal';
let scenarioStartTime = Date.now();

export function setSimulationScenario(scenario: SimulationScenario) {
    currentScenario = scenario;
    scenarioStartTime = Date.now();
}

export function getSimulationScenario() {
    return currentScenario;
}

// Mock System Metrics Generator
function generateSystemMetrics(logsPerSec: number): SystemMetrics {
    let baseBuffer = Math.min(100, Math.max(0, (logsPerSec / 200) * 100));
    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
    let baseLatency = 20 + (Math.random() * 10);

    // Override based on scenario
    if (currentScenario === 'spike') {
        baseBuffer = 85 + Math.random() * 10; // High buffer
        status = 'degraded';
        baseLatency = 150 + Math.random() * 50;
    } else if (currentScenario === 'failure') {
        baseBuffer = 40;
        status = 'critical';
        baseLatency = 800 + Math.random() * 400; // Very high latency
    } else if (currentScenario === 'attack') {
        baseBuffer = 98;
        status = 'critical';
        baseLatency = 400 + Math.random() * 100;
    } else if (currentScenario === 'recovery') {
        baseBuffer = Math.max(0, 50 - (Date.now() - scenarioStartTime) / 100); // Decreasing buffer
        status = 'healthy';
        baseLatency = 40;
    }

    const noise = (Math.random() - 0.5) * 10;
    const bufferSize = Math.min(100, Math.max(5, baseBuffer + noise));
    const detectionLatency = Number((baseLatency + Math.random() * 20).toFixed(0));

    // Refine status based on metrics if not forced
    if (currentScenario === 'normal') {
        if (bufferSize > 90 || detectionLatency > 1000) status = 'critical';
        else if (bufferSize > 60 || detectionLatency > 300) status = 'degraded';
    }

    return {
        ingestionRate: Number((logsPerSec * 1.05).toFixed(1)),
        bufferSize: Number(bufferSize.toFixed(1)),
        detectionLatency,
        activeStreams: 42,
        droppedEvents: status === 'critical' ? Math.floor(Math.random() * 50) : 0,
        status
    };
}


async function detectAnomalies(appId: string, logs: Log[], windowMs: number): Promise<Alert[]> {
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

    if (currentRate > averageRate * 2 && averageRate > 1) {
        const contributorMap = new Map<string, number>();
        for (const log of shortLogs) contributorMap.set(log.service, (contributorMap.get(log.service) || 0) + 1);
        const topService = Array.from(contributorMap.entries()).sort((a, b) => b[1] - a[1])[0];

        const confidence = Math.min(99, Math.floor((currentRate / (averageRate * 2)) * 70 + 20));

        const alert: Alert = {
            id: `spike-${now}`,
            type: 'spike',
            severity: 'critical',
            service: topService[0],
            message: `Traffic spike: ${currentRate.toFixed(1)} logs/sec in '${topService[0]}'.`,
            timestamp: now,
            confidence,
            metadata: {
                currentRate: Number(currentRate.toFixed(1)),
                averageRate: Number(averageRate.toFixed(1)),
                threshold: '2.0x',
                rationale: `Current throughput (${currentRate.toFixed(1)} LPS) is significantly higher than the 30s baseline (${averageRate.toFixed(1)} LPS).`,
                contributor: topService[0]
            }
        };
        alerts.push(alert);
        await saveAlert(appId, alert);
    }

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
            confidence,
            metadata: {
                errorRate: Number((errorRate * 100).toFixed(1)),
                threshold: '30.0%',
                rationale: `Error density has exceeded the 30% safety threshold, primarily driven by ${topErrorService[0]}.`,
                source: topErrorService[0]
            }
        };
        alerts.push(alert);
        await saveAlert(appId, alert);
    }

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
                confidence: 96,
                metadata: {
                    count,
                    threshold: '20 events/5s',
                    rationale: `Message "${msg.substring(0, 30)}..." repeated ${count} times in 5 seconds, indicating a potential loop or attack.`,
                    message: msg
                }
            };
            alerts.push(alert);
            await saveAlert(appId, alert);
            break;
        }
    }

    return alerts;
}

export async function getLogStats(appId: string, timeRange: TimeRange = '1h'): Promise<LogStats> {
    try {
        const logFile = path.join(STORAGE_DIR, appId, 'logs.ndjson');

        // Check availability strictly for stats to avoid throwing
        try {
            await fs.access(logFile);
        } catch {
            return {
                distribution: [],
                serviceDistribution: [],
                timeline: [],
                total: 0,
                recentLogs: [],
                metrics: { logsPerSecond: 0, errorRate: 0, avgLatency: 0, healthScore: 100 },
                system: generateSystemMetrics(0),
                alerts: []
            };
        }

        const fileContent = await fs.readFile(logFile, 'utf-8');
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

        const windowMs = 30000;
        const metricLogs = allLogs.filter(l => l.timestamp >= now - windowMs);

        const lps = metricLogs.length / (windowMs / 1000);
        const errCount = metricLogs.filter(l => l.level === 'error').length;
        const errRate = metricLogs.length > 0 ? errCount / metricLogs.length : 0;
        const avgLat = metricLogs.length > 0 ? metricLogs.reduce((acc, l) => acc + (l.latency || 0), 0) / metricLogs.length : 0;

        const currentAlerts = await detectAnomalies(appId, allLogs, windowMs);
        const historicalAlerts = await getRecentAlerts(appId, 15);

        const processedHistoricalAlerts = historicalAlerts.map(a => ({
            ...a,
            confidence: a.confidence || 85
        }));

        const alerts = [...currentAlerts, ...processedHistoricalAlerts.filter(h => !currentAlerts.some(c => c.id === h.id))].slice(0, 15);

        const errorPenalty = Math.min(40, errRate * 100);
        const alertPenalty = Math.min(40, alerts.filter(a => a.severity === 'critical' && a.timestamp > now - 60000).length * 15);
        const healthScore = Math.max(0, Math.floor(100 - errorPenalty - alertPenalty));

        const metrics: DashboardMetrics = {
            logsPerSecond: Number(lps.toFixed(2)),
            errorRate: Number(errRate.toFixed(2)),
            avgLatency: Number(avgLat.toFixed(0)),
            healthScore
        };

        const system = generateSystemMetrics(lps);

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

        const serviceMap = new Map<string, number>();
        for (const log of allLogs) {
            const service = log.service || 'unknown';
            serviceMap.set(service, (serviceMap.get(service) || 0) + 1);
        }
        const serviceDistribution = Array.from(serviceMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5); // Top 5 services

        const timeline = Array.from(timelineMap.entries())
            .map(([time, data]) => ({ time, ...data }))
            .sort((a, b) => a.timestamp - b.timestamp);

        return {
            distribution,
            serviceDistribution,
            timeline,
            total: allLogs.length,
            recentLogs: allLogs.slice(-15).reverse(),
            metrics,
            system,
            alerts
        };
    } catch (error) {
        console.error(`Error reading stats for app ${appId}:`, error);
        return {
            distribution: [],
            serviceDistribution: [],
            timeline: [],
            total: 0,
            recentLogs: [],
            metrics: { logsPerSecond: 0, errorRate: 0, avgLatency: 0, healthScore: 100 },
            system: generateSystemMetrics(0),
            alerts: []
        };
    }
}
