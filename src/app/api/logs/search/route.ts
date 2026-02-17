import { NextResponse } from 'next/server';
import { queryLogs } from '@/lib/logReader';
import { LogQueryParams } from '@/lib/types';
import { getApps } from '@/services/appService';
import { getAppByApiKey } from '@/services/appService';

export async function POST(request: Request) {
    try {
        let appId = request.headers.get('x-app-id');
        const apiKey = request.headers.get('x-api-key');

        if (apiKey) {
            const app = await getAppByApiKey(apiKey);
            if (app) appId = app.id;
        }

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
        const params: LogQueryParams = body;

        const logs = await queryLogs(appId, params);

        return NextResponse.json({ logs });
    } catch (error) {
        console.error('Search API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
