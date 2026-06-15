/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Check,
  ChevronRight,
  FileCheck2,
  FileExclamationPointIcon,
  FileText,
  Info,
  PencilLine,
  ShieldAlertIcon,
} from "lucide-react";

import { OnThisPageRegister } from "@/components/documentations/OnThisPageRegister";

const ON_THIS_PAGE = [
  { label: "Overview", href: "#overview" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Contact Information", href: "#contact-information" },
  { label: "Church Background", href: "#church-background" },
  { label: "Education and Ministry", href: "#education-and-ministry" },
  { label: "References and Confirmation", href: "#references-confirmation" },
  { label: "Submission Rules", href: "#submission-rules" },
];

const applicationSteps = [
  "Open Become a Member from the public website.",
  "Complete the application form sections from top to bottom.",
  "Use the location selectors to complete region, province, municipality or city, and barangay.",
  "Review the endorsement, signature, and confirmation statements before submitting.",
  "Submit the form and wait for the system to create or update the member application record.",
];

const contactFields = [
  ["First name", "Required", "Applicant's given name."],
  ["Middle initial", "Optional", "One-character middle initial."],
  ["Last name", "Required", "Applicant's family name."],
  ["Ext. name", "Optional", "Name suffix such as Jr., Sr., or III."],
  [
    "Email address",
    "Required",
    "Email used for application updates and account access.",
  ],
  [
    "Mobile / phone number",
    "Required",
    "11-digit Philippine mobile format, for example 09152479693.",
  ],
  ["Civil status", "Required", "Single, Married, Widowed, or Separated."],
  ["Gender", "Required", "Male or Female."],
  ["Nationality", "Required", "Applicant's nationality."],
  [
    "Date of birth",
    "Required",
    "Birthday cannot be later than the current date.",
  ],
  ["Age", "Required", "Read-only value computed from date of birth."],
  [
    "Location: region, province, municipality / city, barangay",
    "Required",
    "All four location selectors must be completed.",
  ],
  [
    "House no., street, subdivision / village",
    "Required",
    "Specific home address details.",
  ],
  [
    "Location summary",
    "Required",
    "Read-only summary of address plus selected location.",
  ],
  [
    "Emergency contact name",
    "Required",
    "Full name of the emergency contact person.",
  ],
  [
    "Emergency contact mobile",
    "Required",
    "11-digit Philippine mobile format.",
  ],
];

const churchFields = [
  [
    "Church / Organization affiliation",
    "Optional",
    "Name of church or organization.",
  ],
  ["Church address", "Optional", "Street, barangay, city, or municipality."],
  [
    "Current position / role",
    "Required",
    "Church Worker, Pastor, Rev., Bishop, or Others.",
  ],
  [
    "If Others, please specify",
    "Optional",
    "Use when the position or role is not covered by the choices.",
  ],
  ["Height", "Optional", "Applicant height, for example 170 cm."],
  ["Weight", "Optional", "Applicant weight, for example 70 kg."],
  ["Blood type", "Optional", "Blood type, for example O+."],
  ["Color of eyes", "Optional", "Eye color."],
  ["Color of skin", "Optional", "Skin color."],
  ["SSS number", "Optional", "Applicant SSS number."],
  ["TIN number", "Optional", "Applicant TIN number."],
  [
    "Skills / talents",
    "Optional",
    "Skills such as counseling, teaching, or music.",
  ],
  [
    "Preferred branch/es of service",
    "Optional",
    "Multiple selections allowed: Humanitarian, Hospital and Care, Military/PNP, School, Corporate, Disaster & Rescue Operations, Prison, Security, Government, DSWD, Others.",
  ],
  [
    "If Others, please specify",
    "Optional",
    "Use when preferred branch of service is not covered by the choices.",
  ],
];

const educationFields = [
  [
    "Elementary",
    "Optional",
    "Format: Name of School / Course / Year Graduated.",
  ],
  [
    "Secondary",
    "Optional",
    "Format: Name of School / Course / Year Graduated.",
  ],
  [
    "Tertiary / College",
    "Optional",
    "One or more entries can be added. Format: Name of School / Course / Year Graduated.",
  ],
  [
    "Post-graduate studies",
    "Optional",
    "One or more entries can be added. Format: Name of School / Course / Year Graduated.",
  ],
  [
    "Ministerial/work experience: Role/Position",
    "Optional",
    "Role or position for each ministry or work experience entry.",
  ],
  [
    "Ministerial/work experience: Institution",
    "Optional",
    "Institution for each ministry or work experience entry.",
  ],
  [
    "Ministerial/work experience: Years",
    "Optional",
    "Approximate number of years for each ministry or work experience entry.",
  ],
];

const referenceFields = [
  [
    "Endorsed by: Name",
    "Required",
    "Full name of the person endorsing the application.",
  ],
  [
    "Endorsed by: Relationship",
    "Required",
    "Relationship or position, for example Senior Pastor.",
  ],
  [
    "Endorsed by: Contact number",
    "Required",
    "11-digit Philippine mobile format.",
  ],
  [
    "Applicant's signature",
    "Optional",
    "Applicant may draw a signature or upload an image signature.",
  ],
  [
    "Truth declaration checkbox",
    "Required",
    "Applicant confirms the information provided is true and correct.",
  ],
  [
    "Monthly pledge checkbox",
    "Required",
    "Applicant confirms support for the monthly pledge for chaplain operational expenses, programs, and activities.",
  ],
];

const submissionRules = [
  "The form auto-saves a draft while the applicant fills it out.",
  "The email may be prefilled from the signed-in account when available.",
  "The applicant cannot submit without both confirmation checkboxes.",
  "A complete location requires region, province, municipality or city, and barangay.",
  "If an account already has an application, the form may be hidden to avoid duplicate submissions.",
  "After submission, the user may be sent to sign in or continue to onboarding depending on account state.",
];

const BecomeAMember = () => {
  return (
    <article className="mx-auto max-w-5xl pb-12">
      <OnThisPageRegister items={ON_THIS_PAGE} />

      <section id="overview" className="scroll-mt-36">
        <h1 className="mt-3 text-2xl font-bold tracking-tighter text-foreground">
          Become a Member
        </h1>
        <div className="mt-6 space-y-5 text-muted-foreground">
          <p>
            This guide explains the public membership application form used by
            applicants who want to join Pearl of the Orient. It lists each field
            in the form and identifies whether the field is required, optional,
            auto-computed, or auto-generated.
          </p>
          <p>
            The application collects contact information, church background,
            education and ministry details, endorsement information, signature,
            and final applicant confirmations before submission.
          </p>
        </div>
      </section>

      <section id="how-it-works" className="mt-14 scroll-mt-36">
        <FullScreenShotSection
          title="Application Form"
          description="The Become a Member page shows the full application form and a description panel. Applicants should complete required fields, review the details, and submit the form for admin review."
          imageSrc="/docs-screenshots/become-member.mp4"
          imageAlt="Placeholder screenshot for the Become a Member application form"
        >
          <ol className="mt-5 space-y-3">
            {applicationSteps.map((step) => (
              <li key={step} className="flex gap-2 text-sm">
                <Check className="mt-1 size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </FullScreenShotSection>
      </section>

      <section id="contact-information" className="mt-14 scroll-mt-36">
        <FieldTable
          title="Contact Information"
          description="These fields identify the applicant and provide contact, location, and emergency contact information."
          rows={contactFields}
        />
      </section>

      <section id="church-background" className="mt-14 scroll-mt-36">
        <FieldTable
          title="Church Background"
          description="These fields describe church affiliation, current role, physical profile details, service preferences, and skills."
          rows={churchFields}
        />
      </section>

      <section id="education-and-ministry" className="mt-14 scroll-mt-36">
        <FieldTable
          title="Education and Ministry"
          description="These fields record education history and ministry or work experience. Repeatable fields can have more than one entry."
          rows={educationFields}
        />
      </section>

      <section id="references-confirmation" className="mt-14 scroll-mt-36">
        <FieldTable
          title="References and Confirmation"
          description="These fields capture the applicant endorsement, optional signature, and required confirmations before submission."
          rows={referenceFields}
        />
      </section>

      <section id="submission-rules" className="mt-14 scroll-mt-36">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-[#0f6b2a]/10 text-[#0f6b2a]">
              <FileCheck2 className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tighter text-foreground">
                Submission Rules
              </h2>
              <p className="text-muted-foreground">
                Use these checks when an applicant cannot submit the form.
              </p>
            </div>
          </div>

          <ul className="mt-6 grid gap-3">
            {submissionRules.map((rule) => (
              <li key={rule} className="flex items-start gap-2 text-sm">
                <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="mt-14 space-y-8">
        <Link
          href="/documentation/become-a-member/requirements"
          className="group flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:border-[#0f6b2a]/50 hover:bg-[#0f6b2a]/5"
        >
          <div>
            <p className="text-xs font-medium text-muted-foreground">Next</p>
            <p className="text-lg font-semibold text-foreground">
              Submission of Requirements
            </p>
          </div>
          <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Last updated June 7, 2026
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            &copy; 2026 Pearl of the Orient International Auxiliary Chaplain
            Values Educators Inc.
          </p>
        </div>
      </footer>
    </article>
  );
};

const FieldTable = ({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: string[][];
}) => {
  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          {title}
        </h2>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-muted/60 text-foreground">
            <tr>
              <th className="border-b px-4 py-3 font-semibold">Field</th>
              <th className="border-b px-4 py-3 font-semibold">Requirement</th>
              <th className="border-b px-4 py-3 font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([field, requirement, notes]) => (
              <tr
                key={`${title}-${field}`}
                className="border-b last:border-b-0"
              >
                <td className="px-4 min-w-70 whitespace-nowrap py-4 font-medium text-foreground">
                  {field}
                </td>
                <td className="px-4 py-4">
                  <RequirementBadge requirement={requirement} />
                </td>
                <td className="px-4 py-4 text-muted-foreground">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RequirementBadge = ({ requirement }: { requirement: string }) => {
  const isRequired = requirement.startsWith("Required");

  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        isRequired
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-[#0f6b2a]/30 bg-[#0f6b2a]/10 text-[#0f6b2a]",
      ].join(" ")}
    >
      {isRequired ? <ShieldAlertIcon className="size-3" /> : null}
      {requirement}
    </span>
  );
};

const FullScreenShotSection = ({
  title,
  description,
  imageSrc,
  imageAlt,
  children,
}: {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  children: ReactNode;
}) => {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <ScreenshotPlaceholder src={imageSrc} alt={imageAlt} />
      <div className="border-t p-6">
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          {title}
        </h2>
        <p className="mt-3 text-muted-foreground">{description}</p>
        {children}
      </div>
    </div>
  );
};

const ScreenshotPlaceholder = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="bg-background">
      <div className="relative aspect-video min-h-70">
        <video
          src={src}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          controls
          loop
          playsInline
        />
      </div>
    </div>
  );
};

export default BecomeAMember;
