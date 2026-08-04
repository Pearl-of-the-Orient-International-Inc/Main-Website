import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CircleAlert,
  FileCheck2,
  GraduationCap,
  Hash,
  IdCard,
  UserRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CertificateAuthenticityPreview } from "./CertificateAuthenticityPreview";

type PageProps = {
  params: Promise<{
    verificationToken: string;
  }>;
};

type CredentialDocumentType = "DIPLOMA" | "CERTIFICATE" | "TRANSCRIPT";
type CredentialDocumentStatus = "ACTIVE" | "REVOKED" | "VOID";
type MemberCredentialDocumentType = "CERTIFICATE" | "RECOGNITION";
type MemberCredentialDocumentStatus = "ACTIVE" | "REVOKED";

type CredentialDocument = {
  id: string;
  documentNumber: string;
  barcodeNumber: string | null;
  verificationToken: string;
  type: CredentialDocumentType;
  status: CredentialDocumentStatus;
  title: string | null;
  issuedAt: string;
  revokedAt: string | null;
  application?: {
    studentId: string | null;
    surname: string | null;
    givenName: string | null;
    middleName: string | null;
    programLevel: string | null;
    programCourse: string | null;
    academicYear: string | null;
  };
};

type MemberCredentialDocument = {
  id: string;
  documentNumber: string;
  barcodeNumber: string | null;
  verificationToken: string;
  type: MemberCredentialDocumentType;
  status: MemberCredentialDocumentStatus;
  title: string | null;
  issuedAt: string;
  member?: {
    id: string;
    uniqueId: string | null;
    firstName: string;
    lastName: string;
    user?: {
      email: string;
    };
  };
};

type CredentialVerificationResponse = {
  code: string;
  message: string;
  data: CredentialDocument;
};

type MemberCredentialVerificationResponse = {
  code: string;
  message: string;
  data: MemberCredentialDocument;
};

type VerifiedCredential =
  | {
      kind: "seminary";
      credential: CredentialDocument;
    }
  | {
      kind: "member";
      credential: MemberCredentialDocument;
    };

const apiBaseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_API_BASE_URL_PROD;

const documentTypeLabelMap: Record<CredentialDocumentType, string> = {
  CERTIFICATE: "Certificate",
  DIPLOMA: "Diploma",
  TRANSCRIPT: "Transcript",
};

const memberDocumentTypeLabelMap: Record<MemberCredentialDocumentType, string> = {
  CERTIFICATE: "Certificate",
  RECOGNITION: "Recognition",
};

const programLevelLabelMap: Record<string, string> = {
  BACHELOR: "Bachelor Program",
  CERTIFICATE: "Certificate Program",
  DOCTORATE_WITH_DISSERTATION: "Doctorate Program",
  MASTER_WITH_THESIS: "Masteral Program",
};

async function verifyCredential(
  verificationToken: string,
): Promise<VerifiedCredential | null> {
  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  const seminaryResponse = await fetch(
    `${apiBaseUrl}/seminary/credential-documents/verify/${encodeURIComponent(
      verificationToken,
    )}`,
    { cache: "no-store" },
  );

  if (seminaryResponse.ok) {
    const payload =
      (await seminaryResponse.json()) as CredentialVerificationResponse;
    return { kind: "seminary", credential: payload.data };
  }

  if (seminaryResponse.status !== 404) {
    throw new Error("Failed to verify credential.");
  }

  const memberResponse = await fetch(
    `${apiBaseUrl}/members/credential-documents/verify/${encodeURIComponent(
      verificationToken,
    )}`,
    { cache: "no-store" },
  );

  if (memberResponse.status === 404) return null;

  if (!memberResponse.ok) {
    throw new Error("Failed to verify credential.");
  }

  const payload = (await memberResponse.json()) as MemberCredentialVerificationResponse;
  return { kind: "member", credential: payload.data };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { verificationToken } = await params;
  const credential = await verifyCredential(verificationToken);
  const documentNumber = credential?.credential.documentNumber;

  return {
    title: documentNumber
      ? `${documentNumber} | Credential Verified`
      : "Credential Not Verified",
    description: credential
      ? "Verified Pearl of the Orient credential."
      : "Credential authenticity could not be verified.",
  };
}

