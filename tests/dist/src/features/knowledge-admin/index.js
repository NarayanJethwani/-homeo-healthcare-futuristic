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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmsClient = exports.RoleBadge = exports.EvidenceBadge = exports.EditorialStatusBadge = exports.Badge = exports.DashboardHealthCard = exports.VersionTimeline = exports.QualityGatePanel = exports.RelationshipGraph = exports.ReferencePicker = exports.KnowledgeEditor = exports.CitationLibrary = exports.EntityRegistry = exports.KmsDashboard = void 0;
__exportStar(require("./types"), exports);
__exportStar(require("./repositories/KnowledgeRepository"), exports);
__exportStar(require("./repositories/MemoryRepository"), exports);
__exportStar(require("./repositories/FirestoreRepository"), exports);
__exportStar(require("./adapters/importExport"), exports);
__exportStar(require("./adapters/diff"), exports);
__exportStar(require("./adapters/searchConsoleAdapter"), exports);
__exportStar(require("./adapters/analyticsAdapter"), exports);
__exportStar(require("./validation/qualityGates"), exports);
__exportStar(require("./validation/duplicateDetector"), exports);
__exportStar(require("./validation/relationshipSuggestions"), exports);
// Pages
var KmsDashboard_1 = require("./pages/KmsDashboard");
Object.defineProperty(exports, "KmsDashboard", { enumerable: true, get: function () { return __importDefault(KmsDashboard_1).default; } });
var EntityRegistry_1 = require("./pages/EntityRegistry");
Object.defineProperty(exports, "EntityRegistry", { enumerable: true, get: function () { return __importDefault(EntityRegistry_1).default; } });
var CitationLibrary_1 = require("./pages/CitationLibrary");
Object.defineProperty(exports, "CitationLibrary", { enumerable: true, get: function () { return __importDefault(CitationLibrary_1).default; } });
// Components
var KnowledgeEditor_1 = require("./components/KnowledgeEditor");
Object.defineProperty(exports, "KnowledgeEditor", { enumerable: true, get: function () { return __importDefault(KnowledgeEditor_1).default; } });
var ReferencePicker_1 = require("./components/ReferencePicker");
Object.defineProperty(exports, "ReferencePicker", { enumerable: true, get: function () { return __importDefault(ReferencePicker_1).default; } });
var RelationshipGraph_1 = require("./components/RelationshipGraph");
Object.defineProperty(exports, "RelationshipGraph", { enumerable: true, get: function () { return __importDefault(RelationshipGraph_1).default; } });
var QualityGatePanel_1 = require("./components/QualityGatePanel");
Object.defineProperty(exports, "QualityGatePanel", { enumerable: true, get: function () { return __importDefault(QualityGatePanel_1).default; } });
var VersionTimeline_1 = require("./components/VersionTimeline");
Object.defineProperty(exports, "VersionTimeline", { enumerable: true, get: function () { return __importDefault(VersionTimeline_1).default; } });
var DashboardHealthCard_1 = require("./components/DashboardHealthCard");
Object.defineProperty(exports, "DashboardHealthCard", { enumerable: true, get: function () { return __importDefault(DashboardHealthCard_1).default; } });
var Badge_1 = require("./components/Badge");
Object.defineProperty(exports, "Badge", { enumerable: true, get: function () { return Badge_1.Badge; } });
Object.defineProperty(exports, "EditorialStatusBadge", { enumerable: true, get: function () { return Badge_1.EditorialStatusBadge; } });
Object.defineProperty(exports, "EvidenceBadge", { enumerable: true, get: function () { return Badge_1.EvidenceBadge; } });
Object.defineProperty(exports, "RoleBadge", { enumerable: true, get: function () { return Badge_1.RoleBadge; } });
__exportStar(require("./services/editorialPriorityService"), exports);
__exportStar(require("./workflow/types"), exports);
__exportStar(require("./workflow/workflowClient"), exports);
__exportStar(require("./workflow/reviewerDirectory"), exports);
// CMS
__exportStar(require("./cms/types"), exports);
__exportStar(require("./cms/publicationReadiness"), exports);
exports.cmsClient = __importStar(require("./cms/cmsClient"));
