"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { clearDraft, loadDraft, saveDraft } from "./draftStorage";
import { StepChurchBackground } from "./steps/StepChurchBackground";
import { StepEducationMinistry } from "./steps/StepEducationMinistry";
import { StepPersonalDetails } from "./steps/StepPersonalDetails";
import { StepReferencesReview } from "./steps/StepReferencesReview";
import type {
  ApplicationFieldErrors,
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
  clearDraftOnSuccess = false,
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
  clearDraftOnSuccess?: boolean;
  onSubmitAction: (form: ApplicationFormState) => Promise<void>;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState<ApplicationFormState>(() => loadDraft(storageKey).form);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ApplicationFieldErrors>({});

  const applyFieldErrors = (errors: ApplicationFieldErrors) => {
    setFieldErrors(errors);
  };

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
    setFieldErrors((previous) => {
      if (!previous[key]) return previous;

      const next = { ...previous };
      delete next[key];
      return next;
    });
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSignatureChange = (signature: string | null) => {
    updateField("signatureUrl", signature ?? "");
  };

  const handleSubmit = async () => {
    setFieldErrors({});

    if (disableSubmit) {
      toast({
        title: "Submission unavailable",
        description:
          disabledSubmitMessage ?? "Submission is unavailable right now.",
        variant: "error",
      });
      return;
    }

    if (!form.declarationTruthConfirmed || !form.monthlyPledgeConfirmed) {
      const confirmationErrors: ApplicationFieldErrors = {};

      if (!form.declarationTruthConfirmed) {
        confirmationErrors.declarationTruthConfirmed =
          "Please confirm the declaration checkbox.";
      }

      if (!form.monthlyPledgeConfirmed) {
        confirmationErrors.monthlyPledgeConfirmed =
          "Please confirm the monthly pledge checkbox.";
      }

      applyFieldErrors(confirmationErrors);
      toast({
        title: "Incomplete form",
        description: "Please confirm both declaration checkboxes before submitting.",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      saveDraft(storageKey, form, DRAFT_STEP);
      await onSubmitAction(form);
      if (clearDraftOnSuccess) {
        clearDraft(storageKey);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Submission failed.";
      const nextFieldErrors =
        typeof error === "object" &&
        error !== null &&
        "fieldErrors" in error &&
        typeof (error as { fieldErrors?: unknown }).fieldErrors === "object"
          ? ((error as { fieldErrors?: ApplicationFieldErrors }).fieldErrors ?? {})
          : {};

      applyFieldErrors(nextFieldErrors);
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
            fieldErrors={fieldErrors}
          />
        </section>

        <section className="space-y-4">
          <h3 className="font-serif text-xl text-[#032a0d]">Church Background</h3>
          <div className="h-px bg-black/10" />
          <StepChurchBackground
            form={form}
            updateFieldAction={updateField}
            fieldErrors={fieldErrors}
          />
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
            fieldErrors={fieldErrors}
          />
        </section>

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
