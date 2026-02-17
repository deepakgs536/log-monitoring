'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileJson, Activity, ChevronDown } from 'lucide-react';
import { LogQueryParams } from '@/lib/types';

interface ExportMenuProps {
    logParams?: LogQueryParams; // If provided, enables log export
    showIncidents?: boolean;
    showSummary?: boolean;
}

export const ExportMenu = ({ logParams, showIncidents = true, showSummary = true }: ExportMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExport = async (type: 'logs' | 'incidents' | 'summary') => {
        setLoading(true);
        setIsOpen(false);
        try {
            let url = '';
            let body = undefined;
            let method = 'GET';

            if (type === 'logs') {
                url = '/api/reports/logs';
                method = 'POST';
                body = JSON.stringify(logParams || {});
            } else if (type === 'incidents') {
                url = '/api/reports/incidents';
            } else if (type === 'summary') {
                url = '/api/reports/summary';
            }

            const res = await fetch(url, {
                method,
                headers: body ? { 'Content-Type': 'application/json' } : undefined,
                body
            });

            if (!res.ok) throw new Error('Export failed');

            // Trigger download
            const blob = await res.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;

            // Try to get filename from header or default
            const disposition = res.headers.get('Content-Disposition');
            let filename = `export-${type}.txt`;
            if (disposition && disposition.includes('filename=')) {
                filename = disposition.split('filename=')[1].replace(/"/g, '');
            } else {
                if (type === 'logs') filename = `logs-${Date.now()}.csv`;
                if (type === 'incidents') filename = `incidents-${Date.now()}.json`;
                if (type === 'summary') filename = `summary-${Date.now()}.json`;
            }

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);

        } catch (error) {
            console.error(`Failed to export ${type}:`, error);
            alert(`Failed to export ${type}. Check console for details.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 bg-white hover:bg-slate-50 rounded-xl border border-border text-sm font-bold text-muted hover:text-foreground flex items-center gap-2 transition-all shadow-sm"
            >
                <Download className={`w-4 h-4 ${loading ? 'animate-bounce' : ''}`} />
                <span>Export</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-border shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-1">
                        {logParams && (
                            <button
                                onClick={() => handleExport('logs')}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-sm font-medium text-foreground group transition-colors"
                            >
                                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="leading-none mb-0.5">Export Logs</div>
                                    <div className="text-[10px] text-muted font-normal uppercase tracking-wider">CSV Format</div>
                                </div>
                            </button>
                        )}

                        {(logParams && (showIncidents || showSummary)) && <div className="h-px bg-border/50 mx-4 my-1" />}

                        {showIncidents && (
                            <button
                                onClick={() => handleExport('incidents')}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-sm font-medium text-foreground group transition-colors"
                            >
                                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
                                    <Activity className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="leading-none mb-0.5">Export Incidents</div>
                                    <div className="text-[10px] text-muted font-normal uppercase tracking-wider">JSON Report</div>
                                </div>
                            </button>
                        )}

                        {showSummary && (
                            <button
                                onClick={() => handleExport('summary')}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-sm font-medium text-foreground group transition-colors"
                            >
                                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                                    <FileJson className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="leading-none mb-0.5">System Snapshot</div>
                                    <div className="text-[10px] text-muted font-normal uppercase tracking-wider">Full State JSON</div>
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
