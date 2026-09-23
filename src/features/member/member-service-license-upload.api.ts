import axios from "axios";
import { genUploader } from "uploadthing/client";
import { authStore } from "@/lib/auth-store";
import { API_BASE_URL } from "@/lib/http-client";

if (!API_BASE_URL) {
  throw new Error("API base URL is not configured.");
}

const uploadUrl = API_BASE_URL.replace(/\/api\/v1$/, "/api/uploadthing");
const { uploadFiles } = genUploader({ url: uploadUrl });

async function getUploadAccessToken() {
  const response = await axios.get<{ accessToken: string }>(
    `${API_BASE_URL}/auth/refresh-token`,
    { withCredentials: true },
  );
  authStore.setAccessToken(response.data.accessToken);
  return response.data.accessToken;
}

export async function uploadMemberServiceLicense(file: File) {
  const token = await getUploadAccessToken();
  const uploaded = await uploadFiles("memberServiceLicenseUploader", {
    files: [file],
    headers: { Authorization: `Bearer ${token}` },
  });
  return uploaded?.[0];
}
