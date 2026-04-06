import { Application } from '../lib/types';
import crypto from 'crypto';
import connectDB from '../lib/mongodb';
import { AppModel } from '../lib/models';
import User from '../lib/models/User';

export async function getApps(userId?: string): Promise<Application[]> {
    await connectDB();
    
    // If userId is provided, return apps owned by user, apps where user is guest, and apps with no owner (public).
    // If not, return all apps (or no apps, but let's stick to existing behavior for fallback).
    const query = userId ? {
        $or: [
            { ownerId: userId },
            { guestIds: userId },
            { ownerId: { $exists: false } },
            { ownerId: null }
        ]
    } : {};

    const apps = await AppModel.find(query).lean();
    
    const formattedApps = apps.map(app => ({
        id: app.id as string,
        name: app.name as string,
        apiKey: app.apiKey as string,
        ownerId: app.ownerId as string | undefined,
        guestIds: (app.guestIds as string[]) || [],
        createdAt: app.createdAt as number
    }));
    
    if (formattedApps.length === 0) {
        // Bootstrap default app if empty
        const defaultApp: Application = {
            id: 'default',
            name: 'Default Application',
            apiKey: 'default-key',
            createdAt: Date.now()
            // intentionally no owner, so it is public
        };
        await AppModel.create(defaultApp);
        return [defaultApp];
    }
    
    return formattedApps;
}

export async function getApp(id: string): Promise<Application | undefined> {
    await connectDB();
    const app = await AppModel.findOne({ id }).lean();
    if (!app) return undefined;
    
    return {
        id: app.id as string,
        name: app.name as string,
        apiKey: app.apiKey as string,
        ownerId: app.ownerId as string | undefined,
        guestIds: (app.guestIds as string[]) || [],
        createdAt: app.createdAt as number
    };
}

export async function getAppByApiKey(apiKey: string): Promise<Application | undefined> {
    await connectDB();
    const app = await AppModel.findOne({ apiKey }).lean();
    if (!app) return undefined;
    
    return {
        id: app.id as string,
        name: app.name as string,
        apiKey: app.apiKey as string,
        ownerId: app.ownerId as string | undefined,
        guestIds: (app.guestIds as string[]) || [],
        createdAt: app.createdAt as number
    };
}

export async function createApp(name: string, userId?: string): Promise<Application> {
    await connectDB();
    const newApp: Application = {
        id: crypto.randomUUID(),
        name,
        apiKey: crypto.randomBytes(16).toString('hex'),
        ownerId: userId, // assign owner if provided
        guestIds: [],
        createdAt: Date.now()
    };
    
    await AppModel.create(newApp);
    
    return newApp;
}

export async function updateApp(id: string, name: string, userId?: string): Promise<Application | undefined> {
    await connectDB();
    
    const query = userId ? {
        id,
        $or: [
            { ownerId: userId },
            { ownerId: { $exists: false } },
            { ownerId: null }
        ]
    } : { id };

    const app = await AppModel.findOneAndUpdate(
        query,
        { name },
        { new: true }
    ).lean();
    
    if (!app) return undefined;
    
    return {
        id: app.id as string,
        name: app.name as string,
        apiKey: app.apiKey as string,
        ownerId: app.ownerId as string | undefined,
        guestIds: (app.guestIds as string[]) || [],
        createdAt: app.createdAt as number
    };
}

export async function deleteApp(id: string, userId?: string): Promise<boolean> {
    await connectDB();
    const query = userId ? {
        id,
        $or: [
            { ownerId: userId },
            { ownerId: { $exists: false } },
            { ownerId: null }
        ]
    } : { id };

    const result = await AppModel.deleteOne(query);
    return result.deletedCount > 0;
}

export async function inviteUserToApp(appId: string, ownerId: string, targetEmail: string) {
    await connectDB();
    
    // First, verify the requester is the owner
    const app = await AppModel.findOne({ id: appId });
    if (!app) throw new Error("Application not found");
    
    // Only the owner (or public apps being claimed by first invite?) 
    // If public app, let's set the ownerId to the inviter
    if (!app.ownerId) {
        app.ownerId = ownerId;
    } else if (app.ownerId !== ownerId) {
        throw new Error("You do not have permission to invite users to this application");
    }

    const targetUser = await User.findOne({ email: targetEmail.toLowerCase() });
    if (!targetUser) {
        throw new Error("User with that email does not exist");
    }

    const targetUserId = targetUser._id.toString();
    
    if (app.ownerId === targetUserId) {
        throw new Error("User is already the owner");
    }

    if (!app.guestIds) app.guestIds = [];
    
    if (app.guestIds.includes(targetUserId)) {
        throw new Error("User is already invited");
    }

    app.guestIds.push(targetUserId);
    await app.save();

    return {
        id: targetUserId,
        name: targetUser.name,
        email: targetUser.email,
        role: 'guest'
    };
}

export async function getAppUsers(appId: string) {
    await connectDB();
    const app = await AppModel.findOne({ id: appId }).lean();
    if (!app) throw new Error("Application not found");

    const users = [];

    // Add owner
    if (app.ownerId) {
        const owner = await User.findById(app.ownerId).lean();
        if (owner) {
            users.push({
                id: owner._id.toString(),
                name: owner.name,
                email: owner.email,
                role: 'owner'
            });
        }
    }

    // Add guests
    if (app.guestIds && app.guestIds.length > 0) {
        const guests = await User.find({ _id: { $in: app.guestIds } }).lean();
        for (const guest of guests) {
            users.push({
                id: guest._id.toString(),
                name: guest.name,
                email: guest.email,
                role: 'guest'
            });
        }
    }

    return users;
}

export async function removeUserFromApp(appId: string, ownerId: string, targetUserId: string) {
    await connectDB();
    
    const app = await AppModel.findOne({ id: appId });
    if (!app) throw new Error("Application not found");
    
    if (app.ownerId !== ownerId) {
        throw new Error("You do not have permission to remove users from this application");
    }

    if (!app.guestIds || !app.guestIds.includes(targetUserId)) {
        throw new Error("User was not found in this application");
    }

    app.guestIds = app.guestIds.filter((id: string) => id !== targetUserId);
    await app.save();

    return true;
}
