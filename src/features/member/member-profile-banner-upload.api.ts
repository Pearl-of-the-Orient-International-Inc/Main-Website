import { genUploader } from "uploadthing/client";
import { API_BASE_URL } from "@/lib/http-client";
import { authStore } from "@/lib/auth-store";
import axios from "axios";

if (!API_BASE_URL) {
  throw new Error("API base URL is not configured.");
}

const MEMBER_PROFILE_BANNER_UPLOAD_URL = API_BASE_URL.replace(
  /\/api\/v1$/,
  "/api/uploadthing",
);
const { uploadFiles } = genUploader({
  url: MEMBER_PROFILE_BANNER_UPLOAD_URL,
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

export async function uploadMemberProfileBanner(file: File) {
  const token = await getUploadAccessToken();

  const uploaded = await uploadFiles("memberProfileBannerUploader", {
    files: [file],
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return uploaded?.[0];
}
