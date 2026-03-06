export type BranchOfService =
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

export type ApplicationFormState = {
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
  tertiarySchool: string[];
  postGraduateStudies: string[];

  // Ministry & skills
  ministerialWorkExperience: {
    rolePosition: string;
    institution: string;
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

  // Declarations
  declarationTruthConfirmed: boolean;
  monthlyPledgeConfirmed: boolean;
};

export type StepIndex = 0 | 1 | 2 | 3;

