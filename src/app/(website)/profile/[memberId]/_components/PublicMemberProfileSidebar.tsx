/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  CalendarCheck,
  Check,
  ChevronRight,
  Copy,
  Download,
  EditIcon,
  Mail,
  Plus,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Users2,
} from "lucide-react";
import { FaFacebookF, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOptionalCurrentUserQuery } from "@/features/auth/auth.hooks";
import {
  toApiError,
  useUpdateCurrentChurchAffiliationMutation,
  useUpdateCurrentEducationMutation,
} from "@/features/member/member.hooks";
import { useToast } from "@/hooks/use-toast";
import {
  canBookMemberService,
  formatEnumLabel,
  type PublicMember,
} from "./public-member-profile.shared";
import { downloadPublicProfilePdf } from "./public-member-profile-pdf";

type Props = {
  member: PublicMember;
  fullName: string;
};

const ROLE_OPTIONS = ["Church Worker", "Pastor", "Rev.", "Bishop", "Others"];
const EDUCATION_ENTRY_SEPARATOR = " | ";
const siteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL?.replace(/\/$/, "");

const parseEducationEntries = (value: string | null | undefined) => {
  const cleaned = (value ?? "").trim();
  if (!cleaned) return [""];

  const entries = cleaned
    .split(EDUCATION_ENTRY_SEPARATOR)
    .map((entry) => entry.trim())
    .filter(Boolean);

  return entries.length > 0 ? entries : [cleaned];
};

const displayEducationEntries = (value: string | null | undefined) => {
  return parseEducationEntries(value).filter(Boolean);
};

