import { api } from "@/lib/http-client";
import { authStore } from "@/lib/auth-store";
import type {
  AuthSuccessResponse,
  UserEnvelopeResponse,
  UserPublic,
  VerifyEmailResponse,
} from "@/lib/api-types";
import type { LoginRequest, RegisterRequest, VerifyEmailRequest } from "./auth.types";
import axios from "axios";

export async function login(payload: LoginRequest) {
  const { data } = await api.post<AuthSuccessResponse>("/auth/login", payload);

  if (data.accessToken && !data.mfaRequired) {
    authStore.setAccessToken(data.accessToken);
  }

  return data;
}

export async function register(payload: RegisterRequest) {
  const { data } = await api.post<AuthSuccessResponse>("/auth/register", payload);

  if (data.accessToken) {
    authStore.setAccessToken(data.accessToken);
  }

  return data;
}

export async function verifyEmail(payload: VerifyEmailRequest) {
  const { data } = await api.post<VerifyEmailResponse>("/auth/verify-email", payload);
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get<UserEnvelopeResponse>("/users/current");
  return data.user;
}

export async function getOptionalCurrentUser(): Promise<UserPublic | null> {
  try {
    return await getCurrentUser();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        return null;
      }
    }

    throw error;
  }
}

export async function logout() {
  try {
    await api.delete("/auth/logout");
  } finally {
    authStore.clear();
  }
}
