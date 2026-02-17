'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TimeRange } from '@/lib/types';

interface ConsoleContextType {
    timeRange: TimeRange;
    setTimeRange: (range: TimeRange) => void;
    isLive: boolean;
    setIsLive: (isLive: boolean) => void;
}

const ConsoleContext = createContext<ConsoleContextType | undefined>(undefined);

export function ConsoleProvider({ children }: { children: ReactNode }) {
    const [timeRange, setTimeRange] = useState<TimeRange>('1h');
    const [isLive, setIsLive] = useState(true);

    return (
        <ConsoleContext.Provider value={{ timeRange, setTimeRange, isLive, setIsLive }}>
            {children}
        </ConsoleContext.Provider>
    );
}

export function useConsole() {
    const context = useContext(ConsoleContext);
    if (context === undefined) {
        throw new Error('useConsole must be used within a ConsoleProvider');
    }
    return context;
}
