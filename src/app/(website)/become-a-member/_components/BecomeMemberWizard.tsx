"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ExpandIcon, XIcon } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { GuidancePanel } from "./GuidancePanel";
import { MembershipPreview } from "./MembershipPreview";
import { steps } from "./constants";
import { loadDraft, saveDraft } from "./draftStorage";
import { emptyFormState } from "./constants";
import type { ApplicationFormState, StepIndex } from "./types";

import { StepPersonalDetails } from "./steps/StepPersonalDetails";
import { StepChurchBackground } from "./steps/StepChurchBackground";
import { StepEducationMinistry } from "./steps/StepEducationMinistry";
import { StepReferencesReview } from "./steps/StepReferencesReview";
import { api } from '../../../../../convex/_generated/api';

const DRAFT_SAVE_DEBOUNCE_MS = 500;

type FormCardProps = {
  isFullscreenView: boolean;
  step: StepIndex;
  progress: number;
  form: ApplicationFormState;
  isFullscreen: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  onSetFullscreen: (value: boolean | ((prev: boolean) => boolean)) => void;
  updateField: <K extends keyof ApplicationFormState>(
    key: K,
    value: ApplicationFormState[K],
  ) => void;
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSignatureChange: (signature: string | null) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: () => void;
};

function FormCard({
  isFullscreenView,
  step,
  progress,
  form,
  isFullscreen,
  isSubmitting,
  submitError,
  onSetFullscreen,
  updateField,
  onPhotoChange,
  onSignatureChange,
  onPrevStep,
  onNextStep,
  onSubmit,
}: FormCardProps) {
  const currentStep = steps[step];
  return (
    <div
      className={
        isFullscreenView
          ? "h-full w-full"
          : "rounded-2xl border border-[#032a0d]/15 bg-white shadow-sm p-5 sm:p-6 lg:p-7"
      }
    >
      <div
        className={
          isFullscreenView
            ? "sticky top-0 z-10 bg-white border-b border-[#032a0d]/10 px-5 sm:px-6 lg:px-7 pt-5 sm:pt-6 lg:pt-7 pb-4"
            : "mb-6"
        }
      >
        <div className="flex items-center justify-between mb-2 gap-3">
          <p className="text-xs sm:text-sm uppercase text-[#032a0d]/70">
            Step {step + 1} of {steps.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSetFullscreen((prev: boolean) => !prev)}
              className="border-[#032a0d]/30 text-[#032a0d] hover:bg-[#032a0d]/5"
            >
              {isFullscreen ? (
                <>
                  <XIcon className="size-3.5" />
                  Exit
                </>
              ) : (
                <>
                  <ExpandIcon className="size-3.5" />
                  Full screen
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-lg sm:text-xl text-[#032a0d]">
            {currentStep.title}
          </h2>
          <span className="text-[11px] sm:text-xs text-[#032a0d]/70">
            {currentStep.description}
          </span>
        </div>

        <div className="h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#032a0d] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className={isFullscreenView ? "px-5 sm:px-6 mt-5 lg:px-7 pb-7" : ""}>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {step === 0 && (
            <StepPersonalDetails
              form={form}
              updateField={updateField}
              handlePhotoChange={onPhotoChange}
            />
          )}
          {step === 1 && (
            <StepChurchBackground form={form} updateField={updateField} />
          )}
          {step === 2 && (
            <StepEducationMinistry form={form} updateField={updateField} />
          )}
          {step === 3 && (
            <StepReferencesReview
              form={form}
              updateField={updateField}
              handleSignatureChange={onSignatureChange}
            />
          )}

          {submitError && (
            <p className="text-sm text-red-600" role="alert">
              {submitError}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0}
              onClick={onPrevStep}
              className="border-[#032a0d]/40 text-[#032a0d] hover:bg-[#032a0d]/5"
            >
              Back
            </Button>

            {step < steps.length - 1 ? (
              <Button
                type="button"
                onClick={onNextStep}
                className="bg-[#032a0d] hover:bg-[#032a0d]/90"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
                className="bg-[#032a0d] hover:bg-[#032a0d]/90"
              >
                {isSubmitting ? "Saving..." : "Save application draft"}
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function mergeFormFromJson(formJson: string): ApplicationFormState {
  try {
    const partial = JSON.parse(formJson) as Partial<ApplicationFormState>;
    const form: ApplicationFormState = { ...emptyFormState };
    for (const key of Object.keys(emptyFormState) as (keyof ApplicationFormState)[]) {
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
  const draftFromConvex = useQuery(
    api.backend.membership.getDraft,
    isSignedIn ? {} : "skip",
  );
  const saveDraftMutation = useMutation(api.backend.membership.saveDraft);
  const submitApplicationMutation = useMutation(
    api.backend.membership.submitApplication,
  );

  const [step, setStep] = useState<StepIndex>(() => loadDraft().step);
  const [form, setForm] = useState<ApplicationFormState>(
    () => loadDraft().form,
  );
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const hasSyncedFromConvex = useRef(false);

  // When user signs out, allow syncing from Convex again on next sign-in
  useEffect(() => {
    if (!isSignedIn) hasSyncedFromConvex.current = false;
  }, [isSignedIn]);

  // Sync initial state from Convex draft once when it first loads (signed-in users)
  useEffect(() => {
    if (!isSignedIn || !draftFromConvex || hasSyncedFromConvex.current) return;
    hasSyncedFromConvex.current = true;
    setForm(mergeFormFromJson(draftFromConvex.formJson));
    const s = draftFromConvex.step;
    setStep((s >= 0 && s <= 3 ? s : 0) as StepIndex);
  }, [isSignedIn, draftFromConvex]);

  // Persist draft: Convex when signed in, localStorage otherwise
  useEffect(() => {
    if (!isSignedIn) {
      const id = setTimeout(() => saveDraft(form, step), DRAFT_SAVE_DEBOUNCE_MS);
      return () => clearTimeout(id);
    }
  }, [isSignedIn, form, step]);

  useEffect(() => {
    if (!isSignedIn) return;
    const id = setTimeout(() => {
      saveDraftMutation({
        formJson: JSON.stringify(form),
        step,
      }).catch(() => {});
    }, DRAFT_SAVE_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [isSignedIn, form, step, saveDraftMutation]);

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  const updateField = <K extends keyof ApplicationFormState>(
    key: K,
    value: ApplicationFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep((prev) => (prev + 1) as StepIndex);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep((prev) => (prev - 1) as StepIndex);
    }
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

  const formCardProps = {
    step,
    progress,
    form,
    isFullscreen,
    isSubmitting,
    submitError,
    onSetFullscreen: setIsFullscreen,
    updateField,
    onPhotoChange: handlePhotoChange,
    onSignatureChange: handleSignatureChange,
    onPrevStep: prevStep,
    onNextStep: nextStep,
    onSubmit: handleSubmit,
  };

  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.1fr)] items-start">
        <GuidancePanel
          isPreview={isPreview}
          onTogglePreviewAction={() => setIsPreview((prev) => !prev)}
        />

        {!isPreview ? (
          <>
            <div className={isFullscreen ? "hidden" : "block"}>
              <FormCard {...formCardProps} isFullscreenView={false} />
            </div>

            <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
              <DialogContent className="max-w-none! w-screen h-dvh p-0 gap-0">
                <div className="h-full w-full bg-white overflow-y-auto">
                  <FormCard {...formCardProps} isFullscreenView />
                </div>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <MembershipPreview form={form} />
        )}
      </div>
    </section>
  );
}

