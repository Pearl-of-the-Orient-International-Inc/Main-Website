/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  ExternalLink,
  FileBadge2,
  MapPin,
  QrCode,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicMemberProfileResponse } from "./public-member-profile.types";

type PublicMember = PublicMemberProfileResponse["data"];

const requirementLabels: Record<string, string> = {
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

const stepLabels: Record<string, string> = {
  REQUIREMENTS: "Requirements Review",
  PRE_ORIENTATION: "Pre-Orientation",
  PAYMENT_CHECKOUT: "Payment Checkout",
  ONLINE_INTERVIEW: "Online Interview",
  ID_GENERATION: "ID Generation",
  CHAPLAINCY_101: "Chaplaincy 101",
  OATH_TAKING: "Oath Taking",
};

function formatEnumLabel(value: string | null | undefined) {
  if (!value) return "Not provided";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildFullName(member: PublicMember) {
  return [
    member.firstName,
    member.middleInitial,
    member.lastName,
    member.extensionName,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildLocation(member: PublicMember) {
  return [
    member.barangay,
    member.municipalityCity,
    member.province,
    member.region,
  ]
    .filter(Boolean)
    .join(", ");
}

function buildJurisdiction(
  assignment: PublicMember["officerAssignments"][number],
) {
  return [
    assignment.department,
    assignment.region,
    assignment.province,
    assignment.cityMunicipality,
    assignment.barangay,
  ]
    .filter(Boolean)
    .join(" / ");
}

function getStatusTone(member: PublicMember) {
  if (
    member.status === "APPROVED" &&
    member.user.accountStatus === "ACTIVE" &&
    member.user.isEmailVerified &&
    member.isActive
  ) {
    return {
      badge: "border-emerald-200 bg-emerald-50 text-emerald-900",
      panel: "border-emerald-200 bg-emerald-50 text-emerald-950",
      label: "Verified Active Member",
      description:
        "This public record confirms that the member is approved in the system and the profile remains active for verification.",
    };
  }

  if (member.status === "PENDING") {
    return {
      badge: "border-amber-200 bg-amber-50 text-amber-900",
      panel: "border-amber-200 bg-amber-50 text-amber-950",
      label: "Pending Verification",
      description:
        "This member record exists in the system, but the application is still under review and has not yet reached full approval.",
    };
  }

  return {
    badge: "border-rose-200 bg-rose-50 text-rose-900",
    panel: "border-rose-200 bg-rose-50 text-rose-950",
    label: "Limited Verification",
    description:
      "This record is currently not in an approved active state. Please coordinate with the administration for further clarification.",
  };
}

function InfoGrid({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-black/10 bg-neutral-50 p-4"
        >
          <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
            {item.label}
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-900">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="font-serif text-2xl text-[#032a0d]">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function PublicMemberProfilePage({ member }: { member: PublicMember }) {
  const fullName = buildFullName(member);
  const location = buildLocation(member);
  const statusTone = getStatusTone(member);
  const profilePhoto = member.applicantRequirements.find(
    (item) => item.type === "PHOTO_2X2",
  );
  const certificateUrl = member.idGenerationAsset?.certificateUrl ?? null;
  const qrCodeUrl = member.idGenerationAsset?.qrCodeUrl ?? null;
  const publicDocuments = member.applicantRequirements.filter(
    (item) => item.type !== "PHOTO_2X2",
  );
  const verificationItems = [
    {
      label: "Membership Status",
      value: formatEnumLabel(member.status),
    },
    {
      label: "Account Status",
      value: formatEnumLabel(member.user.accountStatus),
    },
    {
      label: "Email Verification",
      value: member.user.isEmailVerified ? "Verified" : "Pending",
    },
    {
      label: "Public Certificate",
      value: certificateUrl ? "Available" : "Not yet available",
    },
    {
      label: "QR Verification",
      value: qrCodeUrl ? "Issued" : "Not yet available",
    },
    {
      label: "Chaplaincy Training",
      value: member.chaplaincyTrainingProgress?.completedAt
        ? `Completed on ${formatDate(member.chaplaincyTrainingProgress.completedAt)}`
        : "Not yet completed",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-200">
      <section className="relative overflow-hidden bg-[#032a0d] pt-14 text-white sm:pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_58%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <p className="text-xs text-white/70 sm:text-sm">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="mx-2 text-white/50">/</span>
            <span className="font-medium text-white">Public Member Profile</span>
          </p>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusTone.badge}`}
              >
                <ShieldCheck className="size-3.5" />
                {statusTone.label}
              </p>
              <h1 className="mt-4 font-serif text-3xl font-semibold tracking-wide sm:text-4xl md:text-5xl">
                {fullName}
              </h1>
              <p className="mt-3 text-sm leading-6 text-white/80 sm:text-base">
                Official public-facing verification profile for member reference{" "}
                <span className="font-semibold text-white">
                  {member.uniqueId ?? "Unavailable"}
                </span>
                . This page is intended for QR code verification, credential
                review, and public legitimacy checks.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              className="border-white/35 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_360px]">
            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#032a0d]/10 bg-neutral-100">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto.fileUrl}
                      alt={`${fullName} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound className="size-14 text-[#032a0d]/50" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#032a0d]/60">
                    Member Overview
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-neutral-950">
                    {fullName}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600">
                    {formatEnumLabel(member.memberType)}
                  </p>

                  <div
                    className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${statusTone.panel}`}
                  >
                    {statusTone.description}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <InfoGrid
                  items={[
                    {
                      label: "Public Member ID",
                      value: member.uniqueId ?? "Not assigned",
                    },
                    {
                      label: "Badge Number",
                      value: member.badgeNumber ?? "Not assigned",
                    },
                    {
                      label: "Member Since",
                      value: formatDate(member.createdAt),
                    },
                    {
                      label: "Current Onboarding Step",
                      value: member.onboardingProgress
                        ? stepLabels[member.onboardingProgress.currentStep]
                        : "Not started",
                    },
                  ]}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2 text-[#032a0d]">
                <BadgeCheck className="size-5" />
                <h2 className="font-serif text-2xl text-[#032a0d]">
                  Proof of Legitimacy
                </h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Public verification indicators that support the authenticity and
                current standing of this member record.
              </p>

              <div className="mt-5 space-y-3">
                {verificationItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-black/10 bg-neutral-50 px-4 py-3"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-neutral-900">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SectionCard
            title="Profile Information"
            description="Public-facing identity and service information available for verification."
          >
            <InfoGrid
              items={[
                {
                  label: "Full Name",
                  value: fullName,
                },
                {
                  label: "Recorded User Role",
                  value: formatEnumLabel(member.user.role),
                },
                {
                  label: "Church Affiliation",
                  value: member.churchAffiliation ?? "Not provided",
                },
                {
                  label: "Current Position / Role",
                  value:
                    member.currentPositionRoleOther ??
                    member.currentPositionRole ??
                    "Not provided",
                },
                {
                  label: "Nationality",
                  value: member.nationality ?? "Not provided",
                },
                {
                  label: "Service Location",
                  value: location || "Not publicly listed",
                },
              ]}
            />
          </SectionCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="Branch and Office Credentials"
              description="Current service branches and active officer assignments linked to this member."
            >
              <div className="space-y-4">
                <div className="rounded-xl border border-black/10 bg-neutral-50 p-4">
                  <div className="flex items-center gap-2 text-[#032a0d]">
                    <BriefcaseBusiness className="size-4" />
                    <p className="font-medium">Preferred Branches of Service</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {member.preferredBranches.length > 0 ? (
                      member.preferredBranches.map((branch) => (
                        <span
                          key={branch.id}
                          className="rounded-full border border-[#032a0d]/15 bg-white px-3 py-1 text-sm text-[#032a0d]"
                        >
                          {branch.title}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-neutral-600">
                        No preferred branches recorded.
                      </p>
                    )}
                  </div>
                  {member.preferredBranchOther ? (
                    <p className="mt-3 text-sm text-neutral-600">
                      Additional branch detail: {member.preferredBranchOther}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-xl border border-black/10 bg-neutral-50 p-4">
                  <div className="flex items-center gap-2 text-[#032a0d]">
                    <ShieldCheck className="size-4" />
                    <p className="font-medium">Active Officer Assignments</p>
                  </div>
                  <div className="mt-3 space-y-3">
                    {member.officerAssignments.length > 0 ? (
                      member.officerAssignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="rounded-xl border border-black/10 bg-white p-4"
                        >
                          <p className="font-medium text-neutral-950">
                            {assignment.officeTitle.name}
                          </p>
                          <p className="mt-1 text-sm text-neutral-600">
                            {formatEnumLabel(assignment.officeTitle.level)}
                          </p>
                          <p className="mt-2 text-sm text-neutral-700">
                            Jurisdiction:{" "}
                            {buildJurisdiction(assignment) || "General service"}
                          </p>
                          <p className="mt-1 text-sm text-neutral-700">
                            Started: {formatDate(assignment.startDate)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-neutral-600">
                        No active officer assignments are currently listed.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Certificates and Supporting Records"
              description="Documents and approved public-facing records connected to this member account."
            >
              <div className="space-y-4">
                <div className="rounded-xl border border-black/10 bg-neutral-50 p-4">
                  <div className="flex items-center gap-2 text-[#032a0d]">
                    <FileBadge2 className="size-4" />
                    <p className="font-medium">Official Member Certificate</p>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600">
                    {certificateUrl
                      ? `Certificate issued on ${formatDate(member.idGenerationAsset?.generatedAt)}.`
                      : "No public certificate has been issued yet."}
                  </p>
                  {certificateUrl ? (
                    <Button asChild variant="outline" className="mt-4">
                      <a href={certificateUrl} target="_blank" rel="noreferrer">
                        View certificate
                        <ExternalLink className="size-4" />
                      </a>
                    </Button>
                  ) : null}
                </div>

                <div className="rounded-xl border border-black/10 bg-neutral-50 p-4">
                  <div className="flex items-center gap-2 text-[#032a0d]">
                    <BookOpenCheck className="size-4" />
                    <p className="font-medium">Approved Records and Credentials</p>
                  </div>
                  <div className="mt-3 space-y-3">
                    {publicDocuments.length > 0 ? (
                      publicDocuments.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-black/10 bg-white p-4"
                          >
                            <p className="font-medium text-neutral-950">
                              {requirementLabels[item.type] ?? formatEnumLabel(item.type)}
                            </p>
                            <p className="mt-1 text-sm text-neutral-600">
                              Approved record updated on {formatDate(item.updatedAt)}
                            </p>
                            <Button asChild variant="link" className="mt-2 h-auto px-0 text-[#032a0d]">
                              <a href={item.fileUrl} target="_blank" rel="noreferrer">
                                Open record
                                <ExternalLink className="size-4" />
                              </a>
                            </Button>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-neutral-600">
                        No public supporting records are available yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_320px]">
            <SectionCard
              title="Academic and Service Notes"
              description="Additional background details that may support credential review."
            >
              <InfoGrid
                items={[
                  {
                    label: "Tertiary / College",
                    value: member.tertiaryCollege ?? "Not provided",
                  },
                  {
                    label: "Post-Graduate Studies",
                    value: member.postGraduateStudies ?? "Not provided",
                  },
                  {
                    label: "Skills and Talents",
                    value: member.skillsTalents ?? "Not provided",
                  },
                  {
                    label: "Pre-Orientation",
                    value: member.onboardingProgress?.preOrientationCompletedAt
                      ? `Completed on ${formatDate(
                          member.onboardingProgress.preOrientationCompletedAt,
                        )}`
                      : "Not yet completed",
                  },
                ]}
              />
            </SectionCard>

            <SectionCard
              title="QR Verification"
              description="Scan or compare this QR asset against the official generated record."
            >
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#032a0d]/20 bg-neutral-50 p-5 text-center">
                {qrCodeUrl ? (
                  <>
                    <div className="overflow-hidden rounded-xl border border-black/10 bg-white p-3">
                      <img
                        src={qrCodeUrl}
                        alt={`QR verification for ${member.uniqueId ?? member.id}`}
                        className="h-52 w-52 object-contain"
                      />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-neutral-600">
                      Issued QR code for profile verification. Scanning this code
                      should resolve back to this member record.
                    </p>
                  </>
                ) : (
                  <>
                    <QrCode className="size-12 text-[#032a0d]/45" />
                    <p className="mt-4 text-sm leading-6 text-neutral-600">
                      A generated QR verification asset is not available yet for
                      this record.
                    </p>
                  </>
                )}

                {member.idGenerationAsset?.profileUrl ? (
                  <Button asChild variant="link" className="mt-3 px-0 text-[#032a0d]">
                    <a
                      href={member.idGenerationAsset.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open official profile link
                      <ExternalLink className="size-4" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </SectionCard>
          </div>

          <div className="rounded-2xl border border-[#032a0d]/15 bg-white px-5 py-4 text-sm leading-6 text-neutral-600 shadow-sm sm:px-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-[#032a0d]" />
              <p>
                This page is a public verification record intended for legitimacy
                checks and credential review. Sensitive personal details such as
                full address, contact numbers, emergency contacts, birth date,
                and private application records are intentionally not displayed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
