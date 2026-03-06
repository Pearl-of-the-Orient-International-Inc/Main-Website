"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  toApiError,
  useApplyMemberMutation,
} from "@/features/member/member.hooks";
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";
import type { ApplyMemberRequest } from "@/features/member/member.types";

import { loadDraft, saveDraft } from "./draftStorage";
import type { ApplicationFormState, StepIndex } from "./types";
import { computeAgeFromBirthday } from "./utils";
import { StepPersonalDetails } from "./steps/StepPersonalDetails";
import { StepChurchBackground } from "./steps/StepChurchBackground";
import { StepEducationMinistry } from "./steps/StepEducationMinistry";
import { StepReferencesReview } from "./steps/StepReferencesReview";

const DRAFT_SAVE_DEBOUNCE_MS = 500;
const DRAFT_STEP: StepIndex = 3;

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

  return {
    region: parts[0],
    province: parts[1],
    municipalityCity: parts[2],
    barangay: parts[3],
  };
};

const joinList = (values: string[]): string | undefined => {
  const cleaned = values.map((value) => value.trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned.join(" | ") : undefined;
};

const splitName = (fullName?: string): { firstName: string; lastName: string } => {
  const normalized = fullName?.trim() ?? "";
  if (!normalized) {
    return { firstName: "", lastName: "" };
  }

  const parts = normalized.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
};

const mapFormToApplyPayload = (
  form: ApplicationFormState,
): ApplyMemberRequest | null => {
  const location = splitRegionSummary(form.regionProvince);
  if (!location) return null;

  if (!form.civilStatus || !form.gender) return null;

  const currentPositionRole = getFirstNonEmpty(form.position, form.positionOthers);
  if (!currentPositionRole) return null;

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
      (experience) => experience.roleDescription.length > 0 && experience.yearsApprox.length > 0,
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
    lastName: form.lastName.trim(),
    mobilePhoneNumber: form.phoneNumber.trim(),
    homeAddress: form.address.trim(),
    civilStatus: CIVIL_STATUS_MAP[form.civilStatus],
    gender: GENDER_MAP[form.gender],
    nationality: form.nationality.trim(),
    dateOfBirth: new Date(form.birthday).toISOString(),
    region: location.region,
    province: location.province,
    municipalityCity: location.municipalityCity,
    barangay: location.barangay,
    emergencyContactName: form.emergencyName.trim(),
    emergencyContactMobile: form.emergencyCellphone.trim(),
    churchAffiliation: form.churchOrganizationAffiliation.trim(),
    churchAddress: form.churchAddress.trim(),
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
    preferredBranchOther: getFirstNonEmpty(
      form.branchOfService.join(", "),
      form.branchOfServiceOthers,
    ) ?? undefined,
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
  const { data: currentUser } = useCurrentUserQuery();

  const [form, setForm] = useState<ApplicationFormState>(
    () => loadDraft().form,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const computedAge = computeAgeFromBirthday(form.birthday);
    if (form.age === computedAge) return;
    setForm((prev) => ({ ...prev, age: computedAge }));
  }, [form.birthday, form.age]);

  useEffect(() => {
    if (!currentUser) return;

    const { firstName, lastName } = splitName(currentUser.name);

    setForm((prev) => {
      const next = { ...prev };
      let hasChanges = false;

      if (!prev.firstName.trim() && firstName) {
        next.firstName = firstName;
        hasChanges = true;
      }

      if (!prev.lastName.trim() && lastName) {
        next.lastName = lastName;
        hasChanges = true;
      }

      if (!prev.emailAddress.trim() && currentUser.email?.trim()) {
        next.emailAddress = currentUser.email.trim();
        hasChanges = true;
      }

      if (!prev.photoUrl.trim() && currentUser.avatar?.trim()) {
        next.photoUrl = currentUser.avatar.trim();
        hasChanges = true;
      }

      return hasChanges ? next : prev;
    });
  }, [currentUser]);

  useEffect(() => {
    const id = setTimeout(
      () => saveDraft(form, DRAFT_STEP),
      DRAFT_SAVE_DEBOUNCE_MS,
    );
    return () => clearTimeout(id);
  }, [form]);

  const updateField = <K extends keyof ApplicationFormState>(
    key: K,
    value: ApplicationFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignatureChange = (signature: string | null) => {
    updateField("signatureUrl", signature ?? "");
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!form.declarationTruthConfirmed || !form.monthlyPledgeConfirmed) {
      setSubmitError(
        "Please confirm both declaration checkboxes before submitting.",
      );
      return;
    }

    const payload = mapFormToApplyPayload(form);

    if (!payload) {
      setSubmitError(
        "Please complete all required fields, including full location and valid personal details.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      saveDraft(form, DRAFT_STEP);
      await applyMemberMutation.mutateAsync(payload);
      setSubmitSuccess(true);
      toast({
        title: "Application submitted",
        description: "Your membership application was submitted successfully.",
        variant: "success",
      });
      router.push("/become-a-member/onboarding");
    } catch (err) {
      const apiError = toApiError(err);
      const message =
        apiError.message ??
        (err instanceof Error ? err.message : "Submission failed.");
      setSubmitError(message);
      toast({
        title: "Submission failed",
        description: message,
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
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
              className="mb-4 border-[#032a0d]/30 ml-auto text-[#032a0d] hover:bg-[#032a0d]/5"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
          </div>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="overflow-hidden border border-black/10 bg-white">
            <div className="bg-[#032a0d] px-5 py-4 text-white">
              <h2 className="text-lg">Application Form</h2>
            </div>

            <form
              className="space-y-8 p-5 sm:p-6"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
            >
              <section className="space-y-4">
                <h3 className="font-serif text-xl text-[#032a0d]">
                  Contact Information
                </h3>
                <div className="h-px bg-black/10" />
                <StepPersonalDetails
                  form={form}
                  updateFieldAction={updateField}
                />
              </section>

              <section className="space-y-4">
                <h3 className="font-serif text-xl text-[#032a0d]">
                  Church Background
                </h3>
                <div className="h-px bg-black/10" />
                <StepChurchBackground
                  form={form}
                  updateFieldAction={updateField}
                />
              </section>

              <section className="space-y-4">
                <h3 className="font-serif text-xl text-[#032a0d]">
                  Education and Ministry
                </h3>
                <div className="h-px bg-black/10" />
                <StepEducationMinistry
                  form={form}
                  updateFieldAction={updateField}
                />
              </section>

              <section className="space-y-4">
                <h3 className="font-serif text-xl text-[#032a0d]">
                  References and Confirmation
                </h3>
                <div className="h-px bg-black/10" />
                <StepReferencesReview
                  form={form}
                  updateFieldAction={updateField}
                  handleSignatureChangeAction={handleSignatureChange}
                />
              </section>

              {submitError && (
                <p className="text-sm text-red-600" role="alert">
                  {submitError}
                </p>
              )}
              {submitSuccess && (
                <p className="text-sm text-emerald-700" role="status">
                  Application submitted successfully. Your status is now under
                  review.
                </p>
              )}

              <div className="flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-neutral-500 sm:text-sm">
                  Your draft is auto-saved while filling out this form.
                </p>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#032a0d] hover:bg-[#032a0d]/90"
                >
                  {isSubmitting ? "Submitting..." : "Submit application"}
                </Button>
              </div>
            </form>
          </div>

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
                    Fields marked with an asterisk (<span className='text-destructive'>*</span>) are required.
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
