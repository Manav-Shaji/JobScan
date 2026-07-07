import { Switch } from "@/core/ui/forms";
import { Skeleton } from "@/core/ui/layout";
import { Separator } from "@/core/ui/layout";
import { Bell, Shield, Eye, Database, Trash2, Download, Sun, Moon, Laptop, AppWindow, Globe, Smartphone } from 'lucide-react';
import { useTheme } from "@/core/providers/providers";
import { useState } from "react";
import { useToast } from "@/core/ui/use-toast";
import { usePwa } from "@/core/providers/pwa-provider";
import { useAuth } from "@/core/providers/auth-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/core/ui/dialog";
import { m } from 'motion/react';
import { staggerContainer, slideUp } from '@/core/motion';

export function Settings({ formData, setFormData, loading }) {
  const { theme, toggleTheme } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();
  const { isInstallable, isInstalled, isExtensionInstalled, installApp, requestNotificationPermission } = usePwa();
  const { logout } = useAuth();

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-8">
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

  const handleRetentionChange = async (e) => {
    const value = e.target.value;
    const days = value === 'never' ? 0 : parseInt(value);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retentionDays: days })
      });
      if (!res.ok) {
        toast({
          title: "Error",
          description: "Failed to update retention settings",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Settings Updated",
        description: `History retention set to ${value === 'never' ? 'never' : value + ' days'}.`,
        variant: "success"
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update retention settings",
        variant: "destructive"
      });
    }
  };

  const handleExportData = async () => {
    try {
      const res = await fetch('/api/history');
      if (!res.ok) {
        toast({
          title: "Export Failed",
          description: "Could not download scan history.",
          variant: "destructive"
        });
        return;
      }
      const data = await res.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'jobscan_history.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Your scan history has been downloaded.",
        variant: "success"
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Export Failed",
        description: "Could not download scan history.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'DELETE'
      });
      if (!res.ok) {
        toast({
          title: "Error",
          description: "Failed to delete account",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully removed.",
        variant: "success"
      });
      
      setShowDeleteConfirm(false);
      
      // Redirect to signout
      setTimeout(async () => {
        await logout();
      }, 1500);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive"
      });
    }
  };

  return (
    <m.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-8">
      
      {/* 2. Privacy & Data Management */}
      <m.div variants={slideUp} className="glass-card p-6 border border-[var(--hairline)] rounded-2xl shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-900/20 border border-purple-700/30 flex items-center justify-center text-purple-500">
            <Database size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--on-dark)] m-0">Privacy & Data Management</h3>
            <p className="text-[var(--muted)] text-sm m-0">Control your data and history retention.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Auto Clear History */}
          <div className="flex items-center justify-between p-4 bg-[var(--surface-elevated)] border border-[var(--hairline)] rounded-xl">
            <div>
              <div className="font-semibold text-[var(--on-dark)] text-sm">Auto-Clear History</div>
              <div className="text-[var(--muted)] text-xs mt-0.5">Automatically delete scans older than a specific period</div>
            </div>
            <select 
              onChange={handleRetentionChange}
              className="bg-[var(--surface-card)] border border-[var(--hairline)] text-[var(--on-dark)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="never">Never</option>
              <option value="30">30 Days</option>
              <option value="60">60 Days</option>
              <option value="90">90 Days</option>
            </select>
          </div>

          {/* Export Data */}
          <div className="flex items-center justify-between p-4 bg-[var(--surface-elevated)] border border-[var(--hairline)] rounded-xl">
            <div>
              <div className="font-semibold text-[var(--on-dark)] text-sm">Export Your Data</div>
              <div className="text-[var(--muted)] text-xs mt-0.5">Download all your scan history as a JSON file</div>
            </div>
            <button type="button" onClick={handleExportData}
              className="flex items-center gap-2 bg-[var(--surface-card)] border border-[var(--hairline)] hover:bg-[var(--hairline)] text-[var(--on-dark)] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Download size={14} /> Export
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-xl mt-2">
            <div>
              <div className="font-semibold text-red-500 text-sm">Delete Account</div>
              <div className="text-[var(--muted)] text-xs mt-0.5">Permanently erase your account and all stored data</div>
            </div>
            <button type="button" onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </m.div>

      {/* 3. Display & Accessibility */}
      <m.div variants={slideUp} className="glass-card p-6 border border-[var(--hairline)] rounded-2xl shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-900/20 border border-amber-700/30 flex items-center justify-center text-amber-500">
            <Eye size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--on-dark)] m-0">Display & Accessibility</h3>
            <p className="text-[var(--muted)] text-sm m-0">Customize how JobScan looks and feels.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Theme Preference */}
          <div className="flex items-center justify-between p-4 bg-[var(--surface-elevated)] border border-[var(--hairline)] rounded-xl">
            <div>
              <div className="font-semibold text-[var(--on-dark)] text-sm">Theme Preference</div>
              <div className="text-[var(--muted)] text-xs mt-0.5">Choose your preferred visual mode</div>
            </div>
            <div className="flex bg-[var(--surface-card)] border border-[var(--hairline)] rounded-lg p-1 gap-1">
              <button type="button" onClick={() => theme === 'dark' && toggleTheme()}
                className={`p-1.5 rounded-md ${theme === 'light' ? 'bg-[var(--surface-elevated)] text-[var(--on-dark)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--on-dark)]'}`} 
                title="Light Mode"
              >
                <Sun size={16} />
              </button>
              <button type="button" onClick={() => theme === 'light' && toggleTheme()}
                className={`p-1.5 rounded-md ${theme === 'dark' ? 'bg-[var(--surface-elevated)] text-[var(--on-dark)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--on-dark)]'}`} 
                title="Dark Mode"
              >
                <Moon size={16} />
              </button>
            </div>
          </div>

        </div>
      </m.div>

      {/* 4. Application Section */}
      <m.div variants={slideUp} className="glass-card p-6 border border-[var(--hairline)] rounded-2xl shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-900/20 border border-emerald-700/30 flex items-center justify-center text-emerald-500">
            <AppWindow size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--on-dark)] m-0">Application & Integrations</h3>
            <p className="text-[var(--muted)] text-sm m-0">Manage PWA installation and browser extension connections.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* PWA Section */}
          <div className="flex flex-col gap-3 p-4 bg-[var(--surface-elevated)] border border-[var(--hairline)] rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Smartphone size={16} />
                </div>
                <div>
                  <div className="font-semibold text-[var(--on-dark)] text-sm">Progressive Web App (PWA)</div>
                  <div className="text-[var(--muted)] text-xs mt-0.5">Run JobScan natively on your desktop or mobile device.</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`status-badge text-xs px-2.5 py-1 ${isInstalled ? 'safe' : 'caution'}`}>
                  {isInstalled ? 'Installed' : 'Standalone Supported'}
                </span>
              </div>
            </div>

            {!isInstalled && isInstallable && (
              <div className="flex justify-end mt-2">
                <button type="button" onClick={installApp}
                  className="button-primary flex items-center gap-2 text-xs font-semibold"
                  style={{ padding: '8px 16px', borderRadius: '10px' }}
                >
                  <Download size={14} /> Install Desktop App
                </button>
              </div>
            )}
          </div>

          {/* Browser Extension Section */}
          <div className="flex flex-col gap-3 p-4 bg-[var(--surface-elevated)] border border-[var(--hairline)] rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Globe size={16} />
                </div>
                <div>
                  <div className="font-semibold text-[var(--on-dark)] text-sm">Chrome Browser Extension</div>
                  <div className="text-[var(--muted)] text-xs mt-0.5">Scan listings directly on LinkedIn, Indeed, and Naukri.</div>
                </div>
              </div>
              <div>
                <span className={`status-badge text-xs px-2.5 py-1 ${isExtensionInstalled ? 'safe' : 'caution'}`}>
                  {isExtensionInstalled ? 'Active' : 'Not Connected'}
                </span>
              </div>
            </div>

            {/* Extension installation guide */}
            <div className="border-t border-[var(--hairline)] pt-3 mt-1">
              <div className="text-xs font-bold text-[var(--on-dark)] mb-1">Developer Installation Guide:</div>
              <ol className="text-xs text-[var(--muted)] list-decimal pl-4 space-y-1">
                <li>Download or locate the <code>extension/</code> folder in the workspace.</li>
                <li>Open Chrome/Edge and navigate to <code>chrome://extensions/</code>.</li>
                <li>Enable <strong>Developer mode</strong> (toggle top right).</li>
                <li>Click <strong>Load unpacked</strong> and select the <code>extension/</code> directory.</li>
                <li>Pin the JobScan extension for quick checks.</li>
              </ol>
            </div>
          </div>

          {/* Push Notifications Foundation */}
          <div className="flex items-center justify-between p-4 bg-[var(--surface-elevated)] border border-[var(--hairline)] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Bell size={16} />
              </div>
              <div>
                <div className="font-semibold text-[var(--on-dark)] text-sm">System Scam Alerts</div>
                <div className="text-[var(--muted)] text-xs mt-0.5">Receive immediate system push warnings of detected scams.</div>
              </div>
            </div>
            <button type="button" onClick={requestNotificationPermission}
              className="btn-premium-secondary text-xs"
              style={{ padding: '8px 16px', borderRadius: '10px' }}
            >
              Configure Alerts
            </button>
          </div>
        </div>
      </m.div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="border-[var(--hairline)] max-w-md bg-[var(--canvas)] rounded-2xl shadow-2xl p-8">
          <DialogHeader className="text-center items-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
              <Trash2 size={24} />
            </div>
            <DialogTitle className="text-2xl font-bold text-[var(--on-dark)] text-center">Delete Account</DialogTitle>
            <DialogDescription className="text-[var(--muted)] text-sm mt-2 text-center max-w-[320px]">
              Are you sure you want to permanently delete your account? This action cannot be undone and all your stored history will be erased forever.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 flex flex-row gap-3 justify-center w-full">
            <button type="button" onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-4 py-2.5 bg-[var(--surface-elevated)] border border-[var(--hairline)] text-[var(--on-dark)] rounded-xl text-sm font-semibold hover:bg-[rgba(var(--primary-rgb),0.05)] transition-colors"
            >
              Cancel
            </button>
            <button type="button" onClick={handleDeleteAccount}
              className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-red-500/20"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </m.div>
  );
}
