import { NextRequest, NextResponse } from 'next/server';
import { getApps, createApp } from '../../../services/appService';
import { getCurrentUserFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        const user = getCurrentUserFromToken(token);
        
        const apps = await getApps(user?.userId);
        return NextResponse.json(apps);
    } catch (error) {
        console.error('Error fetching apps:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        const user = getCurrentUserFromToken(token);
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const app = await createApp(name, user.userId);
        return NextResponse.json(app);
    } catch (error) {
        console.error('Error creating app:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
