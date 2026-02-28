"use client";

import { CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Field } from "../Field";
import type { ApplicationFormState, BranchOfService } from "../types";

const BRANCH_OPTIONS: BranchOfService[] = [
  "Humanitarian",
  "Hospital and Care",
  "Military/PNP",
  "School",
  "Corporate",
  "Disaster & Rescue Operations",
  "Prison",
  "Security",
  "Government",
  "DSWD",
  "Others",
];

export function StepChurchBackground({
  form,
  updateFieldAction,
}: {
  form: ApplicationFormState;
  updateFieldAction: <K extends keyof ApplicationFormState>(
    key: K,
    value: ApplicationFormState[K],
  ) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Church / Organization affiliation" required>
        <Input
          value={form.churchOrganizationAffiliation}
          onChange={(e) =>
            updateFieldAction("churchOrganizationAffiliation", e.target.value)
          }
          placeholder="Name of church or organization"
        />
      </Field>

      <Field label="Church address" required>
        <Input
          value={form.churchAddress}
          onChange={(e) => updateFieldAction("churchAddress", e.target.value)}
          placeholder="Street, barangay, city / municipality"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Current position / role">
          <Select
            value={form.position}
            onValueChange={(value) =>
              updateFieldAction(
                "position",
                value as ApplicationFormState["position"],
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Church Worker">Church Worker</SelectItem>
              <SelectItem value="Pastor">Pastor</SelectItem>
              <SelectItem value="Rev.">Rev.</SelectItem>
              <SelectItem value="Bishop">Bishop</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="If Others, please specify">
          <Input
            value={form.positionOthers}
            onChange={(e) => updateFieldAction("positionOthers", e.target.value)}
            placeholder="Specify position or role"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Height (optional)">
          <Input
            value={form.height}
            onChange={(e) => updateFieldAction("height", e.target.value)}
            placeholder="e.g. 170 cm"
          />
        </Field>
        <Field label="Weight (optional)">
          <Input
            value={form.weight}
            onChange={(e) => updateFieldAction("weight", e.target.value)}
            placeholder="e.g. 70 kg"
          />
        </Field>
        <Field label="Blood type (optional)">
          <Input
            value={form.bloodType}
            onChange={(e) => updateFieldAction("bloodType", e.target.value)}
            placeholder="e.g. O+"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Color of eyes (optional)">
          <Input
            value={form.colorOfEyes}
            onChange={(e) => updateFieldAction("colorOfEyes", e.target.value)}
          />
        </Field>
        <Field label="Color of skin (optional)">
          <Input
            value={form.colorOfSkin}
            onChange={(e) => updateFieldAction("colorOfSkin", e.target.value)}
          />
        </Field>
        <Field label="SSS number (optional)">
          <Input
            value={form.sssNumber}
            onChange={(e) => updateFieldAction("sssNumber", e.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="TIN number (optional)">
          <Input
            value={form.tinNumber}
            onChange={(e) => updateFieldAction("tinNumber", e.target.value)}
          />
        </Field>
        <Field label="Skills / talents (optional)">
          <Input
            value={form.skillsTalents}
            onChange={(e) => updateFieldAction("skillsTalents", e.target.value)}
            placeholder="e.g. counseling, teaching, music"
          />
        </Field>
      </div>

      <div className="space-y-2">
        <Field
          label="Preferred branch/es of service (optional)"
          hint="You may select multiple options that best describe where you feel called to serve."
        >
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
            {BRANCH_OPTIONS.map((branch) => {
              const isSelected = form.branchOfService.includes(branch);
              return (
                <button
                  key={branch}
                  type="button"
                  onClick={() => {
                    updateFieldAction(
                      "branchOfService",
                      isSelected
                        ? form.branchOfService.filter((b) => b !== branch)
                        : [...form.branchOfService, branch],
                    );
                  }}
                  className={[
                    "flex items-center justify-between rounded-full border px-3 py-1.5 transition-colors",
                    isSelected
                      ? "border-[#032a0d] bg-[#032a0d]/5 text-[#032a0d]"
                      : "border-neutral-200 text-neutral-600 hover:border-[#032a0d]/40 hover:text-[#032a0d]",
                  ].join(" ")}
                >
                  <span className="truncate">{branch}</span>
                  {isSelected && (
                    <CheckCircle2 className="ml-1 size-3.5 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="If Others, please specify (optional)">
          <Input
            value={form.branchOfServiceOthers}
            onChange={(e) =>
              updateFieldAction("branchOfServiceOthers", e.target.value)
            }
            placeholder="Specify other branch of service"
          />
        </Field>
      </div>
    </div>
  );
}
