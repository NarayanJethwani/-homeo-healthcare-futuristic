# UAT-002: Billing & Tax Verification — Simplified Soft Launch Manual Payment Workflow

- **Release Target**: Platform Release v1.0 Soft Launch
- **Feature Flag State**: `PAYMENT_GATEWAY_ENABLED=false`, `MANUAL_PAYMENT_WORKFLOW_ENABLED=true`
- **Execution Mode**: Controlled Soft-Launch Verification

## Test Objectives
1. Verify itemized pricing display: Clinical Care, Included Homeopathic Medicines ($0.00), Additional Prescribed Products (only when applicable), Courier (only when applicable), Care Support (only when approved), Total Payable.
2. Verify absence of online payment gateway fees, checkout redirects, or payment processor language.
3. Verify inclusion of soft-launch notice: *"Payment arrangements will be coordinated by our care team after you accept your Clinical Care Recommendation."*
4. Verify manual payment recording using integer paise by authorized Finance staff.
