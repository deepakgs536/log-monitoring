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
                            href="/applications"
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Manage Applications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
