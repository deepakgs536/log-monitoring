import { NextResponse } from 'next/server';
import { getApp, updateApp, deleteApp } from '../../../../services/appService';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const app = await getApp(id);
        if (!app) {
            return NextResponse.json({ error: 'App not found' }, { status: 404 });
        }

        // Return app without sensitive API key
        const { apiKey, ...safeApp } = app;
        return NextResponse.json(safeApp);
    } catch (error) {
        console.error('Error fetching app:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const updatedApp = await updateApp(id, name);
        if (!updatedApp) {
            return NextResponse.json({ error: 'App not found' }, { status: 404 });
        }

        return NextResponse.json(updatedApp);
    } catch (error) {
        console.error('Error updating app:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const success = await deleteApp(id);
        if (!success) {
            return NextResponse.json({ error: 'App not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting app:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
