import { api } from "@/lib/http-client";
import type {
  ApplyMemberRequest,
  ApplyMemberResponse,
  MemberChaplaincyTrainingProgressResponse,
  MemberIdGenerationAssetResponse,
  MemberOnboardingProgressResponse,
  MemberOnlineInterviewAppointmentResponse,
  MemberPaymentCheckoutResponse,
  MemberRequirementsResponse,
  UpdateOnboardingStepRequest,
  UpdatePreOrientationProgressRequest,
  UpsertMemberOnlineInterviewAppointmentRequest,
  UpsertMemberChaplaincyTrainingProgressRequest,
  UpsertMemberIdGenerationAssetRequest,
  UpsertMemberPaymentCheckoutRequest,
  UpsertMemberRequirementsRequest,
} from "./member.types";

export async function applyMember(payload: ApplyMemberRequest) {
  const { data } = await api.post<ApplyMemberResponse>("/members/apply", payload);
  return data;
}

export async function getCurrentMemberRequirements() {
  const { data } = await api.get<MemberRequirementsResponse>("/members/current/requirements");
  return data;
}

export async function upsertMemberRequirements(payload: UpsertMemberRequirementsRequest) {
  const { data } = await api.put<MemberRequirementsResponse>("/members/current/requirements", payload);
  return data;
}

export async function getCurrentMemberOnboardingProgress() {
  const { data } = await api.get<MemberOnboardingProgressResponse>(
    "/members/current/onboarding-progress",
  );
  return data;
}

export async function updateCurrentMemberOnboardingStep(payload: UpdateOnboardingStepRequest) {
  const { data } = await api.put<MemberOnboardingProgressResponse>(
    "/members/current/onboarding-progress/step",
    payload,
  );
  return data;
}

export async function updateCurrentMemberPreOrientationProgress(
  payload: UpdatePreOrientationProgressRequest,
) {
  const { data } = await api.put<MemberOnboardingProgressResponse>(
    "/members/current/onboarding-progress/pre-orientation",
    payload,
  );
  return data;
}

export async function getCurrentMemberPaymentCheckout() {
  const { data } = await api.get<MemberPaymentCheckoutResponse>(
    "/members/current/payment-checkout",
  );
  return data;
}

export async function upsertCurrentMemberPaymentCheckout(
  payload: UpsertMemberPaymentCheckoutRequest,
) {
  const { data } = await api.put<MemberPaymentCheckoutResponse>(
    "/members/current/payment-checkout",
    payload,
  );
  return data;
}

export async function getCurrentMemberOnlineInterviewAppointment() {
  const { data } = await api.get<MemberOnlineInterviewAppointmentResponse>(
    "/members/current/online-interview",
  );
  return data;
}

export async function upsertCurrentMemberOnlineInterviewAppointment(
  payload: UpsertMemberOnlineInterviewAppointmentRequest,
) {
  const { data } = await api.put<MemberOnlineInterviewAppointmentResponse>(
    "/members/current/online-interview",
    payload,
  );
  return data;
}

export async function getCurrentMemberIdGenerationAsset() {
  const { data } = await api.get<MemberIdGenerationAssetResponse>(
    "/members/current/id-generation",
  );
  return data;
}

export async function upsertCurrentMemberIdGenerationAsset(
  payload: UpsertMemberIdGenerationAssetRequest,
) {
  const { data } = await api.put<MemberIdGenerationAssetResponse>(
    "/members/current/id-generation",
    payload,
  );
  return data;
}

export async function getCurrentMemberChaplaincyTrainingProgress() {
  const { data } = await api.get<MemberChaplaincyTrainingProgressResponse>(
    "/members/current/chaplaincy-training",
  );
  return data;
}

export async function upsertCurrentMemberChaplaincyTrainingProgress(
  payload: UpsertMemberChaplaincyTrainingProgressRequest,
) {
  const { data } = await api.put<MemberChaplaincyTrainingProgressResponse>(
    "/members/current/chaplaincy-training",
    payload,
  );
  return data;
}
