/**
 * Homeo Healthcare Platform Feature Flags
 * Governs controlled soft-launch and payment gateway decoupling.
 */

export interface PlatformFeatureFlags {
  PAYMENT_GATEWAY_ENABLED: boolean;
  MANUAL_PAYMENT_WORKFLOW_ENABLED: boolean;
  AUTO_ACTIVATE_AFTER_GATEWAY_PAYMENT: boolean;
  STORE_CLINICAL_CARE_V1_ENABLED: boolean;
}

export const FEATURE_FLAGS: PlatformFeatureFlags = {
  PAYMENT_GATEWAY_ENABLED: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_ENABLED === "true" ? true : false,
  MANUAL_PAYMENT_WORKFLOW_ENABLED: process.env.NEXT_PUBLIC_MANUAL_PAYMENT_WORKFLOW_ENABLED === "false" ? false : true,
  AUTO_ACTIVATE_AFTER_GATEWAY_PAYMENT: process.env.NEXT_PUBLIC_AUTO_ACTIVATE_AFTER_GATEWAY_PAYMENT === "true" ? true : false,
  STORE_CLINICAL_CARE_V1_ENABLED: process.env.NEXT_PUBLIC_STORE_CLINICAL_CARE_V1_ENABLED === "false" ? false : true,
};

export function isPaymentGatewayEnabled(): boolean {
  return FEATURE_FLAGS.PAYMENT_GATEWAY_ENABLED;
}

export function isManualPaymentWorkflowEnabled(): boolean {
  return FEATURE_FLAGS.MANUAL_PAYMENT_WORKFLOW_ENABLED;
}

export function isAutoActivateAfterGatewayPaymentEnabled(): boolean {
  return FEATURE_FLAGS.AUTO_ACTIVATE_AFTER_GATEWAY_PAYMENT;
}

export function isStoreClinicalCareV1Enabled(): boolean {
  return FEATURE_FLAGS.STORE_CLINICAL_CARE_V1_ENABLED;
}
