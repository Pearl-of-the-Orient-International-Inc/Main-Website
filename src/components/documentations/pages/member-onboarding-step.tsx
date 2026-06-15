import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileImage,
  FileText,
  Info,
  ListChecks,
} from "lucide-react";

import { OnThisPageRegister } from "@/components/documentations/OnThisPageRegister";

type StepDoc = {
  title: string;
  stepLabel: string;
  description: string;
  imageSrc: string;
  isVideo?: boolean;
  imageAlt: string;
  overview: string[];
  actions: string[];
  requirements: string[];
  notes: string[];
  previous?: {
    label: string;
    href: string;
  };
  next?: {
    label: string;
    href: string;
  };
};

export type MemberOnboardingStepSlug =
  | "online-application"
  | "requirements"
  | "pre-orientation"
  | "payment-checkout"
  | "online-interview"
  | "id-generation"
  | "chaplaincy-101"
  | "oath-taking";

const basePath = "/documentation/become-a-member";

const STEP_DOCS: Record<MemberOnboardingStepSlug, StepDoc> = {
  "online-application": {
    title: "Online Application",
    stepLabel: "Step 1",
    description:
      "Applicants complete the public membership application form before onboarding begins.",
    imageSrc: "/docs-screenshots/navigation.png",
    imageAlt: "Placeholder screenshot for the online membership application",
    overview: [
      "The online application collects personal details, contact information, full location, church background, education, ministry experience, endorsement details, signature, and final confirmations.",
      "Required fields include first name, last name, email address, mobile number, civil status, gender, nationality, date of birth, full location, home address, emergency contact details, current position or role, endorsement details, and both confirmation checkboxes.",
      "The form auto-saves a draft while the applicant fills it out.",
    ],
    actions: [
      "Open Become a Member from the public website.",
      "Complete the application form sections from top to bottom.",
      "Confirm the truth declaration and monthly pledge checkboxes.",
      "Submit the application and wait for the system to continue to onboarding or sign-in.",
    ],
    requirements: [
      "A complete contact profile and full location are required.",
      "At least one endorsement contact is required.",
      "Both final confirmation checkboxes are required before submission.",
    ],
    notes: [
      "If the account already has a member application, the form may be hidden to prevent duplicate submissions.",
      "After submission, unauthenticated users may be redirected to sign in before onboarding.",
    ],
    next: {
      label: "Submission of Requirements",
      href: `${basePath}/requirements`,
    },
  },
  requirements: {
    title: "Submission of Requirements",
    stepLabel: "Step 2",
    description:
      "Members upload required and optional documents before moving to pre-orientation.",
    imageSrc: "/docs-screenshots/requirements.png",
    imageAlt: "Placeholder screenshot for submission of requirements",
    overview: [
      "This step shows requirement groups with upload controls and a document checklist.",
      "Only the 2x2 ID picture with white background is required to proceed.",
      "Other documents can be uploaded immediately or submitted to follow.",
    ],
    actions: [
      "Upload the required 2x2 picture.",
      "Upload optional educational certificates, ministry documents, letters, civil documents, and clearances when available.",
      "Use View Sample for supported sample documents.",
      "Select Continue to Pre-orientation after the required picture is uploaded.",
    ],
    requirements: [
      "Required now: 2x2 picture with white background.",
      "Optional or to-follow: HS Baccalaureate Diploma, 2-3 year program Baccalaureate Diploma, Master's degree Baccalaureate Diploma, Doctoral degree Baccalaureate Diploma.",
      "Optional or to-follow: Ordination Certificate or Certificate of Pastoral Appointment if pastor, Recommendation Letter if not pastor, Letter of Intent, Endorsement Letters, Marriage Contract if married, Barangay Clearance, Police Clearance, and NBI Clearance.",
      "Accepted upload input lists PDF, JPG, JPEG, and PNG files.",
    ],
    notes: [
      "The checklist can show pending, waiting for verification, approved, or rejected states.",
      "The current continue gate checks for at least the required 2x2 picture.",
    ],
    previous: {
      label: "Online Application",
      href: basePath,
    },
    next: {
      label: "Pre-orientation Course",
      href: `${basePath}/pre-orientation`,
    },
  },
  "pre-orientation": {
    title: "Pre-orientation Course",
    stepLabel: "Step 3",
    description:
      "Members complete orientation videos, reading, and a short assessment before payment.",
    imageSrc: "/docs-screenshots/pre-orientation.mp4",
    isVideo: true,
    imageAlt: "Pre-orientation lesson preview image",
    overview: [
      "The pre-orientation course contains three video lessons, mission and vision reading, objectives reading, and a 5-question assessment.",
      "Payment is locked until all three pre-orientation requirements are complete.",
      "Video fast-forward and playback speed changes are restricted while lessons are incomplete.",
    ],
    actions: [
      "Open and watch all three orientation videos.",
      "Read the mission, vision, and objectives.",
      "Check the reading confirmation box.",
      "Answer all five assessment questions correctly.",
      "Select Continue to Payment.",
    ],
    requirements: [
      "All 3 video lessons must be completed.",
      "The reading confirmation checkbox must be checked.",
      "All 5 assessment answers must be correct.",
      "Each video is marked complete after at least 5 minutes watched or when the video ends.",
    ],
    notes: [
      "The course is labeled free in the onboarding UI.",
      "If a member tries to skip ahead, the wizard returns them to pre-orientation until it is complete.",
    ],
    previous: {
      label: "Submission of Requirements",
      href: `${basePath}/requirements`,
    },
    next: {
      label: "Payment / Checkout",
      href: `${basePath}/payment-checkout`,
    },
  },
  "payment-checkout": {
    title: "Payment / Checkout",
    stepLabel: "Step 4",
    description:
      "Members select a payment method and submit proof of payment when required.",
    imageSrc: "/docs-screenshots/payment.png",
    imageAlt: "Placeholder screenshot for payment checkout",
    overview: [
      "The payment checkout step displays a PHP 500.00 training fee.",
      "Accepted methods are E-wallets, Direct debit, Over the counter, and Cash.",
      "Non-cash payment methods require proof of payment before continuing.",
    ],
    actions: [
      "Select a payment method.",
      "For E-wallet, Direct debit, or Over the counter, review the account information and upload proof of payment.",
      "For Cash, coordinate with admin for onsite remittance and acknowledgment.",
      "Select Continue to Online Interview after payment requirements are complete.",
    ],
    requirements: [
      "A payment method is required.",
      "Proof of payment is required for non-cash methods.",
      "Proof of payment is not required when Cash is selected.",
      "Promissory notes are not accepted in the current UI.",
    ],
    notes: [
      "E-wallet account shown: RODEL R. MANZO, 0919 458 9099.",
      "Direct debit and over-the-counter account shown: RODEL R. MANZO, 010410140228.",
      "Contact number shown for payment coordination: +63 919 458 9099.",
    ],
    previous: {
      label: "Pre-orientation Course",
      href: `${basePath}/pre-orientation`,
    },
    next: {
      label: "Online Interview",
      href: `${basePath}/online-interview`,
    },
  },
  "online-interview": {
    title: "Online Interview",
    stepLabel: "Step 5",
    description:
      "Members book a weekend Zoom interview appointment before ID generation.",
    imageSrc: "/docs-screenshots/online-interview.png",
    imageAlt: "Placeholder screenshot for online interview appointment",
    overview: [
      "The online interview step asks the member to choose an interviewer, weekend day, and one-hour time slot.",
      "After appointment confirmation, the system generates Zoom meeting details.",
      "The saved appointment is required before the member can continue to ID generation.",
    ],
    actions: [
      "Select an interviewer.",
      "Select Saturday or Sunday.",
      "Select a time slot from 8:00 AM through 5:00 PM.",
      "Confirm the interview appointment.",
      "Copy or save the Zoom link, meeting ID, and passcode.",
      "Select Continue to Member ID Generation.",
    ],
    requirements: [
      "Interviewer is required.",
      "Day is required and must be Saturday or Sunday.",
      "Time slot is required.",
      "Zoom meeting link must be released by confirming the appointment.",
    ],
    notes: [
      "Current interviewers listed in the UI are Bishop Dr. Rodel Manzo, Ptr. Maria Santos, and Ptr. Jose Dela Cruz.",
      "Available slots are hourly from 08:00 AM to 05:00 PM.",
    ],
    previous: {
      label: "Payment / Checkout",
      href: `${basePath}/payment-checkout`,
    },
    next: {
      label: "Member ID / QR and Certificate",
      href: `${basePath}/id-generation`,
    },
  },
  "id-generation": {
    title: "Member ID / QR and Certificate",
    stepLabel: "Step 6",
    description:
      "The system generates the member profile ID, QR code, and membership certificate.",
    imageSrc: "/docs-screenshots/id-generation.png",
    imageAlt: "Placeholder screenshot for member ID generation",
    overview: [
      "This step appears after payment checkout and interview appointment completion.",
      "The page generates a member profile URL, QR code, and Certificate of Membership for Associate Chaplain.",
      "QR code and certificate files are uploaded to member records before continuing.",
    ],
    actions: [
      "Wait for payment verification data to be available.",
      "Review the generated member ID and public profile URL.",
      "Copy or open the public profile link when needed.",
      "Review or download the generated certificate.",
      "Select Continue to Chaplaincy 101.",
    ],
    requirements: [
      "Payment verification must be present.",
      "Member unique ID must be available.",
      "QR code must be generated from the public profile URL.",
      "Certificate PDF must be generated from the membership certificate template.",
      "QR code and certificate must upload successfully before continuing.",
    ],
    notes: [
      "The public profile URL uses `/profile/{memberUniqueId}`.",
      "The certificate template path is `/certificates-template/Certificate-of-Membership-2026.pdf`.",
    ],
    previous: {
      label: "Online Interview",
      href: `${basePath}/online-interview`,
    },
    next: {
      label: "Chaplaincy 101 Training",
      href: `${basePath}/chaplaincy-101`,
    },
  },
  "chaplaincy-101": {
    title: "Chaplaincy 101 Training",
    isVideo: true,
    stepLabel: "Step 7",
    description:
      "Members complete 8 PowerPoint lessons and answer 10 essay assessment questions.",
    imageSrc: "/docs-screenshots/training.mp4",
    imageAlt: "Chaplaincy 101 training preview image",
    overview: [
      "Chaplaincy 101 contains 8 PowerPoint lessons about chaplain identity, ethics, discipline, and core service orientation.",
      "The essay assessment appears after all lessons are completed.",
      "The member must answer all 10 essay questions before oath taking unlocks.",
    ],
    actions: [
      "Open each PowerPoint lesson.",
      "Mark lessons complete through the lesson dialog controls.",
      "Answer all 10 essay questions after completing the lessons.",
      "Select Continue to Oath Taking.",
    ],
    requirements: [
      "All 8 PowerPoint lessons must be completed.",
      "All 10 essay questions must have answers.",
      "Progress is persisted while lessons and essay answers are completed.",
    ],
    notes: [
      "Office web preview cannot open localhost files during local development, so the UI provides an Open Lesson in New Tab fallback.",
      "Lesson titles include The Chaplaincy, What Is a Chaplain, What Does a Pearl Chaplain Do, Chaplain vs. Pastor, Types of Chaplaincies, Professional Ethics for Pearl Chaplaincy, Chaplains Courtesy and Discipline, and Pearl Chaplaincy Membership.",
    ],
    previous: {
      label: "Member ID / QR and Certificate",
      href: `${basePath}/id-generation`,
    },
    next: {
      label: "Oath Taking",
      href: `${basePath}/oath-taking`,
    },
  },
  "oath-taking": {
    title: "Oath Taking",
    stepLabel: "Step 8",
    description:
      "Members wait for the official oath taking schedule and credential release instructions.",
    imageSrc: "/docs-screenshots/oath-taking.png",
    imageAlt: "Placeholder screenshot for oath taking",
    overview: [
      "Oath taking is the final onboarding step after Chaplaincy 101 completion.",
      "The oath taking schedule is managed by admin and leadership.",
      "Schedule details are sent to the member's registered email address.",
    ],
    actions: [
      "Wait for the assigned ceremony date and time.",
      "Watch for venue and attendance instructions from leadership.",
      "Attend the oath taking ceremony.",
      "Claim credentials after attendance is completed.",
    ],
    requirements: [
      "All previous onboarding steps must be complete.",
      "Member ID reference must already be available.",
      "The member must attend the oath taking ceremony to complete onboarding.",
    ],
    notes: [
      "Certificate of Authority, Certificate of Appointment, and Physical ID are claimable upon oath taking attendance.",
      "The page includes a Back to home button after the final instructions.",
    ],
    previous: {
      label: "Chaplaincy 101 Training",
      href: `${basePath}/chaplaincy-101`,
    },
  },
};

