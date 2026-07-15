'use client';

/**
 * ------------------------------------------------------------
 * Component: features.jsx
 * 
 * Purpose:
 * Provides visual feedback components for job trust verification and user access gatekeeping.
 * 
 * Responsibilities:
 * • TrustScore: Renders animated gauges to display and interpret security assessment results.
 * • SignupWall: Displays a modal overlay to prompt authentication when usage limits are exceeded.
 * 
 * Used By:
 * • Job Analysis Dashboard
 * ------------------------------------------------------------
 */


import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/core/ui/dialog";
import { Shield, Infinity, History, TrendingUp, MessageSquare, Rocket } from 'lucide-react';

// --- TrustScore Component ---
export function TrustScore({ score = 0, visible = false }) {
    const [displayScore, setDisplayScore] = useState(0);
    const intervalRef = useRef(null);

    const scoreInfo = (() => {
        // Lower score = Scam
        if (score <= 40) return { 
            color: '#ef4444', 
            status: 'Likely Scam', 
            msg: 'Multiple red flags detected. Highly suspicious.',
            themeClass: 'bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
            dotClass: 'bg-red-500',
            gradientId: 'scamGradient'
        };
        if (score <= 70) return { 
            color: '#f59e0b', 
            status: 'Suspicious', 
            msg: 'Some irregularities found. Proceed with caution.',
            themeClass: 'bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
            dotClass: 'bg-amber-500',
            gradientId: 'warningGradient'
        };
        return { 
            color: '#10b981', 
            status: 'Very Safe', 
            msg: 'Job description appears legitimate.',
            themeClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
            dotClass: 'bg-emerald-500',
            gradientId: 'safeGradient'
        };
    })();

    useEffect(() => {
        if (!visible || score === 0) return;
        let startTimestamp = null;
        const duration = 1500;
        const animate = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            setDisplayScore(Math.floor(easedProgress * score));
            if (progress < 1) intervalRef.current = requestAnimationFrame(animate);
        };
        intervalRef.current = requestAnimationFrame(animate);
        return () => { if (intervalRef.current) cancelAnimationFrame(intervalRef.current); };
    }, [score, visible]);

    const { color, status, msg, themeClass, dotClass, gradientId } = scoreInfo;
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    // For Trust Score, higher is better (more filled). For scams (low score), we might want the red to fill up from the other side, but standard is just filling to the score.
    // Let's just fill the score amount.
    const actualDisplayScore = (!visible || score === 0) ? 0 : displayScore;
    const strokeDashoffset = circumference - (actualDisplayScore / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center w-full" aria-label={`Trust Score ${actualDisplayScore} percent`} role="img">
            <div className="relative flex items-center justify-center w-40 h-40 mb-4">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl relative z-0" viewBox="0 0 200 200">
                    <defs>
                        <linearGradient id="safeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                        <linearGradient id="scamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f87171" />
                            <stop offset="100%" stopColor="#b91c1c" />
                        </linearGradient>
                    </defs>
                    {/* Background track with premium deep overlay */}
                    <circle cx="100" cy="100" r={radius} stroke="var(--hairline-strong)" strokeWidth="12" fill="transparent" />
                    {/* Progress ring with high-contrast gradient/glow */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        stroke={`url(#${gradientId})`}
                        strokeWidth="12"
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition duration-300 ease-out"
                        style={{ 
                            filter: `drop-shadow(0 0 10px ${color}70)`
                        }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <span className="font-black tracking-tighter transition leading-none text-5xl lg:text-6xl flex items-baseline z-10" style={{ 
                        color,
                        textShadow: `0 0 15px ${color}60, 0 0 35px ${color}30`
                    }}>
                        {actualDisplayScore}
                        <span className="text-xl lg:text-2xl ml-0.5">%</span>
                    </span>
                    <span className="text-[9px] text-[var(--muted)] font-black tracking-[0.15em] mt-1.5 uppercase">Trust Score</span>
                </div>
            </div>
            
            <div className="px-5 py-2 rounded-full border-2 mb-3 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition" style={{
                backgroundColor: `${color}12`,
                borderColor: `${color}80`,
                color: color,
                boxShadow: `0 4px 15px ${color}15`
            }}>
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotClass}`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dotClass}`}></span>
                </span>
                {status}
            </div>
            
            <p className="text-center text-[var(--body)] text-[11px] max-w-[250px] leading-relaxed m-0 font-medium">
                {msg}
            </p>
        </div>
    );
};

// --- SignupWall Component ---
export function SignupWall({ onClose }) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none bg-transparent">
        <div className="signup-wall-modal w-full">
          <div className="signup-wall-icon">
            <div className="signup-wall-icon-inner"><Shield size={32} /></div>
            <div className="signup-wall-icon-pulse"></div>
          </div>
          <DialogHeader className="p-0">
            <DialogTitle className="signup-wall-title text-center">Free Scans Exhausted</DialogTitle>
            <DialogDescription className="signup-wall-subtitle text-center">
              You&apos;ve used all 3 free scans. Create a free account to unlock unlimited scans.
            </DialogDescription>
          </DialogHeader>
          <div className="signup-wall-benefits">
            {[
              { icon: <Infinity size={20} />, text: 'Unlimited job scans' },
              { icon: <History size={20} />, text: 'Full scan history' },
              { icon: <TrendingUp size={20} />, text: 'Analytics dashboard' },
              { icon: <MessageSquare size={20} />, text: 'AI chat assistant' },
            ].map((benefit, i) => (
              <div key={i} className="signup-wall-benefit">
                {benefit.icon}
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
          <div className="signup-wall-actions">
            <Link href="/auth?mode=signup" className="button-primary signup-wall-cta">
              <Rocket size={18} className="mr-2" />Create Free Account
            </Link>
            <Link href="/auth" className="signup-wall-login-link">Already have an account? <strong>Sign In</strong></Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
