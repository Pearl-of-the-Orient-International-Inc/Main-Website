export interface PublicMemberProfileResponse {
  code: string;
  message: string;
  data: {
    id: string;
    uniqueId: string | null;
    badgeNumber: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED";
    memberType:
      | "ASSOCIATE_CHAPLAIN"
      | "PROFESSIONAL_CHAPLAIN"
      | "ORDAINED_AND_COMMISSIONED_PRACTITIONER"
      | "CERTIFIED_SPECIALIST_TRAINING_OFFICER_INSTRUCTOR";
    isActive: boolean;
    firstName: string;
    middleInitial: string | null;
    lastName: string;
    extensionName: string | null;
    churchAffiliation: string | null;
    currentPositionRole: string | null;
    currentPositionRoleOther: string | null;
    nationality: string | null;
    region: string | null;
    province: string | null;
    municipalityCity: string | null;
    barangay: string | null;
    preferredBranchOther: string | null;
    skillsTalents: string | null;
    tertiaryCollege: string | null;
    postGraduateStudies: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
      name: string;
      role: "MEMBER" | "OFFICER" | "ADMIN";
      accountStatus: "ACTIVE" | "PENDING" | "SUSPENDED";
      isEmailVerified: boolean;
    };
    preferredBranches: Array<{
      id: string;
      title: string;
    }>;
    officerAssignments: Array<{
      id: string;
      department: string | null;
      region: string | null;
      province: string | null;
      cityMunicipality: string | null;
      barangay: string | null;
      startDate: string;
      officeTitle: {
        id: string;
        name: string;
        level: string;
      };
    }>;
    applicantRequirements: Array<{
      id: string;
      type: string;
      fileUrl: string;
      fileName: string | null;
      mimeType: string | null;
      updatedAt: string;
    }>;
    onboardingProgress: {
      currentStep:
        | "REQUIREMENTS"
        | "PRE_ORIENTATION"
        | "PAYMENT_CHECKOUT"
        | "ONLINE_INTERVIEW"
        | "ID_GENERATION"
        | "CHAPLAINCY_101"
        | "OATH_TAKING";
      preOrientationCompletedAt: string | null;
    } | null;
    idGenerationAsset: {
      profileUrl: string;
      qrCodeUrl: string;
      certificateUrl: string;
      generatedAt: string;
    } | null;
    chaplaincyTrainingProgress: {
      completedAt: string | null;
    } | null;
  };
}
