'use client';

/**
 * ------------------------------------------------------------
 * Component: FeaturesSection
 * 
 * Purpose:
 * Renders the primary value proposition section to showcase core platform benefits.
 * It provides users with insight into the AI-driven technology and security standards.
 * 
 * Responsibilities:
 * • Displays interactive feature cards with entry animations.
 * • Highlights key platform advantages like AI analysis, speed, and data privacy.
 * 
 * Used By:
 * • LandingPage
 * ------------------------------------------------------------
 */


/**
 * ------------------------------------------------------------
 * Component: FeaturesSection
 * 
 * Purpose:
 * Displays the core value propositions and key features of the JobScan platform.
 * 
 * Responsibilities:
 * • Renders interactive feature cards with motion animations.
 * • Highlights AI-powered analysis, performance, and security benefits.
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

export function FeaturesSection() {
    return (
        <section
            id="features"
            className="py-5"
            style={{ paddingTop: '80px', paddingBottom: '80px' }}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div style={{ textAlign: 'center', marginBottom: 60 }}>
                    <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', marginBottom: 16 }}>
                        Why Choose JobScan?
                    </h2>
                    <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
                        Advanced detection powered by machine learning. Trusted by thousands.
                    </p>
                </div>
                <m.div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
                    <m.div variants={slideUp} className="h-full">
                        <div className="feature-card-premium text-center h-full">
                            <div className="rich-icon-wrapper" style={{ color: 'var(--cta)' }}>
                                <Cpu size={32} />
                            </div>
                            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: 16, color: 'var(--on-dark)' }}>AI-Powered Analysis</h3>
                            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                Advanced machine learning detects hundreds of scam patterns used by fraudsters.
                            </p>
                        </div>
                    </m.div>
                    <m.div variants={slideUp} className="h-full">
                        <div className="feature-card-premium text-center h-full">
                            <div className="rich-icon-wrapper" style={{ color: 'var(--primary)' }}>
                                <Zap size={32} />
                            </div>
                            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: 16, color: 'var(--on-dark)' }}>Instant Results</h3>
                            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                Get comprehensive analysis with trust scores and detailed insights instantly.
                            </p>
                        </div>
                    </m.div>
                    <m.div variants={slideUp} className="h-full">
                        <div className="feature-card-premium text-center h-full">
                            <div className="rich-icon-wrapper" style={{ color: 'var(--success)' }}>
                                <Shield size={32} />
                            </div>
                            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: 16, color: 'var(--on-dark)' }}>100% Private & Secure</h3>
                            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                Your data is never stored or shared. Complete privacy for every analysis.
                            </p>
                        </div>
                    </m.div>
                </m.div>
            </div>
        </section>
    );
}

// --- Testimonials Section ---
