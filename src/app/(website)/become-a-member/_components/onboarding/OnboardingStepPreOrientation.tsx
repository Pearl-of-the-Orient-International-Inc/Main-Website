"use client";

import { useMutation } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Doc } from '../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../convex/_generated/api';

type Props = {
  application: Doc<"personalInformation">;
};

export function OnboardingStepPreOrientation({ application }: Props) {
  const setOnboardingStep = useMutation(api.backend.membership.setOnboardingStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    setError(null);
    setLoading(true);
    try {
      await setOnboardingStep({ step: "chaplaincy_101" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to continue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[#032a0d]/80">
        Complete your pre-orientation to learn about Pearl of the Orient and the
        chaplaincy process. You will receive instructions and materials from the
        team.
      </p>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleContinue}
          disabled={loading}
          className="bg-[#032a0d] hover:bg-[#032a0d]/90"
        >
          {loading ? "Saving…" : "Continue to Chaplaincy 101"}
        </Button>
      </div>
    </div>
  );
}
