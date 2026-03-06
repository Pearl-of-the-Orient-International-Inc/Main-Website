import { genUploader } from "uploadthing/client";
import { API_BASE_URL } from "@/lib/http-client";
import { authStore } from "@/lib/auth-store";

const MEMBER_REQUIREMENT_UPLOAD_URL = `${API_BASE_URL}/members/requirements/upload`;
const { uploadFiles } = genUploader({
  url: MEMBER_REQUIREMENT_UPLOAD_URL,
});

export async function uploadMemberRequirement(file: File) {
  const token = authStore.getAccessToken();

  const uploaded = await uploadFiles("requirementUploader", {
    files: [file],
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return uploaded?.[0];
}
