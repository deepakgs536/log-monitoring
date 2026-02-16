import { NextResponse } from 'next/server';
import { getLogStats } from '@/services/statsService';
import { TimeRange } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const timeRange = (searchParams.get('timeRange') as TimeRange) || '1h';

    const stats = await getLogStats(timeRange);
    return NextResponse.json(stats);
}
