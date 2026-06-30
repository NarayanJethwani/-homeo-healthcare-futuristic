export interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  location: string;
  complaint: string;
  careLevel: string;
  durationText: string;
  finalPrice: number;
  folderUrl: string;
  folderId?: string;
  sheetUrl: string;
  assignedDoctor: string;
  status: string;
  createdAt: string;
  receivedAmount?: number;
  remainingBalance?: number;
  lastSeen?: string;
  attachments?: any[];
  attachmentsUpdated?: string;
  billingCycle?: "monthly" | "weekly";
  concessionApplied?: string;
  conditionsCount?: number;
  durationValue?: number;
  medicineAddons?: { id: string; type: string; details: string; amount: number }[];
}

export interface SmartAlert {
  id: string;
  message: string;
  patientName?: string;
  level: "critical" | "high" | "medium" | "info";
  timestamp: string;
  isAcknowledged: boolean;
  isPinned: boolean;
  isMuted: boolean;
  category?: string;
}

export interface CdssRecommendation {
  id: string;
  recommendation: string;
  confidence: number;
  evidence: string;
  remedyLayer: string;
  nextInvestigation: string;
  patientId: string;
  patientName: string;
  supportingReports: string[];
}

export interface DashboardOverviewStats {
  appointmentsCount: number;
  followUpsCount: number;
  abnormalReportsCount: number;
  emergencyCasesCount: number;
  revenueCollected: number;
  recoveryIndex: string;
}

export * from "./branded";
