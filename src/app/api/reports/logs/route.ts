import { NextResponse } from 'next/server';
import { queryLogs } from '@/lib/logReader';
import { LogQueryParams } from '@/lib/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const params: LogQueryParams = body;

        // Force a higher limit for exports if not specified, or respect request
        // Default to exporting up to 10k logs for csv
        if (!params.limit) params.limit = 10000;

        const logs = await queryLogs(params);

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
