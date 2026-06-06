import { FileText, Search, Filter, ChevronDown, Calendar, AlertTriangle, MoreVertical, Briefcase } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationLink } from "@/components/ui/navigation";

const formatDate = (dateString) => {
  if (!dateString) return { date: 'N/A', time: '' };
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
};

const ScoreCircle = React.memo(({ score }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const isScam = score < 50;
  const isCaution = score >= 50 && score < 70;
  const fillPercentage = isScam ? (100 - score) : score;
  const strokeDashoffset = circumference - (fillPercentage / 100) * circumference;
  const color = isScam ? '#ef4444' : isCaution ? '#f59e0b' : '#10b981';

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex items-center justify-center w-11 h-11">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r={radius} stroke="var(--hairline-strong)" strokeWidth="2.5" fill="transparent" />
          <circle
            cx="22"
            cy="22"
            r={radius}
            stroke={color}
            strokeWidth="2.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex items-center justify-center inset-0 text-[var(--on-dark)] font-bold text-[11px]">
          {score}%
        </div>
      </div>
      <div className="flex flex-col">
        <span style={{ color: color }} className="font-bold text-xs uppercase tracking-wider">
          {isScam ? 'High Risk' : isCaution ? 'Medium Risk' : 'Low Risk'}
        </span>
        <span className="text-[10px] text-[var(--muted)]">Trust Score</span>
      </div>
    </div>
  );
});

ScoreCircle.displayName = 'ScoreCircle';

