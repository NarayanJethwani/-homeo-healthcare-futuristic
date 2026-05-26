# Homeo Healthcare Clinical Portal & AI Repertory Hub
### System Architecture, Automation Engine, and Clinical Guidelines Blueprint

This document serves as the standalone technical specification and user manual for the secure Clinical Hub. It details the Firebase access scopes, Google Workspace automation scripts, Kent's Repertory grid computations, and the Gemini 2.5 AI Diagnostics integration.

---

## 1. System Architecture

```mermaid
graph TD
    Client[Next.js Client Dashboard] -->|Firebase Auth| Auth[Firebase Authentication]
    Client -->|Form Submit| IntakeAPI[/api/intake]
    Client -->|Query Rubrics| AI_API[/api/ai-diagnostics]
    
    IntakeAPI -->|Admin SDK| Firestore[(Cloud Firestore)]
    IntakeAPI -->|Service Account JWT| GDrive[Google Drive API]
    IntakeAPI -->|Service Account JWT| GSheets[Google Sheets API]
    
    GDrive -->|New Folder| ParentFolder["Parent OPD Folder (1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb)"]
    GSheets -->|Copy/Prefill Sheet| PatientSheet["Patient Clinical Sheet (Prefilled template)"]
    GSheets -->|Append Row| MasterRecord["Master central Google Sheet"]
    
    AI_API -->|Structured Payload| Gemini[Gemini 2.5 flash API]
```

---

## 2. Google Workspace Automation Setup

All Google Drive and Sheet automated operations run server-side via `/api/intake` to hide authentication credentials from clients.

### Environment Configuration (.env.local)
The following keys are required in your environment config for full automation:

```env
# Google Cloud Service Account Credentials
GOOGLE_SERVICE_ACCOUNT_KEY='{"type": "service_account", "project_id": "...", "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n", "client_email": "..."}'

# Targeted Google Sheet Templates
GOOGLE_MASTER_SHEET_ID="YOUR_MASTER_ROW_SPREADSHEET_ID"
GOOGLE_TEMPLATE_SHEET_ID="YOUR_TEMPLATE_CLINICAL_RECORD_ID"

# Gemini AI API Coordinates
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### Automation Workflows
1. **Drive Folders**: Creates a folder named `[Patient Name] - ID [Patient ID]` in the parent directory: `1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb`.
2. **Sheet Record**: Copies `GOOGLE_TEMPLATE_SHEET_ID` into the patient's new folder and populates patient demographics (Name, Age, Gender, Complaint, Billing Tier) in the range `Sheet1!A1:B10`.
3. **Master Sync**: Appends a registration row to the Central Master Record Google Sheet, providing clickable URLs to the patient's individual Drive Folder and Clinical Sheet.

---

## 3. Multi-Tenant Role Security (Firebase)

Access control rules are enforced at both the client layout layer and server API/Firestore levels.

### User Roles
* **Admin (Dr. Narayan Jethwani)**: Has master permissions to query all patient records, assign cases to doctors, and view files.
* **Junior Doctors / Interns**: Restricted permissions. The dashboard will filter and only display patient listings and folder links where `assignedDoctor === uid` or patient ID exists in `assignedPatients`.

---

## 4. Kent's Repertory & Computation Grid

The Repertory search engine matches case symptoms against a Kent's Repertory dataset containing 40+ common clinical rubrics across multiple organ systems and specialties.

### Rubrics Divisions
* **Mind (Psychological & Psychiatric / Counseling)**: Anxiety, grief, suppressed anger, claustrophobia, anticipatory anxiety.
* **Pediatrics**: Difficult dentition, night terrors, child growth pains, clinging disposition.
* **Geriatrics**: Memory loss/senility, joint stiffness, sleep fragmentation.
* **Veterinary Homeopathy**: Separation anxiety, dry scaly skin eruptions, thunder/firework fear, rise stiffness.
* **Standard Divisions**: Head & Vertigo, Stomach & Abdomen, Respiratory Care, Skin & Eruptions, Extremities & Joints, Generalities & Modalities.

### Dynamic Scoring Matrix
Selected rubrics are evaluated side-by-side against remedies (e.g. *Nux-v*, *Lyc*, *Ars*, *Sulph*, *Puls*, *Rhus-t*, *Bry*).
1. **Symptom Coverage**: Computes `Matching Rubrics / Total Selected Rubrics`.
2. **Sum of Grades**: Computes `Sum of (Remedy Rubric Grade * Selected Symptom Intensity)`.
3. Remedies are sorted dynamically in the grid, showing the highest matching remedy first. Contraindications are marked as **CI** in red.

---

## 5. Old Sheet CSV Importer

You can upload old patient records (CSV or Excel formats saved as `.csv`) directly from the dashboard.

### CSV Formatting Structure
Save your sheets matching this column schema:

```csv
name,age,gender,email,phone,city,state,complaint,rubrics
"Rajesh Kumar",45,"Male",rajesh@gmail.com,9876543210,"Mumbai","Maharashtra","Severe acid reflux and stomach bloating","GERD (3); bloating (2); warm patient (3)"
```

### Auto-Population Logic
1. **Demographics**: Parses demographics and pre-fills the new case creation form automatically.
2. **Repertorization Grid**: Parses the `rubrics` column and queries matching symptoms from Kent's database. If matched, it automatically adds them to the grid with their corresponding grade intensity weight.

---

## 6. Local Testing Instructions

### Access Coordinates
* **Login URL**: `http://localhost:3000/admin/login`
* **Dashboard URL**: `http://localhost:3000/admin/dashboard`
* **Mock Bypass buttons** are available at the bottom of the login card to log in directly as Dr. Jethwani (Admin) or a Junior Doctor without requiring live Firebase configs.

### Verifying the Importer
1. Go to **Patient Records** tab or **Repertory** tab.
2. Click **"Import Old Sheet"**.
3. Choose a formatted CSV file.
4. Verify that patient demographics pre-fill, and matched rubrics populate in the calculation grid automatically.
