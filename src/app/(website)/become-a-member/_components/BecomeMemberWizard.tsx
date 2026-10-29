"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { isValidPhoneNumber } from "libphonenumber-js/max";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Info,
  MailCheck,
  ShieldCheck,
} from "lucide-react";
import { MembershipApplicationForm } from "@/shared/membership-application/MembershipApplicationForm";
import type {
  ApplicationFieldErrors,
  ApplicationFormState,
} from "@/shared/membership-application/types";
import { Button } from "@/components/ui/button";
import {
  toApiError,
  useApplyMemberMutation,
  usePublicReferralQuery,
} from "@/features/member/member.hooks";
import { useOptionalCurrentUserQuery } from "@/features/auth/auth.hooks";
import type { ApplyMemberRequest } from "@/features/member/member.types";
import { getBarangays } from "@/constants/barangay";
import { getMunicipalities } from "@/constants/municipality";
import { getProvinces } from "@/constants/province";
import { getRegions } from "@/constants/region";
import { toast } from "@/hooks/use-toast";
import type { UserPublic } from "@/lib/api-types";

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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

const getExistingApplicationContent = (currentUser: UserPublic) => {
  const status = currentUser.memberProfile?.status;
  const isEmailVerified = currentUser.isEmailVerified === true;

  if (status === "APPROVED") {
    return {
      badgeLabel: "Application Approved",
      badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-900",
      icon: CheckCircle2,
      title: "Your membership application is already approved.",
      description: isEmailVerified
        ? "You already have an approved application in the system. You can continue with the onboarding flow using your existing account."
        : "Your application is already approved. Please verify your email first so you can continue the onboarding flow with your existing account.",
      steps: isEmailVerified
        ? [
            "Continue to the onboarding flow to complete the remaining requirements.",
            "Use your existing account when accessing your member onboarding pages.",
            "Keep your contact details active for further updates.",
          ]
        : [
            "Check your email and open the verification link that was sent to your account.",
            "After verifying your email, continue to the onboarding flow.",
            "Keep your contact details active for further updates.",
          ],
      primaryActionHref: isEmailVerified ? "/become-a-member/onboarding" : "/become-a-member/success",
      primaryActionLabel: isEmailVerified
        ? "Continue onboarding"
        : "View application notice",
      secondaryActionHref: "/",
      secondaryActionLabel: "Back to home",
      nextActionLabel: isEmailVerified
        ? "Next action: Continue your onboarding requirements."
        : "Next action: Use the verification link from your email, then continue onboarding.",
    };
  }

  if (status === "REJECTED") {
    return {
      badgeLabel: "Application Recorded",
      badgeClassName: "border-amber-200 bg-amber-50 text-amber-900",
      icon: FileText,
      title: "You already have a membership application on record.",
      description:
        "Your existing application is currently marked as not approved, so a new form submission is not available here. Please coordinate with the admin team before making any further changes.",
      steps: [
        "Check with the admin team for the status of your existing application.",
        "Use your current account email for any follow-up communication.",
        "Wait for further instructions before attempting a new application.",
      ],
      primaryActionHref: "/",
      primaryActionLabel: "Back to home",
      secondaryActionHref: "/become-a-member/success",
      secondaryActionLabel: "View application notice",
      nextActionLabel:
        "Next action: Contact the admin team regarding your existing application record.",
    };
  }

  return {
    badgeLabel: "Application Pending",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-900",
    icon: Clock3,
    title: "You already have a membership application under review.",
    description: isEmailVerified
      ? "Your application is already in the system and is currently pending admin review. The form is hidden here to avoid duplicate submissions."
      : "Your application is already in the system and is currently pending admin review. Please verify your email if you have not done so yet, then wait for the admin team’s decision.",
      steps: isEmailVerified
      ? [
          "Wait for the admin team to finish reviewing your application.",
          "Once approved, you will be able to continue to onboarding.",
          "Keep your email and phone number active for updates.",
        ]
      : [
          "Check your email and use the verification link if your account is still not verified.",
          "Wait for the admin team to finish reviewing your application.",
          "Once approved, you will be able to continue to onboarding.",
        ],
    primaryActionHref: "/become-a-member/success",
    primaryActionLabel: "View application notice",
    secondaryActionHref: "/",
    secondaryActionLabel: "Back to home",
    nextActionLabel: isEmailVerified
      ? "Next action: Wait for admin approval."
      : "Next action: Use the verification link from your email, then wait for admin approval.",
  };
};

class MembershipFormValidationError extends Error {
  fieldErrors: ApplicationFieldErrors;

  constructor(message: string, fieldErrors: ApplicationFieldErrors) {
    super(message);
    this.name = "MembershipFormValidationError";
    this.fieldErrors = fieldErrors;
  }
}

