/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import {
  BadgeCheck,
  BookMarked,
  BriefcaseBusiness,
  Ellipsis,
  ExternalLink,
  FileBadge2,
  Mail,
  MapPin,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PublicMemberProfileResponse } from "./public-member-profile.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconAlertTriangleFilled,
  IconBrandFacebookFilled,
  IconCalendarEvent,
  IconMailOpenedFilled,
  IconPlus,
  IconSendFilled,
} from "@tabler/icons-react";

type PublicMember = PublicMemberProfileResponse["data"];

// TODO: Add more detailed information about the member&apos;s background and experience, create like an algorithm based on the current information for overview. Add all the report modules if they have.

const PUBLIC_CONTACT_EMAIL = "poile2005official@gmail.com";

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
  return [member.municipalityCity, member.province, member.region]
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
      surface: "border-emerald-200/70 bg-emerald-50 text-emerald-950",
      label: "Verified Active Member",
      description:
        "This public record confirms that the member is approved in the system and currently active for verification.",
    };
  }

  if (member.status === "PENDING") {
    return {
      badge: "border-amber-200 bg-amber-50 text-amber-900",
      surface: "border-amber-200/70 bg-amber-50 text-amber-950",
      label: "Pending Verification",
      description:
        "This record exists in the system, but the membership application is still under review.",
    };
  }

  return {
    badge: "border-rose-200 bg-rose-50 text-rose-900",
    surface: "border-rose-200/70 bg-rose-50 text-rose-950",
    label: "Limited Verification",
    description:
      "This record is not currently in an approved active state. Please coordinate with administration for confirmation.",
  };
}

function SectionSurface({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden border bg-white shadow">
      <div className="border-b px-6 py-5 sm:px-7">
        <h2 className="text-2xl font-semibold text-neutral-950">{title}</h2>
        {description ? (
          <p className="mt-5 text-base text-neutral-600">
            {description}
          </p>
        ) : null}
      </div>
      <div className="px-6 py-6 sm:px-7">{children}</div>
    </section>
  );
}

function SidebarPanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <aside className="rounded-[24px] border border-black/10 bg-white p-5 shadow-[0_14px_36px_rgba(3,42,13,0.06)]">
      <div className="flex items-center gap-2 text-[#032a0d]">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </aside>
  );
}

