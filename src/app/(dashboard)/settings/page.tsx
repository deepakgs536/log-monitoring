'use client';

import { Settings as SettingsIcon, User, Shield, Bell, Database } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
                <p className="text-slate-500">Manage your monitoring preferences and service configurations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-1 border-r border-slate-200 pr-8 space-y-1">
                    {[
                        { label: 'General', icon: SettingsIcon, active: true },
                        { label: 'Account', icon: User },
                        { label: 'Security', icon: Shield },
                        { label: 'Notifications', icon: Bell },
                        { label: 'Data Retention', icon: Database },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${item.active
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="col-span-2 space-y-8">
                    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-soft">
                        <h2 className="font-bold text-slate-900">Environment Preferences</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Auto-refresh Dashboard</p>
                                    <p className="text-xs text-slate-500">Automatically update metrics every 2s</p>
                                </div>
                                <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
