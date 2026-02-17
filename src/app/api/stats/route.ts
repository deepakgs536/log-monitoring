import { NextResponse } from 'next/server';
import { getLogStats } from '@/services/statsService';
import { TimeRange } from '@/lib/types';
import { getApps } from '@/services/appService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const timeRange = (searchParams.get('timeRange') as TimeRange) || '1h';
    let appId = searchParams.get('appId');

    if (!appId) {
        // Fallback to default if not provided (context might not be set in UI yet)
        const apps = await getApps();
        const defaultApp = apps.find(a => a.id === 'default');
        if (defaultApp) appId = defaultApp.id;
    }

    if (!appId) {
        return NextResponse.json({ error: 'App ID required' }, { status: 400 });
    }

    const stats = await getLogStats(appId, timeRange);
    return NextResponse.json(stats);
}
