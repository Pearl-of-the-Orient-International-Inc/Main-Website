"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CLEARANCE_KEYS,
  REQUIREMENT_KEYS,
  REQUIREMENT_LABELS,
  type RequirementKey,
} from "../constants";
import { Doc, Id } from '../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../convex/_generated/api';

type Props = {
  application: Doc<"personalInformation">;
};

export function OnboardingStepRequirements({ application }: Props) {
  const generateUploadUrl = useMutation(api.backend.membership.generateUploadUrl);
  const saveRequirement = useMutation(
    api.backend.membership.saveRequirementAttachment,
  );
  const setOnboardingStep = useMutation(api.backend.membership.setOnboardingStep);
  const attachments = application.requirementAttachments ?? {};
  const [uploading, setUploading] = useState<RequirementKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  const handleFileChange = async (key: RequirementKey, file: File | null) => {
    if (!file) return;
    setError(null);
    setUploading(key);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = (await res.json()) as { storageId: Id<"_storage"> };
      await saveRequirement({ requirementKey: key, storageId });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const handleMarkComplete = async () => {
    setError(null);
    setCompleting(true);
    try {
      await setOnboardingStep({ step: "pre_orientation" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to continue");
    } finally {
      setCompleting(false);
    }
  };

  const hasClearance = CLEARANCE_KEYS.some((k) => attachments[k]);
  const requiredNonClearance = REQUIREMENT_KEYS.filter(
    (k) => !CLEARANCE_KEYS.includes(k),
  );
  const allRequired = requiredNonClearance.every((k) => attachments[k]);
  const canComplete = allRequired && hasClearance;

  return (
    <div className="space-y-6">
      <p className="text-sm text-[#032a0d]/80">
        Upload the required documents below. For clearances, at least one of
        Barangay, Police, or NBI is required.
      </p>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <ul className="space-y-4">
        {REQUIREMENT_KEYS.map((key) => (
          <RequirementRow
            key={key}
            requirementKey={key}
            label={REQUIREMENT_LABELS[key]}
            storageId={attachments[key]}
            uploading={uploading === key}
            onFileChange={(file) => handleFileChange(key, file)}
          />
        ))}
      </ul>

      <div className="flex justify-end pt-4">
        <Button
          type="button"
          onClick={handleMarkComplete}
          // disabled={!canComplete || completing}
          className="bg-[#032a0d] hover:bg-[#032a0d]/90"
        >
          {completing ? "Saving…" : "Continue to Pre-orientation"}
        </Button>
      </div>
    </div>
  );
}

function RequirementRow({
  requirementKey,
  label,
  storageId,
  uploading,
  onFileChange,
}: {
  requirementKey: RequirementKey;
  label: string;
  storageId: Id<"_storage"> | undefined;
  uploading: boolean;
  onFileChange: (file: File | null) => void;
}) {
  const fileUrl = useQuery(
    api.backend.membership.getFileUrl,
    storageId ? { storageId } : "skip",
  );
  const inputId = `req-${requirementKey}`;

  return (
    <li className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg border border-[#032a0d]/10 bg-[#032a0d]/5">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#032a0d]">{label}</p>
        {storageId && (
          <p className="text-xs text-[#032a0d]/70 mt-0.5">
            {fileUrl ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#032a0d]"
              >
                View uploaded file
              </a>
            ) : (
              "Uploaded"
            )}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          id={inputId}
          onChange={(e) => {
            const f = e.target.files?.[0];
            onFileChange(f ?? null);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => document.getElementById(inputId)?.click()}
          className="border-[#032a0d]/30 text-[#032a0d] hover:bg-[#032a0d]/5"
        >
          {uploading ? "Uploading…" : storageId ? "Replace" : "Upload"}
        </Button>
      </div>
    </li>
  );
}
