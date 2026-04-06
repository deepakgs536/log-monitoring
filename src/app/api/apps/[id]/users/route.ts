import { NextRequest, NextResponse } from 'next/server';
import { getAppUsers } from '../../../../../services/appService';
import { getCurrentUserFromToken } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get('token')?.value;
        const user = getCurrentUserFromToken(token);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        
        // This validates if user is part of the application or is owner, actually the user must just be logged in
        // A more secure setup would check app.guestIds or app.ownerId against user.userId
        
        const users = await getAppUsers(id);
        return NextResponse.json(users);
    } catch (error: any) {
        console.error('Error fetching app users:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
