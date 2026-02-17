'use client';

import { useConsole } from '@/context/ConsoleContext';
import { TIME_RANGES } from '@/lib/constants';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { ExportMenu } from '@/components/dashboard/ExportMenu';

export function ConsoleNavbar() {
    const { timeRange, setTimeRange, isLive, setIsLive } = useConsole();

    return (
        <header className="h-16 console-glass-strong border-b border-red-100/40 px-6 flex items-center justify-between sticky top-0 z-40 relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-red-50/20 pointer-events-none" />

            {/* Left: Search */}
            <div className="relative flex items-center gap-4">
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-400 transition-colors duration-300" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        className="pl-10 pr-4 py-2 w-72 bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 focus:bg-white/80 hover:border-gray-300 hover:bg-white/70 transition-all duration-300"
                    />
                </div>
            </div>

            {/* Right: Controls */}
            <div className="relative flex items-center gap-3">

                {/* Time Range Selector */}
                <div className="flex items-center bg-white/60 backdrop-blur-sm p-1 rounded-xl border border-gray-200/50 shadow-sm">
                    {TIME_RANGES.filter(r => ['1h', '24h', '7d'].includes(r.value)).map((range) => (
                        <button
                            key={range.value}
                            onClick={() => setTimeRange(range.value as any)}
                            className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 ${timeRange === range.value
                                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md shadow-red-200/50 scale-[1.02]'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-white/80 active:scale-95'
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>

                {/* Live Status Indicator */}
                <button
                    onClick={() => setIsLive(!isLive)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all duration-300 ${isLive
                        ? 'bg-red-50/80 backdrop-blur-sm text-red-600 border-red-200 hover:bg-red-100 shadow-sm shadow-red-100/50 animate-pulse-glow-red'
                        : 'bg-gray-50/80 backdrop-blur-sm text-gray-500 border-gray-200 hover:bg-gray-100'
                        }`}
                >
                    <div className="relative">
                        <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500' : 'bg-gray-400'}`} />
                        {isLive && <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 animate-ping opacity-50" />}
                    </div>
                    {isLive ? 'Live' : 'Paused'}
                </button>

                <div className="h-6 w-px bg-gray-200/60 mx-0.5" />

                {/* Standard Actions */}
                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 hover:shadow-sm hover:scale-105 active:scale-95 group">
                    <Bell className="w-4 h-4 group-hover:animate-pulse" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 hover:shadow-sm hover:scale-105 active:scale-95">
                    <HelpCircle className="w-4 h-4" />
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-rose-500 border-2 border-white shadow-md shadow-red-200/40 flex items-center justify-center text-xs font-bold text-white hover:scale-105 hover:shadow-red-300/50 transition-all duration-300 cursor-pointer">
                    DS
                </div>

            </div>
        </header>
    );
}
