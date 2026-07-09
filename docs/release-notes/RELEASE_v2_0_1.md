# Release Notes - Version 2.0.1: Sprint 3: AI Router Stability & Robustness

## 1. Release Metadata
- **Release Version**: `2.0.1`
- **Release Tag**: `v2.0.1`
- **Branch**: `main`
- **Build Status**: Passed typecheck & build
- **Deployment Status**: Success / Vercel Production
- **Date**: 2026-07-08
- **Rollback commit**: `7c1a381`

## 2. Codebase Statistics
- **TypeScript/TSX Files**: 794
- **TypeScript/TSX LOC**: 184788
- **Component Count**: 115
- **Test Files**: 20
- **Firestore Rules LOC**: 92

## 3. Major Changes & Deliverables
- Refactored AI Router fallback sequence to retry DeepSeek if Gemini fails
- Optimized local storage hydration for search queries in dashboard

## 4. Architectural Decisions
- **ADR-004**: Strict Rate Limiting on AI Router Endpoint (Accepted)

## 5. Rollback Playbook
1. Revert deployment to commit `7c1a381`.
2. Git checkout command:
   ```bash
   git checkout 7c1a381 && npm run build
   ```
