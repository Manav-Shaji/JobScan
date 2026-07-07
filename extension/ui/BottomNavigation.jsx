/* eslint-disable */
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ShieldCheck, LayoutGrid, History, User } from 'lucide-react';

export function BottomNavigation() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tabParam = searchParams?.get('tab') || 'overview';

    const items = [
        {
            label: 'Home',
            icon: LayoutGrid,
            tab: 'overview',
            href: '/dashboard?tab=overview',
        },
        {
            label: 'Analyzer',
            icon: ShieldCheck,
            tab: 'analyzer',
            href: '/dashboard?tab=analyzer',
        },
        {
            label: 'History',
            icon: History,
            tab: 'history',
            href: '/dashboard?tab=history',
        },
        {
            label: 'Profile',
            icon: User,
            tab: 'profile',
            href: '/dashboard?tab=profile',
        },
    ];

    const isActive = (item) => {
        if (item.tab === 'analyzer') {
            return pathname === '/dashboard/analyzer' || (pathname === '/dashboard' && tabParam === 'analyzer');
        }
        return pathname === '/dashboard' && tabParam === item.tab;
    };

    return (
        <nav 
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-[72px] bg-[var(--surface-card)] border-t border-[var(--hairline-strong)] backdrop-blur-md flex items-center justify-around px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
            style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))' }}
        >
            {items.map((item, idx) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                    <Link
                        key={idx}
                        href={item.href}
                        onClick={() => {
                            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                                navigator.vibrate(20);
                            }
                        }}
                        className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 text-decoration-none transition-colors duration-200 ${
                            active ? 'text-[var(--cta)]' : 'text-[var(--muted)] hover:text-[var(--on-dark)]'
                        }`}
                    >
                        <div className="relative flex items-center justify-center">
                            <Icon size={20} className={`transition-transform duration-300 ${active ? 'scale-110' : 'scale-100'}`} />
                            {active && (
                                <span className="absolute -top-1.5 -right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--cta)] shadow-[0_0_8px_var(--cta)]" />
                            )}
                        </div>
                        <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
