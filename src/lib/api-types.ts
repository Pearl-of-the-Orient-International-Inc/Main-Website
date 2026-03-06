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
