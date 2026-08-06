# UAT-004: Payment & Care Activation Verification — Manual Coordination Workflow

- **Release Target**: Platform Release v1.0 Soft Launch
- **Feature Flag State**: `PAYMENT_GATEWAY_ENABLED=false`, `MANUAL_PAYMENT_WORKFLOW_ENABLED=true`
- **Execution Mode**: Controlled Soft-Launch Verification

## Test Scenarios & Results
1. **Gateway-Disabled Mode**: Patient acceptance displays confirmation message without checkout redirect. `PAYMENT_GATEWAY_ENABLED=false` hides all Razorpay buttons.
2. **Queue State Transition**: Recommendation acceptance enters `Accepted — Payment Coordination Pending`.
3. **Manual Payment Recording**: Authorized Finance staff records payment (`invoiceId`, `patientId`, `amountPaise`, `paymentMethod`, `referenceNumber`, `receivedAt`, `recordedBy`, `evidenceReference`, `auditEventId`). Rejects patient-side attempts and non-integer paise values.
4. **Care Activation Enforcement**: Care activation succeeds only when Clinical Care Agreement is accepted, billing document exists, payment status is authorized (`received`, `waived`, `approved_credit`, `care_support_approved`), and authorized staff approves activation.
5. **Reversal Audit Trail**: Non-destructive payment reversal generates `PAYMENT_REVERSED` audit event without altering historical data.
