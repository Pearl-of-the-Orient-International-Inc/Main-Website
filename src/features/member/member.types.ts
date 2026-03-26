export interface ApplyMemberRequest {
  firstName: string;
  middleInitial?: string;
  lastName: string;
  mobilePhoneNumber: string;
  homeAddress: string;
  civilStatus: "SINGLE" | "MARRIED" | "WIDOWED" | "SEPARATED" | "ANNULLED";
  gender: "MALE" | "FEMALE" | "PREFER_NOT_TO_SAY";
  nationality: string;
  dateOfBirth: string;
  region: string;
  province: string;
  municipalityCity: string;
  barangay: string;
  emergencyContactName: string;
  emergencyContactMobile: string;
  churchAffiliation: string;
  churchAddress: string;
  currentPositionRole: string;
  currentPositionRoleOther?: string;
  height?: string;
  weight?: string;
  bloodType?: string;
  colorOfEyes?: string;
  colorOfSkin?: string;
  sssNumber?: string;
  tinNumber?: string;
  skillsTalents?: string;
  preferredBranchOther?: string;
  elementarySchool?: string;
  secondarySchool?: string;
  tertiaryCollege?: string;
  postGraduateStudies?: string;
  ministerialExperiences?: Array<{
    roleDescription: string;
    yearsApprox: string;
  }>;
  characterReferences?: Array<{
    name: string;
    positionRelationship: string;
    contactNumber: string;
  }>;
  signature?: {
    type: "DRAWN" | "UPLOADED";
    signatureData: string;
  };
}

export type ApplicantRequirementType =
  | "PHOTO_2X2"
  | "HS_BACCALAUREATE_DIPLOMA"
  | "TWO_THREE_YEAR_PROGRAM_DIPLOMA"
  | "MASTERS_DEGREE_DIPLOMA"
  | "DOCTORAL_DEGREE_DIPLOMA"
  | "ORDINATION_CERTIFICATE"
  | "PASTORS_RECOMMENDATION_LETTER"
  | "LETTER_OF_INTENT"
  | "ENDORSEMENT_LETTERS"
  | "MARRIAGE_CONTRACT"
  | "CLEARANCE_BARANGAY"
  | "CLEARANCE_POLICE"
  | "CLEARANCE_NBI";

export interface RequirementAttachmentInput {
  type: ApplicantRequirementType;
  fileUrl: string;
  fileName?: string;
  mimeType?: string;
}

export interface UpsertMemberRequirementsRequest {
  attachments: RequirementAttachmentInput[];
}

export interface MemberRequirementsResponse {
  code: string;
  message: string;
  data: {
    memberId: string;
    uniqueId?: string | null;
    attachments: Record<string, string>;
    requirements: Array<{
      type: ApplicantRequirementType;
      fileUrl: string;
      fileName: string | null;
      mimeType: string | null;
      reviewStatus: "PENDING" | "APPROVED" | "REJECTED";
      updatedAt: string;
    }>;
  };
}

export type MemberOnboardingStep =
  | "REQUIREMENTS"
  | "PRE_ORIENTATION"
  | "PAYMENT_CHECKOUT"
  | "ONLINE_INTERVIEW"
  | "ID_GENERATION"
  | "CHAPLAINCY_101"
  | "OATH_TAKING";

export interface MemberOnboardingProgressResponse {
  code: string;
  message: string;
  data: {
    currentStep: MemberOnboardingStep;
    preOrientationCompletedLessonIds: number[];
    preOrientationCompletedAt: string | null;
  };
}

export interface UpdateOnboardingStepRequest {
  currentStep: MemberOnboardingStep;
}

export interface UpdatePreOrientationProgressRequest {
  completedLessonIds: number[];
  isCompleted?: boolean;
}

export type MemberPaymentMethod =
  | "E_WALLET"
  | "DIRECT_DEBIT"
  | "OVER_THE_COUNTER"
  | "CASH";

export interface MemberPaymentCheckoutData {
  paymentMethod: MemberPaymentMethod;
  proofOfPaymentUrl: string | null;
  isPromissoryNote: boolean;
  promissoryNoteUrl: string | null;
  submittedAt: string;
}

export interface MemberPaymentCheckoutResponse {
  code: string;
  message: string;
  data: MemberPaymentCheckoutData | null;
}

export interface UpsertMemberPaymentCheckoutRequest {
  paymentMethod: MemberPaymentMethod;
  proofOfPaymentUrl?: string;
  isPromissoryNote?: boolean;
  promissoryNoteUrl?: string;
}

export type InterviewDay = "SATURDAY" | "SUNDAY";

export interface MemberOnlineInterviewAppointmentData {
  interviewerId: string;
  interviewerName: string;
  day: InterviewDay;
  timeSlot: string;
  zoomLink: string;
  meetingId: string | null;
  passcode: string | null;
  confirmedAt: string;
}

export interface MemberOnlineInterviewAppointmentResponse {
  code: string;
  message: string;
  data: MemberOnlineInterviewAppointmentData | null;
}

export interface UpsertMemberOnlineInterviewAppointmentRequest {
  interviewerId: string;
  interviewerName: string;
  day: InterviewDay;
  timeSlot: string;
  zoomLink: string;
  meetingId?: string;
  passcode?: string;
}

export interface MemberIdGenerationAssetData {
  profileUrl: string;
  qrCodeUrl: string;
  certificateUrl: string;
  generatedAt: string;
}

export interface MemberIdGenerationAssetResponse {
  code: string;
  message: string;
  data: {
    uniqueId: string | null;
    asset: MemberIdGenerationAssetData | null;
  };
}

export interface UpsertMemberIdGenerationAssetRequest {
  profileUrl: string;
  qrCodeUrl: string;
  certificateUrl: string;
}

export interface MemberChaplaincyTrainingProgressData {
  completedLessonIds: number[];
  essayAnswers: Record<string, string>;
  completedAt: string | null;
}

export interface MemberChaplaincyTrainingProgressResponse {
  code: string;
  message: string;
  data: MemberChaplaincyTrainingProgressData | null;
}

export interface UpsertMemberChaplaincyTrainingProgressRequest {
  completedLessonIds: number[];
  essayAnswers?: Record<string, string>;
  isCompleted?: boolean;
}

export interface ApplyMemberResponse {
  code: string;
  message: string;
  data: {
    id: string;
    uniqueId?: string | null;
    status: string;
  };
}
