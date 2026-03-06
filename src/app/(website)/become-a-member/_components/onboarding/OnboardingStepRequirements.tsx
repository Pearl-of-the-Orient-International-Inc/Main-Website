"use client";

import { useMemo, useState } from "react";
import { Expand, EyeIcon, Info } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { REQUIREMENT_LABELS, type RequirementKey } from "../constants";
import type { RequirementAttachments } from "./types";

type Props = {
  attachments: RequirementAttachments;
  onAttachmentUploadAction: (key: RequirementKey, file: File) => Promise<void>;
  onContinueAction: () => Promise<void> | void;
};

type RequirementGroup = {
  id:
    | "valid_id"
    | "educational_certificates"
    | "ministerial_experience"
    | "letter_of_intent"
    | "endorsement_letters"
    | "civil_documents"
    | "supporting_documents";
  title: string;
  description: string;
  required: boolean;
  keys: RequirementKey[];
  sampleGuide: string;
};

type ReviewDecision = "approved" | "rejected";
type ChecklistStatus =
  | "pending"
  | "waiting_verification"
  | "approved"
  | "rejected";

const REQUIREMENT_GROUPS: RequirementGroup[] = [
  {
    id: "valid_id",
    title: "Valid ID pictures",
    description: "Required",
    required: true,
    keys: ["photo_2x2"],
    sampleGuide:
      "2x2 picture (white background) is required.",
  },
  {
    id: "educational_certificates",
    title: "Educational Certificates",
    description: "Optional / To Follow",
    required: false,
    keys: [
      "hs_baccalaureate_diploma",
      "two_three_year_program_diploma",
      "masters_degree_diploma",
      "doctoral_degree_diploma",
    ],
    sampleGuide:
      "You can submit these now or mark as to-follow. Upload any level that applies to your background.",
  },
  {
    id: "ministerial_experience",
    title: "Ministerial Experience",
    description: "Optional / To Follow",
    required: false,
    keys: ["ordination_certificate", "pastors_recommendation_letter"],
    sampleGuide:
      "If pastor: upload ordination certificate. If not pastor: upload recommendation letter.",
  },
  {
    id: "letter_of_intent",
    title: "Letter of Intent",
    description: "Optional / To Follow",
    required: false,
    keys: ["letter_of_intent"],
    sampleGuide: "Letter of Intent can be submitted now or to-follow.",
  },
  {
    id: "endorsement_letters",
    title: "Endorsement Letters",
    description: "Optional / To Follow",
    required: false,
    keys: ["endorsement_letters"],
    sampleGuide: "Endorsement letters can be submitted now or to-follow.",
  },
  {
    id: "civil_documents",
    title: "Civil Documents",
    description: "Optional / To Follow",
    required: false,
    keys: ["marriage_contract"],
    sampleGuide:
      "Marriage Contract is optional and only applicable if married.",
  },
  {
    id: "supporting_documents",
    title: "Supporting Documents (either of the 3)",
    description: "Optional / To Follow",
    required: false,
    keys: ["clearance_barangay", "clearance_police", "clearance_nbi"],
    sampleGuide:
      "Barangay, Police, or NBI clearance can be submitted now or to-follow.",
  },
];

const SAMPLE_PREVIEW_BY_REQUIREMENT: Partial<
  Record<
  RequirementKey,
  {
    imageSrc: string;
    title: string;
    description: string;
  }
  >
> = {
  photo_2x2: {
    imageSrc: "/requirement-samples/1.png",
    title: "2x2 ID Picture Sample",
    description: "Clear face, white background, and proper formal appearance.",
  },
  clearance_barangay: {
    imageSrc: "/requirement-samples/3.png",
    title: "Barangay Clearance Sample",
    description: "You may submit this now or later.",
  },
  clearance_police: {
    imageSrc: "/requirement-samples/4.png",
    title: "Police Clearance Sample",
    description: "You may submit this now or later.",
  },
  clearance_nbi: {
    imageSrc: "/requirement-samples/5.png",
    title: "NBI Clearance Sample",
    description: "You may submit this now or later.",
  },
  marriage_contract: {
    imageSrc: "/requirement-samples/2.png",
    title: "Marriage Contract Sample",
    description: "Optional document. Submit if married.",
  },
};