export function History({ fullHistory, loading }) {
  if (loading) {
    return (
      <div className="glass-card rounded-2xl overflow-hidden shadow-xl mb-8 p-6 border border-[var(--hairline)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl skeleton flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-32 skeleton" />
            <div className="h-3 w-48 skeleton" />
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-[var(--hairline)]">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-lg skeleton flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-1/3 skeleton" />
                  <div className="h-2.5 w-1/4 skeleton" />
                </div>
              </div>
              <div className="w-16 h-6 rounded skeleton flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = fullHistory?.length || 0;

  const filterOptions = [
    { value: 'all', label: 'All Scans' },
    { value: 'scam', label: 'Scam Threats' },
    { value: 'safe', label: 'Secure' },
    { value: 'caution', label: 'Caution' },
  ];
  
  const filteredHistory = useMemo(() => {
    return fullHistory?.filter(h => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = (
        (h.content?.toLowerCase().includes(term)) ||
        (h.title?.toLowerCase().includes(term)) ||
        (h.type?.toLowerCase().includes(term))
      );
      if (!matchesSearch) return false;
      if (filterType === 'all') return true;
      if (filterType === 'scam') return h.type === 'scam' || (h.score ?? 100) < 50;
      if (filterType === 'safe') return h.type === 'safe' || (h.score ?? 0) >= 70;
      if (filterType === 'caution') return h.type === 'caution' || ((h.score ?? 0) >= 50 && (h.score ?? 0) < 70);
      return true;
    }) || [];
  }, [fullHistory, searchTerm, filterType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="glass-card holo-card-edge rounded-2xl overflow-hidden shadow-xl mb-8 p-0 fade-slide-up-in" style={{ padding: 0 }}>
      
      {/* --- Filter Bar Header --- */}
      <div className="p-4 md:p-5 border-b border-[var(--hairline)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <FileText size={18} />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-black text-[var(--on-dark)] m-0 tracking-tight uppercase">Scan Archives</h2>
            <p className="text-[var(--muted)] text-[11px] m-0 mt-0.5">Verified list of jobs checked under your account</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2.5 w-full md:w-auto">
          <div className="relative w-full md:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={14} />
            <input 
              type="text" 
              placeholder="Search content or title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--surface-elevated)] border border-[var(--hairline)] rounded-xl pl-9 pr-4 h-12 md:h-auto md:py-1.5 text-xs text-[var(--on-dark)] placeholder-[var(--muted)] focus:outline-none focus:border-blue-500/60 transition-colors"
            />
          </div>
          <div className="w-full md:w-[180px]">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-12 md:h-auto md:py-1.5 bg-[var(--surface-elevated)] border-[var(--hairline)] text-xs">
                <div className="flex items-center gap-1.5">
                  <Filter size={13} />
                  <SelectValue placeholder="Filter" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[var(--surface-card)] border-[var(--hairline)] text-[var(--on-dark)]">
                {filterOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs hover:bg-[rgba(var(--primary-rgb),0.04)] focus:bg-blue-500/10 focus:text-blue-400">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* --- Table Headers --- */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[rgba(var(--primary-rgb),0.01)] border-b border-[var(--hairline)] text-[10px] font-black text-[var(--muted)] tracking-wider">
        <div className="col-span-3 flex items-center gap-1">TIMESTAMP <ChevronDown size={11} /></div>
        <div className="col-span-5">JOB SUMMARY</div>
        <div className="col-span-2">ASSESSMENT</div>
        <div className="col-span-2">VERDICT</div>
      </div>

      {/* --- Table Content --- */}
      <div className="divide-y divide-[var(--hairline)]">
        {paginatedHistory.map((h, i) => {
          const { date, time } = formatDate(h.createdAt);
          const score = h.score ?? 0;
          const isScam = h.type === 'scam' || score < 50;
          const isCaution = !isScam && (h.type === 'caution' || (score >= 50 && score < 70));
          
          return (
            <div key={i} className="group">
              {/* Desktop View */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4.5 items-center hover:bg-[rgba(var(--primary-rgb),0.04)] transition-colors">
                <div className="col-span-3 flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[var(--surface-elevated)] border border-[var(--hairline)] flex items-center justify-center text-blue-400 group-hover:border-blue-500/30 transition-colors flex-shrink-0">
                    <Calendar size={15} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[var(--on-dark)]">{date}</span>
                    <span className="text-[10px] text-[var(--muted)] mt-0.5">{time}</span>
                  </div>
                </div>

                <div className="col-span-5 flex flex-col pr-6 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[var(--on-dark)] truncate">{h.title || h.content?.split('\n')[0]?.substring(0, 45) || 'Job Listing'}</span>
                    <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded border ${
                      h.scanType === 'Combined' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      h.scanType === 'Poster' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                      'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {h.scanType || 'Text'}
                    </span>
                  </div>
                  {h.patternName && h.patternName !== 'None' ? (
                    <span className="text-[10px] text-amber-400 truncate flex items-center gap-1 mt-0.5">
                      <AlertTriangle size={10} /> Pattern Detected: {h.patternName}
                    </span>
                  ) : (
                    <span className="text-[11px] text-[var(--muted)] truncate mt-0.5">{h.content || 'Empty description content'}</span>
                  )}
                </div>

                <div className="col-span-2">
                  <ScoreCircle score={score} />
                </div>

                <div className="col-span-2 flex items-center justify-between">
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                    isScam 
                      ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                      : isCaution
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  } font-black text-[9px] tracking-widest`}>
                    {isScam ? <AlertTriangle size={12} className="text-red-500" /> : null}
                    {isScam ? 'SCAM THREAT' : isCaution ? 'CAUTION' : 'SECURE'}
                  </div>
                  <button className="text-[var(--muted)] hover:text-[var(--on-dark)] p-1 rounded transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Mobile View */}
              <div className="flex md:hidden flex-col p-3 gap-2 hover:bg-[rgba(var(--primary-rgb),0.04)] transition-colors min-h-[120px] max-h-[160px]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-[var(--on-dark)] truncate">{h.title || h.content?.split('\n')[0]?.substring(0, 45) || 'Job Listing'}</span>
                      <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded border flex-shrink-0 ${
                        h.scanType === 'Combined' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        h.scanType === 'Poster' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {h.scanType || 'Text'}
                      </span>
                    </div>
                    {h.patternName && h.patternName !== 'None' ? (
                      <span className="text-[10px] text-amber-400 truncate flex items-center gap-1 mt-0.5">
                        <AlertTriangle size={10} /> {h.patternName}
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--muted)] line-clamp-2 mt-0.5 whitespace-normal break-words leading-snug">{h.content || 'Empty description content'}</span>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <ScoreCircle score={score} />
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 mt-auto border-t border-[var(--hairline)]/50">
                  <div className="flex items-center gap-2 text-[10px] text-[var(--muted)] font-medium">
                     <Calendar size={12} className="text-blue-400/70" /> {date}
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                    isScam 
                      ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                      : isCaution
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  } font-black text-[9px] tracking-widest`}>
                    {isScam ? <AlertTriangle size={12} className="text-red-500" /> : null}
                    {isScam ? 'SCAM' : isCaution ? 'CAUTION' : 'SECURE'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredHistory.length === 0 && (
          <div className="p-10 flex flex-col items-center justify-center text-center text-[var(--muted)]">
            <div className="w-12 h-12 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--hairline)] flex items-center justify-center mb-3">
              <Briefcase size={20} className="text-[var(--muted)]" />
            </div>
            <h4 className="font-bold text-xs mb-1 text-[var(--on-dark)]">No Logs Found</h4>
            <p className="text-[11px] text-[var(--muted)] leading-relaxed m-0">
              {searchTerm ? 'No entries match your search criteria.' : 'Create an active scan and it will archive automatically.'}
            </p>
          </div>
        )}
      </div>

      {/* --- Footer Pagination Controls --- */}
      <div className="px-4 md:px-6 py-4.5 border-t border-[var(--hairline)] flex items-center justify-between bg-[rgba(var(--primary-rgb),0.01)] text-xs">
        <div className="text-[10px] md:text-[11px] font-medium text-[var(--muted)]">
          Showing {filteredHistory.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredHistory.length)} of {filteredHistory.length} archives
        </div>
        
        {totalPages > 0 && (
          <Pagination className="justify-end w-auto mx-0">
            <PaginationContent className="gap-1 md:gap-2">
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={`h-8 px-3 py-0 flex items-center justify-center rounded-lg border cursor-pointer ${currentPage === 1 ? 'border-[var(--hairline)] text-[var(--muted)] pointer-events-none opacity-50' : 'border-[var(--hairline)] text-[var(--on-dark)] hover:bg-white/5 transition-colors'}`}
                />
              </PaginationItem>
              
              <PaginationItem>
                <PaginationLink isActive className="h-8 min-w-[32px] rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 font-black text-xs">
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={`h-8 px-3 py-0 flex items-center justify-center rounded-lg border cursor-pointer ${currentPage >= totalPages ? 'border-[var(--hairline)] text-[var(--muted)] pointer-events-none opacity-50' : 'border-[var(--hairline)] text-[var(--on-dark)] hover:bg-white/5 transition-colors'}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
