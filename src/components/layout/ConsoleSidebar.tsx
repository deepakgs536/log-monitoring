'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import { Terminal, User, ChevronLeft, ChevronRight, Settings, Bell } from 'lucide-react';
import { useState } from 'react';
import AppSelector from './AppSelector';

export const ConsoleSidebar = () => {
    const pathname = usePathname();
    const currentPath = pathname || '/';
    const [expanded, setExpanded] = useState(true);

    return (
        <div
            className={`${expanded ? 'w-[220px]' : 'w-[68px]'} bg-white/80 backdrop-blur-xl border-r border-gray-100/80 flex flex-col z-50 transition-all duration-300 ease-in-out relative`}
        >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-red-50/10 pointer-events-none" />

            {/* Header */}
            <div className={`relative px-4 py-4 flex flex-col gap-4 border-b border-gray-50/80`}>
                <div className={`flex items-center ${expanded ? 'justify-between' : 'justify-center'}`}>
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-red-200/40 group-hover:shadow-red-300/60 transition-all group-hover:scale-105 duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
                            <Terminal className="w-5 h-5 relative" />
                        </div>
                        {expanded && (
                            <span className="font-bold text-[15px] text-gray-900 tracking-tight">
                                Log<span className="text-shimmer">Ops</span>
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="hidden md:flex w-6 h-6 items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                    >
                        {expanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="relative flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = currentPath.startsWith(item.path);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`group relative flex items-center ${expanded ? 'gap-3 px-3' : 'justify-center'} py-2.5 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-gradient-to-r from-red-50 to-rose-50/60 text-red-600 shadow-sm shadow-red-100/30 border border-red-100/50'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-white/60 hover:shadow-sm'
                                }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-red-500 to-rose-500 rounded-r-full shadow-sm shadow-red-300/50" />
                            )}
                            <Icon className={`w-[18px] h-[18px] shrink-0 transition-all duration-300 ${isActive ? 'text-red-500' : 'group-hover:text-red-400'}`} />
                            {expanded && (
                                <span className={`text-[13px] font-medium truncate ${isActive ? 'font-semibold' : ''}`}>
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className={`relative px-3 pb-4 space-y-1 border-t border-gray-50/80 pt-3`}>
                <button className={`w-full flex items-center ${expanded ? 'gap-3 px-3' : 'justify-center'} py-2.5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50/50 transition-all duration-300 group`}>
                    <Bell className="w-[18px] h-[18px] shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    {expanded && <span className="text-[13px] font-medium">Notifications</span>}
                </button>
                <button className={`w-full flex items-center ${expanded ? 'gap-3 px-3' : 'justify-center'} py-2.5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50/50 transition-all duration-300 group`}>
                    <Settings className="w-[18px] h-[18px] shrink-0 group-hover:rotate-90 transition-transform duration-500" />
                    {expanded && <span className="text-[13px] font-medium">Settings</span>}
                </button>

                {/* Profile */}
                <div className={`flex items-center ${expanded ? 'gap-3 px-3' : 'justify-center'} py-2.5 rounded-xl hover:bg-red-50/30 cursor-pointer transition-all duration-300 group`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-red-200/40 shrink-0 group-hover:shadow-red-300/50 group-hover:scale-105 transition-all duration-300">
                        DS
                    </div>
                    {expanded && (
                        <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-gray-900 truncate">Deepak S.</p>
                            <p className="text-[10px] text-gray-400 truncate">Admin</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
