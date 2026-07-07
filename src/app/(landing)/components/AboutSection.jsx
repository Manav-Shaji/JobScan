'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/core/ui/ThemeToggle';
import { ShieldCheck, Cpu, ClipboardList, Shield, Sparkles, ArrowDownCircle, CheckCircle2, Quote, Mail, MapPin, ArrowRight, Zap, Star } from 'lucide-react';
import { m } from 'motion/react';
import { staggerContainer, slideUp, buttonGestures } from '@/core/motion';

export function AboutSection() {
    return (
        <section id="about" className="py-5 bg-surface-elevated" style={{ borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' }}>
            <div className="max-w-7xl mx-auto px-4 py-5">
                <m.div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
                    <m.div variants={slideUp}>
                        <m.div 
                            className="about-image-wrap relative w-fit mx-auto"
                            animate={{ y: [-15, 15, -15] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <div className="glass-card p-2 mx-auto" style={{ borderRadius: '24px', transform: 'rotate(-2deg)', background: 'var(--surface-elevated)', border: '2px solid rgba(var(--cta-rgb), 0.3)', boxShadow: '0 20px 40px rgba(var(--cta-rgb), 0.15)', maxWidth: '300px' }}>
                                <Image 
                                    src="/simple_analysis.png" 
                                    alt="Job Analysis" 
                                    width={300}
                                    height={220}
                                    className="max-w-full h-auto" 
                                    style={{ borderRadius: '18px', width: '100%', height: 'auto', display: 'block' }}
                                />
                            </div>
                            <m.div 
                                className="glass-card p-3 absolute" 
                                style={{ bottom: '-20px', right: '-20px', borderRadius: '16px', transform: 'rotate(4deg)', maxWidth: '200px', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
                                animate={{ y: [5, -5, 5] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="stat-icon" style={{ background: 'var(--cta)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(var(--cta-rgb), 0.4)' }}>
                                        <ShieldCheck className="text-white mx-auto" />
                                    </div>
                                    <div>
                                        <div className="font-bold" style={{ fontSize: '18px', color: 'var(--on-dark)' }}>99.2%</div>
                                        <div className="text-[var(--text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>Accuracy Rate</div>
                                    </div>
                                </div>
                            </m.div>
                        </m.div>
                    </m.div>
                    <m.div variants={slideUp}>
                        <div className="lg:pl-12">
                            <div className="tag mb-3" style={{ color: 'var(--cta)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px' }}>Our Mission</div>
                            <h2 className="mb-4" style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: '1.1' }}>
                                Fighting employment fraud with <span className="text-gradient">Intelligence</span>.
                            </h2>
                            <p className="mb-4 text-secondary" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                                JobScan was born out of a simple necessity: the job market is increasingly flooded with sophisticated scams that prey on career seekers. We built a deterministic engine that combines linguistic patterns, metadata verification, and AI-driven insights to protect you.
                            </p>
                            <ul className="mb-5">
                                <li className="flex items-start gap-3 mb-3">
                                    <CheckCircle2 size={20} color="var(--cta)" />
                                    <div>
                                        <h4 className="mb-1" style={{ fontSize: '18px', fontWeight: 700 }}>Heuristic Pattern Matching</h4>
                                        <p className="text-[var(--muted)] mb-0" style={{ fontSize: '15px' }}>Detecting subtle red flags in job descriptions that humans often miss.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 mb-3">
                                    <CheckCircle2 size={20} color="var(--cta)" />
                                    <div>
                                        <h4 className="mb-1" style={{ fontSize: '18px', fontWeight: 700 }}>Global Trust & Verification</h4>
                                        <p className="text-[var(--muted)] mb-0" style={{ fontSize: '15px' }}>Real-time database of known scam domains and fraud techniques.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </m.div>
                </m.div>
            </div>
        </section>
    );
}

// --- Features Section ---