const BASE_ON_THIS_PAGE = [
  { label: "Overview", href: "#overview" },
  { label: "Actions", href: "#actions" },
  { label: "Requirements", href: "#requirements" },
  { label: "Notes", href: "#notes" },
];

const STEP_2_ON_THIS_PAGE = [
  { label: "Overview", href: "#overview" },
  { label: "Actions", href: "#actions" },
  { label: "File Requirements", href: "#file-requirements" },
  { label: "Requirements", href: "#requirements" },
  { label: "Notes", href: "#notes" },
];

const STEP_2_FILE_REQUIREMENTS = [
  {
    title: "2x2 ID Picture",
    description: "Required to continue. Use a white background and clear face.",
    imageSrc: "/requirement-samples/1.png",
    imageAlt: "2x2 ID picture sample",
    type: "image",
    rules: [
      "Image file only.",
      "Maximum file size: 4 MB.",
      "Supported formats: PNG, JPG, and JPEG.",
      "No scan, screenshot, glare, heavy crop, blur, or covered face.",
    ],
  },
  {
    title: "Marriage Contract",
    description: "Submit only if married.",
    imageSrc: "/requirement-samples/2.png",
    imageAlt: "Marriage contract sample",
    type: "document",
    rules: [
      "File or image upload is allowed.",
      "Maximum file size: 4 MB.",
      "Supported formats: PDF, PNG, JPG, and JPEG.",
      "The full document must be readable with no glare or cropped edges.",
    ],
  },
  {
    title: "Barangay Clearance",
    description: "May be submitted now or to-follow.",
    imageSrc: "/requirement-samples/3.png",
    imageAlt: "Barangay clearance sample",
    type: "document",
    rules: [
      "File or image upload is allowed.",
      "Maximum file size: 4 MB.",
      "Supported formats: PDF, PNG, JPG, and JPEG.",
      "The full document must be readable with no glare or cropped edges.",
    ],
  },
  {
    title: "Police Clearance",
    description: "May be submitted now or to-follow.",
    imageSrc: "/requirement-samples/4.png",
    imageAlt: "Police clearance sample",
    type: "document",
    rules: [
      "File or image upload is allowed.",
      "Maximum file size: 4 MB.",
      "Supported formats: PDF, PNG, JPG, and JPEG.",
      "The full document must be readable with no glare or cropped edges.",
    ],
  },
  {
    title: "NBI Clearance",
    description: "May be submitted now or to-follow.",
    imageSrc: "/requirement-samples/5.png",
    imageAlt: "NBI clearance sample",
    type: "document",
    rules: [
      "File or image upload is allowed.",
      "Maximum file size: 4 MB.",
      "Supported formats: PDF, PNG, JPG, and JPEG.",
      "The full document must be readable with no glare or cropped edges.",
    ],
  },
] as const;

