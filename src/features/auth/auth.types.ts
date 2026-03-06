import type { UserType } from "@/lib/api-types";

export interface LoginRequest {
  email: string;
  password: string;
  userAgent?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserType;
}

export interface VerifyEmailRequest {
  code: string;
}
