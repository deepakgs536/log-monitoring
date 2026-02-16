'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import { Hexagon, User } from 'lucide-react';

export const ConsoleSidebar = () => {
    const pathname = usePathname();
    const currentPath = pathname || '/';

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-16 bg-white border-r border-border flex flex-col items-center py-6 z-50">
            {/* Logo */}
            <div className="mb-8 w-10 h-10 bg-elevated rounded-xl flex items-center justify-center border border-border text-accent-cyan shadow-sm">
                <Hexagon className="w-6 h-6" />
            </div>

            {/* Nav Items */}
            <nav className="flex-1 w-full flex flex-col items-center gap-4">
                {NAV_ITEMS.map((item) => {
                    const isActive = currentPath.startsWith(item.path);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`group relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-muted hover:text-primary hover:bg-elevated/50'
                                }`}
                        >
                            <Icon className="w-4 h-4" />

                            {/* Tooltip */}
                            <div className="absolute left-14 bg-elevated border border-border px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                <span className="text-[10px] font-bold text-foreground tracking-widest uppercase">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section: System Switcher & Profile */}
            <div className="flex flex-col gap-4 mt-auto">
                {/* System Switcher Placeholder */}
                <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-muted hover:text-primary transition-colors cursor-pointer group relative">
                    <span className="text-[10px] font-bold">SYS</span>
                    <div className="absolute left-14 bg-elevated border border-border px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        <span className="text-xs font-bold text-foreground tracking-widest uppercase">Switch System</span>
                    </div>
                </div>

                {/* Profile */}
                <div className="w-10 h-10 rounded-full bg-elevated border border-border flex items-center justify-center text-muted hover:text-primary transition-colors cursor-pointer overflow-hidden relative group">
                    <User className="w-5 h-5" />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
        </aside>
    );
};
