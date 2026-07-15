'use client';

/**
 * ------------------------------------------------------------
 * Component: Navbar
 * 
 * Purpose:
 * Provides the site-wide navigation header for the JobScan application.
 * 
 * Responsibilities:
 * • Displays the brand identity and navigation links.
 * • Integrates the theme toggle functionality for UI consistency.
 * 
 * Used By:
 * • Root Layout
 * ------------------------------------------------------------
 */


import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/core/ui/ThemeToggle';
import { ShieldCheck, Cpu, ClipboardList, Shield, Sparkles, ArrowDownCircle, CheckCircle2, Quote, Mail, MapPin, ArrowRight, Zap, Star } from 'lucide-react';
import { m } from 'motion/react';
import { staggerContainer, slideUp, buttonGestures } from '@/core/motion';

export function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-[90] bg-[var(--surface-card)] border-b border-[var(--hairline)]" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', height: '60px' }}>
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
