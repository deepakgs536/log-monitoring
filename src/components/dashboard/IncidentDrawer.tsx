import { Alert } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, AlertTriangle, TrendingDown, ArrowRight, ShieldCheck, Microscope } from 'lucide-react';
import { THEME } from './constants';

interface IncidentDrawerProps {
    alert: Alert | null;
    onClose: () => void;
}

export const IncidentDrawer = ({ alert, onClose }: IncidentDrawerProps) => {
    if (!alert) return null;

    const isCritical = alert.severity === 'critical';

    // Formatting helper
    const fmt = (num: number | undefined, suffix = '') => num !== undefined ? `${num}${suffix}` : '--';

    return (
        <AnimatePresence>
            {alert && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className={`p-6 border-b flex items-start justify-between bg-surface/50 ${isCritical ? 'border-error/20' : 'border-warning/20'
                            }`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${isCritical ? 'bg-error text-white shadow-glow-error' : 'bg-warning text-warning-foreground shadow-glow-warning'
                                    }`}>
                                    {isCritical ? <AlertTriangle className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-foreground uppercase tracking-widest leading-none mb-1">
                                        Detection Analysis
                                    </h2>
                                    <p className={`text-xs font-bold uppercase tracking-wider ${isCritical ? 'text-error' : 'text-warning'
                                        }`}>
                                        {alert.type.replace('_', ' ')}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-elevated rounded-full text-muted hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-8">

                            {/* Verdict Section */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Microscope className="w-4 h-4 text-accent-cyan" />
                                    <h3 className="text-xs font-bold text-muted uppercase tracking-widest">AI Verdict</h3>
                                </div>
                                <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
                                    <p className="text-sm text-foreground font-medium leading-relaxed">
                                        {alert.metadata?.rationale || alert.message}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="px-2 py-0.5 rounded bg-accent-purple/10 text-accent-purple font-bold border border-accent-purple/20">
                                            Confidence: {alert.confidence}%
                                        </span>
                                        <span className="text-muted">– Calculation based on statistical deviation.</span>
                                    </div>
                                </div>
                            </section>

                            {/* Metrics Grid */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-accent-cyan" />
                                    <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Evidence Data</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-surface rounded-xl border border-border">
                                        <p className="text-[10px] text-muted uppercase font-bold mb-1">Observed Value</p>
                                        <p className="text-xl font-black text-foreground">
                                            {alert.type === 'spike' ? fmt(alert.metadata?.currentRate, ' LPS') :
                                                alert.type === 'error_burst' ? fmt(alert.metadata?.errorRate, '%') :
                                                    fmt(alert.metadata?.count)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-surface rounded-xl border border-border">
                                        <p className="text-[10px] text-muted uppercase font-bold mb-1">Baseline (30s)</p>
                                        <p className="text-xl font-black text-secondary">
                                            {alert.type === 'spike' ? fmt(alert.metadata?.averageRate, ' LPS') :
                                                alert.type === 'error_burst' ? '0.0%' :
                                                    '--'}
                                        </p>
                                    </div>
                                    <div className="col-span-2 p-3 bg-surface rounded-xl border border-border flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-muted uppercase font-bold mb-1">Trigger Rule</p>
                                            <p className="text-sm font-bold text-foreground font-mono">
                                                {alert.type === 'spike' ? `> ${alert.metadata?.threshold} baseline deviation` :
                                                    alert.type === 'error_burst' ? `> ${alert.metadata?.threshold} error density` :
                                                        `> ${alert.metadata?.threshold} repetitions`}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${isCritical ? 'bg-error/10 text-error border-error/20' : 'bg-warning/10 text-warning border-warning/20'
                                            }`}>
                                            Triggered
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Impact */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-accent-cyan" />
                                    <h3 className="text-xs font-bold text-muted uppercase tracking-widest">System Impact</h3>
                                </div>
                                <div className="p-4 rounded-2xl bg-elevated border border-border">
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent-pink mt-1.5" />
                                        <div>
                                            <p className="text-xs font-bold text-foreground">Service Affected: <span className="text-accent-pink">{alert.service}</span></p>
                                            <p className="text-[10px] text-muted mt-1">
                                                Correlation ID: {alert.id.split('-')[1]}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Actions */}
                            <div className="pt-6 border-t border-border mt-auto">
                                <button className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2">
                                    Initiate Investigation <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
