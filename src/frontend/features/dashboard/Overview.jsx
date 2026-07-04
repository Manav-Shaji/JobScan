import { Search, ShieldAlert, ShieldCheck, Activity, FileText, AlertTriangle, Cpu, Terminal, Shield, User, RefreshCw, History, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Skeleton } from "@/frontend/ui/layout";
import { Card, CardContent } from "@/frontend/ui/layout";
import Link from 'next/link';

const formatDate = (dateString) => {
  if (!dateString) return { date: 'Recent', time: '' };
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
};

export function Overview({ statsData, recentActivities, loading, onRefresh }) {
  const safeJobs = (statsData.totalScans || 0) - (statsData.scamsDetected || 0);

  // --- Pull-To-Refresh State ---
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const touchStartRef = useRef(0);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0 && !refreshing) {
      touchStartRef.current = e.touches[0].pageY;
    }
  };

  const handleTouchMove = (e) => {
    if (touchStartRef.current > 0 && window.scrollY === 0 && !refreshing) {
      const currentY = e.touches[0].pageY;
      const diff = currentY - touchStartRef.current;
      if (diff > 0) {
        // Prevent bounce on mobile browser container
        if (diff < 120) {
          setPullDistance(diff);
        }
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 55 && !refreshing && onRefresh) {
      setRefreshing(true);
      setPullDistance(60);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(20);
      }
      try {
        await onRefresh();
      } catch (err) {
        console.error(err);
      } finally {
        setRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
    touchStartRef.current = 0;
  };

  // --- SKELETON LOADING VIEW ---
  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        {/* Desktop Skeleton */}
        <div className="hidden md:flex flex-col gap-5">
          <Skeleton className="rounded-3xl h-[70px] w-full" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="rounded-2xl h-[106px]" />
            ))}
          </div>
          <div className="grid grid-cols-12 gap-4">
            <Skeleton className="col-span-8 rounded-2xl h-[320px]" />
            <Skeleton className="col-span-4 rounded-2xl h-[320px]" />
          </div>
        </div>

        {/* Mobile Skeleton */}
        <div className="md:hidden flex flex-col gap-4">
          <Skeleton className="rounded-2xl h-[112px] w-full" />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="rounded-2xl h-[96px]" />
            ))}
          </div>
          <Skeleton className="rounded-2xl h-[230px] w-full" />
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Security Scans Run', 
      value: statsData.totalScans || 0, 
      icon: Search, 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10', 
      border: 'border-blue-500/20',
      description: 'AI content analysis audits'
    },
    { 
      label: 'Scams Intercepted', 
      value: statsData.scamsDetected || 0, 
      icon: ShieldAlert, 
      color: 'text-red-400', 
      bg: 'bg-red-500/10', 
      border: 'border-red-500/20',
      description: 'Confirmed fraud threats'
    },
    { 
      label: 'Verified Safe Jobs', 
      value: safeJobs, 
      icon: ShieldCheck, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/20',
      description: 'Legitimate listings identified'
    },
    { 
      label: 'Global Integrity', 
      value: `${statsData.avgTrustScore || 0}%`, 
      icon: Activity, 
      color: 'text-indigo-400', 
      bg: 'bg-indigo-500/10', 
      border: 'border-indigo-500/20',
      description: 'Average trust coefficient'
    }
  ];

  return (
    <div className="flex flex-col gap-5 fade-slide-up-in">
      
      {/* --- Desktop-Only Dashboard View (Unchanged) --- */}
      <div className="hidden md:flex flex-col gap-5">
        {/* --- Console Status Header --- */}
        <div className="p-4 rounded-3xl border bg-[rgba(var(--cta-rgb),0.04)] border-blue-500/10 flex items-center justify-between flex-wrap gap-4 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
              <Shield size={16} />
            </div>
            <div>
              <div className="font-bold text-xs text-[var(--on-dark)] flex items-center gap-1.5">
                AI Trust Verification: <span className="text-emerald-400 font-black">ACTIVE</span>
                <span className="status-dot green"></span>
              </div>
              <div className="text-[10px] text-[var(--muted)] mt-0.5">Real-time heuristics monitoring is tracking job listing behaviors</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Neural Model:</span>
              <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1">
                <Cpu size={10} className="animate-pulse" /> Gemini v3.1 Flash
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Threat Database:</span>
              <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 flex items-center gap-1">
                <Terminal size={10} /> Sync Complete
              </span>
            </div>
          </div>
        </div>

        {/* --- Metrics Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <Card key={s.label || i} className="glass-card premium-card-edge rounded-2xl p-5 shadow-lg hover-lift transition-all group fade-slide-up-in border-[var(--hairline)]" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black tracking-widest text-[var(--muted)] uppercase">{s.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${s.bg} ${s.border} ${s.color} group-hover:scale-105 transition-transform`}>
                  <s.icon size={15} />
                </div>
              </div>
              <div className="text-2xl font-black tracking-tight text-[var(--on-dark)] leading-none">{s.value}</div>
              <div className="text-[10px] text-[var(--muted)] mt-2 font-medium">{s.description}</div>
            </Card>
          ))}
        </div>

        {/* --- Main Dashboard Rows (2 Columns) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column: Recent Activity */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="glass-card premium-card-edge rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
              <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--hairline)' }}>
                <h3 className="text-sm font-black m-0 tracking-tight text-[var(--on-dark)] uppercase">Security Scan Log</h3>
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">Audited Activity</span>
              </div>
              
              <div className="divide-y divide-[var(--hairline)] flex-1 flex flex-col" style={{ background: 'rgba(var(--primary-rgb), 0.01)' }}>
                {recentActivities?.map((a, i) => {
                  const { date, time } = formatDate(a.createdAt);
                  const isScam = a.type === 'scam';

                  return (
                    <div key={a.id || `recent-${i}`} className="flex items-center justify-between py-2.5 px-5 hover:bg-[rgba(var(--primary-rgb),0.04)] transition-colors group">
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:scale-105 transition-transform border border-[var(--hairline)] bg-[var(--surface-elevated)]">
                          <FileText size={14} />
                        </div>
                        <div className="flex flex-col min-w-0 pr-4">
                          <span className="text-xs font-bold truncate text-[var(--on-dark)]">{a.content ? a.content.substring(0, 45) + '...' : 'Untitled Scan'}</span>
                          <span className="text-[10px] mt-0.5 text-[var(--muted)]">{date} {time && `• ${time}`}</span>
                        </div>
                      </div>
                      
                      <div className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${
                        isScam 
                          ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      } font-bold text-[10px] tracking-wider`}>
                        {isScam ? <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span></span> : null}
                        {(a.type || 'safe').toUpperCase()}
                      </div>
                    </div>
                  );
                })}

                {(!recentActivities || recentActivities.length === 0) && (
                  <div className="flex flex-col items-center justify-center p-5 flex-1 text-center my-auto">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 bg-[var(--surface-elevated)] border border-[var(--hairline)]">
                      <Activity size={24} className="text-[var(--muted)]/50" />
                    </div>
                    <h4 className="font-bold text-xs mb-1 text-[var(--on-dark)]">No Logs Found</h4>
                    <p className="text-[11px] text-[var(--muted)] max-w-xs leading-relaxed">
                      AI real-time logging is waiting. Submit a job description in the Analyzer tab to begin monitoring.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: AI Threat Report console */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="glass-card premium-card-edge rounded-2xl shadow-xl p-5 flex flex-col relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-4">RECENT SCAM TRENDS</h4>

              <div className="flex flex-col gap-3 flex-1 justify-between">
                <div className="p-3.5 rounded-xl border border-[var(--hairline)] bg-[var(--surface-elevated)] text-xs">
                  <div className="font-bold text-[var(--on-dark)] mb-1 flex items-center gap-1.5">
                    <span className="status-dot green"></span> Safe Employment Patterns
                  </div>
                  <p className="text-[var(--muted)] text-[10px] leading-relaxed m-0 font-medium">
                    Verified salary ratios and employer identity anchors are performing within acceptable bounds.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[var(--hairline)] bg-[var(--surface-elevated)] text-xs">
                  <div className="font-bold text-[var(--on-dark)] mb-1 flex items-center gap-1.5">
                    <span className="status-dot yellow"></span> Urgency Scams
                  </div>
                  <p className="text-[var(--muted)] text-[10px] leading-relaxed m-0 font-medium">
                    High-urgency vocabularies (&quot;immediate recruitment, start today&quot;) remain primary triggers for suspicious score drops.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[var(--hairline)] bg-[var(--surface-elevated)] text-xs">
                  <div className="font-bold text-[var(--on-dark)] mb-1 flex items-center gap-1.5">
                    <span className="status-dot red"></span> Payment Scams Warning
                  </div>
                  <p className="text-[var(--muted)] text-[10px] leading-relaxed m-0 font-medium">
                    Job listings asking for initial processing fees or crypto wallet setups are flagged automatically as critical scam verdict matches.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- Mobile-Only Dashboard View (<768px) --- */}
      <div 
        className="md:hidden flex flex-col gap-3 relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull-to-refresh Indicator */}
        {(pullDistance > 0 || refreshing) && (
          <div 
            className="flex items-center justify-center w-full transition-all duration-150 overflow-hidden"
            style={{ height: `${Math.min(60, pullDistance)}px` }}
          >
            <RefreshCw 
              size={16} 
              className={`text-blue-500 ${refreshing ? 'animate-spin' : ''}`}
              style={{ transform: `rotate(${pullDistance * 4}deg)` }}
            />
            <span className="text-[10px] text-gray-400 font-bold ml-2">
              {refreshing ? 'Syncing...' : pullDistance > 55 ? 'Release to Refresh' : 'Pull to Refresh'}
            </span>
          </div>
        )}

        {/* Compact Premium Mobile Trust Hero */}
        <div className="glass-card rounded-2xl p-4 border border-[var(--hairline)] shadow-xl relative overflow-hidden flex items-center justify-between gap-3 max-h-[180px]">
          <div className="flex flex-col gap-1 relative z-10 flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400">AI Verification: ACTIVE</span>
            </div>
            <h2 className="text-base font-black text-[var(--on-dark)] leading-tight mt-1.5">Trust Score: {statsData.avgTrustScore || 0}/100</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-bold text-gray-400">Risk Level:</span>
              <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded border ${
                (statsData.avgTrustScore || 0) >= 75 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                  : (statsData.avgTrustScore || 0) >= 40 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' 
                    : 'bg-red-500/10 text-red-400 border-red-500/25'
              }`}>
                {(statsData.avgTrustScore || 0) >= 75 ? 'LOW' : (statsData.avgTrustScore || 0) >= 40 ? 'MODERATE' : 'HIGH'}
              </span>
            </div>
          </div>

          {/* Radial SVG Circle Indicator */}
          <div className="relative flex items-center justify-center w-20 h-20 flex-shrink-0 z-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="var(--hairline-strong)"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                className={`transition-all duration-1000 ${
                  (statsData.avgTrustScore || 0) >= 75 ? 'stroke-emerald-400' :
                  (statsData.avgTrustScore || 0) >= 40 ? 'stroke-amber-400' :
                  'stroke-red-400'
                }`}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${(2 * Math.PI * 34) - ((statsData.avgTrustScore || 0) / 100) * (2 * Math.PI * 34)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center flex flex-col justify-center items-center">
              <span className="text-[15px] font-black text-[var(--on-dark)] leading-none">{statsData.avgTrustScore || 0}%</span>
              <span className="text-[8px] font-bold text-gray-400 mt-0.5 leading-none">score</span>
            </div>
          </div>
        </div>

        {/* 2x2 Clickable Widget Grid (Quick Actions) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Action 1: Trust Analyzer */}
          <Link 
            href="/dashboard?tab=analyzer" 
            onClick={() => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20); }}
            className="block text-decoration-none active:scale-[0.96] active:opacity-90 transition-all duration-150"
          >
            <div className="glass-card rounded-2xl p-3.5 flex flex-col justify-between min-h-[110px] max-h-[140px] border border-[var(--hairline)] hover:border-blue-500/20 active:bg-blue-500/5 h-full">
              <div className="flex justify-between items-start w-full">
                <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase">Trust Analyzer</span>
                <ShieldCheck size={16} className="text-blue-400" />
              </div>
              <span className="text-[8px] text-gray-400 mt-3 font-semibold leading-normal">Submit job scans & verify authenticity</span>
            </div>
          </Link>

          {/* Action 2: Scan History */}
          <Link 
            href="/dashboard?tab=history" 
            onClick={() => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20); }}
            className="block text-decoration-none active:scale-[0.96] active:opacity-90 transition-all duration-150"
          >
            <div className="glass-card rounded-2xl p-3.5 flex flex-col justify-between min-h-[110px] max-h-[140px] border border-[var(--hairline)] hover:border-emerald-500/20 active:bg-emerald-500/5 h-full">
              <div className="flex justify-between items-start w-full">
                <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase">Scan History</span>
                <History size={16} className="text-emerald-400" />
              </div>
              <span className="text-[8px] text-gray-400 mt-3 font-semibold leading-normal">View previously verified employment listings</span>
            </div>
          </Link>

          {/* Action 3: User Profile */}
          <Link 
            href="/dashboard?tab=profile" 
            onClick={() => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20); }}
            className="block text-decoration-none active:scale-[0.96] active:opacity-90 transition-all duration-150"
          >
            <div className="glass-card rounded-2xl p-3.5 flex flex-col justify-between min-h-[110px] max-h-[140px] border border-[var(--hairline)] hover:border-purple-500/20 active:bg-purple-500/5 h-full">
              <div className="flex justify-between items-start w-full">
                <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase">User Profile</span>
                <User size={16} className="text-purple-400" />
              </div>
              <span className="text-[8px] text-gray-400 mt-3 font-semibold leading-normal">Update security credentials & contact info</span>
            </div>
          </Link>

          {/* Action 4: Settings */}
          <Link 
            href="/dashboard?tab=settings" 
            onClick={() => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20); }}
            className="block text-decoration-none active:scale-[0.96] active:opacity-90 transition-all duration-150"
          >
            <div className="glass-card rounded-2xl p-3.5 flex flex-col justify-between min-h-[110px] max-h-[140px] border border-[var(--hairline)] hover:border-amber-500/20 active:bg-amber-500/5 h-full">
              <div className="flex justify-between items-start w-full">
                <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase">Settings</span>
                <Settings size={16} className="text-amber-400" />
              </div>
              <span className="text-[8px] text-gray-400 mt-3 font-semibold leading-normal">Configure notification options & UI theme</span>
            </div>
          </Link>
        </div>

        {/* Compact Security Log List */}
        <div className="glass-card rounded-2xl border border-[var(--hairline)] overflow-hidden flex flex-col">
          <div className="px-3.5 py-2.5 border-b flex items-center justify-between" style={{ borderColor: 'var(--hairline)' }}>
            <h4 className="text-[10px] font-black tracking-tight text-[var(--on-dark)] uppercase m-0">Audit Logs</h4>
            <span className="text-[8px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">Active Threats</span>
          </div>
          <div className="divide-y divide-[var(--hairline)] flex-1 overflow-y-auto max-h-[190px]">
            {recentActivities?.slice(0, 3).map((a, i) => {
              const { date } = formatDate(a.createdAt);
              const isScam = a.type === 'scam';

              return (
                <div key={a.id || `recent-mobile-${i}`} className="flex items-center justify-between py-3 px-3.5 hover:bg-[rgba(var(--primary-rgb),0.02)] transition-colors">
                  <div className="min-w-0 pr-3 flex-1">
                    <div className="text-[10px] font-black truncate text-[var(--on-dark)]">
                      {a.content ? a.content.substring(0, 32) + '...' : 'Untitled Scan'}
                    </div>
                    <div className="text-[8px] text-[var(--muted)] mt-0.5">{date}</div>
                  </div>
                  <div className={`flex-shrink-0 px-2 py-0.5 rounded text-[8px] font-black border ${
                    isScam 
                      ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  } uppercase tracking-wider`}>
                    {a.type || 'safe'}
                  </div>
                </div>
              );
            })}

            {(!recentActivities || recentActivities.length === 0) && (
              <div className="text-center py-6 text-[10px] text-[var(--muted)] font-medium">No scans run yet.</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
