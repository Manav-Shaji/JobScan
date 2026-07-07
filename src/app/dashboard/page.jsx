'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/core/providers/auth-provider';
import api from '@/core/lib/api-client';
import { Tabs, TabsContent } from "@/core/ui/navigation";
import { useToast } from "@/core/ui/use-toast";
import { Toaster } from "@/core/ui/toasts";
import dynamic from 'next/dynamic';

const Overview = dynamic(() => import('@/features/scans/Overview').then(mod => mod.Overview), { ssr: false });
const History = dynamic(() => import('@/features/scans/History').then(mod => mod.History), { ssr: false });
const Profile = dynamic(() => import('@/features/users/Profile').then(mod => mod.Profile), { ssr: false });
const Settings = dynamic(() => import('@/features/users/Settings').then(mod => mod.Settings), { ssr: false });
const Analyzer = dynamic(() => import('./analyzer/page'), { ssr: false });

export default function SuperDashboard() {
    const { user, loading: authLoading, updateProfile, updatePassword } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState(tabParam || 'overview');
    const [prevTabParam, setPrevTabParam] = useState(tabParam);
    
    if (tabParam !== prevTabParam) {
        setPrevTabParam(tabParam);
        if (tabParam) {
            // Delay state update to avoid cascading render warnings
            setTimeout(() => setActiveTab(tabParam), 0);
        }
    }
    
    // --- State: Overview ---
    const [statsData, setStatsData] = useState({ totalScans: 0, scamsDetected: 0, avgTrustScore: 0 });
    const [recentActivities, setRecentActivities] = useState([]);
    
    // --- State: History ---
    const [fullHistory, setFullHistory] = useState([]);
    const [filter, setFilter] = useState('all');
    
    // --- State: Settings ---
    const [formData, setFormData] = useState({ name: '', email: '', notifications: true });
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [saving, setSaving] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) router.replace('/dashboard/analyzer');
    }, [user, authLoading, router]);

    // tabParam is synced during render

    useEffect(() => {
        const doFetch = async () => {
            if (!user) return;
            try {
                const [statsRes, historyRes] = await Promise.all([api.getStats(), api.getHistory()]);
                const stats = statsRes?.success ? statsRes.data : statsRes;
                const history = historyRes?.success ? historyRes.data : (Array.isArray(historyRes) ? historyRes : []);

                setStatsData(stats || { totalScans: 0, scamsDetected: 0, avgTrustScore: 0 });
                setRecentActivities(Array.isArray(history) ? history.slice(0, 5) : []);
                setFullHistory(Array.isArray(history) ? history : []);
                setFormData({ name: user.name || '', email: user.email || '', notifications: true });
            } catch (err) { console.error('Data fetch failed:', err); }
            setLoading(false);
        };
        
        if (user) doFetch();
    }, [user]);

    const fetchData = async () => {
        if (!user) return;
        try {
            const [statsRes, historyRes] = await Promise.all([api.getStats(), api.getHistory()]);
            const stats = statsRes?.success ? statsRes.data : statsRes;
            const history = historyRes?.success ? historyRes.data : (Array.isArray(historyRes) ? historyRes : []);

            setStatsData(stats || { totalScans: 0, scamsDetected: 0, avgTrustScore: 0 });
            setRecentActivities(Array.isArray(history) ? history.slice(0, 5) : []);
            setFullHistory(Array.isArray(history) ? history : []);
            setFormData({ name: user.name || '', email: user.email || '', notifications: true });
        } catch (err) { console.error('Data fetch failed:', err); }
        setLoading(false);
    };

    if (authLoading || !user) {
        return (
            <div className="flex justify-center items-center" style={{ height: '100dvh', background: 'var(--canvas)' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await updateProfile({ name: formData.name, email: formData.email });
            if (res.success) {
                toast({ title: "Profile Saved", description: "Profile updated successfully." });
            } else {
                toast({ title: "Error", description: res.message, variant: "destructive" });
            }
        } catch (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
        setSaving(false);
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        if (!passwordData.oldPassword) {
            toast({ title: "Error", description: "Old password is required.", variant: "destructive" });
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
            return;
        }
        setSavingPassword(true);
        try {
            const res = await updatePassword(passwordData.oldPassword, passwordData.newPassword);
            if (res.success) {
                toast({ title: "Success", description: "Password updated securely." });
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast({ title: "Error", description: res.message, variant: "destructive" });
            }
        } catch (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
        setSavingPassword(false);
    };

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full fade-in">
            <Toaster />
            
            {/* --- Tab: Analyzer --- */}
            <TabsContent value="analyzer">
                <Analyzer />
            </TabsContent>

            {/* --- Tab: Overview --- */}
            <TabsContent value="overview">
                <Overview statsData={statsData} recentActivities={recentActivities} loading={loading} onRefresh={fetchData} />
            </TabsContent>
 
            {/* --- Tab: History --- */}
            <TabsContent value="history">
                <History fullHistory={fullHistory} loading={loading} />
            </TabsContent>
 
            {/* --- Tab: Profile --- */}
            <TabsContent value="profile">
                <Profile 
                    formData={formData} 
                    setFormData={setFormData} 
                    handleSaveSettings={handleSaveSettings} 
                    saving={saving} 
                    passwordData={passwordData}
                    setPasswordData={setPasswordData}
                    handleSavePassword={handleSavePassword}
                    savingPassword={savingPassword}
                    loading={loading}
                />
            </TabsContent>
 
            {/* --- Tab: Settings --- */}
            <TabsContent value="settings">
                <Settings formData={formData} setFormData={setFormData} loading={loading} />
            </TabsContent>
        </Tabs>
    );
}
