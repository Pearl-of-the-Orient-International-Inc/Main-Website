import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toApiError } from "@/lib/http-client";
import * as authApi from "./auth.api";
import { uploadAvatar } from "./avatar-upload.api";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    throwOnError: false,
    onSuccess: async (response) => {
      if (response.mfaRequired || !response.accessToken) {
        return;
      }

      const currentUser = await authApi.getCurrentUser().catch(() => response.user);

      queryClient.setQueryData(["auth", "current-user"], currentUser);
      queryClient.setQueryData(["auth", "current-user", "optional"], currentUser);

      await queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    meta: { feature: "auth.login" },
  });
};

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: authApi.register,
    throwOnError: false,
    meta: { feature: "auth.register" },
  });

export const useVerifyEmailMutation = () =>
  useMutation({
    mutationFn: authApi.verifyEmail,
    throwOnError: false,
    meta: { feature: "auth.verifyEmail" },
  });

export const useCurrentUserQuery = () =>
  useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: authApi.getCurrentUser,
    staleTime: 0,
    refetchOnMount: "always",
  });

export const useOptionalCurrentUserQuery = () =>
  useQuery({
    queryKey: ["auth", "current-user", "optional"],
    queryFn: authApi.getOptionalCurrentUser,
    staleTime: 0,
    refetchOnMount: "always",
  });

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAvatar,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    meta: { feature: "auth.uploadAvatar" },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    throwOnError: false,
    onSettled: async () => {
      await queryClient.cancelQueries({ queryKey: ["auth"] });
      queryClient.removeQueries({ queryKey: ["auth"] });
    },
    meta: { feature: "auth.logout" },
  });
};

export { toApiError };
