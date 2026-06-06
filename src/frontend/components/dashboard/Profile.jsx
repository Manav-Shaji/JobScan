import { Label } from "@/frontend/ui/forms/Label";
import { Input } from "@/frontend/ui/forms/Input";
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
            <div className="w-10 h-10 rounded-lg skeleton flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 skeleton" />
              <div className="h-3 w-48 skeleton" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-10 w-full skeleton" />
            <div className="h-10 w-full skeleton" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-8">
      {/* Profile Information Section */}
      <div className="glass-card p-6 border border-[var(--hairline)] rounded-2xl shadow-xl">
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
      </div>

      {/* Security Section */}
      <div className="glass-card p-6 border border-[var(--hairline)] rounded-2xl shadow-xl">
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
      </div>
    </div>
  );
}
