"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { Doc } from "../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../convex/_generated/api";

type Props = {
  application: Doc<"personalInformation">;
};

export function OnboardingStepIdGeneration({ application }: Props) {
  const setOnboardingStep = useMutation(api.backend.membership.setOnboardingStep);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const profileUrl = `${window.location.origin}/member/${application.uniqueId}`;
    QRCode.toDataURL(profileUrl, {
      width: 200,
      margin: 2,
      color: { dark: "#032a0d", light: "#ffffff" },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [application.uniqueId]);

  const handleContinue = async () => {
    setError(null);
    setLoading(true);
    try {
      await setOnboardingStep({ step: "oath_taking" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to continue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[#032a0d]/80">
        Your member ID has been generated. You are now a member of Pearl of the
        Orient International Auxiliary Chaplain Values Educators Inc.
      </p>

      {/* Profile ID card - aligned with reference layout */}
      <div className="rounded-2xl border border-[#032a0d]/20 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col items-center gap-4 shrink-0 border-t p-4">
          <div className="rounded-lg border border-[#032a0d]/20 bg-[#032a0d]/5 px-4 py-3 text-center">
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-[#032a0d]/70">
              Member ID
            </p>
            <p className="font-serif text-lg sm:text-xl font-semibold text-[#032a0d] mt-0.5">
              {application.uniqueId}
            </p>
          </div>
          {qrDataUrl && (
            <div className="flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="QR code to member profile"
                className="size-32 sm:size-36 rounded-lg border border-[#032a0d]/15 bg-white p-1"
              />
              <p className="text-[10px] text-[#032a0d]/60 mt-1.5 text-center max-w-[140px]">
                Scan to view profile
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-[#032a0d]/70">
        Your digital ID and QR profile are ready. Continue to the final step
        for oath taking schedule and completion details.
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
          {loading ? "Saving..." : "Continue to Oath Taking"}
        </Button>
      </div>
    </div>
  );
}
