'use client';

import { ConsoleSidebar } from '@/components/layout/ConsoleSidebar';
import { ConsoleProvider, useConsole } from '@/context/ConsoleContext';
import { AppProvider } from '@/context/AppContext';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import AppSelector from '../../components/layout/AppSelector';

function ConsoleLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const { timeRange, isLive, setTimeRange } = useConsole();
    return (
        <div className="!w-screen h-screen console-bg flex flex-col relative overflow-hidden">
            {/* Ambient decorative orbs */}
            <div className="console-ambient-orb w-[700px] h-[700px] bg-gradient-to-br from-red-200/25 to-rose-200/15 -top-48 -right-48" />
            <div className="console-ambient-orb w-[500px] h-[500px] bg-gradient-to-tr from-rose-200/15 to-orange-100/10 bottom-0 -left-32" />
            <div className="console-ambient-orb w-[300px] h-[300px] bg-gradient-to-br from-red-100/15 to-transparent top-1/2 left-1/3" />

            {/* Animated red accent bar */}
            <div className="red-gradient-accent h-[3px] w-full flex-shrink-0 relative z-10" />
            <div className="!max-w-screen flex flex-1 min-h-0 relative z-10">
                <ConsoleSidebar />
                <main className="flex-1 h-full overflow-y-scroll overflow-x-hidden transition-all duration-300">
                    {/* Header - Fixed */}
                    <header className="h-16 flex-shrink-0 border-b border-gray-100 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between z-30 sticky top-0">
                        <div className="mx-auto w-full flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-64">
                                <AppSelector />
                            </div>
                            <DashboardHeader isLive={isLive} timeRange={timeRange} setTimeRange={setTimeRange} />
                        </div>
                    </header>
                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function ConsoleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppProvider>
            <ConsoleProvider>
                <ConsoleLayoutContent>
                    {children}
                </ConsoleLayoutContent>
            </ConsoleProvider>
        </AppProvider>
    );
}
