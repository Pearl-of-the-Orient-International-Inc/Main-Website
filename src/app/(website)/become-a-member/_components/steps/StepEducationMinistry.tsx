"use client";

import { Input } from "@/components/ui/input";
import { Field } from "../Field";
import type { ApplicationFormState } from "../types";

export function StepEducationMinistry({
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
    <div className="space-y-5">
      <div className="space-y-4">
        <h3 className="font-serif text-base sm:text-lg text-[#032a0d]">
          Educational background
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Elementary school (optional)">
            <Input
              value={form.elementarySchool}
              onChange={(e) =>
                updateFieldAction("elementarySchool", e.target.value)
              }
            />
          </Field>
          <Field label="Secondary school (optional)">
            <Input
              value={form.secondarySchool}
              onChange={(e) =>
                updateFieldAction("secondarySchool", e.target.value)
              }
            />
          </Field>
          <Field label="Tertiary / college (optional)">
            <Input
              value={form.tertiarySchool}
              onChange={(e) =>
                updateFieldAction("tertiarySchool", e.target.value)
              }
            />
          </Field>
          <Field label="Post-graduate studies (optional)">
            <Input
              value={form.postGraduateStudies}
              onChange={(e) =>
                updateFieldAction("postGraduateStudies", e.target.value)
              }
            />
          </Field>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-serif text-base sm:text-lg text-[#032a0d]">
          Ministerial work experience (optional)
        </h3>
        <p className="text-xs sm:text-sm text-[#032a0d]/70">
          You may list up to three relevant ministry roles.
        </p>
        <div className="space-y-3">
          {form.ministerialWorkExperience.map((exp, index) => (
            <div
              key={index}
              className="grid gap-3 sm:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)] rounded-lg border border-dashed border-[#032a0d]/20 px-3 py-3"
            >
              <Field label={`Role / description #${index + 1}`}>
                <Input
                  value={exp.jobDescription}
                  onChange={(e) => {
                    const copy = [...form.ministerialWorkExperience];
                    copy[index] = {
                      ...copy[index],
                      jobDescription: e.target.value,
                    };
                    updateFieldAction("ministerialWorkExperience", copy);
                  }}
                  placeholder="e.g. Hospital chaplain, youth pastor"
                />
              </Field>
              <Field label="Years (approx.)">
                <Input
                  value={exp.years}
                  onChange={(e) => {
                    const copy = [...form.ministerialWorkExperience];
                    copy[index] = { ...copy[index], years: e.target.value };
                    updateFieldAction("ministerialWorkExperience", copy);
                  }}
                  placeholder="e.g. 2 years"
                />
              </Field>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

