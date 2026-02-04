import type { ApplicationFormState } from "./types";

export const emptyFormState: ApplicationFormState = {
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

export const steps = [
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

/** Onboarding step IDs (post-submission). Must match Convex onboardingStepValidator. */
export type OnboardingStepId =
  | "application"
  | "requirements"
  | "pre_orientation"
  | "chaplaincy_101"
  | "oath_taking"
  | "id_generation";

/** Requirement keys for step 2. Must match Convex requirementKeys. */
export const REQUIREMENT_KEYS = [
  "photo_2x2_1",
  "photo_2x2_2",
  "ordination_certificate",
  "pastors_recommendation_letter",
  "baccalaureate_diploma",
  "marriage_contract",
  "clearance_barangay",
  "clearance_police",
  "clearance_nbi",
  "letter_of_intent",
] as const;

export type RequirementKey = (typeof REQUIREMENT_KEYS)[number];

/** Human-readable labels for each requirement. */
export const REQUIREMENT_LABELS: Record<RequirementKey, string> = {
  photo_2x2_1: "2x2 picture (white background) – 1st copy",
  photo_2x2_2: "2x2 picture (white background) – 2nd copy",
  ordination_certificate: "Ordination Certificate or Certificate of Pastoral",
  pastors_recommendation_letter:
    "Pastor's Recommendation Letter (if not a pastor)",
  baccalaureate_diploma: "Baccalaureate Diploma (at least)",
  marriage_contract: "Marriage Contract (if married)",
  clearance_barangay: "Barangay Clearance",
  clearance_police: "Police Clearance",
  clearance_nbi: "NBI Clearance",
  letter_of_intent: "Letter of Intent",
};

/** Clearances: at least one required. */
export const CLEARANCE_KEYS: RequirementKey[] = [
  "clearance_barangay",
  "clearance_police",
  "clearance_nbi",
];

export const onboardingSteps: {
  id: OnboardingStepId;
  title: string;
  description: string;
}[] = [
  {
    id: "application",
    title: "Application form",
    description: "Fill out the membership application.",
  },
  {
    id: "requirements",
    title: "Attach requirements",
    description: "Upload required documents.",
  },
  {
    id: "pre_orientation",
    title: "Pre-orientation",
    description: "Complete pre-orientation.",
  },
  {
    id: "chaplaincy_101",
    title: "Chaplaincy 101 training",
    description: "Complete Chaplaincy 101 training.",
  },
  {
    id: "oath_taking",
    title: "Oath taking",
    description: "Attend oath taking.",
  },
  {
    id: "id_generation",
    title: "ID generation",
    description: "Receive your member ID.",
  },
];
