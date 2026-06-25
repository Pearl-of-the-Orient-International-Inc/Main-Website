/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  ChevronRight,
  FileCheck2,
  FileText,
  Flag,
  Grid2x2,
  GraduationCap,
  ImageIcon,
  MapPin,
  NotebookPen,
  ScrollText,
  SearchX,
  ShieldCheck,
  Table2,
  X,
  Upload,
  Trophy,
  Users,
} from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { IconCalendarEvent, IconExternalLink } from "@tabler/icons-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { useOptionalCurrentUserQuery } from "@/features/auth/auth.hooks";
import {
  toApiError,
  useCreateCurrentMemberCertificateMutation,
  useCreateCurrentMemberPublicRecordMutation,
  useUpdateCurrentBranchServicesMutation,
  useUploadMemberCertificateMutation,
  useUploadMemberPublicRecordAttachmentsMutation,
} from "@/features/member/member.hooks";
import type {
  MemberPublicRecordStatus,
  MemberPublicRecordType,
} from "@/features/member/member.types";
import { useToast } from "@/hooks/use-toast";
import {
  formatDate,
  formatEnumLabel,
  getDocumentPreviewUrl,
  requirementLabels,
  type PublicMember,
} from "./public-member-profile.shared";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PublicDocument = PublicMember["applicantRequirements"][number];
type PublicRecord = PublicMember["publicRecords"][number];

type AnalyticsDatum = {
  name: string;
  value: number;
};

type AnalyticsPieDatum = AnalyticsDatum & {
  fill: string;
};

type AnalyticsImpactDatum = {
  year: string;
  activities: number;
  communityImpact: number;
};

type RecentActivity = {
  title: string;
  description: string;
  date: string;
};

type PublicRecordView = "table" | "grid";
type CertificatePreviewMode = "image" | "pdf";

const PUBLIC_RECORD_TYPE_OPTIONS: Array<{
  value: MemberPublicRecordType;
  label: string;
}> = [
  { value: "REPORT_ACTIVITY", label: "Reports & Activities" },
  { value: "COMMUNITY_SERVICE", label: "Community Service" },
  { value: "TRAINING_CONDUCTED", label: "Trainings Conducted" },
  { value: "PARTICIPATION", label: "Participations" },
  { value: "RECOGNITION", label: "Recognitions" },
];

const PUBLIC_RECORD_STATUS_OPTIONS: Array<{
  value: MemberPublicRecordStatus;
  label: string;
}> = [
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Draft" },
];

const BRANCH_SERVICE_OPTIONS = [
  "Humanitarian",
  "Hospital and Care",
  "Military/PNP",
  "School",
  "Corporate",
  "Disaster & Rescue Operations",
  "Prison",
  "Security",
  "Government",
  "DSWD",
  "Others",
];

const parseBranchServiceText = (value: string | null | undefined) =>
  (value ?? "")
    .split(/[,|]/)
    .map((item) => item.trim())
    .filter(Boolean);

const stripHtml = (value: string) =>
  value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const sanitizeRichTextHtml = (value: string) =>
  value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\s(href|src)=["']javascript:[^"']*["']/gi, "");

function isPdfCertificateUrl(url: string) {
  const normalizedUrl = url.toLowerCase();

  return (
    normalizedUrl.includes(".pdf") ||
    normalizedUrl.includes("application/pdf") ||
    normalizedUrl.includes("application%2fpdf")
  );
}

function CertificatePreview({ title, url }: { title: string; url: string }) {
  const [previewMode, setPreviewMode] = useState<CertificatePreviewMode>(
    isPdfCertificateUrl(url) ? "pdf" : "image",
  );

  if (previewMode === "pdf") {
    return (
      <iframe
        src={getDocumentPreviewUrl(url, "application/pdf")}
        title={title}
        className="h-full w-full"
      />
    );
  }

  return (
    <img
      src={url}
      alt={title}
      className="h-full w-full object-contain"
      onError={() => setPreviewMode("pdf")}
    />
  );
}

type Props = {
  member: PublicMember;
  fullName: string;
  certificateUrl: string | null;
  publicDocuments: PublicDocument[];
  overviewSummary: string[];
  recentActivities: RecentActivity[];
  aboutEssay: string;
  mapEmbedUrl: string;
  analyticsBarData: AnalyticsDatum[];
  analyticsPieData: AnalyticsPieDatum[];
  onViewAllCertificates: () => void;
};

