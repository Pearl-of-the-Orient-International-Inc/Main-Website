"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import SignatureInput from "@/components/ui/signature-input";
import { Field } from "../Field";
import type { ApplicationFieldErrors, ApplicationFormState } from "../types";
import { readFileAsDataUrl } from "../utils";

export function StepReferencesReview({
  form,
  updateFieldAction,
  handleSignatureChangeAction,
  fieldErrors = {},
}: {
  form: ApplicationFormState;
  updateFieldAction: <K extends keyof ApplicationFormState>(
    key: K,
    value: ApplicationFormState[K],
  ) => void;
  handleSignatureChangeAction: (signature: string | null) => void;
  fieldErrors?: ApplicationFieldErrors;
}) {
  const [signatureMode, setSignatureMode] = useState<"draw" | "upload">("draw");

  useEffect(() => {
    if (!form.signatureUrl.startsWith("data:image")) return;

    const canvas = document.createElement("canvas");
    canvas.width = 420;
    canvas.height = 200;

    if (form.signatureUrl === canvas.toDataURL()) {
      handleSignatureChangeAction(null);
    }
  }, [form.signatureUrl, handleSignatureChangeAction]);

  const handleSignatureUploadAction = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    try {
      const signatureDataUrl = await readFileAsDataUrl(file);
      handleSignatureChangeAction(signatureDataUrl);
    } catch {
      // Keep the current signature if file reading fails.
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h3 className="font-serif text-base text-[#032a0d] sm:text-lg">
          Character references
        </h3>
        <p className="text-xs text-[#032a0d]/70 sm:text-sm">
          Please provide at least one person who can vouch for your character and
          ministry.
        </p>
        <div className="space-y-3">
          {form.characterReferences.map((reference, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-lg border border-dashed border-[#032a0d]/20 px-3 py-3 sm:grid-cols-3"
            >
              <Field label={`Name #${index + 1}`}>
                <Input
                  value={reference.name}
                  onChange={(event) => {
                    const copy = [...form.characterReferences];
                    copy[index] = { ...copy[index], name: event.target.value };
                    updateFieldAction("characterReferences", copy);
                  }}
                  placeholder="Full name"
                />
              </Field>
              <Field label="Position / relationship">
                <Input
                  value={reference.position}
                  onChange={(event) => {
                    const copy = [...form.characterReferences];
                    copy[index] = { ...copy[index], position: event.target.value };
                    updateFieldAction("characterReferences", copy);
                  }}
                  placeholder="e.g. Senior Pastor"
                />
              </Field>
              <Field label="Contact number">
                <Input
                  value={reference.contactNumber}
                  onChange={(event) => {
                    const copy = [...form.characterReferences];
                    copy[index] = {
                      ...copy[index],
                      contactNumber: event.target.value,
                    };
                    updateFieldAction("characterReferences", copy);
                  }}
                  placeholder="e.g. 09XX XXX XXXX"
                />
              </Field>
            </div>
          ))}
        </div>

        <Field
          label="Applicant's signature"
          hint="Use your mouse, trackpad, or finger to sign inside the box."
        >
          <div className="mt-1 space-y-3">
            <div className="inline-flex rounded-md border border-[#032a0d]/20 p-1">
              <button
                type="button"
                onClick={() => setSignatureMode("draw")}
                className={[
                  "rounded px-3 py-1 text-xs transition-colors sm:text-sm",
                  signatureMode === "draw"
                    ? "bg-[#032a0d] text-white"
                    : "text-[#032a0d] hover:bg-[#032a0d]/10",
                ].join(" ")}
              >
                Draw signature
              </button>
              <button
                type="button"
                onClick={() => setSignatureMode("upload")}
                className={[
                  "rounded px-3 py-1 text-xs transition-colors sm:text-sm",
                  signatureMode === "upload"
                    ? "bg-[#032a0d] text-white"
                    : "text-[#032a0d] hover:bg-[#032a0d]/10",
                ].join(" ")}
              >
                Upload e-signature
              </button>
            </div>

            {signatureMode === "draw" ? (
              <SignatureInput onSignatureChange={handleSignatureChangeAction} />
            ) : (
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUploadAction}
                  className="max-w-[420px]"
                />
                <p className="text-[10px] text-[#032a0d]/70 sm:text-xs">
                  Upload a transparent PNG or clear image of your signature.
                </p>
                {form.signatureUrl ? (
                  <div className="max-w-[420px] overflow-hidden rounded-md border border-[#032a0d]/20 bg-white p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.signatureUrl}
                      alt="Uploaded e-signature preview"
                      className="h-auto max-h-[180px] w-full object-contain"
                    />
                  </div>
                ) : null}
              </div>
            )}

            {form.signatureUrl ? (
              <p className="mt-1 text-[10px] text-[#032a0d]/70 sm:text-xs">
                {signatureMode === "upload"
                  ? "E-signature attached."
                  : "Signature captured. You may clear and redraw if needed."}
              </p>
            ) : null}
          </div>
        </Field>
      </div>

      <div
        className={cn(
          "space-y-3 rounded-lg border bg-[#032a0d]/3 px-4 py-3 text-xs text-[#032a0d]/80 sm:text-sm",
          fieldErrors.declarationTruthConfirmed || fieldErrors.monthlyPledgeConfirmed
            ? "border-destructive"
            : "border-[#032a0d]/15",
        )}
      >
        <div className="flex items-start gap-2">
          <Checkbox
            id="declaration-truth"
            checked={form.declarationTruthConfirmed}
            onCheckedChange={(checked) =>
              updateFieldAction("declarationTruthConfirmed", checked === true)
            }
            className="mt-0.5"
          />
          <label htmlFor="declaration-truth" className="cursor-pointer">
            I do hereby certify that all information above is true and correct
            with the best of my knowledge.
          </label>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox
            id="monthly-pledge"
            checked={form.monthlyPledgeConfirmed}
            onCheckedChange={(checked) =>
              updateFieldAction("monthlyPledgeConfirmed", checked === true)
            }
            className="mt-0.5"
          />
          <label htmlFor="monthly-pledge" className="cursor-pointer">
            I do hereby agree that I will contribute and support the monthly pledge
            required for the chaplain&apos;s operational expenses, program, and
            activities.
          </label>
        </div>
        <div className="flex gap-3 pt-1">
          <Info className="mt-0.5 size-4 shrink-0 text-[#032a0d]" />
          <p>
            Final endorsement and membership approval will be communicated to you
            by the leadership.
          </p>
        </div>
      </div>
    </div>
  );
}
