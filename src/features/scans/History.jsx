/**
 * ------------------------------------------------------------
 * Component: History
 * 
 * Purpose:
 * Displays a tabular view of past job scan results.
 * 
 * Responsibilities:
 * • Render scan history table with sorting and filtering
 * • Display trust scores visually
 * • Handle scan deletion
 * 
 * Used By:
 * • /dashboard/history/page.jsx
 * ------------------------------------------------------------
 */

import { FileText, Search, Filter, ChevronDown, Calendar, AlertTriangle, MoreVertical, Briefcase, Eye, Trash2, RotateCw } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from '@tanstack/react-table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/ui/forms";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationLink } from "@/core/ui/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/core/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/core/ui/dialog";
import { m, AnimatePresence } from 'motion/react';
import { staggerContainer, slideUp } from '@/core/motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/core/lib/api-client';
import { queryKeys } from '@/core/lib/query-keys';
import { useToast } from "@/core/ui/use-toast";

const formatDate = (dateString) => {
  if (!dateString) return { date: 'N/A', time: '' };
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
};

const cleanText = (text) => {
  if (!text) return '';
  const cleaned = text.replace(/^(job description|job title|title|job|role):?\s*/i, '').trim();
  // If cleaning made it empty, just return the original text
  return cleaned || text.trim();
};

const getTitle = (h) => {
  if (h.title && h.title.trim() !== '') {
      const cleaned = cleanText(h.title);
      if (cleaned) return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  // Fallback to first line of content
  const firstLine = h.content?.split('\\n')[0] || '';
  if (firstLine.trim()) {
      const cleaned = cleanText(firstLine).substring(0, 45).trim();
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1) + (firstLine.length > 45 ? '...' : '');
  }
  return 'Job Scan Document';
};

const getSnippet = (h) => {
  const title = getTitle(h).replace('...', '');
  let content = h.content ? h.content.trim() : '';
  
  // Remove the title from the beginning of the content snippet to prevent redundancy
  if (content.toLowerCase().startsWith(title.toLowerCase())) {
      // Break the regex apart so Tailwind JIT ignores it
      const regexString = '^[' + '-' + ':\\\\s]+';
      const cleanupRegex = new RegExp(regexString);
      content = content.substring(title.length).replace(cleanupRegex, '').trim();
  }
  
  // Strip out prefixes if they appear at the very beginning of the snippet too
  content = content.replace(/^(job description|job title|title|job|role):?\\s*/i, '').trim();
  
  return content || 'No further description provided.';
};

const ScoreCircle = ({ score }) => {
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
            className="transition duration-1000 ease-out"
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
};

const filterOptions = [
  { value: 'all', label: 'All Scans' },
  { value: 'scam', label: 'Scam Threats' },
  { value: 'safe', label: 'Secure' },
  { value: 'caution', label: 'Caution' },
];

