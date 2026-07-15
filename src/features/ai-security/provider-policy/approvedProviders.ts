export interface ApprovedProviderConfig {
  providerId: string;
  modelName: string;
  region: string;
  dataRetention: "zero-retention" | "standard";
  phiApproved: boolean;
  approvalOwner: string;
  approvalDate: string;
  contractReferenceId: string; // Reference to BAA / legal governance evidence
  status: "active" | "inactive";
}

// Governance: Registry starts completely empty/inactive. 
// No provider model can be treated as PHI-approved until contractual evidence exists.
export const APPROVED_PROVIDERS: ApprovedProviderConfig[] = [];
