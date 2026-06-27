# Homeo Healthcare Portal & AI Repertory Hub

This repository hosts the Next.js portal and AI Diagnostics engine for the Homeo Healthcare case management system. The system automates Google Workspace provisioning (folders, clinical sheets, calendar events) and integrates with Gemini 2.5/3.5 models for clinical decision support.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18+` or `v20+` (recommended)
- **NPM**: `v9+` or `v10+`

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and populate it with your specific Google API credentials, Firebase Client configuration, and Gemini API keys.

---

## ⚙️ Environment Configuration

Refer to [GOOGLE_ENV_CONFIG.md](GOOGLE_ENV_CONFIG.md) for full coordinate explanations. The core environment configuration keys include:

### Google Service Account
To support Drive, Sheets, and Calendar automation, get a JSON Key from your Google Cloud Service Account and assign it to the environment:
```env
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'
```

### Google Drive & Calendar IDs
- `GOOGLE_DRIVE_PARENT_FOLDER_ID`: The parent folder ID in Google Drive where individual patient folders will be generated.
- `GOOGLE_TEMPLATE_SHEET_ID`: The master spreadsheet template copied for each new patient.
- `GOOGLE_CALENDAR_ID`: The Google Calendar ID where consultations are registered (defaults to `"primary"`).

### Client-Side (Next.js) Variables
Make sure to prefix public displays and redirect configurations with `NEXT_PUBLIC_`:
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: The formatted WhatsApp link number (e.g., `918446056789`).
- `NEXT_PUBLIC_WHATSAPP_DISPLAY`: The human-friendly display text for WhatsApp (e.g., `+91 84460 56789`).
- `NEXT_PUBLIC_PAYMENT_UPI`: The payment UPI handle (e.g., `8446056789@hdfc`).
- `NEXT_PUBLIC_PAYMENT_PHONE`: The GPay telephone number.

---

## 💻 Running Locally

Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Mock/Bypass Mode
If no live Google Credentials or Firebase configuration is provided:
- The system automatically redirects patient sheets to a client-side **Interactive Sandbox** (`/admin/mock-sheet?mockId=P-XXXXXX`).
- Demographics and case intakes will cache in-memory during local runs and sync gracefully.
- You can bypass live Firebase Auth on the Login page (`/admin/login`) by clicking the mock access buttons at the bottom of the card.

---

## 📜 Multi-Tenant Security & Firebase Setup

Cloud Firestore security rules are defined in [firestore.rules](firestore.rules) and manage multi-tenant access:
- **Admin**: Has master permissions to query all patient files.
- **Junior Doctors**: Filtered listings where `assignedDoctor === uid`.

Apply rules to your project:
```bash
npx -y firebase-tools deploy --only firestore:rules
```

---

## ☁️ Deployment on Vercel

When deploying to Vercel, the multiline `GOOGLE_SERVICE_ACCOUNT_KEY` JSON string can occasionally be truncated or stored incorrectly when using the standard Vercel environment UI. 

### Deploying securely using helper scripts:
1. Ensure your `.env.local` contains all correct production parameters.
2. Run the environment synchronization script (uses the Vercel REST API):
   ```bash
   node scratch/set-vercel-env.js
   ```
3. Deploy to production:
   ```bash
   npx -y vercel --prod
   ```
