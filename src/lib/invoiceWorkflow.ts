export interface InvoiceWorkflowInput {
  invoiceSource?: string;
  manualOverrideReason?: string;
  quotationId?: string;
  physicianConfirmed?: boolean;
  confirmedAt?: string;
  pricingRuleVersion?: string;
  approvalStatus?: string;
  discount?: number;
  concessionReason?: string;
}

export function validateInvoiceWorkflow(input: InvoiceWorkflowInput): string | null {
  const source = input.invoiceSource === "confirmed-quotation" ? "confirmed-quotation" : "manual-administrative";
  if (source === "confirmed-quotation") {
    if (!input.quotationId || input.physicianConfirmed !== true || !input.confirmedAt || !input.pricingRuleVersion || input.approvalStatus !== "approved") {
      return "A plan-derived invoice requires an approved, physician-confirmed quotation.";
    }
  } else if ((input.manualOverrideReason || "").trim().length < 8) {
    return "Document the administrative reason for this manual invoice.";
  }
  if (Number(input.discount || 0) > 0 && (input.concessionReason || "").trim().length < 5) {
    return "Document the reason for the invoice concession.";
  }
  return null;
}