export default async function Page({ params }: PageProps) {
  const { verificationToken } = await params;
  const verifiedCredential = await verifyCredential(verificationToken);

  if (!verifiedCredential) {
    return <VerificationFailed />;
  }

  const isMemberCredential = verifiedCredential.kind === "member";
  const credential = verifiedCredential.credential;
  const seminaryCredential = verifiedCredential.kind === "seminary"
    ? verifiedCredential.credential
    : undefined;
  const memberCredential = verifiedCredential.kind === "member"
    ? verifiedCredential.credential
    : undefined;
  const studentName = [
    seminaryCredential?.application?.givenName,
    seminaryCredential?.application?.middleName,
    seminaryCredential?.application?.surname,
  ]
    .filter(Boolean)
    .join(" ");
  const memberName = [
    memberCredential?.member?.firstName,
    memberCredential?.member?.lastName,
  ]
    .filter(Boolean)
    .join(" ");
  const holderName = isMemberCredential ? memberName : studentName;
  const holderLabel = isMemberCredential ? "Member" : "Student";
  const credentialTitle = memberCredential
    ? getMemberCredentialTitle(memberCredential)
    : getCredentialTitle(seminaryCredential!);
  const documentTypeLabel = memberCredential
    ? memberDocumentTypeLabelMap[memberCredential.type]
    : documentTypeLabelMap[seminaryCredential!.type];

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#032a0d]">
      <CredentialHero />

      <section className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
       

        <Card className="rounded-lg border-[#032a0d]/10 bg-white shadow-sm">
          <CardHeader className="gap-4 border-b border-[#032a0d]/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="font-serif tracking-tight text-3xl text-[#032a0d]">
                  {credentialTitle}
                </CardTitle>
                <p className="mt-2 text-sm text-neutral-600">
                  Official verification summary
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <VerificationField
                icon={<Hash className="size-4" />}
                label="Document Number"
                value={credential.documentNumber}
              />
              <VerificationField
                icon={<FileCheck2 className="size-4" />}
                label="Document Type"
                value={documentTypeLabel}
              />
              <VerificationField
                icon={<UserRound className="size-4" />}
                label={holderLabel}
                value={
                  holderName ||
                  `No ${holderLabel.toLowerCase()} name on record`
                }
              />
              {memberCredential ? (
                <VerificationField
                  icon={<IdCard className="size-4" />}
                  label="Member ID"
                  value={memberCredential.member?.uniqueId ?? "N/A"}
                />
              ) : (
                <>
                  <VerificationField
                    icon={<Hash className="size-4" />}
                    label="Student Number"
                    value={seminaryCredential!.application?.studentId ?? "N/A"}
                  />
                  <VerificationField
                    icon={<GraduationCap className="size-4" />}
                    label="Program"
                    value={seminaryCredential!.application?.programCourse ?? "N/A"}
                  />
                </>
              )}
              <VerificationField
                icon={<CalendarDays className="size-4" />}
                label="Issued Date"
                value={formatDate(credential.issuedAt)}
              />
            </div>

            <div className="rounded-lg border border-[#032a0d]/10 bg-[#f7f5ef] p-4">
              <p className="text-sm font-semibold text-[#032a0d]">
                Authenticity Notice
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-700">
                A valid result confirms this credential exists in the seminary
                registry and is currently active. Altered printed copies,
                revoked records, or unmatched QR codes should not be accepted as
                official proof.
              </p>
            </div>
          </CardContent>
        </Card>

        <CertificateAuthenticityPreview
          credential={{
            documentNumber: credential.documentNumber,
            holderLabel,
            holderName:
              holderName ||
              `No ${holderLabel.toLowerCase()} name on record`,
            kind: verifiedCredential.kind,
            issuedAt: credential.issuedAt,
            status: credential.status,
            title: credentialTitle,
          }}
        />
      </section>
    </main>
  );
}

function VerificationFailed() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#032a0d]">
      <CredentialHero />

      <section className="mx-auto flex min-h-[50vh] max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <Card className="w-full rounded-lg border-red-200 bg-white shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="rounded-full bg-red-50 p-4 text-red-700">
              <CircleAlert className="size-9" />
            </div>
            <div>
              <h1 className="font-serif text-4xl text-[#032a0d]">
                Credential Not Verified
              </h1>
              <p className="mt-3 max-w-xl text-neutral-600">
                No active credential matched this verification token.
                Contact the records office if this document should be valid.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function CredentialHero() {
  return (
    <section className="relative mt-10 overflow-hidden bg-[#032a0d] text-white">
      <div className="absolute inset-0">
        <div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-40" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <p className="mb-2 text-xs text-white/70 sm:text-sm">
          <Link href="/">Home</Link>{" "}
          <span className="mx-1 text-white/50 sm:mx-2">/</span>{" "}
          <span className="font-medium text-white">
            Credential Verification
          </span>
        </p>
        <h1 className="font-serif text-3xl font-semibold tracking-wide sm:text-4xl md:text-5xl lg:text-6xl">
          Certificate of Authenticity
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
          Verify diplomas, certificates, chaplaincy credentials, and seminary
          documents issued by Pearl of the Orient through the official
          credential registry.
        </p>
      </div>
    </section>
  );
}

function VerificationField({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#032a0d]/10 bg-white p-4">
      <div className="flex items-center gap-2 text-xs font-medium tracking-tight uppercase text-neutral-500">
        {icon}
        {label}
      </div>
      <div className="mt-2 wrap-break-word tracking-tight text-base font-semibold text-[#032a0d]">
        {value}
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function getCredentialTitle(credential: CredentialDocument) {
  const programLevel = credential.application?.programLevel;

  if (programLevel) {
    return programLevelLabelMap[programLevel] ?? programLevel;
  }

  return credential.title ?? documentTypeLabelMap[credential.type];
}

function getMemberCredentialTitle(credential: MemberCredentialDocument) {
  return credential.title ?? memberDocumentTypeLabelMap[credential.type];
}
