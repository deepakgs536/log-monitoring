'use client';

import { useEffect, useState } from 'react';

export const AnimatedNumber = ({ value }: { value: number }) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        let start = displayValue;
        const end = value;
        if (start === end) return;

        const duration = 800;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeProgress);

            setDisplayValue(current);
            if (progress < 1) requestAnimationFrame(animate);
        };

        const animationHandle = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationHandle);
    }, [value]);

    return <span>{displayValue.toLocaleString()}</span>;
};
