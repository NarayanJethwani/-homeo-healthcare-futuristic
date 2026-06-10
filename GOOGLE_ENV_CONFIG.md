# Google Workspace Integration — Environment Configuration

> [!IMPORTANT]
> These environment variables MUST be set on Vercel for real Google Sheet creation to work.
> If any are missing/empty, the system falls back to mock sheets.

## Required Environment Variables

| Variable | Purpose | Same across projects? |
|---|---|---|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Firebase service account JSON for Google Drive/Sheets API | ✅ Yes — same key |
| `GOOGLE_DRIVE_PARENT_FOLDER_ID` | Parent folder in Drive where patient folders are created | ❌ No — different per project |
| `GOOGLE_TEMPLATE_SHEET_ID` | Template Google Sheet to copy for each new patient | ✅ Yes — same template |

## Per-Project Values

### Portal (`homeo-healthcare-portal`)
- **URL**: https://portal.homeo.healthcare
- `GOOGLE_DRIVE_PARENT_FOLDER_ID` = `1kBy92DqeIvsxDWT9fUNEUmXGAvUjos6P`
- `GOOGLE_TEMPLATE_SHEET_ID` = `1Eeg7swcMdgVMi6fxcldHTxFtXthynM1f6X4Amf5Zi5I`

### Futuristic (`homeo-healthcare-futuristic`)
- **URL**: https://homeo.healthcare
- `GOOGLE_DRIVE_PARENT_FOLDER_ID` = `1u1wMtnwSt3HhPxg_YXOk1G8tL6KTafcL`
- `GOOGLE_TEMPLATE_SHEET_ID` = `1Eeg7swcMdgVMi6fxcldHTxFtXthynM1f6X4Amf5Zi5I`

## Backup Files

| File | Description |
|---|---|
| `.env.local` | Active local env (currently portal config) |
| `.env.temp.portal` | Saved portal env backup |
| `.env.temp.futuristic` | Saved futuristic env backup |

## Deployment Scripts

| Script | Purpose |
|---|---|
| `scratch/set-vercel-env.js` | Syncs Google env vars from `.env.local` → current Vercel project |
| `scratch/set-vercel-env-futuristic.js` | Syncs Google env vars → futuristic Vercel project |
| `scratch/deploy-portal.sh` | Full safe deploy: verify → sync envs → deploy portal |

## How to Re-Sync After Any Issue

```bash
# For Portal:
node scratch/set-vercel-env.js

# For Futuristic:
node scratch/set-vercel-env-futuristic.js

# Then redeploy:
npx -y vercel --prod
```

> [!CAUTION]
> The `vercel env add` CLI command silently stores empty values for JSON keys.
> Always use `scratch/set-vercel-env.js` (Vercel REST API) to set these vars.
