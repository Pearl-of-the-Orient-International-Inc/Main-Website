"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SignatureInput from "@/components/ui/signature-input";
import {
  CheckCircle2,
  CheckIcon,
  ChevronRight,
  HelpCircleIcon,
  Info,
} from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PreviewToggleButton } from "@/components/membership/PreviewToggleButton";

type BranchOfService =
  | "Humanitarian"
  | "Hospital and Care"
  | "Military/PNP"
  | "School"
  | "Corporate"
  | "Disaster & Rescue Operations"
  | "Prison"
  | "Security"
  | "Government"
  | "DSWD"
  | "Others";

type ApplicationFormState = {
  // Identity
  firstName: string;
  lastName: string;
  emailAddress: string;

  // Personal & contact
  address: string;
  phoneNumber: string;
  civilStatus: "Single" | "Married" | "Widowed" | "Separated" | "";
  gender: "Male" | "Female" | "";
  nationality: string;
  birthday: string;
  age: string;

  // Church & location
  churchOrganizationAffiliation: string;
  churchAddress: string;
  regionProvince: string;

  // Role
  position: "Church Worker" | "Pastor" | "Rev." | "Bishop" | "Others" | "";
  positionOthers: string;

  // Physical
  height: string;
  weight: string;
  bloodType: string;
  colorOfEyes: string;
  colorOfSkin: string;

  // IDs
  sssNumber: string;
  tinNumber: string;

  // Emergency
  emergencyName: string;
  emergencyCellphone: string;

  // Education
  elementarySchool: string;
  secondarySchool: string;
  tertiarySchool: string;
  postGraduateStudies: string;

  // Ministry & skills
  ministerialWorkExperience: {
    jobDescription: string;
    years: string;
  }[];
  skillsTalents: string;
  branchOfService: BranchOfService[];
  branchOfServiceOthers: string;

  // Character references
  characterReferences: {
    name: string;
    position: string;
    contactNumber: string;
  }[];

  // Media
  photoUrl: string;
  signatureUrl: string;
};

const emptyFormState: ApplicationFormState = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  address: "",
  phoneNumber: "",
  civilStatus: "",
  gender: "",
  nationality: "",
  birthday: "",
  age: "",
  churchOrganizationAffiliation: "",
  churchAddress: "",
  regionProvince: "",
  position: "",
  positionOthers: "",
  height: "",
  weight: "",
  bloodType: "",
  colorOfEyes: "",
  colorOfSkin: "",
  sssNumber: "",
  tinNumber: "",
  emergencyName: "",
  emergencyCellphone: "",
  elementarySchool: "",
  secondarySchool: "",
  tertiarySchool: "",
  postGraduateStudies: "",
  ministerialWorkExperience: [
    { jobDescription: "", years: "" },
    { jobDescription: "", years: "" },
    { jobDescription: "", years: "" },
  ],
  skillsTalents: "",
  branchOfService: [],
  branchOfServiceOthers: "",
  characterReferences: [
    { name: "", position: "", contactNumber: "" },
    { name: "", position: "", contactNumber: "" },
    { name: "", position: "", contactNumber: "" },
  ],
  photoUrl: "",
  signatureUrl: "",
};

const steps = [
  {
    id: 1,
    title: "Personal details",
    description: "Basic identity and contact information.",
  },
  {
    id: 2,
    title: "Church & background",
    description: "Ministry role, church affiliation, and service.",
  },
  {
    id: 3,
    title: "Education & ministry",
    description: "Educational history and ministry experience.",
  },
  {
    id: 4,
    title: "References & review",
    description: "Character references and final confirmation.",
  },
] as const;

type StepIndex = 0 | 1 | 2 | 3;

