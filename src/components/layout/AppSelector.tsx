'use client';
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { Application } from '../../lib/types';
import { ChevronDown, Plus, Check, Box, Copy, Settings } from 'lucide-react';

export default function AppSelector() {
    const { apps, currentApp, switchApp, createApp } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newAppName, setNewAppName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdApp, setCreatedApp] = useState<Application | null>(null);
    const [copied, setCopied] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAppName.trim()) return;

        setIsSubmitting(true);
        const app = await createApp(newAppName);
        setIsSubmitting(false);
        setNewAppName('');

        if (app) {
            setCreatedApp(app);
            // Don't close modal here, wait for user to copy key
            setIsOpen(false); // Close dropdown though
        } else {
            setIsCreateOpen(false);
            setIsOpen(false);
        }
    };

    if (!currentApp) return (
        <div className="h-10 w-full bg-gray-100/50 animate-pulse rounded-xl border border-gray-200/50"></div>
    );

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white border-b border-b-[2px] border-red-300 hover:border-red-500 transition-all duration-200 group"
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 group-hover:from-red-50 group-hover:to-rose-100 group-hover:text-red-500 transition-colors">
                        <Box className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate group-hover:text-gray-900">{currentApp.name}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-xl shadow-gray-200/50 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                    {/* Active App Info / API Key */}
                    {currentApp.apiKey && (
                        <div className="bg-gray-50/80 p-3 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">API Key</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (currentApp.apiKey) {
                                            navigator.clipboard.writeText(currentApp.apiKey);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }
                                    }}
                                    className="text-xs text-red-500 font-medium hover:text-red-600 flex items-center gap-1"
                                >
                                    {copied ? 'Copied!' : 'Copy'} <Copy className="w-3 h-3" />
                                </button>
                            </div>
                            <code className="block w-full text-[11px] font-mono text-gray-600 truncate bg-white border border-gray-200 rounded px-1.5 py-1">
                                {currentApp.apiKey}
                            </code>
                        </div>
                    )}

                    <div className="p-1.5 max-h-[240px] overflow-y-auto custom-scrollbar">
                        {apps.map((app) => (
                            <button
                                key={app.id}
                                onClick={() => {
                                    switchApp(app.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${currentApp.id === app.id
                                    ? 'bg-red-50 text-red-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <span className="truncate">{app.name}</span>
                                {currentApp.id === app.id && <Check className="w-3.5 h-3.5 text-red-500" />}
                            </button>
                        ))}
                    </div>
                    <div className="p-1.5 border-t border-gray-50 bg-gray-50/50 space-y-1">
                        <Link
                            href="/console/applications"
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Manage Applications
                        </Link>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Create New App
                        </button>
                    </div>
                </div>
            )}

            {/* Create App Modal */}
            {isCreateOpen && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div
                        ref={modalRef}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100"
                    >
                        {createdApp ? (
                            // Success View with API Key
                            <>
                                <div className="px-6 py-5 border-b border-gray-100 bg-green-50/50">
                                    <div className="flex items-center gap-2 text-green-600 mb-1">
                                        <div className="p-1 bg-green-100 rounded-full"><Check className="w-4 h-4" /></div>
                                        <h3 className="text-lg font-bold text-gray-900">Application Created!</h3>
                                    </div>
                                    <p className="text-sm text-gray-500">Your application is ready. Use this API Key to send logs.</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">API Key</label>
                                        <div className="relative">
                                            <code className="block w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-mono text-gray-800 break-all select-all">
                                                {createdApp.apiKey}
                                            </code>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(createdApp?.apiKey || '');
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 2000);
                                                }}
                                                className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-md transition-all"
                                                title="Copy to clipboard"
                                            >
                                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-red-500 mt-2">
                                            Save this key securely! You won't be able to see it again.
                                        </p>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 flex items-center justify-end">
                                    <button
                                        onClick={() => {
                                            setCreatedApp(null);
                                            setIsCreateOpen(false);
                                        }}
                                        className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-lg shadow-green-500/20 transition-all"
                                    >
                                        Done
                                    </button>
                                </div>
                            </>
                        ) : (
                            // Create Form
                            <>
                                <div className="px-6 py-5 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900">Create Application</h3>
                                    <p className="text-sm text-gray-500 mt-1">Add a new application to monitor logs separately.</p>
                                </div>

                                <form onSubmit={handleCreate}>
                                    <div className="p-6 space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="appName" className="text-sm font-medium text-gray-700">Application Name</label>
                                            <input
                                                id="appName"
                                                type="text"
                                                value={newAppName}
                                                onChange={(e) => setNewAppName(e.target.value)}
                                                placeholder="e.g. Payment Service"
                                                className="mt-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsCreateOpen(false)}
                                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!newAppName.trim() || isSubmitting}
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-red-500/30 transition-all"
                                        >
                                            {isSubmitting ? 'Creating...' : 'Create App'}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
