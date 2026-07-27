import { evaluateKEP1ContributorIntake } from "./kep1ContributorIntake";
import type {
  KEP1ContributorIntakeManifest,
  KEP1ContributorRecord,
  KEP1EditorialRole,
  KEP1ExpertiseDomain,
  KEP1ProgramOwnerRecord,
} from "./types";

type KEP1OnboardingRole = KEP1EditorialRole | "program-owner";

interface KEP1OnboardingSeatDefinition {
  seatId: string;
  role: KEP1OnboardingRole;
  expertiseDomain: KEP1ExpertiseDomain | null;
  entityIds: string[];
}

export interface KEP1OnboardingSeatStatus
  extends KEP1OnboardingSeatDefinition {
  requiredPeople: 1;
  eligibleCandidateCount: number;
  status: "unfilled" | "covered";
}

export interface KEP1OnboardingOperationsReport {
  schemaVersion: "1.0.0";
  programId: "KEP-1";
  asOfDate: string;
  status: "roster-incomplete" | "roster-covered";
  seats: KEP1OnboardingSeatStatus[];
  summary: {
    requiredOperatingSeats: 11;
    coveredOperatingSeats: number;
    unfilledOperatingSeats: number;
    requiredEditorialAssignmentSlots: 32;
    qualifiedAssignmentSlotsCovered: number;
    privateContributorRecordsAssessed: number;
    privateProgramOwnerRecordsAssessed: number;
    intakeGateReady: boolean;
  };
  requiredEvidence: string[];
  nextHumanActions: string[];
  privacy: {
    publicArtifactContainsPersonalData: false;
    namesExcluded: true;
    identityValuesExcluded: true;
    credentialEvidenceLocationsExcluded: true;
    privateGovernanceRegistryRequired: true;
  };
  invariants: {
    automaticInvitationForbidden: true;
    automaticIdentityVerificationForbidden: true;
    automaticCredentialApprovalForbidden: true;
    automaticAssignmentApprovalForbidden: true;
    onePersonPerOperatingSeatRequired: true;
    onboardingReportGrantsDraftingAuthority: false;
    publicationAuthorityGranted: false;
    productionRagAuthorityGranted: false;
  };
}

const SEATS: KEP1OnboardingSeatDefinition[] = [
  {
    seatId: "AUTHOR-GASTROENTEROLOGY",
    role: "clinical-author",
    expertiseDomain: "gastroenterology",
    entityIds: ["D0001", "S0001"],
  },
  {
    seatId: "AUTHOR-DERMATOLOGY",
    role: "clinical-author",
    expertiseDomain: "dermatology",
    entityIds: ["D0002", "S0002"],
  },
  {
    seatId: "AUTHOR-LABORATORY-MEDICINE",
    role: "clinical-author",
    expertiseDomain: "laboratory-medicine",
    entityIds: ["L0001", "L0002"],
  },
  {
    seatId: "AUTHOR-HOMEOPATHY-SUBJECT-MATTER",
    role: "clinical-author",
    expertiseDomain: "homeopathy-subject-matter",
    entityIds: ["R0001", "R0002"],
  },
  {
    seatId: "REVIEWER-GASTROENTEROLOGY",
    role: "independent-clinical-reviewer",
    expertiseDomain: "gastroenterology",
    entityIds: ["D0001", "S0001"],
  },
  {
    seatId: "REVIEWER-DERMATOLOGY",
    role: "independent-clinical-reviewer",
    expertiseDomain: "dermatology",
    entityIds: ["D0002", "S0002"],
  },
  {
    seatId: "REVIEWER-LABORATORY-MEDICINE",
    role: "independent-clinical-reviewer",
    expertiseDomain: "laboratory-medicine",
    entityIds: ["L0001", "L0002"],
  },
  {
    seatId: "REVIEWER-HOMEOPATHY-SUBJECT-MATTER",
    role: "independent-clinical-reviewer",
    expertiseDomain: "homeopathy-subject-matter",
    entityIds: ["R0001", "R0002"],
  },
  {
    seatId: "REVIEWER-EVIDENCE-METHODOLOGY",
    role: "evidence-reviewer",
    expertiseDomain: "evidence-methodology",
    entityIds: [
      "D0001",
      "D0002",
      "S0001",
      "S0002",
      "R0001",
      "R0002",
      "L0001",
      "L0002",
    ],
  },
  {
    seatId: "REVIEWER-SOURCE-RIGHTS",
    role: "rights-reviewer",
    expertiseDomain: "source-rights",
    entityIds: [
      "D0001",
      "D0002",
      "S0001",
      "S0002",
      "R0001",
      "R0002",
      "L0001",
      "L0002",
    ],
  },
  {
    seatId: "PROGRAM-OWNER",
    role: "program-owner",
    expertiseDomain: null,
    entityIds: [],
  },
];

