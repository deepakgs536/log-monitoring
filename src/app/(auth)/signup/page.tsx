'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Hexagon, User, Activity, Shield, Zap } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Signup failed');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/console');
        } catch {
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
            {/* Gradient Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-32 right-1/4 w-[600px] h-[400px] bg-gradient-to-bl from-violet-500/40 via-purple-500/30 to-fuchsia-500/20 rounded-full blur-[120px]" />
                <div className="absolute -top-20 left-1/4 w-[500px] h-[350px] bg-gradient-to-br from-indigo-500/40 via-blue-500/30 to-cyan-500/20 rounded-full blur-[120px]" />
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-gradient-to-b from-emerald-500/15 to-transparent rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-rose-600/15 to-transparent rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-gradient-to-tl from-violet-600/10 to-transparent rounded-full blur-[100px]" />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 grid lg:grid-cols-2 gap-8 items-center py-10">
                {/* LEFT — Info Panel */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="hidden lg:block"
                >
                    <div className="relative rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] p-10 overflow-hidden">
                        {/* Decorative gradient */}
                        <div className="absolute top-0 left-0 w-[300px] h-[200px] bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent rounded-full blur-[60px]" />

                        <div className="relative z-10">
                            {/* Logo */}
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <Hexagon className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white/80 font-bold text-lg tracking-tight">LogOps</span>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                                Start your <br />
                                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">monitoring journey</span>
                            </h2>

                            <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-sm">
                                Join thousands of engineering teams who trust LogOps for real-time observability, anomaly detection, and incident response.
                            </p>

                            {/* Feature list */}
                            <div className="space-y-5 mb-10">
                                {[
                                    { icon: Activity, title: 'Real-time Monitoring', desc: 'Stream millions of logs per second' },
                                    { icon: Shield, title: 'Smart Detection', desc: 'AI-powered anomaly identification' },
                                    { icon: Zap, title: 'Instant Alerts', desc: 'Sub-second incident notifications' },
                                ].map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + i * 0.15 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                            <feature.icon className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold text-sm">{feature.title}</p>
                                            <p className="text-white/30 text-xs">{feature.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                                {[
                                    { value: '10K+', label: 'Teams' },
                                    { value: '99.99%', label: 'Uptime' },
                                    { value: '<10ms', label: 'Latency' },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <p className="text-white font-bold text-lg">{stat.value}</p>
                                        <p className="text-white/25 text-[10px] uppercase tracking-wider">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT — Signup Card */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                >
                    <div className="relative rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.08] p-10 shadow-2xl shadow-black/40">
                        {/* Subtle inner glow */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            {/* Mobile logo */}
                            <div className="flex items-center gap-3 mb-8 lg:hidden">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <Hexagon className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white/80 font-bold text-lg tracking-tight">LogOps</span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
                            <p className="text-white/40 text-sm mb-8">Get started with your free account</p>

                            {/* Error */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 block">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 block">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                                        <input
                                            type="email"
                                            placeholder="johnste@gmail.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 block">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all duration-300"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 block">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all duration-300"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-white/90 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/10 mt-6"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-white/[0.08]" />
                                <span className="text-white/20 text-xs">or continue with</span>
                                <div className="flex-1 h-px bg-white/[0.08]" />
                            </div>

                            {/* Social logins */}
                            <div className="flex items-center justify-center gap-3">
                                {['G', 'GH', 'f'].map((label, i) => (
                                    <button
                                        key={i}
                                        className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-300 text-sm font-bold"
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Login link */}
                            <p className="text-center text-white/30 text-sm mt-6">
                                Already have an account?{' '}
                                <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