const HistoryActions = ({ scan, onRescan, onDelete, onViewDetails }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button type="button" aria-label="More options" className="text-[var(--muted)] hover:text-[var(--on-dark)] p-1 rounded transition-colors focus:outline-none">
        <MoreVertical size={16} />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-40">
      <DropdownMenuItem onSelect={() => setTimeout(() => onViewDetails(scan), 10)}>
        <Eye className="w-4 h-4 mr-2" /> View Details
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => onRescan(scan.content)}>
        <RotateCw className="w-4 h-4 mr-2" /> Re-Scan
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => onDelete(scan.id)} className="text-red-400 hover:text-red-500 hover:bg-red-500/10 focus:text-red-500 focus:bg-red-500/10">
        <Trash2 className="w-4 h-4 mr-2" /> Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export function History({ fullHistory, loading }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [globalFilter, setGlobalFilter] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedScan, setSelectedScan] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: async (scanId) => {
      return api.deleteScan(scanId);
    },
    onSuccess: () => {
      toast({ title: 'Scan Deleted', description: 'The scan was successfully removed from your history.' });
      queryClient.invalidateQueries({ queryKey: queryKeys.scans.history });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
    onError: () => {
      toast({ title: 'Deletion Failed', description: 'There was an error deleting the scan.', variant: 'destructive' });
    }
  });

  const handleRescan = (content) => {
    sessionStorage.setItem('jobscan_rescan_text', content || '');
    router.push('/dashboard?tab=analyzer');
  };

  const columns = useMemo(() => [
    {
      id: 'searchable',
      accessorFn: (row) => `${row.title || ''} ${row.content || ''} ${row.type || ''}`,
    },
    {
      id: 'riskLevel',
      accessorFn: (row) => {
        const score = row.score ?? 0;
        if (row.type === 'scam' || score < 50) return 'scam';
        if (row.type === 'caution' || (score >= 50 && score < 70)) return 'caution';
        return 'safe';
      },
      filterFn: (row, columnId, filterValue) => {
        if (filterValue === 'all') return true;
        return row.getValue(columnId) === filterValue;
      }
    }
  ], []);

  const columnFilters = useMemo(() => {
    if (filterType === 'all') return [];
    return [{ id: 'riskLevel', value: filterType }];
  }, [filterType]);

  const table = useReactTable({
    data: fullHistory || [],
    columns,
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      }
    }
  });

  const paginatedRows = table.getRowModel().rows;
  const filteredLength = table.getFilteredRowModel().rows.length;
  const paginationState = table.getState().pagination;

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
              aria-label="Search archives"
              placeholder="Search content or title..." 
              value={globalFilter}
              onChange={(e) => { setGlobalFilter(e.target.value); table.setPageIndex(0); }}
              className="w-full bg-[var(--surface-elevated)] border border-[var(--hairline)] rounded-xl pl-9 pr-4 h-12 md:h-auto md:py-1.5 text-xs text-[var(--on-dark)] placeholder-[var(--muted)] focus:outline-none focus:border-blue-500/60 transition-colors"
            />
          </div>
          <div className="w-full md:w-[180px]">
            <Select value={filterType} onValueChange={(val) => { setFilterType(val); table.setPageIndex(0); }}>
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
      <m.div variants={staggerContainer} initial="hidden" animate="visible" className="divide-y divide-[var(--hairline)]">
        <AnimatePresence mode="popLayout">
        {paginatedRows.map((row, i) => {
          const h = row.original;
          const { date, time } = formatDate(h.createdAt);
          const score = h.score ?? 0;
          const isScam = h.type === 'scam' || score < 50;
          const isCaution = !isScam && (h.type === 'caution' || (score >= 50 && score < 70));
          
          return (
            <m.div variants={slideUp} layout initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} key={h.id || `${h.createdAt}-${i}`} className="group">
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
                    <span className="text-xs font-bold text-[var(--on-dark)] truncate capitalize">{getTitle(h)}</span>
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
                    <span className="text-[11px] text-[var(--muted)] truncate mt-0.5">{getSnippet(h)}</span>
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
                  <HistoryActions scan={h} onRescan={handleRescan} onDelete={(id) => deleteMutation.mutate(id)} onViewDetails={setSelectedScan} />
                </div>
              </div>

              {/* Mobile View */}
              <div className="flex md:hidden flex-col p-3 gap-2 hover:bg-[rgba(var(--primary-rgb),0.04)] transition-colors min-h-[120px] max-h-[160px]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-[var(--on-dark)] truncate capitalize">{getTitle(h)}</span>
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
                      <span className="text-xs text-[var(--muted)] line-clamp-2 mt-0.5 whitespace-normal break-words leading-snug">{getSnippet(h)}</span>
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
                  <HistoryActions scan={h} onRescan={handleRescan} onDelete={(id) => deleteMutation.mutate(id)} onViewDetails={setSelectedScan} />
                </div>
              </div>
            </m.div>
          );
        })}

        {filteredLength === 0 && (
          <div className="p-12 flex flex-col items-center justify-center text-center text-[var(--muted)] min-h-[300px]">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--surface-elevated)] to-[rgba(var(--primary-rgb),0.02)] border border-[var(--hairline)] flex items-center justify-center mb-5 shadow-inner relative group">
              <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-xl group-hover:bg-blue-500/10 transition-colors duration-500"></div>
              <Briefcase size={32} className="text-blue-500/60 relative z-10" />
            </div>
            <h4 className="font-black text-sm mb-2 text-[var(--on-dark)] tracking-tight">
              {globalFilter ? 'No Results Found' : 'No Scan History Yet'}
            </h4>
            <p className="text-xs text-[var(--muted)] leading-relaxed max-w-xs mx-auto mb-6">
              {globalFilter 
                ? 'Try adjusting your search terms or filters to find what you are looking for.' 
                : 'Analyze your first job posting to start building your history and tracking potential threats.'}
            </p>
            {!globalFilter && (
              <Link href="/dashboard/analyzer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-bold text-[11px] tracking-wider uppercase transition shadow-[0_4px_15px_rgba(59,130,246,0.2)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.3)] active:scale-[0.98]">
                Analyze a Job
              </Link>
            )}
          </div>
        )}
        </AnimatePresence>
      </m.div>

      {/* --- Footer Pagination Controls --- */}
      <div className="px-4 md:px-6 py-4.5 border-t border-[var(--hairline)] flex items-center justify-between bg-[rgba(var(--primary-rgb),0.01)] text-xs">
        <div className="text-[10px] md:text-[11px] font-medium text-[var(--muted)]">
          Showing {filteredLength > 0 ? (paginationState.pageIndex * paginationState.pageSize) + 1 : 0} to {Math.min((paginationState.pageIndex + 1) * paginationState.pageSize, filteredLength)} of {filteredLength} archives
        </div>
        
        {table.getPageCount() > 0 && (
          <Pagination className="justify-end w-auto mx-0">
            <PaginationContent className="gap-1 md:gap-2">
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => { e.preventDefault(); table.previousPage(); }}
                  className={`h-8 px-3 py-0 flex items-center justify-center rounded-lg border cursor-pointer ${!table.getCanPreviousPage() ? 'border-[var(--hairline)] text-[var(--muted)] pointer-events-none opacity-50' : 'border-[var(--hairline)] text-[var(--on-dark)] hover:bg-white/5 transition-colors'}`}
                />
              </PaginationItem>
              
              <PaginationItem>
                <PaginationLink href="#" onClick={(e) => e.preventDefault()} isActive className="h-8 min-w-[32px] rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 font-black text-xs">
                  {paginationState.pageIndex + 1}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => { e.preventDefault(); table.nextPage(); }}
                  className={`h-8 px-3 py-0 flex items-center justify-center rounded-lg border cursor-pointer ${!table.getCanNextPage() ? 'border-[var(--hairline)] text-[var(--muted)] pointer-events-none opacity-50' : 'border-[var(--hairline)] text-[var(--on-dark)] hover:bg-white/5 transition-colors'}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Dialog for View Details */}
      <Dialog open={!!selectedScan} onOpenChange={(open) => !open && setSelectedScan(null)}>
        <DialogContent className="max-w-2xl bg-[var(--surface-elevated)] border-[var(--hairline)] text-[var(--on-dark)]">
          <DialogHeader>
            <DialogTitle>Scan Details</DialogTitle>
            <DialogDescription>
              A complete breakdown of the analyzed content.
            </DialogDescription>
          </DialogHeader>
          {selectedScan && (
             <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                   <h3 className="text-xs font-bold text-[var(--muted)] mb-2 uppercase">Trust Score</h3>
                   <div className="flex items-center gap-4">
                      <ScoreCircle score={selectedScan.score} />
                      <div className="flex-1">
                         <div className="text-sm font-semibold text-[var(--on-dark)] mb-1">
                            {selectedScan.type === 'scam' || selectedScan.score < 50 ? 'SCAM THREAT DETECTED' : selectedScan.type === 'caution' || (selectedScan.score >= 50 && selectedScan.score < 70) ? 'CAUTION ADVISED' : 'APPEARS LEGITIMATE'}
                         </div>
                      </div>
                   </div>
                </div>
                
                {selectedScan.patternName && selectedScan.patternName !== 'None' && (
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                     <h3 className="text-xs font-bold text-amber-500 mb-2 uppercase">Pattern Detected</h3>
                     <p className="text-sm text-amber-400 mb-0">{selectedScan.patternName}</p>
                  </div>
                )}
                
                <div>
                   <h3 className="text-xs font-bold text-[var(--muted)] mb-2 uppercase">Analyzed Content</h3>
                   <div className="p-4 rounded-xl bg-black/20 border border-[var(--hairline)] text-sm text-[var(--on-dark)] whitespace-pre-wrap break-words">
                      {selectedScan.content || 'No text content available.'}
                   </div>
                </div>
             </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
