import { NextResponse } from 'next/server';
import { getApps, createApp } from '../../../services/appService';

export async function GET() {
    try {
        const apps = await getApps();
        // Return apps without sensitive API keys
        const safeApps = apps.map(({ apiKey, ...rest }) => rest);
        return NextResponse.json(safeApps);
    } catch (error) {
        console.error('Error fetching apps:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const app = await createApp(name);
        return NextResponse.json(app);
    } catch (error) {
        console.error('Error creating app:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
