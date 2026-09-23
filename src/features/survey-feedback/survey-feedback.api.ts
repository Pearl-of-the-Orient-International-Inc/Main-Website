import { api } from "@/lib/http-client";
import type { SurveyFeedbackPayload } from "./survey-feedback.types";

export async function submitSurveyFeedback(payload: SurveyFeedbackPayload) {
  const { data } = await api.post<{ data: { id: string; createdAt: string } }>(
    "/survey-feedback/public/responses",
    payload,
  );
  return data.data;
}
