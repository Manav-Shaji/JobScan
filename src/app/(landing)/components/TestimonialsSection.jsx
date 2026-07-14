'use client';

/**
 * ------------------------------------------------------------
 * Component: TestimonialsSection
 * 
 * Purpose:
 * Renders a display of user testimonials and featured media trust badges to build social proof.
 * 
 * Responsibilities:
 * • Maps and renders testimonial data cards with animation effects.
 * • Displays a trusted-by banner showcasing industry publications.
 * 
 * Used By:
 * • LandingPage
 * ------------------------------------------------------------
 */


/**
 * ------------------------------------------------------------
 * Component: TestimonialsSection
 * 
 * Purpose:
 * Renders a display of user testimonials and featured media trust badges to build social proof.
 * 
 * Responsibilities:
 * • Maps and renders testimonial data cards with animation effects.
 * • Displays a trusted-by banner showcasing industry publications.
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

export function TestimonialsSection() {
    const testimonials = [
        {
            name: "Sarah Jenkins",
            role: "Product Designer",
            content: "JobScan caught a 'too good to be true' offer that looked 100% legitimate. It literally saved me from a phishing scam that was targeting my bank details.",
            image: "/profile1.png",
            color: "var(--cta)"
        },
        {
            name: "Michael Chen",
            role: "Software Engineer",
            content: "The level of detail in the analysis is insane. It doesn't just say 'scam', it explains the linguistic tricks being used. A must-have for any active job seeker.",
            image: "/profile2.png",
            color: "var(--primary)"
        },
        {
            name: "Elena Rodriguez",
            role: "Marketing Manager",
            content: "Simple, fast, and powerful. I scan every LinkedIn reach-out I get now. It's become my primary filter for legitimate opportunities.",
            image: "/profile3.png",
            color: "#FFD700"
        }
    ];

    return (
        <section id="testimonials" className="py-5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 py-5">
                <div className="text-center mb-5">
                    <div className="tag mb-3" style={{ color: 'var(--cta)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px' }}>Testimonials</div>
                    <h2 style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '-1.5px' }}>Trusted by <span className="text-gradient">Seekers</span> worldwide.</h2>
                </div>
                <m.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
                    {testimonials.map((t, i) => (
                        <m.div key={i} variants={slideUp} className={`h-full ${i === 1 ? 'testimonial-stagger-2' : ''}`}>
                            <div className="glass-card testimonial-card h-full flex flex-col justify-between p-6 transition hover-lift" style={{ 
                                borderRadius: '24px', 
                                border: '1px solid var(--hairline-strong)',
                                background: 'rgba(var(--surface-card-rgb), 0.3)',
                                position: 'relative',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                            }}>
                                <div className="flex items-center gap-4 mb-4">
                                    <Image 
                                        src={t.image} 
                                        alt={t.name} 
                                        width={60}
                                        height={60}
                                        style={{ borderRadius: '18px', objectFit: 'cover', border: '2px solid rgba(var(--cta-rgb), 0.3)' }} 
                                    />
                                    <div>
                                        <h3 className="mb-0" style={{ fontWeight: 800, fontSize: '18px', color: 'var(--on-dark)' }}>{t.name}</h3>
                                        <div className="text-[var(--text-secondary)]" style={{ fontSize: '13px', fontWeight: 600 }}>{t.role}</div>
                                        <div className="stars mt-2 flex" style={{ color: '#F59E0B' }} aria-label="5 stars rating" role="img">
                                            <Star className="mr-1" size={14} fill="currentColor" aria-hidden="true" />
                                            <Star className="mr-1" size={14} fill="currentColor" aria-hidden="true" />
                                            <Star className="mr-1" size={14} fill="currentColor" aria-hidden="true" />
                                            <Star className="mr-1" size={14} fill="currentColor" aria-hidden="true" />
                                            <Star size={14} fill="currentColor" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="ml-auto hidden xl:block">
                                        <Quote size={40} style={{ color: 'var(--cta)', opacity: 0.15 }} />
                                    </div>
                                </div>
                                <p className="mb-0" style={{ fontSize: '16px', lineHeight: '1.7', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                    &quot;{t.content}&quot;
                                </p>
                            </div>
                        </m.div>
                    ))}
                </m.div>
                
                <div className="mt-5 pt-5">
                    <div className="glass-card py-4 px-2" style={{ borderRadius: '24px', background: 'rgba(var(--surface-elevated-rgb), 0.3)', border: '1px solid var(--hairline)', textAlign: 'center' }}>
                        <p className="text-[var(--text-secondary)] mb-4 small text-uppercase font-bold" style={{ letterSpacing: '3px' }}>
                            Featured & Trusted By Industry Leaders
                        </p>
                        <div className="flex flex-wrap justify-center items-center gap-5 px-4">
                            <div className="trust-logo-item"><span style={{ fontWeight: 900, fontSize: '22px', color: 'var(--on-dark)', opacity: 0.4, letterSpacing: '-0.5px' }}>FORBES</span></div>
                            <div className="trust-logo-divider hidden md:block" style={{ height: '24px', width: '1px', background: 'var(--hairline)' }}></div>
                            <div className="trust-logo-item"><span style={{ fontWeight: 800, fontSize: '20px', color: 'var(--on-dark)', opacity: 0.4 }}>TechCrunch</span></div>
                            <div className="trust-logo-divider hidden md:block" style={{ height: '24px', width: '1px', background: 'var(--hairline)' }}></div>
                            <div className="trust-logo-item"><span style={{ fontWeight: 900, fontSize: '22px', color: 'var(--on-dark)', opacity: 0.4, letterSpacing: '1px' }}>WIRED</span></div>
                            <div className="trust-logo-divider hidden md:block" style={{ height: '24px', width: '1px', background: 'var(--hairline)' }}></div>
                            <div className="trust-logo-item"><span style={{ fontWeight: 800, fontSize: '20px', color: 'var(--on-dark)', opacity: 0.4 }}>TheVerge</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Contact Section ---
