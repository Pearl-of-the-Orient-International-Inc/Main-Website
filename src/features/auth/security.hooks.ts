import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as securityApi from "./security.api";

export const useUserSessionsQuery = () =>
  useQuery({
    queryKey: ["security", "sessions"],
    queryFn: securityApi.getUserSessions,
    refetchOnMount: "always",
  });

export const useCurrentUserActivityLogsQuery = () =>
  useQuery({
    queryKey: ["security", "activity"],
    queryFn: securityApi.getCurrentUserActivityLogs,
    refetchOnMount: "always",
  });

export const useChangePasswordMutation = () =>
  useMutation({
    mutationFn: securityApi.changePassword,
    throwOnError: false,
    meta: { feature: "security.changePassword" },
  });

export const useSetupTwoFactorMutation = () =>
  useMutation({
    mutationFn: securityApi.setupTwoFactor,
    throwOnError: false,
    meta: { feature: "security.setupTwoFactor" },
  });

export const useEnableTwoFactorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: securityApi.enableTwoFactor,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] });
    },
    meta: { feature: "security.enableTwoFactor" },
  });
};

export const useDisableTwoFactorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: securityApi.disableTwoFactor,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] });
    },
    meta: { feature: "security.disableTwoFactor" },
  });
};

export const useRevokeUserSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: securityApi.revokeUserSession,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["security", "sessions"] });
    },
    meta: { feature: "security.revokeSession" },
  });
};

export const useRevokeOtherUserSessionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: securityApi.revokeOtherUserSessions,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["security", "sessions"] });
    },
    meta: { feature: "security.revokeOtherSessions" },
  });
};
