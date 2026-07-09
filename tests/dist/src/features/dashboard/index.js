"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeKmsWidget = exports.MyTasksWidget = exports.SystemStatusStrip = exports.TodaySchedule = exports.TodayOverviewStats = exports.SystemStatusGrid = exports.QuickActionsGrid = exports.PatientQueue = exports.GlobalCommandPalette = exports.DisplaySettingsDrawer = exports.DashboardHeader = exports.CriticalAlertsPanel = exports.ClinicalKpiCards = exports.AnalyticsPanel = exports.AiRecommendationsPanel = exports.AdminSidebar = exports.ActivityTimeline = exports.DashboardErrorBoundary = exports.PatientCardSkeleton = exports.AlertsSkeleton = exports.AnalyticsSkeleton = exports.QueueSkeleton = exports.DashboardSkeleton = void 0;
// Types & Branded IDs
__exportStar(require("./types"), exports);
// Business Domain Logic
__exportStar(require("./domain/patients"), exports);
__exportStar(require("./domain/appointments"), exports);
__exportStar(require("./domain/alerts"), exports);
__exportStar(require("./domain/analytics"), exports);
__exportStar(require("./domain/cdss"), exports);
// Telemetry & Data Services
__exportStar(require("./services"), exports);
// Calculation Selectors
__exportStar(require("./selectors/dashboardSelectors"), exports);
// Layout Configuration & Feature Flags
__exportStar(require("./constants/dashboardConfig"), exports);
__exportStar(require("./constants/featureFlags"), exports);
// Hooks
__exportStar(require("./hooks/useDashboardPreferences"), exports);
__exportStar(require("./hooks/usePatientQueue"), exports);
__exportStar(require("./hooks/useClinicalAlerts"), exports);
__exportStar(require("./hooks/useCdss"), exports);
__exportStar(require("./hooks/useAnalytics"), exports);
__exportStar(require("./hooks/useDashboardMetrics"), exports);
// Context & State Providers
__exportStar(require("./contexts/DashboardContext"), exports);
__exportStar(require("./providers/DashboardProvider"), exports);
// Logging Utility
__exportStar(require("./utils/dashboardLogger"), exports);
// Skeletons & Error Boundaries
var DashboardSkeleton_1 = require("./components/skeletons/DashboardSkeleton");
Object.defineProperty(exports, "DashboardSkeleton", { enumerable: true, get: function () { return __importDefault(DashboardSkeleton_1).default; } });
var QueueSkeleton_1 = require("./components/skeletons/QueueSkeleton");
Object.defineProperty(exports, "QueueSkeleton", { enumerable: true, get: function () { return __importDefault(QueueSkeleton_1).default; } });
var AnalyticsSkeleton_1 = require("./components/skeletons/AnalyticsSkeleton");
Object.defineProperty(exports, "AnalyticsSkeleton", { enumerable: true, get: function () { return __importDefault(AnalyticsSkeleton_1).default; } });
var AlertsSkeleton_1 = require("./components/skeletons/AlertsSkeleton");
Object.defineProperty(exports, "AlertsSkeleton", { enumerable: true, get: function () { return __importDefault(AlertsSkeleton_1).default; } });
var PatientCardSkeleton_1 = require("./components/skeletons/PatientCardSkeleton");
Object.defineProperty(exports, "PatientCardSkeleton", { enumerable: true, get: function () { return __importDefault(PatientCardSkeleton_1).default; } });
var DashboardErrorBoundary_1 = require("./components/DashboardErrorBoundary");
Object.defineProperty(exports, "DashboardErrorBoundary", { enumerable: true, get: function () { return __importDefault(DashboardErrorBoundary_1).default; } });
// Standard Components
var ActivityTimeline_1 = require("./components/ActivityTimeline");
Object.defineProperty(exports, "ActivityTimeline", { enumerable: true, get: function () { return __importDefault(ActivityTimeline_1).default; } });
var AdminSidebar_1 = require("./components/AdminSidebar");
Object.defineProperty(exports, "AdminSidebar", { enumerable: true, get: function () { return __importDefault(AdminSidebar_1).default; } });
var AiRecommendationsPanel_1 = require("./components/AiRecommendationsPanel");
Object.defineProperty(exports, "AiRecommendationsPanel", { enumerable: true, get: function () { return __importDefault(AiRecommendationsPanel_1).default; } });
var AnalyticsPanel_1 = require("./components/AnalyticsPanel");
Object.defineProperty(exports, "AnalyticsPanel", { enumerable: true, get: function () { return __importDefault(AnalyticsPanel_1).default; } });
var ClinicalKpiCards_1 = require("./components/ClinicalKpiCards");
Object.defineProperty(exports, "ClinicalKpiCards", { enumerable: true, get: function () { return __importDefault(ClinicalKpiCards_1).default; } });
var CriticalAlertsPanel_1 = require("./components/CriticalAlertsPanel");
Object.defineProperty(exports, "CriticalAlertsPanel", { enumerable: true, get: function () { return __importDefault(CriticalAlertsPanel_1).default; } });
var DashboardHeader_1 = require("./components/DashboardHeader");
Object.defineProperty(exports, "DashboardHeader", { enumerable: true, get: function () { return __importDefault(DashboardHeader_1).default; } });
var DisplaySettingsDrawer_1 = require("./components/DisplaySettingsDrawer");
Object.defineProperty(exports, "DisplaySettingsDrawer", { enumerable: true, get: function () { return __importDefault(DisplaySettingsDrawer_1).default; } });
var GlobalCommandPalette_1 = require("./components/GlobalCommandPalette");
Object.defineProperty(exports, "GlobalCommandPalette", { enumerable: true, get: function () { return __importDefault(GlobalCommandPalette_1).default; } });
var PatientQueue_1 = require("./components/PatientQueue");
Object.defineProperty(exports, "PatientQueue", { enumerable: true, get: function () { return __importDefault(PatientQueue_1).default; } });
var QuickActionsGrid_1 = require("./components/QuickActionsGrid");
Object.defineProperty(exports, "QuickActionsGrid", { enumerable: true, get: function () { return __importDefault(QuickActionsGrid_1).default; } });
var SystemStatusGrid_1 = require("./components/SystemStatusGrid");
Object.defineProperty(exports, "SystemStatusGrid", { enumerable: true, get: function () { return __importDefault(SystemStatusGrid_1).default; } });
var TodayOverviewStats_1 = require("./components/TodayOverviewStats");
Object.defineProperty(exports, "TodayOverviewStats", { enumerable: true, get: function () { return __importDefault(TodayOverviewStats_1).default; } });
var TodaySchedule_1 = require("./components/TodaySchedule");
Object.defineProperty(exports, "TodaySchedule", { enumerable: true, get: function () { return __importDefault(TodaySchedule_1).default; } });
var SystemStatusStrip_1 = require("./components/SystemStatusStrip");
Object.defineProperty(exports, "SystemStatusStrip", { enumerable: true, get: function () { return __importDefault(SystemStatusStrip_1).default; } });
var MyTasksWidget_1 = require("./components/MyTasksWidget");
Object.defineProperty(exports, "MyTasksWidget", { enumerable: true, get: function () { return __importDefault(MyTasksWidget_1).default; } });
var KnowledgeKmsWidget_1 = require("./components/KnowledgeKmsWidget");
Object.defineProperty(exports, "KnowledgeKmsWidget", { enumerable: true, get: function () { return __importDefault(KnowledgeKmsWidget_1).default; } });
