'use client';

import { useState, useEffect, useCallback } from 'react';
import { Log, LogLevel, TimeRange } from '@/lib/types';
import { LogFeedTable } from '@/components/dashboard/LogFeedTable';
import { Search, Filter, RefreshCw, Clock, AlertTriangle, Box, Sparkles } from 'lucide-react';
import { THEME } from '@/components/dashboard/constants';
import { ExportMenu } from '@/components/dashboard/ExportMenu';
import { motion } from 'framer-motion';

export default function LogsPage() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [search, setSearch] = useState('');
    const [service, setService] = useState<string>('all');
    const [level, setLevel] = useState<LogLevel | 'all'>('all');
    const [timeRange, setTimeRange] = useState<string>('1h');

    const getLogParams = useCallback(() => {
        const now = Date.now();
        let startTime = now - 60 * 60 * 1000; // default 1h

        if (timeRange === '15m') startTime = now - 15 * 60 * 1000;
        if (timeRange === '1h') startTime = now - 60 * 60 * 1000;
        if (timeRange === '6h') startTime = now - 6 * 60 * 60 * 1000;
        if (timeRange === '24h') startTime = now - 24 * 60 * 60 * 1000;
        if (timeRange === '7d') startTime = now - 7 * 24 * 60 * 60 * 1000;

        return {
            search: search || undefined,
            service: service === 'all' ? undefined : service,
            level: level === 'all' ? undefined : level,
            startTime,
            limit: 10000
        };
    }, [search, service, level, timeRange]);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const params = getLogParams();
            params.limit = 200;

            const res = await fetch('/api/logs/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });

            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs);
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setLoading(false);
        }
    }, [getLogParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLogs();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchLogs]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="p-6 lg:p-8 space-y-6 min-h-screen"
        >
            <motion.header
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200/50">
                        <Search className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-gray-900">Log Explorer</h1>
                        <p className="text-gray-400 text-sm mt-0.5 font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-red-400" />
                            Deep dive into raw telemetry streams
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ExportMenu logParams={getLogParams()} showIncidents={false} showSummary={false} />
                    <button
                        onClick={fetchLogs}
                        className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </motion.header>

            {/* Filter Bar */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl border border-gray-100 shadow-premium p-4 flex flex-col lg:flex-row gap-4 hover:shadow-premium-hover transition-all duration-500"
            >
                {/* Search */}
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-400 transition-colors" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search logs (service, message, trace_id)..."
                        className="w-full bg-gray-50/60 border border-transparent focus:bg-white focus:border-red-200 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-red-100 transition-all duration-300 placeholder:text-gray-400"
                    />
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0">
                    {/* Level Filter */}
                    <div className="relative min-w-[140px]">
                        <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value as any)}
                            className="w-full bg-gray-50/60 border border-transparent rounded-xl py-2.5 pl-9 pr-8 text-xs font-bold uppercase tracking-wider appearance-none cursor-pointer hover:bg-gray-100 transition-all focus:border-red-200 focus:ring-2 focus:ring-red-100 text-gray-600"
                        >
                            <option value="all">All Levels</option>
                            <option value="info">Info</option>
                            <option value="warn">Warn</option>
                            <option value="error">Error</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="text-[9px] text-gray-400">▼</span>
                        </div>
                    </div>

                    {/* Service Filter */}
                    <div className="relative min-w-[160px]">
                        <Box className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        <select
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            className="w-full bg-gray-50/60 border border-transparent rounded-xl py-2.5 pl-9 pr-8 text-xs font-bold uppercase tracking-wider appearance-none cursor-pointer hover:bg-gray-100 transition-all focus:border-red-200 focus:ring-2 focus:ring-red-100 text-gray-600"
                        >
                            <option value="all">All Services</option>
                            <option value="auth-service">auth-service</option>
                            <option value="payment-api">payment-api</option>
                            <option value="user-worker">user-worker</option>
                            <option value="analytics-engine">analytics-engine</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="text-[9px] text-gray-400">▼</span>
                        </div>
                    </div>

                    {/* Time Range */}
                    <div className="relative min-w-[120px]">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="w-full bg-gray-50/60 border border-transparent rounded-xl py-2.5 pl-9 pr-8 text-xs font-bold uppercase tracking-wider appearance-none cursor-pointer hover:bg-gray-100 transition-all focus:border-red-200 focus:ring-2 focus:ring-red-100 text-gray-600"
                        >
                            <option value="15m">15m</option>
                            <option value="1h">1h</option>
                            <option value="6h">6h</option>
                            <option value="24h">24h</option>
                            <option value="7d">7d</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="text-[9px] text-gray-400">▼</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Results */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl border border-gray-100 shadow-premium overflow-hidden min-h-[600px] flex flex-col hover:shadow-premium-hover transition-all duration-500 group relative"
            >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/40 via-rose-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className={`w-2 h-2 rounded-full ${loading ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                        </div>
                        <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest">
                            Search Results <span className="text-gray-400 ml-2">({logs.length})</span>
                        </h2>
                    </div>
                </div>

                {logs.length > 0 ? (
                    <div className="flex-1 overflow-x-auto custom-scrollbar p-2">
                        <LogFeedTable logs={logs} alerts={[]} />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12">
                        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                            <Search className="w-7 h-7 text-red-300" />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-400">No matching logs found</p>
                        <p className="text-xs mt-2 text-gray-400">Try adjusting your filters</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
