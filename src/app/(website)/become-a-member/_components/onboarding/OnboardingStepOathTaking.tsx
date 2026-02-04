"use client";

import { useMutation } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Doc } from '../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../convex/_generated/api';

type Props = {
  application: Doc<"personalInformation">;
};

export function OnboardingStepOathTaking({ application }: Props) {
  const setOnboardingStep = useMutation(api.backend.membership.setOnboardingStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    setError(null);
    setLoading(true);
    try {
      await setOnboardingStep({ step: "id_generation" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to continue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[#032a0d]/80">
        Attend the oath taking ceremony to formally complete your membership.
        You will receive the date and venue from the team.
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
          {loading ? "Saving…" : "Continue to ID Generation"}
        </Button>
      </div>
    </div>
  );
}
