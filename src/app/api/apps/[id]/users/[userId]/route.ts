import { NextRequest, NextResponse } from 'next/server';
import { removeUserFromApp } from '../../../../../../services/appService';
import { getCurrentUserFromToken } from '@/lib/auth';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; userId: string }> }
) {
    try {
        const token = request.cookies.get('token')?.value;
        const user = getCurrentUserFromToken(token);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id: appId, userId: targetUserId } = await params;

        await removeUserFromApp(appId, user.userId, targetUserId);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error removing user:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: error.message?.includes('permission') ? 403 : 400 }
        );
    }
}
