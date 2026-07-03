/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Award,
  BadgeCheck,
  Calendar,
  CalendarCheck,
  Camera,
  FileCheck2,
  IdCard,
  LayersPlus,
  LoaderCircle,
  RefreshCw,
  UserCheck,
  UserPlus,
  Users2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useOptionalCurrentUserQuery,
  useUploadAvatarMutation,
} from "@/features/auth/auth.hooks";
import {
  toApiError,
  useFollowMemberMutation,
  useMemberFollowStateQuery,
  useUnfollowMemberMutation,
  useUploadMemberProfileBannerMutation,
  useUpdateCurrentMemberProfileBannerMutation,
} from "@/features/member/member.hooks";
import { useToast } from "@/hooks/use-toast";
import type { PublicServiceChaplain } from "@/lib/api-types";
import { AppointmentSheet } from "@/app/(website)/book-a-service/ChaplainDirectory";
import { PublicMemberProfileSidebar } from "./PublicMemberProfileSidebar";
import { PublicMemberProfileTabs } from "./PublicMemberProfileTabs";
import type { PublicMember } from "./public-member-profile.shared";
import {
  buildDetailedAboutEssay,
  buildFullName,
  buildLocation,
  buildMapEmbedUrl,
  buildOfficeAssignmentScope,
  buildOfficeAssignmentTitle,
  buildOverviewSummary,
  buildRecentActivities,
  canBookMemberService,
  formatDate,
  formatEnumLabel,
  getPrimaryOfficeAssignment,
} from "./public-member-profile.shared";

const parseBranchServiceText = (value: string | null | undefined) =>
  (value ?? "")
    .split(/[,|]/)
    .map((item) => item.trim())
    .filter(Boolean);

const isMembershipExpired = (applicationDate: string) => {
  const expirationDate = new Date(applicationDate);
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  return expirationDate <= new Date();
};

