"use client";

import { CalendarCheck2 } from "lucide-react";

import { Doc } from "../../../../../../convex/_generated/dataModel";

type Props = {
  application: Doc<"personalInformation">;
};

export function OnboardingStepOathTaking({ application }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#032a0d]/15 bg-[#032a0d]/5 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <CalendarCheck2 className="mt-0.5 size-5 shrink-0 text-[#032a0d]" />
          <div className="space-y-1">
            <h3 className="font-serif text-lg text-[#032a0d] sm:text-xl">
              Final Step: Oath Taking
            </h3>
            <p className="text-sm text-[#032a0d]/80">
              Attend the oath taking ceremony to formally complete your
              onboarding. The leadership team will provide your schedule and
              venue instructions.
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm text-[#032a0d]/75">
        You have completed the onboarding requirements up to this final step.
        Please wait for official confirmation details for member ID{" "}
        <span className="font-semibold text-[#032a0d]">{application.uniqueId}</span>.
      </p>
    </div>
  );
}
