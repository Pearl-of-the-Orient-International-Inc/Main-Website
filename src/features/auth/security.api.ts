import { api } from "@/lib/http-client";
import type {
  ActivityLogsResponse,
  ChangePasswordRequest,
  EnableTwoFactorRequest,
  TwoFactorSetupResponse,
  UserSessionsResponse,
} from "./security.types";

export async function getUserSessions() {
  const { data } = await api.get<UserSessionsResponse>("/users/sessions");
  return data.data;
}

export async function revokeUserSession(sessionId: string) {
  await api.delete(`/users/sessions/${sessionId}`);
}

export async function revokeOtherUserSessions() {
  await api.delete("/users/sessions/others");
}

export async function changePassword(payload: ChangePasswordRequest) {
  await api.post("/auth/change-password", payload);
}

export async function setupTwoFactor() {
  const { data } = await api.post<TwoFactorSetupResponse>(
    "/auth/two-factor/setup",
  );
  return data;
}

export async function enableTwoFactor(payload: EnableTwoFactorRequest) {
  await api.post("/auth/two-factor/enable", payload);
}

export async function disableTwoFactor() {
  await api.post("/auth/two-factor/disable");
}

export async function getCurrentUserActivityLogs() {
  const { data } = await api.get<ActivityLogsResponse>(
    "/activity-logs/current?limit=12",
  );
  return data.data;
}
