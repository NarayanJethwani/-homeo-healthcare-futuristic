import { 
  Users, Activity, Sparkles, Folder, FileSpreadsheet, ExternalLink,
  Search, Sliders, Brain, RefreshCw, Send, Plus, Trash2, CheckCircle,
  ShieldAlert, Award, FileText, ChevronRight, UserPlus, BookOpen, Book,
  Gauge, AlertTriangle, Compass, Layers, History, Zap, TrendingUp, Calendar
} from "lucide-react";

export const dashboardConfig = {
  // Sidebar items configuration
  sidebarGroups: [
    {
      title: "Core Clinical OS",
      items: [
        { id: "dashboard", label: "Intelligence Desk", icon: Gauge },
        { id: "intake", label: "AI Intake Vault", icon: Sparkles },
        { id: "patients", label: "Patient Care Registry", icon: Users },
        { id: "diagnostics", label: "CDS Diagnostic Engine", icon: Brain },
        { id: "analyzer", label: "Lab Report Analyzer", icon: FileText },
        { id: "treatment-planner", label: "Treatment Strategy Lab", icon: Sliders },
      ]
    },
    {
      title: "Integrations & Research",
      items: [
        { id: "diet-lifestyle", label: "Nutritional & Miasmatic Diet", icon: Layers },
        { id: "nexus-atlas", label: "Repertory Nexus Atlas", icon: Compass },
        { id: "cie", label: "Clinical Intelligence Engine", icon: Activity },
        { id: "medical-academy", label: "3D Anatomy & Twin Lab", icon: Award },
        { id: "learning-hub", label: "Homeopathic Materia Academy", icon: BookOpen },
        { id: "communication", label: "Patient outreach portal", icon: Send },
        { id: "ai-router", label: "Resilient Routing console", icon: RefreshCw },
        { id: "health-intelligence", label: "Bio-Telemetry Analyzer", icon: Zap },
      ]
    }
  ],

  // Severity color mappings
  alertSeverity: {
    critical: {
      bg: "bg-red-50 dark:bg-red-950/20",
      border: "border-red-100 dark:border-red-900/30",
      text: "text-red-800 dark:text-red-400",
      iconColor: "text-red-500",
      badge: "bg-red-500 text-white"
    },
    high: {
      bg: "bg-amber-50 dark:bg-amber-950/20",
      border: "border-amber-100 dark:border-amber-900/30",
      text: "text-amber-800 dark:text-amber-400",
      iconColor: "text-amber-500",
      badge: "bg-amber-500 text-white"
    },
    medium: {
      bg: "bg-sky-50 dark:bg-sky-950/20",
      border: "border-sky-100 dark:border-sky-900/30",
      text: "text-sky-800 dark:text-sky-400",
      iconColor: "text-sky-500",
      badge: "bg-sky-500 text-white"
    },
    info: {
      bg: "bg-slate-50 dark:bg-slate-900/40",
      border: "border-slate-100 dark:border-slate-800/60",
      text: "text-slate-800 dark:text-slate-300",
      iconColor: "text-slate-500",
      badge: "bg-slate-500 text-white"
    }
  },

  // KPI metadata cards
  kpiMetadata: [
    { key: "appointments", label: "Intake Pending", icon: Calendar, color: "from-teal-600 to-emerald-600" },
    { key: "followUps", label: "Follow-up Due", icon: History, color: "from-blue-600 to-indigo-600" },
    { key: "abnormalReports", label: "Pathology Alert", icon: AlertTriangle, color: "from-amber-600 to-orange-600" },
    { key: "emergencyCases", label: "Critical Priority", icon: ShieldAlert, color: "from-rose-600 to-red-600" }
  ],

  // Animation constants
  animations: {
    durationShort: 0.15,
    durationMedium: 0.3,
    durationLong: 0.5,
    ease: "easeInOut"
  }
};
