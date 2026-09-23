import { useMutation } from "@tanstack/react-query";
import { submitSurveyFeedback } from "./survey-feedback.api";

export const useSubmitSurveyFeedbackMutation = () =>
  useMutation({
    mutationFn: submitSurveyFeedback,
    meta: { feature: "surveyFeedback.submit" },
  });
