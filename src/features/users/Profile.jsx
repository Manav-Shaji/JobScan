import { Label } from "@/core/ui/forms";
import { Input } from "@/core/ui/forms";
import { Skeleton } from "@/core/ui/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/ui/navigation";
import { User, Mail, Key, Lock, ShieldCheck, ChevronRight } from 'lucide-react';
import { m } from 'motion/react';
import { slideUp } from '@/core/motion';

export function Profile({ 
  formData, 
  setFormData, 
  handleSaveSettings, 
  saving,
  passwordData,
  setPasswordData,
  handleSavePassword,
  savingPassword,
  loading
}) {
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
        <div className="glass-card p-8 border border-[var(--hairline)] rounded-3xl shadow-2xl space-y-8">
          <div className="flex items-center gap-5">
            <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div className="space-y-5">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
      <div className="glass-card p-6 md:p-8 border border-white/5 bg-[rgba(var(--canvas-rgb),0.4)] backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.2)] relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none rounded-t-[2rem]"></div>
        
        <Tabs defaultValue="personal" className="w-full relative z-10">
          
          <div className="mb-10">
            <TabsList className="grid w-full grid-cols-2 bg-[rgba(0,0,0,0.2)] border border-[var(--hairline)] rounded-2xl p-1.5 shadow-inner">
              <TabsTrigger 
                value="personal" 
                className="py-3 rounded-xl text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-[var(--muted)] hover:text-[var(--on-dark)] transition-all flex items-center justify-center gap-2"
              >
                <User size={16}/> Personal Profile
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="py-3 rounded-xl text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-[var(--muted)] hover:text-[var(--on-dark)] transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16}/> Security Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="personal" className="mt-0 outline-none" asChild>
            <m.div variants={slideUp} initial="hidden" animate="visible" className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-400/20 blur-xl"></div>
                  <User size={26} className="relative z-10" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[var(--on-dark)] m-0 tracking-tight">Personal Details</h3>
                  <p className="text-[var(--muted)] text-sm m-0 mt-1">Manage your identity and contact information.</p>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="flex flex-col gap-6 bg-[rgba(var(--surface-rgb),0.2)] p-6 rounded-3xl border border-[var(--hairline)]">
                <div className="space-y-1.5">
                  <Label className="text-[var(--on-dark)] font-bold text-sm ml-1">Display Name</Label>
                  <div className="relative group">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-blue-400 transition-colors" />
                    <Input 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      placeholder="Your Full Name" 
                      className="!pl-12 bg-[var(--surface-elevated)] border-[var(--hairline)] text-[var(--on-dark)] placeholder-[var(--muted)] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-6 transition-all shadow-sm hover:border-blue-500/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[var(--on-dark)] font-bold text-sm ml-1">Email Address</Label>
                  <div className="relative group">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-blue-400 transition-colors" />
                    <Input 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      placeholder="you@example.com" 
                      className="!pl-12 bg-[var(--surface-elevated)] border-[var(--hairline)] text-[var(--on-dark)] placeholder-[var(--muted)] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-6 transition-all shadow-sm hover:border-blue-500/30"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--hairline)] flex justify-end">
                  <m.button 
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={saving} 
                    className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black tracking-wide px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.35)] disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">Saving Changes <span className="flex gap-1"><span className="w-1 h-1 bg-white rounded-full animate-bounce"></span><span className="w-1 h-1 bg-white rounded-full animate-bounce delay-75"></span><span className="w-1 h-1 bg-white rounded-full animate-bounce delay-150"></span></span></span>
                    ) : (
                      <>Update Profile <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </m.button>
                </div>
              </form>
            </m.div>
          </TabsContent>

          <TabsContent value="security" className="mt-0 outline-none" asChild>
            <m.div variants={slideUp} initial="hidden" animate="visible" className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-400/20 blur-xl"></div>
                  <Key size={26} className="relative z-10" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[var(--on-dark)] m-0 tracking-tight">Security & Authentication</h3>
                  <p className="text-[var(--muted)] text-sm m-0 mt-1">Update your password to keep your account safe.</p>
                </div>
              </div>

              <form onSubmit={handleSavePassword} className="flex flex-col gap-6 bg-[rgba(var(--surface-rgb),0.2)] p-6 rounded-3xl border border-[var(--hairline)]">
                
                <div className="space-y-1.5">
                  <Label className="text-[var(--on-dark)] font-bold text-sm ml-1">Current Password</Label>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-emerald-400 transition-colors" />
                    <Input 
                      type="password"
                      value={passwordData?.oldPassword || ''} 
                      onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} 
                      placeholder="••••••••" 
                      className="!pl-12 bg-[var(--surface-elevated)] border-[var(--hairline)] text-[var(--on-dark)] placeholder-[var(--muted)] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 rounded-xl py-6 transition-all shadow-sm hover:border-emerald-500/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[var(--on-dark)] font-bold text-sm ml-1">New Password</Label>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-emerald-400 transition-colors" />
                    <Input 
                      type="password"
                      value={passwordData?.newPassword || ''} 
                      onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} 
                      placeholder="••••••••" 
                      className="!pl-12 bg-[var(--surface-elevated)] border-[var(--hairline)] text-[var(--on-dark)] placeholder-[var(--muted)] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 rounded-xl py-6 transition-all shadow-sm hover:border-emerald-500/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[var(--on-dark)] font-bold text-sm ml-1">Confirm New Password</Label>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-emerald-400 transition-colors" />
                    <Input 
                      type="password"
                      value={passwordData?.confirmPassword || ''} 
                      onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                      placeholder="••••••••" 
                      className="!pl-12 bg-[var(--surface-elevated)] border-[var(--hairline)] text-[var(--on-dark)] placeholder-[var(--muted)] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 rounded-xl py-6 transition-all shadow-sm hover:border-emerald-500/30"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--hairline)] flex justify-end">
                  <m.button 
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={savingPassword} 
                    className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black tracking-wide px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.35)] disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    {savingPassword ? (
                      <span className="flex items-center gap-2">Updating Securely <span className="flex gap-1"><span className="w-1 h-1 bg-white rounded-full animate-bounce"></span><span className="w-1 h-1 bg-white rounded-full animate-bounce delay-75"></span><span className="w-1 h-1 bg-white rounded-full animate-bounce delay-150"></span></span></span>
                    ) : (
                      <>Update Password <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" /></>
                    )}
                  </m.button>
                </div>
              </form>
            </m.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
