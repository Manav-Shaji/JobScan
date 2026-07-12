export interface AnalyzeResponse {
  success: boolean;
  score?: number;
  message?: string;
  data?: any;
}

export interface HistoryResponse {
  id: string;
  jobTitle: string;
  company: string;
  score: number;
  createdAt: string;
}

export interface ChatResponse {
  success: boolean;
  data?: string;
  message?: string;
}

export interface DashboardStats {
  totalScans: number;
  scamsDetected: number;
  avgTrustScore: number;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
}
