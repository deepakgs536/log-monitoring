'use client';

import { useState } from 'react';
import { SIMULATION_SCENARIOS } from '@/lib/constants';
import { SimulationScenario } from '@/lib/types';
import { Activity, RotateCcw } from 'lucide-react';

export const SimulationControls = () => {
    const [activeScenario, setActiveScenario] = useState<SimulationScenario>('normal');
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleScenarioChange = async (scenario: SimulationScenario) => {
        setLoading(true);
        setStatus(`Running ${scenario}...`);
        setActiveScenario(scenario);

        try {
            const res = await fetch('/api/simulation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenario }),
            });
            const data = await res.json();
            if (data.success) {
                setStatus(`Simulation: ${scenario}`);
            }
        } catch (error) {
            console.error('Failed to set simulation:', error);
            setStatus('Failed to trigger');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Scenario Injection</h4>
                {status && (
                    <span className="text-[10px] font-mono font-semibold text-red-500 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100 animate-border-pulse">
                        {status}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                {SIMULATION_SCENARIOS.map((scenario) => {
                    const isActive = activeScenario === scenario.id;
                    const Icon = scenario.icon;
                    return (
                        <button
                            key={scenario.id}
                            onClick={() => handleScenarioChange(scenario.id)}
                            disabled={loading}
                            className={`flex flex-col gap-2.5 p-4 rounded-xl border text-left transition-all duration-300 group relative overflow-hidden ${isActive
                                ? 'bg-white/95 backdrop-blur-md border-red-200 shadow-lg shadow-red-100/30 ring-1 ring-red-100 animate-border-pulse'
                                : 'bg-white/60 backdrop-blur-sm border-gray-100 hover:bg-white hover:border-red-100/50 hover:shadow-md hover:shadow-red-50/50 hover:-translate-y-0.5'
                                }`}
                        >
                            {/* Hover glow */}
                            <div className={`absolute inset-0 rounded-xl transition-opacity duration-500 ${isActive ? 'bg-gradient-to-br from-red-50/40 to-rose-50/30 opacity-100' : 'bg-gradient-to-br from-red-50/0 to-rose-50/0 opacity-0 group-hover:opacity-100'}`} />

                            <div className="relative flex items-center justify-between w-full">
                                <div className={`p-1.5 rounded-lg transition-all duration-300 ${isActive ? 'bg-red-50 border border-red-100 shadow-sm shadow-red-100/30' : 'bg-gray-100 border border-gray-200 group-hover:bg-red-50 group-hover:border-red-100'}`}>
                                    <Icon className={`w-3.5 h-3.5 transition-colors duration-300 ${isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-red-400'}`} />
                                </div>
                                {isActive && (
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-[9px] font-bold text-red-500 uppercase">Active</span>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <div className={`text-xs font-bold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {scenario.label}
                                </div>
                                <div className="text-[9px] text-gray-400 line-clamp-1 leading-tight mt-0.5 font-medium">
                                    {scenario.description}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <button
                onClick={() => handleScenarioChange('normal')}
                disabled={activeScenario === 'normal'}
                className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50/50 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-red-50/0 via-red-50/0 to-red-50/0 group-hover:from-red-50/20 group-hover:via-red-50/40 group-hover:to-red-50/20 transition-all duration-500" />
                <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-180deg] transition-transform duration-500 relative" />
                <span className="relative">Reset to Normal</span>
            </button>
        </div>
    );
};
