'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/frontend/context/auth-context';
import { ThemeToggle } from '@/frontend/ui/layout/ThemeToggle';
import { 
    ShieldCheck, 
    AlertTriangle, 
    Eye, 
    EyeOff, 
    Sparkles, 
    Shield, 
    FileText, 
    Globe, 
    Smartphone 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/ui/navigation";

function AuthContent() {
    const searchParams = useSearchParams();
    const initialMode =
        searchParams.get('mode') === 'signup' ? 'signup' : 'login';

    const [mode, setMode] = useState(initialMode);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [particles, setParticles] = useState([]);

    const { login, register, user, loading: authLoading } = useAuth();
    const router = useRouter();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            router.push(callbackUrl);
        }
    }, [user, authLoading, router, callbackUrl]);

    // Update mode if query param changes
    useEffect(() => {
        const m = searchParams.get('mode');
        if (m === 'signup' || m === 'login') {
            setMode(m);
        }
    }, [searchParams]);

    // Client-side dynamic background particles generator
    useEffect(() => {
        const list = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 80 + 10,
            size: Math.random() * 3 + 2,
            delay: Math.random() * 5,
            duration: Math.random() * 8 + 6,
        }));
        setParticles(list);
    }, []);

    if (authLoading || (user && !authLoading)) {
        return null; // Or a spinner
    }

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (mode === 'login') {
            const result = await login(formData.email, formData.password, formData.rememberMe);
            if (result.success) {
                router.push(callbackUrl);
                router.refresh();
            } else {
                let userFriendlyError = result.message || 'Invalid email or password';
                if (result.message?.includes('credentials') || result.message?.toLowerCase().includes('match') || result.message?.toLowerCase().includes('invalid') || result.message?.toLowerCase().includes('unauthorized')) {
                    userFriendlyError = 'Authentication failed. Please verify your credentials and try again.';
                } else if (result.message?.includes('authorized') || result.message?.includes('admin')) {
                    userFriendlyError = 'Access restricted. Administrator privileges are required to enter the core panel.';
                }
                setError(userFriendlyError);
            }
        } else {
            const result = await register(
                formData.name,
                formData.email,
                formData.password,
            );
            if (result.success) {
                router.push('/dashboard');
                router.refresh();
            } else {
                let userFriendlyError = result.message || 'Failed to create account';
                if (result.message?.includes('exists') || result.message?.toLowerCase().includes('taken') || result.message?.toLowerCase().includes('duplicate')) {
                    userFriendlyError = 'An account with this email address already exists. Please sign in instead.';
                }
                setError(userFriendlyError);
            }
        }
        setLoading(false);
    };

    // Client-side password strength checker
    const getPasswordStrength = (pwd) => {
        if (!pwd) return { score: 0, label: '', color: 'bg-transparent', text: 'text-gray-400' };
        let score = 0;
        if (pwd.length >= 6) score += 1;
        if (pwd.length >= 8 && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score += 1;
        if (pwd.length >= 10 && /[A-Z]/.test(pwd)) score += 1;
        
        if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500', text: 'text-red-400' };
        if (score === 2) return { score: 2, label: 'Medium', color: 'bg-amber-500', text: 'text-amber-400' };
        return { score: 3, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
    };

    return (
        <div className="auth-page-container">
            {/* Background Layer with animated mesh grid, floating blobs and drift particles */}
            <div className="absolute inset-0 z-0 bg-[var(--canvas)] overflow-hidden pointer-events-none">
                {/* Animated Mesh Grid */}
                <div 
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.03) 1px, transparent 1px), 
                                          linear-gradient(90deg, rgba(14, 165, 233, 0.03) 1px, transparent 1px)`,
                        backgroundSize: '32px 32px'
                    }}
                ></div>
                
                {/* Floating Blurred Blobs */}
                <div 
                    className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[130px] opacity-15 dark:opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(15, 23, 42, 0.8) 0%, transparent 70%)',
                        animation: 'blob 18s infinite alternate ease-in-out'
                    }}
                ></div>
                <div 
                    className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[130px] opacity-10 dark:opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(3, 105, 161, 0.5) 0%, transparent 70%)',
                        animation: 'blob 22s infinite alternate ease-in-out',
                        animationDelay: '3s'
                    }}
                ></div>
                <div 
                    className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full blur-[120px] opacity-5 dark:opacity-15"
                    style={{
                        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, transparent 70%)',
                        animation: 'blob 15s infinite alternate ease-in-out',
                        animationDelay: '6s'
                    }}
                ></div>

                {/* Drifting Particles */}
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="particle"
                        style={{
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            animationDelay: `${p.delay}s`,
                            animationDuration: `${p.duration}s`
                        }}
                    />
                ))}
            </div>

            {/* Absolute Navbar */}
            <nav className="absolute top-0 left-0 right-0 h-[70px] flex justify-between items-center px-6 md:px-12 z-50 bg-transparent">
                <Link href="/" className="flex items-center gap-2 group text-decoration-none">
                    <ShieldCheck size={26} className="text-[var(--cta)] transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-extrabold text-xl text-[var(--on-dark)] tracking-tight">JobScan</span>
                </Link>
                <ThemeToggle />
            </nav>

            {/* Card Wrapper with Animated Rotating Border Glow */}
            <div className="auth-card-wrapper fade-in-section is-visible z-10 mx-4">
                <div className="auth-card-inner">
                    
                    {/* Left Branding Panel */}
                    <div className="branding-panel hidden lg:block">
                        <div className="branding-content flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-center gap-2 mb-10">
                                    <ShieldCheck size={28} className="text-[var(--cta)]" />
                                    <span className="font-black text-xl text-white tracking-wide">JobScan</span>
                                </div>
                                <h2 className="brand-headline">
                                    {mode === 'login'
                                        ? 'Intelligent analysis for job security.'
                                        : 'Start your secure job search today.'}
                                </h2>
                                <p className="brand-subtitle">
                                    {mode === 'login'
                                        ? 'The ultimate analysis engine for detecting employment fraud. Powered by deterministic intelligence and linguistic verification.'
                                        : 'Join thousands of professionals using JobScan to verify employment opportunities and avoid fraud.'}
                                </p>
                            </div>

                            <div>
                                <div className="trust-stats grid grid-cols-3 gap-3.5 my-8">
                                    <div className="trust-stat p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-[var(--cta)]/30 hover:shadow-[0_8px_20px_rgba(var(--cta-rgb),0.1)] transition-all duration-300 flex flex-col items-center justify-center text-center group/stat">
                                        <span className="stat-num text-2xl font-black text-white leading-none mb-1.5 transition-transform duration-300 group-hover/stat:scale-105 group-hover/stat:text-[var(--cta-hover)] drop-shadow-[0_2px_6px_rgba(var(--cta-rgb),0.3)]">1.2K+</span>
                                        <span className="stat-text text-[9px] font-bold text-gray-400 tracking-wider uppercase transition-colors duration-300 group-hover/stat:text-gray-300">Daily Scans</span>
                                    </div>
                                    <div className="trust-stat p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-[var(--cta)]/30 hover:shadow-[0_8px_20px_rgba(var(--cta-rgb),0.1)] transition-all duration-300 flex flex-col items-center justify-center text-center group/stat">
                                        <span className="stat-num text-2xl font-black text-white leading-none mb-1.5 transition-transform duration-300 group-hover/stat:scale-105 group-hover/stat:text-[var(--cta-hover)] drop-shadow-[0_2px_6px_rgba(var(--cta-rgb),0.3)]">99.2%</span>
                                        <span className="stat-text text-[9px] font-bold text-gray-400 tracking-wider uppercase transition-colors duration-300 group-hover/stat:text-gray-300">Accuracy</span>
                                    </div>
                                    <div className="trust-stat p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-[var(--cta)]/30 hover:shadow-[0_8px_20px_rgba(var(--cta-rgb),0.1)] transition-all duration-300 flex flex-col items-center justify-center text-center group/stat">
                                        <span className="stat-num text-2xl font-black text-white leading-none mb-1.5 transition-transform duration-300 group-hover/stat:scale-105 group-hover/stat:text-[var(--cta-hover)] drop-shadow-[0_2px_6px_rgba(var(--cta-rgb),0.3)]">342</span>
                                        <span className="stat-text text-[9px] font-bold text-gray-400 tracking-wider uppercase transition-colors duration-300 group-hover/stat:text-gray-300">Scams Caught</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-[11px] text-gray-500 font-medium tracking-wide">
                                Secured by enterprise-grade cryptographic verification.
                            </div>
                        </div>
                    </div>

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
                            
                            {/* LOGIN COLUMN */}
                            <TabsContent value="login" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {/* Mobile Logo / Subtitle Header */}
                                <div className="md:hidden flex flex-col items-center mb-6">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <ShieldCheck size={26} className="text-[var(--cta)]" />
                                        <span className="font-extrabold text-lg text-[var(--on-dark)]">JobScan</span>
                                    </div>
                                    <p className="text-xs text-[var(--muted)] text-center font-medium">Intelligent analysis for job security.</p>
                                </div>

                                <div className="mb-6 animate-field-1">
                                    <h1 className="text-2xl font-black text-[var(--on-dark)] tracking-tight mb-1">Welcome back</h1>
                                    <p className="text-xs text-[var(--muted)] font-medium">Verify your identity to proceed</p>
                                </div>

                                {error && mode === 'login' && (
                                    <div className="mb-4 flex items-center gap-2.5 text-xs p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold animate-field-2">
                                        <AlertTriangle size={16} className="shrink-0 text-red-400" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    {/* Email */}
                                    <div className="relative animate-field-2">
                                        <input
                                            type="email"
                                            name="email"
                                            id="login-email"
                                            autoComplete="email"
                                            placeholder=" "
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="peer block w-full px-4 pt-6 pb-2 text-sm text-[var(--on-dark)] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl focus:border-[var(--cta)]/50 focus:bg-black/10 dark:focus:bg-white/10 focus:ring-0 outline-none transition-all duration-300"
                                        />
                                        <label
                                            htmlFor="login-email"
                                            className="absolute left-4 top-4 text-[var(--muted)] text-xs pointer-events-none transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[var(--cta)] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
                                        >
                                            Email Address
                                        </label>
                                        <div className="absolute inset-0 rounded-xl border border-transparent peer-focus:border-[var(--cta)]/30 pointer-events-none transition-all duration-300 opacity-0 peer-focus:opacity-100 shadow-[0_0_15px_rgba(var(--cta-rgb),0.15)]"></div>
                                    </div>

                                    {/* Password */}
                                    <div className="relative animate-field-3">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            id="login-password"
                                            autoComplete="current-password"
                                            placeholder=" "
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="peer block w-full pl-4 pr-12 pt-6 pb-2 text-sm text-[var(--on-dark)] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl focus:border-[var(--cta)]/50 focus:bg-black/10 dark:focus:bg-white/10 focus:ring-0 outline-none transition-all duration-300"
                                        />
                                        <label
                                            htmlFor="login-password"
                                            className="absolute left-4 top-4 text-[var(--muted)] text-xs pointer-events-none transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[var(--cta)] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
                                        >
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--on-dark)] transition-colors duration-200 focus:outline-none"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                        <div className="absolute inset-0 rounded-xl border border-transparent peer-focus:border-[var(--cta)]/30 pointer-events-none transition-all duration-300 opacity-0 peer-focus:opacity-100 shadow-[0_0_15px_rgba(var(--cta-rgb),0.15)]"></div>
                                    </div>

                                    {/* Remember / Forgot */}
                                    <div className="flex justify-between items-center mt-1 animate-field-4">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                name="rememberMe"
                                                id="remember-me"
                                                checked={formData.rememberMe}
                                                onChange={handleChange}
                                                className="w-4 h-4 rounded border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[var(--cta)] focus:ring-offset-0 focus:ring-[var(--cta)]"
                                            />
                                            <span className="text-xs text-[var(--muted)] group-hover:text-[var(--on-dark)] transition-colors">
                                                Remember me
                                            </span>
                                        </label>
                                        <a
                                            href="#"
                                            className="text-xs text-[var(--cta)] hover:text-[var(--cta-hover)] font-semibold transition-colors text-decoration-none"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-2 animate-field-5">
                                        <button
                                            type="submit"
                                            className="relative group w-full py-3.5 px-4 bg-gradient-to-r from-[var(--cta)] via-[var(--cta-hover)] to-[var(--cta)] text-white text-sm font-semibold rounded-xl overflow-hidden transition-all duration-300 shadow-[0_4px_15px_rgba(var(--cta-rgb),0.25)] hover:shadow-[0_4px_25px_rgba(var(--cta-rgb),0.45)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={loading}
                                        >
                                            <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                {loading ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        Signing in...
                                                    </>
                                                ) : (
                                                    'Sign In'
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                </form>

                                </TabsContent>

                            {/* SIGN UP COLUMN */}
                            <TabsContent value="signup" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {/* Mobile Logo / Subtitle Header */}
                                <div className="md:hidden flex flex-col items-center mb-6">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <ShieldCheck size={26} className="text-[var(--cta)]" />
                                        <span className="font-extrabold text-lg text-[var(--on-dark)]">JobScan</span>
                                    </div>
                                    <p className="text-xs text-[var(--muted)] text-center font-medium">Start your secure job search today.</p>
                                </div>

                                <div className="mb-6 animate-field-1">
                                    <h1 className="text-2xl font-black text-[var(--on-dark)] tracking-tight mb-1">Create account</h1>
                                    <p className="text-xs text-[var(--muted)] font-medium">Request system access</p>
                                </div>

                                {error && mode === 'signup' && (
                                    <div className="mb-4 flex items-center gap-2.5 text-xs p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold animate-field-2">
                                        <AlertTriangle size={16} className="shrink-0 text-red-400" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                                    {/* Full Name */}
                                    <div className="relative animate-field-2">
                                        <input
                                            type="text"
                                            name="name"
                                            id="signup-name"
                                            autoComplete="name"
                                            placeholder=" "
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="peer block w-full px-4 pt-6 pb-2 text-sm text-[var(--on-dark)] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl focus:border-[var(--cta)]/50 focus:bg-black/10 dark:focus:bg-white/10 focus:ring-0 outline-none transition-all duration-300"
                                        />
                                        <label
                                            htmlFor="signup-name"
                                            className="absolute left-4 top-4 text-[var(--muted)] text-xs pointer-events-none transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[var(--cta)] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
                                        >
                                            Full Name
                                        </label>
                                        <div className="absolute inset-0 rounded-xl border border-transparent peer-focus:border-[var(--cta)]/30 pointer-events-none transition-all duration-300 opacity-0 peer-focus:opacity-100 shadow-[0_0_15px_rgba(var(--cta-rgb),0.15)]"></div>
                                    </div>

                                    {/* Email */}
                                    <div className="relative animate-field-3">
                                        <input
                                            type="email"
                                            name="email"
                                            id="signup-email"
                                            autoComplete="email"
                                            placeholder=" "
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="peer block w-full px-4 pt-6 pb-2 text-sm text-[var(--on-dark)] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl focus:border-[var(--cta)]/50 focus:bg-black/10 dark:focus:bg-white/10 focus:ring-0 outline-none transition-all duration-300"
                                        />
                                        <label
                                            htmlFor="signup-email"
                                            className="absolute left-4 top-4 text-[var(--muted)] text-xs pointer-events-none transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[var(--cta)] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
                                        >
                                            Email Address
                                        </label>
                                        <div className="absolute inset-0 rounded-xl border border-transparent peer-focus:border-[var(--cta)]/30 pointer-events-none transition-all duration-300 opacity-0 peer-focus:opacity-100 shadow-[0_0_15px_rgba(var(--cta-rgb),0.15)]"></div>
                                    </div>

                                    {/* Password */}
                                    <div className="relative animate-field-4">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            id="signup-password"
                                            autoComplete="new-password"
                                            placeholder=" "
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="peer block w-full pl-4 pr-12 pt-6 pb-2 text-sm text-[var(--on-dark)] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl focus:border-[var(--cta)]/50 focus:bg-black/10 dark:focus:bg-white/10 focus:ring-0 outline-none transition-all duration-300"
                                        />
                                        <label
                                            htmlFor="signup-password"
                                            className="absolute left-4 top-4 text-[var(--muted)] text-xs pointer-events-none transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[var(--cta)] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
                                        >
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--on-dark)] transition-colors duration-200 focus:outline-none"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                        <div className="absolute inset-0 rounded-xl border border-transparent peer-focus:border-[var(--cta)]/30 pointer-events-none transition-all duration-300 opacity-0 peer-focus:opacity-100 shadow-[0_0_15px_rgba(var(--cta-rgb),0.15)]"></div>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <div className="mt-0.5 animate-field-5">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] text-[var(--muted)]">Password Strength</span>
                                                <span className={`text-[10px] font-bold ${getPasswordStrength(formData.password).text}`}>
                                                    {getPasswordStrength(formData.password).label}
                                                </span>
                                            </div>
                                            <div className="flex gap-1 h-1">
                                                <div className={`h-full flex-1 rounded-full transition-all duration-300 ${
                                                    getPasswordStrength(formData.password).score >= 1 ? getPasswordStrength(formData.password).color : 'bg-black/10 dark:bg-white/10'
                                                }`}></div>
                                                <div className={`h-full flex-1 rounded-full transition-all duration-300 ${
                                                    getPasswordStrength(formData.password).score >= 2 ? getPasswordStrength(formData.password).color : 'bg-white/10'
                                                }`}></div>
                                                <div className={`h-full flex-1 rounded-full transition-all duration-300 ${
                                                    getPasswordStrength(formData.password).score >= 3 ? getPasswordStrength(formData.password).color : 'bg-white/10'
                                                }`}></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Terms Checkbox */}
                                    <label className="flex items-start gap-2 cursor-pointer mt-1 group animate-field-5">
                                        <input
                                            type="checkbox"
                                            id="terms-check"
                                            required
                                            className="mt-0.5 w-4 h-4 rounded border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[var(--cta)] focus:ring-offset-0 focus:ring-[var(--cta)]"
                                        />
                                        <span className="text-xs text-[var(--muted)] group-hover:text-[var(--on-dark)] transition-colors leading-tight">
                                            I agree to the <a href="#" className="text-[var(--cta)] hover:underline">Terms</a> and <a href="#" className="text-[var(--cta)] hover:underline">Policy</a>
                                        </span>
                                    </label>

                                    {/* Submit Button */}
                                    <div className="mt-2 animate-field-5">
                                        <button
                                            type="submit"
                                            className="relative group w-full py-3.5 px-4 bg-gradient-to-r from-[var(--cta)] via-[var(--cta-hover)] to-[var(--cta)] text-white text-sm font-semibold rounded-xl overflow-hidden transition-all duration-300 shadow-[0_4px_15px_rgba(var(--cta-rgb),0.25)] hover:shadow-[0_4px_25px_rgba(var(--cta-rgb),0.45)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={loading}
                                        >
                                            <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                {loading ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        Creating account...
                                                    </>
                                                ) : (
                                                    'Create Account'
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                </form>

                            </TabsContent>
                        </Tabs>
                    </div>

                </div>
            </div>
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

