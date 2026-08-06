# HH-OPS-001 Standard Operating Procedure: Manual Payment Coordination & Governed Care Activation (v1.0 Soft Launch)

## 1. Executive Summary & Policy Scope
This Standard Operating Procedure (SOP) governs the manual payment recording, evidence validation, fee coordination, and clinical care activation workflow during the controlled **Platform Release v1.0 Soft Launch**.

Online payment gateways (Razorpay) are **deferred to Platform Release v1.1** (`PAYMENT_GATEWAY_ENABLED=false`) and do not block the v1.0 soft launch.

---

## 2. Feature Flags & Configuration Baseline
- `PAYMENT_GATEWAY_ENABLED=false` (Checkout redirects, online payment links, and webhook activations disabled)
- `MANUAL_PAYMENT_WORKFLOW_ENABLED=true` (Finance/Admin manual payment recording enabled)
- `AUTO_ACTIVATE_AFTER_GATEWAY_PAYMENT=false` (Automatic gateway care activation disabled)

---

## 3. Simplified Patient Journey
1. **Patient Assessment**: Patient completes clinical questionnaire.
2. **Physician Review**: Attending Homeopathic Physician reviews case and prescribes care level.
3. **Clinical Care Recommendation**: Itemized breakdown presented to patient.
4. **Patient Acceptance**: Patient accepts recommendation.
   - *Displayed Message*: **"Your Clinical Care Recommendation has been accepted. Our care coordination team will contact you with payment and commencement details."**
   - *No payment gateway buttons or checkout redirects are rendered.*
5. **Clinical Care Agreement**: Patient signs agreement.
6. **Manual Payment Coordination**: Finance/Care Coordination team shares bank details / UPI QR with patient.
7. **Payment Recording**: Authorized Finance/Admin user records transaction in Admin Portal.
8. **Authorized Care Activation**: Physician or Admin confirms care readiness and activates order.
9. **Pharmacy Fulfilment**: Medicine dispatch queued.
10. **Follow-up Care**: Scheduled consultations commence.

---

## 4. Manual Payment Recording Rules (Finance / Admin)
- **Authorized Roles**: `admin`, `finance`, `care_coordinator`. Patient-side payment writes are strictly prohibited.
- **Allowed Payment Methods**: `upi`, `bank_transfer`, `cash`, `card_terminal`, `other`.
- **Currency Format**: Integer paise ONLY (e.g. ₹4,500.00 stored as `450000` paise).
- **Partial Payment Policy**: Platform v1.0 requires exact full invoice payment. Partial payments or overpayments are prohibited without an approved fee concession.
- **Cash & Unreferenced Payments**: If reference number is omitted for cash/manual payments, system generates a deterministic, traceable receipt reference (`CASH-REC-YYYYMMDD-XXXX`).
- **Duplicate Prevention**: Reference numbers/UTRs are checked for global uniqueness. Duplicate submissions return `409 Conflict`.
- **Audit Logging**: Every creation generates an immutable audit event (`PAYMENT_RECORDED`) containing the authenticated actor ID and role.
- **Reversals / Corrections**: Corrections must be executed as non-destructive reversals (`PAYMENT_REVERSED`), preserving the original transaction history.

---

## 5. Governed Care Activation Rule
Care activation requires ALL 4 conditions to be met:
1. `agreementAccepted === true`
2. `billingDocumentExists === true`
3. `paymentStatus` is one of: `received`, `waived`, `approved_credit`, `care_support_approved`.
4. Authorized staff (`physician`, `admin`, `finance`, `care_coordinator`) confirms activation.

Care activation **never depends on an external payment gateway webhook** during v1.0 soft launch.

---

## 6. Governed Soft-Launch Rollback Procedure
If a critical operational issue occurs during soft-launch:
1. **Disable Entry**: Disable manual-payment entry or place site in controlled maintenance mode (`MANUAL_PAYMENT_WORKFLOW_ENABLED=false`).
2. **Artifact Revert**: Revert deployment cluster to the previous approved deployment artifact (`<30s` target).
3. **Configuration Restore**: Restore configuration from the previous release.
4. **Smoke & Database Check**: Verify database schema compatibility and run smoke verification tests.
5. **Data Preservation**: Preserve all payment records, invoices, signed agreements, and audit logs created during soft launch without data loss.
*(Note: Enabling an unvalidated payment gateway is strictly prohibited as a rollback mechanism).*
