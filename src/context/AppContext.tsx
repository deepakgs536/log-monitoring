'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Application } from '../lib/types';

interface AppContextType {
    apps: Application[];
    currentApp: Application | null;
    isLoading: boolean;
    refreshApps: () => Promise<Application[]>;
    switchApp: (appId: string) => void;
    createApp: (name: string) => Promise<Application | undefined>;
    updateApp: (id: string, name: string) => Promise<Application | undefined>;
    deleteApp: (id: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [apps, setApps] = useState<Application[]>([]);
    const [currentApp, setCurrentApp] = useState<Application | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [localKeys, setLocalKeys] = useState<Record<string, string>>({});

    // Load local keys on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedKeys = localStorage.getItem('log_monitor_api_keys');
            if (storedKeys) {
                try {
                    setLocalKeys(JSON.parse(storedKeys));
                } catch (e) {
                    console.error('Failed to parse local API keys');
                }
            }
        }
    }, []);

    const fetchApps = async () => {
        try {
            const res = await fetch('/api/apps');
            if (res.ok) {
                const data: Application[] = await res.json();

                // Merge with local keys
                const mergedApps = data.map(app => ({
                    ...app,
                    apiKey: localKeys[app.id] || app.apiKey // Use local key if available, else whatever backend sent (undefined now)
                }));

                setApps(mergedApps);
                return mergedApps;
            }
        } catch (error) {
            console.error('Failed to fetch apps', error);
        }
        return [];
    };

    // Re-merge when localKeys update (e.g. after creation)
    useEffect(() => {
        setApps(prevApps => prevApps.map(app => ({
            ...app,
            apiKey: localKeys[app.id] || app.apiKey
        })));
    }, [localKeys]);

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            const fetchedApps = await fetchApps();

            // Try to recover last selected app from localStorage
            const savedAppId = localStorage.getItem('currentAppId');
            if (savedAppId) {
                const savedApp = fetchedApps.find((a: Application) => a.id === savedAppId);
                if (savedApp) {
                    setCurrentApp(savedApp);
                } else if (fetchedApps.length > 0) {
                    // Fallback to first if saved is invalid
                    setCurrentApp(fetchedApps[0]);
                    localStorage.setItem('currentAppId', fetchedApps[0].id);
                }
            } else if (fetchedApps.length > 0) {
                setCurrentApp(fetchedApps[0]);
                localStorage.setItem('currentAppId', fetchedApps[0].id);
            }

            setIsLoading(false);
        };
        init();
    }, []);

    const switchApp = (appId: string) => {
        const app = apps.find(a => a.id === appId);
        if (app) {
            setCurrentApp(app);
            localStorage.setItem('currentAppId', appId);
        }
    };

    const createNewApp = async (name: string) => {
        try {
            const res = await fetch('/api/apps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });

            if (res.ok) {
                const newApp: Application = await res.json();

                // Save key to local storage
                if (newApp.apiKey) {
                    const updatedKeys = { ...localKeys, [newApp.id]: newApp.apiKey };
                    setLocalKeys(updatedKeys);
                    localStorage.setItem('log_monitor_api_keys', JSON.stringify(updatedKeys));
                }

                setApps(prev => [...prev, newApp]);
                switchApp(newApp.id);
                return newApp;
            }
        } catch (error) {
            console.error('Failed to create app', error);
        }
    };

    const updateApp = async (id: string, name: string) => {
        try {
            const res = await fetch(`/api/apps/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });

            if (res.ok) {
                const updatedApp: Application = await res.json();

                // Preserve API key from local state/storage as backend doesn't return it on update
                const preservedApp = {
                    ...updatedApp,
                    apiKey: localKeys[id]
                };

                setApps(prev => prev.map(a => a.id === id ? preservedApp : a));
                if (currentApp?.id === id) {
                    setCurrentApp(preservedApp);
                }
                return preservedApp;
            }
        } catch (error) {
            console.error('Failed to update app', error);
        }
    };

    const deleteApp = async (id: string) => {
        try {
            const res = await fetch(`/api/apps/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                // Remove key from local storage
                const { [id]: deletedKey, ...remainingKeys } = localKeys;
                setLocalKeys(remainingKeys);
                localStorage.setItem('log_monitor_api_keys', JSON.stringify(remainingKeys));

                const newApps = apps.filter(a => a.id !== id);
                setApps(newApps);

                // If deleted app was active, switch to another
                if (currentApp?.id === id) {
                    if (newApps.length > 0) {
                        switchApp(newApps[0].id);
                    } else {
                        setCurrentApp(null);
                        localStorage.removeItem('currentAppId');
                    }
                }
                return true;
            }
        } catch (error) {
            console.error('Failed to delete app', error);
        }
        return false;
    };

    return (
        <AppContext.Provider value={{
            apps,
            currentApp,
            isLoading,
            refreshApps: fetchApps,
            switchApp,
            createApp: createNewApp,
            updateApp,
            deleteApp
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
