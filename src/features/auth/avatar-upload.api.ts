import { genUploader } from "uploadthing/client";
import { API_BASE_URL } from "@/lib/http-client";
import { authStore } from "@/lib/auth-store";
import axios from "axios";

if (!API_BASE_URL) {
  throw new Error("API base URL is not configured.");
}

const AVATAR_UPLOAD_URL = `${API_BASE_URL}/users/avatar/upload`;
const { uploadFiles } = genUploader({
  url: AVATAR_UPLOAD_URL,
});

async function getUploadAccessToken() {
  const currentToken = authStore.getAccessToken();
  if (currentToken) return currentToken;

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

export async function uploadAvatar(file: File) {
  const token = await getUploadAccessToken();

  const uploaded = await uploadFiles("avatarUploader", {
    files: [file],
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return uploaded?.[0];
}
