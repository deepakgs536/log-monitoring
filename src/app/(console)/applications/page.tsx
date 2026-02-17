'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Application } from '@/lib/types';
import { Trash2, Eye, EyeOff, Edit2, Check, X, Search, Copy, Terminal, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationsPage() {
    const { apps, updateApp, deleteApp, isLoading, currentApp, switchApp } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

    // Delete Modal State
    const [deletingApp, setDeletingApp] = useState<Application | null>(null);
    const [confirmName, setConfirmName] = useState('');

    const filteredApps = apps.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleKeyVisibility = (id: string) => {
        const newSet = new Set(visibleKeys);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setVisibleKeys(newSet);
    };

    const startEditing = (app: Application) => {
        setEditingId(app.id);
        setEditName(app.name);
    };

    const saveEdit = async () => {
        if (editingId && editName.trim()) {
            await updateApp(editingId, editName);
            setEditingId(null);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
    };

    const initiateDelete = (app: Application) => {
        setDeletingApp(app);
        setConfirmName('');
    };

    const confirmDelete = async () => {
        if (deletingApp && confirmName === deletingApp.name) {
            await deleteApp(deletingApp.id);
            setDeletingApp(null);
            setConfirmName('');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Optional: show toast
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Compact Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Applications
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Manage monitors and access tokens.
                            </p>
                        </div>

                        {/* Compact Search & Actions */}
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-64 pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all placeholder:text-gray-400"
                                />
                            </div>
                            <button
                                onClick={() => document.getElementById('create-app-trigger')?.click()}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                <span>New App</span>
                            </button>
                        </div>
                    </div>

                    {/* Ultra-Compact Technical Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">

                        {filteredApps.map(app => (
                            <div
                                key={app.id}
                                className={`group relative bg-white rounded-xl border transition-all duration-300 flex flex-col h-[170px] overflow-hidden ${currentApp?.id === app.id
                                    ? 'border-red-500 shadow-md shadow-red-500/10'
                                    : 'border-gray-200 hover:border-red-300 hover:shadow-md'
                                    }`}
                            >
                                {/* Header Strip */}
                                <div className={`h-1 w-full ${currentApp?.id === app.id ? 'bg-red-500' : 'bg-gray-100 group-hover:bg-red-400 transition-colors'}`} />

                                <div className="p-4 flex-1 flex flex-col relative">
                                    {/* Header Row */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 rounded-md border border-gray-100 group-hover:border-red-100 transition-colors">
                                                <Terminal className={`w-4 h-4 ${currentApp?.id === app.id ? 'text-red-600' : 'text-gray-400 group-hover:text-red-500'}`} />
                                            </div>
                                            <div className="min-w-0">
                                                {editingId === app.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            autoFocus
                                                            value={editName}
                                                            onChange={(e) => setEditName(e.target.value)}
                                                            className="w-24 bg-white border-b-2 border-red-500 px-0 py-0 text-sm font-bold focus:outline-none rounded-none"
                                                        />
                                                        <button onClick={saveEdit} className="text-green-600 hover:bg-green-50 p-0.5 rounded"><Check className="w-3.5 h-3.5" /></button>
                                                        <button onClick={cancelEdit} className="text-gray-400 hover:bg-gray-50 p-0.5 rounded"><X className="w-3.5 h-3.5" /></button>
                                                    </div>
                                                ) : (
                                                    <div className="group/edit">
                                                        <h3
                                                            className="font-bold text-gray-900 text-sm leading-tight cursor-pointer hover:text-red-600 transition-colors flex items-center gap-2"
                                                            onClick={() => startEditing(app)}
                                                            title={app.name}
                                                        >
                                                            <span className="truncate max-w-[120px]">{app.name}</span>
                                                            <Edit2 className="w-3 h-3 text-gray-300 opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                                                        </h3>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <span className={`text-[9px] font-bold px-1 py-px rounded border ${currentApp?.id === app.id
                                                                ? 'bg-red-50 text-red-700 border-red-100'
                                                                : 'bg-gray-50 text-gray-500 border-gray-100'
                                                                }`}>
                                                                {currentApp?.id === app.id ? 'ACTIVE' : 'IDLE'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); initiateDelete(app); }}
                                            className="text-gray-300 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Key Section - One Line Compact */}
                                    <div className="mb-auto">
                                        <div
                                            className="bg-gray-50 border border-gray-200 group-hover:border-red-200/50 rounded-md px-2.5 py-1.5 flex items-center justify-between gap-2 transition-colors h-[34px]"
                                        >
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider shrink-0">Key</span>
                                            <div className="w-px h-3 bg-gray-200 shrink-0" />
                                            <code className="text-[10px] font-mono text-gray-600 truncate flex-1 text-center">
                                                {visibleKeys.has(app.id) ? app.apiKey : '••••••••••••••••'}
                                            </code>
                                            <div className="flex items-center gap-1 shrink-0 border-l border-gray-200 pl-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleKeyVisibility(app.id); }}
                                                    className="text-gray-400 hover:text-gray-700 p-0.5 rounded hover:bg-gray-200/50"
                                                >
                                                    {visibleKeys.has(app.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); app.apiKey && copyToClipboard(app.apiKey); }}
                                                    className="text-gray-400 hover:text-red-500 p-0.5 rounded hover:bg-red-50"
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action - Integrated into bottom */}
                                    <div className="pt-3 border-t border-gray-50 mt-1">
                                        {currentApp?.id === app.id ? (
                                            <button className="w-full py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-default">
                                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                                                LIVE CONTEXT
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => switchApp(app.id)}
                                                className="w-full py-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all group/btn"
                                            >
                                                SWITCH CONTEXT
                                                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal - Clean & Crisp */}
            {deletingApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-5 border border-gray-100">
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="p-3 bg-red-50 rounded-full text-red-600">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Delete Application</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    This action cannot be undone. Type <strong className="text-gray-900">{deletingApp.name}</strong> to confirm.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <input
                                type="text"
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm font-medium text-center"
                                placeholder={deletingApp.name}
                                autoFocus
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setDeletingApp(null)}
                                    className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={confirmName !== deletingApp.name}
                                    className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all"
                                >
                                    Delete App
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