export default function BecomeMemberPage() {
  const [step, setStep] = useState<StepIndex>(0);
  const [form, setForm] = useState<ApplicationFormState>(emptyFormState);
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = steps[step];
  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  const updateField = <K extends keyof ApplicationFormState>(
    key: K,
    value: ApplicationFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep((prev) => (prev + 1) as StepIndex);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep((prev) => (prev - 1) as StepIndex);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: wire this up to your Convex mutation.
      console.log("Membership application draft:", form);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        updateField("photoUrl", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSignatureChange = (signature: string | null) => {
    updateField("signatureUrl", signature ?? "");
  };

  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#032a0d]/10 bg-[#032a0d] text-white">
        <div className="absolute inset-0 opacity-30 bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <p className="text-xs sm:text-sm text-white/70 mb-2">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>{" "}
            <span className="mx-1 sm:mx-2 text-white/50">/</span>{" "}
            <span className="font-medium text-white">Become a Member</span>
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide">
            Become a Member
          </h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-white/80 leading-relaxed">
            Begin your chaplaincy journey with Pearl of the Orient International
            Auxiliary Chaplain Values Educators Inc. Complete the application
            form in a few guided steps.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.1fr)] items-start">
          {/* Left: Guidance & steps */}
          <div className="space-y-6">
            <PreviewToggleButton
              isPreview={isPreview}
              onToggle={() => setIsPreview((prev) => !prev)}
            />
            <div className="rounded-2xl border border-[#032a0d]/15 bg-white/80 px-5 py-6 shadow-sm backdrop-blur">
              <h2 className="font-serif text-xl sm:text-2xl text-[#032a0d] mb-3">
                How the application works
              </h2>
              <p className="text-sm text-[#032a0d]/80 leading-relaxed mb-4">
                The membership form is divided into clear steps. Your
                information will help us know you better and place you in the
                right chaplaincy context.
              </p>
              <ol className="space-y-3 text-sm sm:text-base text-[#032a0d]/85">
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-[#032a0d]/10 text-xs font-semibold text-[#032a0d]">
                    1
                  </span>
                  <div>
                    <p className="font-semibold">
                      Provide your personal details
                    </p>
                    <p className="text-xs sm:text-sm text-[#032a0d]/70">
                      Basic contact information and civil status.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-[#032a0d]/10 text-xs font-semibold text-[#032a0d]">
                    2
                  </span>
                  <div>
                    <p className="font-semibold">
                      Share your church and ministry background
                    </p>
                    <p className="text-xs sm:text-sm text-[#032a0d]/70">
                      Current role, affiliation, and service areas.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-[#032a0d]/10 text-xs font-semibold text-[#032a0d]">
                    3
                  </span>
                  <div>
                    <p className="font-semibold">
                      Add education, experience, and references
                    </p>
                    <p className="text-xs sm:text-sm text-[#032a0d]/70">
                      Your formation, skills, and character references.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-[#032a0d]/10 text-xs font-semibold text-[#032a0d]">
                    4
                  </span>
                  <div>
                    <p className="font-semibold">Review and submit</p>
                    <p className="text-xs sm:text-sm text-[#032a0d]/70">
                      Confirm that all details are correct before submission.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="rounded-2xl border border-dashed border-[#032a0d]/25 bg-[#032a0d]/3 px-5 py-4 text-xs sm:text-sm text-[#032a0d]/80 flex gap-3">
              <Info className="mt-0.5 size-4 shrink-0 text-[#032a0d]" />
              <p>
                You may prepare scanned copies of your identification documents
                and supporting records. File uploads can be handled in a later
                step of the application process.
              </p>
            </div>
          </div>

          {/* Right: Multi-step form card / preview */}
          {!isPreview ? (
            <div className="rounded-2xl border border-[#032a0d]/15 bg-white shadow-sm p-5 sm:p-6 lg:p-7">
              {/* Step header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm uppercase text-[#032a0d]/70">
                    Step {step + 1} of {steps.length}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#032a0d]/5 px-3 py-1 text-[11px] font-medium text-[#032a0d]">
                    <CheckCircle2 className="size-3.5" />
                    Draft only – no submission yet
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif text-lg sm:text-xl text-[#032a0d]">
                    {currentStep.title}
                  </h2>
                  <span className="text-[11px] sm:text-xs text-[#032a0d]/70">
                    {currentStep.description}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#032a0d] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Step indicators */}
                {/* <div className="mt-3 flex flex-wrap gap-2 text-[11px] sm:text-xs">
                {steps.map((s, index) => {
                  const isActive = index === step;
                  const isCompleted = index < step;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStep(index as StepIndex)}
                      className={[
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 transition-colors",
                        isActive
                          ? "border-[#032a0d] bg-[#032a0d]/5 text-[#032a0d]"
                          : isCompleted
                          ? "border-[#032a0d]/30 bg-[#032a0d]/5 text-[#032a0d]/80"
                          : "border-neutral-200 text-neutral-500 hover:border-[#032a0d]/40 hover:text-[#032a0d]",
                      ].join(" ")}
                    >
                      <span className="inline-flex size-4 items-center justify-center rounded-full bg-white/80 text-[10px] font-semibold text-[#032a0d]">
                        {s.id}
                      </span>
                      <span>{s.title}</span>
                    </button>
                  );
                })}
              </div> */}
              </div>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                {step === 0 && (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="First name" required>
                        <Input
                          value={form.firstName}
                          onChange={(e) =>
                            updateField("firstName", e.target.value)
                          }
                          placeholder="e.g. Juan"
                        />
                      </Field>
                      <Field label="Last name" required>
                        <Input
                          value={form.lastName}
                          onChange={(e) =>
                            updateField("lastName", e.target.value)
                          }
                          placeholder="e.g. Dela Cruz"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Email address" required>
                        <Input
                          type="email"
                          value={form.emailAddress}
                          onChange={(e) =>
                            updateField("emailAddress", e.target.value)
                          }
                          placeholder="you@example.com"
                        />
                      </Field>
                      <Field label="Mobile / phone number" required>
                        <Input
                          value={form.phoneNumber}
                          onChange={(e) =>
                            updateField("phoneNumber", e.target.value)
                          }
                          placeholder="e.g. 09XX XXX XXXX"
                        />
                      </Field>
                    </div>

                    <Field label="Home address" required>
                      <Input
                        value={form.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        placeholder="House no., street, barangay, city / municipality"
                      />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field label="Civil status" required>
                        <Select
                          value={form.civilStatus}
                          onValueChange={(value) =>
                            updateField(
                              "civilStatus",
                              value as ApplicationFormState["civilStatus"],
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Married">Married</SelectItem>
                            <SelectItem value="Widowed">Widowed</SelectItem>
                            <SelectItem value="Separated">Separated</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field label="Gender" required>
                        <Select
                          value={form.gender}
                          onValueChange={(value) =>
                            updateField(
                              "gender",
                              value as ApplicationFormState["gender"],
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field label="Nationality" required>
                        <Input
                          value={form.nationality}
                          onChange={(e) =>
                            updateField("nationality", e.target.value)
                          }
                          placeholder="e.g. Filipino"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field label="Date of birth" required>
                        <Input
                          type="date"
                          value={form.birthday}
                          onChange={(e) =>
                            updateField("birthday", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Age" required>
                        <Input
                          type="number"
                          min={0}
                          max={150}
                          value={form.age}
                          onChange={(e) => updateField("age", e.target.value)}
                        />
                      </Field>
                      <Field label="Region / Province" required>
                        <Input
                          value={form.regionProvince}
                          onChange={(e) =>
                            updateField("regionProvince", e.target.value)
                          }
                          placeholder="e.g. Region IV-A, Cavite"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Emergency contact name" required>
                        <Input
                          value={form.emergencyName}
                          onChange={(e) =>
                            updateField("emergencyName", e.target.value)
                          }
                          placeholder="Full name of emergency contact"
                        />
                      </Field>
                      <Field label="Emergency contact mobile" required>
                        <Input
                          value={form.emergencyCellphone}
                          onChange={(e) =>
                            updateField("emergencyCellphone", e.target.value)
                          }
                          placeholder="e.g. 09XX XXX XXXX"
                        />
                      </Field>
                    </div>

                    <Field
                      label="Recent ID photo"
                      hint="A clear 2x2 or profile photo. This will appear on your membership record."
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="text-xs sm:text-sm"
                        />
                        {form.photoUrl && (
                          <div className="h-16 w-16 rounded-md border border-[#032a0d]/20 overflow-hidden bg-white">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={form.photoUrl}
                              alt="Applicant photo preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </Field>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <Field label="Church / Organization affiliation" required>
                      <Input
                        value={form.churchOrganizationAffiliation}
                        onChange={(e) =>
                          updateField(
                            "churchOrganizationAffiliation",
                            e.target.value,
                          )
                        }
                        placeholder="Name of church or organization"
                      />
                    </Field>

                    <Field label="Church address" required>
                      <Input
                        value={form.churchAddress}
                        onChange={(e) =>
                          updateField("churchAddress", e.target.value)
                        }
                        placeholder="Street, barangay, city / municipality"
                      />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Current position / role">
                        <Select
                          value={form.position}
                          onValueChange={(value) =>
                            updateField(
                              "position",
                              value as ApplicationFormState["position"],
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Church Worker">
                              Church Worker
                            </SelectItem>
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
                          onChange={(e) =>
                            updateField("positionOthers", e.target.value)
                          }
                          placeholder="Specify position or role"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field label="Height (optional)">
                        <Input
                          value={form.height}
                          onChange={(e) =>
                            updateField("height", e.target.value)
                          }
                          placeholder="e.g. 170 cm"
                        />
                      </Field>
                      <Field label="Weight (optional)">
                        <Input
                          value={form.weight}
                          onChange={(e) =>
                            updateField("weight", e.target.value)
                          }
                          placeholder="e.g. 70 kg"
                        />
                      </Field>
                      <Field label="Blood type (optional)">
                        <Input
                          value={form.bloodType}
                          onChange={(e) =>
                            updateField("bloodType", e.target.value)
                          }
                          placeholder="e.g. O+"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field label="Color of eyes (optional)">
                        <Input
                          value={form.colorOfEyes}
                          onChange={(e) =>
                            updateField("colorOfEyes", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Color of skin (optional)">
                        <Input
                          value={form.colorOfSkin}
                          onChange={(e) =>
                            updateField("colorOfSkin", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="SSS number (optional)">
                        <Input
                          value={form.sssNumber}
                          onChange={(e) =>
                            updateField("sssNumber", e.target.value)
                          }
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="TIN number (optional)">
                        <Input
                          value={form.tinNumber}
                          onChange={(e) =>
                            updateField("tinNumber", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Skills / talents (optional)">
                        <Input
                          value={form.skillsTalents}
                          onChange={(e) =>
                            updateField("skillsTalents", e.target.value)
                          }
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
                          {[
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
                          ].map((branch) => {
                            const value = branch as BranchOfService;
                            const isSelected =
                              form.branchOfService.includes(value);
                            return (
                              <button
                                key={branch}
                                type="button"
                                onClick={() => {
                                  updateField(
                                    "branchOfService",
                                    isSelected
                                      ? form.branchOfService.filter(
                                          (b) => b !== value,
                                        )
                                      : [...form.branchOfService, value],
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
                            updateField("branchOfServiceOthers", e.target.value)
                          }
                          placeholder="Specify other branch of service"
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {step === 2 && (
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
                              updateField("elementarySchool", e.target.value)
                            }
                          />
                        </Field>
                        <Field label="Secondary school (optional)">
                          <Input
                            value={form.secondarySchool}
                            onChange={(e) =>
                              updateField("secondarySchool", e.target.value)
                            }
                          />
                        </Field>
                        <Field label="Tertiary / college (optional)">
                          <Input
                            value={form.tertiarySchool}
                            onChange={(e) =>
                              updateField("tertiarySchool", e.target.value)
                            }
                          />
                        </Field>
                        <Field label="Post-graduate studies (optional)">
                          <Input
                            value={form.postGraduateStudies}
                            onChange={(e) =>
                              updateField("postGraduateStudies", e.target.value)
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
                                  const copy = [
                                    ...form.ministerialWorkExperience,
                                  ];
                                  copy[index] = {
                                    ...copy[index],
                                    jobDescription: e.target.value,
                                  };
                                  updateField(
                                    "ministerialWorkExperience",
                                    copy,
                                  );
                                }}
                                placeholder="e.g. Hospital chaplain, youth pastor"
                              />
                            </Field>
                            <Field label="Years (approx.)">
                              <Input
                                value={exp.years}
                                onChange={(e) => {
                                  const copy = [
                                    ...form.ministerialWorkExperience,
                                  ];
                                  copy[index] = {
                                    ...copy[index],
                                    years: e.target.value,
                                  };
                                  updateField(
                                    "ministerialWorkExperience",
                                    copy,
                                  );
                                }}
                                placeholder="e.g. 2 years"
                              />
                            </Field>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <h3 className="font-serif text-base sm:text-lg text-[#032a0d]">
                        Character references
                      </h3>
                      <p className="text-xs sm:text-sm text-[#032a0d]/70">
                        Please provide at least one person who can vouch for
                        your character and ministry.
                      </p>
                      <div className="space-y-3">
                        {form.characterReferences.map((ref, index) => (
                          <div
                            key={index}
                            className="grid gap-3 sm:grid-cols-3 rounded-lg border border-dashed border-[#032a0d]/20 px-3 py-3"
                          >
                            <Field label={`Name #${index + 1}`}>
                              <Input
                                value={ref.name}
                                onChange={(e) => {
                                  const copy = [...form.characterReferences];
                                  copy[index] = {
                                    ...copy[index],
                                    name: e.target.value,
                                  };
                                  updateField("characterReferences", copy);
                                }}
                                placeholder="Full name"
                              />
                            </Field>
                            <Field label="Position / relationship">
                              <Input
                                value={ref.position}
                                onChange={(e) => {
                                  const copy = [...form.characterReferences];
                                  copy[index] = {
                                    ...copy[index],
                                    position: e.target.value,
                                  };
                                  updateField("characterReferences", copy);
                                }}
                                placeholder="e.g. Senior Pastor"
                              />
                            </Field>
                            <Field label="Contact number">
                              <Input
                                value={ref.contactNumber}
                                onChange={(e) => {
                                  const copy = [...form.characterReferences];
                                  copy[index] = {
                                    ...copy[index],
                                    contactNumber: e.target.value,
                                  };
                                  updateField("characterReferences", copy);
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
                        <div className="mt-1">
                          <SignatureInput
                            onSignatureChange={handleSignatureChange}
                          />
                          {form.signatureUrl && (
                            <p className="mt-1 text-[10px] sm:text-xs text-[#032a0d]/70">
                              Signature captured. You may clear and redraw if
                              needed.
                            </p>
                          )}
                        </div>
                      </Field>
                    </div>

                    <div className="rounded-lg border border-[#032a0d]/15 bg-[#032a0d]/3 px-4 py-3 text-xs sm:text-sm text-[#032a0d]/80 flex gap-3">
                      <Info className="mt-0.5 size-4 shrink-0 text-[#032a0d]" />
                      <p>
                        By submitting this form, you affirm that the information
                        provided is true and correct to the best of your
                        knowledge. Final endorsement and membership approval
                        will be communicated to you by the leadership.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={step === 0}
                    onClick={prevStep}
                    className="border-[#032a0d]/40 text-[#032a0d] hover:bg-[#032a0d]/5"
                  >
                    Back
                  </Button>

                  {step < steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-[#032a0d] hover:bg-[#032a0d]/90"
                    >
                      Next
                      <ChevronRight className="size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-[#032a0d] hover:bg-[#032a0d]/90"
                    >
                      {isSubmitting ? "Saving..." : "Save application draft"}
                      <ChevronRight className="size-4" />
                    </Button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <MembershipPreview form={form} />
          )}
        </div>
      </section>
    </div>
  );
}

function MembershipPreview({ form }: { form: ApplicationFormState }) {
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
        {/* Header */}
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

        {/* ID picture */}
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
        {/* Date */}
        <div className="flex mb-3">
          <span className="mr-1 font-medium">Date:</span>
          <span className="border-b border-neutral-400 min-w-30 inline-block px-1">
            {formattedDate}
          </span>
        </div>

        {/* Position */}
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-medium">Position:</span>
          {["Church Worker", "Pastor", "Rev.", "Bishop", "Others"].map(
            (pos) => {
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
            },
          )}
          {form.position === "Others" && (
            <span className="ml-2 border-b border-neutral-400 min-w-30 inline-block px-1">
              {form.positionOthers || "N/A"}
            </span>
          )}
        </div>

        {/* Name / Address / Cell */}
        <InlineField label="Name" value={fullName || "N/A"} />
        <div className="flex w-full flex-wrap items-center gap-x-4">
          <InlineField label="Address" value={form.address || "N/A"} />
          <InlineField label="Phone Number" value={form.phoneNumber || "N/A"} />
        </div>

        {/* Civil / Gender / Nationality / Birthday / Age */}
        <div className="flex w-full items-center gap-4">
          <InlineField label="Civil Status" value={form.civilStatus || "N/A"} />
          <InlineField label="Gender" value={form.gender || "N/A"} />
          <InlineField label="Nationality" value={form.nationality || "N/A"} />
        </div>
        <div className="flex w-full items-center gap-x-4">
          <InlineField label="Birthday" value={formattedDob || "N/A"} />
          <InlineField label="Age" value={`${form.age} years old` || "N/A"} />
        </div>

        {/* Church / Address / Region */}
        <InlineField
          label="Church/Organization Affiliation"
          value={form.churchOrganizationAffiliation || "N/A"}
        />
        <InlineField label="Address" value={form.churchAddress || "N/A"} />
        <InlineField
          label="Region/Province"
          value={form.regionProvince || "N/A"}
        />

        {/* Physical */}
        <div className="w-full flex items-center gap-x-4">
          <InlineField label="Height" value={`${form.height} cm` || "N/A"} />
          <InlineField label="Weight" value={`${form.weight} kg` || "N/A"} />
          <InlineField label="Blood Type" value={form.bloodType || "N/A"} />
        </div>
        <div className="w-full flex items-center gap-x-4">
          <InlineField
            label="Color of Eyes"
            value={form.colorOfEyes || "N/A"}
          />
          <InlineField
            label="Color of Skin"
            value={form.colorOfSkin || "N/A"}
          />
        </div>

        {/* IDs */}
        <div className="w-full flex items-center gap-x-4">
          <InlineField label="SSS #" value={form.sssNumber || "N/A"} />
          <InlineField label="TIN #" value={form.tinNumber || "N/A"} />
        </div>

        {/* Emergency */}
        <div className="w-full flex items-center gap-x-4">
          <InlineField
            label="Contact Name"
            value={form.emergencyName || "N/A"}
          />
          <InlineField
            label="Phone Number"
            value={form.emergencyCellphone || "N/A"}
          />
        </div>

        {/* Education */}
        <div className="mt-3 mb-1 font-semibold">
          Educational Attainment:{" "}
          <span className="font-normal text-[11px] sm:text-xs">
            (Name of School / Course / Year Graduated)
          </span>
        </div>
        <NumberedRow
          index={1}
          label="Elementary"
          value={form.elementarySchool || "N/A"}
        />
        <NumberedRow
          index={2}
          label="Secondary"
          value={form.secondarySchool || "N/A"}
        />
        <NumberedRow
          index={3}
          label="Tertiary"
          value={form.tertiarySchool || "N/A"}
        />
        <NumberedRow
          index={4}
          label="Post Graduate Studies"
          value={form.postGraduateStudies || "N/A"}
        />

        {/* Ministerial work */}
        <div className="mt-3 mb-1 font-semibold">
          Ministerial / Work Experience:{" "}
          <span className="font-normal">(Job Descriptions / Years)</span>
        </div>
        {form.ministerialWorkExperience.map((exp, index) => (
          <LineRow
            key={index}
            prefix={`${index + 1}.`}
            value={
              exp.jobDescription || exp.years
                ? `${exp.jobDescription} ${exp.years ? `(${exp.years})` : ""}`
                : "N/A"
            }
          />
        ))}

        {/* Skills */}
        <div className="mt-3 mb-1 font-semibold">Skill/Talent:</div>
        <LineRow prefix="" value={form.skillsTalents} />

        {/* Branch of Service */}
        <div className="mt-3 mb-1 font-semibold">Branch of Service:</div>
        <div className="mb-1 flex flex-wrap gap-x-4 space-y-1">
          <CheckboxLine
            label="Humanitarian"
            checked={branchChecked("Humanitarian")}
          />
          <CheckboxLine
            label="Hospital and Care"
            checked={branchChecked("Hospital and Care")}
          />
          <CheckboxLine
            label="Military/PNP"
            checked={branchChecked("Military/PNP")}
          />
          <CheckboxLine label="School" checked={branchChecked("School")} />
          <CheckboxLine
            label="Corporate"
            checked={branchChecked("Corporate")}
          />
          <CheckboxLine
            label="Disaster & Rescue Operations"
            checked={branchChecked("Disaster & Rescue Operations")}
          />
          <CheckboxLine label="Prison" checked={branchChecked("Prison")} />
          <CheckboxLine label="Security" checked={branchChecked("Security")} />
          <CheckboxLine
            label="Government"
            checked={branchChecked("Government")}
          />
          <CheckboxLine label="DSWD" checked={branchChecked("DSWD")} />
          <div className="flex items-center gap-2">
            <span>{branchChecked("Others")}</span>
            <span>Others:</span>
            <span className="border-b border-neutral-400 flex-1 px-1">
              {form.branchOfServiceOthers || ""}
            </span>
          </div>
        </div>

        {/* Character references */}
        <div className="mt-3 mb-1 font-semibold">
          Character Reference:{" "}
          <span className="font-normal">
            (Name / Position / Contact Number)
          </span>
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

        {/* Declaration */}
        <p className="mt-4 text-[10px] sm:text-xs">
          I do hereby certify that all information above is true and correct
          with the best of my knowledge.
        </p>
        <p className="mt-2 text-[10px] sm:text-xs">
          I do hereby agree that I will contribute and support the monthly
          pledge required for the chaplaincy&apos;s operational expenses,
          program, and activities.
        </p>

        {/* Signatures */}
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

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-xs sm:text-sm">
      <span className="flex items-center gap-2">
        <span className="font-medium text-[#032a0d]">
          {label}
          {required && <span className="text-red-600 ml-0.5">*</span>}
        </span>
        {hint && (
          <Tooltip>
            <TooltipTrigger>
              <HelpCircleIcon className="size-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>{hint}</TooltipContent>
          </Tooltip>
        )}
      </span>
      {children}
    </label>
  );
}
