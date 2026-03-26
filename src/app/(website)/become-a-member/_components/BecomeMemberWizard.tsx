"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";
import { MembershipApplicationForm } from "@/shared/membership-application/MembershipApplicationForm";
import type { ApplicationFormState } from "@/shared/membership-application/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  toApiError,
  useApplyMemberMutation,
} from "@/features/member/member.hooks";
import type { ApplyMemberRequest } from "@/features/member/member.types";
import { getBarangays } from "@/constants/barangay";
import { getMunicipalities } from "@/constants/municipality";
import { getProvinces } from "@/constants/province";
import { getRegions } from "@/constants/region";
import { clearDraft } from "./draftStorage";

const CIVIL_STATUS_MAP: Record<
  Exclude<ApplicationFormState["civilStatus"], "">,
  ApplyMemberRequest["civilStatus"]
> = {
  Single: "SINGLE",
  Married: "MARRIED",
  Widowed: "WIDOWED",
  Separated: "SEPARATED",
};

const GENDER_MAP: Record<
  Exclude<ApplicationFormState["gender"], "">,
  ApplyMemberRequest["gender"]
> = {
  Male: "MALE",
  Female: "FEMALE",
};

const getFirstNonEmpty = (...values: Array<string | undefined>): string | null => {
  for (const value of values) {
    const normalized = value?.trim();
    if (normalized) return normalized;
  }
  return null;
};

const splitRegionSummary = (
  summary: string,
): {
  region: string;
  province: string;
  municipalityCity: string;
  barangay: string;
} | null => {
  const parts = summary
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 4) return null;

  const [barangayLabel, municipalityCity, province, region] = parts;

  return {
    region,
    province,
    municipalityCity,
    barangay: barangayLabel.replace(/^Barangay\s+/i, "").trim(),
  };
};

