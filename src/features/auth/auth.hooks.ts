import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toApiError } from "@/lib/http-client";
import * as authApi from "./auth.api";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: authApi.login,
    throwOnError: false,
    meta: { feature: "auth.login" },
  });

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