export const MemberOnboardingStepPage = ({
  step,
}: {
  step: MemberOnboardingStepSlug;
}) => {
  const doc = STEP_DOCS[step];
  const onThisPageItems =
    step === "requirements" ? STEP_2_ON_THIS_PAGE : BASE_ON_THIS_PAGE;

  return (
    <article className="mx-auto max-w-5xl pb-12">
      <OnThisPageRegister items={onThisPageItems} />

      <section id="overview" className="scroll-mt-36">
        <p className="text-sm font-semibold text-[#0f6b2a]">{doc.stepLabel}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tighter text-foreground">
          {doc.title}
        </h1>
        <div className="mt-6 space-y-5 text-muted-foreground">
          <p>{doc.description}</p>
          <ul>
            {doc.overview.map((item) => (
              <li className="list-disc ml-5" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-14 overflow-hidden rounded-lg border bg-card">
        <div className="bg-background">
          <div className="relative aspect-video min-h-70">
            {doc.isVideo ? (
              <video
                src={doc.imageSrc}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                controls
                loop
                playsInline
              />
            ) : (
              <Image
                src={doc.imageSrc}
                alt={doc.imageAlt}
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>
      </section>

      <section id="actions" className="mt-14 scroll-mt-36">
        <InfoList
          title="What the Member Does"
          description="Follow these actions in the onboarding page."
          items={doc.actions}
          icon="check"
        />
      </section>

      {step === "requirements" ? (
        <section id="file-requirements" className="mt-14 scroll-mt-36">
          <StepTwoFileRequirements />
        </section>
      ) : null}

      <section id="requirements" className="mt-14 scroll-mt-36">
        <InfoList
          title="Required to Continue"
          description="These are the gates enforced by the onboarding UI and progress logic."
          items={doc.requirements}
          icon="check"
        />
      </section>

      <section id="notes" className="mt-14 scroll-mt-36">
        <InfoList
          title="Important Notes"
          description="Use these notes when explaining the step to members."
          items={doc.notes}
          icon="info"
        />
      </section>

      <footer className="mt-14 space-y-8">
        <div className="grid gap-3 sm:grid-cols-2">
          {doc.previous ? (
            <Link
              href={doc.previous.href}
              className="group flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:border-[#0f6b2a]/50 hover:bg-[#0f6b2a]/5"
            >
              <ChevronLeft className="size-5 text-muted-foreground transition-transform group-hover:-translate-x-1" />
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground">
                  Previous
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {doc.previous.label}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {doc.next ? (
            <Link
              href={doc.next.href}
              className="group flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:border-[#0f6b2a]/50 hover:bg-[#0f6b2a]/5"
            >
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Next
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {doc.next.label}
                </p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ) : null}
        </div>

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

const StepTwoFileRequirements = () => {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          File and Image Requirements
        </h2>
        <p className="mt-1 text-muted-foreground">
          These upload rules apply only to Step 2: Submission of Requirements.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        {STEP_2_FILE_REQUIREMENTS.map((requirement) => {
          const Icon = requirement.type === "image" ? FileImage : FileText;

          return (
            <article
              key={requirement.title}
              className="overflow-hidden rounded-lg border bg-background"
            >
              <div className="relative aspect-video bg-muted/40">
                <Image
                  src={requirement.imageSrc}
                  alt={requirement.imageAlt}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="border-t p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#0f6b2a]/10 text-[#0f6b2a]">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {requirement.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {requirement.description}
                    </p>
                  </div>
                </div>

                <ul className="mt-4 grid gap-2">
                  {requirement.rules.map((rule) => (
                    <li key={rule} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-[#0f6b2a]" />
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

const InfoList = ({
  title,
  description,
  items,
  icon,
}: {
  title: string;
  description: string;
  items: string[];
  icon: "check" | "info" | "list";
}) => {
  const Icon = icon === "check" ? Check : icon === "info" ? Info : ListChecks;

  return (
    <div className="rounded-lg border bg-card p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          {title}
        </h2>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>

      <ul className="mt-6 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
