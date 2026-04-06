import { NextRequest, NextResponse } from 'next/server';
import { getApp, updateApp, deleteApp } from '../../../../services/appService';
import { getCurrentUserFromToken } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get('token')?.value;
        const user = getCurrentUserFromToken(token);
        const { id } = await params;
        const app = await getApp(id);
        if (!app) {
            return NextResponse.json({ error: 'App not found' }, { status: 404 });
        }

        // Only return API key if the user is the owner
        const isOwner = user && app.ownerId === user.userId;
        const { apiKey, ...safeApp } = app;
        
        if (isOwner || !app.ownerId) {
            return NextResponse.json(app);
        } else {
            return NextResponse.json(safeApp);
        }
    } catch (error) {
        console.error('Error fetching app:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get('token')?.value;
        const user = getCurrentUserFromToken(token);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const updatedApp = await updateApp(id, name, user.userId);
        if (!updatedApp) {
            return NextResponse.json({ error: 'App not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json(updatedApp);
    } catch (error) {
        console.error('Error updating app:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get('token')?.value;
        const user = getCurrentUserFromToken(token);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const success = await deleteApp(id, user.userId);
        if (!success) {
            return NextResponse.json({ error: 'App not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting app:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
