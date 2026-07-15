/**
 * ------------------------------------------------------------
 * File: page.jsx
 * 
 * Purpose:
 * Main dashboard overview page.
 * 
 * Responsibilities:
 * • Provide a high-level summary of user activity and recent scans
 * 
 * Used By:
 * • Next.js App Router (/dashboard route)
 * ------------------------------------------------------------
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/core/providers/auth-provider';
import api from '@/core/lib/api-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/lib/query-keys';
import { Tabs, TabsContent } from "@/core/ui/navigation";
import { useToast } from "@/core/ui/use-toast";
import { Toaster } from "@/core/ui/toasts";
import dynamic from 'next/dynamic';

const Overview = dynamic(() => import('@/features/scans/Overview').then(mod => mod.Overview), { ssr: false });
const History = dynamic(() => import('@/features/scans/History').then(mod => mod.History), { ssr: false });
const Profile = dynamic(() => import('@/features/users/Profile').then(mod => mod.Profile), { ssr: false });
const Settings = dynamic(() => import('@/features/users/Settings').then(mod => mod.Settings), { ssr: false });
const Analyzer = dynamic(() => import('./analyzer/page'), { ssr: false });
import { Suspense } from 'react';

function DashboardContent() {
    const { user, loading: authLoading, updateProfile, updatePassword } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState(tabParam || 'overview');
    const [prevTabParam, setPrevTabParam] = useState(tabParam);

    // --- Swipe Navigation Logic ---
    const tabOrder = ['overview', 'analyzer', 'history', 'profile', 'settings'];
    const [touchStartData, setTouchStartData] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStartData({ 
            x: e.targetTouches[0].clientX, 
            time: Date.now() 
        });
    };

    const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const handleTouchEnd = () => {
        if (!touchStartData || !touchEnd) return;
        const distance = touchStartData.x - touchEnd;
        const duration = Date.now() - touchStartData.time;
        const velocity = Math.abs(distance / duration);

        const isSwipe = Math.abs(distance) > 50 || (Math.abs(distance) > 30 && velocity > 0.5);

        if (isSwipe) {
            const isLeftSwipe = distance > 0;
            const currentIndex = tabOrder.indexOf(activeTab);
            if (currentIndex === -1) return;

            let nextTab = null;
            if (isLeftSwipe && currentIndex < tabOrder.length - 1) {
                nextTab = tabOrder[currentIndex + 1];
            } else if (!isLeftSwipe && currentIndex > 0) {
                nextTab = tabOrder[currentIndex - 1];
            }

            if (nextTab) {
                setActiveTab(nextTab);
                window.history.replaceState(null, '', `/dashboard?tab=${nextTab}`);
            }
        }
        setTouchStartData(null);
        setTouchEnd(null);
    };
    
    if (tabParam !== prevTabParam) {
        setPrevTabParam(tabParam);
        if (tabParam) {
            setTimeout(() => setActiveTab(tabParam), 0);
        }
    }
    
    const queryClient = useQueryClient();
    useEffect(() => {
        if (!authLoading && !user) router.replace('/dashboard/analyzer');
    }, [user, authLoading, router]);

    const { data: statsRes, isLoading: statsLoading, refetch: refetchStats } = useQuery({
        queryKey: queryKeys.dashboard.stats,
        queryFn: api.getStats,
        enabled: !!user,
    });

    const { data: historyRes, isLoading: historyLoading, refetch: refetchHistory } = useQuery({
        queryKey: queryKeys.scans.history,
        queryFn: api.getHistory,
        enabled: !!user,
    });

    const statsData = statsRes?.success ? statsRes.data : statsRes || { totalScans: 0, scamsDetected: 0, avgTrustScore: 0 };
    const historyData = historyRes?.success ? historyRes.data : (Array.isArray(historyRes) ? historyRes : []);
    const recentActivities = historyData.slice(0, 5);
    const fullHistory = historyData;
    const loading = statsLoading || historyLoading;

    const fetchData = async () => {
        if (!user) return;
        await Promise.all([refetchStats(), refetchHistory()]);
    };

    if (authLoading || !user) {
        return (
            <div className="flex flex-col gap-5 w-full fade-in pt-4">
                <div className="hidden md:flex flex-col gap-5 w-full">
                    <div className="rounded-3xl h-[70px] w-full skeleton" />
                    <div className="grid grid-cols-4 gap-4 w-full">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-2xl h-[106px] skeleton" />
                        ))}
                    </div>
                </div>
                <div className="md:hidden flex flex-col gap-4 w-full">
                    <div className="rounded-2xl h-[112px] w-full skeleton" />
                    <div className="grid grid-cols-2 gap-3 w-full">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-2xl h-[96px] skeleton" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const updateProfileMutation = useMutation({
        mutationFn: (data) => updateProfile(data),
        onSuccess: (res) => {
            if (res.success) {
                toast({ title: "Profile Saved", description: "Profile updated successfully." });
            } else {
                toast({ title: "Error", description: res.message, variant: "destructive" });
            }
        },
        onError: (error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    });

    const updatePasswordMutation = useMutation({
        mutationFn: ({ oldPassword, newPassword }) => updatePassword(oldPassword, newPassword),
        onSuccess: (res) => {
            if (res.success) {
                toast({ title: "Success", description: "Password updated securely." });
            } else {
                toast({ title: "Error", description: res.message, variant: "destructive" });
            }
        },
        onError: (error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    });

    return (
        <div 
            onTouchStart={handleTouchStart} 
            onTouchMove={handleTouchMove} 
            onTouchEnd={handleTouchEnd}
            className="w-full flex-1 touch-pan-y"
        >
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
                    user={user}
                    updateProfileMutation={updateProfileMutation}
                    updatePasswordMutation={updatePasswordMutation}
                    loading={loading}
                />
            </TabsContent>
 
            {/* --- Tab: Settings --- */}
            <TabsContent value="settings">
                <Settings loading={loading} />
            </TabsContent>
        </Tabs>
        </div>
    );
}

export default function SuperDashboard() {
    return (
        <Suspense fallback={
            <div className="flex flex-col gap-5 w-full fade-in pt-4">
                <div className="hidden md:flex flex-col gap-5 w-full">
                    <div className="rounded-3xl h-[70px] w-full skeleton" />
                    <div className="grid grid-cols-4 gap-4 w-full">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-2xl h-[106px] skeleton" />
                        ))}
                    </div>
                </div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
