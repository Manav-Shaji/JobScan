export interface StandardApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
  errors?: any[];
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  avatarUrl?: string | null;
  totalScans?: number;
}

export interface Profile {
  id: string;
  name: string | null;
  role: 'user' | 'admin';
  email: string;
  avatarUrl?: string | null;
}

export interface JobScan {
  id: string;
  userId: string | null;
  content: string;
  contentHash: string;
  trustScore: number;
  verdict: 'safe' | 'warning' | 'scam';
  riskLevel: 'low' | 'medium' | 'high';
  redFlags: string[];
  breakdown: any;
  createdAt: string;
  isCached?: boolean;
  communityReports?: number;
}

export interface ScamReport {
  id: string;
  hash: string;
  reason: string;
  status: 'pending' | 'scam' | 'safe';
  evidence: string;
  createdAt: string;
  reporter: {
    name: string;
    email: string;
  };
  job: {
    title: string;
    company: string;
    description: string;
    trustScore: number;
    aiVerdict: 'safe' | 'warning' | 'scam';
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalScans: number;
  scamDetections: number;
  safeListings: number;
  reportsSubmitted: number;
  aiRequestsToday: number;
}

export interface AnalyticsChartData {
  pieChart: Array<{ name: string; value: number; color: string }>;
  barChart: Array<{ name: string; Scans: number }>;
  lineChart: Array<{ name: string; Scans: number; Reports: number }>;
}

export interface AdminDashboardOverview {
  stats: AdminDashboardStats;
  analytics: AnalyticsChartData;
}
