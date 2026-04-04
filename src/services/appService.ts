import { Application } from '../lib/types';
import crypto from 'crypto';
import connectDB from '../lib/mongodb';
import { AppModel } from '../lib/models';

export async function getApps(): Promise<Application[]> {
    await connectDB();
    const apps = await AppModel.find().lean();
    
    const formattedApps = apps.map(app => ({
        id: app.id as string,
        name: app.name as string,
        apiKey: app.apiKey as string,
        createdAt: app.createdAt as number
    }));
    
    if (formattedApps.length === 0) {
        // Bootstrap default app if empty
        const defaultApp: Application = {
            id: 'default',
            name: 'Default Application',
            apiKey: 'default-key',
            createdAt: Date.now()
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
        createdAt: app.createdAt as number
    };
}

export async function createApp(name: string): Promise<Application> {
    await connectDB();
    const newApp: Application = {
        id: crypto.randomUUID(),
        name,
        apiKey: crypto.randomBytes(16).toString('hex'),
        createdAt: Date.now()
    };
    
    await AppModel.create(newApp);
    
    return newApp;
}

export async function updateApp(id: string, name: string): Promise<Application | undefined> {
    await connectDB();
    
    const app = await AppModel.findOneAndUpdate(
        { id },
        { name },
        { new: true }
    ).lean();
    
    if (!app) return undefined;
    
    return {
        id: app.id as string,
        name: app.name as string,
        apiKey: app.apiKey as string,
        createdAt: app.createdAt as number
    };
}

export async function deleteApp(id: string): Promise<boolean> {
    await connectDB();
    const result = await AppModel.deleteOne({ id });
    return result.deletedCount > 0;
}
