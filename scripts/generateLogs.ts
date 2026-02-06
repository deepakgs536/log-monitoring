import { generateBatch } from '../src/utils/logGenerator';

const API_URL = 'http://localhost:3000/api/logs';
const BATCH_SIZE = 50;
const TOTAL_BATCHES = 20; // 1000 logs total
const INTERVAL_MS = 500; // Send batch every 500ms

async function sendBatch(batch: any[]) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ logs: batch }),
        });

        if (!response.ok) {
            console.error(`Status: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error('Body:', text);
            return;
        }

        const data = await response.json();
        console.log(`Sent ${batch.length} logs. Accepted: ${data.accepted}, Rejected: ${data.rejected}`);
    } catch (error) {
        console.error('Request failed:', error);
    }
}

async function run() {
    console.log(`Starting load test. Target: ${API_URL}`);

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
