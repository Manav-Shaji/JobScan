/**
 * ------------------------------------------------------------
 * Component: FooterSection
 * 
 * Purpose:
 * Renders the global site footer, providing navigation links, legal information, and a newsletter subscription form.
 * 
 * Responsibilities:
 * • Displays organizational branding and platform mission statement.
 * • Provides structural navigation to core product and legal pages.
 * • Integrates a newsletter capture input for user engagement.
 * 
 * Used By:
 * • Root Layout
 * ------------------------------------------------------------
 */

import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/core/ui/ThemeToggle';
import { ShieldCheck, Cpu, ClipboardList, Shield, Sparkles, ArrowDownCircle, CheckCircle2, Quote, Mail, MapPin, ArrowRight, Zap, Star } from 'lucide-react';

export function FooterSection() {
    return (
        <footer
            style={{
                borderTop: '1px solid var(--hairline)',
                marginTop: 80,
                background: 'var(--canvas)',
                padding: '80px 0 40px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(var(--cta-rgb), 0.05) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-5">
                    <div className="md:col-span-12 lg:col-span-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--cta) 0%, var(--primary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 900, color: '#fff', boxShadow: '0 10px 20px rgba(var(--cta-rgb), 0.2)' }}>J</div>
                            <div>
                                <h3 style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: 'var(--on-dark)', letterSpacing: '-0.5px' }}>JobScan</h3>
                                <div style={{ fontSize: '13px', color: 'var(--cta)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>AI Trust Platform</div>
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7', maxWidth: '320px', marginBottom: '24px' }}>
                            The world&apos;s most advanced AI-powered job fraud detection engine. Protecting millions of career seekers from sophisticated employment scams.
                        </p>
                        <div className="flex gap-3">
                            <Link href="/" aria-label="Twitter X profile" className="social-icon-btn" style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                            </Link>
                            <Link href="/" aria-label="LinkedIn profile" className="social-icon-btn" style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                            </Link>
                        </div>
                    </div>
 
                    <div className="md:col-span-8 lg:col-span-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 style={{ fontWeight: 800, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '24px', color: 'var(--on-dark)' }}>Product</h4>
                                <ul className="flex flex-col gap-3">
                                    <li><a href="#features" className="footer-link-premium" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '15px' }}>Features</a></li>
                                    <li><a href="#about" className="footer-link-premium" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '15px' }}>About Us</a></li>
                                    <li><a href="#testimonials" className="footer-link-premium" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '15px' }}>Testimonials</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 800, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '24px', color: 'var(--on-dark)' }}>Legal</h4>
                                <ul className="flex flex-col gap-3">
                                    <li><Link href="/privacy" className="footer-link-premium" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '15px' }}>Privacy Policy</Link></li>
                                    <li><Link href="/terms" className="footer-link-premium" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '15px' }}>Terms of Service</Link></li>
                                    <li><a href="#contact" className="footer-link-premium" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '15px' }}>Contact</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
 
                    <div className="md:col-span-4 lg:col-span-3">
                        <h4 style={{ fontWeight: 800, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '24px', color: 'var(--on-dark)' }}>Stay Secure</h4>
                        <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '20px' }}>Join 10k+ subscribers getting weekly career safety tips.</p>
                        <div className="newsletter-wrap flex items-center gap-0" style={{ background: 'var(--surface-elevated)', borderRadius: '14px', padding: '4px', border: '1px solid var(--hairline)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', backdropFilter: 'blur(8px)' }}>
                            <input type="email" aria-label="Newsletter email address" placeholder="Email address" style={{ flex: 1, padding: '10px 16px', borderRadius: '12px', background: 'transparent', border: 'none', fontSize: '14px', color: 'var(--on-dark)', outline: 'none', width: '100%' }} />
                            <button type="button" aria-label="Subscribe to newsletter" style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--cta)', border: 'none', color: '#fff', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(var(--cta-rgb), 0.3)' }}><ArrowRight size={16} /></button>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t flex flex-col md:flex-row justify-between items-center gap-3" style={{ borderColor: 'var(--hairline)' }}>
                    <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0, fontWeight: 500 }}>&copy; 2026 JobScan AI Inc. All rights reserved.</p>
                    <div className="flex gap-4">
                        <span style={{ fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span> System Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
