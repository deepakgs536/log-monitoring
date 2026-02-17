import { generateBatch } from '../src/utils/logGenerator';

const API_URL = 'http://localhost:3000/api/logs';
const BATCH_SIZE = 10;
const TOTAL_BATCHES = 100;
const INTERVAL_MS = 1000;

// Simple arg parser
const args = process.argv.slice(2);
const apiKeyObj = args.find(a => a.startsWith('--api-key='));
const appIdObj = args.find(a => a.startsWith('--app-id='));

const apiKey = apiKeyObj ? apiKeyObj.split('=')[1] : null;
const appId = appIdObj ? appIdObj.split('=')[1] : null;

if (!apiKey && !appId) {
    console.warn('WARNING: No --api-key or --app-id provided. Logs may be rejected or sent to default app.');
    console.log('Usage: npx ts-node scripts/generateLogs.ts --api-key=<key> OR --app-id=<id>');
}

async function sendBatch(batch: any[]) {
    try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (apiKey) headers['x-api-key'] = apiKey;
        if (appId) headers['x-app-id'] = appId;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({ logs: batch }),
        });

        if (!response.ok) {
            console.error(`Status: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error('Body:', text);
            return;
        }

        const data = await response.json();
        console.log(`[${apiKey ? 'API-KEY' : appId ? 'APP-ID' : 'DEFAULT'}] Sent ${batch.length} logs. Accepted: ${data.accepted}, Rejected: ${data.rejected}`);
    } catch (error) {
        console.error('Request failed:', error);
    }
}

async function run() {
    console.log(`Starting load test. Target: ${API_URL}`);
    console.log(`Target App: ${apiKey ? 'Auth via API Key' : appId ? 'Auth via App ID' : 'Default/Fallback'}`);

    let count = 0;

    const interval = setInterval(async () => {
        if (count >= TOTAL_BATCHES) {
            clearInterval(interval);
            console.log('Done sending batches.');
            return;
        }

        const batch = generateBatch(BATCH_SIZE);
        await sendBatch(batch);
        count++;
    }, INTERVAL_MS);
}

run();
