/* eslint-disable @next/next/no-img-element */
"use client";

import { BadgeCheck, BriefcaseBusiness, FileCheck2, MapPin } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PublicMemberProfileSidebar } from "./PublicMemberProfileSidebar";
import { PublicMemberProfileTabs } from "./PublicMemberProfileTabs";
import type { PublicMember } from "./public-member-profile.shared";
import {
  buildChurchMapEmbedUrl,
  buildDetailedAboutEssay,
  buildFullName,
  buildLocation,
  buildMapEmbedUrl,
  buildOverviewSummary,
  buildRecentActivities,
  formatEnumLabel,
} from "./public-member-profile.shared";

export function PublicMemberProfilePage({ member }: { member: PublicMember }) {
  const fullName = buildFullName(member);
  const location = buildLocation(member);
  const profilePhoto = member.applicantRequirements.find(
    (item) => item.type === "PHOTO_2X2",
  );
  const certificateUrl = member.idGenerationAsset?.certificateUrl ?? null;
  const publicDocuments = member.applicantRequirements.filter(
    (item) => item.type !== "PHOTO_2X2",
  );
  const overviewSummary = buildOverviewSummary(member, fullName, location);
  const recentActivities = buildRecentActivities(member, certificateUrl);
  const aboutEssay = buildDetailedAboutEssay(member, fullName, location);
  const mapEmbedUrl = buildMapEmbedUrl(member);
  const churchMapEmbedUrl = buildChurchMapEmbedUrl(member);
  const analyticsBarData = [
    {
      name: "Records",
      value: publicDocuments.length + (certificateUrl ? 1 : 0),
    },
    { name: "Branches", value: member.preferredBranches.length },
    { name: "Offices", value: member.officerAssignments.length },
    { name: "Milestones", value: recentActivities.length },
  ];
  const analyticsPieData = [
    {
      name: "Verified",
      value: member.user.isEmailVerified ? 1 : 0,
      fill: "var(--color-verified)",
    },
    {
      name: "Pending",
      value: member.user.isEmailVerified ? 0 : 1,
      fill: "var(--color-pending)",
    },
    {
      name: "Certificate",
      value: certificateUrl ? 1 : 0,
      fill: "var(--color-certificate)",
    },
    {
      name: "Training",
      value: member.chaplaincyTrainingProgress?.completedAt ? 1 : 0,
      fill: "var(--color-training)",
    },
    {
      name: "Office",
      value: member.officerAssignments.length > 0 ? 1 : 0,
      fill: "var(--color-office)",
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="min-h-screen bg-zinc-100 py-5">
      <Tabs defaultValue="home" className="mx-auto max-w-7xl pb-10 pt-16">
        <div className="grid gap-5 lg:grid-cols-10">
          <div className="lg:col-span-7">
            <section className="border bg-white">
              <div className="border-b">
                <div className="relative h-50">
                  <img
                    src="/profile-banner.png"
                    alt="Profile banner"
                    className="h-full w-full object-right object-contain"
                  />
                  <div className="absolute top-1/2 left-30 -mt-3 -translate-y-1/2">
                    <blockquote className="max-w-md text-2xl font-bold italic text-zinc-600">
                      &quot;The best way to find yourself is to{" "}
                      <span className="text-destructive">lose</span> in the{" "}
                      <span className="text-green-700">service of others</span>
                      &quot;
                    </blockquote>
                  </div>
                  <Avatar className="absolute -bottom-10 left-10 size-25">
                    <AvatarImage src={profilePhoto?.fileUrl} />
                    <AvatarFallback className="border-4 border-emerald-500 bg-green-900! text-4xl font-bold text-white">
                      {fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="relative mt-10 px-6 pb-7 sm:px-8">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                      <div className="max-w-3xl">
                        <div className="mt-4 flex items-center gap-2">
                          <h1 className="text-4xl font-semibold">{fullName}</h1>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="mt-2 size-6 text-green-600"
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
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="border-green-200 bg-green-50 text-green-800"
                          >
                            <BadgeCheck className="mr-1 size-3.5" />
                            {member.isActive ? "Active member" : "Inactive profile"}
                          </Badge>
                          {member.uniqueId ? (
                            <Badge variant="outline">Member ID: {member.uniqueId}</Badge>
                          ) : null}
                          {member.badgeNumber ? (
                            <Badge variant="outline">
                              Badge No.: {member.badgeNumber}
                            </Badge>
                          ) : null}
                          {member.officerAssignments[0] ? (
                            <Badge variant="outline">
                              <BriefcaseBusiness className="mr-1 size-3.5" />
                              {member.officerAssignments[0].officeTitle.name}
                            </Badge>
                          ) : null}
                          {member.churchAffiliation ? (
                            <Badge variant="outline">
                              <MapPin className="mr-1 size-3.5" />
                              {member.churchAffiliation}
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 text-sm text-neutral-600 sm:grid-cols-3">
                    <div className="border border-neutral-200 bg-neutral-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-neutral-500">
                        Public records
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-neutral-950">
                        <FileCheck2 className="size-4 text-[#032a0d]" />
                        {publicDocuments.length + (certificateUrl ? 1 : 0)}
                      </p>
                    </div>
                    <div className="border border-neutral-200 bg-neutral-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-neutral-500">
                        Service branches
                      </p>
                      <p className="mt-2 text-lg font-semibold text-neutral-950">
                        {member.preferredBranches.length}
                      </p>
                    </div>
                    <div className="border border-neutral-200 bg-neutral-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-neutral-500">
                        Timeline entries
                      </p>
                      <p className="mt-2 text-lg font-semibold text-neutral-950">
                        {recentActivities.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-2 pt-3">
                <TabsList variant="line">
                  <TabsTrigger value="home" className="px-4 text-base">
                    Home
                  </TabsTrigger>
                  <TabsTrigger value="about" className="px-4 text-base">
                    About
                  </TabsTrigger>
                  <TabsTrigger value="records" className="px-4 text-base">
                    Records
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

            <div className="mt-6 grid gap-6">
              <PublicMemberProfileTabs
                member={member}
                fullName={fullName}
                certificateUrl={certificateUrl}
                publicDocuments={publicDocuments}
                overviewSummary={overviewSummary}
                recentActivities={recentActivities}
                aboutEssay={aboutEssay}
                mapEmbedUrl={mapEmbedUrl}
                analyticsBarData={analyticsBarData}
                analyticsPieData={analyticsPieData}
              />
            </div>
          </div>

          <PublicMemberProfileSidebar
            member={member}
            fullName={fullName}
            churchMapEmbedUrl={churchMapEmbedUrl}
          />
        </div>
      </Tabs>
    </div>
  );
}
