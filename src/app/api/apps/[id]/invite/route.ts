import { NextRequest, NextResponse } from 'next/server';
import { getAppUsers, inviteUserToApp } from '../../../../../services/appService';
import { getCurrentUserFromToken } from '@/lib/auth';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get('token')?.value;
        const user = getCurrentUserFromToken(token);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const addedUser = await inviteUserToApp(id, user.userId, email);
        return NextResponse.json(addedUser);
    } catch (error: any) {
        console.error('Error inviting user:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: error.message?.includes('found') ? 404 : 400 });
    }
}
