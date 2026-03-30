import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicMemberProfilePage } from "./_components/PublicMemberProfilePage";
import type { PublicMemberProfileResponse } from "./_components/public-member-profile.types";

const apiBaseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_API_BASE_URL_PROD;

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
  return payload.data;
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

  return {
    title: `${member.user.name} | Member Verification`,
    description: `Public verification page for member ID ${member.uniqueId ?? memberId}.`,
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
