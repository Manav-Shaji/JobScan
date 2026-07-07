'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/core/providers/auth-provider';
import { m, AnimatePresence } from 'motion/react';
import { slideUp } from '@/core/motion';
import { Eye, EyeOff, AlertTriangle, ShieldCheck } from 'lucide-react';

export function SignupForm() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await register(formData.name, formData.email, formData.password);
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
        setLoading(false);
    };

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
        <div className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
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

            <AnimatePresence mode="wait">
            {error && (
                <m.div key="signup-error" variants={slideUp} initial="hidden" animate="visible" exit="exit" className="mb-4 flex items-center gap-2.5 text-xs p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold">
                    <AlertTriangle size={16} className="shrink-0 text-red-400" />
                    <span>{error}</span>
                </m.div>
            )}
            </AnimatePresence>

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
                        I agree to the <Link href="/terms" className="text-[var(--cta)] hover:underline">Terms</Link> and <Link href="/policy" className="text-[var(--cta)] hover:underline">Policy</Link>
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
        </div>
    );
}
