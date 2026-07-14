'use client';

import { useState } from 'react';

/**
 * ------------------------------------------------------------
 * Component: AuthBackground
 * 
 * Purpose:
 * Animated background element for the authentication page.
 * 
 * Responsibilities:
 * • Render immersive background gradients and floating shapes
 * 
 * Used By:
 * • Authentication Page Layout
 * ------------------------------------------------------------
 */

export function AuthBackground() {
    const [particles] = useState(() => 
        Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 80 + 10,
            size: Math.random() * 3 + 2,
            delay: Math.random() * 5,
            duration: Math.random() * 8 + 6,
        }))
    );

    return (
        <div className="absolute inset-0 z-0 bg-[var(--canvas)] overflow-hidden pointer-events-none">
            {/* Animated Mesh Grid */}
            <div 
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.03) 1px, transparent 1px), 
                                      linear-gradient(90deg, rgba(14, 165, 233, 0.03) 1px, transparent 1px)`,
                    backgroundSize: '32px 32px'
                }}
            ></div>
            
            {/* Floating Blurred Blobs */}
            <div 
                className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[130px] opacity-15 dark:opacity-30"
                style={{
                    background: 'radial-gradient(circle, rgba(15, 23, 42, 0.8) 0%, transparent 70%)',
                    animation: 'blob 18s infinite alternate ease-in-out'
                }}
            ></div>
            <div 
                className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[130px] opacity-10 dark:opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(3, 105, 161, 0.5) 0%, transparent 70%)',
                    animation: 'blob 22s infinite alternate ease-in-out',
                    animationDelay: '3s'
                }}
            ></div>
            <div 
                className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full blur-[120px] opacity-5 dark:opacity-15"
                style={{
                    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, transparent 70%)',
                    animation: 'blob 15s infinite alternate ease-in-out',
                    animationDelay: '6s'
                }}
            ></div>

            {/* Drifting Particles */}
            {particles.map(p => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`
                    }}
                />
            ))}
        </div>
    );
}
