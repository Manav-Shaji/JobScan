/**
 * ------------------------------------------------------------
 * Component: Profile
 * 
 * Purpose:
 * User profile management component.
 * 
 * Responsibilities:
 * • Display and edit user information (name, email)
 * • Change account password
 * 
 * Used By:
 * • Dashboard Settings View
 * ------------------------------------------------------------
 */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from "@/core/ui/forms";
import { Input } from "@/core/ui/forms";
import { Skeleton } from "@/core/ui/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/ui/navigation";
import { User, Mail, Key, Lock, ShieldCheck, ArrowRight, Camera, Eye, EyeOff } from 'lucide-react';
import { m, LayoutGroup } from 'motion/react';

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
};

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address")
});

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export function Profile({ 
  user,
  updateProfileMutation,
  updatePasswordMutation,
  loading
}) {
  const [activeTab, setActiveTab] = useState('personal');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '' },
    mode: 'onChange'
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors }
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onChange'
  });

  useEffect(() => {
    if (user) {
      resetProfile({ name: user.name || '', email: user.email || '' });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data) => {
    updatePasswordMutation.mutate(data, {
      onSuccess: () => resetPassword()
    });
  };

  const savingProfile = updateProfileMutation.isPending;
  const savingPassword = updatePasswordMutation.isPending;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        <div className="bg-[var(--surface)] p-6 md:p-8 border border-[var(--hairline)] rounded-[1.5rem] shadow-lg space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-8 w-full">
      <div className="bg-[var(--surface)] p-5 md:p-7 border border-[var(--hairline-strong)] rounded-[1.5rem] shadow-xl relative overflow-hidden">
        
        {/* Very subtle background glow */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[rgba(var(--primary-rgb),0.03)] to-transparent pointer-events-none rounded-t-[1.5rem]" />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full relative z-10 flex flex-col">
          
          {/* Segmented Control */}
          <div className="mb-6 md:mb-8">
            <LayoutGroup>
              <TabsList className="relative flex w-full p-1 bg-[rgba(0,0,0,0.15)] border border-[var(--hairline)] rounded-2xl shadow-inner">
                
                <TabsTrigger 
                  value="personal" 
                  className="relative z-10 flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 data-[state=active]:text-white text-[var(--muted)] hover:text-[var(--on-dark)]"
                >
                  {activeTab === 'personal' && (
                    <m.div 
                      layoutId="profile-tab-indicator" 
                      className="absolute inset-0 bg-blue-600 rounded-xl -z-10 shadow-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <User size={16}/> <span>Profile</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="security" 
                  className="relative z-10 flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 data-[state=active]:text-white text-[var(--muted)] hover:text-[var(--on-dark)]"
                >
                  {activeTab === 'security' && (
                    <m.div 
                      layoutId="profile-tab-indicator" 
                      className="absolute inset-0 bg-emerald-600 rounded-xl -z-10 shadow-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <ShieldCheck size={16}/> <span>Security</span>
                </TabsTrigger>

              </TabsList>
            </LayoutGroup>
          </div>

          <TabsContent value="personal" className="mt-0 outline-none flex-1 flex flex-col" asChild>
            <m.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col gap-6">
              
              {/* Header Section */}
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 overflow-hidden transition group-hover:border-blue-500/40">
                    <User size={22} />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera size={16} className="text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-[var(--on-dark)] leading-tight">Personal Details</h3>
                  <p className="text-[var(--muted)] text-sm leading-relaxed mt-0.5">Manage your identity and contact information.</p>
                </div>
              </div>

              {/* Form Section */}
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="flex flex-col gap-5">
                
                <div className="space-y-1.5">
                  <Label htmlFor="displayName" className="text-[var(--on-dark)] font-medium text-[13px] ml-0.5">Display Name</Label>
                  <div className="relative group">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                    <Input 
                      id="displayName"
                      {...registerProfile("name")}
                      placeholder="Your Full Name" 
                      className={`!pl-10 h-11 bg-[rgba(0,0,0,0.1)] border-[var(--hairline-strong)] text-[var(--on-dark)] placeholder-[var(--muted)] focus:bg-[var(--surface-elevated)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg transition ${profileErrors.name ? '!border-red-500 !ring-red-500/20' : ''}`}
                      aria-label="Display Name"
                    />
                  </div>
                  {profileErrors.name && <p className="text-red-500 text-xs mt-1 ml-0.5 font-medium">{profileErrors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="emailAddress" className="text-[var(--on-dark)] font-medium text-[13px] ml-0.5">Email Address</Label>
                  <div className="relative group">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                    <Input 
                      id="emailAddress"
                      type="email"
                      {...registerProfile("email")}
                      placeholder="you@example.com" 
                      className={`!pl-10 h-11 bg-[rgba(0,0,0,0.1)] border-[var(--hairline-strong)] text-[var(--on-dark)] placeholder-[var(--muted)] focus:bg-[var(--surface-elevated)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg transition ${profileErrors.email ? '!border-red-500 !ring-red-500/20' : ''}`}
                      aria-label="Email Address"
                    />
                  </div>
                  {profileErrors.email && <p className="text-red-500 text-xs mt-1 ml-0.5 font-medium">{profileErrors.email.message}</p>}
                </div>

                {/* Footer Section */}
                <div className="mt-2 pt-5 border-t border-[var(--hairline)] flex justify-end">
                  <m.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={savingProfile} 
                    className="relative bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {savingProfile ? (
                      <span className="flex items-center gap-1.5">
                        Saving... 
                        <span className="flex gap-0.5">
                          <span className="w-1 h-1 bg-white rounded-full animate-bounce"></span>
                          <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                          <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        </span>
                      </span>
                    ) : (
                      <>Update Profile <ArrowRight size={14} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition" /></>
                    )}
                  </m.button>
                </div>
              </form>
            </m.div>
          </TabsContent>

          <TabsContent value="security" className="mt-0 outline-none flex-1 flex flex-col" asChild>
            <m.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col gap-6">
              
              {/* Header Section */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 overflow-hidden flex-shrink-0">
                  <Key size={22} />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-[var(--on-dark)] leading-tight">Security & Authentication</h3>
                  <p className="text-[var(--muted)] text-sm leading-relaxed mt-0.5">Update your password to keep your account safe.</p>
                </div>
              </div>

              {/* Form Section */}
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="flex flex-col gap-5">
                
                <div className="space-y-1.5">
                  <Label htmlFor="currentPassword" className="text-[var(--on-dark)] font-medium text-[13px] ml-0.5">Current Password</Label>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                    <Input 
                      id="currentPassword"
                      type={showOldPassword ? "text" : "password"}
                      {...registerPassword("oldPassword")}
                      placeholder="••••••••" 
                      className={`!pl-10 !pr-10 h-11 bg-[rgba(0,0,0,0.1)] border-[var(--hairline-strong)] text-[var(--on-dark)] placeholder-[var(--muted)] focus:bg-[var(--surface-elevated)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg transition ${passwordErrors.oldPassword ? '!border-red-500 !ring-red-500/20' : ''}`}
                      aria-label="Current Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--on-dark)] transition-colors focus:outline-none"
                      tabIndex={-1}
                    >
                      {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordErrors.oldPassword && <p className="text-red-500 text-xs mt-1 ml-0.5 font-medium">{passwordErrors.oldPassword.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="text-[var(--on-dark)] font-medium text-[13px] ml-0.5">New Password</Label>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                    <Input 
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      {...registerPassword("newPassword")}
                      placeholder="••••••••" 
                      className={`!pl-10 !pr-10 h-11 bg-[rgba(0,0,0,0.1)] border-[var(--hairline-strong)] text-[var(--on-dark)] placeholder-[var(--muted)] focus:bg-[var(--surface-elevated)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg transition ${passwordErrors.newPassword ? '!border-red-500 !ring-red-500/20' : ''}`}
                      aria-label="New Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--on-dark)] transition-colors focus:outline-none"
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1 ml-0.5 font-medium">{passwordErrors.newPassword.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-[var(--on-dark)] font-medium text-[13px] ml-0.5">Confirm New Password</Label>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                    <Input 
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...registerPassword("confirmPassword")}
                      placeholder="••••••••" 
                      className={`!pl-10 !pr-10 h-11 bg-[rgba(0,0,0,0.1)] border-[var(--hairline-strong)] text-[var(--on-dark)] placeholder-[var(--muted)] focus:bg-[var(--surface-elevated)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg transition ${passwordErrors.confirmPassword ? '!border-red-500 !ring-red-500/20' : ''}`}
                      aria-label="Confirm New Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--on-dark)] transition-colors focus:outline-none"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-0.5 font-medium">{passwordErrors.confirmPassword.message}</p>}
                </div>

                {/* Footer Section */}
                <div className="mt-2 pt-5 border-t border-[var(--hairline)] flex justify-end">
                  <m.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={savingPassword} 
                    className="relative bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {savingPassword ? (
                      <span className="flex items-center gap-1.5">
                        Updating... 
                        <span className="flex gap-0.5">
                          <span className="w-1 h-1 bg-white rounded-full animate-bounce"></span>
                          <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                          <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        </span>
                      </span>
                    ) : (
                      <>Change Password <ArrowRight size={14} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition" /></>
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
