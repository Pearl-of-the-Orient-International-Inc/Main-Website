import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toApiError } from "@/lib/http-client";
import * as memberApi from "./member.api";
import { uploadMemberCertificate } from "./member-certificate-upload.api";
import { uploadMemberRequirement } from "./member-requirement-upload.api";
import { uploadMemberPaymentDocument } from "./member-payment-upload.api";
import { uploadMemberProfileBanner } from "./member-profile-banner-upload.api";
import { uploadMemberPublicRecordAttachments } from "./member-public-record-upload.api";

export const useApplyMemberMutation = () =>
  useMutation({
    mutationFn: memberApi.applyMember,
    throwOnError: false,
    meta: { feature: "member.apply" },
  });

export const useCurrentMemberRequirementsQuery = () =>
  useQuery({
    queryKey: ["member", "current", "requirements"],
    queryFn: memberApi.getCurrentMemberRequirements,
    staleTime: 60_000,
  });

export const useCurrentMemberProfileBannerQuery = () =>
  useQuery({
    queryKey: ["member", "current", "profile-banner"],
    queryFn: memberApi.getCurrentMemberProfileBanner,
    staleTime: 60_000,
  });

export const useCurrentMemberOnboardingProgressQuery = () =>
  useQuery({
    queryKey: ["member", "current", "onboarding-progress"],
    queryFn: memberApi.getCurrentMemberOnboardingProgress,
    staleTime: 60_000,
  });

export const useCurrentMemberPaymentCheckoutQuery = () =>
  useQuery({
    queryKey: ["member", "current", "payment-checkout"],
    queryFn: memberApi.getCurrentMemberPaymentCheckout,
    staleTime: 60_000,
  });

export const useCurrentMemberOnlineInterviewAppointmentQuery = () =>
  useQuery({
    queryKey: ["member", "current", "online-interview"],
    queryFn: memberApi.getCurrentMemberOnlineInterviewAppointment,
    staleTime: 60_000,
  });

export const useCurrentMemberIdGenerationAssetQuery = () =>
  useQuery({
    queryKey: ["member", "current", "id-generation"],
    queryFn: memberApi.getCurrentMemberIdGenerationAsset,
    staleTime: 60_000,
  });

export const useCurrentMemberChaplaincyTrainingProgressQuery = () =>
  useQuery({
    queryKey: ["member", "current", "chaplaincy-training"],
    queryFn: memberApi.getCurrentMemberChaplaincyTrainingProgress,
    staleTime: 60_000,
  });

export const useUpsertMemberRequirementsMutation = () =>
  useMutation({
    mutationFn: memberApi.upsertMemberRequirements,
    throwOnError: false,
    meta: { feature: "member.requirements.upsert" },
  });

export const useUploadMemberRequirementMutation = () =>
  useMutation({
    mutationFn: uploadMemberRequirement,
    throwOnError: false,
    meta: { feature: "member.requirements.upload" },
  });

export const useUploadMemberProfileBannerMutation = () =>
  useMutation({
    mutationFn: uploadMemberProfileBanner,
    throwOnError: false,
    meta: { feature: "member.profileBanner.upload" },
  });

export const useUploadMemberCertificateMutation = () =>
  useMutation({
    mutationFn: uploadMemberCertificate,
    throwOnError: false,
    meta: { feature: "member.certificate.upload" },
  });

export const useUploadMemberPublicRecordAttachmentsMutation = () =>
  useMutation({
    mutationFn: uploadMemberPublicRecordAttachments,
    throwOnError: false,
    meta: { feature: "member.publicRecord.uploadAttachments" },
  });

export const useUpdateCurrentMemberOnboardingStepMutation = () =>
  useMutation({
    mutationFn: memberApi.updateCurrentMemberOnboardingStep,
    throwOnError: false,
    meta: { feature: "member.onboarding.updateStep" },
  });

export const useUpdateCurrentMemberPreOrientationProgressMutation = () =>
  useMutation({
    mutationFn: memberApi.updateCurrentMemberPreOrientationProgress,
    throwOnError: false,
    meta: { feature: "member.onboarding.preOrientationProgress" },
  });

export const useUpsertCurrentMemberPaymentCheckoutMutation = () =>
  useMutation({
    mutationFn: memberApi.upsertCurrentMemberPaymentCheckout,
    throwOnError: false,
    meta: { feature: "member.paymentCheckout.upsert" },
  });

export const useUploadMemberPaymentDocumentMutation = () =>
  useMutation({
    mutationFn: uploadMemberPaymentDocument,
    throwOnError: false,
    meta: { feature: "member.paymentCheckout.uploadDocument" },
  });

export const useUpsertCurrentMemberOnlineInterviewAppointmentMutation = () =>
  useMutation({
    mutationFn: memberApi.upsertCurrentMemberOnlineInterviewAppointment,
    throwOnError: false,
    meta: { feature: "member.onlineInterview.upsert" },
  });

export const useUpsertCurrentMemberIdGenerationAssetMutation = () =>
  useMutation({
    mutationFn: memberApi.upsertCurrentMemberIdGenerationAsset,
    throwOnError: false,
    meta: { feature: "member.idGeneration.upsertAsset" },
  });

export const useUpsertCurrentMemberChaplaincyTrainingProgressMutation = () =>
  useMutation({
    mutationFn: memberApi.upsertCurrentMemberChaplaincyTrainingProgress,
    throwOnError: false,
    meta: { feature: "member.chaplaincyTraining.upsertProgress" },
  });

export const useUpdateCurrentMemberProfileBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: memberApi.updateCurrentMemberProfileBanner,
    throwOnError: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["member", "current", "profile-banner"],
      });
    },
    meta: { feature: "member.profileBanner.update" },
  });
};

export const useCreateCurrentMemberCertificateMutation = () =>
  useMutation({
    mutationFn: memberApi.createCurrentMemberCertificate,
    throwOnError: false,
    meta: { feature: "member.certificate.create" },
  });

export const useCreateCurrentMemberPublicRecordMutation = () =>
  useMutation({
    mutationFn: memberApi.createCurrentMemberPublicRecord,
    throwOnError: false,
    meta: { feature: "member.publicRecord.create" },
  });

export const useUpdateCurrentChurchAffiliationMutation = () =>
  useMutation({
    mutationFn: memberApi.updateCurrentChurchAffiliation,
    throwOnError: false,
    meta: { feature: "member.churchAffiliation.update" },
  });

export const useUpdateCurrentEducationMutation = () =>
  useMutation({
    mutationFn: memberApi.updateCurrentEducation,
    throwOnError: false,
    meta: { feature: "member.education.update" },
  });

export const useUpdateCurrentBranchServicesMutation = () =>
  useMutation({
    mutationFn: memberApi.updateCurrentBranchServices,
    throwOnError: false,
    meta: { feature: "member.branchServices.update" },
  });

export { toApiError };
