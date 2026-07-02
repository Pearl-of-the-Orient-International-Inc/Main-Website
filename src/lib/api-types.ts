export interface ApiErrorIssue {
  path: string;
  message: string;
}

export interface ApiErrorResponse {
  code: string;
  message?: string;
  errors?: ApiErrorIssue[];
  requiresVerification?: boolean;
  error?: unknown;
}

export type UserType = "MEMBER" | "OFFICER" | "ADMIN";

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: UserType;
  position?: string | null;
  accountStatus?: string;
  isEmailVerified?: boolean;
  isTwoFactorEnabled?: boolean;
  memberProfile?: {
    id: string;
    uniqueId: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    onboardingProgress?: {
      currentStep:
        | "REQUIREMENTS"
        | "PRE_ORIENTATION"
        | "PAYMENT_CHECKOUT"
        | "ONLINE_INTERVIEW"
        | "ID_GENERATION"
        | "CHAPLAINCY_101"
        | "OATH_TAKING";
    } | null;
  } | null;
}

export interface AuthSuccessResponse {
  code: string;
  message: string;
  user: UserPublic;
  accessToken?: string;
  mfaRequired?: boolean;
  mfaToken?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface VerifyEmailResponse {
  code: string;
  message: string;
  user: UserPublic;
}

export interface UserEnvelopeResponse {
  user: UserPublic;
}

export interface PublicDirectoryProvinceItem {
  province: string;
  memberCount: number;
  municipalityCount: number;
  barangayCount: number;
  municipalities: PublicDirectoryMunicipalityItem[];
}

export interface PublicDirectoryBarangayItem {
  barangay: string;
  memberCount: number;
}

export interface PublicDirectoryMunicipalityItem {
  municipalityCity: string;
  memberCount: number;
  barangayCount: number;
  barangays: PublicDirectoryBarangayItem[];
}

export interface PublicDirectoryRegionLocation {
  region: string;
  memberCount: number;
  provinceCount: number;
  municipalityCount: number;
  barangayCount: number;
  provinces: PublicDirectoryProvinceItem[];
}

export interface PublicDirectoryLocationsData {
  summary: {
    totalMembers: number;
    membersWithRegion: number;
    regionsRepresented: number;
    provincesRepresented: number;
    municipalitiesRepresented: number;
    barangaysRepresented: number;
  };
  headquarters: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  regionLocations: PublicDirectoryRegionLocation[];
}

export interface PublicDirectoryLocationsResponse {
  code: string;
  message: string;
  data: PublicDirectoryLocationsData;
}

export interface PublicServiceChaplain {
  id: string;
  uniqueId: string | null;
  badgeNumber: string | null;
  memberType: "CERTIFIED_SPECIALIST_TRAINING_OFFICER_INSTRUCTOR";
  firstName: string;
  middleInitial: string | null;
  lastName: string;
  extensionName: string | null;
  region: string | null;
  province: string | null;
  municipalityCity: string | null;
  barangay: string | null;
  preferredBranchOther: string | null;
  createdAt: string;
  user: {
    name: string;
    avatar: string | null;
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
    fileUrl: string;
  }>;
}

export interface PublicServiceChaplainsResponse {
  code: string;
  message: string;
  data: PublicServiceChaplain[];
}

export interface PublicNewsBlogMedia {
  id: string;
  kind: "IMAGE" | "VIDEO";
  fileUrl: string;
  fileName: string;
  sortOrder: number;
  createdAt: string;
}

export interface PublicNewsBlogTaggedMember {
  id: string;
  memberId: string;
  taggedAt: string;
  member: {
    id: string;
    firstName: string;
    middleInitial: string | null;
    lastName: string;
    extensionName: string | null;
    fullName: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
    };
  };
}

export interface PublicNewsBlog {
  id: string;
  title: string;
  caption: string;
  status: "PUBLISHED";
  platform: string;
  hashtags: string[];
  scheduledAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  media: PublicNewsBlogMedia[];
  taggedMembers: PublicNewsBlogTaggedMember[];
}

export interface PublicNewsBlogsResponse {
  code: string;
  message: string;
  data: PublicNewsBlog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface PublicNewsBlogResponse {
  code: string;
  message: string;
  data: PublicNewsBlog;
}
