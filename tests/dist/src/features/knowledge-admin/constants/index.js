"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PRIVILEGES = exports.PROHIBITED_CLAIMS_PHRASES = void 0;
exports.PROHIBITED_CLAIMS_PHRASES = [
    "guaranteed cure",
    "permanent cure",
    "no side effects",
    "replacement for emergency care",
    "replaces emergency care",
    "100% effective",
    "100% cure",
    "proven cure"
];
exports.ROLE_PRIVILEGES = {
    Administrator: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canReview: true,
        canPublish: true
    },
    MedicalEditor: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canReview: true,
        canPublish: false
    },
    Reviewer: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canReview: true,
        canPublish: false
    },
    Contributor: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canReview: false,
        canPublish: false
    },
    Viewer: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canReview: false,
        canPublish: false
    }
};