export function PublicMemberProfilePage({ member }: { member: PublicMember }) {
  const publicRecords = member.publicRecords ?? [];
  const preferredBranches = member.preferredBranches ?? [];
  const branchServiceEntries = parseBranchServiceText(
    member.preferredBranchOther,
  );
  const visibleServiceBranches = [
    ...preferredBranches.map((branch) => branch.title),
    ...branchServiceEntries,
  ].filter(
    (branch, index, list) =>
      branch && list.findIndex((item) => item === branch) === index,
  );
  const officerAssignments = member.officerAssignments ?? [];
  const certificates = member.certificates ?? [];
  const applicantRequirements = member.applicantRequirements ?? [];
  const bannerFrameRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);
  const repositionDragRef = useRef<{
    pointerId: number;
    startY: number;
    startPosition: number;
  } | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isRepositionMode, setIsRepositionMode] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);
  const [bannerImageSrc, setBannerImageSrc] = useState<string | null>(
    member.profileBannerUrl?.trim() || null,
  );
  const [avatarImageSrc, setAvatarImageSrc] = useState<string | null>(
    member.user.avatar?.trim() ||
      member.applicantRequirements
        .find((item) => item.type === "PHOTO_2X2")
        ?.fileUrl.trim() ||
      null,
  );
  const [bannerPosition, setBannerPosition] = useState(
    member.profileBannerPositionY ?? 50,
  );
  const { toast } = useToast();
  const { data: currentUser } = useOptionalCurrentUserQuery();
  const uploadAvatarMutation = useUploadAvatarMutation();
  const uploadBannerMutation = useUploadMemberProfileBannerMutation();
  const updateBannerMutation = useUpdateCurrentMemberProfileBannerMutation();
  const fullName = buildFullName(member);
  const location = buildLocation(member);
  const primaryOfficeAssignment = getPrimaryOfficeAssignment(member);
  const officeTitle = buildOfficeAssignmentTitle(member);
  const officeScope = primaryOfficeAssignment
    ? buildOfficeAssignmentScope(primaryOfficeAssignment)
    : "";
  const membershipExpired = isMembershipExpired(member.createdAt);
  const renewalMailHref = `mailto:poile2005official@gmail.com?subject=${encodeURIComponent(
    `Membership Renewal Request - ${fullName}`,
  )}&body=${encodeURIComponent(
    `Hello Pearl of the Orient,\n\nI would like to renew my membership.\n\nName: ${fullName}\nMember ID: ${member.uniqueId ?? member.id}\nApplication Date: ${formatDate(member.createdAt)}\n\nThank you.`,
  )}`;
  const canBookService = canBookMemberService(member);
  const bookingChaplain: PublicServiceChaplain = {
    id: member.id,
    uniqueId: member.uniqueId,
    badgeNumber: member.badgeNumber,
    memberType: "CERTIFIED_SPECIALIST_TRAINING_OFFICER_INSTRUCTOR",
    firstName: member.firstName,
    middleInitial: member.middleInitial,
    lastName: member.lastName,
    extensionName: member.extensionName,
    region: member.region,
    province: member.province,
    municipalityCity: member.municipalityCity,
    barangay: member.barangay,
    preferredBranchOther: member.preferredBranchOther,
    createdAt: member.createdAt,
    user: {
      name: member.user.name,
      avatar: member.user.avatar,
      isEmailVerified: member.user.isEmailVerified,
    },
    preferredBranches,
    officerAssignments,
    applicantRequirements: applicantRequirements.map((requirement) => ({
      fileUrl: requirement.fileUrl,
    })),
  };
  const signedInMemberProfile = currentUser?.memberProfile;
  const isOwnProfile = Boolean(
    signedInMemberProfile &&
    (signedInMemberProfile.id === member.id ||
      (signedInMemberProfile.uniqueId &&
        signedInMemberProfile.uniqueId === member.uniqueId)),
  );
  const canManageBanner = Boolean(signedInMemberProfile && isOwnProfile);
  const canUseFollow = Boolean(
    currentUser && signedInMemberProfile && !isOwnProfile,
  );
  const signInToFollowHref = `/sign-in?redirect=${encodeURIComponent(
    `/profile/${member.uniqueId ?? member.id}`,
  )}`;
  const followStateQuery = useMemberFollowStateQuery(member.id, canUseFollow);
  const followMemberMutation = useFollowMemberMutation();
  const unfollowMemberMutation = useUnfollowMemberMutation();
  const followState =
    followMemberMutation.data ??
    unfollowMemberMutation.data ??
    followStateQuery.data;
  const isFollowing = followState?.isFollowing ?? false;
  const followerCount = followState?.followerCount ?? member.followerCount ?? 0;
  const isFollowBusy =
    followStateQuery.isLoading ||
    followMemberMutation.isPending ||
    unfollowMemberMutation.isPending;
  const isUploadingBanner =
    uploadBannerMutation.isPending || updateBannerMutation.isPending;
  const isUploadingAvatar = uploadAvatarMutation.isPending;
  const profilePhoto = applicantRequirements.find(
    (item) => item.type === "PHOTO_2X2",
  );
  const certificateUrl = member.idGenerationAsset?.certificateUrl ?? null;
  const publicDocuments = applicantRequirements.filter(
    (item) => item.type !== "PHOTO_2X2",
  );
  const overviewSummary = buildOverviewSummary(member, fullName, location);
  const recentActivities = buildRecentActivities(member, certificateUrl);
  const aboutEssay = buildDetailedAboutEssay(member, fullName, location);
  const mapEmbedUrl = buildMapEmbedUrl(member);
  const analyticsBarData = [
    {
      name: "Records",
      value: publicRecords.length,
    },
    { name: "Branches", value: visibleServiceBranches.length },
    { name: "Followers", value: followerCount },
    { name: "Milestones", value: recentActivities.length },
  ];
  const analyticsPieData = [
    {
      name: "Verified",
      value: member.user.isEmailVerified ? 1 : 0,
      fill: "var(--color-verified)",
    },
    {
      name: "Pending",
      value: member.user.isEmailVerified ? 0 : 1,
      fill: "var(--color-pending)",
    },
    {
      name: "Certificate",
      value: certificateUrl ? 1 : 0,
      fill: "var(--color-certificate)",
    },
    {
      name: "Training",
      value: member.chaplaincyTrainingProgress?.completedAt ? 1 : 0,
      fill: "var(--color-training)",
    },
    {
      name: "Office",
      value: officerAssignments.length > 0 ? 1 : 0,
      fill: "var(--color-office)",
    },
  ].filter((item) => item.value > 0);

  useEffect(() => {
    setBannerImageSrc(member.profileBannerUrl?.trim() || null);
    setBannerPosition(member.profileBannerPositionY ?? 50);
  }, [member.profileBannerPositionY, member.profileBannerUrl]);

  useEffect(() => {
    setAvatarImageSrc(
      member.user.avatar?.trim() || profilePhoto?.fileUrl.trim() || null,
    );
  }, [member.user.avatar, profilePhoto?.fileUrl]);

  const handleBannerFile = async (file: File | null | undefined) => {
    if (!file || !canManageBanner || isUploadingBanner) return;

    const nextPosition = 50;

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please choose a valid image file.");
      }

      if (file.size > 4 * 1024 * 1024) {
        throw new Error("Cover photo must be 4MB or smaller.");
      }

      const uploaded = await uploadBannerMutation.mutateAsync(file);
      const fileUrl =
        uploaded?.serverData?.fileUrl ||
        uploaded?.ufsUrl ||
        uploaded?.url ||
        "";

      if (!fileUrl) {
        throw new Error("Upload finished without a cover photo URL.");
      }

      await updateBannerMutation.mutateAsync({
        profileBannerUrl: fileUrl,
        profileBannerPositionY: nextPosition,
      });

      setBannerImageSrc(fileUrl);
      setBannerPosition(nextPosition);
      setIsRepositionMode(true);

      toast({
        title: "Cover photo updated",
        description: "Your cover photo has been saved successfully.",
        variant: "success",
      });
    } catch (error) {
      const apiError = toApiError(error);

      toast({
        title: "Cover photo upload failed",
        description:
          apiError.message ??
          (error instanceof Error
            ? error.message
            : "Unable to upload the cover photo right now."),
        variant: "error",
      });
    }
  };

  const openBannerFilePicker = () => {
    if (!canManageBanner || isUploadingBanner) return;
    fileInputRef.current?.click();
  };

  const handleToggleFollow = async () => {
    if (!canUseFollow || isFollowBusy) return;

    try {
      if (isFollowing) {
        await unfollowMemberMutation.mutateAsync(member.id);
        toast({
          title: "Profile unfollowed",
          description: `You are no longer following ${fullName}.`,
          variant: "success",
        });
        return;
      }

      await followMemberMutation.mutateAsync(member.id);
      toast({
        title: "Profile followed",
        description: `You are now following ${fullName}.`,
        variant: "success",
      });
    } catch (error) {
      const apiError = toApiError(error);

      toast({
        title: "Follow action failed",
        description:
          apiError.message ?? "Unable to update follow status right now.",
        variant: "error",
      });
    }
  };

  const handleAvatarFile = async (file: File | null | undefined) => {
    if (!file || !canManageBanner || isUploadingAvatar) return;

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please choose a valid image file.");
      }

      if (file.size > 4 * 1024 * 1024) {
        throw new Error("Profile picture must be 4MB or smaller.");
      }

      const uploaded = await uploadAvatarMutation.mutateAsync(file);
      const fileUrl =
        uploaded?.serverData?.avatarUrl ||
        uploaded?.serverData?.fileUrl ||
        uploaded?.ufsUrl ||
        uploaded?.url ||
        "";

      if (!fileUrl) {
        throw new Error("Upload finished without a profile picture URL.");
      }

      setAvatarImageSrc(fileUrl);

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been saved successfully.",
        variant: "success",
      });
    } catch (error) {
      const apiError = toApiError(error);

      toast({
        title: "Profile picture upload failed",
        description:
          apiError.message ??
          (error instanceof Error
            ? error.message
            : "Unable to upload the profile picture right now."),
        variant: "error",
      });
    }
  };

  const openAvatarFilePicker = () => {
    if (!canManageBanner || isUploadingAvatar) return;
    avatarFileInputRef.current?.click();
  };

  const saveBannerPosition = async (position: number) => {
    if (!canManageBanner || !bannerImageSrc) return;

    const nextPosition = Math.min(100, Math.max(0, Math.round(position)));
    setBannerPosition(nextPosition);

    try {
      await updateBannerMutation.mutateAsync({
        profileBannerPositionY: nextPosition,
      });
    } catch (error) {
      setBannerPosition(member.profileBannerPositionY ?? 50);

      const apiError = toApiError(error);
      toast({
        title: "Cover position update failed",
        description:
          apiError.message ??
          (error instanceof Error
            ? error.message
            : "Unable to save the cover position right now."),
        variant: "error",
      });
    }
  };

  const beginCoverReposition = (pointerId: number, clientY: number) => {
    repositionDragRef.current = {
      pointerId,
      startY: clientY,
      startPosition: bannerPosition,
    };
    setIsDraggingCover(true);
  };

  const updateCoverPositionFromPointer = (clientY: number) => {
    const dragState = repositionDragRef.current;
    const bannerFrame = bannerFrameRef.current;
    if (!dragState || !bannerFrame) return;

    const rect = bannerFrame.getBoundingClientRect();
    if (!rect.height) return;

    const deltaPercent = ((clientY - dragState.startY) / rect.height) * 100;
    const nextPosition = Math.min(
      100,
      Math.max(0, dragState.startPosition + deltaPercent),
    );

    setBannerPosition(nextPosition);
  };

  const endCoverReposition = async () => {
    const nextPosition = bannerPosition;
    repositionDragRef.current = null;
    setIsDraggingCover(false);
    await saveBannerPosition(nextPosition);
  };

  return (
    <div className="min-h-screen bg-zinc-100 py-5">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="mx-auto max-w-7xl pb-10 pt-16"
      >
        <div className="grid gap-5 lg:grid-cols-10">
          <div className="lg:col-span-7">
            <section className="border bg-white">
              <div className="border-b">
                <div ref={bannerFrameRef} className="relative h-50">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      void handleBannerFile(event.target.files?.[0]);
                      event.currentTarget.value = "";
                    }}
                  />
                  <input
                    ref={avatarFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      void handleAvatarFile(event.target.files?.[0]);
                      event.currentTarget.value = "";
                    }}
                  />
                  {bannerImageSrc ? (
                    <img
                      src={bannerImageSrc}
                      alt="Profile cover photo"
                      className="h-full w-full object-cover"
                      style={{ objectPosition: `center ${bannerPosition}%` }}
                    />
                  ) : (
                    <div className="h-full w-full bg-[linear-gradient(135deg,#f5f5f4_0%,#fafaf9_42%,#e7e5e4_100%)]" />
                  )}
                  {!bannerImageSrc ? (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(22,163,74,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(3,42,13,0.08),transparent_30%)]" />
                  ) : null}
                  <div
                    className={`absolute inset-0 transition ${
                      isDragActive ? "bg-white/20" : ""
                    }`}
                    onDragEnter={() => {
                      if (!canManageBanner) return;
                      setIsDragActive(true);
                    }}
                    onDragOver={(event) => {
                      if (!canManageBanner) return;
                      event.preventDefault();
                      setIsDragActive(true);
                    }}
                    onDragLeave={(event) => {
                      if (!canManageBanner) return;
                      event.preventDefault();
                      setIsDragActive(false);
                    }}
                    onDrop={(event) => {
                      if (!canManageBanner) return;
                      event.preventDefault();
                      setIsDragActive(false);
                      void handleBannerFile(event.dataTransfer.files?.[0]);
                    }}
                  />
                  {canManageBanner && bannerImageSrc && isRepositionMode ? (
                    <div
                      className={`absolute inset-0 z-10 select-none ${
                        isDraggingCover ? "cursor-grabbing" : "cursor-ns-resize"
                      }`}
                      onPointerDown={(event) => {
                        beginCoverReposition(event.pointerId, event.clientY);
                        event.currentTarget.setPointerCapture(event.pointerId);
                      }}
                      onPointerMove={(event) => {
                        if (
                          repositionDragRef.current?.pointerId !==
                          event.pointerId
                        ) {
                          return;
                        }

                        updateCoverPositionFromPointer(event.clientY);
                      }}
                      onPointerUp={(event) => {
                        if (
                          repositionDragRef.current?.pointerId !==
                          event.pointerId
                        ) {
                          return;
                        }

                        event.currentTarget.releasePointerCapture(
                          event.pointerId,
                        );
                        void endCoverReposition();
                      }}
                      onPointerCancel={(event) => {
                        if (
                          repositionDragRef.current?.pointerId !==
                          event.pointerId
                        ) {
                          return;
                        }

                        event.currentTarget.releasePointerCapture(
                          event.pointerId,
                        );
                        void endCoverReposition();
                      }}
                    >
                      <div className="absolute inset-x-0 top-4 flex justify-center px-4">
                        <div className="rounded-full bg-black/65 px-4 py-2 text-center text-xs font-medium text-white shadow-lg backdrop-blur-sm">
                          Drag up or down to reposition your cover photo
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {canManageBanner && bannerImageSrc ? (
                    <div className="absolute left-4 top-4 z-20 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setIsRepositionMode((current) => !current)
                        }
                        className="rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-sm transition hover:bg-black/80"
                      >
                        {isRepositionMode
                          ? "Done repositioning"
                          : "Reposition cover"}
                      </button>
                      {isRepositionMode ? (
                        <>
                          <button
                            type="button"
                            onClick={() => void saveBannerPosition(0)}
                            className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-md transition hover:bg-white"
                          >
                            Top
                          </button>
                          <button
                            type="button"
                            onClick={() => void saveBannerPosition(50)}
                            className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-md transition hover:bg-white"
                          >
                            Center
                          </button>
                          <button
                            type="button"
                            onClick={() => void saveBannerPosition(100)}
                            className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-md transition hover:bg-white"
                          >
                            Bottom
                          </button>
                        </>
                      ) : null}
                    </div>
                  ) : null}
                  {canManageBanner ? (
                    <button
                      type="button"
                      onClick={openBannerFilePicker}
                      disabled={isUploadingBanner || isDraggingCover}
                      className="absolute right-4 bottom-4 z-20 inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isUploadingBanner ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Camera className="size-4" />
                      )}
                      {isUploadingBanner ? "Uploading..." : "Edit cover photo"}
                    </button>
                  ) : null}
                  <div className="absolute -bottom-10 left-10 z-20">
                    <Avatar className="size-25 border-4 border-white shadow-lg">
                      <AvatarImage src={avatarImageSrc ?? undefined} />
                      <AvatarFallback className="bg-green-900! text-4xl font-bold text-white">
                        {fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {canManageBanner ? (
                      <button
                        type="button"
                        onClick={openAvatarFilePicker}
                        disabled={isUploadingAvatar}
                        className="absolute -right-1 bottom-1 inline-flex size-9 items-center justify-center rounded-full border-2 border-white bg-[#032a0d] text-white shadow-lg transition hover:bg-[#064416] disabled:cursor-not-allowed disabled:opacity-70"
                        aria-label="Upload profile picture"
                      >
                        {isUploadingAvatar ? (
                          <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                          <Camera className="size-4" />
                        )}
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="relative mt-10 px-4 pb-7 sm:px-8">
                  <div className="space-y-5">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                      <div className="max-w-3xl">
                        <div className="mt-4 flex items-center gap-2">
                          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                            {fullName}
                          </h1>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="mt-1 size-6 shrink-0 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.516 2.17a.75.75 0 00-1.032 0l-2.4 2.218-3.23.23a.75.75 0 00-.64.49l-1.11 3.042-2.1 2.46a.75.75 0 000 .976l2.1 2.46 1.11 3.042a.75.75 0 00.64.49l3.23.23 2.4 2.218a.75.75 0 001.032 0l2.4-2.218 3.23-.23a.75.75 0 00.64-.49l1.11-3.042 2.1-2.46a.75.75 0 000-.976l-2.1-2.46-1.11-3.042a.75.75 0 00-.64-.49l-3.23-.23-2.4-2.218zm3.257 7.104a.75.75 0 10-1.046-1.076l-3.38 3.287-1.12-1.088a.75.75 0 10-1.046 1.076l1.643 1.596a.75.75 0 001.046 0l3.903-3.795z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-neutral-700 sm:text-base">
                          {formatEnumLabel(member.memberType)}
                          {location ? ` • ${location}` : ""}
                        </p>
                        <div className="mt-4 flex min-w-0 flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className={
                              member.isActive
                                ? "border-green-200 bg-green-50 text-green-800"
                                : "border-red-200 bg-red-50 text-red-700"
                            }
                          >
                            <BadgeCheck className="mr-1 size-3.5" />
                            {member.isActive
                              ? "Active member"
                              : "Inactive profile"}
                          </Badge>
                          {member.uniqueId ? (
                            <Badge variant="outline">
                              <IdCard /> Member ID: {member.uniqueId}
                            </Badge>
                          ) : null}
                          {member.badgeNumber ? (
                            <Badge variant="outline">
                              <Award /> Badge No.: {member.badgeNumber}
                            </Badge>
                          ) : null}
                          <Badge variant="outline">
                            <Calendar /> Since {formatDate(member.createdAt)}
                          </Badge>
                          {officeTitle ? (
                            <Badge
                              variant="outline"
                              className="max-w-full border-[#032a0d]/20 bg-[#032a0d]/5 text-[#032a0d]"
                            >
                              <BadgeCheck className="shrink-0" />
                              <span className="truncate">
                                Office: {officeTitle}
                                {officeScope ? ` • ${officeScope}` : ""}
                              </span>
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      {!isOwnProfile ? (
                        currentUser ? (
                          signedInMemberProfile ? (
                            <Button
                              type="button"
                              variant={isFollowing ? "secondary" : "outline"}
                              size="sm"
                              onClick={handleToggleFollow}
                              disabled={isFollowBusy}
                              className="w-full border-[#032a0d]/40 text-[#032a0d] sm:w-fit"
                            >
                              {isFollowBusy ? (
                                <LoaderCircle className="size-4 animate-spin" />
                              ) : isFollowing ? (
                                <UserCheck className="size-4" />
                              ) : (
                                <UserPlus className="size-4" />
                              )}
                              {isFollowing ? "Following" : "Follow"}
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              disabled
                              className="w-full sm:w-fit"
                            >
                              <UserPlus className="size-4" />
                              Member account required
                            </Button>
                          )
                        ) : (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="w-full border-[#032a0d]/40 text-[#032a0d] sm:w-fit"
                          >
                            <Link href={signInToFollowHref}>
                              <UserPlus className="size-4" />
                              Sign in to Follow
                            </Link>
                          </Button>
                        )
                      ) : null}

                      {canBookService ? (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setIsBookingSheetOpen(true)}
                          className="w-full bg-[#032a0d] text-white hover:bg-[#064016] sm:w-fit"
                        >
                          <CalendarCheck className="size-4" />
                          Book a Service
                        </Button>
                      ) : null}

                      {membershipExpired && isOwnProfile ? (
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="w-full border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 sm:w-fit"
                        >
                          <a href={renewalMailHref}>
                            <RefreshCw className="size-4" />
                            Renew Membership
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-neutral-600 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="border border-neutral-200 bg-neutral-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-neutral-500">
                        Public records
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-neutral-950">
                        <FileCheck2 className="size-4 text-[#032a0d]" />
                        {publicRecords.length}
                      </p>
                    </div>
                    <div className="border border-neutral-200 bg-neutral-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-neutral-500">
                        Service branches
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-neutral-950">
                        <Users2 className="size-4 text-[#032a0d]" />
                        {visibleServiceBranches.length}
                      </p>
                    </div>
                    <div className="border border-neutral-200 bg-neutral-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-neutral-500">
                        Followers
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-neutral-950">
                        <Users2 className="size-4 text-[#032a0d]" />
                        {followerCount}
                      </p>
                    </div>
                    <div className="border border-neutral-200 bg-neutral-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-neutral-500">
                        Certificates
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-neutral-950">
                        <LayersPlus className="size-4 text-[#032a0d]" />
                        {certificates.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-2 pt-3">
                <TabsList variant="line">
                  <TabsTrigger value="home" className="px-4 text-base">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="about" className="px-4 text-base">
                    About
                  </TabsTrigger>
                  <TabsTrigger value="records" className="px-4 text-base">
                    Records
                  </TabsTrigger>
                  <TabsTrigger value="certificates" className="px-4 text-base">
                    Certificates
                  </TabsTrigger>
                  <TabsTrigger value="service" className="px-4 text-base">
                    Service
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="px-4 text-base">
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>
            </section>

            <div className="mt-6 grid gap-6">
              <PublicMemberProfileTabs
                member={member}
                fullName={fullName}
                certificateUrl={certificateUrl}
                publicDocuments={publicDocuments}
                overviewSummary={overviewSummary}
                recentActivities={recentActivities}
                aboutEssay={aboutEssay}
                mapEmbedUrl={mapEmbedUrl}
                analyticsBarData={analyticsBarData}
                analyticsPieData={analyticsPieData}
                onViewAllCertificates={() => setActiveTab("certificates")}
              />
            </div>
          </div>

          <PublicMemberProfileSidebar member={member} fullName={fullName} />
        </div>
        <AppointmentSheet
          chaplain={canBookService ? bookingChaplain : null}
          open={isBookingSheetOpen}
          onOpenChange={setIsBookingSheetOpen}
        />
      </Tabs>
    </div>
  );
}