const API_FIELD_TO_FORM_FIELD: Record<string, keyof ApplicationFormState> = {
  email: "emailAddress",
  firstName: "firstName",
  middleInitial: "middleInitial",
  lastName: "lastName",
  extensionName: "extensionName",
  mobilePhoneNumber: "phoneNumber",
  homeAddress: "address",
  civilStatus: "civilStatus",
  gender: "gender",
  nationality: "nationality",
  dateOfBirth: "birthday",
  region: "regionProvince",
  province: "regionProvince",
  municipalityCity: "regionProvince",
  barangay: "regionProvince",
  emergencyContactName: "emergencyName",
  emergencyContactMobile: "emergencyCellphone",
  churchAffiliation: "churchOrganizationAffiliation",
  churchAddress: "churchAddress",
  currentPositionRole: "position",
  currentPositionRoleOther: "positionOthers",
  elementarySchool: "elementarySchool",
  secondarySchool: "secondarySchool",
  tertiaryCollege: "tertiarySchool",
  postGraduateStudies: "postGraduateStudies",
  ministerialExperiences: "ministerialWorkExperience",
  characterReferences: "characterReferences",
  signature: "signatureUrl",
};

const getApiValidationError = (
  errors: Array<{ path: string; message: string }> | undefined,
): MembershipFormValidationError | null => {
  if (!errors?.length) return null;

  const fieldErrors: ApplicationFieldErrors = {};
  const descriptions: string[] = [];

  for (const issue of errors) {
    const apiField = issue.path.split(".")[0];
    const formField = API_FIELD_TO_FORM_FIELD[apiField];
    const label = apiField.replace(/([A-Z])/g, " $1").trim();

    if (formField && !fieldErrors[formField]) {
      fieldErrors[formField] = issue.message;
    }

    descriptions.push(`${label}: ${issue.message}`);
  }

  return new MembershipFormValidationError(
    `Please correct the highlighted field${errors.length === 1 ? "" : "s"}: ${descriptions.join("; ")}`,
    fieldErrors,
  );
};

const getApplyPayloadValidationError = (
  form: ApplicationFormState,
  hasVerifiedReferral = false,
): MembershipFormValidationError | null => {
  if (!form.firstName.trim()) {
    return new MembershipFormValidationError("First name is required.", {
      firstName: "First name is required.",
    });
  }
  if (!form.lastName.trim()) {
    return new MembershipFormValidationError("Last name is required.", {
      lastName: "Last name is required.",
    });
  }
  if (!form.emailAddress.trim()) {
    return new MembershipFormValidationError("Email address is required.", {
      emailAddress: "Email address is required.",
    });
  }
  if (!EMAIL_PATTERN.test(form.emailAddress.trim())) {
    return new MembershipFormValidationError(
      "Enter a valid email address from any email provider.",
      {
        emailAddress:
          "Enter a valid email address, such as Gmail, Yahoo, Outlook, or your organization email.",
      },
    );
  }
  if (!form.gender) {
    return new MembershipFormValidationError("Gender is required.", {
      gender: "Gender is required.",
    });
  }
  if (!form.birthday) {
    return new MembershipFormValidationError("Date of birth is required.", {
      birthday: "Date of birth is required.",
    });
  }
  if (!form.civilStatus) {
    return new MembershipFormValidationError("Civil status is required.", {
      civilStatus: "Civil status is required.",
    });
  }
  if (!form.phoneNumber.trim()) {
    return new MembershipFormValidationError("Mobile / phone number is required.", {
      phoneNumber: "Mobile / phone number is required.",
    });
  }
  if (!isValidPhoneNumber(form.phoneNumber)) {
    return new MembershipFormValidationError(
      "Enter a valid international mobile or phone number.",
      {
        phoneNumber: "Select the country code and enter a valid phone number.",
      },
    );
  }
  if (!form.address.trim()) {
    return new MembershipFormValidationError("Home address is required.", {
      address: "Home address is required.",
    });
  }
  if (!form.nationality.trim()) {
    return new MembershipFormValidationError("Nationality is required.", {
      nationality: "Nationality is required.",
    });
  }
  if (!form.emergencyName.trim()) {
    return new MembershipFormValidationError("Emergency contact name is required.", {
      emergencyName: "Emergency contact name is required.",
    });
  }
  if (!form.emergencyCellphone.trim()) {
    return new MembershipFormValidationError("Emergency contact mobile is required.", {
      emergencyCellphone: "Emergency contact mobile is required.",
    });
  }
  if (!isValidPhoneNumber(form.emergencyCellphone)) {
    return new MembershipFormValidationError(
      "Enter a valid international emergency contact number.",
      {
        emergencyCellphone:
          "Select the country code and enter a valid emergency contact number.",
      },
    );
  }
  const endorsedBy = form.characterReferences[0];
  if (!hasVerifiedReferral && (
    !endorsedBy?.name.trim() ||
    !endorsedBy.position.trim() ||
    !endorsedBy.contactNumber.trim()
  )) {
    return new MembershipFormValidationError(
      "Endorsed by name, relationship, and contact number are required.",
      {
        characterReferences:
          "Endorsed by name, relationship, and contact number are required.",
      },
    );
  }

  const location = splitRegionSummary(form.regionProvince);
  if (!location) {
    return new MembershipFormValidationError(
      "Please complete your full location: region, province, municipality, and barangay.",
      {
        regionProvince:
          "Please complete your full location: region, province, municipality, and barangay.",
      },
    );
  }

  const currentPositionRole = getFirstNonEmpty(form.position, form.positionOthers);
  if (!currentPositionRole) {
    return new MembershipFormValidationError("Current position / role is required.", {
      position: "Current position / role is required.",
    });
  }

  return null;
};

