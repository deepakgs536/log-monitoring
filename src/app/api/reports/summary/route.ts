import { NextResponse } from 'next/server';
import { getLogStats } from '@/services/statsService';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const stats = await getLogStats('1h');

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
