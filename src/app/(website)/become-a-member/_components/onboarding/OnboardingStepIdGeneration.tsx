"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { CheckCircle2, Copy, ExternalLink, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { generateMembershipCertificatePdf } from "@/lib/certificate";
import {
  toApiError,
  useCurrentMemberIdGenerationAssetQuery,
  useCurrentMemberPaymentCheckoutQuery,
  useUpsertCurrentMemberIdGenerationAssetMutation,
  useUploadMemberPaymentDocumentMutation,
} from "@/features/member/member.hooks";
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";

type Props = {
  uniqueId: string;
  onContinueAction: () => Promise<void> | void;
};

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [meta, base64] = dataUrl.split(",");
  const mimeMatch = meta.match(/data:(.*?);base64/);
  const mime = mimeMatch?.[1] ?? "application/octet-stream";
  const binary = atob(base64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], filename, { type: mime });
}

export function OnboardingStepIdGeneration({ uniqueId, onContinueAction }: Props) {
  const { data: currentUser } = useCurrentUserQuery();
  const { data: paymentCheckout } = useCurrentMemberPaymentCheckoutQuery();
  const { data: idGenerationData } = useCurrentMemberIdGenerationAssetQuery();
  const uploadDocumentMutation = useUploadMemberPaymentDocumentMutation();
  const upsertIdGenerationAssetMutation = useUpsertCurrentMemberIdGenerationAssetMutation();

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [profileUrl, setProfileUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [certificateBlob, setCertificateBlob] = useState<Blob | null>(null);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [certificateError, setCertificateError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const memberUniqueId = idGenerationData?.data.uniqueId ?? uniqueId;
  const paymentVerified = Boolean(paymentCheckout?.data);

  const certificateRecipient = useMemo(() => {
    const fallback = "Member";
    const fullName = currentUser?.name?.trim();
    return fullName || fallback;
  }, [currentUser]);
  const qrFileBaseName = useMemo(
    () => buildQrFileBaseNameFromFullName(certificateRecipient, memberUniqueId),
    [certificateRecipient, memberUniqueId],
  );

  const certificateDateParts = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).formatToParts(new Date());
  const certificateDay =
    certificateDateParts.find((part) => part.type === "day")?.value ?? "";
  const certificateMonth =
    certificateDateParts.find((part) => part.type === "month")?.value ?? "";
  const certificateYear =
    certificateDateParts.find((part) => part.type === "year")?.value ?? "";
  const certificateDate = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!memberUniqueId) return;
    setProfileUrl(`${window.location.origin}/profile/${memberUniqueId}`);
  }, [memberUniqueId]);

  useEffect(() => {
    if (!profileUrl) return;
    QRCode.toDataURL(profileUrl, {
      width: 240,
      margin: 2,
      color: { dark: "#032a0d", light: "#ffffff" },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [profileUrl]);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    async function run() {
      if (!paymentVerified || !memberUniqueId) {
        setCertificateLoading(false);
        setCertificateError(null);
        setCertificateUrl(null);
        setCertificateBlob(null);
        return;
      }

      setCertificateLoading(true);
      setCertificateError(null);
      try {
        const blob = await generateMembershipCertificatePdf({
          templateUrl: "/certificates-template/Certificate-of-Membership-2026.pdf",
          recipientName: certificateRecipient,
          issuedDateLabel: certificateDate,
          issuedDay: certificateDay,
          issuedMonth: certificateMonth,
          issuedYear: certificateYear,
          memberId: memberUniqueId,
        });
        objectUrl = window.URL.createObjectURL(blob);
        if (!active) {
          window.URL.revokeObjectURL(objectUrl);
          return;
        }
        setCertificateBlob(blob);
        setCertificateUrl(objectUrl);
      } catch (e) {
        if (active) {
          setCertificateError(
            e instanceof Error
              ? e.message
              : "Failed to generate personalized certificate.",
          );
          setCertificateBlob(null);
          setCertificateUrl(null);
        }
      } finally {
        if (active) setCertificateLoading(false);
      }
    }

    run();

    return () => {
      active = false;
      if (objectUrl) window.URL.revokeObjectURL(objectUrl);
    };
  }, [
    certificateDate,
    certificateDay,
    certificateMonth,
    certificateRecipient,
    certificateYear,
    memberUniqueId,
    paymentVerified,
  ]);

  const handleCopyLink = async () => {
    if (!profileUrl) return;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const handleContinue = async () => {
    if (!paymentVerified) return;
    setError(null);
    setLoading(true);
    try {
      if (!memberUniqueId) {
        throw new Error("Member ID is not available yet.");
      }
      if (!qrDataUrl) {
        throw new Error("QR code is not ready yet.");
      }
      if (!certificateBlob) {
        throw new Error("Certificate is not ready yet.");
      }
      if (!profileUrl) {
        throw new Error("Profile URL is not ready yet.");
      }

      const qrFile = dataUrlToFile(qrDataUrl, `${qrFileBaseName}.png`);
      const certificateFile = new File(
        [certificateBlob],
        `certificate-${memberUniqueId}.pdf`,
        { type: "application/pdf" },
      );

      const uploadedQr = await uploadDocumentMutation.mutateAsync(qrFile);
      const uploadedCertificate =
        await uploadDocumentMutation.mutateAsync(certificateFile);

      const qrCodeUrl = uploadedQr?.ufsUrl || uploadedQr?.url;
      const certificateStoredUrl =
        uploadedCertificate?.ufsUrl || uploadedCertificate?.url;

      if (!qrCodeUrl || !certificateStoredUrl) {
        throw new Error("Failed to upload QR code or certificate.");
      }

      await upsertIdGenerationAssetMutation.mutateAsync({
        profileUrl,
        qrCodeUrl,
        certificateUrl: certificateStoredUrl,
      });

      await Promise.resolve(onContinueAction());
    } catch (e) {
      const apiError = toApiError(e);
      setError(apiError.message ?? (e instanceof Error ? e.message : "Failed to continue"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
      <div className="overflow-hidden border border-black/10 bg-white">
        <div className="bg-[#032a0d] px-5 py-4 text-white">
          <h2 className="text-lg">Member ID / QR and Certificate</h2>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <p className="text-sm text-[#032a0d]/80 sm:text-base">
            Upon payment verification, your member number, QR code, and
            Associate Chaplain certificate are generated in this step.
          </p>

          <section
            className={[
              "rounded border px-4 py-4",
              paymentVerified
                ? "border-emerald-300 bg-emerald-50"
                : "border-blue-300 bg-blue-50",
            ].join(" ")}
          >
            <p className="text-sm font-semibold text-[#032a0d]">
              Payment Verification
            </p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#032a0d]/80">
              <span
                className={[
                  "size-2 rounded-full",
                  paymentVerified ? "bg-emerald-600" : "bg-blue-600",
                ].join(" ")}
              />
              {paymentVerified
                ? "Verified. Certificate and member ID are now available."
                : "Waiting for payment verification."}
            </p>
          </section>

          <section className="rounded border border-black/10 bg-neutral-50 p-4 sm:p-5">
            <h3 className="font-serif text-xl text-[#032a0d]">Member Profile ID</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
              <div className="space-y-3">
                <div className="rounded border border-[#032a0d]/20 bg-white px-4 py-4">
                  <p className="text-xs uppercase tracking-wide text-[#032a0d]/70">
                    Member ID
                  </p>
                  <p className="mt-1 font-serif text-xl font-semibold text-[#032a0d]">
                    {memberUniqueId || "Generating..."}
                  </p>
                </div>

                <div className="rounded border border-[#032a0d]/20 bg-white px-4 py-4">
                  <p className="text-xs uppercase tracking-wide text-[#032a0d]/70">
                    Public Profile URL
                  </p>
                  <p className="mt-1 break-all text-sm text-[#032a0d]/85">
                    {profileUrl || "Generating profile link..."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" size="sm" onClick={handleCopyLink} className="text-xs font-normal">
                      <Copy className="mr-0.5 size-3.5" />
                      {copied ? "Copied" : "Copy link"}
                    </Button>
                    {profileUrl && (
                      <a
                        href={profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 items-center rounded-md border border-[#032a0d]/30 px-3 text-xs text-[#032a0d] hover:bg-[#032a0d]/5"
                      >
                        <ExternalLink className="mr-1.5 size-3.5" />
                        Open profile
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded border border-[#032a0d]/20 bg-white p-3">
                <p className="text-xs uppercase tracking-wide text-[#032a0d]/70">
                  QR Code
                </p>
                {qrDataUrl ? (
                  <div className="mt-2 overflow-hidden rounded border border-[#032a0d]/10 bg-white p-2">
                    <Image
                      src={qrDataUrl}
                      alt="QR code to member profile"
                      width={220}
                      height={220}
                      className="h-auto w-full object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="mt-2 flex h-55 items-center justify-center rounded border border-dashed border-[#032a0d]/20 bg-neutral-50 text-xs text-[#032a0d]/60">
                    Generating QR code...
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded border border-black/10 bg-neutral-50 p-4 sm:p-5">
            <h3 className="font-serif text-xl text-[#032a0d]">
              Certificate of Membership (Associate Chaplain)
            </h3>
            <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="overflow-hidden rounded border border-[#032a0d]/20 bg-white">
                <div className="border-b border-[#032a0d]/10 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-[#032a0d]/70">
                    Certificate Template
                  </p>
                </div>
                <iframe
                  title="Certificate template"
                  src={
                    certificateUrl
                      ? `${certificateUrl}#toolbar=0`
                      : "/certificates-template/Certificate-of-Membership-2026.pdf#toolbar=0"
                  }
                  className="h-100 w-full pointer-events-none select-none"
                  tabIndex={-1}
                />
              </div>

              <div className="space-y-3">
                <div className="rounded border border-[#032a0d]/20 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-[#032a0d]/70">
                    Recipient
                  </p>
                  <p className="mt-1 font-serif text-lg text-[#032a0d]">
                    {certificateRecipient}
                  </p>
                </div>
                <div className="rounded border border-[#032a0d]/20 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-[#032a0d]/70">
                    Date Issued
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#032a0d]">
                    {certificateDate}
                  </p>
                </div>
                <a
                  href={
                    certificateUrl ??
                    "/certificates-template/Certificate-of-Membership-2026.pdf"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  download={certificateUrl ? `Certificate-${memberUniqueId}.pdf` : undefined}
                  className="inline-flex h-9 items-center rounded-md border border-[#032a0d]/30 px-3 text-xs text-[#032a0d] hover:bg-[#032a0d]/5"
                >
                  <ExternalLink className="mr-1.5 size-3.5" />
                  {certificateUrl
                    ? "Download generated certificate"
                    : "Open full certificate template"}
                </a>
                {certificateLoading && (
                  <p className="text-xs text-[#032a0d]/70">
                    Generating personalized certificate...
                  </p>
                )}
                {certificateError && (
                  <p className="text-xs text-red-600">{certificateError}</p>
                )}
              </div>
            </div>
          </section>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500 sm:text-sm">
              Next step after member ID/certificate: Chaplaincy 101 Training.
            </p>
            <Button
              type="button"
              onClick={handleContinue}
              disabled={!paymentVerified || loading}
              className="bg-[#032a0d] hover:bg-[#032a0d]/90"
            >
              {loading ? "Saving..." : "Continue to Chaplaincy 101"}
            </Button>
          </div>
        </div>
      </div>

      <aside className="self-start lg:sticky lg:top-6">
        <div className="overflow-hidden border border-black/10 bg-white">
          <div className="bg-[#032a0d] px-5 py-4 text-white">
            <h2 className="text-lg">ID Checklist</h2>
          </div>
          <div className="space-y-3 p-5 text-sm text-neutral-700">
            <div
              className={[
                "rounded border px-3 py-3",
                paymentVerified
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-blue-300 bg-blue-50",
              ].join(" ")}
            >
              <p className="font-semibold text-[#032a0d]">1. Payment verification</p>
              <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[#032a0d]/75">
                <span
                  className={[
                    "size-2 rounded-full",
                    paymentVerified ? "bg-emerald-600" : "bg-blue-600",
                  ].join(" ")}
                />
                {paymentVerified ? "Verified" : "Waiting for verification"}
              </p>
            </div>
            <div
              className={[
                "rounded border px-3 py-3",
                qrDataUrl ? "border-emerald-300 bg-emerald-50" : "border-black/10 bg-neutral-50",
              ].join(" ")}
            >
              <p className="font-semibold text-[#032a0d]">2. Member ID and QR generated</p>
              <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[#032a0d]/75">
                <span
                  className={[
                    "size-2 rounded-full",
                    qrDataUrl ? "bg-emerald-600" : "bg-neutral-500",
                  ].join(" ")}
                />
                {qrDataUrl ? "Complete" : "Pending"}
              </p>
            </div>
            <div
              className={[
                "rounded border px-3 py-3",
                certificateUrl
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-black/10 bg-neutral-50",
              ].join(" ")}
            >
              <p className="font-semibold text-[#032a0d]">3. Certificate ready</p>
              <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[#032a0d]/75">
                <span
                  className={[
                    "size-2 rounded-full",
                    certificateUrl ? "bg-emerald-600" : "bg-neutral-500",
                  ].join(" ")}
                />
                {certificateUrl ? "Generated" : "Pending"}
              </p>
            </div>
            <div className="flex gap-2 rounded border border-dashed border-[#032a0d]/25 bg-[#032a0d]/5 px-3 py-3 text-xs text-[#032a0d]/80">
              <Info className="mt-0.5 size-4 shrink-0 text-[#032a0d]" />
              <p>
                QR code and certificate are uploaded to records before you can proceed.
              </p>
            </div>
            <div className="flex gap-2 rounded border border-dashed border-[#032a0d]/25 bg-[#032a0d]/5 px-3 py-3 text-xs text-[#032a0d]/80">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#032a0d]" />
              <p>After this step, proceed to Chaplaincy 101 training.</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function buildQrFileBaseNameFromFullName(fullName: string, idNumber: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "Member";
  const lastName = parts.length > 1 ? parts[parts.length - 1] : firstName;

  return [
    sanitizeFileNameSegment(lastName),
    sanitizeFileNameSegment(firstName),
    sanitizeFileNameSegment(idNumber),
  ]
    .filter(Boolean)
    .join("-");
}

function sanitizeFileNameSegment(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
