/**
 * ------------------------------------------------------------
 * Component: ContactSection
 * 
 * Purpose:
 * Provides a user-facing contact interface featuring support details and a message submission form.
 * 
 * Responsibilities:
 * • Display company support contact information and headquarters location.
 * • Provide a user input form for inquiries and assistance requests.
 * 
 * Used By:
 * • LandingPage
 * ------------------------------------------------------------
 */

import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/core/ui/ThemeToggle';
import { ShieldCheck, Cpu, ClipboardList, Shield, Sparkles, ArrowDownCircle, CheckCircle2, Quote, Mail, MapPin, ArrowRight, Zap, Star } from 'lucide-react';

export function ContactSection() {
    return (
        <section id="contact" className="py-5">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-5">
                        <div className="tag mb-2" style={{ color: 'var(--cta)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '11px' }}>Get In Touch</div>
                        <h2 className="mb-3" style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1px' }}>Have Questions? <span className="text-gradient">Contact Us</span></h2>
                        <p className="text-secondary mb-4" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                            Need help with a suspicious job offer or want to learn more about our AI solutions? Our team is ready to help.
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(var(--cta-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cta)' }}>
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--on-dark)' }}>Email Support</div>
                                    <div className="text-[var(--muted)]" style={{ fontSize: '13px' }}>support@jobscan.ai</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(var(--cta-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cta)' }}>
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--on-dark)' }}>Headquarters</div>
                                    <div className="text-[var(--muted)]" style={{ fontSize: '13px' }}>San Francisco, CA</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-7">
                        <div className="glass-card p-4 mx-auto" style={{ borderRadius: '24px', border: '1px solid var(--hairline-strong)', background: 'rgba(var(--surface-card-rgb), 0.05)', maxWidth: '550px' }}>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="contact-name" className="form-label small font-bold text-[var(--muted)] uppercase mb-1" style={{ letterSpacing: '0.5px', fontSize: '12px' }}>Full Name</label>
                                    <input id="contact-name" type="text" className="w-full block" placeholder="John Doe" style={{ borderRadius: '10px', padding: '10px 14px', background: 'var(--surface-elevated)', border: '1px solid var(--hairline)', color: 'var(--on-dark)', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label htmlFor="contact-email" className="form-label small font-bold text-[var(--muted)] uppercase mb-1" style={{ letterSpacing: '0.5px', fontSize: '12px' }}>Email Address</label>
                                    <input id="contact-email" type="email" className="w-full block" placeholder="john@example.com" style={{ borderRadius: '10px', padding: '10px 14px', background: 'var(--surface-elevated)', border: '1px solid var(--hairline)', color: 'var(--on-dark)', fontSize: '14px' }} />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="contact-subject" className="form-label small font-bold text-[var(--muted)] uppercase mb-1" style={{ letterSpacing: '0.5px', fontSize: '12px' }}>Subject</label>
                                    <input id="contact-subject" type="text" className="w-full block" placeholder="How can we help?" style={{ borderRadius: '10px', padding: '10px 14px', background: 'var(--surface-elevated)', border: '1px solid var(--hairline)', color: 'var(--on-dark)', fontSize: '14px' }} />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="contact-message" className="form-label small font-bold text-[var(--muted)] uppercase mb-1" style={{ letterSpacing: '0.5px', fontSize: '12px' }}>Message</label>
                                    <textarea id="contact-message" className="w-full block" rows="3" placeholder="Tell us more..." style={{ borderRadius: '10px', padding: '10px 14px', background: 'var(--surface-elevated)', border: '1px solid var(--hairline)', color: 'var(--on-dark)', fontSize: '14px' }}></textarea>
                                </div>
                                <div className="md:col-span-2 mt-4">
                                    <button type="submit" className="button-primary w-full flex items-center justify-center" style={{ padding: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '15px' }}>
                                        Send Message <ArrowRight size={16} className="ml-2" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Footer Section ---
