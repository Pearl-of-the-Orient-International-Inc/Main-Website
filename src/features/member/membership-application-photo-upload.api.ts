import { genUploader } from "uploadthing/client";

import { API_BASE_URL } from "@/lib/http-client";

const MEMBERSHIP_APPLICATION_PHOTO_UPLOAD_URL =
  `${API_BASE_URL}/members/application-photo/upload`;

const { uploadFiles } = genUploader({
  url: MEMBERSHIP_APPLICATION_PHOTO_UPLOAD_URL,
});

type UploadedMembershipApplicationPhoto = {
  ufsUrl: string;
  url: string;
};

export async function uploadMembershipApplicationPhoto(file: File) {
  const uploaded = await uploadFiles("membershipApplicationPhotoUploader", {
    files: [file],
  });

  return uploaded?.[0] as UploadedMembershipApplicationPhoto | undefined;
}