function isGovernedDate(value: string | null, asOfDate: string): boolean {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value) && value <= asOfDate);
}

function isQualifiedContributor(
  contributor: KEP1ContributorRecord,
  seat: KEP1OnboardingSeatDefinition,
  asOfDate: string
): boolean {
  if (seat.role === "program-owner" || !seat.expertiseDomain) {
    return false;
  }

  const hasCurrentCredential = contributor.credentials.some(
    (credential) =>
      credential.verificationStatus === "verified" &&
      Boolean(credential.credentialId) &&
      Boolean(credential.title) &&
      Boolean(credential.issuer) &&
      Boolean(credential.evidenceLocation) &&
      isGovernedDate(credential.verifiedAt, asOfDate) &&
      (!credential.expiresAt || credential.expiresAt >= asOfDate)
  );

  return (
    contributor.status === "eligible" &&
    Boolean(contributor.fullName.trim()) &&
    Boolean(contributor.contributorId) &&
    contributor.identity.verificationStatus === "verified" &&
    Boolean(contributor.identity.value) &&
    Boolean(contributor.identity.verifiedBy) &&
    isGovernedDate(contributor.identity.verifiedAt, asOfDate) &&
    contributor.eligibleRoles.includes(seat.role) &&
    contributor.expertiseDomains.includes(seat.expertiseDomain) &&
    hasCurrentCredential &&
    contributor.attestations.conflictOfInterestDeclared &&
    contributor.attestations.editorialIndependenceAccepted &&
    contributor.attestations.aiAssistanceDisclosureAccepted &&
    contributor.attestations.sourceUsePolicyAccepted
  );
}

function isVerifiedProgramOwner(
  owner: KEP1ProgramOwnerRecord,
  asOfDate: string,
  identityKeyCounts: Map<string, number>
): boolean {
  const identityKey = `${owner.identity.scheme}:${owner.identity.value}`;
  return (
    owner.status === "active" &&
    Boolean(owner.approverId) &&
    Boolean(owner.fullName.trim()) &&
    owner.identity.verificationStatus === "verified" &&
    Boolean(owner.identity.value) &&
    Boolean(owner.identity.verifiedBy) &&
    isGovernedDate(owner.identity.verifiedAt, asOfDate) &&
    identityKeyCounts.get(identityKey) === 1
  );
}

function matchDistinctContributors(
  seatCandidates: Map<string, string[]>
): Set<string> {
  const contributorToSeat = new Map<string, string>();

  function assign(
    seatId: string,
    visitedContributors: Set<string>
  ): boolean {
    for (const contributorId of seatCandidates.get(seatId) ?? []) {
      if (visitedContributors.has(contributorId)) {
        continue;
      }
      visitedContributors.add(contributorId);
      const currentSeat = contributorToSeat.get(contributorId);
      if (!currentSeat || assign(currentSeat, visitedContributors)) {
        contributorToSeat.set(contributorId, seatId);
        return true;
      }
    }
    return false;
  }

  const coveredSeats = new Set<string>();
  for (const seat of SEATS.filter((candidate) => candidate.role !== "program-owner")) {
    if (assign(seat.seatId, new Set())) {
      coveredSeats.add(seat.seatId);
    }
  }
  return coveredSeats;
}