export function PublicMemberProfileTabs({
  member,
  fullName,
  certificateUrl,
  publicDocuments,
  overviewSummary,
  recentActivities,
  aboutEssay,
  mapEmbedUrl,
  analyticsBarData,
  analyticsPieData,
  onViewAllCertificates,
}: Props) {
  const { toast } = useToast();
  const { data: currentUser } = useOptionalCurrentUserQuery();
  const uploadCertificateMutation = useUploadMemberCertificateMutation();
  const createCertificateMutation = useCreateCurrentMemberCertificateMutation();
  const certificateFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [certificateTitle, setCertificateTitle] = useState("");
  const [certificateIssuedAt, setCertificateIssuedAt] = useState("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [recordView, setRecordView] = useState<PublicRecordView>("table");
  const [selectedPublicRecord, setSelectedPublicRecord] =
    useState<PublicRecord | null>(null);
  const [isPublicRecordDialogOpen, setIsPublicRecordDialogOpen] =
    useState(false);
  const [recordTitle, setRecordTitle] = useState("");
  const [recordShortDescription, setRecordShortDescription] = useState("");
  const [recordType, setRecordType] =
    useState<MemberPublicRecordType>("REPORT_ACTIVITY");
  const [recordDate, setRecordDate] = useState("");
  const [recordTime, setRecordTime] = useState("");
  const [recordLocation, setRecordLocation] = useState("");
  const [recordStatus, setRecordStatus] =
    useState<MemberPublicRecordStatus>("PUBLISHED");
  const publicRecordAttachmentInputRef = useRef<HTMLInputElement | null>(null);
  const [publicRecordAttachments, setPublicRecordAttachments] = useState<
    File[]
  >([]);
  const createPublicRecordMutation =
    useCreateCurrentMemberPublicRecordMutation();
  const uploadPublicRecordAttachmentsMutation =
    useUploadMemberPublicRecordAttachmentsMutation();
  const updateBranchServicesMutation = useUpdateCurrentBranchServicesMutation();
  const signedInMemberProfile = currentUser?.memberProfile;
  const canManageCertificates = Boolean(
    signedInMemberProfile &&
    (signedInMemberProfile.id === member.id ||
      (signedInMemberProfile.uniqueId &&
        signedInMemberProfile.uniqueId === member.uniqueId)),
  );
  const canManagePublicRecords = canManageCertificates;
  const canManageBranchServices = canManageCertificates;
  const visibleEmailAddress =
    signedInMemberProfile?.id === member.id
      ? currentUser?.email || "Not publicly listed"
      : "Not publicly listed";
  const certificates = member.certificates ?? [];
  const publicProfileDocuments = publicDocuments ?? [];
  const publicRecords = member.publicRecords ?? [];
  const initialBranchServiceEntries = parseBranchServiceText(
    member.preferredBranchOther,
  );
  const initialBranchServiceSelections = BRANCH_SERVICE_OPTIONS.filter(
    (option) =>
      option !== "Others" && initialBranchServiceEntries.includes(option),
  );
  const initialCustomBranchService = initialBranchServiceEntries
    .filter((entry) => !BRANCH_SERVICE_OPTIONS.includes(entry))
    .join(", ");
  const [isBranchServiceDialogOpen, setIsBranchServiceDialogOpen] =
    useState(false);
  const [selectedBranchServices, setSelectedBranchServices] = useState<
    string[]
  >([
    ...initialBranchServiceSelections,
    ...(initialCustomBranchService ? ["Others"] : []),
  ]);
  const [branchServiceOther, setBranchServiceOther] = useState(
    initialCustomBranchService,
  );
  const hasAnyCredentialContent =
    Boolean(certificateUrl) ||
    certificates.length > 0 ||
    publicProfileDocuments.length > 0;
  const isSavingCertificate =
    uploadCertificateMutation.isPending || createCertificateMutation.isPending;
  const isSavingPublicRecord =
    createPublicRecordMutation.isPending ||
    uploadPublicRecordAttachmentsMutation.isPending;
  const isSavingBranchServices = updateBranchServicesMutation.isPending;
  const visibleBranchServices = [
    ...member.preferredBranches.map((branch) => branch.title),
    ...initialBranchServiceEntries,
  ].filter(
    (branch, index, list) =>
      branch && list.findIndex((item) => item === branch) === index,
  );
  const allCertificatesCount = certificates.length + (certificateUrl ? 1 : 0);
  const publicRecordCounts = {
    all: publicRecords.length,
    reportsActivities: publicRecords.filter(
      (item) => item.type === "REPORT_ACTIVITY",
    ).length,
    communityService: publicRecords.filter(
      (item) => item.type === "COMMUNITY_SERVICE",
    ).length,
    trainingsConducted: publicRecords.filter(
      (item) => item.type === "TRAINING_CONDUCTED",
    ).length,
    participations: publicRecords.filter(
      (item) => item.type === "PARTICIPATION",
    ).length,
    recognitions: publicRecords.filter((item) => item.type === "RECOGNITION")
      .length,
  };
  const impactYears = Array.from(
    new Set(publicRecords.map((item) => new Date(item.eventAt).getFullYear())),
  ).sort((left, right) => left - right);
  const impactOverTimeData: AnalyticsImpactDatum[] =
    impactYears.length > 0
      ? impactYears.map((year, index, years) => {
          const recordsForYear = publicRecords.filter(
            (item) => new Date(item.eventAt).getFullYear() === year,
          );

          return {
            year:
              index === years.length - 1 ? `${year} (YTD)` : year.toString(),
            activities: recordsForYear.length,
            communityImpact: recordsForYear.filter((item) =>
              [
                "COMMUNITY_SERVICE",
                "PARTICIPATION",
                "REPORT_ACTIVITY",
              ].includes(item.type),
            ).length,
          };
        })
      : [
          {
            year: new Date().getFullYear().toString(),
            activities: 0,
            communityImpact: 0,
          },
        ];
  const topContributionEntries = PUBLIC_RECORD_TYPE_OPTIONS.map((option) => ({
    label: option.label,
    count: publicRecords.filter((item) => item.type === option.value).length,
  }))
    .filter((item) => item.count > 0)
    .sort((left, right) => right.count - left.count)
    .slice(0, 5);
  const verifiedSignalCount = analyticsPieData.reduce(
    (total, item) => total + item.value,
    0,
  );

  const resetCertificateDialog = () => {
    setCertificateTitle("");
    setCertificateIssuedAt("");
    setCertificateFile(null);
  };

  const resetPublicRecordDialog = () => {
    setRecordTitle("");
    setRecordShortDescription("");
    setRecordType("REPORT_ACTIVITY");
    setRecordDate("");
    setRecordTime("");
    setRecordLocation("");
    setRecordStatus("PUBLISHED");
    setPublicRecordAttachments([]);
  };

  const resetBranchServiceDialog = () => {
    setSelectedBranchServices([
      ...initialBranchServiceSelections,
      ...(initialCustomBranchService ? ["Others"] : []),
    ]);
    setBranchServiceOther(initialCustomBranchService);
  };

  const toggleBranchService = (service: string) => {
    setSelectedBranchServices((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service],
    );
  };

  const handleCertificateFileChange = (file: File | null | undefined) => {
    if (!file) return;
    setCertificateFile(file);
  };

  const openCertificatePicker = () => {
    certificateFileInputRef.current?.click();
  };

  const handlePublicRecordAttachmentFiles = (
    files: FileList | File[] | null | undefined,
  ) => {
    if (!files?.length) return;

    const nextFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (nextFiles.length === 0) {
      toast({
        title: "Invalid attachment",
        description: "Only image attachments are supported for public records.",
        variant: "error",
      });
      return;
    }

    setPublicRecordAttachments((current) => {
      const merged = [...current];

      for (const file of nextFiles) {
        const alreadyExists = merged.some(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified,
        );

        if (!alreadyExists) {
          merged.push(file);
        }
      }

      return merged.slice(0, 6);
    });
  };

  const removePublicRecordAttachment = (indexToRemove: number) => {
    setPublicRecordAttachments((current) =>
      current.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleCreateCertificate = async () => {
    try {
      if (!certificateTitle.trim()) {
        throw new Error("Certificate title is required.");
      }

      if (!certificateIssuedAt) {
        throw new Error("Issued date is required.");
      }

      if (!certificateFile) {
        throw new Error("Please upload a certificate file.");
      }

      const uploaded =
        await uploadCertificateMutation.mutateAsync(certificateFile);
      const certificateStoredUrl =
        uploaded?.serverData?.fileUrl ||
        uploaded?.ufsUrl ||
        uploaded?.url ||
        "";

      if (!certificateStoredUrl) {
        throw new Error("Upload finished without a certificate URL.");
      }

      const response = await createCertificateMutation.mutateAsync({
        title: certificateTitle.trim(),
        certificateUrl: certificateStoredUrl,
        issuedAt: new Date(`${certificateIssuedAt}T00:00:00`).toISOString(),
      });

      toast({
        title: "Certificate added",
        description: `Credential ID ${response.data.credentialId} is now part of the public profile.`,
        variant: "success",
      });

      setIsCertificateDialogOpen(false);
      resetCertificateDialog();
      window.location.reload();
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Certificate upload failed",
        description:
          apiError.message ??
          (error instanceof Error
            ? error.message
            : "Unable to add the certificate right now."),
        variant: "error",
      });
    }
  };

  const handleCreatePublicRecord = async () => {
    try {
      if (!recordTitle.trim()) {
        throw new Error("Record title is required.");
      }

      const recordDescriptionText = stripHtml(recordShortDescription);

      if (!recordDescriptionText) {
        throw new Error("Short description is required.");
      }

      if (recordDescriptionText.length > 3000) {
        throw new Error("Short description must not exceed 3000 characters.");
      }

      if (!recordDate) {
        throw new Error("Date is required.");
      }

      if (!recordTime) {
        throw new Error("Time is required.");
      }

      if (!recordLocation.trim()) {
        throw new Error("Location is required.");
      }

      const uploadedAttachments = publicRecordAttachments.length
        ? await uploadPublicRecordAttachmentsMutation.mutateAsync(
            publicRecordAttachments,
          )
        : [];

      const normalizedAttachments = uploadedAttachments.map((attachment) => ({
        fileUrl:
          attachment?.serverData?.fileUrl ||
          attachment?.ufsUrl ||
          attachment?.url ||
          "",
        fileName: attachment?.name,
        mimeType: attachment?.type,
      }));

      if (normalizedAttachments.some((attachment) => !attachment.fileUrl)) {
        throw new Error(
          "One or more public record attachments finished uploading without a file URL.",
        );
      }

      await createPublicRecordMutation.mutateAsync({
        title: recordTitle.trim(),
        shortDescription: sanitizeRichTextHtml(recordShortDescription.trim()),
        type: recordType,
        eventAt: new Date(`${recordDate}T${recordTime}:00`).toISOString(),
        location: recordLocation.trim(),
        status: recordStatus,
        attachments: normalizedAttachments,
      });

      toast({
        title: "Public record created",
        description: "The public record is now part of the member profile.",
        variant: "success",
      });

      setIsPublicRecordDialogOpen(false);
      resetPublicRecordDialog();
      window.location.reload();
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Public record creation failed",
        description:
          apiError.message ??
          (error instanceof Error
            ? error.message
            : "Unable to create the public record right now."),
        variant: "error",
      });
    }
  };

  const handleUpdateBranchServices = async () => {
    try {
      const normalizedSelections = selectedBranchServices.filter(
        (service) => service !== "Others",
      );
      const normalizedOther = branchServiceOther.trim();
      const preferredBranchOther = [
        ...normalizedSelections,
        ...(selectedBranchServices.includes("Others") && normalizedOther
          ? [normalizedOther]
          : []),
      ].join(", ");

      if (!preferredBranchOther) {
        throw new Error("Select at least one branch of service.");
      }

      await updateBranchServicesMutation.mutateAsync({
        preferredBranchOther,
      });

      toast({
        title: "Branch services updated",
        description: "The public profile service branches are now updated.",
        variant: "success",
      });

      setIsBranchServiceDialogOpen(false);
      window.location.reload();
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Branch service update failed",
        description:
          apiError.message ??
          (error instanceof Error
            ? error.message
            : "Unable to update branch services right now."),
        variant: "error",
      });
    }
  };

  const renderCertificateCards = () => {
    if (!hasAnyCredentialContent) {
      return (
        <div className="col-span-full border border-dashed border-neutral-300 bg-neutral-50 px-6 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-400">
              <ShieldCheck className="size-7" />
            </div>
            <p className="mt-2 text-base font-semibold text-neutral-900">
              No public certifications available yet.
            </p>
            <p className="mb-3 text-sm text-neutral-500">
              Certifications will appear here once verified and published.
            </p>
            {canManageCertificates ? (
              <Button
                type="button"
                onClick={() => setIsCertificateDialogOpen(true)}
                variant="outline"
                size="sm"
              >
                <Upload className="size-4" /> Upload new certificate
              </Button>
            ) : null}
          </div>
        </div>
      );
    }

    return (
      <>
        {certificates.map((certificate) => (
          <div
            key={certificate.credentialId}
            className="border bg-neutral-50 p-3"
          >
            <p className="text-sm font-semibold">{certificate.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Issued {formatDate(certificate.dateReceived)}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Credential ID: {certificate.credentialId}
            </p>
            <div className="mt-4 h-80 overflow-hidden border bg-white">
              <CertificatePreview
                title={certificate.title}
                url={certificate.certificateUrl}
              />
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="mt-3 text-[#032a0d]"
            >
              <a
                href={certificate.certificateUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open certificate <IconExternalLink />
              </a>
            </Button>
          </div>
        ))}

        {certificateUrl ? (
          <div className="border bg-neutral-50 p-3">
            <p className="text-sm font-semibold">Official Member Certificate</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Published on {formatDate(member.idGenerationAsset?.generatedAt)}
            </p>
            <div className="mt-4 h-80 overflow-hidden border bg-white">
              <iframe
                src={getDocumentPreviewUrl(certificateUrl, "application/pdf")}
                title="Official member certificate"
                className="h-full w-full"
              />
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="mt-3 text-[#032a0d]"
            >
              <a href={certificateUrl} target="_blank" rel="noreferrer">
                Open certificate <IconExternalLink />
              </a>
            </Button>
          </div>
        ) : null}

        {publicProfileDocuments.length > 0
          ? publicProfileDocuments.map((item) => (
              <div key={item.id} className="border bg-neutral-50 p-5">
                <p className="text-sm font-semibold">
                  {requirementLabels[item.type] ?? formatEnumLabel(item.type)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Updated {formatDate(item.updatedAt)}
                </p>
                <div className="mt-4 h-80 overflow-hidden border bg-white">
                  {item.mimeType?.startsWith("image/") ? (
                    <img
                      src={item.fileUrl}
                      alt={requirementLabels[item.type] ?? item.type}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <iframe
                      src={getDocumentPreviewUrl(item.fileUrl, item.mimeType)}
                      title={requirementLabels[item.type] ?? item.type}
                      className="h-full w-full"
                    />
                  )}
                </div>
                <Button
                  asChild
                  variant="link"
                  className="mt-3 px-0 text-[#032a0d]"
                >
                  <a href={item.fileUrl} target="_blank" rel="noreferrer">
                    Open file <ChevronRight />
                  </a>
                </Button>
              </div>
            ))
          : null}
      </>
    );
  };

  const getPublicRecordTypeLabel = (type: MemberPublicRecordType) =>
    PUBLIC_RECORD_TYPE_OPTIONS.find((option) => option.value === type)?.label ??
    formatEnumLabel(type);

  const renderPublicRecordEmptyState = () => (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center">
      <div className="flex size-16 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-400 shadow-sm">
        <SearchX className="size-8" />
      </div>
      <p className="mt-4 text-xl font-semibold text-neutral-900">
        No public records available yet.
      </p>
      <p className="mt-2 max-w-xl text-sm text-neutral-500">
        Activities, reports, ministry tasks, and documented community work will
        appear here once published.
      </p>
      {canManagePublicRecords ? (
        <Button
          type="button"
          onClick={() => setIsPublicRecordDialogOpen(true)}
          className="mt-5 bg-[#032a0d] hover:bg-[#043512]"
        >
          <NotebookPen className="size-4" /> Create public records
        </Button>
      ) : null}
    </div>
  );

  const renderPublicRecordGrid = () => (
    <div className="grid gap-4 xl:grid-cols-2">
      {publicRecords.map((record) => (
        <article
          key={record.id}
          role="button"
          tabIndex={0}
          onClick={() => setSelectedPublicRecord(record)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setSelectedPublicRecord(record);
            }
          }}
          className="cursor-pointer overflow-hidden border bg-white transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#032a0d]"
        >
          {record.attachments[0] ? (
            <div className="h-50 overflow-hidden bg-neutral-100">
              <img
                src={record.attachments[0].fileUrl}
                alt={record.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          <div className="bg-[linear-gradient(135deg,#083914_0%,#0f5b23_100%)] px-5 py-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <Badge className="border-white/15 bg-white/12 text-white hover:bg-white/12">
                {getPublicRecordTypeLabel(record.type)}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/90 text-[#032a0d] hover:bg-white/90"
              >
                {formatEnumLabel(record.status)}
              </Badge>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{record.title}</h3>
            <div
              className="mt-2 line-clamp-2 text-xs text-white/85 [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{
                __html: sanitizeRichTextHtml(record.shortDescription),
              }}
            />
          </div>
          <div className="space-y-4 px-5 py-5">
            <div className="grid gap-3 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <CalendarClock className="size-3.5 text-[#032a0d]" />
                <span>
                  {formatDate(record.eventAt)},{" "}
                  {new Date(record.eventAt).toLocaleTimeString("en-PH", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-[#032a0d]" />
                <span>{record.location}</span>
              </div>
              {record.attachments.length > 0 ? (
                <div className="flex items-center gap-2">
                  <Upload className="size-3.5 text-[#032a0d]" />
                  <span>
                    {record.attachments.length} attachment
                    {record.attachments.length > 1 ? "s" : ""}
                  </span>
                </div>
              ) : null}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-none"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedPublicRecord(record);
              }}
            >
              View full details
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </article>
      ))}
    </div>
  );

  const renderPublicRecordTable = () => (
    <div className="w-full max-w-full overflow-hidden border border-neutral-200">
      <div className="w-full max-w-full overflow-x-auto">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[38%]">Record Title</TableHead>
              <TableHead className="w-[17%]">Date</TableHead>
              <TableHead className="w-[24%]">Location</TableHead>
              <TableHead className="w-[13%]">Status</TableHead>
              <TableHead className="w-[8%] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {publicRecords.map((record) => (
              <TableRow
                key={record.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedPublicRecord(record)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedPublicRecord(record);
                  }
                }}
                className="cursor-pointer align-middle"
              >
                <TableCell className="max-w-0 align-middle">
                  <p className="truncate font-semibold text-neutral-950">
                    {record.title}
                  </p>

                  <div
                    className="mt-1 line-clamp-1 break-words text-sm text-neutral-500 [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeRichTextHtml(record.shortDescription),
                    }}
                  />

                  {record.attachments.length > 0 && (
                    <p className="mt-2 text-xs text-neutral-500">
                      {record.attachments.length} attachment
                      {record.attachments.length > 1 ? "s" : ""}
                    </p>
                  )}
                </TableCell>

                <TableCell className="align-middle text-sm">
                  <p>{formatDate(record.eventAt)}</p>
                  <p className="mt-1 text-neutral-500">
                    {new Date(record.eventAt).toLocaleTimeString("en-PH", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </TableCell>

                <TableCell className="break-words align-middle text-sm text-neutral-700">
                  {record.location}
                </TableCell>

                <TableCell className="align-middle">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                  >
                    {formatEnumLabel(record.status)}
                  </Badge>
                </TableCell>

                <TableCell className="align-middle text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedPublicRecord(record);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        <TabsContent value="home">
          <div className="space-y-6">
            <section className="overflow-hidden border bg-white shadow">
              <div className="border-b px-5 py-4">
                <h2 className="text-2xl font-semibold text-neutral-950">
                  Overview
                </h2>
              </div>
              <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)] lg:items-start">
                <div className="space-y-5">
                  <div className="border border-neutral-200 bg-linear-to-br from-white via-white to-neutral-50 p-6 shadow-sm">
                    <p className="text-base text-neutral-700">
                      {overviewSummary.join(" ")}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="border border-[#032a0d]/10 bg-[#032a0d]/4 p-4">
                      <p className="text-xs font-semibold uppercase text-neutral-500">
                        Membership
                      </p>
                      <p className="mt-2 text-sm font-semibold text-neutral-950">
                        {formatEnumLabel(member.memberType)}
                      </p>
                    </div>
                    <div className="border border-[#032a0d]/10 bg-[#032a0d]/4 p-4">
                      <p className="text-xs font-semibold uppercase text-neutral-500">
                        Status
                      </p>
                      <p className="mt-2 text-sm font-semibold text-neutral-950">
                        {member.isActive ? "Active member" : "Inactive profile"}
                      </p>
                    </div>
                    <div className="border border-[#032a0d]/10 bg-[#032a0d]/4 p-4">
                      <p className="text-xs font-semibold uppercase text-neutral-500">
                        Since
                      </p>
                      <p className="mt-2 text-sm font-semibold text-neutral-950">
                        {formatDate(member.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
                  <div className="border-b bg-linear-to-r from-neutral-50 to-white px-5 py-4">
                    <p className="text-sm font-semibold uppercase text-neutral-500">
                      Quick Facts
                    </p>
                  </div>
                  <div className="divide-y divide-neutral-100">
                    <div className="px-5 py-4">
                      <p className="text-xs font-semibold uppercase text-neutral-500">
                        Email address
                      </p>
                      <p className="mt-1 text-sm font-medium text-neutral-900">
                        {visibleEmailAddress}
                      </p>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-xs font-semibold uppercase text-neutral-500">
                        Nationality
                      </p>
                      <p className="mt-1 text-sm font-medium text-neutral-900">
                        {member.nationality || "Not publicly listed"}
                      </p>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-xs font-semibold uppercase text-neutral-500">
                        Skills and talents
                      </p>
                      <p className="mt-1 text-sm leading-6 text-neutral-700">
                        {member.skillsTalents || "Not publicly listed"}
                      </p>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-xs font-semibold uppercase text-neutral-500">
                        Primary service location
                      </p>
                      <p className="mt-1 text-sm font-medium text-neutral-900">
                        {[member.municipalityCity, member.province]
                          .filter(Boolean)
                          .join(", ") || "Not publicly listed"}
                      </p>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-xs font-semibold uppercase text-neutral-500">
                        Region
                      </p>
                      <p className="mt-1 text-sm font-medium text-neutral-900">
                        {member.region || "Not publicly listed"}
                      </p>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-xs font-semibold uppercase text-neutral-500">
                        Application date
                      </p>
                      <p className="mt-1 text-sm font-medium text-neutral-900">
                        {formatDate(member.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden border bg-white shadow">
              <div className="flex flex-col gap-3 border-b px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-semibold text-neutral-950">
                  Certifications
                </h2>
                <button
                  type="button"
                  onClick={onViewAllCertificates}
                  className="self-start font-semibold text-primary transition hover:underline sm:self-auto"
                >
                  View all certificates
                </button>
              </div>
              <div className="grid gap-5 p-5 lg:grid-cols-2">
                {renderCertificateCards()}
              </div>
            </section>

            <section className="overflow-hidden border bg-white shadow">
              <div className="flex items-center justify-between border-b px-5 py-3">
                <h2 className="text-2xl font-semibold text-neutral-950">
                  Recent Activity
                </h2>
                <div className="text-sm text-muted-foreground">
                  {recentActivities.length} timeline entries
                </div>
              </div>
              <div className="p-5">
                <div className="space-y-6">
                  {recentActivities.map((activity, index) => {
                    const activityDate = new Date(activity.date);
                    const dateLabel = activityDate.toLocaleDateString("en-PH", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={activity.title}
                        className="grid gap-4 md:grid-cols-[170px_28px_minmax(0,1fr)] md:gap-6"
                      >
                        <div className="pt-1 text-sm font-medium text-neutral-500">
                          {dateLabel}
                        </div>

                        <div className="relative flex justify-center">
                          {index < recentActivities.length - 1 ? (
                            <span className="absolute top-12 -bottom-8 w-px bg-neutral-200" />
                          ) : null}
                          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d8e4db] bg-[#edf7ef] shadow-sm">
                            <IconCalendarEvent className="size-5 text-[#032a0d]" />
                          </div>
                        </div>

                        <div className="overflow-hidden border border-neutral-200 bg-white px-5 py-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
                          <div className="space-y-1.5">
                            <p className="text-lg font-semibold text-neutral-950">
                              {activity.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="certificates">
          <section className="overflow-hidden border bg-white shadow">
            <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-950">
                  All Certificates
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  {allCertificatesCount} published credential
                  {allCertificatesCount === 1 ? "" : "s"} available on this
                  profile.
                </p>
              </div>
              {canManageCertificates ? (
                <Button
                  type="button"
                  onClick={() => setIsCertificateDialogOpen(true)}
                  className="w-full bg-[#032a0d] hover:bg-[#043512] sm:w-auto"
                >
                  <Upload className="size-4" /> Add certificate
                </Button>
              ) : null}
            </div>
            <div className="grid gap-5 p-5 lg:grid-cols-2">
              {renderCertificateCards()}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="about">
          <div className="space-y-6">
            <section className="overflow-hidden border bg-white shadow">
              <div className="border-b px-5 py-4">
                <h2 className="text-2xl font-semibold text-neutral-950">
                  About
                </h2>
              </div>
              <div className="p-5">
                <div className="space-y-6 text-base text-neutral-700">
                  {aboutEssay.split("\n\n").map((paragraph, index) => (
                    <p key={`${index}-${paragraph.slice(0, 24)}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            <section className="border bg-white shadow">
              <div className="border-b px-5 py-4">
                <h2 className="text-2xl font-semibold text-neutral-950">
                  Location
                </h2>
              </div>
              <div className="p-5">
                <div className="relative w-full border bg-neutral-50 p-6">
                  <div className="space-y-4">
                    <div className="grid gap-3 lg:grid-cols-2">
                      <div>
                        <p className="font-semibold">Municipality</p>
                        <p className="text-muted-foreground">
                          {member.municipalityCity || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Province</p>
                        <p className="text-muted-foreground">
                          {member.province || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Barangay</p>
                        <p className="text-muted-foreground">
                          {member.barangay || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Region</p>
                        <p className="text-muted-foreground">
                          {member.region || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 h-100 border bg-white">
                    <iframe
                      src={mapEmbedUrl}
                      title={`${fullName} location map`}
                      className="h-full w-full"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="records">
          <section className="overflow-hidden border bg-white shadow">
            <div className="border-b px-5 py-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="size-5 text-[#032a0d]" />
                    <h2 className="text-2xl font-semibold text-neutral-950">
                      Public Records
                    </h2>
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    This section shows the public records, reports, and
                    documented activities related to this member&apos;s service.
                  </p>
                </div>
                {canManagePublicRecords ? (
                  <Button
                    type="button"
                    onClick={() => setIsPublicRecordDialogOpen(true)}
                    size="sm"
                  >
                    <NotebookPen className="size-4" /> Create public records
                  </Button>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge className="bg-[#032a0d] text-white hover:bg-[#032a0d]">
                  All Records {publicRecordCounts.all}
                </Badge>
                <Badge variant="outline">
                  Reports & Activities {publicRecordCounts.reportsActivities}
                </Badge>
                <Badge variant="outline">
                  Community Service {publicRecordCounts.communityService}
                </Badge>
                <Badge variant="outline">
                  Trainings Conducted {publicRecordCounts.trainingsConducted}
                </Badge>
                <Badge variant="outline">
                  Participations {publicRecordCounts.participations}
                </Badge>
                <Badge variant="outline">
                  Recognitions {publicRecordCounts.recognitions}
                </Badge>
              </div>
            </div>

            <div className="space-y-6 p-5">
              <div className="grid gap-3 divide-x py-2 border md:grid-cols-2 xl:grid-cols-4">
                <div className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                      <ScrollText className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase text-neutral-500">
                        Reports & Activities
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-neutral-950">
                        {publicRecordCounts.reportsActivities}
                      </p>
                      <p className="text-xs text-neutral-500">Published</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <Users className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase text-neutral-500">
                        Community Service
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-neutral-950">
                        {publicRecordCounts.communityService}
                      </p>
                      <p className="text-xs text-neutral-500">Activities</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                      <GraduationCap className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase text-neutral-500">
                        Trainings
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-neutral-950">
                        {publicRecordCounts.trainingsConducted}
                      </p>
                      <p className="text-xs text-neutral-500">Sessions</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                      <Trophy className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase text-neutral-500">
                        Seminars
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-neutral-950">
                        {publicRecordCounts.recognitions}
                      </p>
                      <p className="text-xs text-neutral-500">Records</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-950">
                    Activity Ledger
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    Showing all public records tied to ministry work, community
                    activities, and documented service.
                  </p>
                </div>
                <ToggleGroup
                  type="single"
                  value={recordView}
                  onValueChange={(value) => {
                    if (value === "table" || value === "grid") {
                      setRecordView(value);
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="self-start sm:self-auto"
                >
                  <ToggleGroupItem
                    value="table"
                    aria-label="Show table view"
                    className="gap-2"
                  >
                    <Table2 className="size-4" /> Table
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="grid"
                    aria-label="Show grid view"
                    className="gap-2"
                  >
                    <Grid2x2 className="size-4" /> Grid
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {publicRecords.length === 0
                ? renderPublicRecordEmptyState()
                : recordView === "grid"
                  ? renderPublicRecordGrid()
                  : renderPublicRecordTable()}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="service">
          <section className="overflow-hidden border bg-white shadow">
            <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness className="size-5 text-[#032a0d]" />
                  <h2 className="text-2xl font-semibold text-neutral-950">
                    Services
                  </h2>
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  Branches of service connected to this public member profile.
                </p>
              </div>
              {canManageBranchServices ? (
                <Button
                  type="button"
                  onClick={() => setIsBranchServiceDialogOpen(true)}
                  size="sm"
                  className="self-start bg-[#032a0d] hover:bg-[#043512]"
                >
                  <NotebookPen className="size-4" />
                  {visibleBranchServices.length > 0
                    ? "Edit branches"
                    : "Add branch of service"}
                </Button>
              ) : null}
            </div>
            <div className="p-5">
              {visibleBranchServices.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {visibleBranchServices.map((branch) => (
                    <span
                      key={branch}
                      className="rounded-full border border-[#032a0d]/12 bg-[#032a0d]/5 px-4 py-2 text-sm text-[#032a0d]"
                    >
                      {branch}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-400 shadow-sm">
                    <BriefcaseBusiness className="size-8" />
                  </div>
                  <p className="mt-4 text-xl font-semibold text-neutral-900">
                    No branch of service listed yet.
                  </p>
                  <p className="mt-2 max-w-xl text-sm text-neutral-500">
                    Add service branches such as Humanitarian, Hospital and
                    Care, School, Security, or other ministry areas.
                  </p>
                  {canManageBranchServices ? (
                    <Button
                      type="button"
                      onClick={() => setIsBranchServiceDialogOpen(true)}
                      className="mt-5 bg-[#032a0d] hover:bg-[#043512]"
                    >
                      <NotebookPen className="size-4" /> Add branch of service
                    </Button>
                  ) : null}
                </div>
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="analytics">
          <section className="bg-white">
            <div className="px-5 py-4 border-b">
              <h2 className="text-xl font-semibold text-neutral-950">
                Analytics
              </h2>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="relative min-h-34 overflow-hidden border border-[#032a0d]/10 bg-linear-to-br from-[#063d16] via-[#032a0d] to-[#021d09] px-6 py-5 text-white shadow-sm">
                  <ShieldCheck className="absolute right-5 top-5 size-8 text-emerald-400" />
                  <div className="max-w-72">
                    <p className="text-xs font-medium uppercase text-green-100/80">
                      Verified Signals
                    </p>
                    <p className="mt-3 text-4xl font-semibold tracking-tight">
                      {verifiedSignalCount}
                    </p>
                    <p className="mt-3 text-xs text-green-50/90">
                      Combined trust markers from profile status, verification,
                      training, certificate, and office data.
                    </p>
                  </div>
                </div>

                <div className="relative min-h-34 overflow-hidden border border-emerald-200 bg-linear-to-br from-white via-emerald-50/55 to-white px-6 py-5 shadow-sm">
                  <FileCheck2 className="absolute right-5 top-5 size-8 text-emerald-300" />
                  <div className="max-w-72">
                    <p className="text-xs font-medium uppercase text-emerald-600">
                      Public Records
                    </p>
                    <p className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
                      {publicRecords.length}
                    </p>
                    <p className="mt-3 text-xs text-neutral-700">
                      Published activity, ministry, and community records
                      available on the profile.
                    </p>
                  </div>
                </div>

                <div className="relative min-h-34 overflow-hidden border border-amber-200 bg-linear-to-br from-white via-amber-50/70 to-white px-6 py-5 shadow-sm">
                  <Flag className="absolute right-5 top-5 size-8 text-amber-400" />
                  <div className="max-w-72">
                    <p className="text-xs font-medium uppercase text-neutral-500">
                      Milestones
                    </p>
                    <p className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
                      {recentActivities.length}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      <ArrowRight className="size-3.5" />
                      Timeline-driven profile history
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.95fr)_minmax(320px,1fr)]">
                <div className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
                  <div className="px-5 pt-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <IconCalendarEvent className="size-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-neutral-950">
                          Impact Over Time
                        </p>
                        <p className="text-xs text-neutral-500">
                          A summary of contributions recorded over the years.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-2 pt-1 sm:px-5">
                    <ChartContainer
                      config={{
                        activities: {
                          label: "Activities",
                          color: "#159447",
                        },
                        communityImpact: {
                          label: "Community impact",
                          color: "#8fe3a1",
                        },
                      }}
                      className="h-56 w-full"
                    >
                      <AreaChart
                        data={impactOverTimeData}
                        margin={{ top: 10, right: 28, left: 0, bottom: 6 }}
                      >
                        <defs>
                          <linearGradient
                            id="analyticsImpactFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#8fe3a1"
                              stopOpacity={0.35}
                            />
                            <stop
                              offset="100%"
                              stopColor="#8fe3a1"
                              stopOpacity={0.08}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="year"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          className="text-xs"
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          className="text-xs"
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend
                          verticalAlign="top"
                          align="center"
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ paddingBottom: 15 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="communityImpact"
                          name="Community impact"
                          stroke="#8fe3a1"
                          strokeWidth={2}
                          fill="url(#analyticsImpactFill)"
                          dot={{ r: 4, fill: "#8fe3a1", strokeWidth: 0 }}
                          activeDot={{ r: 5 }}
                        >
                          <LabelList
                            dataKey="communityImpact"
                            position="top"
                            className="fill-neutral-700 text-[11px] font-semibold"
                          />
                        </Area>
                        <Area
                          type="monotone"
                          dataKey="activities"
                          name="Activities"
                          stroke="#159447"
                          strokeWidth={2}
                          fill="transparent"
                          dot={{ r: 4, fill: "#159447", strokeWidth: 0 }}
                          activeDot={{ r: 5 }}
                        >
                          <LabelList
                            dataKey="activities"
                            position="top"
                            className="fill-neutral-700 text-[11px] font-semibold"
                          />
                        </Area>
                      </AreaChart>
                    </ChartContainer>
                    <p className="mt-1 text-xs text-center text-neutral-500">
                      Data is based on recorded activities and verified
                      community impact.
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between px-5 py-4">
                    <p className="text-sm font-semibold text-neutral-950">
                      Top Contributions
                    </p>
                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700"
                    >
                      {topContributionEntries.length || 0} active
                    </Badge>
                  </div>

                  <div className="px-5 pb-5">
                    {topContributionEntries.length > 0 ? (
                      <div className="space-y-3">
                        {topContributionEntries.map((entry, index) => (
                          <div
                            key={entry.label}
                            className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 shadow-sm"
                          >
                            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#032a0d] text-xs font-semibold text-white">
                              {index + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-neutral-900">
                                {entry.label}
                              </p>
                            </div>
                            <p className="text-xs text-neutral-500">
                              {entry.count}{" "}
                              {entry.count === 1 ? "record" : "records"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex min-h-40 flex-col items-center justify-center border border-dashed border-neutral-200 bg-white px-4 py-8 text-center">
                        <p className="text-sm font-semibold text-neutral-900">
                          No contribution data yet.
                        </p>
                        <p className="mt-2 text-xs text-neutral-500">
                          Published public records will appear here once
                          activity entries are added.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
                  <div className="px-5 pt-4">
                    <p className="text-sm font-semibold text-neutral-950">
                      Public profile metrics
                    </p>
                    <p className="text-xs text-neutral-500">
                      Snapshot of the member&apos;s visible records,
                      assignments, and milestones.
                    </p>
                  </div>
                  <div className="px-4 pb-2 pt-5">
                    <ChartContainer
                      config={{
                        value: {
                          label: "Value",
                          color: "#032a0d",
                        },
                      }}
                      className="h-56 w-full"
                    >
                      <BarChart
                        data={analyticsBarData}
                        margin={{ top: 15, right: 0, left: -15, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="analyticsBarGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#0a4a18" />
                            <stop offset="100%" stopColor="#58a36d" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          vertical={false}
                          strokeDasharray="3 3"
                          stroke="#e5e7eb"
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          className="text-xs"
                        />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={10}
                          className="text-xs"
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="value"
                          name="Profile count"
                          radius={[12, 12, 4, 4]}
                          fill="url(#analyticsBarGradient)"
                        >
                          <LabelList
                            dataKey="value"
                            position="top"
                            className="fill-neutral-700 text-[11px] font-semibold"
                          />
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </div>
                </div>

                <div className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
                  <div className="px-5 pt-4">
                    <p className="text-sm font-semibold text-neutral-950">
                      Verification composition
                    </p>
                    <p className="text-xs text-neutral-500">
                      Public trust signals currently visible
                    </p>
                  </div>
                  <div className="grid gap-2 px-4 pb-4 pt-1 sm:grid-cols-[minmax(0,1fr)_minmax(160px,0.8fr)] sm:px-5">
                    <ChartContainer
                      config={{
                        verified: {
                          label: "Verified",
                          color: "#16a34a",
                        },
                        pending: {
                          label: "Pending",
                          color: "#f59e0b",
                        },
                        certificate: {
                          label: "Certificate",
                          color: "#2563eb",
                        },
                        training: {
                          label: "Training",
                          color: "#8b5cf6",
                        },
                        office: {
                          label: "Office",
                          color: "#0f766e",
                        },
                      }}
                      className="h-44 w-full"
                    >
                      <PieChart>
                        <ChartTooltip
                          content={<ChartTooltipContent nameKey="name" />}
                        />
                        <Pie
                          data={analyticsPieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={46}
                          outerRadius={55}
                          paddingAngle={4}
                          cornerRadius={8}
                        >
                          {analyticsPieData.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>

                    <div className="flex flex-col justify-center gap-2 text-xs">
                      {analyticsPieData.map((entry) => {
                        const percentage =
                          verifiedSignalCount > 0
                            ? Math.round(
                                (entry.value / verifiedSignalCount) * 100,
                              )
                            : 0;

                        return (
                          <div
                            key={entry.name}
                            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <span
                                className="size-3 rounded-full"
                                style={{ backgroundColor: entry.fill }}
                              />
                              <span className="truncate text-neutral-700">
                                {entry.name}
                              </span>
                            </div>
                            <span className="font-semibold text-neutral-900">
                              {percentage}% ({entry.value})
                            </span>
                          </div>
                        );
                      })}
                      <div className="mt-1 border-t border-neutral-200 pt-3">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
                          <span className="text-neutral-700">
                            Total signals
                          </span>
                          <span className="font-semibold text-neutral-900">
                            {verifiedSignalCount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="col-span-full text-xs text-center text-neutral-500">
                      Verified signals build public trust and profile
                      credibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>
      </div>
      <Dialog
        open={Boolean(selectedPublicRecord)}
        onOpenChange={(open) => {
          if (!open) setSelectedPublicRecord(null);
        }}
      >
        <DialogContent className="max-h-[90vh] mt-8 max-w-4xl! gap-0 overflow-hidden border-[#032a0d]/15 p-0">
          {selectedPublicRecord ? (
            <>
              <DialogHeader className="border-b px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3 pr-8">
                  <div>
                    <DialogTitle className="text-2xl text-[#032a0d]">
                      {selectedPublicRecord.title}
                    </DialogTitle>
                    <DialogDescription className="mt-2">
                      Full public record details and attachments.
                    </DialogDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                  >
                    {formatEnumLabel(selectedPublicRecord.status)}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="max-h-[calc(90vh-8rem)] overflow-y-auto px-6 py-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border bg-neutral-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Type
                    </p>
                    <p className="mt-2 text-sm font-semibold text-neutral-950">
                      {getPublicRecordTypeLabel(selectedPublicRecord.type)}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-neutral-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Date and time
                    </p>
                    <p className="mt-2 text-sm font-semibold text-neutral-950">
                      {formatDate(selectedPublicRecord.eventAt)},{" "}
                      {new Date(
                        selectedPublicRecord.eventAt,
                      ).toLocaleTimeString("en-PH", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-neutral-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Attachments
                    </p>
                    <p className="mt-2 text-sm font-semibold text-neutral-950">
                      {selectedPublicRecord.attachments.length} images
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-lg border bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Location
                  </p>
                  <p className="mt-2 text-sm text-neutral-800">
                    {selectedPublicRecord.location}
                  </p>
                </div>

                <div className="mt-5 rounded-lg border bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Description
                  </p>
                  <div
                    className="prose prose-sm mt-3 max-w-none text-neutral-700 [&_a]:text-[#032a0d] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeRichTextHtml(
                        selectedPublicRecord.shortDescription,
                      ),
                    }}
                  />
                </div>

                <div className="mt-5">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="size-4 text-[#032a0d]" />
                    <h3 className="font-semibold text-neutral-950">
                      Attachments
                    </h3>
                  </div>
                  {selectedPublicRecord.attachments.length > 0 ? (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {selectedPublicRecord.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
                        >
                          <div className="h-36 bg-neutral-100">
                            <img
                              src={attachment.fileUrl}
                              alt={
                                attachment.fileName ??
                                selectedPublicRecord.title
                              }
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="px-3 py-2">
                            <p className="truncate text-sm font-medium text-neutral-900">
                              {attachment.fileName ??
                                "Public record attachment"}
                            </p>
                            <p className="mt-1 text-xs text-neutral-500">
                              Open attachment
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 rounded-lg border border-dashed bg-neutral-50 p-4 text-sm text-neutral-500">
                      No attachments were added to this public record.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
      <Dialog
        open={isBranchServiceDialogOpen}
        onOpenChange={(open) => {
          setIsBranchServiceDialogOpen(open);
          if (!open) resetBranchServiceDialog();
        }}
      >
        <DialogContent className="max-w-4xl! border-[#032a0d]/15">
          <DialogHeader>
            <DialogTitle className="text-[#032a0d]">
              {visibleBranchServices.length > 0
                ? "Edit branch of service"
                : "Add branch of service"}
            </DialogTitle>
            <DialogDescription>
              Select the ministry or service areas that should appear on this
              public profile.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-2 md:grid-cols-2">
              {BRANCH_SERVICE_OPTIONS.map((service) => {
                const isSelected = selectedBranchServices.includes(service);

                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleBranchService(service)}
                    className={`rounded-full border px-4 py-2 text-left text-base transition ${
                      isSelected
                        ? "border-[#032a0d] bg-[#032a0d] text-white shadow-sm"
                        : "border-neutral-950 bg-white text-neutral-500 hover:border-[#032a0d] hover:text-[#032a0d]"
                    }`}
                    aria-pressed={isSelected}
                  >
                    {service}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="branch-service-other"
                className="text-base font-semibold"
              >
                If Others, please specify (optional)
              </Label>
              <Input
                id="branch-service-other"
                value={branchServiceOther}
                onChange={(event) => setBranchServiceOther(event.target.value)}
                onFocus={() => {
                  if (!selectedBranchServices.includes("Others")) {
                    setSelectedBranchServices((current) => [
                      ...current,
                      "Others",
                    ]);
                  }
                }}
                placeholder="Specify other branch of service"
                className="h-12 text-base"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsBranchServiceDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleUpdateBranchServices()}
              disabled={isSavingBranchServices}
              className="bg-[#032a0d] hover:bg-[#043512]"
            >
              {isSavingBranchServices ? "Saving..." : "Save branches"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isCertificateDialogOpen}
        onOpenChange={(open) => {
          setIsCertificateDialogOpen(open);
          if (!open) resetCertificateDialog();
        }}
      >
        <DialogContent className="max-w-2xl border-[#032a0d]/15">
          <DialogHeader>
            <DialogTitle className="text-[#032a0d]">
              Upload new certificate
            </DialogTitle>
            <DialogDescription>
              Add a certificate to the public profile. The credential ID will be
              generated automatically in the format `CERT-ABC-00001`.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="certificate-title">Title</Label>
              <Input
                id="certificate-title"
                value={certificateTitle}
                onChange={(event) => setCertificateTitle(event.target.value)}
                placeholder="Basic Chaplaincy Training"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate-issued-at">Issued at</Label>
              <Input
                id="certificate-issued-at"
                type="date"
                value={certificateIssuedAt}
                onChange={(event) => setCertificateIssuedAt(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Certificate file</Label>
              <input
                ref={certificateFileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(event) => {
                  handleCertificateFileChange(event.target.files?.[0]);
                  event.currentTarget.value = "";
                }}
              />
              <button
                type="button"
                onClick={openCertificatePicker}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  handleCertificateFileChange(event.dataTransfer.files?.[0]);
                }}
                className="flex min-h-36 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#032a0d]/25 bg-[#032a0d]/3 px-4 py-6 text-center transition hover:bg-[#032a0d]/5"
              >
                <p className="text-sm font-semibold text-neutral-900">
                  {certificateFile
                    ? certificateFile.name
                    : "Upload certificate file"}
                </p>
                <p className="mt-2 text-xs text-neutral-500">
                  Drag and drop an image or PDF here, or click to browse.
                </p>
                {certificateFile ? (
                  <p className="mt-3 text-xs text-neutral-500">
                    {(certificateFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                ) : null}
              </button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCertificateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleCreateCertificate()}
              disabled={isSavingCertificate}
              className="bg-[#032a0d] hover:bg-[#043512]"
            >
              {isSavingCertificate ? "Saving..." : "Save certificate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isPublicRecordDialogOpen}
        onOpenChange={(open) => {
          setIsPublicRecordDialogOpen(open);
          if (!open) resetPublicRecordDialog();
        }}
      >
        <DialogContent className="max-w-5xl! mt-8! gap-0 overflow-hidden border-[#032a0d]/15 p-0">
          <DialogHeader className="border-b px-6 py-5">
            <DialogTitle className="text-[#032a0d]">
              Create public records
            </DialogTitle>
            <DialogDescription>
              Add a documented activity, ministry task, or community service
              entry to this public member profile.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-10rem)]">
            <div className="space-y-2 mb-5">
              <Label htmlFor="public-record-title">Title</Label>
              <Input
                id="public-record-title"
                value={recordTitle}
                onChange={(event) => setRecordTitle(event.target.value)}
                placeholder="Community Outreach Program"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <RichTextEditor
                  value={recordShortDescription}
                  onChange={setRecordShortDescription}
                  placeholder="Describe the public record, ministry task, or community activity..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="public-record-type">Type</Label>
                <Select
                  value={recordType}
                  onValueChange={(value) =>
                    setRecordType(value as MemberPublicRecordType)
                  }
                >
                  <SelectTrigger
                    id="public-record-type"
                    className="h-11 w-full"
                  >
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PUBLIC_RECORD_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="public-record-status">Status</Label>
                <Select
                  value={recordStatus}
                  onValueChange={(value) =>
                    setRecordStatus(value as MemberPublicRecordStatus)
                  }
                >
                  <SelectTrigger
                    id="public-record-status"
                    className="h-11 w-full"
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PUBLIC_RECORD_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="public-record-date">Date</Label>
                <Input
                  id="public-record-date"
                  type="date"
                  value={recordDate}
                  onChange={(event) => setRecordDate(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="public-record-time">Time</Label>
                <Input
                  id="public-record-time"
                  type="time"
                  value={recordTime}
                  onChange={(event) => setRecordTime(event.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="public-record-location">Location</Label>
                <Input
                  id="public-record-location"
                  value={recordLocation}
                  onChange={(event) => setRecordLocation(event.target.value)}
                  placeholder="Dasmarinas City, Cavite"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Attachments</Label>
                <input
                  ref={publicRecordAttachmentInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    handlePublicRecordAttachmentFiles(event.target.files);
                    event.currentTarget.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    publicRecordAttachmentInputRef.current?.click()
                  }
                  onDragOver={(event) => {
                    event.preventDefault();
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    handlePublicRecordAttachmentFiles(event.dataTransfer.files);
                  }}
                  className="flex min-h-36 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#032a0d]/25 bg-[#032a0d]/3 px-4 py-6 text-center transition hover:bg-[#032a0d]/5"
                >
                  <p className="text-sm font-semibold text-neutral-900">
                    {publicRecordAttachments.length > 0
                      ? `${publicRecordAttachments.length} attachment${
                          publicRecordAttachments.length > 1 ? "s" : ""
                        } selected`
                      : "Upload record attachments"}
                  </p>
                  <p className="mt-2 text-xs text-neutral-500">
                    Drag and drop one or more images here, or click to browse.
                  </p>
                  <p className="mt-2 text-xs text-neutral-400">
                    Accepts single or multiple image files, up to 6 attachments.
                  </p>
                </button>

                {publicRecordAttachments.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {publicRecordAttachments.map((file, index) => (
                      <div
                        key={`${file.name}-${file.lastModified}-${index}`}
                        className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
                      >
                        <div className="relative h-28 overflow-hidden bg-neutral-100">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePublicRecordAttachment(index)}
                            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/80"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                        <div className="space-y-1 px-3 py-2">
                          <p className="truncate text-sm font-medium text-neutral-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t bg-background px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPublicRecordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleCreatePublicRecord()}
              disabled={isSavingPublicRecord}
              className="bg-[#032a0d] hover:bg-[#043512]"
            >
              {isSavingPublicRecord ? "Saving..." : "Save public record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
