'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/core/ui/ThemeToggle';
import { ShieldCheck, Cpu, ClipboardList, Shield, Sparkles, ArrowDownCircle, CheckCircle2, Quote, Mail, MapPin, ArrowRight, Zap, Star } from 'lucide-react';
import { m } from 'motion/react';
import { staggerContainer, slideUp, buttonGestures } from '@/core/motion';

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Paste Job Details",
      description: "Copy any job description, email, or message you find suspicious and paste it into our deep-scan analyzer.",
      icon: <ClipboardList size={18} />
    },
    {
      number: "02",
      title: "Neural AI Analysis",
      description: "Our Gemini 3.1 models scan for linguistic red flags, hidden payment requests, and employer legitimacy metrics.",
      icon: <Cpu size={18} />
    },
    {
      number: "03",
      title: "Get Trust Score",
      description: "Receive an instant 0-100 score with a detailed breakdown of why a job is flagged as safe or a high-risk scam.",
      icon: <Shield size={18} />
    },
    {
      number: "04",
      title: "Chat with Assistant",
      description: "Ask follow-up questions to our context-aware assistant for personalized safety advice on your specific job offer.",
      icon: <Sparkles size={18} />
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

        <m.div 
          className="bento-grid mt-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, index) => (
            <m.div 
              key={index} 
              variants={slideUp}
              className={`bento-item ${index === 0 || index === 3 ? 'bento-span-8' : 'bento-span-4'}`}
            >
                <div className="watermark-text">{step.number}</div>
                
                <div className={`relative z-10 flex h-full ${index === 0 || index === 3 ? 'flex-col md:flex-row md:items-center gap-6 md:gap-8' : 'flex-col'}`}>
                  <div className={`bento-icon-wrapper shrink-0 ${index === 0 || index === 3 ? 'mb-4 md:mb-0' : 'mb-6'}`} style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'linear-gradient(135deg, rgba(var(--cta-rgb), 0.1), rgba(var(--cta-rgb), 0.05))', 
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--cta)',
                    border: '1px solid rgba(var(--cta-rgb), 0.2)',
                    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1)'
                  }}>
                    {step.icon}
                  </div>
  
                  <div>
                    <h4 style={{ fontWeight: 800, marginBottom: '12px', fontSize: '22px', letterSpacing: '-0.5px', color: 'var(--on-dark)' }}>{step.title}</h4>
                    <p className="text-[var(--text-secondary)] mb-0" style={{ fontSize: '16px', lineHeight: '1.6' }}>{step.description}</p>
                  </div>
                </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}

// --- About Section ---
