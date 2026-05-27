import axios from "axios";
import { genUploader } from "uploadthing/client";
import { authStore } from "@/lib/auth-store";
import { API_BASE_URL } from "@/lib/http-client";

if (!API_BASE_URL) {
  throw new Error("API base URL is not configured.");
}

const MEMBER_CERTIFICATE_UPLOAD_URL = `${API_BASE_URL}/members/certificates/upload`;

const { uploadFiles } = genUploader({
  url: MEMBER_CERTIFICATE_UPLOAD_URL,
});

async function getUploadAccessToken() {
  const response = await axios.get<{ accessToken: string }>(
    `${API_BASE_URL}/auth/refresh-token`,
    {
      withCredentials: true,
    },
  );

  const refreshedToken = response.data.accessToken;
  authStore.setAccessToken(refreshedToken);
  return refreshedToken;
}

export async function uploadMemberCertificate(file: File) {
  const token = await getUploadAccessToken();

  const uploaded = await uploadFiles("memberCertificateUploader", {
    files: [file],
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return uploaded?.[0];
}
