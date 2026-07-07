'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/core/providers/auth-provider';
import { ThemeToggle } from '@/core/ui/ThemeToggle';
import { ShieldCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/ui/navigation";
import { m } from 'motion/react';
import { scaleUp } from '@/core/motion';

import dynamic from 'next/dynamic';
const AuthBackground = dynamic(() => import('./components/AuthBackground').then(mod => mod.AuthBackground), { ssr: false });

import { AuthSidebar } from './components/AuthSidebar';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';

function AuthContent() {
    const searchParams = useSearchParams();
    const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

    const [mode, setMode] = useState(initialMode);
    const [prevSearchMode, setPrevSearchMode] = useState(initialMode);

    if (searchParams.get('mode') !== prevSearchMode) {
        const m = searchParams.get('mode');
        setPrevSearchMode(m);
        if (m === 'signup' || m === 'login') {
            setMode(m);
        }
    }
    
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            router.push(callbackUrl);
        }
    }, [user, authLoading, router, callbackUrl]);

    // Mode synced during render

    if (authLoading || (user && !authLoading)) {
        return null; // Or a spinner
    }

    return (
        <div className="auth-page-container">
            <AuthBackground />

            {/* Absolute Navbar */}
            <nav className="absolute top-0 left-0 right-0 h-[70px] flex justify-between items-center px-6 md:px-12 z-50 bg-transparent">
                <Link href="/" className="flex items-center gap-2 group text-decoration-none">
                    <ShieldCheck size={26} className="text-[var(--cta)] transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-extrabold text-xl text-[var(--on-dark)] tracking-tight">JobScan</span>
                </Link>
                <ThemeToggle />
            </nav>

            {/* Card Wrapper with Animated Rotating Border Glow */}
            <m.div className="auth-card-wrapper z-10 mx-4" variants={scaleUp} initial="hidden" animate="visible">
                <div className="auth-card-inner">
                    
                    <AuthSidebar mode={mode} />

                    {/* Right Form Panels Container */}
                    <div className="form-container w-full lg:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                        <Tabs value={mode} onValueChange={(val) => {
                            setMode(val);
                            router.replace(`?mode=${val}`, { scroll: false });
                        }} className="w-full max-w-[400px] mx-auto">
                            
                            <TabsList className="grid w-full grid-cols-2 mb-8 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-1 h-auto">
                                <TabsTrigger value="login" className="py-2.5 rounded-lg text-xs font-bold data-[state=active]:bg-[var(--cta)] data-[state=active]:text-white transition-all">Sign In</TabsTrigger>
                                <TabsTrigger value="signup" className="py-2.5 rounded-lg text-xs font-bold data-[state=active]:bg-[var(--cta)] data-[state=active]:text-white transition-all">Create Account</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="login" className="mt-0 outline-none">
                                <LoginForm callbackUrl={callbackUrl} />
                            </TabsContent>

                            <TabsContent value="signup" className="mt-0 outline-none">
                                <SignupForm />
                            </TabsContent>
                        </Tabs>
                    </div>

                </div>
            </m.div>
        </div>
    );
}

export default function CombinedAuthPage() {
    return (
        <Suspense
            fallback={
                <div
                    className="auth-page-container flex justify-center items-center"
                    style={{ height: '100dvh', background: 'var(--canvas)' }}
                >
                    <div className="w-8 h-8 border-4 border-[#F2613F] border-t-transparent rounded-full animate-spin" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
        >
            <AuthContent />
        </Suspense>
    );
}
