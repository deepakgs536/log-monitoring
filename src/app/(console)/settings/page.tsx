'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, User, Database, Shield, Sparkles, X, Mail, Smartphone, KeyRound, Lock, Check } from 'lucide-react';

export default function SettingsPage() {
    const [activeModal, setActiveModal] = useState<'profile' | '2fa' | null>(null);

    const sectionVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: (i: number) => ({
            opacity: 1, y: 0,
            transition: { delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
        })
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 10 },
        visible: {
            opacity: 1, scale: 1, y: 0,
            transition: { type: 'spring' as const, damping: 25, stiffness: 300 }
        },
        exit: {
            opacity: 0, scale: 0.95, y: 10,
            transition: { duration: 0.2 }
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.3 } }
    };

    return (
        <div className="p-6 lg:p-8 space-y-8 max-w-4xl relative min-h-[calc(100vh-4rem)]">
            <motion.header
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3.5"
            >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200/50 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                    <Settings className="w-6 h-6 text-white relative z-10" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Platform Settings</h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-red-500" />
                        Configure alerts, profiles, and system preferences
                    </p>
                </div>
            </motion.header>

            <motion.section
                custom={0} initial="hidden" animate="visible" variants={sectionVariants}
                className="space-y-4"
            >
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-red-500 to-rose-400" />
                    <User className="w-4 h-4 text-red-500" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">User Profile</h3>
                </div>
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center gap-6 hover:shadow-[0_8px_30px_rgb(239,68,68,0.1)] transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-red-200/50">
                            DS
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                    </div>
                    <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-xl text-gray-900 tracking-tight">Admin User</h4>
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                            <Mail className="w-4 h-4" />
                            admin@logops.internal
                        </div>
                    </div>
                    <button
                        onClick={() => setActiveModal('profile')}
                        className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 shadow-sm transition-all duration-300 active:scale-95"
                    >
                        Edit Profile
                    </button>
                </div>
            </motion.section>

            <motion.section
                custom={1} initial="hidden" animate="visible" variants={sectionVariants}
                className="space-y-4"
            >
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-red-500 to-rose-400" />
                    <Database className="w-4 h-4 text-red-500" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">System Configuration</h3>
                </div>
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6 hover:shadow-[0_8px_30px_rgb(239,68,68,0.1)] transition-all duration-500 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-bold text-gray-900 text-lg tracking-tight">Data Retention</h4>
                            <p className="text-gray-500 text-sm mt-1 font-medium">Configure how long to keep raw telemetry logs in active storage.</p>
                        </div>
                        <div className="relative">
                            <select className="pl-4 pr-10 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:border-red-400 focus:ring-4 focus:ring-red-100/50 transition-all cursor-pointer hover:bg-white appearance-none outline-none w-full sm:w-48 shadow-sm">
                                <option>7 Days</option>
                                <option>30 Days</option>
                                <option>90 Days</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 rotate-45" />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-bold text-gray-900 text-lg tracking-tight">Alert Sensitivity</h4>
                            <p className="text-gray-500 text-sm mt-1 font-medium">Adjust the threshold required to trigger anomaly detection alerts.</p>
                        </div>
                        <div className="relative">
                            <select defaultValue="Medium (Balanced)" className="pl-4 pr-10 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:border-red-400 focus:ring-4 focus:ring-red-100/50 transition-all cursor-pointer hover:bg-white appearance-none outline-none w-full sm:w-48 shadow-sm">
                                <option>High (Aggressive)</option>
                                <option>Medium (Balanced)</option>
                                <option>Low (Minimal)</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 rotate-45" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            <motion.section
                custom={2} initial="hidden" animate="visible" variants={sectionVariants}
                className="space-y-4"
            >
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-red-500 to-rose-400" />
                    <Shield className="w-4 h-4 text-red-500" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Security</h3>
                </div>
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(239,68,68,0.1)] transition-all duration-500 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                                <KeyRound className="w-6 h-6 text-slate-400 group-hover:text-red-500 transition-colors" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg tracking-tight">Two-Factor Authentication</h4>
                                <p className="text-gray-500 text-sm mt-1 font-medium">Add an extra layer of security to your account to prevent unauthorized access.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveModal('2fa')}
                            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl text-sm font-bold hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-200/50 hover:shadow-red-300/60 transition-all duration-300 active:scale-95"
                        >
                            Enable 2FA
                        </button>
                    </div>
                </div>
            </motion.section>

            {/* Modals */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            variants={overlayVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                            onClick={() => setActiveModal(null)}
                        />

                        <motion.div
                            variants={modalVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-100/80 bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${activeModal === 'profile' ? 'bg-blue-50 text-blue-500' : 'bg-rose-50 text-rose-500'}`}>
                                        {activeModal === 'profile' ? <User className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                                    </div>
                                    <h2 className="text-xl font-black text-gray-900 tracking-tight">
                                        {activeModal === 'profile' ? 'Edit Profile' : 'Secure Your Account'}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setActiveModal(null)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {activeModal === 'profile' ? (
                                    <>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        defaultValue="Admin User"
                                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 transition-all shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        defaultValue="admin@logops.internal"
                                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 transition-all shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-4 flex gap-3">
                                            <button
                                                onClick={() => setActiveModal(null)}
                                                className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => setActiveModal(null)}
                                                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center space-y-4 py-4">
                                            <div className="flex justify-center">
                                                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center relative">
                                                    <Smartphone className="w-10 h-10 text-rose-500 relative z-10" />
                                                    <div className="absolute inset-0 bg-red-400 blur-xl opacity-20" />
                                                </div>
                                            </div>
                                            <div className="space-y-2 px-4">
                                                <h3 className="text-lg font-bold text-gray-900">Authenticator App</h3>
                                                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                                    Use an app like Google Authenticator or 1Password to scan a QR code and generate secure login tokens.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-4">
                                            <Lock className="w-5 h-5 text-gray-400 shrink-0" />
                                            <p className="text-xs font-semibold text-gray-500">
                                                Setting up 2FA will require you to enter a code from your device every time you log in to this workspace.
                                            </p>
                                        </div>
                                        <div className="pt-2 flex gap-3">
                                            <button
                                                onClick={() => setActiveModal(null)}
                                                className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                                            >
                                                Maybe Later
                                            </button>
                                            <button
                                                onClick={() => setActiveModal(null)}
                                                className="flex-[1.5] py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg shadow-red-200/50 active:scale-95 transition-all"
                                            >
                                                Begin Setup
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
