'use client';

import { motion } from 'framer-motion';
import { Settings, User, Database, Shield, Sparkles } from 'lucide-react';

export default function SettingsPage() {
    const sectionVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: (i: number) => ({
            opacity: 1, y: 0,
            transition: { delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
        })
    };

    return (
        <div className="p-6 lg:p-8 space-y-8 max-w-4xl">
            <motion.header
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3.5"
            >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200/50">
                    <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900">Platform Settings</h1>
                    <p className="text-gray-400 text-sm mt-0.5 font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-red-400" />
                        Configure alerts, profiles, and system preferences
                    </p>
                </div>
            </motion.header>

            <motion.section
                custom={0} initial="hidden" animate="visible" variants={sectionVariants}
                className="space-y-4"
            >
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full bg-gradient-to-b from-red-500 to-rose-400" />
                    <User className="w-3.5 h-3.5 text-red-400" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">User Profile</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-premium flex items-center gap-6 hover:shadow-premium-hover transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/40 via-rose-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-red-200/40">
                        DS
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-gray-900">Admin User</h4>
                        <p className="text-gray-400 text-sm font-medium">admin@logops.internal</p>
                    </div>
                    <button className="ml-auto px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-300">
                        Edit Profile
                    </button>
                </div>
            </motion.section>

            <motion.section
                custom={1} initial="hidden" animate="visible" variants={sectionVariants}
                className="space-y-4"
            >
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full bg-gradient-to-b from-red-500 to-rose-400" />
                    <Database className="w-3.5 h-3.5 text-red-400" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">System Configuration</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-premium space-y-5 hover:shadow-premium-hover transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/40 via-rose-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-gray-900">Data Retention</h4>
                            <p className="text-gray-400 text-xs mt-0.5 font-medium">How long to keep raw telemetry logs.</p>
                        </div>
                        <select className="bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all cursor-pointer hover:bg-white appearance-none">
                            <option>7 Days</option>
                            <option>30 Days</option>
                            <option>90 Days</option>
                        </select>
                    </div>
                    <div className="border-t border-gray-50" />
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-gray-900">Alert Sensitivity</h4>
                            <p className="text-gray-400 text-xs mt-0.5 font-medium">Threshold for anomaly detection.</p>
                        </div>
                        <select className="bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all cursor-pointer hover:bg-white appearance-none">
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                </div>
            </motion.section>

            <motion.section
                custom={2} initial="hidden" animate="visible" variants={sectionVariants}
                className="space-y-4"
            >
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full bg-gradient-to-b from-red-500 to-rose-400" />
                    <Shield className="w-3.5 h-3.5 text-red-400" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Security</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-premium hover:shadow-premium-hover transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/40 via-rose-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-gray-900">Two-Factor Authentication</h4>
                            <p className="text-gray-400 text-xs mt-0.5 font-medium">Add an extra layer of security to your account.</p>
                        </div>
                        <button className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl text-sm font-bold hover:from-red-600 hover:to-rose-600 hover:shadow-lg hover:shadow-red-200/40 transition-all duration-300">
                            Enable
                        </button>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
