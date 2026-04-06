import jwt from 'jsonwebtoken';

interface DecodedUser {
    userId: string;
    email: string;
    name: string;
}

export function getCurrentUserFromToken(tokenValue?: string): DecodedUser | null {
    if (!tokenValue) return null;
    try {
        const decoded = jwt.verify(tokenValue, process.env.PRIVATE_KEY || '') as DecodedUser;
        return decoded;
    } catch (error) {
        return null;
    }
}
