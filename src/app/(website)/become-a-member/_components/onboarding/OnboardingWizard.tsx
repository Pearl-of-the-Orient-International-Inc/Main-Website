"use client";

import { useEffect, useRef } from "react";
import {
  REQUIREMENT_KEYS,
  REQUIREMENT_TYPE_BY_KEY,
  type OnboardingStepId,
  type RequirementKey,
} from "../constants";
import {
  toApiError,
  useCurrentMemberChaplaincyTrainingProgressQuery,
  useCurrentMemberOnboardingProgressQuery,
  useCurrentMemberOnlineInterviewAppointmentQuery,
  useCurrentMemberPaymentCheckoutQuery,
  useCurrentMemberIdGenerationAssetQuery,
  useCurrentMemberRequirementsQuery,
  useUpdateCurrentMemberOnboardingStepMutation,
  useUpdateCurrentMemberPreOrientationProgressMutation,
  useUpsertCurrentMemberChaplaincyTrainingProgressMutation,
  useUpsertMemberRequirementsMutation,
  useUploadMemberRequirementMutation,
} from "@/features/member/member.hooks";
import { useToast } from "@/hooks/use-toast";
import { OnboardingStepRequirements } from "./OnboardingStepRequirements";
import { OnboardingStepPreOrientation } from "./OnboardingStepPreOrientation";
import { OnboardingStepPaymentCheckout } from "./OnboardingStepPaymentCheckout";
import { OnboardingStepOnlineInterview } from "./OnboardingStepOnlineInterview";
import { OnboardingStepChaplaincy101 } from "./OnboardingStepChaplaincy101";
import { OnboardingStepOathTaking } from "./OnboardingStepOathTaking";
import { OnboardingStepIdGeneration } from "./OnboardingStepIdGeneration";
import type {
  FrontendOnboardingApplication,
  FrontendOnboardingMeta,
} from "./types";
import type { MemberOnboardingStep } from "@/features/member/member.types";

type Props = {
  application: FrontendOnboardingApplication;
  onMetaChangeAction: (meta: FrontendOnboardingMeta) => void;
};

