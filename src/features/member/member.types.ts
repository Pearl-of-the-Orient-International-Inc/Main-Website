export interface ApplyMemberRequest {
  email: string;
  firstName: string;
  middleInitial?: string;
  lastName: string;
  extensionName?: string;
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
  churchAffiliation?: string;
  churchAddress?: string;
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
    status: "PENDING" | "APPROVED" | "REJECTED";
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

export interface CurrentMemberProfileBannerResponse {
  code: string;
  message: string;
  data: {
    id: string;
    uniqueId: string | null;
    profileBannerUrl: string | null;
    profileBannerPositionY: number;
  };
}

export interface UpdateCurrentProfileBannerRequest {
  profileBannerUrl?: string;
  profileBannerPositionY?: number;
}

export interface CurrentChurchAffiliationResponse {
  code: string;
  message: string;
  data: {
    id: string;
    uniqueId: string | null;
    churchAffiliation: string | null;
    churchAddress: string | null;
    currentPositionRole: string | null;
    currentPositionRoleOther: string | null;
  };
}

export interface UpdateCurrentChurchAffiliationRequest {
  churchAffiliation?: string;
  churchAddress?: string;
  currentPositionRole?: string;
  currentPositionRoleOther?: string;
}

export interface CurrentEducationResponse {
  code: string;
  message: string;
  data: {
    id: string;
    uniqueId: string | null;
    elementarySchool: string | null;
    secondarySchool: string | null;
    tertiaryCollege: string | null;
    postGraduateStudies: string | null;
  };
}

export interface UpdateCurrentEducationRequest {
  elementarySchool?: string;
  secondarySchool?: string;
  tertiaryCollegeEntries?: string[];
  postGraduateStudiesEntries?: string[];
}

export interface CurrentBranchServicesResponse {
  code: string;
  message: string;
  data: {
    id: string;
    uniqueId: string | null;
    preferredBranchOther: string | null;
    preferredBranches: Array<{
      id: string;
      title: string;
    }>;
  };
}

export interface UpdateCurrentBranchServicesRequest {
  preferredBranchOther?: string;
}

export interface CreateCurrentMemberCertificateRequest {
  title: string;
  certificateUrl: string;
  issuedAt: string;
}

export type MemberPublicRecordType =
  | "REPORT_ACTIVITY"
  | "COMMUNITY_SERVICE"
  | "TRAINING_CONDUCTED"
  | "PARTICIPATION"
  | "RECOGNITION";

export type MemberPublicRecordStatus = "PUBLISHED" | "DRAFT";

export interface CreateCurrentMemberPublicRecordRequest {
  title: string;
  shortDescription: string;
  type: MemberPublicRecordType;
  eventAt: string;
  location: string;
  status: MemberPublicRecordStatus;
  attachments?: Array<{
    fileUrl: string;
    fileName?: string;
    mimeType?: string;
  }>;
}

export interface MemberPublicRecordAttachmentItem {
  id: string;
  fileUrl: string;
  fileName: string | null;
  mimeType: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface MemberPublicRecordItem {
  id: string;
  title: string;
  shortDescription: string;
  type: MemberPublicRecordType;
  eventAt: string;
  location: string;
  status: MemberPublicRecordStatus;
  createdAt: string;
  updatedAt: string;
  attachments: MemberPublicRecordAttachmentItem[];
}

export interface CreateCurrentMemberPublicRecordResponse {
  code: string;
  message: string;
  data: MemberPublicRecordItem;
}

export interface MemberCertificateItem {
  id: string;
  credentialId: string;
  title: string;
  certificateUrl: string;
  dateReceived: string;
  createdAt: string;
}

export interface CreateCurrentMemberCertificateResponse {
  code: string;
  message: string;
  data: MemberCertificateItem;
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
    user?: {
      id: string;
      name: string;
      email: string;
      accountStatus?: string;
      isEmailVerified?: boolean;
    };
  };
  meta?: {
    createdUser: boolean;
    isEmailVerified: boolean;
  };
}
