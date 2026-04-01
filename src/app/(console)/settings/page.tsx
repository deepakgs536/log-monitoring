'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings, User, Database, Shield, Bell, Palette,
    Sparkles, X, Mail, Smartphone, KeyRound, Lock,
    Check, Sun, Moon, Monitor, Eye, Trash2,
    EyeOff, AlertTriangle, Zap, Globe, Clock, Activity,
    CheckCircle2, XCircle, Laptop, MapPin, LogOut, RefreshCw
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = 'profile' | 'system' | 'security' | 'notifications' | 'appearance';
type Modal = 'profile' | '2fa' | '2fa-verify' | 'password' | 'sessions' | 'purge' | null;

interface Profile { name: string; email: string; }
interface SystemSettings { retention: string; sensitivity: string; timezone: string; }
interface Notifs { email: boolean; push: boolean; anomaly: boolean; weekly: boolean; security: boolean; }
interface Session { id: string; device: string; location: string; lastActive: string; current: boolean; }
interface ToastState { message: string; type: 'success' | 'error'; }

// ─── Constants ───────────────────────────────────────────────────────────────

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'system', label: 'System', icon: <Database className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
];

const MOCK_SESSIONS: Session[] = [
    { id: '1', device: 'Chrome · Windows 11', location: 'Mumbai, IN', lastActive: 'Now', current: true },
    { id: '2', device: 'Safari · iPhone 15', location: 'Delhi, IN', lastActive: '3 hours ago', current: false },
    { id: '3', device: 'Firefox · macOS', location: 'New York, US', lastActive: '2 days ago', current: false },
];

function getInitials(name: string) {
    return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() ?? '').join('').slice(0, 2) || 'U';
}

function getPasswordStrength(pw: string): { label: string; color: string; width: string; score: number } {
    if (!pw) return { label: '', color: '', width: '0%', score: 0 };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '25%', score };
    if (score <= 2) return { label: 'Fair', color: 'bg-orange-400', width: '50%', score };
    if (score <= 3) return { label: 'Good', color: 'bg-yellow-400', width: '70%', score };
    return { label: 'Strong', color: 'bg-green-500', width: '100%', score };
}

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } }),
};

const modalAnim = {
    hidden: { opacity: 0, scale: 0.93, y: 24 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, damping: 26, stiffness: 320 } },
    exit: { opacity: 0, scale: 0.95, y: 16, transition: { duration: 0.18 } },
};

