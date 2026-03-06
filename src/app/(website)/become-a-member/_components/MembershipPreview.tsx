import { CheckIcon } from "lucide-react";
import type { ApplicationFormState, BranchOfService } from "./types";

function formatEducationEntries(entries: string[]): string {
  const cleaned = entries.map((item) => item.trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned.join(" | ") : "N/A";
}

export function MembershipPreview({ form }: { form: ApplicationFormState }) {
  const fullName = [form.firstName, form.lastName].filter(Boolean).join(" ");
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const formattedDate = new Date(now).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedDob = new Date(form.birthday).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const branchChecked = (label: BranchOfService) =>
    form.branchOfService.includes(label) ? (
      <div className="size-3.5 border flex items-center justify-center text-white bg-[#032a0d]">
        <CheckIcon className="size-3" />
      </div>
    ) : (
      <div className="size-3.5 border border-black"></div>
    );

  return (
    <div
      style={{
        backgroundImage: `url(/main/paper-bg.jpg)`,
      }}
      className="rounded-2xl border bg-cover bg-center shadow-sm px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
    >
      <div className="mx-auto max-w-3xl text-[11px] sm:text-xs md:text-sm leading-relaxed text-neutral-900">
        <div className="text-center mb-4 sm:mb-5">
          <p className="text-sm font-semibold font-serif uppercase text-[#032a0d]">
            Pearl of the Orient International
          </p>
          <p className="text-sm font-semibold font-serif uppercase text-[#032a0d]">
            Auxiliary Chaplains Values Educators Inc.
          </p>
          <p className="mt-2 font-semibold underline uppercase">
            Membership Application Form
          </p>
        </div>

        {form.photoUrl ? (
          <div className="ml-auto mb-2 h-24 w-20 border-2 border-black overflow-hidden bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.photoUrl}
              alt="Applicant photo"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="border-2 border-black ml-auto size-20 mb-2 flex items-center justify-center text-[9px]">
            PHOTO
          </div>
        )}

        <div className="flex mb-3">
          <span className="mr-1 font-medium">Date:</span>
          <span className="border-b border-neutral-400 min-w-30 inline-block px-1">
            {formattedDate}
          </span>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-medium">Position:</span>
          {["Church Worker", "Pastor", "Rev.", "Bishop", "Others"].map((pos) => {
            const typed =
              pos === "Church Worker" ||
              pos === "Pastor" ||
              pos === "Rev." ||
              pos === "Bishop" ||
              pos === "Others"
                ? pos
                : "Others";
            const isSelected = form.position === typed;
            return (
              <span key={pos} className="flex items-center gap-1">
                {isSelected ? (
                  <div className="size-3.5 border flex items-center justify-center text-white bg-[#032a0d]">
                    <CheckIcon className="size-3" />
                  </div>
                ) : (
                  <div className="size-3.5 border border-black"></div>
                )}
                <span>{pos}</span>
              </span>
            );
          })}
          {form.position === "Others" && (
            <span className="ml-2 border-b border-neutral-400 min-w-30 inline-block px-1">
              {form.positionOthers || "N/A"}
            </span>
          )}
        </div>

        <InlineField label="Name" value={fullName || "N/A"} />
        <div className="flex w-full flex-wrap items-center gap-x-4">
          <InlineField label="Address" value={form.address || "N/A"} />
          <InlineField label="Phone Number" value={form.phoneNumber || "N/A"} />
        </div>

        <div className="flex w-full items-center gap-4">
          <InlineField label="Civil Status" value={form.civilStatus || "N/A"} />
          <InlineField label="Gender" value={form.gender || "N/A"} />
          <InlineField label="Nationality" value={form.nationality || "N/A"} />
        </div>
        <div className="flex w-full items-center gap-x-4">
          <InlineField label="Birthday" value={formattedDob || "N/A"} />
          <InlineField label="Age" value={`${form.age} years old` || "N/A"} />
        </div>

        <InlineField
          label="Church/Organization Affiliation"
          value={form.churchOrganizationAffiliation || "N/A"}
        />
        <InlineField label="Address" value={form.churchAddress || "N/A"} />
        <InlineField
          label="Region/Province"
          value={form.regionProvince || "N/A"}
        />

        <div className="w-full flex items-center gap-x-4">
          <InlineField label="Height" value={`${form.height} cm` || "N/A"} />
          <InlineField label="Weight" value={`${form.weight} kg` || "N/A"} />
          <InlineField label="Blood Type" value={form.bloodType || "N/A"} />
        </div>
        <div className="w-full flex items-center gap-x-4">
          <InlineField label="Color of Eyes" value={form.colorOfEyes || "N/A"} />
          <InlineField label="Color of Skin" value={form.colorOfSkin || "N/A"} />
        </div>

        <div className="w-full flex items-center gap-x-4">
          <InlineField label="SSS #" value={form.sssNumber || "N/A"} />
          <InlineField label="TIN #" value={form.tinNumber || "N/A"} />
        </div>

        <div className="w-full flex items-center gap-x-4">
          <InlineField label="Contact Name" value={form.emergencyName || "N/A"} />
          <InlineField
            label="Phone Number"
            value={form.emergencyCellphone || "N/A"}
          />
        </div>

        <div className="mt-3 mb-1 font-semibold">
          Educational Attainment:{" "}
          <span className="font-normal text-[11px] sm:text-xs">
            (Name of School / Course / Year Graduated)
          </span>
        </div>
        <NumberedRow index={1} label="Elementary" value={form.elementarySchool || "N/A"} />
        <NumberedRow index={2} label="Secondary" value={form.secondarySchool || "N/A"} />
        <NumberedRow
          index={3}
          label="Tertiary"
          value={formatEducationEntries(form.tertiarySchool)}
        />
        <NumberedRow
          index={4}
          label="Post Graduate Studies"
          value={formatEducationEntries(form.postGraduateStudies)}
        />

        <div className="mt-3 mb-1 font-semibold">
          Ministerial / Work Experience:{" "}
          <span className="font-normal">(Job Descriptions / Years)</span>
        </div>
        {form.ministerialWorkExperience.map((exp, index) => (
          <LineRow
            key={index}
            prefix={`${index + 1}.`}
            value={
              exp.rolePosition || exp.institution || exp.years
                ? `${exp.rolePosition}${
                    exp.institution ? ` / ${exp.institution}` : ""
                  }${exp.years ? ` / ${exp.years}` : ""}`
                : "N/A"
            }
          />
        ))}

        <div className="mt-3 mb-1 font-semibold">Skill/Talent:</div>
        <LineRow prefix="" value={form.skillsTalents} />

        <div className="mt-3 mb-1 font-semibold">Branch of Service:</div>
        <div className="mb-1 flex flex-wrap gap-x-4 space-y-1">
          <CheckboxLine label="Humanitarian" checked={branchChecked("Humanitarian")} />
          <CheckboxLine
            label="Hospital and Care"
            checked={branchChecked("Hospital and Care")}
          />
          <CheckboxLine label="Military/PNP" checked={branchChecked("Military/PNP")} />
          <CheckboxLine label="School" checked={branchChecked("School")} />
          <CheckboxLine label="Corporate" checked={branchChecked("Corporate")} />
          <CheckboxLine
            label="Disaster & Rescue Operations"
            checked={branchChecked("Disaster & Rescue Operations")}
          />
          <CheckboxLine label="Prison" checked={branchChecked("Prison")} />
          <CheckboxLine label="Security" checked={branchChecked("Security")} />
          <CheckboxLine label="Government" checked={branchChecked("Government")} />
          <CheckboxLine label="DSWD" checked={branchChecked("DSWD")} />
          <div className="flex items-center gap-2">
            <span>{branchChecked("Others")}</span>
            <span>Others:</span>
            <span className="border-b border-neutral-400 flex-1 px-1">
              {form.branchOfServiceOthers || ""}
            </span>
          </div>
        </div>

        <div className="mt-3 mb-1 font-semibold">
          Character Reference:{" "}
          <span className="font-normal">(Name / Position / Contact Number)</span>
        </div>
        {form.characterReferences.map((ref, index) => (
          <LineRow
            key={index}
            prefix={`${index + 1}.`}
            value={
              ref.name || ref.position || ref.contactNumber
                ? `${ref.name} ${ref.position ? `(${ref.position})` : ""}${
                    ref.contactNumber ? ` - ${ref.contactNumber}` : ""
                  }`
                : "N/A"
            }
          />
        ))}

        <div className="mt-4 space-y-2 text-[10px] sm:text-xs">
          <p className="flex items-start gap-2">
            {form.declarationTruthConfirmed ? (
              <span className="mt-0.5 inline-flex size-3.5 items-center justify-center border border-black bg-[#032a0d] text-white">
                <CheckIcon className="size-3" />
              </span>
            ) : (
              <span className="mt-0.5 inline-block size-3.5 border border-black" />
            )}
            <span>
              I do hereby certify that all information above is true and correct
              with the best of my knowledge.
            </span>
          </p>
          <p className="flex items-start gap-2">
            {form.monthlyPledgeConfirmed ? (
              <span className="mt-0.5 inline-flex size-3.5 items-center justify-center border border-black bg-[#032a0d] text-white">
                <CheckIcon className="size-3" />
              </span>
            ) : (
              <span className="mt-0.5 inline-block size-3.5 border border-black" />
            )}
            <span>
              I do hereby agree that I will contribute and support the monthly
              pledge required for the chaplaincy&apos;s operational expenses, program,
              and activities.
            </span>
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-8 justify-between text-[10px] sm:text-xs">
          <div className="flex-1 min-w-35">
            {form.signatureUrl && (
              <div className="mb-1 h-20 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.signatureUrl}
                  alt="Applicant signature"
                  className="max-h-full"
                />
              </div>
            )}
            <div className="border-b border-neutral-500 h-6 mb-1" />
            <div>Applicant&apos;s Signature</div>
          </div>
          <div className="flex-1 min-w-35">
            <div className="border-b border-neutral-500 h-6 mb-1" />
            <div>Endorsed By:</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InlineField({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-center mb-3 w-full gap-1">
      <span className="font-medium">{label}:</span>
      <span className="border-b border-neutral-400 px-1 inline-block flex-1">
        {value}
      </span>
    </span>
  );
}

function NumberedRow({
  index,
  label,
  value,
}: {
  index: number;
  label: string;
  value: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="w-4">{index}.</span>
      <span>{label}:</span>
      <span className="flex-1 border-b border-neutral-400 px-1">{value}</span>
    </div>
  );
}

function LineRow({ prefix, value }: { prefix: string; value: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      {prefix && <span className="w-4">{prefix}</span>}
      <span className="flex-1 border-b border-neutral-400 px-1 min-h-[1.1rem]">
        {value}
      </span>
    </div>
  );
}

function CheckboxLine({
  label,
  checked,
}: {
  label: string;
  checked: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1">
      {checked}
      <span>{label}</span>
    </div>
  );
}

