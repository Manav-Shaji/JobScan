'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/frontend/context/theme-context';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div
                className={className}
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--hairline-strong)',
                }}
            />
        );
    }

    return (
        <div
            style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                overflow: 'hidden',
            }}
            className={className}
        >
            <button
                onClick={toggleTheme}
                className="p-0 flex items-center justify-center"
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 0,
                    transition: 'all 0.15s ease',
                }}
                title="Toggle Theme"
                aria-label="Toggle Theme"
            >
                {theme === 'light' ? (
                    <Moon
                        size={18}
                        className="text-[var(--muted)] hover:text-[var(--on-dark)] transition-colors"
                    />
                ) : (
                    <Sun
                        size={18}
                        className="text-[var(--muted)] hover:text-[var(--on-dark)] transition-colors"
                    />
                )}
            </button>
        </div>
    );
}
