
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/frontend/ui/layout/ThemeToggle';
import { ShieldCheck, Cpu, ClipboardList, Shield, Sparkles, ArrowDownCircle, CheckCircle2, Quote, Mail, MapPin, ArrowRight, Zap, Star } from 'lucide-react';

// --- Navbar Component ---
export function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-[90] bg-[var(--surface-card)] border-b border-[var(--hairline)]" style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', height: '60px' }}>
      <div className="w-full max-w-7xl mx-auto px-4 flex justify-between items-center h-full">
        <Link href="/" className="flex items-center gap-2 no-underline text-[var(--on-dark)] font-black text-xl tracking-tight">
          <ShieldCheck size={26} className="text-[var(--cta)]" />
          <span>JobScan</span>
        </Link>
        
        <div className="nav-actions flex items-center">
          <ThemeToggle />
          <Link href="/dashboard/analyzer" className="btn-glow ml-3" style={{ padding: '8px 20px' }}>
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

// --- Hero Section ---
export function HeroSection() {
    return (
        <section
            id="hero"
            className="flex flex-col items-center justify-center text-center fade-in-section is-visible"
            style={{
                minHeight: '90vh',
                padding: '120px 20px 60px',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--canvas)',
            }}
        >
            <div
                className="hero-bg-overlay"
                style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 0,
                }}
            >
                <Image
                    src="/hero_bg.png"
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
            </div>

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

            <div
                className="max-w-7xl mx-auto px-4"
                style={{ position: 'relative', zIndex: 1 }}
            >
                <div className="flex justify-center mb-4">
                    <div
                        className="inline-flex items-center"
                        style={{
                            padding: '8px 20px',
                            borderRadius: 24,
                            background: 'rgba(var(--cta-rgb), 0.12)',
                            border: '1px solid rgba(var(--cta-rgb), 0.3)',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: 'var(--cta)',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                        }}
                    >
                        <ShieldCheck size={16} className="mr-2" /> New Smart AI Engine
                    </div>
                </div>
                <h1
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
                </h1>
                <p
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
                </p>
                <div className="flex gap-3 justify-center mb-5">
                    <Link href="/dashboard/analyzer" className="button-primary flex items-center">
                        <ShieldCheck size={20} className="mr-2" /> Start Scanning Free
                    </Link>
                    <a href="#how-it-works" className="btn-premium-secondary flex items-center">
                        <ArrowDownCircle size={20} className="mr-2" /> How it Works
                    </a>
                </div>
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
            </div>
        </section>
    );
}

