import { Label } from "@/components/ui/forms";
import { Input } from "@/components/ui/forms";
import { Skeleton } from "@/components/ui/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation";
import { User, Mail, Key, Lock } from 'lucide-react';

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
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-8">
        <div className="glass-card p-6 border border-[var(--hairline)] rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="glass-card p-4 md:p-6 border border-[var(--hairline)] rounded-2xl shadow-xl">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-[var(--surface-elevated)] border border-[var(--hairline)] rounded-xl p-1 h-auto">
            <TabsTrigger value="personal" className="py-2.5 rounded-lg text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all flex items-center gap-2">
              <User size={14}/> Personal Info
            </TabsTrigger>
            <TabsTrigger value="security" className="py-2.5 rounded-lg text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all flex items-center gap-2">
              <Key size={14}/> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-900/20 border border-blue-700/30 flex items-center justify-center text-blue-500">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--on-dark)] m-0">Personal Information</h3>
                <p className="text-[var(--muted)] text-sm m-0">Update your account details here.</p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="flex flex-col gap-5">
              <div>
                <Label className="text-[var(--on-dark)] font-medium mb-1.5 block">Display Name</Label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="Your Name" 
                    className="!pl-10 bg-[var(--surface-elevated)] border-[var(--hairline)] text-[var(--on-dark)] placeholder-[var(--muted)] focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[var(--on-dark)] font-medium mb-1.5 block">Email Address</Label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <Input 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    placeholder="you@example.com" 
                    className="!pl-10 bg-[var(--surface-elevated)] border-[var(--hairline)] text-[var(--on-dark)] placeholder-[var(--muted)] focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="security" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-900/20 border border-emerald-700/30 flex items-center justify-center text-emerald-500">
                <Key size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--on-dark)] m-0">Security</h3>
                <p className="text-[var(--muted)] text-sm m-0">Update your password to keep your account secure.</p>
              </div>
            </div>

            <form onSubmit={handleSavePassword} className="flex flex-col gap-5">
              <div>
                <Label className="text-[var(--on-dark)] font-medium mb-1.5 block">New Password</Label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <Input 
                    type="password"
                    value={passwordData?.newPassword || ''} 
                    onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} 
                    placeholder="••••••••" 
                    className="!pl-10 bg-[var(--surface-elevated)] border-[var(--hairline)] text-[var(--on-dark)] placeholder-[var(--muted)] focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[var(--on-dark)] font-medium mb-1.5 block">Confirm Password</Label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <Input 
                    type="password"
                    value={passwordData?.confirmPassword || ''} 
                    onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                    placeholder="••••••••" 
                    className="!pl-10 bg-[var(--surface-elevated)] border-[var(--hairline)] text-[var(--on-dark)] placeholder-[var(--muted)] focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={savingPassword} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingPassword ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
