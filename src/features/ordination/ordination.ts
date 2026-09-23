import { genUploader } from "uploadthing/client";
import { api, API_BASE_URL } from "@/lib/http-client";
import { authStore } from "@/lib/auth-store";

export type OrdinationDocument = { type: "ELIGIBILITY_EVIDENCE" | "LETTER_OF_INTENT" | "RECOMMENDATION" | "GOVERNMENT_ID" | "OTHER"; fileUrl: string; fileName: string; mimeType?: string };
export type OrdinationApplication = { id: string; status: string; ministryBackground: string; callingStatement: string; proposedMinistry: string; additionalInformation: string | null; documents: OrdinationDocument[]; informationAccurate: boolean; codeOfConductAccepted: boolean; backgroundCheckConsent: boolean; requestedInformation: string | null; adminNotes: string | null; submittedAt: string | null; updatedAt: string; reviews: { id: string; action: string; notes: string | null; createdAt: string; reviewer: { name: string } }[] };
export type OrdinationEligibility = { eligible: boolean; eligibilityReason: string; memberType: string; application: OrdinationApplication | null };

export const getCurrentOrdinationApplication = async () => (await api.get<{ data: OrdinationEligibility }>("/ordination-applications/current")).data.data;
export const saveOrdinationApplication = async (payload: Record<string, unknown>) => (await api.put("/ordination-applications/current", payload)).data.data;
export const submitOrdinationApplication = async (payload: Record<string, unknown>) => (await api.post("/ordination-applications/current/submit", payload)).data.data;

const { uploadFiles } = genUploader({ url: `${API_BASE_URL}/ordination-applications/current/documents/upload` });
export async function uploadOrdinationDocument(file: File) {
  const token = authStore.getAccessToken();
  const uploaded = await uploadFiles("ordinationDocumentUploader", { files: [file], headers: token ? { Authorization: `Bearer ${token}` } : {} });
  return uploaded?.[0];
}
