'use client';

import { useState } from 'react';
import { SIMULATION_SCENARIOS } from '@/lib/constants';
import { SimulationScenario } from '@/lib/types';
import { Play, TrendingUp, AlertTriangle, ShieldAlert, Activity } from 'lucide-react';

export const SimulationControls = () => {
    const [activeScenario, setActiveScenario] = useState<SimulationScenario>('normal');
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleScenarioChange = async (scenario: SimulationScenario) => {
        setLoading(true);
        setStatus(`Running ${scenario}...`);
        // Optimistic update
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
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Scenario Injection</h4>
                {status && (
                    <span className="text-[10px] font-mono text-accent-cyan animate-pulse">{status}</span>
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
                            className={`flex flex-col gap-2 p-3 rounded-xl border text-left transition-all duration-200 ${isActive
                                    ? `bg-${scenario.color}/10 border-${scenario.color} shadow-soft`
                                    : 'bg-card border-border hover:bg-surface hover:border-slate-700'
                                }`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <Icon className={`w-4 h-4 ${isActive ? `text-${scenario.color}` : 'text-muted'}`} />
                                {isActive && <div className={`w-1.5 h-1.5 rounded-full bg-${scenario.color} animate-pulse`} />}
                            </div>
                            <div>
                                <div className={`text-xs font-bold ${isActive ? 'text-foreground' : 'text-secondary'}`}>
                                    {scenario.label}
                                </div>
                                <div className="text-[9px] text-muted line-clamp-1 leading-tight mt-0.5">
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
                className="w-full py-2 flex items-center justify-center gap-2 rounded-lg border border-border text-[10px] font-bold uppercase tracking-widest text-muted hover:text-foreground hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Activity className="w-3 h-3" />
                Reset to Normal
            </button>
        </div>
    );
};
