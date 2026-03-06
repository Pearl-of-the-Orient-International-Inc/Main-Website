import type { ApplicationFormState } from "./types";
import type { ApplicantRequirementType } from "@/features/member/member.types";

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
  tertiarySchool: [""],
  postGraduateStudies: [""],
  ministerialWorkExperience: [
    { rolePosition: "", institution: "", years: "" },
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
  declarationTruthConfirmed: false,
  monthlyPledgeConfirmed: false,
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

export type OnboardingStepId =
  | "application"
  | "requirements"
  | "pre_orientation"
  | "payment_checkout"
  | "online_interview"
  | "chaplaincy_101"
  | "oath_taking"
  | "id_generation";

export const REQUIREMENT_KEYS = [
  "photo_2x2",
  "hs_baccalaureate_diploma",
  "two_three_year_program_diploma",
  "masters_degree_diploma",
  "doctoral_degree_diploma",
  "ordination_certificate",
  "pastors_recommendation_letter",
  "letter_of_intent",
  "endorsement_letters",
  "marriage_contract",
  "clearance_barangay",
  "clearance_police",
  "clearance_nbi",
] as const;

export type RequirementKey = (typeof REQUIREMENT_KEYS)[number];

export const REQUIREMENT_TYPE_BY_KEY: Record<RequirementKey, ApplicantRequirementType> = {
  photo_2x2: "PHOTO_2X2",
  hs_baccalaureate_diploma: "HS_BACCALAUREATE_DIPLOMA",
  two_three_year_program_diploma: "TWO_THREE_YEAR_PROGRAM_DIPLOMA",
  masters_degree_diploma: "MASTERS_DEGREE_DIPLOMA",
  doctoral_degree_diploma: "DOCTORAL_DEGREE_DIPLOMA",
  ordination_certificate: "ORDINATION_CERTIFICATE",
  pastors_recommendation_letter: "PASTORS_RECOMMENDATION_LETTER",
  letter_of_intent: "LETTER_OF_INTENT",
  endorsement_letters: "ENDORSEMENT_LETTERS",
  marriage_contract: "MARRIAGE_CONTRACT",
  clearance_barangay: "CLEARANCE_BARANGAY",
  clearance_police: "CLEARANCE_POLICE",
  clearance_nbi: "CLEARANCE_NBI",
};

export const REQUIREMENT_LABELS: Record<RequirementKey, string> = {
  photo_2x2:
    "2x2 picture (white background) - required",
  hs_baccalaureate_diploma: "HS Baccalaureate Diploma",
  two_three_year_program_diploma: "2-3 year program Baccalaureate Diploma",
  masters_degree_diploma: "Master's degree Baccalaureate Diploma",
  doctoral_degree_diploma: "Doctoral degree Baccalaureate Diploma",
  ordination_certificate:
    "Ordination Certificate/Certificate of Pastoral Appointment (if pastor)",
  pastors_recommendation_letter: "Recommendation Letter (if not pastor)",
  letter_of_intent: "Letter of Intent",
  endorsement_letters: "Endorsement Letters",
  marriage_contract: "Marriage Contract (if married)",
  clearance_barangay: "Barangay Clearance",
  clearance_police: "Police Clearance",
  clearance_nbi: "NBI Clearance",
};

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
    id: "payment_checkout",
    title: "Payment / checkout",
    description: "Submit payment or promissory note.",
  },
  {
    id: "online_interview",
    title: "Online interview",
    description: "Book your weekend interview appointment.",
  },
  {
    id: "id_generation",
    title: "ID generation",
    description: "Receive your member ID and certificate.",
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
];
