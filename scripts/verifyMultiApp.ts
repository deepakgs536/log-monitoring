// Removed import to avoid ts-node issues with aliases/paths
// import { generateBatch } from '../src/utils/logGenerator';

const BASE_URL = 'http://localhost:3000/api';

// Basic arg parsing
const args = process.argv.slice(2);
const apiKeyArg = args.find(a => a.startsWith('--api-key='));
const paramApiKey = apiKeyArg ? apiKeyArg.split('=')[1] : null;

const countArg = args.find(a => a.startsWith('--count='));
const paramCount = countArg ? parseInt(countArg.split('=')[1], 10) : 1;

async function verify() {
    console.log(`Starting Multi-App Verification (Logs: ${paramCount})...`);

    let app: any;

    if (paramApiKey) {
        console.log(`Using provided API Key: ${paramApiKey}`);
        app = {
            apiKey: paramApiKey,
            name: 'Existing App (from CLI)',
            id: 'unknown-id-from-cli'
        };
    } else {
        // 1. Create App
        console.log('1. Creating new app...');
        const createRes = await fetch(`${BASE_URL}/apps`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: `Verification App ${Date.now()}` })
        });

        if (!createRes.ok) {
            throw new Error(`Failed to create app: ${createRes.statusText}`);
        }

        app = await createRes.json();
        console.log('   App Created:', app.name, 'ID:', app.id);
        console.log('   API Key:', app.apiKey);

        if (!app.apiKey) throw new Error('No API Key returned!');
    }

    // 2. Send Logs
    console.log(`2. Sending ${paramCount} logs with API Key...`);
    const batchSize = 50;
    const totalBatches = Math.ceil(paramCount / batchSize);
    const uniqueBatchId = Date.now();

    for (let i = 0; i < totalBatches; i++) {
        const currentBatchSize = Math.min(batchSize, paramCount - i * batchSize);
        const logs = [];
        for (let j = 0; j < currentBatchSize; j++) {
            logs.push({
                timestamp: Date.now(),
                service: 'verification-script',
                level: ['info', 'warn', 'error'][Math.floor(Math.random() * 3)],
                message: `Verification Log ${uniqueBatchId}-${i * batchSize + j}`,
                latency: Math.floor(Math.random() * 100),
                requestId: `req-${uniqueBatchId}-${i * batchSize + j}`
            });
        }

        const sendRes = await fetch(`${BASE_URL}/logs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': app.apiKey
            },
            body: JSON.stringify({ logs })
        });

        if (!sendRes.ok) {
            const text = await sendRes.text();
            throw new Error(`Failed to send batch ${i + 1}: ${sendRes.statusText} - ${text}`);
        }
        console.log(`   Batch ${i + 1}/${totalBatches} sent (${currentBatchSize} logs).`);
        await new Promise(r => setTimeout(r, 100)); // Small delay between batches
    }

    console.log('   All logs sent successfully.');

    // 3. Verify Logs via Search
    console.log('3. Searching for logs with API Key...');
    // Wait a bit for ingestion (async buffer flush is 2s, plus some extra for larger batches)
    const waitTime = Math.max(4000, Math.min(10000, paramCount * 10));
    console.log(`   Waiting ${waitTime}ms for ingestion...`);
    await new Promise(r => setTimeout(r, waitTime));

    const searchRes = await fetch(`${BASE_URL}/logs/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': app.apiKey
        },
        // Search for logs from this specific run
        body: JSON.stringify({ search: `Verification Log ${uniqueBatchId}` })
    });

    if (!searchRes.ok) {
        const text = await searchRes.text();
        throw new Error(`Failed to search logs: ${searchRes.statusText} - ${text}`);
    }

    const searchData = await searchRes.json();
    console.log(`   Found ${searchData.logs?.length || 0} logs matching current run.`);

    if (searchData.logs?.length > 0) {
        console.log(`SUCCESS: Verified logs were ingested and listed for the specific app.`);
        if (searchData.logs.length === paramCount) {
            console.log(`   Exact count match: ${paramCount} logs found.`);
        } else {
            console.log(`   Count mismatch: Expected ${paramCount}, found ${searchData.logs.length}. (Might be due to search limit or ingestion delay)`);
        }
    } else {
        console.error('FAILURE: Could not find any logs from this run.');
    }
}

verify().catch(console.error);