function DetailGrid({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-black/8 bg-neutral-50 px-4 py-4"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
            {item.label}
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-900">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function MetricTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="border bg-white px-5 py-4 shadow">
      <p className="text-xs uppercase text-neutral-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accent}`}>{value}</p>
    </div>
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
  const publicDocuments = member.applicantRequirements.filter(
    (item) => item.type !== "PHOTO_2X2",
  );
  const publicRecordCount = publicDocuments.length + (certificateUrl ? 1 : 0);
  const milestoneCount = [
    member.onboardingProgress?.preOrientationCompletedAt,
    member.chaplaincyTrainingProgress?.completedAt,
    member.idGenerationAsset?.generatedAt,
    member.status === "APPROVED" ? "approved" : null,
  ].filter(Boolean).length;

  const contactHref = `mailto:${PUBLIC_CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Member verification inquiry: ${member.uniqueId ?? fullName}`,
  )}`;
  const messageHref = `mailto:${PUBLIC_CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Message regarding member profile: ${member.uniqueId ?? fullName}`,
  )}`;
  const bookingHref = `mailto:${PUBLIC_CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Booking request for member: ${member.uniqueId ?? fullName}`,
  )}`;

  const verificationItems = [
    { label: "Membership Status", value: formatEnumLabel(member.status) },
    {
      label: "Account Standing",
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
      label: "Training Completion",
      value: member.chaplaincyTrainingProgress?.completedAt
        ? `Completed on ${formatDate(member.chaplaincyTrainingProgress.completedAt)}`
        : "Not yet completed",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 py-5">
      <Tabs defaultValue="home" className="mx-auto max-w-7xl pb-10 pt-16">
        <div className="grid lg:grid-cols-10 gap-5">
          <div className="lg:col-span-7">
            <section className="border bg-white ">
              <div className="border-b">
                <div className="relative h-50">
                  <img
                    src="/profile-banner.png"
                    alt="Profile banner"
                    className="h-full w-full object-right object-contain"
                  />
                  <div className="absolute top-1/2 -mt-3 left-30 -translate-y-1/2">
                    <blockquote className="font-bold text-zinc-600 italic max-w-md text-2xl">
                      &quot;The best way to find yourself is to{" "}
                      <span className="text-destructive">lose</span> in the{" "}
                      <span className="text-green-700">service of others</span>
                      &quot;
                    </blockquote>
                  </div>
                  <Avatar className="size-25 absolute -bottom-10 left-10">
                    <AvatarImage src={profilePhoto?.fileUrl} />
                    <AvatarFallback className="bg-green-900! text-white font-bold text-4xl border-4 border-emerald-500">
                      {fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="relative mt-10 px-6 pb-7 sm:px-8">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                      <div className="max-w-3xl">
                        <div className="flex mt-4 items-center gap-2">
                          <h1 className="text-4xl font-semibold">{fullName}</h1>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 mt-2 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.516 2.17a.75.75 0 00-1.032 0l-2.4 2.218-3.23.23a.75.75 0 00-.64.49l-1.11 3.042-2.1 2.46a.75.75 0 000 .976l2.1 2.46 1.11 3.042a.75.75 0 00.64.49l3.23.23 2.4 2.218a.75.75 0 001.032 0l2.4-2.218 3.23-.23a.75.75 0 00.64-.49l1.11-3.042 2.1-2.46a.75.75 0 000-.976l-2.1-2.46-1.11-3.042a.75.75 0 00-.64-.49l-3.23-.23-2.4-2.218zm3.257 7.104a.75.75 0 10-1.046-1.076l-3.38 3.287-1.12-1.088a.75.75 0 10-1.046 1.076l1.643 1.596a.75.75 0 001.046 0l3.903-3.795z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-neutral-700 sm:text-base">
                          {formatEnumLabel(member.memberType)}
                          {location ? ` • ${location}` : ""}
                          {member.preferredBranches[0]
                            ? ` • ${member.preferredBranches[0].title}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button variant="default" className="bg-[#032a0d] hover:bg-[#032a0d]/90">
                      <IconPlus className="size-4" />
                      Follow
                    </Button>
                    <Button variant="outline" className="border-[#032a0d] text-[#032a0d] hover:bg-[#032a0d]/5">
                      <IconCalendarEvent className="size-4" />
                      Book a service
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="border-black" size="icon">
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuGroup className="space-y-1">
                          <DropdownMenuItem>
                            <IconBrandFacebookFilled />
                            View facebook
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IconSendFilled />
                            Send a message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IconMailOpenedFilled />
                            Contact via email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IconAlertTriangleFilled />
                            Report abuse
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              <div className="pt-3 px-2">
                <TabsList
                  variant="line"
                >
                  <TabsTrigger value="home" className="px-4 text-base">
                    Home
                  </TabsTrigger>
                  <TabsTrigger value="about" className="px-4 text-base">
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="posts"
                    className="px-4 text-base"
                  >
                    Posts
                  </TabsTrigger>
                  <TabsTrigger value="service" className="px-4 text-base">
                    Service
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="px-4 text-base">
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>
            </section>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                <TabsContent value="home">
                  <div className="space-y-6">
                    <SectionSurface
                      title="Overview"
                      description="A concise public summary of the member's current standing and profile context. This profile presents legitimacy markers,
                          credentials, and public-facing member records."
                    >
                      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_280px]">
                        <div>
                          <div
                            className={`rounded-[24px] border px-5 py-5 text-sm leading-7 ${statusTone.surface}`}
                          >
                            {statusTone.description}
                          </div>
                          <p className="mt-5 text-base leading-8 text-neutral-700">
                            {member.churchAffiliation
                              ? `${fullName} is publicly listed under ${member.churchAffiliation} and is recorded in the Pearl of the Orient verification system with member type ${formatEnumLabel(member.memberType)}.`
                              : `${fullName} is publicly listed in the Pearl of the Orient verification system with member type ${formatEnumLabel(member.memberType)}.`}{" "}
                            This page is designed for professional legitimacy
                            checks, credential review, and profile confirmation
                            from a public link.
                          </p>
                        </div>
                        <div className="rounded-[24px] border border-black/8 bg-neutral-50 p-5">
                          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                            Quick Facts
                          </p>
                          <div className="mt-4 space-y-3 text-sm text-neutral-700">
                            <p>
                              <span className="font-medium text-neutral-950">
                                Public Member ID:
                              </span>{" "}
                              {member.uniqueId ?? "Not assigned"}
                            </p>
                            <p>
                              <span className="font-medium text-neutral-950">
                                Badge Number:
                              </span>{" "}
                              {member.badgeNumber ?? "Not assigned"}
                            </p>
                            <p>
                              <span className="font-medium text-neutral-950">
                                Member Since:
                              </span>{" "}
                              {formatDate(member.createdAt)}
                            </p>
                            <p>
                              <span className="font-medium text-neutral-950">
                                Current Step:
                              </span>{" "}
                              {member.onboardingProgress
                                ? stepLabels[
                                    member.onboardingProgress.currentStep
                                  ]
                                : "Not started"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </SectionSurface>

                    <SectionSurface
                      title="Highlights"
                      description="Visible credentials and profile markers often reviewed first."
                    >
                      <DetailGrid
                        items={[
                          {
                            label: "Church Affiliation",
                            value: member.churchAffiliation ?? "Not provided",
                          },
                          {
                            label: "Current Role",
                            value:
                              member.currentPositionRoleOther ??
                              member.currentPositionRole ??
                              "Not provided",
                          },
                          {
                            label: "Primary Location",
                            value: location || "Not publicly listed",
                          },
                          {
                            label: "Recorded User Role",
                            value: formatEnumLabel(member.user.role),
                          },
                        ]}
                      />
                    </SectionSurface>
                  </div>
                </TabsContent>

                <TabsContent value="about">
                  <SectionSurface
                    title="About"
                    description="Public-facing identity, academic, and service profile information."
                  >
                    <DetailGrid
                      items={[
                        { label: "Full Name", value: fullName },
                        {
                          label: "Nationality",
                          value: member.nationality ?? "Not provided",
                        },
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
                          label: "Service Location",
                          value: location || "Not publicly listed",
                        },
                      ]}
                    />
                  </SectionSurface>
                </TabsContent>

                <TabsContent value="certificates">
                  <SectionSurface
                    title="Certificates"
                    description="Public certificates and approved supporting records tied to this profile."
                  >
                    <div className="space-y-4">
                      <div className="rounded-[24px] border border-black/8 bg-neutral-50 p-5">
                        <div className="flex items-center gap-2 text-[#032a0d]">
                          <FileBadge2 className="size-4" />
                          <p className="font-medium">
                            Official Member Certificate
                          </p>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-neutral-600">
                          {certificateUrl
                            ? `Certificate issued on ${formatDate(member.idGenerationAsset?.generatedAt)} and available for public credential review.`
                            : "No public certificate has been issued yet for this member profile."}
                        </p>
                        {certificateUrl ? (
                          <Button
                            asChild
                            className="mt-4 bg-[#032a0d] hover:bg-[#032a0d]/90"
                          >
                            <a
                              href={certificateUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View certificate
                              <ExternalLink className="size-4" />
                            </a>
                          </Button>
                        ) : null}
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2">
                        {publicDocuments.length > 0 ? (
                          publicDocuments.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_10px_24px_rgba(3,42,13,0.05)]"
                            >
                              <p className="font-medium text-neutral-950">
                                {requirementLabels[item.type] ??
                                  formatEnumLabel(item.type)}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-neutral-600">
                                Approved record updated on{" "}
                                {formatDate(item.updatedAt)}.
                              </p>
                              <Button
                                asChild
                                variant="link"
                                className="mt-3 h-auto px-0 text-[#0b6b43]"
                              >
                                <a
                                  href={item.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Open record
                                  <ExternalLink className="size-4" />
                                </a>
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-[24px] border border-dashed border-black/12 bg-neutral-50 p-6 text-sm text-neutral-600">
                            No public supporting records are currently
                            available.
                          </div>
                        )}
                      </div>
                    </div>
                  </SectionSurface>
                </TabsContent>

                <TabsContent value="service">
                  <SectionSurface
                    title="Service and Office"
                    description="Branches of service and active office responsibilities associated with this member."
                  >
                    <div className="space-y-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                          Preferred Branches
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {member.preferredBranches.length > 0 ? (
                            member.preferredBranches.map((branch) => (
                              <span
                                key={branch.id}
                                className="rounded-full border border-[#032a0d]/12 bg-[#032a0d]/5 px-4 py-2 text-sm text-[#032a0d]"
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
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2">
                        {member.officerAssignments.length > 0 ? (
                          member.officerAssignments.map((assignment) => (
                            <div
                              key={assignment.id}
                              className="rounded-[24px] border border-black/8 bg-neutral-50 p-5"
                            >
                              <p className="font-medium text-neutral-950">
                                {assignment.officeTitle.name}
                              </p>
                              <p className="mt-1 text-sm text-neutral-600">
                                {formatEnumLabel(assignment.officeTitle.level)}
                              </p>
                              <p className="mt-3 text-sm leading-6 text-neutral-700">
                                Jurisdiction:{" "}
                                {buildJurisdiction(assignment) ||
                                  "General service"}
                              </p>
                              <p className="mt-1 text-sm text-neutral-700">
                                Started: {formatDate(assignment.startDate)}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-[24px] border border-dashed border-black/12 bg-neutral-50 p-6 text-sm text-neutral-600">
                            No active officer assignments are currently listed.
                          </div>
                        )}
                      </div>
                    </div>
                  </SectionSurface>
                </TabsContent>

                <TabsContent value="legitimacy">
                  <SectionSurface
                    title="Proof of Legitimacy"
                    description="Public verification indicators that support the authenticity and standing of this member record."
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      {verificationItems.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-[24px] border border-black/8 bg-neutral-50 px-5 py-5"
                        >
                          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                            {item.label}
                          </p>
                          <p className="mt-2 text-sm font-medium leading-6 text-neutral-950">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 rounded-[24px] border border-[#032a0d]/12 bg-[#032a0d]/5 px-5 py-5 text-sm leading-7 text-neutral-700">
                      This page is intended for legitimacy checks and credential
                      review. Sensitive details such as full address, private
                      contact numbers, emergency contacts, birth date, and
                      internal-only application records are intentionally
                      excluded from public view.
                    </div>
                  </SectionSurface>
                </TabsContent>
              </div>

              <div className="space-y-5">
                <SidebarPanel
                  title="Verification Summary"
                  icon={<BadgeCheck className="size-4" />}
                >
                  <div className="space-y-3">
                    {verificationItems.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-black/8 bg-neutral-50 px-4 py-3"
                      >
                        <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm font-medium text-neutral-900">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </SidebarPanel>

                <SidebarPanel
                  title="Profile Analytics"
                  icon={<Sparkles className="size-4" />}
                >
                  <div className="space-y-3">
                    <div className="rounded-2xl bg-[linear-gradient(135deg,#082714_0%,#123b22_100%)] px-4 py-4 text-white">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                        Public Records
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        {publicRecordCount}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-black/8 bg-neutral-50 px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                          Offices
                        </p>
                        <p className="mt-2 text-xl font-semibold text-[#032a0d]">
                          {member.officerAssignments.length}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-black/8 bg-neutral-50 px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                          Milestones
                        </p>
                        <p className="mt-2 text-xl font-semibold text-[#7b5b1e]">
                          {milestoneCount}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-neutral-600">
                      Visitor and client counters are not shown yet because
                      there is no real profile-tracking data stored for this
                      public page.
                    </p>
                  </div>
                </SidebarPanel>

                <SidebarPanel
                  title="Quick Actions"
                  icon={<BriefcaseBusiness className="size-4" />}
                >
                  <div className="space-y-3">
                    <Button
                      asChild
                      className="w-full bg-[#032a0d] hover:bg-[#032a0d]/90"
                    >
                      <a href={contactHref}>
                        <Mail className="size-4" />
                        Contact
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <a href={messageHref}>
                        <MessageSquare className="size-4" />
                        Message
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <a href={bookingHref}>
                        <BookMarked className="size-4" />
                        Book
                      </a>
                    </Button>
                    {certificateUrl ? (
                      <Button
                        asChild
                        variant="link"
                        className="mt-1 h-auto px-0 text-[#0b6b43]"
                      >
                        <a
                          href={certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open certificate
                          <ExternalLink className="size-4" />
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </SidebarPanel>

                <SidebarPanel
                  title="Public Note"
                  icon={<MapPin className="size-4" />}
                >
                  <p className="text-sm leading-7 text-neutral-600">
                    This page is a public profile intended for verification and
                    credibility review. It balances legitimacy proof with
                    privacy by exposing only selected public-facing records.
                  </p>
                </SidebarPanel>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="w-full max-w-md overflow-hidden border border-green-800/30 bg-linear-to-br from-[#032a0d] via-[#043612] to-[#021d09] shadow-2xl">
              <div className="relative p-5">
                {/* header */}
                <div className="flex items-center gap-3 pr-24">
                  <div>
                    <p className="text-sm font-medium text-green-200/80">
                      Official Member Profile
                    </p>
                    <h3 className="text-lg font-semibold tracking-tight text-white">
                      Verified and Legitimate
                    </h3>
                  </div>
                </div>

                {/* message */}
                <div className="mt-5 border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                  <p className="text-sm text-green-50/90">
                    This profile has been confirmed as an
                    <span className="font-semibold text-green-300">
                      {" "}
                      authentic{" "}
                    </span>
                    and
                    <span className="font-semibold text-green-300">
                      {" "}
                      officially recognized{" "}
                    </span>
                    organization account.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-green-400/15 px-1.5 py-1 text-[10px] font-medium text-green-200 ring-1 ring-green-400/20">
                      Identity Confirmed
                    </span>
                    <span className="rounded-full bg-green-400/15 px-1.5 py-1 text-[10px] font-medium text-green-200 ring-1 ring-green-400/20">
                      Trusted Profile
                    </span>
                    <span className="rounded-full bg-green-400/15 px-1.5 py-1 text-[10px] font-medium text-green-200 ring-1 ring-green-400/20">
                      Official Presence
                    </span>
                  </div>
                </div>

                {/* cover image */}
                <div className="relative mt-5 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/7654193/pexels-photo-7654193.jpeg"
                    alt="Organization cover"
                    className="h-44 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#032a0d]/80 via-[#032a0d]/20 to-transparent" />

                  <div className="absolute bottom-4 left-4 flex items-center gap-1.25 rounded-full bg-white/10 px-2 py-1.5 backdrop-blur-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4.5 text-green-400"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.516 2.17a.75.75 0 00-1.032 0l-2.4 2.218-3.23.23a.75.75 0 00-.64.49l-1.11 3.042-2.1 2.46a.75.75 0 000 .976l2.1 2.46 1.11 3.042a.75.75 0 00.64.49l3.23.23 2.4 2.218a.75.75 0 001.032 0l2.4-2.218 3.23-.23a.75.75 0 00.64-.49l1.11-3.042 2.1-2.46a.75.75 0 000-.976l-2.1-2.46-1.11-3.042a.75.75 0 00-.64-.49l-3.23-.23-2.4-2.218zm3.257 7.104a.75.75 0 10-1.046-1.076l-3.38 3.287-1.12-1.088a.75.75 0 10-1.046 1.076l1.643 1.596a.75.75 0 001.046 0l3.903-3.795z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-[10px] -mt-0.75 font-semibold text-white">
                      Verified Organization
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
