"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MapPin, GraduationCap, User, Users, Briefcase } from "lucide-react";
import { loadDraft } from "../../become-a-member/_components/draftStorage";
import { loadOnboardingMeta } from "../../become-a-member/_components/onboarding/storage";
import type { FrontendOnboardingApplication } from "../../become-a-member/_components/onboarding/types";

function formatPosition(profile: {
  position?: string;
  positionOthers?: string;
}): string {
  if (!profile.position) return "";
  if (profile.position === "Others" && profile.positionOthers?.trim()) {
    return profile.positionOthers!.trim();
  }
  return profile.position;
}

function formatLocation(profile: {
  regionProvince: string;
  churchAddress?: string;
  address: string;
}): string {
  const parts = [
    profile.regionProvince,
    profile.churchAddress || profile.address,
  ].filter(Boolean);
  return parts.join(", ") || profile.address || "";
}

function hasEducationEntries(entries: string[]): boolean {
  return entries.some((entry) => entry.trim().length > 0);
}

export default function MemberProfilePage() {
  const params = useParams();
  const uniqueIdParam = params.uniqueId;
  const uniqueId =
    typeof uniqueIdParam === "string" ? uniqueIdParam : uniqueIdParam?.[0] ?? "";
  const [profile, setProfile] = useState<FrontendOnboardingApplication | null | undefined>(
    undefined,
  );

  useEffect(() => {
    const { form } = loadDraft();
    const onboardingMeta = loadOnboardingMeta();
    const id = window.setTimeout(() => {
      if (!onboardingMeta || onboardingMeta.uniqueId !== uniqueId) {
        setProfile(null);
        return;
      }
      setProfile({ ...form, ...onboardingMeta });
    }, 0);
    return () => window.clearTimeout(id);
  }, [uniqueId]);

  if (profile === undefined) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-[#032a0d]/70">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#032a0d]/80">Member not found.</p>
        <Link
          href="/"
          className="text-sm text-[#032a0d] underline hover:no-underline"
        >
          Go to home
        </Link>
      </div>
    );
  }

  const positionText = formatPosition(profile);
  const locationText = formatLocation(profile);

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-[#032a0d]/10 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-[#032a0d]/80 hover:text-[#032a0d]"
          >
            Pearl of the Orient
          </Link>
          <span className="text-xs text-[#032a0d]/60">Member profile</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10 space-y-6">
        <div className="rounded-2xl border border-[#032a0d]/20 bg-white shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-start gap-4 min-w-0">
              <div className="flex items-start gap-4">
                <div className="shrink-0 size-20 sm:size-24 rounded-full overflow-hidden border-2 border-[#032a0d]/20 bg-neutral-100">
                  {profile.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#032a0d]/40 text-2xl font-serif">
                      {profile.firstName?.charAt(0)}
                      {profile.lastName?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="font-serif text-lg sm:text-xl font-semibold text-[#032a0d]">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  {positionText && (
                    <p className="text-sm text-[#032a0d]/80 mt-0.5">
                      {positionText}
                      {profile.churchOrganizationAffiliation && (
                        <span className="text-[#032a0d]/70">
                          {" "}
                          at {profile.churchOrganizationAffiliation}
                        </span>
                      )}
                    </p>
                  )}
                  {locationText && (
                    <p className="flex items-center gap-1.5 text-xs text-[#032a0d]/70 mt-2">
                      <MapPin className="size-3.5 shrink-0" />
                      <span>{locationText}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-4 shrink-0 border-t sm:border-t-0 sm:border-l border-[#032a0d]/10 pt-4 sm:pt-0 sm:pl-6">
              <div className="rounded-lg border border-[#032a0d]/20 bg-[#032a0d]/5 px-4 py-3 text-center">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-[#032a0d]/70">
                  Member ID
                </p>
                <p className="font-serif text-lg sm:text-xl font-semibold text-[#032a0d] mt-0.5">
                  {profile.uniqueId}
                </p>
              </div>
              <p className="text-[10px] text-[#032a0d]/50 text-center sm:text-right">
                Pearl of the Orient International
                <br />
                Auxiliary Chaplain Values Educators Inc.
              </p>
            </div>
          </div>
        </div>

        {/* Ministry profile details */}
        {(profile.churchOrganizationAffiliation ||
          profile.churchAddress ||
          profile.branchOfService ||
          profile.skillsTalents) && (
          <div className="rounded-2xl border border-[#032a0d]/15 bg-white shadow-sm p-5 sm:p-6 space-y-4">
            <h2 className="font-serif text-base sm:text-lg text-[#032a0d]">
              Ministry profile
            </h2>
            <div className="space-y-3 text-sm text-[#032a0d]/80">
              {profile.churchOrganizationAffiliation && (
                <p>
                  <span className="font-semibold">Organization:</span>{" "}
                  {profile.churchOrganizationAffiliation}
                </p>
              )}
              {profile.churchAddress && (
                <p>
                  <span className="font-semibold">Local church address:</span>{" "}
                  {profile.churchAddress}
                </p>
              )}
              {profile.branchOfService && profile.branchOfService.length > 0 && (
                <div>
                  <p className="font-semibold mb-1">Branches of service:</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.branchOfService.map((branch) => (
                      <span
                        key={branch}
                        className="inline-flex items-center rounded-full border border-[#032a0d]/20 bg-[#032a0d]/5 px-2.5 py-0.5 text-[11px] text-[#032a0d]/80"
                      >
                        {branch}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.skillsTalents && (
                <p>
                  <span className="font-semibold">Skills &amp; talents:</span>{" "}
                  {profile.skillsTalents}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Education */}
        {(profile.elementarySchool ||
          profile.secondarySchool ||
          hasEducationEntries(profile.tertiarySchool) ||
          hasEducationEntries(profile.postGraduateStudies)) && (
          <div className="rounded-2xl border border-[#032a0d]/15 bg-white shadow-sm p-5 sm:p-6 space-y-4">
            <h2 className="font-serif text-base sm:text-lg text-[#032a0d] flex items-center gap-2">
              <GraduationCap className="size-5 shrink-0" />
              Education
            </h2>
            <ul className="space-y-2 text-sm text-[#032a0d]/80">
              {profile.elementarySchool && (
                <li>
                  <span className="font-semibold">Elementary:</span>{" "}
                  {profile.elementarySchool}
                </li>
              )}
              {profile.secondarySchool && (
                <li>
                  <span className="font-semibold">Secondary:</span>{" "}
                  {profile.secondarySchool}
                </li>
              )}
              {hasEducationEntries(profile.tertiarySchool) && (
                <li>
                  <span className="font-semibold">Tertiary:</span>
                  <ul className="ml-4 mt-1 list-disc space-y-1">
                    {profile.tertiarySchool
                      .map((entry) => entry.trim())
                      .filter(Boolean)
                      .map((entry, index) => (
                        <li key={`tertiary-${index}`}>{entry}</li>
                      ))}
                  </ul>
                </li>
              )}
              {hasEducationEntries(profile.postGraduateStudies) && (
                <li>
                  <span className="font-semibold">Post-graduate:</span>
                  <ul className="ml-4 mt-1 list-disc space-y-1">
                    {profile.postGraduateStudies
                      .map((entry) => entry.trim())
                      .filter(Boolean)
                      .map((entry, index) => (
                        <li key={`postgrad-${index}`}>{entry}</li>
                      ))}
                  </ul>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Physical / identification */}
        {(profile.bloodType ||
          profile.height ||
          profile.weight ||
          profile.colorOfEyes ||
          profile.colorOfSkin) && (
          <div className="rounded-2xl border border-[#032a0d]/15 bg-white shadow-sm p-5 sm:p-6 space-y-4">
            <h2 className="font-serif text-base sm:text-lg text-[#032a0d] flex items-center gap-2">
              <User className="size-5 shrink-0" />
              Physical identification
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#032a0d]/80">
              {profile.bloodType && (
                <p>
                  <span className="font-semibold">Blood type:</span>{" "}
                  {profile.bloodType}
                </p>
              )}
              {profile.height && (
                <p>
                  <span className="font-semibold">Height:</span> {profile.height}
                </p>
              )}
              {profile.weight && (
                <p>
                  <span className="font-semibold">Weight:</span> {profile.weight}
                </p>
              )}
              {profile.colorOfEyes && (
                <p>
                  <span className="font-semibold">Eyes:</span>{" "}
                  {profile.colorOfEyes}
                </p>
              )}
              {profile.colorOfSkin && (
                <p>
                  <span className="font-semibold">Skin:</span>{" "}
                  {profile.colorOfSkin}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Character references */}
        {profile.characterReferences &&
          profile.characterReferences.length > 0 && (
            <div className="rounded-2xl border border-[#032a0d]/15 bg-white shadow-sm p-5 sm:p-6 space-y-4">
              <h2 className="font-serif text-base sm:text-lg text-[#032a0d] flex items-center gap-2">
                <Users className="size-5 shrink-0" />
                Character references
              </h2>
              <ul className="space-y-3 text-sm text-[#032a0d]/80">
                {profile.characterReferences
                  .filter(
                    (ref) =>
                      ref.name?.trim() ||
                      ref.position?.trim() ||
                      ref.contactNumber?.trim(),
                  )
                  .map((ref, i) => (
                    <li
                      key={i}
                      className="flex flex-col gap-0.5 py-2 border-b border-[#032a0d]/10 last:border-0"
                    >
                      <span className="font-semibold">{ref.name}</span>
                      {ref.position && (
                        <span className="text-[#032a0d]/70">{ref.position}</span>
                      )}
                      {ref.contactNumber && (
                        <a
                          href={`tel:${ref.contactNumber}`}
                          className="text-[#032a0d] underline hover:no-underline"
                        >
                          {ref.contactNumber}
                        </a>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          )}

        {/* Ministry work experience */}
        {profile.ministerialWorkExperience &&
          profile.ministerialWorkExperience.length > 0 && (
            <div className="rounded-2xl border border-[#032a0d]/15 bg-white shadow-sm p-5 sm:p-6 space-y-4">
              <h2 className="font-serif text-base sm:text-lg text-[#032a0d] flex items-center gap-2">
                <Briefcase className="size-5 shrink-0" />
                Ministry work experience
              </h2>
              <ul className="space-y-3 text-sm text-[#032a0d]/80">
                {profile.ministerialWorkExperience
                  .filter(
                    (e) =>
                      e.rolePosition?.trim() ||
                      e.institution?.trim() ||
                      e.years?.trim(),
                  )
                  .map((exp, i) => (
                    <li
                      key={i}
                      className="py-2 border-b border-[#032a0d]/10 last:border-0"
                    >
                      <p className="font-semibold">{exp.rolePosition}</p>
                      {exp.institution && (
                        <p className="text-[#032a0d]/70">{exp.institution}</p>
                      )}
                      {exp.years && (
                        <p className="text-[#032a0d]/70 text-xs mt-0.5">
                          {exp.years}
                        </p>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          )}
      </main>
    </div>
  );
}


