import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'storage/logs.ndjson');

const SERVICES = ['auth-service', 'payment-service', 'inventory-api', 'checkout-worker', 'email-provider'];

export async function POST(request: Request) {
    try {
        const { scenario } = await request.json();
        const now = Date.now();
        const logs: any[] = [];

        if (scenario === 'spike') {
            // High volume in a short window
            for (let i = 0; i < 200; i++) {
                logs.push({
                    timestamp: now - Math.floor(Math.random() * 2000),
                    service: SERVICES[Math.floor(Math.random() * SERVICES.length)],
                    level: 'info',
                    message: 'Processing inbound request',
                    latency: Math.floor(Math.random() * 200) + 50,
                    requestId: `sim-spike-${i}`
                });
            }
        } else if (scenario === 'burst') {
            // Concentrated errors in payment-service
            for (let i = 0; i < 80; i++) {
                logs.push({
                    timestamp: now - Math.floor(Math.random() * 2000),
                    service: 'payment-service',
                    level: 'error',
                    message: 'Critical: Database connection timeout',
                    latency: Math.floor(Math.random() * 2000) + 1000,
                    requestId: `sim-burst-${i}`
                });
            }
        } else if (scenario === 'recovery') {
            // Healthy logs to dilute previous patterns
            for (let i = 0; i < 50; i++) {
                logs.push({
                    timestamp: now - Math.floor(Math.random() * 2000),
                    service: SERVICES[Math.floor(Math.random() * SERVICES.length)],
                    level: 'info',
                    message: 'Service health check passed',
                    latency: 50,
                    requestId: `sim-rec-${i}`
                });
            }
        }

        const ndjson = logs.map(l => JSON.stringify(l)).join('\n') + '\n';
        await fs.appendFile(LOG_FILE, ndjson);

        return NextResponse.json({ success: true, message: `Scenario '${scenario}' triggered.` });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to trigger scenario' }, { status: 500 });
    }
}
