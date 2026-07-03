import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicMemberProfilePage } from "./_components/PublicMemberProfilePage";
import type { PublicMemberProfileResponse } from "./_components/public-member-profile.types";

const apiBaseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_API_BASE_URL_PROD;
const siteUrl =
  process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://pearlchaplaincy.org";

const getProfileImageUrl = (
  member: PublicMemberProfileResponse["data"],
): string => {
  const imageUrl =
    member.profileBannerUrl ||
    member.user.avatar ||
    member.applicantRequirements.find((item) => item.type === "PHOTO_2X2")
      ?.fileUrl ||
    "/og-image.jpg";

  return new URL(imageUrl, siteUrl).toString();
};

async function getPublicMemberProfile(
  memberId: string,
): Promise<PublicMemberProfileResponse["data"] | null> {
  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  const response = await fetch(
    `${apiBaseUrl}/members/public/${encodeURIComponent(memberId)}`,
    {
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load public member profile.");
  }

  const payload = (await response.json()) as PublicMemberProfileResponse;
  return {
    ...payload.data,
    preferredBranches: payload.data.preferredBranches ?? [],
    officerAssignments: payload.data.officerAssignments ?? [],
    applicantRequirements: payload.data.applicantRequirements ?? [],
    certificates: payload.data.certificates ?? [],
    publicRecords: (payload.data.publicRecords ?? []).map((record) => ({
      ...record,
      attachments: record.attachments ?? [],
    })),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ memberId: string }>;
}): Promise<Metadata> {
  const { memberId } = await params;
  const member = await getPublicMemberProfile(memberId);

  if (!member) {
    return {
      title: "Member Profile Not Found",
    };
  }

  const profilePath = `/profile/${encodeURIComponent(
    member.uniqueId ?? memberId,
  )}`;
  const profileUrl = new URL(profilePath, siteUrl).toString();
  const profileImageUrl = getProfileImageUrl(member);
  const title = `${member.user.name} | Public Member Profile`;
  const description = `Official public verification profile for ${member.user.name}, member ID ${member.uniqueId ?? memberId}.`;

  return {
    title,
    description,
    alternates: {
      canonical: profilePath,
    },
    openGraph: {
      title,
      description,
      url: profileUrl,
      siteName: "Pearl Chaplaincy",
      type: "profile",
      images: [
        {
          url: profileImageUrl,
          width: 1200,
          height: 630,
          alt: `${member.user.name} public member profile`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [profileImageUrl],
    },
  };
}

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const member = await getPublicMemberProfile(memberId);

  if (!member) {
    notFound();
  }

  return <PublicMemberProfilePage member={member} />;
}
