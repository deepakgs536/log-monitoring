'use client';

import { useState } from 'react';

export const SimulationControls = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const triggerScenario = async (scenario: string) => {
        setLoading(true);
        setStatus(`Running ${scenario}...`);
        try {
            const res = await fetch('/api/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenario })
            });
            const data = await res.json();
            if (data.success) {
                setStatus(`Success: ${scenario} triggered`);
                setTimeout(() => setStatus(null), 3000);
            }
        } catch (e) {
            setStatus('Failed to trigger');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2 rounded-2xl shadow-2xl flex items-center gap-2">
                <div className="px-4 border-r border-slate-800">
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Demo Console</p>
                    <p className={`text-[10px] font-medium transition-colors ${status ? 'text-amber-400' : 'text-slate-400'}`}>
                        {status || 'Ready for simulation'}
                    </p>
                </div>

                <div className="flex items-center gap-1.5 p-1">
                    <button
                        onClick={() => triggerScenario('spike')}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        🚀 Spike
                    </button>
                    <button
                        onClick={() => triggerScenario('burst')}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl text-[10px] font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        💥 Burst
                    </button>
                    <button
                        onClick={() => triggerScenario('recovery')}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        🛡️ Recover
                    </button>
                </div>
            </div>
        </div>
    );
};