export function PublicMemberProfileSidebar({ member, fullName }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: currentUser } = useOptionalCurrentUserQuery();
  const updateChurchAffiliationMutation =
    useUpdateCurrentChurchAffiliationMutation();
  const updateEducationMutation = useUpdateCurrentEducationMutation();

  const [isCopied, setIsCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isChurchDialogOpen, setIsChurchDialogOpen] = useState(false);
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [churchAffiliationValue, setChurchAffiliationValue] = useState(
    member.churchAffiliation ?? "",
  );
  const [churchAddressValue, setChurchAddressValue] = useState(
    member.churchAddress ?? "",
  );

  const initialRoleValue =
    member.currentPositionRoleOther?.trim() ||
    member.currentPositionRole?.trim() ||
    "";

  const [positionValue, setPositionValue] = useState(
    ROLE_OPTIONS.includes(initialRoleValue)
      ? initialRoleValue
      : initialRoleValue
        ? "Others"
        : "",
  );
  const [positionOtherValue, setPositionOtherValue] = useState(
    ["Church Worker", "Pastor", "Rev.", "Bishop"].includes(initialRoleValue)
      ? (member.currentPositionRoleOther ?? "")
      : initialRoleValue,
  );
  const [elementarySchoolValue, setElementarySchoolValue] = useState(
    member.elementarySchool ?? "",
  );
  const [secondarySchoolValue, setSecondarySchoolValue] = useState(
    member.secondarySchool ?? "",
  );
  const [tertiaryCollegeEntries, setTertiaryCollegeEntries] = useState<
    string[]
  >(parseEducationEntries(member.tertiaryCollege));
  const [postGraduateEntries, setPostGraduateEntries] = useState<string[]>(
    parseEducationEntries(member.postGraduateStudies),
  );

  const currentRole =
    member.currentPositionRoleOther ??
    member.currentPositionRole ??
    "Not publicly listed";
  const canBookService = canBookMemberService(member);
  const memberProfilePath = `/profile/${member.uniqueId ?? member.id}`;
  const signedInMemberProfile = currentUser?.memberProfile;
  const canEditChurchAffiliation = Boolean(
    signedInMemberProfile &&
    member.uniqueId &&
    signedInMemberProfile.uniqueId === member.uniqueId,
  );
  const hasChurchAffiliationContent = Boolean(
    member.churchAffiliation ||
    member.churchAddress ||
    member.currentPositionRole ||
    member.currentPositionRoleOther,
  );
  const canEditEducation = canEditChurchAffiliation;
  const hasEducationContent = Boolean(
    member.elementarySchool ||
    member.secondarySchool ||
    displayEducationEntries(member.tertiaryCollege).length > 0 ||
    displayEducationEntries(member.postGraduateStudies).length > 0,
  );

  const resolvedPublicProfileUrl = `${
    siteUrl ||
    (typeof window === "undefined" ? "" : window.location.origin.replace(/\/$/, ""))
  }${memberProfilePath}`;

  const encodedShareUrl = encodeURIComponent(resolvedPublicProfileUrl);
  const encodedShareText = encodeURIComponent(
    `View ${fullName}'s public member profile`,
  );

  async function handleDownloadPublicProfilePdf() {
    try {
      setIsDownloadingPdf(true);
      await downloadPublicProfilePdf({
        member,
        fullName,
        publicProfileUrl: resolvedPublicProfileUrl,
      });
      toast({
        title: "PDF downloaded",
        description: "The public profile PDF has been generated.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "PDF download failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to generate the public profile PDF right now.",
        variant: "error",
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  }

  const quickActions = [
    ...(canBookService
      ? [
          {
            label: "Book a Service",
            icon: CalendarCheck,
            href: `/book-a-service?member=${encodeURIComponent(
              member.uniqueId ?? member.id,
            )}`,
          },
        ]
      : []),
    {
      label: "Send Message",
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(`Message for ${fullName}`)}`,
    },
    {
      label: "View Member Directory",
      icon: Users2,
      href: "/directory",
    },
    {
      label: "Download Public Profile (PDF)",
      icon: Download,
      onClick: () => void handleDownloadPublicProfilePdf(),
      disabled: isDownloadingPdf,
    },
    {
      label: "Report an Issue",
      icon: ShieldAlert,
      href: `mailto:?subject=${encodeURIComponent(`Report issue for ${fullName}'s public profile`)}&body=${encodeURIComponent(`Profile URL: ${resolvedPublicProfileUrl}`)}`,
    },
  ] as const;

  const resetChurchDialog = () => {
    const nextRoleValue =
      member.currentPositionRoleOther?.trim() ||
      member.currentPositionRole?.trim() ||
      "";

    setChurchAffiliationValue(member.churchAffiliation ?? "");
    setChurchAddressValue(member.churchAddress ?? "");
    setPositionValue(
      ROLE_OPTIONS.includes(nextRoleValue)
        ? nextRoleValue
        : nextRoleValue
          ? "Others"
          : "",
    );
    setPositionOtherValue(
      ["Church Worker", "Pastor", "Rev.", "Bishop"].includes(nextRoleValue)
        ? (member.currentPositionRoleOther ?? "")
        : nextRoleValue,
    );
  };

  const resetEducationDialog = () => {
    setElementarySchoolValue(member.elementarySchool ?? "");
    setSecondarySchoolValue(member.secondarySchool ?? "");
    setTertiaryCollegeEntries(parseEducationEntries(member.tertiaryCollege));
    setPostGraduateEntries(parseEducationEntries(member.postGraduateStudies));
  };

  const copyPublicProfileUrl = async () => {
    try {
      await navigator.clipboard.writeText(resolvedPublicProfileUrl);
      setIsCopied(true);
      toast({
        title: "Profile link copied",
        description: "The public profile link is ready to share.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy the public profile link right now.",
        variant: "error",
      });
    }
  };

  const sharePublicProfileUrl = async () => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({
          title: `${fullName} | Public Member Profile`,
          text: `View ${fullName}'s public member profile`,
          url: resolvedPublicProfileUrl,
        });
        return;
      } catch {
        return;
      }
    }

    await copyPublicProfileUrl();
  };

  const handleSaveChurchAffiliation = async () => {
    try {
      await updateChurchAffiliationMutation.mutateAsync({
        churchAffiliation: churchAffiliationValue.trim() || undefined,
        churchAddress: churchAddressValue.trim() || undefined,
        currentPositionRole:
          positionValue && positionValue !== "Others"
            ? positionValue
            : undefined,
        currentPositionRoleOther:
          positionValue === "Others"
            ? positionOtherValue.trim() || undefined
            : undefined,
      });

      toast({
        title: "Church affiliation updated",
        description:
          "Your church or organization affiliation has been saved successfully.",
        variant: "success",
      });

      setIsChurchDialogOpen(false);
      router.refresh();
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Update failed",
        description:
          apiError.message ??
          (error instanceof Error
            ? error.message
            : "Unable to update church affiliation right now."),
        variant: "error",
      });
    }
  };

  const updateEducationEntry = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) => {
    setter((current) =>
      current.map((entry, idx) => (idx === index ? value : entry)),
    );
  };

  const addEducationEntry = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((current) => [...current, ""]);
  };

  const removeEducationEntry = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) => {
    setter((current) => {
      const next = current.filter((_, idx) => idx !== index);
      return next.length > 0 ? next : [""];
    });
  };

  const handleSaveEducation = async () => {
    try {
      await updateEducationMutation.mutateAsync({
        elementarySchool: elementarySchoolValue.trim() || undefined,
        secondarySchool: secondarySchoolValue.trim() || undefined,
        tertiaryCollegeEntries,
        postGraduateStudiesEntries: postGraduateEntries,
      });

      toast({
        title: "Education updated",
        description: "Your education attainment has been saved successfully.",
        variant: "success",
      });

      setIsEducationDialogOpen(false);
      router.refresh();
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Update failed",
        description:
          apiError.message ??
          (error instanceof Error
            ? error.message
            : "Unable to update education right now."),
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (!isCopied) return;

    const timeoutId = window.setTimeout(() => {
      setIsCopied(false);
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [isCopied]);

  return (
    <>
      <div className="space-y-6 lg:col-span-3">
        <div className="w-full max-w-md overflow-hidden border border-green-800/20 bg-linear-to-br from-[#032a0d] via-[#043612] to-[#021d09] shadow-2xl">
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-green-200/80">
                  Official Member Profile
                </p>
                <h3 className="text-lg font-semibold tracking-tight text-white">
                  Public Verification
                </h3>
              </div>
              <ShieldCheck className="size-5 text-green-300" />
            </div>

            <div className="mt-5 border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <p className="text-sm text-green-50/90">
                This page shows the member&apos;s currently published profile,
                visible status, service information, and approved public
                records.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className="bg-green-500/15 text-green-100 hover:bg-green-500/15">
                  <BadgeCheck className="mr-1 size-3.5" />
                  {member.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge className="bg-green-500/15 text-green-100 hover:bg-green-500/15">
                  {formatEnumLabel(member.status)}
                </Badge>
                <Badge className="bg-green-500/15 text-green-100 hover:bg-green-500/15">
                  {member.user.isEmailVerified
                    ? "Email verified"
                    : "Email pending"}
                </Badge>
              </div>
            </div>

            <div className="relative mt-5 overflow-hidden border border-white/10">
              <img
                src="https://images.pexels.com/photos/7654193/pexels-photo-7654193.jpeg"
                alt="Public verification"
                className="h-44 w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#032a0d]/85 via-[#032a0d]/25 to-transparent" />

              <div className="absolute right-4 bottom-4 left-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md">
                  <ShieldCheck className="size-4 text-green-300" />
                  <span className="text-[11px] font-semibold tracking-wide text-white">
                    Verified Public Record
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium text-white">
                  {member.churchAffiliation || fullName}
                </p>
                <p className="mt-1 text-xs text-green-100/85">{currentRole}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border bg-white p-4 text-neutral-900 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">
              Church/organization affiliation
            </h4>
            {canEditChurchAffiliation ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="rounded-none p-0!"
                onClick={() => {
                  resetChurchDialog();
                  setIsChurchDialogOpen(true);
                }}
              >
                <EditIcon className="size-4" />
              </Button>
            ) : null}
          </div>

          {hasChurchAffiliationContent ? (
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-base font-semibold">
                  Name of church/organization
                </p>
                <p className="text-sm text-muted-foreground">
                  {member.churchAffiliation || "Not publicly listed"}
                </p>
              </div>

              <div>
                <p className="text-base font-semibold">
                  Church/organization address
                </p>
                <p className="text-sm text-muted-foreground">
                  {member.churchAddress || "Not publicly listed"}
                </p>
              </div>

              <div>
                <p className="text-base font-semibold">Current position/role</p>
                <p className="text-sm text-muted-foreground">
                  {member.currentPositionRole ||
                    member.currentPositionRoleOther ||
                    "Not publicly listed"}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-7 text-center">
              <p className="text-base font-semibold text-neutral-900">
                No church or organization affiliation listed yet.
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Public church affiliation details will appear here once added.
              </p>
            </div>
          )}
        </div>

        <div className="border bg-white p-4 text-neutral-900 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-lg font-semibold">Education attainment</h4>
            {canEditEducation && hasEducationContent ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => {
                  resetEducationDialog();
                  setIsEducationDialogOpen(true);
                }}
                className="rounded-none p-0!"
              >
                <EditIcon className="size-4" />
              </Button>
            ) : null}
          </div>

          {hasEducationContent ? (
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-base font-semibold">Elementary School</p>
                <p className="text-sm text-muted-foreground">
                  {member.elementarySchool || "Not publicly listed"}
                </p>
              </div>
              <div>
                <p className="text-base font-semibold">Secondary School</p>
                <p className="text-sm text-muted-foreground">
                  {member.secondarySchool || "Not publicly listed"}
                </p>
              </div>
              <div>
                <p className="text-base font-semibold">Tertiary / College</p>
                <div className="mt-2 space-y-2">
                  {displayEducationEntries(member.tertiaryCollege).length >
                  0 ? (
                    displayEducationEntries(member.tertiaryCollege).map(
                      (entry) => (
                        <p
                          key={`tertiary-${entry}`}
                          className="text-sm text-muted-foreground"
                        >
                          {entry}
                        </p>
                      ),
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Not publicly listed
                    </p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-base font-semibold">Post-graduate Studies</p>
                <div className="mt-2 space-y-2">
                  {displayEducationEntries(member.postGraduateStudies).length >
                  0 ? (
                    displayEducationEntries(member.postGraduateStudies).map(
                      (entry) => (
                        <p
                          key={`postgrad-${entry}`}
                          className="text-sm text-muted-foreground"
                        >
                          {entry}
                        </p>
                      ),
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Not publicly listed
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-7 text-center">
              <p className="text-base font-semibold text-neutral-900">
                No education attainment listed yet.
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Public education details will appear here once added.
              </p>
              {canEditEducation ? (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 rounded-none"
                  onClick={() => {
                    resetEducationDialog();
                    setIsEducationDialogOpen(true);
                  }}
                >
                  <EditIcon className="size-4" />
                  Add education
                </Button>
              ) : null}
            </div>
          )}
        </div>

        <div className="overflow-hidden border bg-white text-neutral-900 shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4">
            <h4 className="text-lg font-semibold">Quick Actions</h4>
          </div>
          <div className="divide-y">
            {quickActions.map((action) => {
              const Icon = action.icon;

              if ("href" in action) {
                return (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-neutral-50"
                  >
                    <span className="flex items-center gap-3 text-sm font-medium text-neutral-800">
                      <Icon className="size-4 text-neutral-500" />
                      {action.label}
                    </span>
                    <ChevronRight className="size-4 text-neutral-400" />
                  </a>
                );
              }

              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  disabled={"disabled" in action ? action.disabled : false}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="flex items-center gap-3 text-sm font-medium text-neutral-800">
                    <Icon className="size-4 text-neutral-500" />
                    {"disabled" in action && action.disabled
                      ? "Preparing PDF..."
                      : action.label}
                  </span>
                  <ChevronRight className="size-4 text-neutral-400" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden border bg-white text-neutral-900 shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4">
            <div>
              <h4 className="text-lg font-semibold">Share Public Profile</h4>
              <p className="text-sm text-muted-foreground">
                Share this member&apos;s public profile.
              </p>
            </div>
          </div>
          <div className="space-y-4 p-5 pt-0!">
            <div className="flex items-center gap-2 border bg-neutral-50">
              <div className="min-w-0 flex-1 px-2 text-sm text-neutral-600">
                <p className="truncate">{resolvedPublicProfileUrl}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-none"
                onClick={() => void copyPublicProfileUrl()}
                aria-label="Copy public profile link"
              >
                {isCopied ? (
                  <Check className="size-4 text-green-600" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>

            <div className="flex gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex size-8 items-center justify-center rounded-full bg-[#1877F2] text-white transition hover:opacity-90"
                aria-label="Share on Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedShareText}`}
                target="_blank"
                rel="noreferrer"
                className="flex size-8 items-center justify-center rounded-full bg-black text-white transition hover:opacity-90"
                aria-label="Share on X"
              >
                <FaXTwitter />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex size-8 items-center justify-center rounded-full bg-[#0A66C2] text-white transition hover:opacity-90"
                aria-label="Share on LinkedIn"
              >
                <FaLinkedin />
              </a>
              <button
                type="button"
                onClick={() => void sharePublicProfileUrl()}
                className="flex size-8 items-center justify-center rounded-full bg-neutral-600 text-white transition hover:opacity-90"
                aria-label="Share public profile"
              >
                {isCopied ? (
                  <Check className="size-4 text-green-300" />
                ) : (
                  <Share2 className="size-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={isChurchDialogOpen}
        onOpenChange={(open) => {
          setIsChurchDialogOpen(open);
          if (!open) {
            resetChurchDialog();
          }
        }}
      >
        <DialogContent className="max-w-2xl!">
          <DialogHeader>
            <DialogTitle>Edit church/organization affiliation</DialogTitle>
            <DialogDescription>
              Update the public church or organization information shown on your
              member profile.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="church-affiliation">Name of church</Label>
              <Input
                id="church-affiliation"
                value={churchAffiliationValue}
                onChange={(event) =>
                  setChurchAffiliationValue(event.target.value)
                }
                placeholder="Name of church or organization"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="church-address">Church address</Label>
              <Input
                id="church-address"
                value={churchAddressValue}
                onChange={(event) => setChurchAddressValue(event.target.value)}
                placeholder="Street, barangay, city / municipality"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="current-position-role">
                  Current position/role
                </Label>
                <Select value={positionValue} onValueChange={setPositionValue}>
                  <SelectTrigger className="w-full" id="current-position-role">
                    <SelectValue placeholder="Select current role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Church Worker">Church Worker</SelectItem>
                    <SelectItem value="Pastor">Pastor</SelectItem>
                    <SelectItem value="Rev.">Rev.</SelectItem>
                    <SelectItem value="Bishop">Bishop</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position-other">
                  If others, please specify
                </Label>
                <Input
                  id="position-other"
                  value={positionOtherValue}
                  onChange={(event) =>
                    setPositionOtherValue(event.target.value)
                  }
                  placeholder="Specify current position or role"
                  disabled={positionValue !== "Others"}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsChurchDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleSaveChurchAffiliation()}
              disabled={updateChurchAffiliationMutation.isPending}
              className="bg-[#032a0d] hover:bg-[#043512]"
            >
              {updateChurchAffiliationMutation.isPending
                ? "Saving..."
                : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEducationDialogOpen}
        onOpenChange={(open) => {
          setIsEducationDialogOpen(open);
          if (!open) {
            resetEducationDialog();
          }
        }}
      >
        <DialogContent className="max-w-4xl!">
          <DialogHeader>
            <DialogTitle>Edit education attainment</DialogTitle>
            <DialogDescription>
              Update the public education information shown on your member
              profile.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="elementary-school">Elementary (optional)</Label>
                <Input
                  id="elementary-school"
                  value={elementarySchoolValue}
                  onChange={(event) =>
                    setElementarySchoolValue(event.target.value)
                  }
                  placeholder="Elementary school"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary-school">Secondary (optional)</Label>
                <Input
                  id="secondary-school"
                  value={secondarySchoolValue}
                  onChange={(event) =>
                    setSecondarySchoolValue(event.target.value)
                  }
                  placeholder="Secondary school"
                />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-3">
                <Label>Tertiary / College (optional)</Label>
                <div className="space-y-3">
                  {tertiaryCollegeEntries.map((entry, index) => (
                    <div key={`tertiary-entry-${index}`} className="flex gap-2">
                      <Input
                        value={entry}
                        onChange={(event) =>
                          updateEducationEntry(
                            setTertiaryCollegeEntries,
                            index,
                            event.target.value,
                          )
                        }
                        placeholder="Name of School / Course / Year Graduated"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          removeEducationEntry(setTertiaryCollegeEntries, index)
                        }
                        disabled={tertiaryCollegeEntries.length === 1 && !entry}
                        aria-label="Remove tertiary education entry"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addEducationEntry(setTertiaryCollegeEntries)}
                >
                  <Plus className="size-4" />
                  Add tertiary/college
                </Button>
              </div>

              <div className="space-y-3">
                <Label>Post-graduate studies (optional)</Label>
                <div className="space-y-3">
                  {postGraduateEntries.map((entry, index) => (
                    <div key={`postgrad-entry-${index}`} className="flex gap-2">
                      <Input
                        value={entry}
                        onChange={(event) =>
                          updateEducationEntry(
                            setPostGraduateEntries,
                            index,
                            event.target.value,
                          )
                        }
                        placeholder="Name of School / Course / Year Graduated"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          removeEducationEntry(setPostGraduateEntries, index)
                        }
                        disabled={postGraduateEntries.length === 1 && !entry}
                        aria-label="Remove post-graduate education entry"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addEducationEntry(setPostGraduateEntries)}
                >
                  <Plus className="size-4" />
                  Add post-graduate
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEducationDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleSaveEducation()}
              disabled={updateEducationMutation.isPending}
              className="bg-[#032a0d] hover:bg-[#043512]"
            >
              {updateEducationMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
