import { NextResponse } from 'next/server';
import { processBatch } from '../../../services/ingestionService';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Expecting { logs: [...] }
        const logs = body.logs;

        if (!logs || !Array.isArray(logs)) {
            return NextResponse.json(
                { error: 'Invalid payload. Expected { logs: [] }' },
                { status: 400 }
            );
        }

        const stats = processBatch(logs);

        return NextResponse.json(stats);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
