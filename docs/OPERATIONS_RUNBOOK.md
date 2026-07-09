# Operations Runbook

This runbook outlines operational procedures for deploying, maintaining, and recovering the Unified Clinical OS platform.

---

## 1. Production Deployment & Rollbacks

### Vercel Hosting Pipeline
- Deploys are triggered automatically upon pushing to the `main` branch on GitHub.
- To deploy manually via Vercel CLI (only if GitHub integrations are offline):
  ```bash
  npm i -g vercel
  vercel --prod
  ```

### Rollback Playbook
If a production deployment causes severe regressions:
1. Navigate to the [Vercel Project Dashboard](https://vercel.com/dr-narayan-jethwani-s-projects).
2. Select the last stable deployment before the failure.
3. Click the options menu (...) and select **Redeploy**. Click **Promote to Production**.
4. Alternatively, use Git CLI:
   ```bash
   git checkout <stable-commit-hash>
   npm run build
   # Push branch to force trigger redeployment
   ```

---

## 2. Firebase & Firestore Operations

### Firestore Rules Updates
Security rules must be validated and uploaded whenever `firestore.rules` is updated:
```bash
# Verify rules local compile
npx firebase deploy --only firestore:rules
```

### Syncing Firestore Composite Indexes
If a query fails in Next.js backend with an "Index required" exception:
1. Open the console log URL provided in the error message.
2. Click the auto-generation link to build the index on Firebase Console.
3. Once completed, append the rule details directly to `firestore.indexes.json`.

### Backup Strategy
- **Firestore Exports**: Automated daily exports are configured on Google Cloud Platform (GCP) to back up all collections to `gs://homeo-healthcare-backups/`.
- **Manual Export**:
  ```bash
  gcloud firestore export gs://homeo-healthcare-backups/manual-exports/
  ```

---

## 3. Secrets & API Keys Management

### Rotation Protocol
All keys are managed inside **Vercel Project Environment Variables**. 
Key variables to rotate annually or upon exposure:
- `GEMINI_API_KEY`: Google Generative AI access key.
- `DEEPSEEK_API_KEY`: DeepSeek API endpoint token.
- `REDIS_URL`: URL to Upstash/Redis cache cluster.
- `FIREBASE_PRIVATE_KEY`: Service account key for Firebase Admin operations.

---

## 4. Incident Response & Monitoring

### Standard Outage Procedure
1. Check Vercel status page and GCP service health dashboard.
2. Call `/api/ai-router/health` to check if Gemini or local fallback engines are reporting 503 errors.
3. In case of database lock or write failures, check Firestore quotas and concurrent connection states on Firebase Console.
