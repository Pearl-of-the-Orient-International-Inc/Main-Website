import type { RequirementKey, OnboardingStepId } from "../constants";
import type { ApplicationFormState } from "../types";

export type RequirementAttachments = Partial<Record<RequirementKey, string>>;

export type FrontendOnboardingMeta = {
  localId: string;
  uniqueId: string;
  applicationStatus: "Submitted" | "Under Review" | "Approved";
  onboardingStep: OnboardingStepId;
  requirementAttachments: RequirementAttachments;
};

export type FrontendOnboardingApplication = ApplicationFormState &
  FrontendOnboardingMeta;