const joinList = (values: string[]): string | undefined => {
  const cleaned = values.map((value) => value.trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned.join(" | ") : undefined;
};

const getMiddleInitial = (value: string): string | undefined => {
  const normalized = value.trim();
  return normalized ? normalized.charAt(0).toUpperCase() : undefined;
};

const mapFormToApplyPayload = (
  form: ApplicationFormState,
): ApplyMemberRequest | null => {
  const location = splitRegionSummary(form.regionProvince);

  if (!form.firstName.trim() || !form.lastName.trim()) return null;
  if (!form.emailAddress.trim()) return null;
  if (!form.gender || !form.birthday) return null;

  const currentPositionRole = getFirstNonEmpty(form.position, form.positionOthers) ?? undefined;

  const ministerialExperiences = form.ministerialWorkExperience
    .map((experience) => ({
      roleDescription: [
        experience.rolePosition.trim(),
        experience.institution.trim(),
      ]
        .filter(Boolean)
        .join(" - "),
      yearsApprox: experience.years.trim(),
    }))
    .filter(
      (experience) =>
        experience.roleDescription.length > 0 && experience.yearsApprox.length > 0,
    );

  const characterReferences = form.characterReferences
    .map((reference) => ({
      name: reference.name.trim(),
      positionRelationship: reference.position.trim(),
      contactNumber: reference.contactNumber.trim(),
    }))
    .filter(
      (reference) =>
        reference.name.length > 0 &&
        reference.positionRelationship.length > 0 &&
        reference.contactNumber.length > 0,
    );

  return {
    firstName: form.firstName.trim(),
    middleInitial: getMiddleInitial(form.middleInitial),
    email: form.emailAddress.trim() || undefined,
    lastName: form.lastName.trim(),
    extensionName: form.extensionName.trim() || undefined,
    mobilePhoneNumber: form.phoneNumber.trim() || undefined,
    homeAddress: form.address.trim() || undefined,
    civilStatus: form.civilStatus ? CIVIL_STATUS_MAP[form.civilStatus] : undefined,
    gender: GENDER_MAP[form.gender],
    nationality: form.nationality.trim() || undefined,
    dateOfBirth: new Date(form.birthday).toISOString(),
    region: location?.region || undefined,
    province: location?.province || undefined,
    municipalityCity: location?.municipalityCity || undefined,
    barangay: location?.barangay || undefined,
    emergencyContactName: form.emergencyName.trim() || undefined,
    emergencyContactMobile: form.emergencyCellphone.trim() || undefined,
    churchAffiliation: form.churchOrganizationAffiliation.trim() || undefined,
    churchAddress: form.churchAddress.trim() || undefined,
    currentPositionRole,
    currentPositionRoleOther: form.positionOthers.trim() || undefined,
    height: form.height.trim() || undefined,
    weight: form.weight.trim() || undefined,
    bloodType: form.bloodType.trim() || undefined,
    colorOfEyes: form.colorOfEyes.trim() || undefined,
    colorOfSkin: form.colorOfSkin.trim() || undefined,
    sssNumber: form.sssNumber.trim() || undefined,
    tinNumber: form.tinNumber.trim() || undefined,
    skillsTalents: form.skillsTalents.trim() || undefined,
    preferredBranchOther:
      getFirstNonEmpty(form.branchOfService.join(", "), form.branchOfServiceOthers) ??
      undefined,
    elementarySchool: form.elementarySchool.trim() || undefined,
    secondarySchool: form.secondarySchool.trim() || undefined,
    tertiaryCollege: joinList(form.tertiarySchool),
    postGraduateStudies: joinList(form.postGraduateStudies),
    ministerialExperiences:
      ministerialExperiences.length > 0 ? ministerialExperiences : undefined,
    characterReferences:
      characterReferences.length > 0 ? characterReferences : undefined,
    signature: form.signatureUrl.trim()
      ? {
          type: "DRAWN",
          signatureData: form.signatureUrl.trim(),
        }
      : undefined,
  };
};

export function BecomeMemberWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const applyMemberMutation = useApplyMemberMutation();

  const handleSubmit = async (form: ApplicationFormState) => {
    const payload = mapFormToApplyPayload(form);

    if (!payload) {
      throw new Error(
        "Please complete the required personal details before submitting your application.",
      );
    }

    try {
      await applyMemberMutation.mutateAsync(payload);
      clearDraft();
      toast({
        title: "Application submitted",
        description: "Your membership application was submitted successfully.",
        variant: "success",
      });
      router.push("/become-a-member/success");
    } catch (error) {
      const apiError = toApiError(error);
      const message =
        apiError.message ??
        (error instanceof Error ? error.message : "Submission failed.");

      toast({
        title: "Submission failed",
        description: message,
        variant: "error",
      });
      throw new Error(message);
    }
  };

  return (
    <section className="bg-neutral-300 py-8 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 border border-black/10 bg-white px-5 py-5 sm:px-8 sm:py-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <Image
              src="/main/logo.png"
              alt="Pearl of the Orient logo"
              width={100}
              height={100}
              className="size-16 sm:size-20"
              priority
            />
            <div>
              <h1 className="font-serif text-xl text-neutral-900 sm:text-3xl">
                Chaplaincy Ministries
              </h1>
              <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
                Pearl of the Orient International Auxiliary Chaplain Values
                Educators Inc.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              className="mb-4 ml-auto border-[#032a0d]/30 text-[#032a0d] hover:bg-[#032a0d]/5"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
          </div>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
          <MembershipApplicationForm
            storageKey="pearl-member-application-draft"
            locationCatalog={{
              getRegions,
              getProvinces,
              getMunicipalities,
              getBarangays,
            }}
            onSubmitAction={handleSubmit}
          />

          <aside className="self-start lg:sticky lg:top-6">
            <div className="overflow-hidden border border-black/10 bg-white">
              <div className="bg-[#032a0d] px-5 py-4 text-white">
                <h2 className="text-lg">Description</h2>
              </div>
              <div className="space-y-5 p-5 text-sm text-neutral-700">
                <p>
                  Please fill out this form and click submit. If you have
                  questions, contact the leadership through the official Pearl
                  of the Orient channels.
                </p>

                <div className="space-y-3">
                  <h3 className="font-serif text-base text-[#032a0d]">
                    How the application works
                  </h3>
                  <ol className="space-y-2 text-xs sm:text-sm">
                    <li>
                      <span className="font-semibold text-[#032a0d]">
                        1. Personal details
                      </span>{" "}
                      Basic contact information and civil status.
                    </li>
                    <li>
                      <span className="font-semibold text-[#032a0d]">
                        2. Church and background
                      </span>{" "}
                      Current role, affiliation, and service areas.
                    </li>
                    <li>
                      <span className="font-semibold text-[#032a0d]">
                        3. Education and ministry
                      </span>{" "}
                      Formation, skills, and ministry experience.
                    </li>
                    <li>
                      <span className="font-semibold text-[#032a0d]">
                        4. References and confirmation
                      </span>{" "}
                      Character references and signature before submission.
                    </li>
                  </ol>
                </div>
                <div className="flex gap-2 rounded border border-dashed border-[#032a0d]/25 bg-[#032a0d]/5 px-3 py-3 text-xs text-[#032a0d]/80">
                  <Info className="mt-0.5 size-4 shrink-0 text-[#032a0d]" />
                  <p>
                    Your progress is automatically saved as a draft while you
                    fill out the form.
                  </p>
                </div>
                <div className="flex gap-2 rounded border border-dashed border-[#032a0d]/25 bg-[#032a0d]/5 px-3 py-3 text-xs text-[#032a0d]/80">
                  <Info className="size-4 shrink-0 text-[#032a0d]" />
                  <p>
                    Fields marked with an asterisk (
                    <span className="text-destructive">*</span>) are required.
                  </p>
                </div>
                <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                  Submission is connected to the backend. Ensure all required
                  fields are complete before submitting.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
