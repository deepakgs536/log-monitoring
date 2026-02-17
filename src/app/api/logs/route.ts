import { NextResponse } from 'next/server';
import { processBatch } from '../../../services/ingestionService';
import { getAppByApiKey } from '../../../services/appService';
import { getApps } from '../../../services/appService';

export async function POST(request: Request) {
    try {
        // Auth check - currently simple ID/Key check from header
        // For backward compatibility during migration, we might default to 'default' if no header is present
        // BUT strict requirement for multi-app usually implies validation.

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
                { status: 401 }
            );
        }

        const body = await request.json();

        // Expecting { logs: [...] }
        const logs = body.logs;

        if (!logs || !Array.isArray(logs)) {
            return NextResponse.json(
                { error: 'Invalid payload. Expected { logs: [] }' },
                { status: 400 }
            );
        }

        const stats = processBatch(appId, logs);

        return NextResponse.json(stats);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
