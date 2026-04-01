// import { generateBatch } from '../src/utils/logGenerator';

// Inlined to avoid ts-node module resolution issues
const SERVICES = ['user-service', 'payment-service', 'auth-service', 'analytics-service'];
const LEVELS: ('info' | 'warn' | 'error')[] = ['info', 'warn', 'error'];
const MESSAGES = [
    'User logged in', 'Payment processed', 'Database connection failed',
    'Cache miss', 'API latency high', 'New order created'
];

function generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateBatch(size: number): any[] {
    return Array.from({ length: size }, () => {
        const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
        const rand = Math.random() * 100;
        let level = 'info';
        if (rand < 5) level = 'error';
        else if (rand < 15) level = 'warn';

        return {
            timestamp: Date.now(),
            service,
            level,
            message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
            latency: Math.floor(Math.random() * 500),
            requestId: generateId()
        };
    });
}

const API_URL = 'http://localhost:3000/api/logs';

// Robust arg parser
const argss = process.argv.slice(2);
const getArg = (name: string) => {
    const arg = argss.find(a => a.startsWith(`--${name}=`));
    return arg ? arg.substring(`--${name}=`.length) : null;
};

const apiKey = getArg('api-key');
const appId = getArg('app-id');
const batchSizeArg = getArg('batch-size');
const intervalArg = getArg('interval');
const totalBatchesArg = getArg('batches');
const countArg = getArg('count');

const BATCH_SIZE = batchSizeArg ? parseInt(batchSizeArg, 10) : 10;
let TOTAL_BATCHES = totalBatchesArg ? parseInt(totalBatchesArg, 10) : 100;
let TARGET_COUNT = 0;

if (countArg) {
    TARGET_COUNT = parseInt(countArg, 10);
    TOTAL_BATCHES = Math.ceil(TARGET_COUNT / BATCH_SIZE);
}

const INTERVAL_MS = intervalArg ? parseInt(intervalArg, 10) : 1000;

if (!apiKey && !appId) {
    console.warn('WARNING: No --api-key or --app-id provided. Logs may be rejected or sent to default app.');
    console.log('Usage: npx tsx scripts/generateLogs.ts --api-key=<key> OR --app-id=<id>');
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

    const executeBatch = async () => {
        if (count >= TOTAL_BATCHES) {
            return false;
        }
        const currentBatchSize = TARGET_COUNT ? Math.min(BATCH_SIZE, TARGET_COUNT - (count * BATCH_SIZE)) : BATCH_SIZE;
        const batch = generateBatch(currentBatchSize);
        await sendBatch(batch);
        count++;
        return true;
    };

    const shouldContinue = await executeBatch();
    if (!shouldContinue) {
        console.log('Done sending batches.');
        return;
    }

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    while (true) {
        await sleep(INTERVAL_MS);
        const more = await executeBatch();
        if (!more) {
            console.log('Done sending batches.');
            break;
        }
    }
}

run();

export { };