export function OnboardingStepRequirements({
  attachments,
  onAttachmentUploadAction,
  onContinueAction,
}: Props) {
  const [uploading, setUploading] = useState<RequirementKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  const requiredComplete = Boolean(attachments.photo_2x2);
  // TODO: Replace with backend-provided review decisions once available.
  const requirementDecisionByKey = useMemo<
    Partial<Record<RequirementKey, ReviewDecision>>
  >(() => ({}), []);

  const checklistStatus = useMemo(() => {
    return REQUIREMENT_GROUPS.reduce<Record<RequirementGroup["id"], ChecklistStatus>>(
      (acc, group) => {
        const uploadedKeys = group.keys.filter((key) => Boolean(attachments[key]));
        if (uploadedKeys.length === 0) {
          acc[group.id] = "pending";
          return acc;
        }

        const hasRejected = uploadedKeys.some(
          (key) => requirementDecisionByKey[key] === "rejected",
        );
        if (hasRejected) {
          acc[group.id] = "rejected";
          return acc;
        }

        const allApproved = uploadedKeys.every(
          (key) => requirementDecisionByKey[key] === "approved",
        );
        acc[group.id] = allApproved ? "approved" : "waiting_verification";
        return acc;
      },
      {
        valid_id: "pending",
        educational_certificates: "pending",
        ministerial_experience: "pending",
        letter_of_intent: "pending",
        endorsement_letters: "pending",
        civil_documents: "pending",
        supporting_documents: "pending",
      },
    );
  }, [attachments, requirementDecisionByKey]);

  const handleFileChange = async (key: RequirementKey, file: File | null) => {
    if (!file) return;
    setError(null);
    setUploading(key);
    try {
      await onAttachmentUploadAction(key, file);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const handleMarkComplete = async () => {
    if (!requiredComplete) return;
    setError(null);
    setCompleting(true);
    try {
      await Promise.resolve(onContinueAction());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to continue");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
      <div className="overflow-hidden border border-black/10 bg-white">
        <div className="bg-[#032a0d] px-5 py-4 text-white">
          <h2 className="text-lg">Submission of Requirements</h2>
          
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {REQUIREMENT_GROUPS.map((group) => (
            <section key={group.id} className="space-y-3">
              <div>
                <h3 className="font-serif text-xl text-[#032a0d]">{group.title}</h3>
                <p className="text-xs text-[#032a0d]/70 sm:text-sm">{group.description}</p>
              </div>

              <div className="rounded border border-dashed border-[#032a0d]/25 bg-[#032a0d]/5 px-3 py-3 text-xs text-[#032a0d]/80 sm:text-sm">
                {group.sampleGuide}
              </div>

              <div className="grid gap-3">
                {group.keys.map((key) => (
                  <RequirementUploadRow
                    key={key}
                    requirementKey={key}
                    label={REQUIREMENT_LABELS[key]}
                    required={group.required}
                    fileDataUrl={attachments[key]}
                    uploading={uploading === key}
                    onFileChange={(file) => handleFileChange(key, file)}
                  />
                ))}
              </div>
            </section>
          ))}

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500 sm:text-sm">
              Only the 2x2 ID picture is required to proceed to the next step.
            </p>
            <Button
              type="button"
              onClick={handleMarkComplete}
              disabled={!requiredComplete || completing}
              className="bg-[#032a0d] hover:bg-[#032a0d]/90"
            >
              {completing ? "Saving..." : "Continue to Pre-orientation"}
            </Button>
          </div>
        </div>
      </div>

      <aside className="self-start lg:sticky lg:top-6">
        <div className="overflow-hidden border border-black/10 bg-white">
          <div className="bg-[#032a0d] px-5 py-4 text-white">
            <h2 className="text-lg">Document Checklist</h2>
          </div>
          <div className="space-y-4 p-5 text-sm text-neutral-700">
            {REQUIREMENT_GROUPS.map((group, index) => (
              <ChecklistStatusCard
                key={group.id}
                index={index}
                title={group.title}
                status={checklistStatus[group.id]}
              />
            ))}

            <div className="flex gap-2 rounded border border-dashed border-[#032a0d]/25 bg-[#032a0d]/5 px-3 py-3 text-xs text-[#032a0d]/80">
              <Info className="mt-0.5 size-4 shrink-0 text-[#032a0d]" />
              <p>
                Required now: 2x2 ID picture. All other documents can be
                submitted to follow.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function ChecklistStatusCard({
  index,
  title,
  status,
}: {
  index: number;
  title: string;
  status: ChecklistStatus;
}) {
  const statusConfig: Record<
    ChecklistStatus,
    { label: string; cardClass: string; dotClass: string }
  > = {
    pending: {
      label: "Pending",
      cardClass: "border-black/10 bg-neutral-50",
      dotClass: "bg-neutral-500",
    },
    waiting_verification: {
      label: "Waiting for Verification",
      cardClass: "border-blue-300 bg-blue-50",
      dotClass: "bg-blue-600",
    },
    approved: {
      label: "Approved",
      cardClass: "border-emerald-300 bg-emerald-50",
      dotClass: "bg-emerald-600",
    },
    rejected: {
      label: "Rejected / Declined",
      cardClass: "border-red-300 bg-red-50",
      dotClass: "bg-red-600",
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`rounded border px-3 py-3 ${config.cardClass}`}>
      <p className="font-semibold text-[#032a0d]">
        {index + 1}. {title}
      </p>
      <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#032a0d]/75">
        <span className={`size-2 rounded-full ${config.dotClass}`} />
        {config.label}
      </p>
    </div>
  );
}

function RequirementUploadRow({
  requirementKey,
  label,
  required,
  fileDataUrl,
  uploading,
  onFileChange,
}: {
  requirementKey: RequirementKey;
  label: string;
  required: boolean;
  fileDataUrl: string | undefined;
  uploading: boolean;
  onFileChange: (file: File | null) => void;
}) {
  const inputId = `req-${requirementKey}`;

  return (
    <div className="rounded border border-black/10 bg-white px-3 py-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm text-[#032a0d]">{label}</p>
          <RequirementSampleHelp requirementKey={requirementKey} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#032a0d]/70">
          {required ? "Required" : "Optional / To Follow"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          id={inputId}
          onChange={(e) => {
            const file = e.target.files?.[0];
            onFileChange(file ?? null);
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
          {uploading ? "Uploading..." : fileDataUrl ? "Replace" : "Upload"}
        </Button>

        {fileDataUrl && (
          <a
            href={fileDataUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#032a0d]/80 underline hover:text-[#032a0d]"
          >
            View file
          </a>
        )}
      </div>
    </div>
  );
}

function RequirementSampleHelp({
  requirementKey,
}: {
  requirementKey: RequirementKey;
}) {
  const sample = SAMPLE_PREVIEW_BY_REQUIREMENT[requirementKey];
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  if (!sample) return null;

  return (
    <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
      <HoverCard openDelay={120} closeDelay={80}>
        <HoverCardTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="mt-1 flex items-center gap-1 text-sm font-medium text-[#032a0d]/75 hover:text-[#032a0d]"
          >
            <EyeIcon className="size-4" /> View Sample
          </Button>
        </HoverCardTrigger>
        <HoverCardContent side="right" className="w-80 border-[#032a0d]/20 p-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#032a0d]">{sample.title}</p>
            <div className="relative aspect-video overflow-hidden rounded border border-[#032a0d]/10 bg-neutral-50">
              <Image
                src={sample.imageSrc}
                fill
                alt={`${sample.title} preview`}
                className="h-full w-full object-contain"
                unoptimized
              />
            </div>
            <p className="text-xs text-[#032a0d]/70">{sample.description}</p>
            <div className="flex justify-end">
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 border-[#032a0d]/30 px-2 text-xs text-[#032a0d] hover:bg-[#032a0d]/5"
                >
                  <Expand className="mr-1 size-3.5" />
                  Full screen
                </Button>
              </DialogTrigger>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      <DialogContent className="max-w-5xl! border-[#032a0d]/20 p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-[#032a0d]">{sample.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="overflow-hidden rounded border border-[#032a0d]/10 bg-neutral-50">
            <Image
              src={sample.imageSrc}
              alt={`${sample.title} full preview`}
              width={1600}
              height={1100}
              className="max-h-[75vh] w-full object-contain"
              unoptimized
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[#032a0d]/70">{sample.description}</p>
            <a
              href={sample.imageSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#032a0d] underline underline-offset-2 hover:text-[#032a0d]/80"
            >
              Open original
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
