"use client";

import { BadgeCheck, Building2, MapPinned, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate, formatEnumLabel, type PublicMember } from "./public-member-profile.shared";

type Props = {
  member: PublicMember;
  fullName: string;
  churchMapEmbedUrl: string;
};

export function PublicMemberProfileSidebar({
  member,
  fullName,
  churchMapEmbedUrl,
}: Props) {
  const currentRole =
    member.currentPositionRoleOther ??
    member.currentPositionRole ??
    "Not publicly listed";

  return (
    <div className="space-y-6 lg:col-span-3">
      <div className="w-full max-w-md overflow-hidden border border-green-800/20 bg-linear-to-br from-[#032a0d] via-[#043612] to-[#021d09] shadow-2xl">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-green-200/80">
                Official Member Profile
              </p>
              <h3 className="text-lg font-semibold tracking-tight text-white">
                Public Verification
              </h3>
            </div>
            <ShieldCheck className="size-5 text-green-300" />
          </div>

          <div className="mt-5 border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
            <p className="text-sm text-green-50/90">
              This page shows the member&apos;s currently published profile,
              visible status, service information, and approved public records.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge className="bg-green-500/15 text-green-100 hover:bg-green-500/15">
                <BadgeCheck className="mr-1 size-3.5" />
                {member.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge className="bg-green-500/15 text-green-100 hover:bg-green-500/15">
                {formatEnumLabel(member.status)}
              </Badge>
              <Badge className="bg-green-500/15 text-green-100 hover:bg-green-500/15">
                {member.user.isEmailVerified ? "Email verified" : "Email pending"}
              </Badge>
            </div>
          </div>

          <div className="mt-5 grid gap-3 text-sm text-green-50/90 sm:grid-cols-2">
            <div className="border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase text-green-200/75">
                Member ID
              </p>
              <p className="mt-2 font-semibold">{member.uniqueId || "N/A"}</p>
            </div>
            <div className="border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase text-green-200/75">
                Badge number
              </p>
              <p className="mt-2 font-semibold">{member.badgeNumber || "N/A"}</p>
            </div>
            <div className="border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase text-green-200/75">
                Member type
              </p>
              <p className="mt-2 font-semibold">
                {formatEnumLabel(member.memberType)}
              </p>
            </div>
            <div className="border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase text-green-200/75">
                Application date
              </p>
              <p className="mt-2 font-semibold">{formatDate(member.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border bg-white p-4 text-neutral-900 shadow-sm">
        <h4 className="text-lg font-semibold">Church/organization affiliation</h4>
        <div className="mt-5 space-y-4">
          <div>
            <p className="text-base font-medium">
              {member.churchAffiliation || fullName}
            </p>
            <p className="text-sm text-muted-foreground">{currentRole}</p>
          </div>

          <div className="rounded-lg border bg-neutral-50 p-4">
            <p className="text-xs uppercase text-neutral-500">
              Church / organization address
            </p>
            <p className="mt-2 text-sm text-neutral-700">
              {member.churchAddress || "No public church address listed yet."}
            </p>
            {member.churchAddress ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-[#032a0d] text-[#032a0d]"
                  >
                    <MapPinned className="size-4" />
                    View in map
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-0">
                  <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle>Church / organization location</DialogTitle>
                    <DialogDescription>
                      {member.churchAffiliation || fullName}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="px-6 pb-6">
                    <div className="mt-4 rounded-lg border bg-neutral-50 p-4">
                      <p className="text-sm text-neutral-700">
                        {member.churchAddress}
                      </p>
                    </div>
                    <div className="mt-4 h-105 overflow-hidden rounded-lg border">
                      <iframe
                        src={churchMapEmbedUrl}
                        title="Church address map"
                        className="h-full w-full"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border bg-white p-4 text-neutral-900 shadow-sm">
        <h4 className="text-lg font-semibold">Education attainment</h4>
        <div className="mt-5 space-y-4">
          <div>
            <p className="text-base font-semibold">Elementary School</p>
            <p className="text-sm text-muted-foreground">
              {member.elementarySchool || "Not publicly listed"}
            </p>
          </div>
          <div>
            <p className="text-base font-semibold">Secondary School</p>
            <p className="text-sm text-muted-foreground">
              {member.secondarySchool || "Not publicly listed"}
            </p>
          </div>
          <div>
            <p className="text-base font-semibold">Tertiary / College</p>
            <p className="text-sm text-muted-foreground">
              {member.tertiaryCollege || "Not publicly listed"}
            </p>
          </div>
          <div>
            <p className="text-base font-semibold">Post-graduate Studies</p>
            <p className="text-sm text-muted-foreground">
              {member.postGraduateStudies || "Not publicly listed"}
            </p>
          </div>
        </div>
      </div>

      <div className="border bg-white p-4 text-neutral-900 shadow-sm">
        <h4 className="text-lg font-semibold">Service profile</h4>
        <div className="mt-5 space-y-4">
          <div>
            <p className="text-base font-semibold">Current role</p>
            <p className="text-sm text-muted-foreground">{currentRole}</p>
          </div>
          <div>
            <p className="text-base font-semibold">Preferred branches</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {member.preferredBranches.length > 0 ? (
                member.preferredBranches.map((branch) => (
                  <Badge key={branch.id} variant="outline">
                    <Building2 className="mr-1 size-3.5" />
                    {branch.title}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No public branch assignment listed yet.
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="text-base font-semibold">Office assignments</p>
            <p className="text-sm text-muted-foreground">
              {member.officerAssignments.length > 0
                ? `${member.officerAssignments.length} active office assignment${member.officerAssignments.length > 1 ? "s" : ""} recorded.`
                : "No active office assignment recorded publicly."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
