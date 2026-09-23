export type SurveyFeedbackPayload = {
  respondentName: string | null;
  respondentType: "Visitor" | "Member" | "Student" | "Service requester";
  discoverySource: "Social media" | "Friend or family" | "Community announcement" | "Online search" | "Organization member" | "Other";
  improvementAreas: string[];
  welcomeRating: number;
  accessibilityRating: number;
  satisfactionRating: number;
  feedback: string;
  hasIssue: boolean;
  issueCategory: string | null;
  issueDescription: string | null;
  contactEmail: string | null;
};