// --- How It Works Section ---
export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Paste Job Details",
      description: "Copy any job description, email, or message you find suspicious and paste it into our deep-scan analyzer.",
      icon: <ClipboardList size={28} />
    },
    {
      number: "02",
      title: "Neural AI Analysis",
      description: "Our Gemini 3.1 models scan for linguistic red flags, hidden payment requests, and employer legitimacy metrics.",
      icon: <Cpu size={28} />
    },
    {
      number: "03",
      title: "Get Trust Score",
      description: "Receive an instant 0-100 score with a detailed breakdown of why a job is flagged as safe or a high-risk scam.",
      icon: <Shield size={28} />
    },
    {
      number: "04",
      title: "Chat with Assistant",
      description: "Ask follow-up questions to our context-aware assistant for personalized safety advice on your specific job offer.",
      icon: <Sparkles size={28} />
    }
  ];

  return (
    <section id="how-it-works" className="py-5" style={{ background: 'var(--canvas)', position: 'relative', overflow: 'hidden' }}>
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="text-center mb-5">
          <div className="tag mb-3" style={{ color: 'var(--cta)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px' }}>Workflow</div>
          <h2 className="mb-4" style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '-1.5px' }}>
            Simple Steps to <span className="text-gradient">Career Safety</span>
          </h2>
          <p className="mx-auto text-secondary" style={{ maxWidth: '600px', fontSize: '18px' }}>
            Our advanced AI does the heavy lifting, giving you peace of mind in just seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {steps.map((step, index) => (
            <div key={index}>
              <div className="glass-card h-100 p-4 step-card" style={{ 
                borderRadius: '24px', 
                border: '1px solid var(--hairline-strong)',
                position: 'relative',
                transition: 'all 0.4s ease'
              }}>
                <div className="step-number" style={{ 
                  fontSize: '60px', 
                  fontWeight: 900, 
                  opacity: 0.05, 
                  position: 'absolute', 
                  top: '10px', 
                  right: '20px',
                  lineHeight: 1,
                  color: 'var(--on-dark)'
                }}>
                  {step.number}
                </div>
                
                <div className="step-icon-wrap mb-4" style={{ 
                  width: '60px', 
                  height: '60px', 
                  background: 'rgba(var(--cta-rgb), 0.1)', 
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  color: 'var(--cta)',
                  border: '1px solid rgba(var(--cta-rgb), 0.2)'
                }}>
                  {step.icon}
                </div>

                <h4 style={{ fontWeight: 800, marginBottom: '12px', fontSize: '20px' }}>{step.title}</h4>
                <p className="text-[var(--muted)] mb-0" style={{ fontSize: '15px', lineHeight: '1.6' }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- About Section ---
export function AboutSection() {
    return (
        <section id="about" className="py-5 bg-surface-elevated" style={{ borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' }}>
            <div className="max-w-7xl mx-auto px-4 py-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
                    <div>
                        <div className="about-image-wrap relative w-fit mx-auto">
                            <div className="glass-card p-2 mx-auto" style={{ borderRadius: '24px', transform: 'rotate(-2deg)', background: 'var(--surface-elevated)', border: '1px solid var(--hairline-strong)', maxWidth: '300px' }}>
                                <Image 
                                    src="/simple_analysis.png" 
                                    alt="Job Analysis" 
                                    width={300}
                                    height={220}
                                    className="max-w-full h-auto" 
                                    style={{ borderRadius: '18px', width: '100%', height: 'auto', display: 'block' }}
                                />
                            </div>
                            <div className="glass-card p-3 absolute" style={{ bottom: '-20px', right: '-20px', borderRadius: '16px', transform: 'rotate(4deg)', maxWidth: '200px' }}>
                                <div className="flex items-center gap-3">
                                    <div className="stat-icon" style={{ background: 'var(--cta)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ShieldCheck className="text-white mx-auto" />
                                    </div>
                                    <div>
                                        <div className="font-bold" style={{ fontSize: '18px' }}>99.2%</div>
                                        <div className="text-[var(--muted)]" style={{ fontSize: '12px' }}>Accuracy Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
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
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Features Section ---
export function FeaturesSection() {
    return (
        <section
            id="features"
            className="py-5 fade-in-section is-visible"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <div className="feature-card text-center h-100">
                            <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(var(--cta-rgb), 0.15) 0%, rgba(var(--primary-rgb), 0.1) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--cta)' }}>
                                <Cpu size={28} />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: 12 }}>AI-Powered Analysis</h3>
                            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                Advanced machine learning detects hundreds of scam patterns used by fraudsters.
                            </p>
                        </div>
                    </div>
                    <div>
                        <div className="feature-card text-center h-100">
                            <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--cta-rgb), 0.1) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--primary)' }}>
                                <Zap size={28} />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: 12 }}>Instant Results</h3>
                            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                Get comprehensive analysis with trust scores and detailed insights instantly.
                            </p>
                        </div>
                    </div>
                    <div>
                        <div className="feature-card text-center h-100">
                            <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.1) 0%, rgba(var(--cta-rgb), 0.15) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--cta)' }}>
                                <Shield size={28} />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: 12 }}>100% Private & Secure</h3>
                            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                Your data is never stored or shared. Complete privacy for every analysis.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Testimonials Section ---
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div key={i}>
                            <div className="glass-card testimonial-card h-100 p-4 transition-all hover-lift" style={{ 
                                borderRadius: '24px', 
                                border: '1px solid var(--hairline-strong)',
                                background: 'rgba(var(--surface-card-rgb), 0.1)',
                                position: 'relative'
                            }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <Image 
                                        src={t.image} 
                                        alt={t.name} 
                                        width={56}
                                        height={56}
                                        style={{ borderRadius: '16px', objectFit: 'cover', border: '2px solid var(--hairline)' }} 
                                    />
                                    <div>
                                        <h5 className="mb-0" style={{ fontWeight: 800 }}>{t.name}</h5>
                                        <div className="text-[var(--muted)]" style={{ fontSize: '12px', fontWeight: 500 }}>{t.role}</div>
                                        <div className="stars mt-1 flex text-[#FFD700]" aria-label="5 stars rating" role="img">
                                            <Star className="mr-1" size={12} fill="currentColor" aria-hidden="true" />
                                            <Star className="mr-1" size={12} fill="currentColor" aria-hidden="true" />
                                            <Star className="mr-1" size={12} fill="currentColor" aria-hidden="true" />
                                            <Star className="mr-1" size={12} fill="currentColor" aria-hidden="true" />
                                            <Star size={12} fill="currentColor" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="ml-auto hidden xl:block">
                                        <Quote size={32} className="text-[var(--muted)] opacity-25" />
                                    </div>
                                </div>
                                <p className="mb-0" style={{ fontSize: '15px', lineHeight: '1.7', fontStyle: 'italic', color: 'var(--body)' }}>
                                    &quot;{t.content}&quot;
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-5 pt-5">
                    <div className="glass-card py-4 px-2" style={{ borderRadius: '24px', background: 'rgba(var(--surface-elevated-rgb), 0.3)', border: '1px solid var(--hairline)', textAlign: 'center' }}>
                        <p className="text-[var(--muted)] mb-4 small text-uppercase font-bold" style={{ letterSpacing: '3px', opacity: 0.6 }}>
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
                                    <label htmlFor="contact-name" className="form-label small font-bold text-[var(--muted)] uppercase mb-1" style={{ letterSpacing: '0.5px', fontSize: '11px' }}>Full Name</label>
                                    <input id="contact-name" type="text" className="w-full block" placeholder="John Doe" style={{ borderRadius: '10px', padding: '10px 14px', background: 'var(--surface-elevated)', border: '1px solid var(--hairline)', color: 'var(--on-dark)', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label htmlFor="contact-email" className="form-label small font-bold text-[var(--muted)] uppercase mb-1" style={{ letterSpacing: '0.5px', fontSize: '11px' }}>Email Address</label>
                                    <input id="contact-email" type="email" className="w-full block" placeholder="john@example.com" style={{ borderRadius: '10px', padding: '10px 14px', background: 'var(--surface-elevated)', border: '1px solid var(--hairline)', color: 'var(--on-dark)', fontSize: '14px' }} />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="contact-subject" className="form-label small font-bold text-[var(--muted)] uppercase mb-1" style={{ letterSpacing: '0.5px', fontSize: '11px' }}>Subject</label>
                                    <input id="contact-subject" type="text" className="w-full block" placeholder="How can we help?" style={{ borderRadius: '10px', padding: '10px 14px', background: 'var(--surface-elevated)', border: '1px solid var(--hairline)', color: 'var(--on-dark)', fontSize: '14px' }} />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="contact-message" className="form-label small font-bold text-[var(--muted)] uppercase mb-1" style={{ letterSpacing: '0.5px', fontSize: '11px' }}>Message</label>
                                    <textarea id="contact-message" className="w-full block" rows="3" placeholder="Tell us more..." style={{ borderRadius: '10px', padding: '10px 14px', background: 'var(--surface-elevated)', border: '1px solid var(--hairline)', color: 'var(--on-dark)', fontSize: '14px' }}></textarea>
                                </div>
                                <div className="md:col-span-2 mt-4">
                                    <button type="submit" className="button-primary w-100 flex items-center justify-center" style={{ padding: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '15px' }}>
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
                                <h5 style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: 'var(--on-dark)', letterSpacing: '-0.5px' }}>JobScan</h5>
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
                                <h6 style={{ fontWeight: 800, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '24px', color: 'var(--on-dark)' }}>Product</h6>
                                <ul className="flex flex-col gap-3">
                                    <li><a href="#features" className="footer-link-premium" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '15px' }}>Features</a></li>
                                    <li><a href="#about" className="footer-link-premium" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '15px' }}>About Us</a></li>
                                    <li><a href="#testimonials" className="footer-link-premium" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '15px' }}>Testimonials</a></li>
                                </ul>
                            </div>
                            <div>
                                <h6 style={{ fontWeight: 800, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '24px', color: 'var(--on-dark)' }}>Legal</h6>
                                <ul className="flex flex-col gap-3">
                                    <li><Link href="/privacy" className="footer-link-premium" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '15px' }}>Privacy Policy</Link></li>
                                    <li><Link href="/terms" className="footer-link-premium" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '15px' }}>Terms of Service</Link></li>
                                    <li><a href="#contact" className="footer-link-premium" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '15px' }}>Contact</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
 
                    <div className="md:col-span-4 lg:col-span-3">
                        <h6 style={{ fontWeight: 800, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '24px', color: 'var(--on-dark)' }}>Stay Secure</h6>
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
