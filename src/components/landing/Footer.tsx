'use client';

import Link from 'next/link';
import { Terminal, Github, Twitter, Linkedin, ArrowRight } from 'lucide-react';

const productLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Console', href: '/console', isLink: true },
    { label: 'Changelog', href: '#' },
];

const resourceLinks = [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Tutorials', href: '#' },
];

const companyLinks = [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Status', href: '#' },
    { label: 'Partners', href: '#' },
];

export default function Footer() {
    return (
        <footer className="relative bg-gray-950 text-white overflow-hidden">
            {/* Gradient separator */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14">
                    {/* Brand + Newsletter */}
                    <div className="md:col-span-5">
                        <Link href="/" className="flex items-center gap-2.5 mb-5 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                                <Terminal className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-lg">
                                Log<span className="text-red-400">Ops</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 max-w-sm text-sm leading-relaxed mb-6">
                            AI-grade observability for modern engineering teams. Real-time log monitoring,
                            intelligent alerting, and instant incident response.
                        </p>

                        {/* Newsletter */}
                        <div className="flex gap-2 max-w-sm mb-6">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-red-500/30 focus:outline-none focus:ring-1 focus:ring-red-500/10 transition-all"
                            />
                            <button className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 rounded-lg text-sm font-semibold hover:scale-105 transition-transform shadow-lg shadow-red-500/10">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Status indicator */}
                        <div className="flex items-center gap-2 text-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span className="text-emerald-400 font-medium text-xs">All systems operational</span>
                        </div>

                        <div className="flex gap-3 mt-6">
                            {[Github, Twitter, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-red-400 hover:border-red-500/30 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div className="md:col-span-2">
                        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Product</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            {productLinks.map((link) => (
                                <li key={link.label}>
                                    {link.isLink ? (
                                        <Link href={link.href} className="hover:text-red-400 transition-colors">{link.label}</Link>
                                    ) : (
                                        <a href={link.href} className="hover:text-red-400 transition-colors">{link.label}</a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="md:col-span-2">
                        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Resources</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            {resourceLinks.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="hover:text-red-400 transition-colors">{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="md:col-span-2">
                        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            {companyLinks.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="hover:text-red-400 transition-colors">{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600">
                    <p>© {new Date().getFullYear()} LogOps Inc. All rights reserved.</p>
                    <div className="flex gap-6 mt-3 sm:mt-0">
                        <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
                        <a href="#" className="hover:text-gray-400 transition-colors">Security</a>
                        <a href="#" className="hover:text-gray-400 transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
