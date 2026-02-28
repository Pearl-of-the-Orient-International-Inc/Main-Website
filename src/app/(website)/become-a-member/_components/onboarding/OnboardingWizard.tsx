"use client";

import {
  onboardingSteps,
  type OnboardingStepId,
} from "../constants";
import { OnboardingStepRequirements } from "./OnboardingStepRequirements";
import { OnboardingStepPreOrientation } from "./OnboardingStepPreOrientation";
import { OnboardingStepChaplaincy101 } from "./OnboardingStepChaplaincy101";
import { OnboardingStepOathTaking } from "./OnboardingStepOathTaking";
import { OnboardingStepIdGeneration } from "./OnboardingStepIdGeneration";
import { Doc } from '../../../../../../convex/_generated/dataModel';

const STEP_ORDER: OnboardingStepId[] = [
  "application",
  "requirements",
  "pre_orientation",
  "chaplaincy_101",
  "id_generation",
  "oath_taking",
];

function stepIndex(stepId: OnboardingStepId | undefined): number {
  if (!stepId) return 0;
  const i = STEP_ORDER.indexOf(stepId);
  return i >= 0 ? i : 0;
}

type Props = {
  application: Doc<"personalInformation">;
};

export function OnboardingWizard({ application }: Props) {
  const currentStepId = (application.onboardingStep ?? "requirements") as OnboardingStepId;
  const currentIndex = stepIndex(currentStepId);
  const totalSteps = onboardingSteps.length;
  const progress = ((currentIndex + 1) / totalSteps) * 100;
  const currentStepMeta = onboardingSteps[currentIndex];

  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#032a0d]/15 bg-white shadow-sm p-5 sm:p-6 lg:p-7">
          <div className="mb-6">
            <p className="text-xs sm:text-sm uppercase text-[#032a0d]/70">
              Onboarding step {currentIndex + 1} of {totalSteps}
            </p>
            <h2 className="font-serif text-lg sm:text-xl text-[#032a0d] mt-1">
              {currentStepMeta?.title ?? currentStepId}
            </h2>
            <span className="text-[11px] sm:text-xs text-[#032a0d]/70">
              {currentStepMeta?.description ?? ""}
            </span>
            <div className="h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden mt-4">
              <div
                className="h-full rounded-full bg-[#032a0d] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-6">
            {currentStepId === "requirements" && (
              <OnboardingStepRequirements application={application} />
            )}
            {currentStepId === "pre_orientation" && (
              <OnboardingStepPreOrientation application={application} />
            )}
            {currentStepId === "chaplaincy_101" && (
              <OnboardingStepChaplaincy101 application={application} />
            )}
            {currentStepId === "oath_taking" && (
              <OnboardingStepOathTaking application={application} />
            )}
            {currentStepId === "id_generation" && (
              <OnboardingStepIdGeneration application={application} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
