'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push('/console');
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen bg-[#0f172a]">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}
