"use client";

import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Info } from "lucide-react";

import { Button } from "@/components/ui/button";

import { loadDraft, saveDraft } from "./draftStorage";
import { emptyFormState } from "./constants";
import type { ApplicationFormState, StepIndex } from "./types";
import { StepPersonalDetails } from "./steps/StepPersonalDetails";
import { StepChurchBackground } from "./steps/StepChurchBackground";
import { StepEducationMinistry } from "./steps/StepEducationMinistry";
import { StepReferencesReview } from "./steps/StepReferencesReview";
import { api } from "../../../../../convex/_generated/api";

const DRAFT_SAVE_DEBOUNCE_MS = 500;
const DRAFT_STEP: StepIndex = 3;

function computeAgeFromBirthday(birthday: string): string {
  if (!birthday) return "";

  const birthDate = new Date(birthday);
  if (Number.isNaN(birthDate.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const hasNotHadBirthdayYet =
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate());

  if (hasNotHadBirthdayYet) {
    age -= 1;
  }

  if (age < 0) return "";
  return String(age);
}

function mergeFormFromJson(formJson: string): ApplicationFormState {
  try {
    const partial = JSON.parse(formJson) as Partial<ApplicationFormState>;
    const form: ApplicationFormState = { ...emptyFormState };
    for (const key of Object.keys(
      emptyFormState,
    ) as (keyof ApplicationFormState)[]) {
      const value = partial[key];
      if (value !== undefined && value !== null) {
        (form as Record<string, unknown>)[key] = value;
      }
    }
    return form;
  } catch {
    return emptyFormState;
  }
}

export function BecomeMemberWizard() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const draftFromConvex = useQuery(
    api.backend.membership.getDraft,
    isSignedIn ? {} : "skip",
  );
  const saveDraftMutation = useMutation(api.backend.membership.saveDraft);
  const submitApplicationMutation = useMutation(
    api.backend.membership.submitApplication,
  );

  const [form, setForm] = useState<ApplicationFormState>(
    () => loadDraft().form,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const hasSyncedFromConvex = useRef(false);

  useEffect(() => {
    if (!isSignedIn) {
      hasSyncedFromConvex.current = false;
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!isSignedIn || !draftFromConvex || hasSyncedFromConvex.current) return;
    hasSyncedFromConvex.current = true;
    setForm(mergeFormFromJson(draftFromConvex.formJson));
  }, [isSignedIn, draftFromConvex]);

  useEffect(() => {
    const isDraftResolved = !isSignedIn || draftFromConvex !== undefined;
    if (!isSignedIn || !isUserLoaded || !user || !isDraftResolved) return;

    const fallbackEmail = user.emailAddresses[0]?.emailAddress ?? "";
    const primaryEmail = user.primaryEmailAddress?.emailAddress ?? fallbackEmail;

    setForm((prev) => {
      const updates: Partial<ApplicationFormState> = {};

      if (!prev.firstName.trim() && user.firstName?.trim()) {
        updates.firstName = user.firstName.trim();
      }
      if (!prev.lastName.trim() && user.lastName?.trim()) {
        updates.lastName = user.lastName.trim();
      }
      if (!prev.emailAddress.trim() && primaryEmail.trim()) {
        updates.emailAddress = primaryEmail.trim();
      }

      if (Object.keys(updates).length === 0) return prev;
      return { ...prev, ...updates };
    });
  }, [isSignedIn, isUserLoaded, user, draftFromConvex]);

  useEffect(() => {
    const computedAge = computeAgeFromBirthday(form.birthday);
    if (form.age === computedAge) return;
    setForm((prev) => ({ ...prev, age: computedAge }));
  }, [form.birthday, form.age]);

  useEffect(() => {
    if (isSignedIn) return;
    const id = setTimeout(
      () => saveDraft(form, DRAFT_STEP),
      DRAFT_SAVE_DEBOUNCE_MS,
    );
    return () => clearTimeout(id);
  }, [isSignedIn, form]);

  useEffect(() => {
    if (!isSignedIn) return;
    const id = setTimeout(() => {
      saveDraftMutation({
        formJson: JSON.stringify(form),
        step: DRAFT_STEP,
      }).catch(() => {});
    }, DRAFT_SAVE_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [isSignedIn, form, saveDraftMutation]);

  const updateField = <K extends keyof ApplicationFormState>(
    key: K,
    value: ApplicationFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        updateField("photoUrl", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSignatureChange = (signature: string | null) => {
    updateField("signatureUrl", signature ?? "");
  };

  const handleSubmit = async () => {
    if (!isSignedIn) {
      setSubmitError("Please sign in to submit your application.");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await submitApplicationMutation();
      router.push("/become-a-member/onboarding");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed.");
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
              onClick={() => router.back()}
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
                  handlePhotoChangeAction={handlePhotoChange}
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
                {!isSignedIn && (
                  <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                    Sign in is required before final submission.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