const mapFormToApplyPayload = (
  form: ApplicationFormState,
  referralCode?: string,
): ApplyMemberRequest | null => {
  const location = splitRegionSummary(form.regionProvince);
  const mobilePhoneNumber = form.phoneNumber.trim();
  const homeAddress = form.address.trim();
  const nationality = form.nationality.trim();
  const emergencyContactName = form.emergencyName.trim();
  const emergencyContactMobile = form.emergencyCellphone.trim();
  const endorsedBy = form.characterReferences[0];

  if (!form.firstName.trim() || !form.lastName.trim()) return null;
  if (!form.emailAddress.trim()) return null;
  if (!form.gender || !form.birthday) return null;
  if (!form.civilStatus) return null;
  if (!mobilePhoneNumber || !homeAddress || !nationality) return null;
  if (!emergencyContactName || !emergencyContactMobile) return null;
  if (!referralCode && (
    !endorsedBy?.name.trim() ||
    !endorsedBy.position.trim() ||
    !endorsedBy.contactNumber.trim()
  )) {
    return null;
  }

  const currentPositionRole = getFirstNonEmpty(form.position, form.positionOthers) ?? undefined;

  if (!location || !currentPositionRole) return null;

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
    referralCode,
    email: form.emailAddress.trim().toLowerCase(),
    firstName: form.firstName.trim(),
    middleInitial: form.middleInitial.trim() || undefined,
    lastName: form.lastName.trim(),
    extensionName: form.extensionName.trim() || undefined,
    mobilePhoneNumber,
    homeAddress,
    civilStatus: CIVIL_STATUS_MAP[form.civilStatus],
    gender: GENDER_MAP[form.gender],
    nationality,
    dateOfBirth: new Date(form.birthday).toISOString(),
    region: location.region,
    province: location.province,
    municipalityCity: location.municipalityCity,
    barangay: location.barangay,
    emergencyContactName,
    emergencyContactMobile,
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
  const searchParams = useSearchParams();
  const applyMemberMutation = useApplyMemberMutation();
  const { data: currentUser } = useOptionalCurrentUserQuery();
  const requestedReferralCode = searchParams.get("ref")?.trim().toUpperCase() || null;
  const referralQuery = usePublicReferralQuery(requestedReferralCode);
  const verifiedReferralCode = referralQuery.data ? requestedReferralCode ?? undefined : undefined;
  const existingApplication = currentUser?.memberProfile;

  const handleSubmit = async (form: ApplicationFormState) => {
    const validationError = getApplyPayloadValidationError(form, Boolean(verifiedReferralCode));
    if (validationError) {
      throw validationError;
    }

    const payload = mapFormToApplyPayload(form, verifiedReferralCode);

    if (!payload) {
      throw new Error(
        "Please complete all required fields, including full location and valid personal details.",
      );
    }

    try {
      const response = await applyMemberMutation.mutateAsync(payload);
      const createdUser = response.meta?.createdUser ?? false;
      const isEmailVerified =
        response.meta?.isEmailVerified ?? response.data.user?.isEmailVerified ?? false;

      const successDescription = createdUser
        ? "Your application was submitted. Check your email for your temporary account credentials and verification link."
        : isEmailVerified
          ? "Your application was submitted. Your account is already verified, and the admin team will review your details next."
          : "Your application was submitted. Check your email for your verification link while the admin team reviews your details.";

      toast({
        title: "Application submitted",
        description: successDescription,
        variant: "success",
      });

      const onboardingPath = "/become-a-member/onboarding";
      router.push(
        currentUser
          ? onboardingPath
          : `/sign-in?redirect=${encodeURIComponent(onboardingPath)}`,
      );
    } catch (error) {
      const apiError = toApiError(error);
      const validationError = getApiValidationError(apiError.errors);
      if (validationError) {
        throw validationError;
      }

      const message =
        apiError.message ??
        (error instanceof Error ? error.message : "Submission failed.");
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
          {existingApplication ? (
            <ExistingApplicationPanel currentUser={currentUser} />
          ) : (
            <MembershipApplicationForm
              storageKey="pearl-member-application-draft"
              clearDraftOnSuccess
              locationCatalog={{
                getRegions,
                getProvinces,
                getMunicipalities,
                getBarangays,
              }}
              currentUser={{
                name: currentUser?.name,
                email: currentUser?.email,
                avatar: currentUser?.avatar,
              }}
              emailMode="editable"
              verifiedReferral={referralQuery.data}
              disableSubmit={Boolean(requestedReferralCode) && (referralQuery.isLoading || referralQuery.isError)}
              disabledSubmitMessage={
                referralQuery.isLoading
                  ? "Checking the referral link before submission..."
                  : referralQuery.isError
                    ? "This referral link is invalid or no longer active. Ask the member for a new link, or remove it from the address bar to apply without a referral."
                    : undefined
              }
              onSubmitAction={handleSubmit}
            />
          )}

          <aside className="self-start lg:sticky lg:top-6">
            <div className="overflow-hidden border border-black/10 bg-white">
              <div className="bg-[#032a0d] px-5 py-4 text-white">
                <h2 className="text-lg">Description</h2>
              </div>
              <div className="space-y-5 p-5 text-sm text-neutral-700">
                {existingApplication ? (
                  <>
                    <p>
                      Your account already has a recorded membership
                      application. This page stays available so you can check
                      your current status and next action without creating a
                      duplicate submission.
                    </p>

                    <div className="rounded border border-dashed border-[#032a0d]/25 bg-[#032a0d]/5 px-3 py-3 text-xs text-[#032a0d]/80">
                      <div className="flex gap-2">
                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#032a0d]" />
                        <p>
                          Duplicate membership form submissions are disabled
                          once an application already exists on your account.
                        </p>
                      </div>
                    </div>

                    <div className="rounded border border-dashed border-[#032a0d]/25 bg-[#032a0d]/5 px-3 py-3 text-xs text-[#032a0d]/80">
                      <div className="flex gap-2">
                        <MailCheck className="mt-0.5 size-4 shrink-0 text-[#032a0d]" />
                        <p>
                          If your email verification is still pending, complete
                          that first so you can access the next member steps
                          when approval is granted.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ExistingApplicationPanel({ currentUser }: { currentUser: UserPublic }) {
  const application = currentUser.memberProfile;
  const content = getExistingApplicationContent(currentUser);
  const StatusIcon = content.icon;

  if (!application) return null;

  return (
    <div className="overflow-hidden border border-black/10 bg-white shadow-sm">
      <div className="border-b border-black/10 bg-[#032a0d] px-6 py-5 text-white sm:px-8">
        <p className="text-xs uppercase tracking-[0.22em] text-white/70">
          Membership Application
        </p>
        <h2 className="mt-1 font-serif text-2xl sm:text-3xl">
          Current Application Status
        </h2>
      </div>

      <div className="space-y-6 px-6 py-8 sm:px-8">
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${content.badgeClassName}`}>
          <StatusIcon className="size-3.5" />
          <span>{content.badgeLabel}</span>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
          <p className="text-lg font-semibold">{content.title}</p>
          <p className="mt-2 text-sm leading-6 text-emerald-900/85">
            {content.description}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
              Application Status
            </p>
            <p className="mt-2 text-lg font-semibold text-[#032a0d]">
              {application.status}
            </p>
          </div>

          <div className="rounded-xl border bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
              Account Verification
            </p>
            <p className="mt-2 text-lg font-semibold text-[#032a0d]">
              {currentUser.isEmailVerified ? "Verified" : "Pending verification"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-neutral-50 p-5">
          <div className="flex items-center gap-2 text-[#032a0d]">
            <Clock3 className="size-4" />
            <p className="font-medium">What happens next</p>
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-700">
            {content.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>

        <p className="rounded border border-[#032a0d]/15 bg-[#032a0d]/5 px-4 py-3 text-sm text-[#032a0d]">
          {content.nextActionLabel}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="bg-[#032a0d] hover:bg-[#032a0d]/90">
            <Link href={content.primaryActionHref}>
              {content.primaryActionLabel}
              <ChevronRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={content.secondaryActionHref}>
              {content.secondaryActionLabel}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