export function buildKEP1OnboardingOperationsReport(
  intakeManifest: KEP1ContributorIntakeManifest
): KEP1OnboardingOperationsReport {
  const contributors = [...intakeManifest.contributors].sort((left, right) =>
    left.contributorId.localeCompare(right.contributorId)
  );
  const identityKeyCounts = new Map<string, number>();
  for (const identity of [
    ...contributors.map((contributor) => contributor.identity),
    ...intakeManifest.programOwners.map((owner) => owner.identity),
  ]) {
    const key = `${identity.scheme}:${identity.value}`;
    identityKeyCounts.set(key, (identityKeyCounts.get(key) ?? 0) + 1);
  }

  const editorialSeats = SEATS.filter((seat) => seat.role !== "program-owner");
  const seatCandidates = new Map(
    editorialSeats.map((seat) => [
      seat.seatId,
      contributors
        .filter((contributor) =>
          isQualifiedContributor(contributor, seat, intakeManifest.asOfDate)
        )
        .map((contributor) => contributor.contributorId),
    ])
  );
  const coveredEditorialSeats = matchDistinctContributors(seatCandidates);
  const eligibleOwnerCount = intakeManifest.programOwners.filter((owner) =>
    isVerifiedProgramOwner(owner, intakeManifest.asOfDate, identityKeyCounts)
  ).length;

  const seats: KEP1OnboardingSeatStatus[] = SEATS.map((seat) => {
    const eligibleCandidateCount =
      seat.role === "program-owner"
        ? eligibleOwnerCount
        : (seatCandidates.get(seat.seatId)?.length ?? 0);
    const covered =
      seat.role === "program-owner"
        ? eligibleOwnerCount > 0
        : coveredEditorialSeats.has(seat.seatId);
    return {
      ...seat,
      requiredPeople: 1,
      eligibleCandidateCount,
      status: covered ? "covered" : "unfilled",
    };
  });

  const coveredOperatingSeats = seats.filter(
    (seat) => seat.status === "covered"
  ).length;
  const qualifiedAssignmentSlotsCovered = seats
    .filter(
      (seat) => seat.status === "covered" && seat.role !== "program-owner"
    )
    .reduce((total, seat) => total + seat.entityIds.length, 0);
  const intakeGateReady = evaluateKEP1ContributorIntake(intakeManifest).ready;

  return {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    asOfDate: intakeManifest.asOfDate,
    status:
      coveredOperatingSeats === SEATS.length
        ? "roster-covered"
        : "roster-incomplete",
    seats,
    summary: {
      requiredOperatingSeats: 11,
      coveredOperatingSeats,
      unfilledOperatingSeats: SEATS.length - coveredOperatingSeats,
      requiredEditorialAssignmentSlots: 32,
      qualifiedAssignmentSlotsCovered,
      privateContributorRecordsAssessed: contributors.length,
      privateProgramOwnerRecordsAssessed: intakeManifest.programOwners.length,
      intakeGateReady,
    },
    requiredEvidence: [
      "verified immutable identity",
      "current role-appropriate credential with private evidence location",
      "documented specialty and role eligibility",
      "conflict-of-interest declaration",
      "editorial-independence attestation",
      "AI-assistance disclosure agreement",
      "source-use policy agreement",
      "verified program-owner approval for every assignment",
    ],
    nextHumanActions: seats
      .filter((seat) => seat.status === "unfilled")
      .map((seat) => `fill-and-verify:${seat.seatId}`),
    privacy: {
      publicArtifactContainsPersonalData: false,
      namesExcluded: true,
      identityValuesExcluded: true,
      credentialEvidenceLocationsExcluded: true,
      privateGovernanceRegistryRequired: true,
    },
    invariants: {
      automaticInvitationForbidden: true,
      automaticIdentityVerificationForbidden: true,
      automaticCredentialApprovalForbidden: true,
      automaticAssignmentApprovalForbidden: true,
      onePersonPerOperatingSeatRequired: true,
      onboardingReportGrantsDraftingAuthority: false,
      publicationAuthorityGranted: false,
      productionRagAuthorityGranted: false,
    },
  };
}
