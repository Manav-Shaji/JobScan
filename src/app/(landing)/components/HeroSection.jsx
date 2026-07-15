'use client';

/**
 * ------------------------------------------------------------
 * Component: HeroSection
 * 
 * Purpose:
 * Renders the primary landing page hero section, highlighting AI-driven 
 * verification tools and trust indicators to drive user engagement.
 * 
 * Responsibilities:
 * • Displays the main value proposition, key metrics, and call-to-action buttons.
 * • Manages entrance animations for headlines and floating UI elements.
 * 
 * Used By:
 * • LandingPage
 * ------------------------------------------------------------
 */


import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/core/ui/ThemeToggle';
import { ShieldCheck, Cpu, ClipboardList, Shield, Sparkles, ArrowDownCircle, CheckCircle2, Quote, Mail, MapPin, ArrowRight, Zap, Star } from 'lucide-react';
import { m } from 'motion/react';
import { staggerContainer, slideUp, buttonGestures } from '@/core/motion';

export function HeroSection() {
    return (
        <section
            id="hero"
            className="flex flex-col items-center justify-center text-center"
            style={{
                minHeight: '90vh',
                padding: '120px 20px 60px',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--canvas)',
            }}
        >
            <div
                className="mesh-bg"
                style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 0,
                    opacity: 'var(--hero-bg-opacity)',
                    filter: 'var(--hero-bg-filter)'
                }}
            ></div>

            <div
                style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '150%',
                    height: '150%',
                    background:
                        'radial-gradient(circle, rgba(var(--cta-rgb), 0.12) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
            ></div>
            <div
                style={{
                    position: 'absolute',
                    bottom: '-40%',
                    left: '-40%',
                    width: '150%',
                    height: '150%',
                    background:
                        'radial-gradient(circle, rgba(var(--primary-rgb), 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
            ></div>

            <m.div
                className="max-w-7xl mx-auto px-4"
                style={{ position: 'relative', zIndex: 1 }}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                {/* Floating Elements */}
                <m.div
                    animate={{ y: [0, -15, 0], rotate: [-2, 2, -2] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', top: '10%', left: '-5%', zIndex: 0, opacity: 0.8 }}
                    className="hidden lg:flex items-center gap-2 glass-card py-2 px-4"
                >
                    <ShieldCheck size={20} className="text-[var(--success)]" />
                    <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--on-dark)' }}>Verified Safe</span>
                </m.div>
                
                <m.div
                    animate={{ y: [0, 20, 0], rotate: [2, -2, 2] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    style={{ position: 'absolute', bottom: '20%', right: '-5%', zIndex: 0, opacity: 0.8 }}
                    className="hidden lg:flex items-center gap-2 glass-card py-2 px-4"
                >
                    <span style={{ fontWeight: 900, fontSize: '24px', color: 'var(--cta)' }}>99%</span>
                    <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-secondary)' }}>Trust Score</span>
                </m.div>

                <m.div variants={slideUp} className="flex justify-center mb-4 relative z-10">
                    <div
                        className="inline-flex items-center"
                        style={{
                            padding: '8px 24px',
                            borderRadius: 999,
                            background: 'rgba(var(--cta-rgb), 0.08)',
                            border: '1px solid rgba(var(--cta-rgb), 0.2)',
                            boxShadow: '0 0 20px rgba(var(--cta-rgb), 0.1)',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            color: 'var(--cta)',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                        }}
                    >
                        <Sparkles size={16} className="mr-2" /> Premium AI Protection
                    </div>
                </m.div>
                <m.h1
                    variants={slideUp}
                    className="text-gradient mb-4"
                    style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                        lineHeight: 1.1,
                        fontWeight: 900,
                        letterSpacing: '-2px',
                    }}
                >
                    Spot Fake Job Offers
                    <br />
                    Before You Apply
                </m.h1>
                <m.p
                    variants={slideUp}
                    className="mx-auto mb-5"
                    style={{
                        maxWidth: 600,
                        fontSize: '1.15rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.8,
                        fontWeight: 500,
                    }}
                >
                    Instantly verify job postings, recruiters, and companies using our advanced AI-driven threat detection system. Get comprehensive trust scores in seconds.
                </m.p>
                <m.div variants={slideUp} className="flex gap-3 justify-center mb-5">
                    <m.div {...buttonGestures}>
                        <Link href="/dashboard/analyzer" className="button-primary flex items-center h-full">
                            <ShieldCheck size={20} className="mr-2" /> Start Scanning Free
                        </Link>
                    </m.div>
                    <m.a href="#how-it-works" className="btn-premium-secondary flex items-center" {...buttonGestures}>
                        <ArrowDownCircle size={20} className="mr-2" /> How it Works
                    </m.a>
                </m.div>
                <div
                    className="flex justify-center gap-5 flex-wrap"
                    style={{
                        opacity: 0.8,
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                    }}
                >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle2 size={18} color="var(--cta)" />
                        <strong>3 Free Scans</strong>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle2 size={18} color="var(--cta)" />
                        <strong>No Credit Card</strong>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle2 size={18} color="var(--cta)" />
                        <strong>Instant Results</strong>
                    </span>
                </div>
            </m.div>
        </section>
    );
}

// --- How It Works Section ---
