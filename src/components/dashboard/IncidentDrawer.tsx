import { Alert } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, TrendingDown, ArrowRight, ShieldCheck, Microscope, Activity, Zap, Clock, ExternalLink } from 'lucide-react';

interface IncidentDrawerProps {
    alert: Alert | null;
    onClose: () => void;
}

export const IncidentDrawer = ({ alert, onClose }: IncidentDrawerProps) => {
    if (!alert) return null;

    const isCritical = alert.severity === 'critical';
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
                        className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                        className="fixed top-0 right-0 h-full w-full max-w-[440px] bg-white border-l border-gray-100 shadow-2xl z-50 overflow-y-auto"
                    >
                        {/* Red Top Accent */}
                        <div className={`h-1 ${isCritical ? 'bg-gradient-to-r from-red-600 via-red-500 to-rose-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'}`} />

                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-100">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 rounded-2xl ${isCritical
                                        ? 'bg-red-50 text-red-500'
                                        : 'bg-amber-50 text-amber-500'
                                        }`}>
                                        {isCritical ? <AlertTriangle className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h2 className="text-[15px] font-bold text-gray-900 tracking-tight">
                                            Detection Analysis
                                        </h2>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md ${isCritical
                                                ? 'bg-red-50 text-red-500'
                                                : 'bg-amber-50 text-amber-500'
                                                }`}>
                                                {alert.type.replace('_', ' ')}
                                            </span>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(alert.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">

                            {/* AI Verdict */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Microscope className="w-4 h-4 text-red-400" />
                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">AI Verdict</h3>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                                    <p className="text-[13px] text-gray-700 font-medium leading-relaxed">
                                        {alert.metadata?.rationale || alert.message}
                                    </p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${(alert.confidence || 0) > 90
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                                : (alert.confidence || 0) > 70
                                                    ? 'bg-amber-50 border-amber-200 text-amber-600'
                                                    : 'bg-gray-50 border-gray-200 text-gray-600'
                                            }`}>
                                            {alert.confidence}% confidence
                                        </div>
                                        <span className="text-[10px] text-gray-400">Statistical deviation analysis</span>
                                    </div>
                                </div>
                            </section>

                            {/* Evidence Data */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-red-400" />
                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Evidence Data</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                                        <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide mb-1.5">Observed</p>
                                        <p className="text-2xl font-bold text-gray-900 tracking-tight">
                                            {alert.type === 'spike' ? fmt(alert.metadata?.currentRate) :
                                                alert.type === 'error_burst' ? fmt(alert.metadata?.errorRate) :
                                                    fmt(alert.metadata?.count)}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            {alert.type === 'spike' ? 'LPS' : alert.type === 'error_burst' ? '% error rate' : 'events'}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                                        <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide mb-1.5">Baseline</p>
                                        <p className="text-2xl font-bold text-gray-400 tracking-tight">
                                            {alert.type === 'spike' ? fmt(alert.metadata?.averageRate) :
                                                alert.type === 'error_burst' ? '0.0' :
                                                    '--'}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">30s average</p>
                                    </div>
                                </div>

                                {/* Trigger Rule - Full Width */}
                                <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide mb-1">Trigger Rule</p>
                                        <p className="text-sm font-semibold text-gray-900 font-mono">
                                            {alert.type === 'spike' ? `> ${alert.metadata?.threshold} baseline deviation` :
                                                alert.type === 'error_burst' ? `> ${alert.metadata?.threshold} error density` :
                                                    `> ${alert.metadata?.threshold} repetitions`}
                                        </p>
                                    </div>
                                    <div className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${isCritical
                                        ? 'bg-red-50 text-red-500 border-red-200'
                                        : 'bg-amber-50 text-amber-500 border-amber-200'
                                        }`}>
                                        Triggered
                                    </div>
                                </div>
                            </section>

                            {/* System Impact */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-red-400" />
                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">System Impact</h3>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500' : 'bg-amber-400'}`} />
                                            <span className="text-xs font-medium text-gray-600">Affected Service</span>
                                        </div>
                                        <span className="text-xs font-bold text-red-500">{alert.service}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-600">Severity</span>
                                        <span className={`text-xs font-bold uppercase ${isCritical ? 'text-red-500' : 'text-amber-500'}`}>
                                            {alert.severity}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-600">Correlation ID</span>
                                        <span className="text-[10px] font-mono text-gray-400">
                                            {alert.id}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Actions */}
                            <div className="pt-4 space-y-3 mt-auto">
                                <button className="w-full py-3.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-lg shadow-red-200/50 transition-all flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-red-200/60">
                                    <Zap className="w-4 h-4" />
                                    Initiate Investigation
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold transition-all border border-gray-100"
                                >
                                    Dismiss
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
