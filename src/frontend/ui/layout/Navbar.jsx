'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/frontend/context/auth-context';
import { ThemeToggle } from '@/frontend/ui/layout/ThemeToggle';
import { ShieldCheck, LogOut, LogIn, LayoutGrid, History, User, Settings, Menu, X, Download } from 'lucide-react';
import { usePwa } from '@/frontend/context/pwa-context';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/frontend/ui/overlay/Sheet';

// --- TopNavbar Component ---
export function TopNavbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tabParam = searchParams?.get('tab') || 'overview';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
    };

    // Body scroll lock on mobile navigation drawer trigger
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    // Automatically close mobile menu when tab/pathname changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname, tabParam]);

    const { isInstallable, installApp } = usePwa();

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const media = window.matchMedia('(max-width: 767px)');
        setIsMobile(media.matches);
        const listener = (e) => setIsMobile(e.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, []);

    return (
        <>
            <header
                className="top-navbar px-4 md:px-8 py-2 sticky top-0 z-[100] md:z-[1000] h-[70px] flex items-center justify-between"
                style={{
                    background: 'var(--surface-card)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid var(--hairline-strong)',
                }}
            >
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .nav-capsule-link:hover .nav-icon {
                    transform: scale(1.15) rotate(3deg);
                    color: var(--cta) !important;
                }
                .nav-capsule-link .nav-icon {
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.2s ease;
                }
                .active-dot {
                    position: absolute;
                    bottom: -4px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background-color: var(--cta);
                    box-shadow: 0 0 8px var(--cta);
                }
            ` }} />

            <div className="flex items-center gap-6 md:gap-10">
                <Link
                    href="/"
                    className="flex items-center gap-2.5 font-black text-xl hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--on-dark)' }}
                >
                    <ShieldCheck className="text-blue-500" size={26} />
                    <span className="tracking-tight">JobScan</span>
                </Link>
            </div>

            {user && (
                <div className="flex-1 hidden md:flex justify-center">
                    <nav
                        className="md:flex items-center gap-1.5 p-1 rounded-2xl"
                        style={{
                            background: 'rgba(var(--primary-rgb), 0.05)',
                        }}
                    >
                                <Link
                                    href="/dashboard?tab=analyzer"
                                    className={`nav-capsule-link px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 relative ${
                                        pathname === '/dashboard/analyzer' || (pathname === '/dashboard' && tabParam === 'analyzer')
                                            ? 'shadow-sm border'
                                            : 'border border-transparent'
                                    }`}
                                    style={
                                        pathname === '/dashboard/analyzer' || (pathname === '/dashboard' && tabParam === 'analyzer')
                                            ? {
                                                  background: 'var(--surface-card)',
                                                  color: 'var(--cta)',
                                                  borderColor: 'rgba(var(--cta-rgb), 0.25)',
                                                  boxShadow: '0 4px 12px rgba(var(--cta-rgb), 0.15)',
                                              }
                                            : { color: 'var(--muted)' }
                                    }
                                >
                                    <ShieldCheck size={13} className="nav-icon" /> Analyzer
                                    {(pathname === '/dashboard/analyzer' || (pathname === '/dashboard' && tabParam === 'analyzer')) && (
                                        <span className="active-dot"></span>
                                    )}
                                </Link>
                                <Link
                                    href="/dashboard?tab=overview"
                                    className={`nav-capsule-link px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 relative ${
                                        pathname === '/dashboard' && tabParam === 'overview'
                                            ? 'shadow-sm border'
                                            : 'border border-transparent'
                                    }`}
                                    style={
                                        pathname === '/dashboard' && tabParam === 'overview'
                                            ? {
                                                  background: 'var(--surface-card)',
                                                  color: 'var(--cta)',
                                                  borderColor: 'rgba(var(--cta-rgb), 0.25)',
                                                  boxShadow: '0 4px 12px rgba(var(--cta-rgb), 0.15)',
                                              }
                                            : { color: 'var(--muted)' }
                                    }
                                >
                                    <LayoutGrid size={13} className="nav-icon" /> Overview
                                    {pathname === '/dashboard' && tabParam === 'overview' && (
                                        <span className="active-dot"></span>
                                    )}
                                </Link>
                                <Link
                                    href="/dashboard?tab=history"
                                    className={`nav-capsule-link px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 relative ${
                                        pathname === '/dashboard' && tabParam === 'history'
                                            ? 'shadow-sm border'
                                            : 'border border-transparent'
                                    }`}
                                    style={
                                        pathname === '/dashboard' && tabParam === 'history'
                                            ? {
                                                  background: 'var(--surface-card)',
                                                  color: 'var(--cta)',
                                                  borderColor: 'rgba(var(--cta-rgb), 0.25)',
                                                  boxShadow: '0 4px 12px rgba(var(--cta-rgb), 0.15)',
                                              }
                                            : { color: 'var(--muted)' }
                                    }
                                >
                                    <History size={13} className="nav-icon" /> History
                                    {pathname === '/dashboard' && tabParam === 'history' && (
                                        <span className="active-dot"></span>
                                    )}
                                </Link>
                                <Link
                                    href="/dashboard?tab=profile"
                                    className={`nav-capsule-link px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 relative ${
                                        pathname === '/dashboard' && tabParam === 'profile'
                                            ? 'shadow-sm border'
                                            : 'border border-transparent'
                                    }`}
                                    style={
                                        pathname === '/dashboard' && tabParam === 'profile'
                                            ? {
                                                  background: 'var(--surface-card)',
                                                  color: 'var(--cta)',
                                                  borderColor: 'rgba(var(--cta-rgb), 0.25)',
                                                  boxShadow: '0 4px 12px rgba(var(--cta-rgb), 0.15)',
                                              }
                                            : { color: 'var(--muted)' }
                                    }
                                >
                                    <User size={13} className="nav-icon" /> Profile
                                    {pathname === '/dashboard' && tabParam === 'profile' && (
                                        <span className="active-dot"></span>
                                    )}
                                </Link>
                                <Link
                                    href="/dashboard?tab=settings"
                                    className={`nav-capsule-link px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 relative ${
                                        pathname === '/dashboard' && tabParam === 'settings'
                                            ? 'shadow-sm border'
                                            : 'border border-transparent'
                                    }`}
                                    style={
                                        pathname === '/dashboard' && tabParam === 'settings'
                                            ? {
                                                  background: 'var(--surface-card)',
                                                  color: 'var(--cta)',
                                                  borderColor: 'rgba(var(--cta-rgb), 0.25)',
                                                  boxShadow: '0 4px 12px rgba(var(--cta-rgb), 0.15)',
                                              }
                                            : { color: 'var(--muted)' }
                                    }
                                >
                                    <Settings size={13} className="nav-icon" /> Settings
                                    {pathname === '/dashboard' && tabParam === 'settings' && (
                                        <span className="active-dot"></span>
                                    )}
                                </Link>
                    </nav>
                </div>
            )}

            <div className="flex items-center gap-4">
                {/* Mobile Hamburger button - only visible on mobile when logged in */}
                {user && (
                    <button
                        onClick={() => {
                            setMobileMenuOpen(!mobileMenuOpen);
                            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
                        }}
                        className="md:hidden flex items-center justify-center p-2 rounded-xl transition-all border"
                        style={{
                            background: 'rgba(var(--primary-rgb), 0.05)',
                            borderColor: mobileMenuOpen ? 'rgba(var(--cta-rgb), 0.25)' : 'var(--hairline)',
                            color: mobileMenuOpen ? 'var(--cta)' : 'var(--muted)',
                        }}
                        title="Toggle Navigation Menu"
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                )}
                
                {/* Desktop-only action items */}
                <div className="hidden md:flex items-center gap-4">
                    {isInstallable && (
                        <button
                            onClick={installApp}
                            className="btn-premium-secondary flex items-center gap-1.5 text-xs font-black uppercase tracking-wider"
                            style={{ padding: '8px 14px', borderRadius: '10px' }}
                            title="Install JobScan Application"
                        >
                            <Download size={14} className="animate-bounce" /> Install App
                        </button>
                    )}
                    <ThemeToggle />
                    {user && (
                        <div className="flex items-center gap-3 pl-3 border-l border-[var(--hairline)]">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-inner">
                                {user.name
                                    ? user.name
                                          .split(' ')
                                          .map((n) => n[0])
                                          .join('')
                                          .toUpperCase()
                                          .substring(0, 2)
                                    : user.email
                                      ? user.email.substring(0, 2).toUpperCase()
                                      : 'U'}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-[var(--muted)] hover:text-red-500 transition-colors bg-[var(--surface-elevated)] border border-[var(--hairline)] hover:border-red-500/30 p-2 rounded-lg"
                                title="Logout"
                                aria-label="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Sign In button for guest users */}
                {!user && (
                    <Link
                        href="/auth"
                        className="btn-glow flex items-center gap-2 text-white ml-4 text-xs font-black uppercase tracking-widest shadow-lg"
                        style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '11px' }}
                    >
                        <LogIn size={13} /> Sign In
                    </Link>
                )}
            </div>

            </header>

            {/* --- Mobile Navigation Drawer (Sheet) --- */}
            {user && (
                <Sheet open={mobileMenuOpen} onOpenChange={(open) => {
                    setMobileMenuOpen(open);
                    if (open && typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
                }}>
                    <SheetContent side="right" className="w-[85vw] max-w-[320px] bg-[var(--canvas)] border-l border-[var(--hairline)] p-6 pt-[90px] flex flex-col justify-between h-full text-[var(--on-dark)] [&>button]:hidden">
                        <SheetHeader className="text-left border-b border-[var(--hairline)] pb-4 mb-4 hidden">
                            <SheetTitle className="font-black text-lg text-[var(--on-dark)]">Menu</SheetTitle>
                        </SheetHeader>
                        
                        {/* Drawer Content */}
                        <div className="flex flex-col gap-6 mt-4">
                            {/* Section 1: Compact User Info Card */}
                            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--hairline)]">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[11px] font-black shadow-inner flex-shrink-0">
                                    {user.name
                                        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
                                        : user.email ? user.email.substring(0, 2).toUpperCase() : 'U'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[11px] font-black text-[var(--on-dark)] truncate leading-tight">{user.name || 'User'}</div>
                                    <div className="text-[9px] text-[var(--muted)] truncate mt-0.5 leading-none">{user.email}</div>
                                </div>
                            </div>

                            {/* Section 2: Appearance & PWA Install */}
                            <div className="flex flex-col gap-2 bg-black/5 dark:bg-white/5 p-2.5 rounded-xl border border-[var(--hairline)]">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-wider">Theme Mode</span>
                                    <ThemeToggle />
                                </div>
                                {isInstallable && (
                                    <button
                                        onClick={() => { 
                                            setMobileMenuOpen(false); 
                                            installApp(); 
                                            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
                                        }}
                                        className="w-full flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors border border-blue-500/20"
                                    >
                                        <Download size={12} className="animate-bounce" /> Install Application
                                    </button>
                                )}
                            </div>

                            {/* Section 3: Settings & System Console Links */}
                            <nav className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest px-1.5 mb-1.5 block">Console Controls</span>
                                <Link
                                    href="/dashboard?tab=settings"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
                                    }}
                                    className={`px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 border ${
                                        pathname === '/dashboard' && tabParam === 'settings'
                                            ? 'bg-blue-500/10 text-[var(--cta)] border-[var(--cta)]/20 shadow-sm'
                                            : 'border-transparent text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--on-dark)]'
                                    }`}
                                >
                                    <Settings size={14} /> Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
                                        alert("JobScan - AI Scam Detector v1.0.0. Designed for MCA Final-Year Project Demonstration.");
                                    }}
                                    className="px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 border border-transparent text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--on-dark)] text-left w-full bg-transparent"
                                >
                                    <ShieldCheck size={14} /> About JobScan
                                </button>
                            </nav>
                        </div>

                        {/* Section 4: Exit Actions */}
                        <div className="flex flex-col gap-4 border-t border-[var(--hairline)] pt-4 mt-auto">
                            <button
                                onClick={(e) => { 
                                    setMobileMenuOpen(false); 
                                    handleLogout(e); 
                                    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
                                }}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 hover:border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-wider transition-colors"
                            >
                                <LogOut size={14} /> Sign Out
                            </button>
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </>
    );
}
