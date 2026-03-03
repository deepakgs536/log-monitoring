import { NextResponse } from 'next/server';
import { getLogStats } from '@/services/statsService';
import { getApps } from '@/services/appService';

// Force dynamic to get latest state
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

        // We fetch the stats which contains the active alerts
        // In a real system we might have a specific getAlerts() service
        const stats = await getLogStats(appId, '1h'); // Get broad range to catch all current alerts

        const incidents = stats.alerts || [];

        return new NextResponse(JSON.stringify(incidents, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="incidents-${Date.now()}.json"`,
            },
        });
    } catch (error) {
        console.error('Export Incidents Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
