'use client';

import { SimulationControls } from '@/components/dashboard/SimulationControls';
import { Zap, Info } from 'lucide-react';

export default function SimulationPage() {
    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 py-12">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                    <Zap className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Simulation Lab</h1>
                <p className="text-slate-500 max-w-lg mx-auto">
                    Trigger artificial traffic patterns and error scenarios to validate the observability pipeline and alert detection logic.
                </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-12 shadow-soft text-center space-y-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-100 text-amber-700 text-sm font-medium">
                    <Info className="w-4 h-4" />
                    Simulations will affect live dashboard metrics
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-2">Traffic Spike</h3>
                        <p className="text-sm text-slate-500">Inject 500+ requests/sec across all services to test throughput handling.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-2">Error Burst</h3>
                        <p className="text-sm text-slate-500">Trigger 502/503 cascades in downstream services to test circuit breakers.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-2">Auto Recovery</h3>
                        <p className="text-sm text-slate-500">Send "Stable" pulses to systems to simulate self-healing or manual patches.</p>
                    </div>
                </div>

                <div className="relative pt-12 flex justify-center">
                    <div className="absolute inset-0 bg-blue-50/50 rounded-3xl -m-4 blur-3xl opacity-50" />
                    <SimulationControls />
                </div>
            </div>
        </div>
    );
}
