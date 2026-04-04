import { NextResponse } from 'next/server';
import { processBatch } from '../../../services/ingestionService';
import { getAppByApiKey, getApps } from '../../../services/appService';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key, x-app-id',
};

export async function OPTIONS(request: Request) {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
    try {
        let appId = request.headers.get('x-app-id');
        const apiKey = request.headers.get('x-api-key');

        if (apiKey) {
            const app = await getAppByApiKey(apiKey);
            if (app) appId = app.id;
        }

        // Fallback to default app if no headers (Migration path)
        if (!appId) {
            const apps = await getApps();
            const defaultApp = apps.find(a => a.id === 'default');
            if (defaultApp) appId = defaultApp.id;
        }

        if (!appId) {
            return NextResponse.json(
                { error: 'Unauthorized. Missing x-app-id or x-api-key header.' },
                { status: 401, headers: corsHeaders }
            );
        }

        const body = await request.json();
        const logs = body.logs;

        if (!logs || !Array.isArray(logs)) {
            return NextResponse.json(
                { error: 'Invalid payload. Expected { logs: [] }' },
                { status: 400, headers: corsHeaders }
            );
        }

        const stats = processBatch(appId, logs);

        return NextResponse.json(stats, { headers: corsHeaders });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500, headers: corsHeaders }
        );
    }
}