// ─── Shared Components ────────────────────────────────────────────────────────

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${on ? 'bg-gradient-to-r from-red-500 to-rose-500 focus:ring-red-400' : 'bg-gray-200 focus:ring-gray-300'}`}
        >
            <motion.div
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md ${on ? 'left-6' : 'left-0.5'}`}
            />
        </button>
    );
}

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden group hover:shadow-[0_8px_40px_rgba(239,68,68,0.12)] transition-all duration-500 ${className}`}>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-300/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {children}
        </div>
    );
}

function SettingRow({ label, description, children, icon }: { label: string; description?: string; children: React.ReactNode; icon?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-6 py-5 px-6">
            <div className="flex items-center gap-4 min-w-0">
                {icon && <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 text-gray-400 group-hover:text-red-400 transition-colors">{icon}</div>}
                <div>
                    <p className="font-semibold text-gray-900 text-sm">{label}</p>
                    {description && <p className="text-xs text-gray-400 mt-0.5 font-medium">{description}</p>}
                </div>
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    );
}

function StyledSelect({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="pl-4 pr-9 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:border-red-400 focus:ring-4 focus:ring-red-100/50 appearance-none outline-none cursor-pointer hover:bg-white transition-all"
            >
                {children}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-2 h-2 border-r-2 border-b-2 border-gray-400 rotate-45" />
        </div>
    );
}

function InputField({ label, type = 'text', value, onChange, placeholder, icon, rightSlot, error }: {
    label: string; type?: string; value: string; onChange: (v: string) => void;
    placeholder?: string; icon?: React.ReactNode; rightSlot?: React.ReactNode; error?: string;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">{label}</label>
            <div className="relative">
                {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full ${icon ? 'pl-10' : 'pl-4'} ${rightSlot ? 'pr-11' : 'pr-4'} py-3 bg-gray-50/60 border rounded-xl text-gray-900 font-semibold text-sm focus:outline-none focus:ring-4 transition-all ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100/50' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-100/50'}`}
                />
                {rightSlot && <span className="absolute right-4 top-1/2 -translate-y-1/2">{rightSlot}</span>}
            </div>
            {error && <p className="text-xs text-red-500 font-medium ml-1">{error}</p>}
        </div>
    );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold cursor-pointer select-none
                ${toast.type === 'success'
                    ? 'bg-white border-green-100 text-gray-800 shadow-green-100/60'
                    : 'bg-white border-red-100 text-gray-800 shadow-red-100/60'}`}
            onClick={onDismiss}
        >
            {toast.type === 'success'
                ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                : <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
            {toast.message}
        </motion.div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
    // ── Tab & Modal ──
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [activeModal, setActiveModal] = useState<Modal>(null);
    const router = useRouter();

    // ── Toast ──
    const [toast, setToast] = useState<ToastState | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 3000);
    }, []);

    // ── Profile ──
    const [profile, setProfile] = useState<Profile>({ name: 'Admin User', email: 'admin@logops.internal' });
    const [profileDraft, setProfileDraft] = useState<Profile>(profile);

    // ── System ──
    const [systemSettings, setSystemSettings] = useState<SystemSettings>({ retention: '30 Days', sensitivity: 'Medium', timezone: 'UTC' });
    const [systemDraft, setSystemDraft] = useState<SystemSettings>(systemSettings);
    const [purgeConfirm, setPurgeConfirm] = useState(false);

    // ── Security ──
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [totpCode, setTotpCode] = useState('');
    const [totpError, setTotpError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
    const [passwordErrors, setPasswordErrors] = useState<Partial<typeof passwordForm>>({});
    const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);

    // ── Notifications ──
    const [notifs, setNotifs] = useState<Notifs>({ email: true, push: false, anomaly: true, weekly: true, security: true });
    const [notifsDraft, setNotifsDraft] = useState<Notifs>(notifs);

    // ── Appearance ──
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const [compactMode, setCompactMode] = useState(false);

    // ── Persist / Restore from localStorage ──
    useEffect(() => {
        try {
            const p = localStorage.getItem('settings.profile');
            if (p) { const v = JSON.parse(p); setProfile(v); setProfileDraft(v); }
            const s = localStorage.getItem('settings.system');
            if (s) { const v = JSON.parse(s); setSystemSettings(v); setSystemDraft(v); }
            const n = localStorage.getItem('settings.notifs');
            if (n) { const v = JSON.parse(n); setNotifs(v); setNotifsDraft(v); }
            const t = localStorage.getItem('settings.theme') as typeof theme | null;
            if (t) { setTheme(t); applyTheme(t); }
            const c = localStorage.getItem('settings.compact');
            if (c) { const v = c === 'true'; setCompactMode(v); applyCompact(v); }
            const tfa = localStorage.getItem('settings.2fa');
            if (tfa) setTwoFAEnabled(tfa === 'true');
        } catch { /* ignore */ }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function applyTheme(t: typeof theme) {
        const root = document.documentElement;
        if (t === 'dark') root.classList.add('dark');
        else if (t === 'light') root.classList.remove('dark');
        else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.classList.add('dark');
            else root.classList.remove('dark');
        }
    }

    function applyCompact(on: boolean) {
        if (on) document.documentElement.setAttribute('data-compact', 'true');
        else document.documentElement.removeAttribute('data-compact');
    }

    // ── Profile save ──
    function handleProfileSave() {
        if (!profileDraft.name.trim()) return showToast('Name cannot be empty.', 'error');
        if (!profileDraft.email.includes('@')) return showToast('Enter a valid email address.', 'error');
        setProfile(profileDraft);
        localStorage.setItem('settings.profile', JSON.stringify(profileDraft));
        setActiveModal(null);
        showToast('Profile updated successfully!');
    }

    // ── Logout ──
    async function handleLogout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
        } catch (err) {
            showToast('Failed to log out', 'error');
        }
    }

    // ── System save ──
    function handleSystemSave() {
        setSystemSettings(systemDraft);
        localStorage.setItem('settings.system', JSON.stringify(systemDraft));
        showToast('System settings saved!');
    }

    // ── Purge ──
    function handlePurge() {
        setPurgeConfirm(false);
        setActiveModal(null);
        showToast('All logs purged successfully.', 'success');
    }

    // ── Password validate & save ──
    function handlePasswordSave() {
        const errs: Partial<typeof passwordForm> = {};
        if (!passwordForm.current) errs.current = 'Required';
        if (passwordForm.newPass.length < 8) errs.newPass = 'Minimum 8 characters';
        if (passwordForm.newPass === passwordForm.current) errs.newPass = 'New password must differ from current';
        if (passwordForm.confirm !== passwordForm.newPass) errs.confirm = 'Passwords do not match';
        setPasswordErrors(errs);
        if (Object.keys(errs).length) return;
        setPasswordForm({ current: '', newPass: '', confirm: '' });
        setActiveModal(null);
        showToast('Password updated successfully!');
    }

    // ── 2FA verify ──
    function handleTotpVerify() {
        if (totpCode.trim().length < 4) { setTotpError('Enter at least 4 digits'); return; }
        setTwoFAEnabled(true);
        localStorage.setItem('settings.2fa', 'true');
        setTotpCode('');
        setTotpError('');
        setActiveModal(null);
        showToast('Two-factor authentication enabled!');
    }

    function handleDisable2FA() {
        setTwoFAEnabled(false);
        localStorage.setItem('settings.2fa', 'false');
        showToast('2FA has been disabled.');
    }

    // ── Session revoke ──
    function revokeSession(id: string) {
        setSessions(prev => prev.filter(s => s.id !== id));
        showToast('Session revoked.');
    }

    // ── Notifications save ──
    function handleNotifsSave() {
        setNotifs(notifsDraft);
        localStorage.setItem('settings.notifs', JSON.stringify(notifsDraft));
        showToast('Notification preferences saved!');
    }

    // ── Theme / compact ──
    function handleThemeChange(t: typeof theme) {
        setTheme(t);
        localStorage.setItem('settings.theme', t);
        applyTheme(t);
        showToast(`Theme set to ${t === 'system' ? 'System default' : t.charAt(0).toUpperCase() + t.slice(1)}.`);
    }

    function handleCompactChange() {
        const next = !compactMode;
        setCompactMode(next);
        localStorage.setItem('settings.compact', String(next));
        applyCompact(next);
        showToast(next ? 'Compact mode enabled.' : 'Compact mode disabled.');
    }

    const initials = getInitials(profile.name);
    const pwStrength = getPasswordStrength(passwordForm.newPass);

    // ── Open modal helpers ──
    function openProfile() { setProfileDraft(profile); setActiveModal('profile'); }
    function openPassword() { setPasswordForm({ current: '', newPass: '', confirm: '' }); setPasswordErrors({}); setActiveModal('password'); }

    return (
        <div className="h-full flex relative">
            {/* Background decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-red-200/30 to-rose-300/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-orange-200/20 to-red-200/20 rounded-full blur-3xl" />
            </div>

            <div className="max-w-5xl w-full mx-auto px-6 lg:px-8 py-8 flex flex-col flex-1 min-h-0 gap-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-4 shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-xl shadow-red-300/40 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Settings className="w-7 h-7 text-white relative z-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900">Platform Settings</h1>
                        <p className="text-gray-400 text-sm mt-0.5 font-medium flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-red-400" />
                            Manage your account, alerts, and preferences
                        </p>
                    </div>
                </motion.div>

                <div className="flex flex-col flex-1 min-h-0 gap-6">
                    {/* Horizontal Tab Bar */}
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex items-center gap-1.5 bg-white/60 backdrop-blur-xl border border-white/70 shadow-sm rounded-2xl p-1.5 shrink-0">
                        {tabs.map((tab, i) => (
                            <motion.button
                                key={tab.id}
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                variants={fadeUp}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex-1 justify-center
                                    ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md shadow-red-200/60'
                                        : 'text-gray-500 hover:bg-white/80 hover:text-gray-700'}`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden pb-4" style={{ scrollbarWidth: 'none' }}>
                        <AnimatePresence mode="wait">

                            {/* ── PROFILE ── */}
                            {activeTab === 'profile' && (
                                <motion.div key="profile" custom={0} variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} className="space-y-4">
                                    <SectionCard>
                                        <div className="p-6 flex items-center gap-6">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-red-200/60">{initials}</div>
                                                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                                                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-black text-gray-900">{profile.name}</h3>
                                                <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mt-1">
                                                    <Mail className="w-4 h-4" />
                                                    {profile.email}
                                                </div>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100">Active</span>
                                                    <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100">Administrator</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={openProfile}
                                                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:border-red-200 hover:text-red-600 hover:bg-red-50/40 shadow-sm transition-all duration-200 active:scale-95"
                                            >
                                                Edit Profile
                                            </button>
                                        </div>
                                    </SectionCard>

                                    {/* Stats row */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: 'Member Since', value: 'Jan 2024', icon: <Clock className="w-4 h-4" /> },
                                            { label: 'Last Login', value: '2 hours ago', icon: <Activity className="w-4 h-4" /> },
                                            { label: 'Region', value: 'US East', icon: <Globe className="w-4 h-4" /> },
                                        ].map(stat => (
                                            <SectionCard key={stat.label}>
                                                <div className="p-4 flex flex-col items-center text-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center">{stat.icon}</div>
                                                    <div>
                                                        <p className="text-lg font-black text-gray-900">{stat.value}</p>
                                                        <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                                                    </div>
                                                </div>
                                            </SectionCard>
                                        ))}
                                    </div>

                                    {/* Logout section */}
                                    <div className="pt-2">
                                        <SectionCard className="border-red-100 bg-red-50/20">
                                            <div className="p-6 flex items-center justify-between gap-4">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-sm">Sign Out</h4>
                                                    <p className="text-xs text-gray-500 font-medium mt-1">Safely end your session and log out of this device.</p>
                                                </div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="shrink-0 flex items-center gap-2 px-6 py-2.5 bg-white border border-red-200 text-red-600 font-bold text-sm rounded-xl shadow-[0_2px_8px_rgba(239,68,68,0.1)] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 active:scale-95"
                                                >
                                                    <LogOut className="w-4 h-4" /> Sign Out
                                                </button>
                                            </div>
                                        </SectionCard>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── SYSTEM ── */}
                            {activeTab === 'system' && (
                                <motion.div key="system" custom={0} variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} className="space-y-4">
                                    <SectionCard>
                                        <div className="divide-y divide-gray-50">
                                            <SettingRow label="Data Retention" description="How long raw telemetry logs stay in active storage" icon={<Database className="w-5 h-5" />}>
                                                <StyledSelect value={systemDraft.retention} onChange={v => setSystemDraft(d => ({ ...d, retention: v }))}>
                                                    {['7 Days', '30 Days', '90 Days', '1 Year'].map(o => <option key={o}>{o}</option>)}
                                                </StyledSelect>
                                            </SettingRow>
                                            <SettingRow label="Alert Sensitivity" description="Threshold for triggering anomaly detection alerts" icon={<Zap className="w-5 h-5" />}>
                                                <StyledSelect value={systemDraft.sensitivity} onChange={v => setSystemDraft(d => ({ ...d, sensitivity: v }))}>
                                                    {['High', 'Medium', 'Low'].map(o => <option key={o}>{o}</option>)}
                                                </StyledSelect>
                                            </SettingRow>
                                            <SettingRow label="Timezone" description="Used for log timestamps and scheduled reports" icon={<Globe className="w-5 h-5" />}>
                                                <StyledSelect value={systemDraft.timezone} onChange={v => setSystemDraft(d => ({ ...d, timezone: v }))}>
                                                    {['UTC', 'US/Eastern', 'US/Pacific', 'Asia/Kolkata'].map(o => <option key={o}>{o}</option>)}
                                                </StyledSelect>
                                            </SettingRow>
                                        </div>
                                        <div className="px-6 py-4 border-t border-gray-50 flex justify-end">
                                            <button
                                                onClick={handleSystemSave}
                                                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold text-sm rounded-xl shadow-md shadow-red-200/50 hover:shadow-red-300/60 transition-all duration-200 active:scale-95"
                                            >
                                                Save Settings
                                            </button>
                                        </div>
                                    </SectionCard>

                                    {/* Danger zone */}
                                    <div className="relative rounded-2xl border border-red-200/60 bg-red-50/30 overflow-hidden p-6 space-y-3">
                                        <div className="flex items-center gap-2.5 text-red-600">
                                            <AlertTriangle className="w-5 h-5" />
                                            <h4 className="font-bold text-sm uppercase tracking-widest">Danger Zone</h4>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium">These actions are irreversible. Proceed with caution.</p>
                                        {purgeConfirm ? (
                                            <div className="flex items-center gap-3 pt-1">
                                                <p className="text-sm text-red-700 font-semibold flex-1">Are you sure? This will permanently delete all logs.</p>
                                                <button onClick={() => setPurgeConfirm(false)} className="px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all active:scale-95">Cancel</button>
                                                <button onClick={handlePurge} className="px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-all active:scale-95 flex items-center gap-1.5">
                                                    <Trash2 className="w-3.5 h-3.5" /> Confirm Purge
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setPurgeConfirm(true)} className="px-5 py-2.5 border border-red-200 text-red-500 font-bold text-sm rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 active:scale-95">
                                                Purge All Logs
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* ── SECURITY ── */}
                            {activeTab === 'security' && (
                                <motion.div key="security" custom={0} variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} className="space-y-4">
                                    <SectionCard>
                                        <div className="divide-y divide-gray-50">
                                            <SettingRow label="Two-Factor Authentication" description="Protect your account with an authenticator app" icon={<Smartphone className="w-5 h-5" />}>
                                                <div className="flex items-center gap-3">
                                                    {twoFAEnabled && <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">Enabled</span>}
                                                    <button
                                                        onClick={() => twoFAEnabled ? handleDisable2FA() : setActiveModal('2fa')}
                                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${twoFAEnabled
                                                            ? 'bg-white border border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600'
                                                            : 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-200/50 hover:shadow-red-300/60'}`}
                                                    >
                                                        {twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                                                    </button>
                                                </div>
                                            </SettingRow>
                                            <SettingRow label="Change Password" description="Update your password to keep your account secure" icon={<KeyRound className="w-5 h-5" />}>
                                                <button
                                                    onClick={openPassword}
                                                    className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:border-red-200 hover:text-red-600 hover:bg-red-50/40 transition-all duration-200 active:scale-95"
                                                >
                                                    Update
                                                </button>
                                            </SettingRow>
                                            <SettingRow label="Active Sessions" description={`${sessions.length} active session${sessions.length !== 1 ? 's' : ''}`} icon={<Monitor className="w-5 h-5" />}>
                                                <button onClick={() => setActiveModal('sessions')} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:border-red-200 hover:text-red-600 hover:bg-red-50/40 transition-all duration-200 active:scale-95">
                                                    View All
                                                </button>
                                            </SettingRow>
                                        </div>
                                    </SectionCard>
                                </motion.div>
                            )}

                            {/* ── NOTIFICATIONS ── */}
                            {activeTab === 'notifications' && (
                                <motion.div key="notifications" custom={0} variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} className="space-y-4">
                                    <SectionCard>
                                        <div className="divide-y divide-gray-50">
                                            {[
                                                { key: 'email' as const, label: 'Email Alerts', description: 'Receive alerts via email', icon: <Mail className="w-5 h-5" /> },
                                                { key: 'push' as const, label: 'Push Notifications', description: 'Browser push notifications', icon: <Bell className="w-5 h-5" /> },
                                                { key: 'anomaly' as const, label: 'Anomaly Detected', description: 'Alert when AI detects anomalies', icon: <Activity className="w-5 h-5" /> },
                                                { key: 'weekly' as const, label: 'Weekly Digest', description: 'Summary report every Monday', icon: <Clock className="w-5 h-5" /> },
                                                { key: 'security' as const, label: 'Security Alerts', description: 'Login attempts and security events', icon: <Shield className="w-5 h-5" /> },
                                            ].map(n => (
                                                <SettingRow key={n.key} label={n.label} description={n.description} icon={n.icon}>
                                                    <ToggleSwitch on={notifsDraft[n.key]} onChange={() => setNotifsDraft(d => ({ ...d, [n.key]: !d[n.key] }))} />
                                                </SettingRow>
                                            ))}
                                        </div>
                                        <div className="px-6 py-4 border-t border-gray-50 flex justify-end">
                                            <button
                                                onClick={handleNotifsSave}
                                                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold text-sm rounded-xl shadow-md shadow-red-200/50 hover:shadow-red-300/60 transition-all duration-200 active:scale-95"
                                            >
                                                Save Preferences
                                            </button>
                                        </div>
                                    </SectionCard>
                                </motion.div>
                            )}

                            {/* ── APPEARANCE ── */}
                            {activeTab === 'appearance' && (
                                <motion.div key="appearance" custom={0} variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} className="space-y-4">
                                    <SectionCard>
                                        <div className="p-6 space-y-5">
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm mb-1">Theme</h4>
                                                <p className="text-xs text-gray-400 font-medium mb-4">Choose your preferred color scheme</p>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {[
                                                        { id: 'light' as const, label: 'Light', icon: <Sun className="w-5 h-5" /> },
                                                        { id: 'dark' as const, label: 'Dark', icon: <Moon className="w-5 h-5" /> },
                                                        { id: 'system' as const, label: 'System', icon: <Monitor className="w-5 h-5" /> },
                                                    ].map(t => (
                                                        <button
                                                            key={t.id}
                                                            onClick={() => handleThemeChange(t.id)}
                                                            className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${theme === t.id
                                                                ? 'border-red-400 bg-red-50/60 text-red-600 shadow-md shadow-red-100/80'
                                                                : 'border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'}`}
                                                        >
                                                            {t.icon}
                                                            {t.label}
                                                            {theme === t.id && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="h-px bg-gray-50" />
                                            <SettingRow label="Compact Mode" description="Reduce padding and spacing throughout the app" icon={<Palette className="w-5 h-5" />}>
                                                <ToggleSwitch on={compactMode} onChange={handleCompactChange} />
                                            </SettingRow>
                                        </div>
                                    </SectionCard>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* ══════════════ MODALS ══════════════ */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 bg-gray-950/50 backdrop-blur-md"
                            onClick={() => setActiveModal(null)}
                        />

                        <motion.div
                            variants={modalAnim} initial="hidden" animate="visible" exit="exit"
                            className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/40"
                        >
                            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-red-400 via-rose-400 to-red-300" />

                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100/80">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                                        ${activeModal === 'profile' ? 'bg-blue-50 text-blue-500'
                                            : activeModal === '2fa' || activeModal === '2fa-verify' ? 'bg-rose-50 text-rose-500'
                                                : activeModal === 'sessions' ? 'bg-purple-50 text-purple-500'
                                                    : 'bg-amber-50 text-amber-500'}`}>
                                        {activeModal === 'profile' ? <User className="w-5 h-5" />
                                            : activeModal === '2fa' || activeModal === '2fa-verify' ? <Shield className="w-5 h-5" />
                                                : activeModal === 'sessions' ? <Monitor className="w-5 h-5" />
                                                    : <Lock className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-gray-900 tracking-tight">
                                            {activeModal === 'profile' ? 'Edit Profile'
                                                : activeModal === '2fa' ? 'Enable Two-Factor Auth'
                                                    : activeModal === '2fa-verify' ? 'Verify Authenticator'
                                                        : activeModal === 'sessions' ? 'Active Sessions'
                                                            : 'Change Password'}
                                        </h2>
                                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                                            {activeModal === 'profile' ? 'Update your display name and email'
                                                : activeModal === '2fa' ? 'Secure your account with TOTP'
                                                    : activeModal === '2fa-verify' ? 'Enter the code from your authenticator app'
                                                        : activeModal === 'sessions' ? 'Manage your logged-in devices'
                                                            : 'Choose a strong, unique password'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveModal(null)}
                                    className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-150 focus:outline-none"
                                >
                                    <X style={{ width: '18px', height: '18px' }} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-5">

                                {/* ── Profile Modal ── */}
                                {activeModal === 'profile' && (
                                    <>
                                        <div className="flex justify-center">
                                            <div className="relative group cursor-pointer">
                                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                                                    {getInitials(profileDraft.name)}
                                                </div>
                                                <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <p className="text-white text-xs font-bold">Change</p>
                                                </div>
                                            </div>
                                        </div>
                                        <InputField
                                            label="Full Name" value={profileDraft.name}
                                            onChange={v => setProfileDraft(d => ({ ...d, name: v }))}
                                            icon={<User className="w-4 h-4" />}
                                        />
                                        <InputField
                                            label="Email Address" type="email" value={profileDraft.email}
                                            onChange={v => setProfileDraft(d => ({ ...d, email: v }))}
                                            icon={<Mail className="w-4 h-4" />}
                                        />
                                        <div className="flex gap-3 pt-2">
                                            <button onClick={() => setActiveModal(null)} className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 transition-all active:scale-95">Cancel</button>
                                            <button onClick={handleProfileSave} className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95">Save Changes</button>
                                        </div>
                                    </>
                                )}

                                {/* ── 2FA Step 1 Modal ── */}
                                {activeModal === '2fa' && (
                                    <>
                                        <div className="flex justify-center">
                                            <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-red-100 rounded-2xl flex items-center justify-center relative shadow-inner">
                                                <Smartphone className="w-12 h-12 text-rose-500" />
                                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                                                    <Shield className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center space-y-1.5 px-2">
                                            <h3 className="font-black text-gray-900 text-lg">Authenticator App</h3>
                                            <p className="text-xs text-gray-500 font-medium leading-relaxed">Use Google Authenticator, 1Password, or any TOTP app. After setup, you&apos;ll enter a 6-digit code each login.</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex gap-3 items-start">
                                            <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                            <p className="text-xs text-amber-700 font-semibold">After enabling 2FA, you&apos;ll need a code from your device every time you sign in.</p>
                                        </div>
                                        <div className="flex gap-3 pt-1">
                                            <button onClick={() => setActiveModal(null)} className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 transition-all active:scale-95">Maybe Later</button>
                                            <button onClick={() => setActiveModal('2fa-verify')} className="flex-[1.5] py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-200/60 transition-all active:scale-95">Begin Setup</button>
                                        </div>
                                    </>
                                )}

                                {/* ── 2FA Step 2 — TOTP Verify ── */}
                                {activeModal === '2fa-verify' && (
                                    <>
                                        <div className="text-center space-y-1 pt-1">
                                            <p className="text-xs text-gray-500 font-medium">Open your authenticator app and enter the 6-digit code shown for this account.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Verification Code</label>
                                            <input
                                                type="text"
                                                maxLength={6}
                                                value={totpCode}
                                                onChange={e => { setTotpCode(e.target.value.replace(/\D/g, '')); setTotpError(''); }}
                                                placeholder="000000"
                                                className={`w-full text-center tracking-[0.5em] text-2xl font-black py-4 bg-gray-50/60 border rounded-xl focus:outline-none focus:ring-4 transition-all ${totpError ? 'border-red-300 focus:border-red-400 focus:ring-red-100/50' : 'border-gray-200 focus:border-rose-400 focus:ring-rose-100/50'}`}
                                            />
                                            {totpError && <p className="text-xs text-red-500 font-medium ml-1">{totpError}</p>}
                                        </div>
                                        <div className="flex gap-3 pt-1">
                                            <button onClick={() => setActiveModal('2fa')} className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 transition-all active:scale-95">Back</button>
                                            <button onClick={handleTotpVerify} className="flex-[1.5] py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-200/60 transition-all active:scale-95">Verify & Enable</button>
                                        </div>
                                    </>
                                )}

                                {/* ── Password Modal ── */}
                                {activeModal === 'password' && (
                                    <>
                                        <InputField
                                            label="Current Password" type="password"
                                            value={passwordForm.current} onChange={v => setPasswordForm(f => ({ ...f, current: v }))}
                                            placeholder="••••••••" icon={<Lock className="w-4 h-4" />}
                                            error={passwordErrors.current}
                                        />
                                        <div className="space-y-1.5">
                                            <InputField
                                                label="New Password" type={showPass ? 'text' : 'password'}
                                                value={passwordForm.newPass} onChange={v => setPasswordForm(f => ({ ...f, newPass: v }))}
                                                placeholder="Min. 8 characters" icon={<Lock className="w-4 h-4" />}
                                                error={passwordErrors.newPass}
                                                rightSlot={
                                                    <button type="button" onClick={() => setShowPass(s => !s)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                }
                                            />
                                            {passwordForm.newPass && (
                                                <div className="flex items-center gap-2 mt-1.5 px-1">
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            animate={{ width: pwStrength.width }}
                                                            transition={{ duration: 0.4, ease: 'easeOut' }}
                                                            className={`h-full rounded-full ${pwStrength.color}`}
                                                        />
                                                    </div>
                                                    <span className={`text-xs font-bold ${pwStrength.score <= 1 ? 'text-red-500' : pwStrength.score <= 2 ? 'text-orange-400' : pwStrength.score <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                                                        {pwStrength.label}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <InputField
                                            label="Confirm Password" type={showPass ? 'text' : 'password'}
                                            value={passwordForm.confirm} onChange={v => setPasswordForm(f => ({ ...f, confirm: v }))}
                                            placeholder="Re-enter new password" icon={<Lock className="w-4 h-4" />}
                                            error={passwordErrors.confirm}
                                        />
                                        <div className="flex gap-3 pt-2">
                                            <button onClick={() => setActiveModal(null)} className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 transition-all active:scale-95">Cancel</button>
                                            <button onClick={handlePasswordSave} className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-200/60 transition-all active:scale-95">Update Password</button>
                                        </div>
                                    </>
                                )}

                                {/* ── Sessions Modal ── */}
                                {activeModal === 'sessions' && (
                                    <div className="space-y-3">
                                        {sessions.length === 0 ? (
                                            <p className="text-center text-gray-400 text-sm font-medium py-4">No active sessions.</p>
                                        ) : sessions.map(session => (
                                            <div key={session.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${session.current ? 'bg-green-50/60 border-green-100' : 'bg-gray-50/50 border-gray-100'}`}>
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${session.current ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                                    <Laptop className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-800 text-sm truncate">{session.device}</p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mt-0.5">
                                                        <MapPin className="w-3 h-3" /> {session.location}
                                                        <span>·</span>
                                                        <RefreshCw className="w-3 h-3" /> {session.lastActive}
                                                    </div>
                                                </div>
                                                {session.current
                                                    ? <span className="text-xs font-bold text-green-600 bg-green-100 px-2.5 py-1 rounded-full shrink-0">Current</span>
                                                    : (
                                                        <button
                                                            onClick={() => revokeSession(session.id)}
                                                            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-500 font-bold text-xs rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95"
                                                        >
                                                            <LogOut className="w-3.5 h-3.5" /> Revoke
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        ))}
                                        <button onClick={() => setActiveModal(null)} className="w-full mt-2 py-3 bg-gray-50 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 transition-all active:scale-95">Close</button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ══════════════ TOAST ══════════════ */}
            <div className="fixed bottom-6 right-6 z-[60] pointer-events-none">
                <AnimatePresence>
                    {toast && (
                        <div className="pointer-events-auto">
                            <Toast toast={toast} onDismiss={() => setToast(null)} />
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