export function OnboardingWizard({ application, onMetaChangeAction }: Props) {
  const PRE_ORIENTATION_REQUIRED_LESSON_COUNT = 5;
  const { toast } = useToast();
  const uploadRequirementMutation = useUploadMemberRequirementMutation();
  const upsertRequirementsMutation = useUpsertMemberRequirementsMutation();
  const updateOnboardingStepMutation = useUpdateCurrentMemberOnboardingStepMutation();
  const updatePreOrientationProgressMutation =
    useUpdateCurrentMemberPreOrientationProgressMutation();
  const { data: currentRequirements } = useCurrentMemberRequirementsQuery();
  const { data: currentPaymentCheckout } = useCurrentMemberPaymentCheckoutQuery();
  const { data: currentOnlineInterview } =
    useCurrentMemberOnlineInterviewAppointmentQuery();
  const { data: currentIdGenerationAsset } = useCurrentMemberIdGenerationAssetQuery();
  const { data: currentChaplaincyTraining } =
    useCurrentMemberChaplaincyTrainingProgressQuery();
  const { data: currentOnboardingProgress } =
    useCurrentMemberOnboardingProgressQuery();
  const hasHydratedFromBackendRef = useRef(false);
  const hasHydratedProgressRef = useRef(false);
  const hasEnforcedPreOrientationGuardRef = useRef(false);
  const hasEnforcedPaymentGuardRef = useRef(false);
  const hasEnforcedOnlineInterviewGuardRef = useRef(false);
  const hasEnforcedIdGenerationGuardRef = useRef(false);
  const hasEnforcedChaplaincyGuardRef = useRef(false);
  const upsertChaplaincyTrainingProgressMutation =
    useUpsertCurrentMemberChaplaincyTrainingProgressMutation();

  const backendStepToFrontendStep: Record<MemberOnboardingStep, OnboardingStepId> = {
    REQUIREMENTS: "requirements",
    PRE_ORIENTATION: "pre_orientation",
    PAYMENT_CHECKOUT: "payment_checkout",
    ONLINE_INTERVIEW: "online_interview",
    ID_GENERATION: "id_generation",
    CHAPLAINCY_101: "chaplaincy_101",
    OATH_TAKING: "oath_taking",
  };

  const frontendStepToBackendStep: Record<OnboardingStepId, MemberOnboardingStep> = {
    application: "REQUIREMENTS",
    requirements: "REQUIREMENTS",
    pre_orientation: "PRE_ORIENTATION",
    payment_checkout: "PAYMENT_CHECKOUT",
    online_interview: "ONLINE_INTERVIEW",
    id_generation: "ID_GENERATION",
    chaplaincy_101: "CHAPLAINCY_101",
    oath_taking: "OATH_TAKING",
  };

  const currentStepId = (application.onboardingStep ??
    "requirements") as OnboardingStepId;

  const applyMetaUpdate = (
    update: Partial<
      Pick<FrontendOnboardingMeta, "onboardingStep" | "requirementAttachments">
    >,
  ) => {
    onMetaChangeAction({
      localId: application.localId,
      uniqueId: application.uniqueId,
      applicationStatus: application.applicationStatus,
      onboardingStep: update.onboardingStep ?? application.onboardingStep,
      requirementAttachments:
        update.requirementAttachments ?? application.requirementAttachments,
    });
  };

  const handleAttachmentChange = (key: RequirementKey, value: string) => {
    applyMetaUpdate({
      requirementAttachments: {
        ...application.requirementAttachments,
        [key]: value,
      },
    });
  };

  useEffect(() => {
    if (hasHydratedFromBackendRef.current) return;
    if (!currentRequirements?.data.attachments) return;

    const backendAttachments = currentRequirements.data.attachments;
    const mergedAttachments = { ...application.requirementAttachments };

    for (const key of REQUIREMENT_KEYS) {
      const url = backendAttachments[key];
      if (typeof url === "string" && url.trim()) {
        mergedAttachments[key] = url;
      }
    }

    hasHydratedFromBackendRef.current = true;
    applyMetaUpdate({ requirementAttachments: mergedAttachments });
  }, [application.requirementAttachments, currentRequirements]);

  useEffect(() => {
    if (hasHydratedProgressRef.current) return;
    const progressData = currentOnboardingProgress?.data;
    if (!progressData) return;

    hasHydratedProgressRef.current = true;
    applyMetaUpdate({
      onboardingStep: backendStepToFrontendStep[progressData.currentStep],
    });
  }, [currentOnboardingProgress]);

  useEffect(() => {
    const progressData = currentOnboardingProgress?.data;
    if (!progressData) return;
    if (hasEnforcedPreOrientationGuardRef.current) return;

    const completedCount =
      progressData.preOrientationCompletedLessonIds?.length ?? 0;
    const preOrientationIncomplete =
      completedCount < PRE_ORIENTATION_REQUIRED_LESSON_COUNT;
    const isBeyondPreOrientation = [
      "payment_checkout",
      "online_interview",
      "id_generation",
      "chaplaincy_101",
      "oath_taking",
    ].includes(currentStepId);

    if (!preOrientationIncomplete || !isBeyondPreOrientation) return;

    hasEnforcedPreOrientationGuardRef.current = true;

    void updateOnboardingStepMutation.mutateAsync({
      currentStep: "PRE_ORIENTATION",
    });

    applyMetaUpdate({ onboardingStep: "pre_orientation" });
    toast({
      title: "Pre-orientation required",
      description: "Finish all pre-orientation lessons before payment.",
      variant: "warning",
    });
  }, [currentOnboardingProgress, currentStepId, toast, updateOnboardingStepMutation]);

  useEffect(() => {
    if (typeof currentPaymentCheckout === "undefined") return;
    const paymentData = currentPaymentCheckout?.data;
    if (hasEnforcedPaymentGuardRef.current) return;

    const isBeyondPayment = [
      "online_interview",
      "id_generation",
      "chaplaincy_101",
      "oath_taking",
    ].includes(currentStepId);

    if (!isBeyondPayment) return;

    const hasPaymentSubmission = Boolean(paymentData);
    if (!hasPaymentSubmission) {
      hasEnforcedPaymentGuardRef.current = true;
      void updateOnboardingStepMutation.mutateAsync({
        currentStep: "PAYMENT_CHECKOUT",
      });
      applyMetaUpdate({ onboardingStep: "payment_checkout" });
      toast({
        title: "Payment required",
        description: "Complete payment checkout before the next step.",
        variant: "warning",
      });
      return;
    }

    const hasProof = Boolean(paymentData?.proofOfPaymentUrl);
    const hasPromissory = Boolean(paymentData?.promissoryNoteUrl);
    const invalidNonCash =
      paymentData?.paymentMethod !== "CASH" &&
      !paymentData?.isPromissoryNote &&
      !hasProof;
    const invalidPromissory =
      paymentData?.isPromissoryNote === true && !hasPromissory;

    if (invalidNonCash || invalidPromissory) {
      hasEnforcedPaymentGuardRef.current = true;
      void updateOnboardingStepMutation.mutateAsync({
        currentStep: "PAYMENT_CHECKOUT",
      });
      applyMetaUpdate({ onboardingStep: "payment_checkout" });
      toast({
        title: "Payment requirements incomplete",
        description: "Attach required proof or signed promissory note first.",
        variant: "warning",
      });
    }
  }, [currentPaymentCheckout, currentStepId, toast, updateOnboardingStepMutation]);

  useEffect(() => {
    if (typeof currentOnlineInterview === "undefined") return;
    if (hasEnforcedOnlineInterviewGuardRef.current) return;

    const interviewData = currentOnlineInterview?.data;
    const isBeyondOnlineInterview = [
      "id_generation",
      "chaplaincy_101",
      "oath_taking",
    ].includes(currentStepId);

    if (!isBeyondOnlineInterview) return;

    const hasCompleteInterviewData =
      Boolean(interviewData?.interviewerId) &&
      Boolean(interviewData?.day) &&
      Boolean(interviewData?.timeSlot) &&
      Boolean(interviewData?.zoomLink);

    if (hasCompleteInterviewData) return;

    hasEnforcedOnlineInterviewGuardRef.current = true;
    void updateOnboardingStepMutation.mutateAsync({
      currentStep: "ONLINE_INTERVIEW",
    });
    applyMetaUpdate({ onboardingStep: "online_interview" });
    toast({
      title: "Interview appointment required",
      description:
        "Select interviewer, day, slot, and confirm Zoom appointment first.",
      variant: "warning",
    });
  }, [currentOnlineInterview, currentStepId, toast, updateOnboardingStepMutation]);

  useEffect(() => {
    if (typeof currentIdGenerationAsset === "undefined") return;
    if (hasEnforcedIdGenerationGuardRef.current) return;

    const isBeyondIdGeneration = ["chaplaincy_101", "oath_taking"].includes(
      currentStepId,
    );
    if (!isBeyondIdGeneration) return;

    const hasCompleteIdGeneration =
      Boolean(currentIdGenerationAsset.data.asset?.qrCodeUrl) &&
      Boolean(currentIdGenerationAsset.data.asset?.certificateUrl);

    if (hasCompleteIdGeneration) return;

    hasEnforcedIdGenerationGuardRef.current = true;
    void updateOnboardingStepMutation.mutateAsync({
      currentStep: "ID_GENERATION",
    });
    applyMetaUpdate({ onboardingStep: "id_generation" });
    toast({
      title: "ID generation required",
      description: "Save member ID QR and certificate before proceeding.",
      variant: "warning",
    });
  }, [currentIdGenerationAsset, currentStepId, toast, updateOnboardingStepMutation]);

  useEffect(() => {
    if (typeof currentChaplaincyTraining === "undefined") return;
    if (hasEnforcedChaplaincyGuardRef.current) return;
    if (currentStepId !== "oath_taking") return;

    const training = currentChaplaincyTraining?.data;
    const lessonCount = training?.completedLessonIds.length ?? 0;
    const answers = training?.essayAnswers ?? {};
    const answeredCount = Object.values(answers).filter((value) =>
      value?.trim().length > 0,
    ).length;
    const isComplete =
      lessonCount >= 8 && answeredCount >= 10 && Boolean(training?.completedAt);

    if (isComplete) return;

    hasEnforcedChaplaincyGuardRef.current = true;
    void updateOnboardingStepMutation.mutateAsync({
      currentStep: "CHAPLAINCY_101",
    });
    applyMetaUpdate({ onboardingStep: "chaplaincy_101" });
    toast({
      title: "Chaplaincy 101 required",
      description: "Complete all lessons and assessment answers first.",
      variant: "warning",
    });
  }, [currentChaplaincyTraining, currentStepId, toast, updateOnboardingStepMutation]);

  const handleAttachmentUpload = async (key: RequirementKey, file: File) => {
    const uploaded = await uploadRequirementMutation.mutateAsync(file);
    const uploadedUrl = uploaded?.ufsUrl || uploaded?.url;

    if (!uploadedUrl) {
      throw new Error("Upload did not return a file URL.");
    }

    handleAttachmentChange(key, uploadedUrl);

    toast({
      title: "File uploaded",
      description: "Requirement file uploaded successfully.",
      variant: "success",
    });
  };

  const handleRequirementsContinue = async () => {
    const attachments = REQUIREMENT_KEYS.map((key) => {
      const fileUrl = application.requirementAttachments[key]?.trim();
      if (!fileUrl) return null;

      return {
        type: REQUIREMENT_TYPE_BY_KEY[key],
        fileUrl,
      };
    }).filter(
      (item): item is { type: (typeof REQUIREMENT_TYPE_BY_KEY)[RequirementKey]; fileUrl: string } =>
        item !== null,
    );

    if (attachments.length === 0) {
      throw new Error("Please upload at least your 2x2 picture.");
    }

    try {
      const response = await upsertRequirementsMutation.mutateAsync({ attachments });

      const latestAttachments = response.data.attachments;
      const mergedAttachments = { ...application.requirementAttachments };
      for (const key of REQUIREMENT_KEYS) {
        const url = latestAttachments[key];
        if (typeof url === "string" && url.trim()) {
          mergedAttachments[key] = url;
        }
      }

      await updateOnboardingStepMutation.mutateAsync({
        currentStep: "PRE_ORIENTATION",
      });

      applyMetaUpdate({
        requirementAttachments: mergedAttachments,
        onboardingStep: "pre_orientation",
      });

      toast({
        title: "Requirements saved",
        description: "Your uploaded requirements are now recorded.",
        variant: "success",
      });
    } catch (error) {
      const apiError = toApiError(error);
      throw new Error(apiError.message ?? "Failed to save requirement attachments.");
    }
  };

  const handlePersistOnboardingStep = async (step: OnboardingStepId) => {
    await updateOnboardingStepMutation.mutateAsync({
      currentStep: frontendStepToBackendStep[step],
    });
    applyMetaUpdate({ onboardingStep: step });
  };

  const handlePreOrientationProgressChange = async (lessonIds: number[]) => {
    const progressData = currentOnboardingProgress?.data;
    const currentCompleted = progressData?.preOrientationCompletedLessonIds ?? [];
    if (JSON.stringify(currentCompleted) === JSON.stringify(lessonIds)) return;

    await updatePreOrientationProgressMutation.mutateAsync({
      completedLessonIds: lessonIds,
      isCompleted: false,
    });
  };

  const handlePreOrientationContinue = async (lessonIds: number[]) => {
    try {
      await updatePreOrientationProgressMutation.mutateAsync({
        completedLessonIds: lessonIds,
        isCompleted: true,
      });
      await handlePersistOnboardingStep("payment_checkout");
      toast({
        title: "Pre-orientation completed",
        description: "Your progress is saved.",
        variant: "success",
      });
    } catch (error) {
      const apiError = toApiError(error);
      throw new Error(
        apiError.message ?? "Failed to save pre-orientation progress.",
      );
    }
  };

  return (
    <div className="space-y-6">
      {currentStepId === "requirements" && (
        <OnboardingStepRequirements
          attachments={application.requirementAttachments}
          onAttachmentUploadAction={handleAttachmentUpload}
          onContinueAction={handleRequirementsContinue}
        />
      )}
      {currentStepId === "pre_orientation" && (
        <OnboardingStepPreOrientation
          initialCompletedLessonIds={
            currentOnboardingProgress?.data.preOrientationCompletedLessonIds ?? []
          }
          onProgressChangeAction={handlePreOrientationProgressChange}
          onContinueAction={handlePreOrientationContinue}
        />
      )}
      {currentStepId === "payment_checkout" && (
        <OnboardingStepPaymentCheckout
          onContinueAction={() => handlePersistOnboardingStep("online_interview")}
        />
      )}
      {currentStepId === "online_interview" && (
        <OnboardingStepOnlineInterview
          onContinueAction={() => handlePersistOnboardingStep("id_generation")}
        />
      )}
      {currentStepId === "id_generation" && (
        <OnboardingStepIdGeneration
          uniqueId={application.uniqueId}
          onContinueAction={() => handlePersistOnboardingStep("chaplaincy_101")}
        />
      )}
      {currentStepId === "chaplaincy_101" && (
        <OnboardingStepChaplaincy101
          initialCompletedLessonIds={
            currentChaplaincyTraining?.data?.completedLessonIds ?? []
          }
          initialEssayAnswers={Object.fromEntries(
            Object.entries(currentChaplaincyTraining?.data?.essayAnswers ?? {}).map(
              ([key, value]) => [Number(key), value],
            ),
          )}
          onProgressChangeAction={async (payload) => {
            await upsertChaplaincyTrainingProgressMutation.mutateAsync({
              completedLessonIds: payload.completedLessonIds,
              essayAnswers: Object.fromEntries(
                Object.entries(payload.essayAnswers).map(([key, value]) => [
                  String(key),
                  value,
                ]),
              ),
              isCompleted: payload.isCompleted ?? false,
            });
          }}
          onContinueAction={() => handlePersistOnboardingStep("oath_taking")}
        />
      )}
      {currentStepId === "oath_taking" && (
        <OnboardingStepOathTaking uniqueId={application.uniqueId} />
      )}
    </div>
  );
}
