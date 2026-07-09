"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EDITORIAL_RECORDS_REGISTRY = exports.SYSTEM_SOURCES_REGISTRY = void 0;
exports.SYSTEM_SOURCES_REGISTRY = {
    'hahnemann_cd': {
        id: 'hahnemann_cd',
        title: 'The Chronic Diseases, Their Peculiar Nature and Their Homoeopathic Cure',
        author: 'Dr. Samuel Hahnemann',
        edition: 'Theoretical Part',
        publicationYear: 1828,
        legalStatus: 'Public Domain',
        provenanceType: 'source-backed',
        confidencePolicy: 98
    },
    'kent_lectures': {
        id: 'kent_lectures',
        title: 'Lectures on Homoeopathic Materia Medica',
        author: 'James Tyler Kent',
        edition: '2nd Edition',
        publicationYear: 1905,
        legalStatus: 'Public Domain',
        provenanceType: 'source-backed',
        confidencePolicy: 95
    },
    'jethwani_private': {
        id: 'jethwani_private',
        title: 'Clinical Experience Logs and Cases',
        author: 'Dr. Narayan Jethwani',
        edition: 'Internal Release v4',
        publicationYear: 2026,
        legalStatus: 'Clinic Internal',
        provenanceType: 'Dr. Jethwani verified clinical note',
        confidencePolicy: 99
    },
    'cie_editorial': {
        id: 'cie_editorial',
        title: 'Clinical Operating System Editorial Additions',
        author: 'CIE Board',
        edition: '2026 Rev 2',
        publicationYear: 2026,
        legalStatus: 'Proprietary',
        provenanceType: 'editorial',
        confidencePolicy: 90
    },
    'ai_inferred': {
        id: 'ai_inferred',
        title: 'Clinical Knowledge Graph Inference engine',
        author: 'AIRouter',
        edition: 'v2.1',
        publicationYear: 2026,
        legalStatus: 'Proprietary',
        provenanceType: 'AI-assisted',
        confidencePolicy: 75
    }
};
exports.EDITORIAL_RECORDS_REGISTRY = {
    'Ars': [
        {
            id: 'rec_ars_jethwani',
            remedyId: 'Ars',
            sourceId: 'jethwani_private',
            currentStatus: 'Verified',
            revisionHistory: [
                {
                    version: '1.0.0',
                    created: '2026-01-10T08:00:00Z',
                    modified: '2026-01-10T12:00:00Z',
                    author: 'Dr. Jethwani',
                    reviewer: 'CIE Editor',
                    changeLog: 'Initial upload of Arsenicum restlessness notes.'
                },
                {
                    version: '1.1.0',
                    created: '2026-03-15T09:00:00Z',
                    modified: '2026-03-15T14:30:00Z',
                    author: 'Dr. Jethwani',
                    reviewer: 'CIE Editor',
                    changeLog: 'Added caution notes regarding low vital heat contraindications.'
                },
                {
                    version: '1.2.0',
                    created: '2026-07-04T12:00:00Z',
                    modified: '2026-07-04T14:00:00Z',
                    author: 'Dr. Jethwani',
                    reviewer: 'CIE Editor',
                    changeLog: 'Enriched records with Syphilitic miasmatic clues.'
                }
            ],
            approvals: [
                {
                    reviewer: 'Dr. Jethwani',
                    approvalDate: '2026-03-16T10:00:00Z',
                    status: 'Verified',
                    comments: 'Approved for active clinic decision support.'
                }
            ],
            clinicalPearlsIds: ['ars_pearl_restlessness', 'ars_pearl_caution', 'ars_pearl_miasm'],
            evidenceItemsIds: []
        },
        {
            id: 'rec_ars_kent',
            remedyId: 'Ars',
            sourceId: 'kent_lectures',
            currentStatus: 'Verified',
            revisionHistory: [
                {
                    version: '1.0.0',
                    created: '2025-12-01T00:00:00Z',
                    modified: '2025-12-01T00:00:00Z',
                    author: 'James Tyler Kent',
                    reviewer: 'Dr. Jethwani',
                    changeLog: 'Standard transposition of Kent Kent lectures.'
                }
            ],
            approvals: [
                {
                    reviewer: 'Dr. Jethwani',
                    approvalDate: '2025-12-10T00:00:00Z',
                    status: 'Verified',
                    comments: 'Matches standard keynote listings.'
                }
            ],
            clinicalPearlsIds: ['ars_pearl_heat'],
            evidenceItemsIds: ['ars_ev_respiratory']
        }
    ],
    'Nux-v': [
        {
            id: 'rec_nux_jethwani',
            remedyId: 'Nux-v',
            sourceId: 'jethwani_private',
            currentStatus: 'Verified',
            revisionHistory: [
                {
                    version: '1.0.0',
                    created: '2026-02-05T09:00:00Z',
                    modified: '2026-02-06T10:00:00Z',
                    author: 'Dr. Jethwani',
                    reviewer: 'CIE Editor',
                    changeLog: 'Drafted ineffectual urging stool observation.'
                },
                {
                    version: '1.1.0',
                    created: '2026-07-04T12:00:00Z',
                    modified: '2026-07-04T14:00:00Z',
                    author: 'Dr. Jethwani',
                    reviewer: 'CIE Editor',
                    changeLog: 'Enriched records with Mixed Psoric and active Sycotic miasmatic clues.'
                }
            ],
            approvals: [
                {
                    reviewer: 'Dr. Jethwani',
                    approvalDate: '2026-02-07T11:00:00Z',
                    status: 'Verified',
                    comments: 'Verified in clinical practice.'
                }
            ],
            clinicalPearlsIds: ['nux_pearl_stool', 'nux_pearl_miasm'],
            evidenceItemsIds: ['nux_ev_digestive']
        }
    ]
};
