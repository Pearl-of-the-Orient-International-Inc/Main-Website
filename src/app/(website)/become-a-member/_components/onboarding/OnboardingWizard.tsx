/* eslint-disable react-hooks/exhaustive-deps */
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
  const { toast } = useToast();
  const uploadRequirementMutation = useUploadMemberRequirementMutation();
  const upsertRequirementsMutation = useUpsertMemberRequirementsMutation();
  const updateOnboardingStepMutation = useUpdateCurrentMemberOnboardingStepMutation();
  const updatePreOrientationProgressMutation =
    useUpdateCurrentMemberPreOrientationProgressMutation();
  const { data: currentRequirements } = useCurrentMemberRequirementsQuery();
  const { data: currentIdGenerationAsset, refetch: refetchCurrentIdGenerationAsset } =
    useCurrentMemberIdGenerationAssetQuery();
  const { data: currentChaplaincyTraining } =
    useCurrentMemberChaplaincyTrainingProgressQuery();
  const { data: currentOnboardingProgress } =
    useCurrentMemberOnboardingProgressQuery();
  const hasHydratedFromBackendRef = useRef(false);
  const hasHydratedProgressRef = useRef(false);
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
      Pick<
        FrontendOnboardingMeta,
        | "onboardingStep"
        | "requirementAttachments"
        | "preOrientationReadingConfirmed"
        | "preOrientationAssessmentAnswers"
      >
    >,
  ) => {
    onMetaChangeAction({
      localId: application.localId,
      uniqueId: application.uniqueId,
      applicationStatus: application.applicationStatus,
      onboardingStep: update.onboardingStep ?? application.onboardingStep,
      requirementAttachments:
        update.requirementAttachments ?? application.requirementAttachments,
      preOrientationReadingConfirmed:
        update.preOrientationReadingConfirmed ??
        application.preOrientationReadingConfirmed,
      preOrientationAssessmentAnswers:
        update.preOrientationAssessmentAnswers ??
        application.preOrientationAssessmentAnswers,
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
    if (currentStepId !== "oath_taking") return;
    if (currentIdGenerationAsset?.data.uniqueId) return;

    void refetchCurrentIdGenerationAsset();
  }, [currentStepId, currentIdGenerationAsset, refetchCurrentIdGenerationAsset]);

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

    try {
      const mergedAttachments = { ...application.requirementAttachments };

      if (attachments.length > 0) {
        const response = await upsertRequirementsMutation.mutateAsync({ attachments });

        const latestAttachments = response.data.attachments;
        for (const key of REQUIREMENT_KEYS) {
          const url = latestAttachments[key];
          if (typeof url === "string" && url.trim()) {
            mergedAttachments[key] = url;
          }
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

  const handlePreOrientationContinue = async (
    lessonIds: number[],
    isCompleted: boolean,
  ) => {
    try {
      await updatePreOrientationProgressMutation.mutateAsync({
        completedLessonIds: lessonIds,
        isCompleted,
      });
      await handlePersistOnboardingStep("payment_checkout");
      toast({
        title: isCompleted ? "Pre-orientation completed" : "Pre-orientation saved",
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
          initialReadingConfirmed={application.preOrientationReadingConfirmed}
          initialAssessmentAnswers={application.preOrientationAssessmentAnswers}
          onProgressChangeAction={handlePreOrientationProgressChange}
          onMetaProgressChangeAction={applyMetaUpdate}
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
        <OnboardingStepOathTaking
          uniqueId={currentIdGenerationAsset?.data.uniqueId ?? "Not yet assigned"}
        />
      )}
    </div>
  );
}
