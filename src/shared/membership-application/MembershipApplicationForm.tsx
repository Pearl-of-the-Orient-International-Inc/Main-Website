"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { loadDraft, saveDraft } from "./draftStorage";
import { StepChurchBackground } from "./steps/StepChurchBackground";
import { StepEducationMinistry } from "./steps/StepEducationMinistry";
import { StepPersonalDetails } from "./steps/StepPersonalDetails";
import { StepReferencesReview } from "./steps/StepReferencesReview";
import type {
  ApplicationFormState,
  LocationCatalog,
  SharedCurrentUser,
  StepIndex,
} from "./types";
import { computeAgeFromBirthday, splitName } from "./utils";

const DRAFT_SAVE_DEBOUNCE_MS = 500;
const DRAFT_STEP: StepIndex = 3;

export function MembershipApplicationForm({
  storageKey,
  locationCatalog,
  currentUser,
  emailMode = "editable",
  emailHelperText,
  disableSubmit = false,
  disabledSubmitMessage,
  submitLabel = "Submit application",
  submittingLabel = "Submitting...",
  successMessage = "Application submitted successfully. Your status is now under review.",
  onSubmitAction,
}: {
  storageKey: string;
  locationCatalog: LocationCatalog;
  currentUser?: SharedCurrentUser | null;
  emailMode?: "editable" | "locked";
  emailHelperText?: string;
  disableSubmit?: boolean;
  disabledSubmitMessage?: string;
  submitLabel?: string;
  submittingLabel?: string;
  successMessage?: string;
  onSubmitAction: (form: ApplicationFormState) => Promise<void>;
}) {
  const [form, setForm] = useState<ApplicationFormState>(() => loadDraft(storageKey).form);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const computedAge = computeAgeFromBirthday(form.birthday);
    if (form.age === computedAge) return;
    setForm((previous) => ({ ...previous, age: computedAge }));
  }, [form.age, form.birthday]);

  useEffect(() => {
    if (!currentUser) return;

    const { firstName, lastName } = splitName(currentUser.name);

    setForm((previous) => {
      const next = { ...previous };
      let hasChanges = false;

      if (!previous.firstName.trim() && firstName) {
        next.firstName = firstName;
        hasChanges = true;
      }

      if (!previous.lastName.trim() && lastName) {
        next.lastName = lastName;
        hasChanges = true;
      }

      if (!previous.emailAddress.trim() && currentUser.email?.trim()) {
        next.emailAddress = currentUser.email.trim();
        hasChanges = true;
      }

      if (!previous.photoUrl.trim() && currentUser.avatar?.trim()) {
        next.photoUrl = currentUser.avatar.trim();
        hasChanges = true;
      }

      return hasChanges ? next : previous;
    });
  }, [currentUser]);

  useEffect(() => {
    const id = setTimeout(
      () => saveDraft(storageKey, form, DRAFT_STEP),
      DRAFT_SAVE_DEBOUNCE_MS,
    );
    return () => clearTimeout(id);
  }, [form, storageKey]);

  const updateField = <K extends keyof ApplicationFormState>(
    key: K,
    value: ApplicationFormState[K],
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSignatureChange = (signature: string | null) => {
    updateField("signatureUrl", signature ?? "");
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(false);

    if (disableSubmit) {
      setSubmitError(disabledSubmitMessage ?? "Submission is unavailable right now.");
      return;
    }

    if (!form.declarationTruthConfirmed || !form.monthlyPledgeConfirmed) {
      setSubmitError(
        "Please confirm both declaration checkboxes before submitting.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      saveDraft(storageKey, form, DRAFT_STEP);
      await onSubmitAction(form);
      setSubmitSuccess(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Submission failed.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden border border-black/10 bg-white">
      <div className="bg-[#032a0d] px-5 py-4 text-white">
        <h2 className="text-lg">Application Form</h2>
      </div>

      <form
        className="space-y-8 p-5 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <section className="space-y-4">
          <h3 className="font-serif text-xl text-[#032a0d]">Contact Information</h3>
          <div className="h-px bg-black/10" />
          <StepPersonalDetails
            form={form}
            updateFieldAction={updateField}
            locationCatalog={locationCatalog}
            emailMode={emailMode}
            emailHelperText={emailHelperText}
          />
        </section>

        <section className="space-y-4">
          <h3 className="font-serif text-xl text-[#032a0d]">Church Background</h3>
          <div className="h-px bg-black/10" />
          <StepChurchBackground form={form} updateFieldAction={updateField} />
        </section>

        <section className="space-y-4">
          <h3 className="font-serif text-xl text-[#032a0d]">
            Education and Ministry
          </h3>
          <div className="h-px bg-black/10" />
          <StepEducationMinistry form={form} updateFieldAction={updateField} />
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

        {submitError ? (
          <p className="text-sm text-red-600" role="alert">
            {submitError}
          </p>
        ) : null}
        {submitSuccess ? (
          <p className="text-sm text-emerald-700" role="status">
            {successMessage}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500 sm:text-sm">
            {disabledSubmitMessage ??
              "Your draft is auto-saved while filling out this form."}
          </p>
          <Button
            type="submit"
            disabled={disableSubmit || isSubmitting}
            className="bg-[#032a0d] hover:bg-[#032a0d]/90"
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
