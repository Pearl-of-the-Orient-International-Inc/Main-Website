/* eslint-disable @next/next/no-img-element */
"use client";

import { ArrowRight, ChevronRight, FileText, ShieldCheck, UserCheck } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { IconCalendarEvent, IconExternalLink } from "@tabler/icons-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import {
  formatDate,
  formatEnumLabel,
  getDocumentPreviewUrl,
  requirementLabels,
  type PublicMember,
} from "./public-member-profile.shared";

type PublicDocument = PublicMember["applicantRequirements"][number];

type AnalyticsDatum = {
  name: string;
  value: number;
};

type AnalyticsPieDatum = AnalyticsDatum & {
  fill: string;
};

type RecentActivity = {
  title: string;
  description: string;
  date: string;
};

type Props = {
  member: PublicMember;
  fullName: string;
  certificateUrl: string | null;
  publicDocuments: PublicDocument[];
  overviewSummary: string[];
  recentActivities: RecentActivity[];
  aboutEssay: string;
  mapEmbedUrl: string;
  analyticsBarData: AnalyticsDatum[];
  analyticsPieData: AnalyticsPieDatum[];
};

export function PublicMemberProfileTabs({
  member,
  fullName,
  certificateUrl,
  publicDocuments,
  overviewSummary,
  recentActivities,
  aboutEssay,
  mapEmbedUrl,
  analyticsBarData,
  analyticsPieData,
}: Props) {
  return (
    <div className="space-y-6">
      <TabsContent value="home">
        <div className="space-y-6">
          <section className="overflow-hidden border bg-white shadow">
            <div className="border-b px-5 py-4">
              <h2 className="text-2xl font-semibold text-neutral-950">
                Overview
              </h2>
            </div>
            <div className="space-y-4 p-5 text-base leading-7 text-neutral-700">
              <p>{overviewSummary.join(" ")}</p>
            </div>
          </section>

          <section className="overflow-hidden border bg-white shadow">
            <div className="border-b px-5 py-3">
              <h2 className="text-2xl font-semibold text-neutral-950">
                Certifications
              </h2>
            </div>
            <div className="grid gap-5 p-5 lg:grid-cols-2">
              {certificateUrl ? (
                <div className="border bg-neutral-50 p-3">
                  <p className="text-sm font-semibold">
                    Official Member Certificate
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Published on {formatDate(member.idGenerationAsset?.generatedAt)}
                  </p>
                  <div className="mt-4 h-80 overflow-hidden border bg-white">
                    <iframe
                      src={getDocumentPreviewUrl(
                        certificateUrl,
                        "application/pdf",
                      )}
                      title="Official member certificate"
                      className="h-full w-full"
                    />
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-[#032a0d]"
                  >
                    <a href={certificateUrl} target="_blank" rel="noreferrer">
                      Open certificate <IconExternalLink />
                    </a>
                  </Button>
                </div>
              ) : null}

              {publicDocuments.length > 0 ? (
                publicDocuments.map((item) => (
                  <div key={item.id} className="border bg-neutral-50 p-5">
                    <p className="text-sm font-semibold">
                      {requirementLabels[item.type] ?? formatEnumLabel(item.type)}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Updated {formatDate(item.updatedAt)}
                    </p>
                    <div className="mt-4 h-80 overflow-hidden border bg-white">
                      {item.mimeType?.startsWith("image/") ? (
                        <img
                          src={item.fileUrl}
                          alt={requirementLabels[item.type] ?? item.type}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <iframe
                          src={getDocumentPreviewUrl(item.fileUrl, item.mimeType)}
                          title={requirementLabels[item.type] ?? item.type}
                          className="h-full w-full"
                        />
                      )}
                    </div>
                    <Button
                      asChild
                      variant="link"
                      className="mt-3 px-0 text-[#032a0d]"
                    >
                      <a href={item.fileUrl} target="_blank" rel="noreferrer">
                        Open file <ChevronRight />
                      </a>
                    </Button>
                  </div>
                ))
              ) : !certificateUrl ? (
                <div className="border bg-neutral-50 p-5 text-sm text-muted-foreground">
                  No additional public supporting records available yet.
                </div>
              ) : null}
            </div>
          </section>

          <section className="overflow-hidden border bg-white shadow">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h2 className="text-2xl font-semibold text-neutral-950">
                Recent Activity
              </h2>
              <div className="text-sm text-muted-foreground">
                {recentActivities.length} timeline entries
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-6">
                {recentActivities.map((activity, index) => {
                  const activityDate = new Date(activity.date);
                  const dateLabel = activityDate.toLocaleDateString("en-PH", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={activity.title}
                      className="grid gap-4 md:grid-cols-[170px_28px_minmax(0,1fr)] md:gap-6"
                    >
                      <div className="pt-1 text-sm font-medium text-neutral-500">
                        {dateLabel}
                      </div>

                      <div className="relative flex justify-center">
                        {index < recentActivities.length - 1 ? (
                          <span className="absolute top-12 -bottom-8 w-px bg-neutral-200" />
                        ) : null}
                        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d8e4db] bg-[#edf7ef] shadow-sm">
                          <IconCalendarEvent className="size-5 text-[#032a0d]" />
                        </div>
                      </div>

                      <div className="overflow-hidden border border-neutral-200 bg-white px-5 py-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
                        <div className="space-y-1.5">
                          <p className="text-lg font-semibold text-neutral-950">
                            {activity.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </TabsContent>

      <TabsContent value="about">
        <div className="space-y-6">
          <section className="overflow-hidden border bg-white shadow">
            <div className="border-b px-5 py-4">
              <h2 className="text-2xl font-semibold text-neutral-950">About</h2>
            </div>
            <div className="p-5">
              <div className="space-y-6 text-base leading-8 text-neutral-700">
                {aboutEssay.split("\n\n").map((paragraph, index) => (
                  <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-5 space-y-3">
                <div>
                  <p className="font-semibold">Full name</p>
                  <p className="text-muted-foreground">{fullName}</p>
                </div>
                <div>
                  <p className="font-semibold">Badge number</p>
                  <p className="text-muted-foreground">
                    {member.badgeNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Nationality</p>
                  <p className="text-muted-foreground">
                    {member.nationality || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Application date</p>
                  <p className="text-muted-foreground">
                    {formatDate(member.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="border bg-white shadow">
            <div className="border-b px-5 py-4">
              <h2 className="text-2xl font-semibold text-neutral-950">
                Location
              </h2>
            </div>
            <div className="p-5">
              <div className="relative w-full border bg-neutral-50 p-6">
                <div className="space-y-4">
                  <div className="grid gap-3 lg:grid-cols-2">
                    <div>
                      <p className="font-semibold">Municipality</p>
                      <p className="text-muted-foreground">
                        {member.municipalityCity || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Province</p>
                      <p className="text-muted-foreground">
                        {member.province || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Barangay</p>
                      <p className="text-muted-foreground">
                        {member.barangay || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Region</p>
                      <p className="text-muted-foreground">
                        {member.region || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 h-100 border bg-white">
                  <iframe
                    src={mapEmbedUrl}
                    title={`${fullName} location map`}
                    className="h-full w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </TabsContent>

      <TabsContent value="records">
        <div className="grid gap-5 lg:grid-cols-10">
          <div className="space-y-5 lg:col-span-3">
            <div className="border bg-white p-5 shadow">
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Public identity
              </p>
              <p className="mt-3 text-lg font-semibold text-neutral-950">
                {fullName}
              </p>
              <div className="mt-4 space-y-3 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-[#032a0d]" />
                  <span>
                    {member.user.isEmailVerified
                      ? "Verified email on record"
                      : "Email verification pending"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="size-4 text-[#032a0d]" />
                  <span>{formatEnumLabel(member.memberType)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-[#032a0d]" />
                  <span>
                    {publicDocuments.length + (certificateUrl ? 1 : 0)} public
                    records available
                  </span>
                </div>
              </div>
            </div>

            <div className="border bg-white p-5 shadow">
              <p className="text-sm font-semibold text-neutral-950">
                Onboarding progress
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {member.onboardingProgress
                  ? `Current step: ${formatEnumLabel(member.onboardingProgress.currentStep)}`
                  : "No public onboarding progress available."}
              </p>
              {member.chaplaincyTrainingProgress?.completedAt ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Training completed on{" "}
                  {formatDate(member.chaplaincyTrainingProgress.completedAt)}.
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-5 lg:col-span-7">
            <div className="overflow-hidden border bg-white shadow">
              <div className="border-b p-4">
                <h3 className="text-xl font-semibold text-neutral-950">
                  Office assignments
                </h3>
              </div>
              <div className="p-4">
                {member.officerAssignments.length > 0 ? (
                  <div className="space-y-4">
                    {member.officerAssignments.map((assignment) => {
                      const assignmentLocation = [
                        assignment.barangay,
                        assignment.cityMunicipality,
                        assignment.province,
                        assignment.region,
                      ]
                        .filter(Boolean)
                        .join(", ");

                      return (
                        <div key={assignment.id} className="border bg-neutral-50 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-lg font-semibold text-neutral-950">
                                {assignment.officeTitle.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {assignment.department || "General assignment"}
                              </p>
                            </div>
                            <Badge variant="outline">
                              Since {formatDate(assignment.startDate)}
                            </Badge>
                          </div>
                          <p className="mt-3 text-sm text-neutral-600">
                            {assignmentLocation || "No public office location listed."}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No active office assignments are available on this public
                    profile yet.
                  </p>
                )}
              </div>
            </div>

            <div className="overflow-hidden border bg-white shadow">
              <div className="border-b p-4">
                <h3 className="text-xl font-semibold text-neutral-950">
                  Public supporting records
                </h3>
              </div>
              <div className="p-4">
                {certificateUrl || publicDocuments.length > 0 ? (
                  <div className="space-y-4">
                    {certificateUrl ? (
                      <div className="border bg-neutral-50 p-4">
                        <p className="font-semibold text-neutral-950">
                          Official Member Certificate
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Generated on {formatDate(member.idGenerationAsset?.generatedAt)}
                        </p>
                        <Button
                          asChild
                          variant="link"
                          className="mt-2 px-0 text-[#032a0d]"
                        >
                          <a href={certificateUrl} target="_blank" rel="noreferrer">
                            Open certificate <ChevronRight />
                          </a>
                        </Button>
                      </div>
                    ) : null}

                    {publicDocuments.map((document) => (
                      <div key={document.id} className="border bg-neutral-50 p-4">
                        <p className="font-semibold text-neutral-950">
                          {requirementLabels[document.type] ??
                            formatEnumLabel(document.type)}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Updated {formatDate(document.updatedAt)}
                        </p>
                        <Button
                          asChild
                          variant="link"
                          className="mt-2 px-0 text-[#032a0d]"
                        >
                          <a href={document.fileUrl} target="_blank" rel="noreferrer">
                            Open file <ChevronRight />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No public supporting records are available yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="service">
        <section className="overflow-hidden border bg-white shadow">
          <div className="border-b px-5 py-4">
            <h2 className="text-2xl font-semibold text-neutral-950">
              Services
            </h2>
          </div>
          <div className="p-5">
            <div className="flex flex-col items-center justify-center gap-2">
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
                <div className="text-center">
                  <p className="text-base font-medium">
                    There are no branch of services yet.
                  </p>
                  <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                    When {fullName} starts serving in a branch and updates their
                    profile, the branch information will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </TabsContent>

      <TabsContent value="analytics">
        <section className="overflow-hidden border bg-white shadow">
          <div className="border-b px-5 py-4">
            <h2 className="text-2xl font-semibold text-neutral-950">
              Analytics
            </h2>
          </div>
          <div className="p-5">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="border border-[#032a0d]/10 bg-linear-to-br from-[#032a0d] via-[#043612] to-[#021d09] px-5 py-5 text-white shadow-sm">
                <p className="text-xs uppercase text-green-100/75">
                  Verified signals
                </p>
                <p className="mt-3 text-4xl font-semibold tracking-tight">
                  {analyticsPieData.reduce((total, item) => total + item.value, 0)}
                </p>
                <p className="mt-4 text-xs text-green-50/85">
                  Combined trust markers from profile status, verification,
                  training, certificate, and office data.
                </p>
              </div>

              <div className="border border-emerald-200 bg-linear-to-br from-emerald-50 to-white px-5 py-5 shadow-sm">
                <p className="text-xs uppercase text-neutral-500">
                  Public Records
                </p>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
                  {publicDocuments.length + (certificateUrl ? 1 : 0)}
                </p>
                <p className="mt-2 text-xs text-neutral-600">
                  Approved public documents and certificate entries available on
                  the profile.
                </p>
              </div>

              <div className="border border-amber-200 bg-linear-to-br from-amber-50 to-white px-5 py-5 shadow-sm">
                <p className="text-xs uppercase text-neutral-500">
                  Milestones
                </p>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
                  {recentActivities.length}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800">
                  <ArrowRight className="size-3.5" />
                  Timeline-driven profile history
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
                <div className="border-b bg-linear-to-r from-neutral-50 to-white px-5 py-4">
                  <p className="text-lg font-semibold text-neutral-950">
                    Public profile metrics
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Snapshot of the member&apos;s visible records, assignments,
                    and milestones.
                  </p>
                </div>
                <div className="px-4 py-5 sm:px-5">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Value",
                        color: "#032a0d",
                      },
                    }}
                    className="h-80 w-full"
                  >
                    <BarChart
                      data={analyticsBarData}
                      margin={{ top: 10, right: 12, left: -12, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="analyticsBarGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#0a4a18" />
                          <stop offset="100%" stopColor="#58a36d" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                      />
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        className="text-xs"
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        wrapperStyle={{ paddingBottom: 12 }}
                      />
                      <Bar
                        dataKey="value"
                        name="Profile count"
                        radius={[12, 12, 4, 4]}
                        fill="url(#analyticsBarGradient)"
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>

              <div className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
                <div className="border-b bg-linear-to-r from-neutral-50 to-white px-5 py-4">
                  <p className="text-lg font-semibold text-neutral-950">
                    Verification composition
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Public trust signals currently visible
                  </p>
                </div>
                <div className="px-4 py-5 sm:px-5">
                  <ChartContainer
                    config={{
                      verified: {
                        label: "Verified",
                        color: "#16a34a",
                      },
                      pending: {
                        label: "Pending",
                        color: "#f59e0b",
                      },
                      certificate: {
                        label: "Certificate",
                        color: "#2563eb",
                      },
                      training: {
                        label: "Training",
                        color: "#8b5cf6",
                      },
                      office: {
                        label: "Office",
                        color: "#0f766e",
                      },
                    }}
                    className="h-80 w-full"
                  >
                    <PieChart>
                      <ChartTooltip
                        content={<ChartTooltipContent nameKey="name" />}
                      />
                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        wrapperStyle={{ paddingBottom: 16 }}
                      />
                      <Pie
                        data={analyticsPieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={70}
                        outerRadius={102}
                        paddingAngle={4}
                        cornerRadius={8}
                      />
                    </PieChart>
                  </ChartContainer>
                </div>
              </div>
            </div>
          </div>
        </section>
      </TabsContent>
    </div>
  );
}
