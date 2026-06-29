# Release V1.0 - Clinical Portal Checklist

This checklist tracks and verifies all features, security controls, environment settings, and testing protocols required to lock down Version 1.0 of the Homeo Healthcare Clinical Portal.

---

## 🌟 1. Completed Features

### Clinical Intelligence Engine
- [x] **Multi-Remedy Side-by-Side Comparison**: Clinicians can view comparative remedy features, matching metrics, and potency requirements dynamically.
- [x] **Hering's Law Analyzer**: Automates the direction of cure evaluation based on classical homeopathic law.
- [x] **Note-to-Rubric AI Translation**: Translates free-form clinician intake notes directly to structured repertorial rubrics.

### Patient Management
- [x] **Longitudinal Patient Timeline**: Provides a unified profile dashboard for demographics, records, and prescriptions.
- [x] **Smart Fuzzy Search**: Instant, query-based patient filtering by location, ID, name, or symptoms.
- [x] **Automated Follow-up Reminders**: Warning banners alerting due checkups (14 days for new patients, 30 days for regular patients).
- [x] **Google Drive Synced Attachments**: Stores files directly in secure Drive folders, leaving metadata links in Firestore.

### AI Knowledge Base Integration & Grounding
- [x] **RAG Grounding**: Grounded answers using classical text libraries (Kent, Boericke, Samuel Hahnemann's Organon of Medicine 6th Edition).
- [x] **RAG Citation Formatting**: Explicit formatting of sources cited inside AI consultation responses.
- [x] **Prescription Safety Warnings**: Dynamic warnings mapping inimical remedy pairs and foreign body expulsion hazards (e.g. `Silicea` with pacemakers/screws).

---

## 🔒 2. Verified Security Controls

- [x] **Session Expiry & Login**: Handled by admin middleware checking valid login session cookies.
- [x] **No PHI in URLs**: URLs contain no patient names, emails, or symptoms. All tracking uses UUID references.
- [x] **Unauthorized API Gatekeeping**: Protected API endpoints return `401 Unauthorized` / `403 Forbidden` if session check fails.

---

## ⚠️ 3. Known Limitations

1. **Ollama Offline Mode**: Requires the local model (e.g. `llama3` or `qwen`) to be pre-downloaded and running locally; otherwise, queries fall back dynamically to cloud APIs.
2. **Drive File Sizes**: Large attachments (> 20MB) may hit network timeout constraints depending on serverless runtime limitations.

---

## 🧪 4. Manual QA Checklist

- [ ] **Admin/Doctor Login**: Enter invalid credentials, confirm rejection. Enter valid credentials, confirm redirect to dashboard.
- [ ] **Registration**: Add a new patient and verify that they instantly sync to the dashboard list.
- [ ] **Longitudinal Timeline**: Click a patient profile, verify history load time.
- [ ] **Contraindication Alerts**: Add `Silicea` to a patient with a `pacemaker` listed in complaints, check if warning appears. Add `Sepia` when `Sulphur` is in history, check for antagonistic warning.
- [ ] **AI RAG Queries**: Ask classical questions (e.g., "What is the highest ideal of cure?") and confirm citation is shown.
- [ ] **Invoice Preview & Print**: Generate an invoice, preview print layout, and print to PDF.
- [ ] **Session Log Out**: Click logout, attempt to navigate back to `/admin/dashboard`, confirm redirect to login.

---

## 🛠️ 5. Deployment & Rollback Plan

### Required Environment Variables
- `GEMINI_API_KEY`: Cloud AI query key.
- `FIREBASE_SERVICE_ACCOUNT_KEY`: Admin connection credential JSON.
- `GOOGLE_DRIVE_FOLDER_ID`: Synced destination folder key.
- `GOOGLE_SERVICE_ACCOUNT_KEY`: Service credentials for Drive auth.

### Deployment Steps
1. Run local lint checks:
   ```bash
   npm run lint
   ```
2. Execute regression test suite:
   ```bash
   npm run test
   ```
3. Run optimized production build locally:
   ```bash
   npm run build
   ```
4. Push code to production repository branch and deploy.

### Rollback Plan
1. **Immediate Vercel Rollback**: Revert deployment instantly in the Vercel dashboard to the previous stable release.
2. **Git Revert**:
   ```bash
   git revert HEAD
   git push origin main
   ```
