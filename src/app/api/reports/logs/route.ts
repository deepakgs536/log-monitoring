import { NextResponse } from 'next/server';
import { queryLogs } from '@/lib/logReader';
import { LogQueryParams } from '@/lib/types';

import { getApps, getAppByApiKey } from '@/services/appService';

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

        // Force a higher limit for exports if not specified, or respect request
        // Default to exporting up to 10k logs for csv
        if (!params.limit) params.limit = 10000;

        const logs = await queryLogs(appId, params);

        if (!logs || logs.length === 0) {
            return new NextResponse('timestamp,service,level,message,requestId\n', {
                status: 200,
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename="logs.csv"',
                },
            });
        }

        // Convert to CSV
        const header = 'timestamp,service,level,message,requestId';
        const rows = logs.map(log => {
            const date = new Date(log.timestamp).toISOString();
            const message = `"${log.message.replace(/"/g, '""')}"`; // Escape quotes
            return `${date},${log.service},${log.level},${message},${log.requestId}`;
        }).join('\n');

        const csv = `${header}\n${rows}`;

        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="logs-${Date.now()}.csv"`,
            },
        });
    } catch (error) {
        console.error('Export Logs Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
