import {
  RepertorySource,
  RepertoryEdition,
  RepertoryAccessContext,
  AccessDecision
} from "../types/repertoryTypes";

export interface IRepertoryAccessPolicy {
  canListSource(
    context: RepertoryAccessContext,
    source: RepertorySource
  ): AccessDecision;

  canListEdition(
    context: RepertoryAccessContext,
    edition: RepertoryEdition
  ): AccessDecision;

  canReadMetadata(
    context: RepertoryAccessContext,
    edition: RepertoryEdition
  ): AccessDecision;

  canReadContent(
    context: RepertoryAccessContext,
    edition: RepertoryEdition
  ): AccessDecision;
}

export class RepertoryAccessPolicy implements IRepertoryAccessPolicy {
  canListSource(
    context: RepertoryAccessContext,
    source: RepertorySource
  ): AccessDecision {
    // If the source is disabled, we do not show it
    if (source.sourceType === "clinical_experience" && context.userRole !== "super-admin" && context.userRole !== "admin") {
      return { allowed: false, reason: "internal_only" };
    }
    return { allowed: true };
  }

  canListEdition(
    context: RepertoryAccessContext,
    edition: RepertoryEdition
  ): AccessDecision {
    if (edition.rightsStatus === "disabled") {
      return { allowed: false, reason: "disabled" };
    }

    if (edition.publicationStatus === "blocked") {
      return { allowed: false, reason: "disabled" };
    }

    if (edition.rightsStatus === "internal" && !this.isInternalUser(context.userRole)) {
      return { allowed: false, reason: "internal_only" };
    }

    if (edition.rightsStatus === "experimental") {
      const hasFlag = context.activeFeatureFlags.includes("repertory-experimental") ||
                      context.activeFeatureFlags.includes(`experimental-${edition.id}`);
      if (!hasFlag) {
        return { allowed: false, reason: "feature_disabled" };
      }
    }

    return { allowed: true };
  }

  canReadMetadata(
    context: RepertoryAccessContext,
    edition: RepertoryEdition
  ): AccessDecision {
    const listDecision = this.canListEdition(context, edition);
    if (!listDecision.allowed) {
      return listDecision;
    }

    if (edition.rightsStatus === "restricted" && !this.isInternalUser(context.userRole)) {
      return { allowed: false, reason: "restricted" };
    }

    if (edition.rightsStatus === "licensed") {
      const entitlement = context.organizationEntitlements.find(
        e => e.editionId === edition.id && e.status === "active"
      );
      if (!entitlement && !this.isInternalUser(context.userRole)) {
        return { allowed: false, reason: "not_entitled" };
      }
    }

    return { allowed: true };
  }

  canReadContent(
    context: RepertoryAccessContext,
    edition: RepertoryEdition
  ): AccessDecision {
    if (edition.rightsStatus === "restricted") {
      return { allowed: false, reason: "restricted" };
    }

    const metadataDecision = this.canReadMetadata(context, edition);
    if (!metadataDecision.allowed) {
      return metadataDecision;
    }

    if (edition.publicationStatus === "not_published" && !this.isInternalUser(context.userRole)) {
      return { allowed: false, reason: "edition_inactive" };
    }

    return { allowed: true };
  }

  private isInternalUser(role: string): boolean {
    return role === "super-admin" || role === "admin" || role === "editor";
  }
}
