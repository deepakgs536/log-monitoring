import fs from 'fs/promises';
import path from 'path';
import { Application } from '../lib/types';
import crypto from 'crypto';

const STORAGE_DIR = path.join(process.cwd(), 'storage');
const APPS_FILE = path.join(STORAGE_DIR, 'apps.json');

// Memory lock for file writing (simple mutex for a single node instance)
let isWriting = false;
const writeQueue: (() => void)[] = [];

async function acquireLock(): Promise<void> {
    return new Promise((resolve) => {
        if (!isWriting) {
            isWriting = true;
            resolve();
        } else {
            writeQueue.push(resolve);
        }
    });
}

function releaseLock() {
    if (writeQueue.length > 0) {
        const next = writeQueue.shift();
        if (next) next();
    } else {
        isWriting = false;
    }
}

// Ensure storage directory exists
async function ensureStorage() {
    try {
        await fs.mkdir(STORAGE_DIR, { recursive: true });
    } catch (e) { }
}

async function getAppsFileContent(): Promise<Application[]> {
    try {
        await fs.access(APPS_FILE);
        const content = await fs.readFile(APPS_FILE, 'utf-8');
        return JSON.parse(content);
    } catch {
        // If file doesn't exist, return empty array (or default app if we want to bootstrap)
        return [];
    }
}

async function saveApps(apps: Application[]) {
    await acquireLock();
    try {
        await ensureStorage();
        await fs.writeFile(APPS_FILE, JSON.stringify(apps, null, 2));
    } finally {
        releaseLock();
    }
}

export async function getApps(): Promise<Application[]> {
    const apps = await getAppsFileContent();
    if (apps.length === 0) {
        // Bootstrap default app
        const defaultApp: Application = {
            id: 'default',
            name: 'Default Application',
            apiKey: 'default-key',
            createdAt: Date.now()
        };
        await saveApps([defaultApp]);
        return [defaultApp];
    }
    return apps;
}

export async function getApp(id: string): Promise<Application | undefined> {
    const apps = await getApps();
    return apps.find(a => a.id === id);
}

export async function getAppByApiKey(apiKey: string): Promise<Application | undefined> {
    const apps = await getApps();
    return apps.find(a => a.apiKey === apiKey);
}

export async function createApp(name: string): Promise<Application> {
    const apps = await getApps();
    const newApp: Application = {
        id: crypto.randomUUID(),
        name,
        apiKey: crypto.randomBytes(16).toString('hex'),
        createdAt: Date.now()
    };
    apps.push(newApp);
    await saveApps(apps);

    // Create storage directory for the new app
    const appStorage = path.join(STORAGE_DIR, newApp.id);
    await fs.mkdir(appStorage, { recursive: true });

    return newApp;
}

export async function updateApp(id: string, name: string): Promise<Application | undefined> {
    const apps = await getApps();
    const appIndex = apps.findIndex(a => a.id === id);

    if (appIndex === -1) return undefined;

    apps[appIndex] = {
        ...apps[appIndex],
        name
    };

    await saveApps(apps);
    return apps[appIndex];
}

export async function deleteApp(id: string): Promise<boolean> {
    const apps = await getApps();
    const newApps = apps.filter(a => a.id !== id);

    if (newApps.length === apps.length) return false;

    await saveApps(newApps);

    // Clean up storage
    try {
        const appStorage = path.join(STORAGE_DIR, id);
        await fs.rm(appStorage, { recursive: true, force: true });
    } catch (e) {
        console.error(`Failed to cleanup storage for app ${id}`, e);
    }

    return true;
}
