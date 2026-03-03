import { NextResponse } from 'next/server';
import { getLogStats } from '@/services/statsService';
import { getApps } from '@/services/appService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        let appId = searchParams.get('appId');

        if (!appId) {
            const apps = await getApps();
            const defaultApp = apps.find(a => a.id === 'default');
            if (defaultApp) appId = defaultApp.id;
        }

        if (!appId) {
            return NextResponse.json({ error: 'App ID required' }, { status: 400 });
        }

        const stats = await getLogStats(appId, '1h');

        const snapshot = {
            timestamp: Date.now(),
            system: stats.system,
            metrics: stats.metrics,
            active_alerts: stats.alerts.length
        };

        return new NextResponse(JSON.stringify(snapshot, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="system-snapshot-${Date.now()}.json"`,
            },
        });
    } catch (error) {
        console.error('Export Summary Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
