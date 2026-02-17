import { NextResponse } from 'next/server';
import { getLogStats } from '@/services/statsService';

// Force dynamic to get latest state
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // We fetch the stats which contains the active alerts
        // In a real system we might have a specific getAlerts() service
        const stats = await getLogStats('1h'); // Get broad range to catch all current alerts

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
