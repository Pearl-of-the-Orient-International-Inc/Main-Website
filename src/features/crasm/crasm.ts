import { genUploader } from "uploadthing/client";
import { api, API_BASE_URL } from "@/lib/http-client";
import { authStore } from "@/lib/auth-store";

export type CrasmDocument = { type: "APPOINTMENT" | "GOVERNMENT_ID" | "CHURCH_ASSIGNMENT" | "OTHER"; fileUrl: string; fileName: string; mimeType?: string };
export type CrasmApplication = { id: string; status: string; appointmentTitle: string; appointingOfficer: string; recommendingOfficer: string; territorialJurisdiction: string; churchName: string; churchAddress: string; documents: CrasmDocument[]; informationAccurate: boolean; backgroundCheckConsent: boolean; requestedInformation: string | null };
export type CrasmEligibility = { eligible: boolean; eligibilityReason: string; application: CrasmApplication | null };
export const getCurrentCrasmApplication = async () => (await api.get<{ data: CrasmEligibility }>("/crasm-applications/current")).data.data;
export const saveCrasmApplication = async (payload: Record<string, unknown>) => (await api.put("/crasm-applications/current", payload)).data.data;
export const submitCrasmApplication = async (payload: Record<string, unknown>) => (await api.post("/crasm-applications/current/submit", payload)).data.data;
const { uploadFiles } = genUploader({ url: `${API_BASE_URL}/crasm-applications/current/documents/upload` });
export async function uploadCrasmDocument(file: File) { const token = authStore.getAccessToken(); return (await uploadFiles("crasmDocumentUploader", { files: [file], headers: token ? { Authorization: `Bearer ${token}` } : {} }))?.[0]; }
