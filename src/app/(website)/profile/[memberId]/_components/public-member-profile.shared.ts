import type { PublicMemberProfileResponse } from "./public-member-profile.types";

export type PublicMember = PublicMemberProfileResponse["data"];

export const requirementLabels: Record<string, string> = {
  PHOTO_2X2: "2x2 Photo",
  HS_BACCALAUREATE_DIPLOMA: "High School / Baccalaureate Diploma",
  TWO_THREE_YEAR_PROGRAM_DIPLOMA: "Two- to Three-Year Program Diploma",
  MASTERS_DEGREE_DIPLOMA: "Master's Degree Diploma",
  DOCTORAL_DEGREE_DIPLOMA: "Doctoral Degree Diploma",
  ORDINATION_CERTIFICATE: "Ordination Certificate",
  PASTORS_RECOMMENDATION_LETTER: "Pastor's Recommendation Letter",
  LETTER_OF_INTENT: "Letter of Intent",
  ENDORSEMENT_LETTERS: "Endorsement Letters",
  MARRIAGE_CONTRACT: "Marriage Contract",
  CLEARANCE_BARANGAY: "Barangay Clearance",
  CLEARANCE_POLICE: "Police Clearance",
  CLEARANCE_NBI: "NBI Clearance",
};

export function formatEnumLabel(value: string | null | undefined) {
  if (!value) return "Not provided";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function buildFullName(member: PublicMember) {
  return [
    member.firstName,
    member.middleInitial
      ? member.middleInitial.endsWith(".")
        ? member.middleInitial
        : `${member.middleInitial}.`
      : null,
    member.lastName,
    member.extensionName,
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildLocation(member: PublicMember) {
  return [member.municipalityCity, member.province, member.region]
    .filter(Boolean)
    .join(", ");
}

export function buildOverviewSummary(
  member: PublicMember,
  fullName: string,
  location: string,
) {
  const lines: string[] = [];

  lines.push(
    `${fullName} is recorded in the Pearl of the Orient public verification system as a ${formatEnumLabel(member.memberType)}.`,
  );

  if (member.churchAffiliation) {
    lines.push(`The member is affiliated with ${member.churchAffiliation}.`);
  }

  if (member.currentPositionRoleOther ?? member.currentPositionRole) {
    lines.push(
      `Current public-facing role: ${member.currentPositionRoleOther ?? member.currentPositionRole}.`,
    );
  }

  if (member.churchAddress) {
    lines.push(`Church or organization address: ${member.churchAddress}.`);
  }

  if (location) {
    lines.push(`Primary service location is listed as ${location}.`);
  }

  if (member.preferredBranches.length > 0) {
    lines.push(
      `Preferred service branches include ${member.preferredBranches
        .map((branch) => branch.title)
        .join(", ")}.`,
    );
  }

  if (member.officerAssignments.length > 0) {
    lines.push(
      `The member currently holds ${member.officerAssignments.length} active office assignment${member.officerAssignments.length > 1 ? "s" : ""}.`,
    );
  }

  if (member.chaplaincyTrainingProgress?.completedAt) {
    lines.push(
      `Chaplaincy training completion is recorded on ${formatDate(member.chaplaincyTrainingProgress.completedAt)}.`,
    );
  }

  return lines;
}

export function buildRecentActivities(
  member: PublicMember,
  certificateUrl: string | null,
) {
  const activities = [
    {
      title: "Membership profile created",
      description: `This public member profile was officially recorded on ${formatDate(member.createdAt)} as part of the verification system.`,
      date: member.createdAt,
    },
    member.updatedAt
      ? {
          title: "Profile information refreshed",
          description: `Member details and public-facing information were refreshed on ${formatDate(member.updatedAt)} to keep the record current.`,
          date: member.updatedAt,
        }
      : null,
    member.onboardingProgress
      ? {
          title: "Membership onboarding progressed",
          description: `The current membership onboarding stage is ${formatEnumLabel(member.onboardingProgress.currentStep)}.`,
          date: member.updatedAt,
        }
      : null,
    member.chaplaincyTrainingProgress?.completedAt
      ? {
          title: "Chaplaincy training completed",
          description: `Official training completion for this member was recorded on ${formatDate(member.chaplaincyTrainingProgress.completedAt)}.`,
          date: member.chaplaincyTrainingProgress.completedAt,
        }
      : null,
    certificateUrl
      ? {
          title: "Certificate issued",
          description: `An official certificate for this member became publicly available on ${formatDate(member.idGenerationAsset?.generatedAt)}.`,
          date: member.idGenerationAsset?.generatedAt ?? member.updatedAt,
        }
      : null,
  ].filter(
    (item): item is { title: string; description: string; date: string } =>
      item !== null && Boolean(item.date),
  );

  return activities.slice(0, 5);
}

export function profileFallbackImage(member: PublicMember) {
  return (
    member.applicantRequirements.find((item) => item.type === "PHOTO_2X2")
      ?.fileUrl ?? "/main/logo.png"
  );
}

export function buildDetailedAboutEssay(
  member: PublicMember,
  fullName: string,
  location: string,
) {
  const branchList =
    member.preferredBranches.length > 0
      ? member.preferredBranches.map((branch) => branch.title).join(", ")
      : "multiple service areas";
  const officeSummary =
    member.officerAssignments.length > 0
      ? `The profile currently reflects ${member.officerAssignments.length} active office assignment${member.officerAssignments.length > 1 ? "s" : ""}, which indicates an ongoing level of responsibility in formal ministry or organizational service.`
      : "At this time, there are no active office assignments publicly listed on the profile, which may simply reflect the current scope of service being recorded for public view.";
  const educationSummary =
    member.tertiaryCollege || member.postGraduateStudies
      ? `Academic formation also contributes to the public identity of this member. ${
          member.tertiaryCollege
            ? `${fullName} has tertiary or college information recorded as ${member.tertiaryCollege}. `
            : ""
        }${
          member.postGraduateStudies
            ? `Additional post-graduate study information is recorded as ${member.postGraduateStudies}.`
            : ""
        }`
      : "While detailed academic records are not fully exposed on the public page, the structure of this profile still supports legitimacy through verified system status, service information, and approved supporting records.";

  return [
    `${fullName} appears in the Pearl of the Orient public verification system as a ${formatEnumLabel(member.memberType)}. This public profile is meant to function as a trust layer for communities, partner organizations, and individuals who need to confirm whether a member is visibly recognized within the system. Rather than presenting private application details, the page focuses on public-facing proof points such as membership standing, training milestones, certificates, office assignments, and approved documentary records.`,
    member.churchAffiliation
      ? `${fullName} is publicly associated with ${member.churchAffiliation}, and the profile also records a current role in service as ${member.currentPositionRoleOther ?? member.currentPositionRole ?? "not publicly specified"}. ${member.churchAddress ? `The listed church or organization address is ${member.churchAddress}. ` : ""}The listed service branches, including ${branchList}, provide another layer of context by showing the areas in which the member is active or aligned.`
      : `${fullName} has a public role in service recorded as ${member.currentPositionRoleOther ?? member.currentPositionRole ?? "not publicly specified"}, and the visible service branches include ${branchList}. Even without a publicly listed church affiliation, the profile still shows a coherent service identity through role, branch alignment, and current standing in the system.`,
    location
      ? `Geographically, the profile places the member in ${location}. This matters because public trust often depends on recognizability within real communities and real jurisdictions. ${officeSummary}`
      : `The profile does not currently expose a full public location label, but it still carries contextual value through status, branch alignment, and office information. ${officeSummary}`,
    educationSummary,
    member.chaplaincyTrainingProgress?.completedAt || member.onboardingProgress
      ? `Another important part of the public story is progression. ${
          member.chaplaincyTrainingProgress?.completedAt
            ? `The profile records chaplaincy training completion on ${formatDate(member.chaplaincyTrainingProgress.completedAt)}. `
            : ""
        }${
          member.onboardingProgress
            ? `The current onboarding record shows the member at ${formatEnumLabel(member.onboardingProgress.currentStep)}. `
            : ""
        }These progress markers show that the member profile reflects movement, documentation, and a structured path rather than a simple name entry.`
      : "Even when not every milestone is publicly displayed, the profile still communicates structure and accountability through its documented status, affiliation, and supporting records.",
  ].join("\n\n");
}

export function buildMapEmbedUrl(member: PublicMember) {
  const query = [
    member.barangay,
    member.municipalityCity,
    member.province,
    member.region,
    "Philippines",
  ]
    .filter(Boolean)
    .join(", ");

  return `https://www.google.com/maps?q=${encodeURIComponent(
    query || "Philippines",
  )}&output=embed`;
}

export function buildChurchMapEmbedUrl(member: PublicMember) {
  const query = [
    member.churchAddress,
    member.churchAffiliation,
    member.municipalityCity,
    member.province,
    member.region,
    "Philippines",
  ]
    .filter(Boolean)
    .join(", ");

  return `https://www.google.com/maps?q=${encodeURIComponent(
    query || "Philippines",
  )}&output=embed`;
}

export function getDocumentPreviewUrl(url: string, mimeType?: string | null) {
  if (mimeType?.includes("pdf") || url.toLowerCase().includes(".pdf")) {
    return `${url}#toolbar=0&navpanes=0&scrollbar=0`;
  }

  return url;
}
