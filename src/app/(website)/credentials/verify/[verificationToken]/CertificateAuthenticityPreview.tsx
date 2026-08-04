"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import { Download, FileCheck2, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CertificateAuthenticityPreviewProps = {
  credential: {
    documentNumber: string;
    holderLabel: string;
    holderName: string;
    kind: "seminary" | "member";
    status: string;
    title: string;
    issuedAt: string;
  };
};

const FIELD_MAX_WIDTH = 285;
const FIELD_FONT_SIZE = 16;
const FIELD_ROW_X = {
  document: 290,
  issued: 237,
  status: 293,
  holder: 253,
  title: 269,
};
const FIELD_ROW_MAX_WIDTH = {
  document: 245,
  issued: FIELD_MAX_WIDTH,
  status: 245,
  holder: FIELD_MAX_WIDTH,
  title: FIELD_MAX_WIDTH,
};
const FIELD_Y = {
  title: 302,
  holder: 279,
  issued: 256,
  status: 234,
  document: 212,
};

export function CertificateAuthenticityPreview({
  credential,
}: CertificateAuthenticityPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  const fields = useMemo(
    () => ({
      document: credential.documentNumber,
      issued: formatDate(credential.issuedAt),
      status: credential.status === "ACTIVE" ? "Verified Authentic" : credential.status,
      holder:
        credential.holderName ||
        `No ${credential.holderLabel.toLowerCase()} name on record`,
      title: credential.title,
    }),
    [credential],
  );

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    async function generateCertificate() {
      setIsGenerating(true);

      try {
        const templateUrl =
          credential.kind === "member" ? "/COA_CHAPLAIN.pdf" : "/COA_SEMINARY.pdf";
        const templateBytes = await fetch(templateUrl).then(
          async (response) => {
            if (!response.ok) {
              throw new Error("Unable to load certificate template.");
            }

            return new Uint8Array(await response.arrayBuffer());
          },
        );
        const pdfDoc = await PDFDocument.load(templateBytes);
        const serifBoldItalic = await pdfDoc.embedFont(
          StandardFonts.TimesRomanBold,
        );
        const page = pdfDoc.getPages()[0];
        const color = rgb(0.03, 0.32, 0.11);

        drawFitText({
          color,
          font: serifBoldItalic,
          maxWidth: FIELD_ROW_MAX_WIDTH.title,
          page,
          size: FIELD_FONT_SIZE,
          text: fields.title.toUpperCase(),
          x: FIELD_ROW_X.title,
          y: FIELD_Y.title,
        });
        drawFitText({
          color,
          font: serifBoldItalic,
          maxWidth: FIELD_ROW_MAX_WIDTH.holder,
          page,
          size: FIELD_FONT_SIZE,
          text: fields.holder.toUpperCase(),
          x: FIELD_ROW_X.holder,
          y: FIELD_Y.holder,
        });
        drawFitText({
          color,
          font: serifBoldItalic,
          maxWidth: FIELD_ROW_MAX_WIDTH.issued,
          page,
          size: FIELD_FONT_SIZE,
          text: fields.issued.toUpperCase(),
          x: FIELD_ROW_X.issued,
          y: FIELD_Y.issued,
        });
        drawFitText({
          color,
          font: serifBoldItalic,
          maxWidth: FIELD_ROW_MAX_WIDTH.status,
          page,
          size: FIELD_FONT_SIZE,
          text: fields.status.toUpperCase(),
          x: FIELD_ROW_X.status,
          y: FIELD_Y.status,
        });
        drawFitText({
          color,
          font: serifBoldItalic,
          maxWidth: FIELD_ROW_MAX_WIDTH.document,
          page,
          size: FIELD_FONT_SIZE,
          text: fields.document.toUpperCase(),
          x: FIELD_ROW_X.document,
          y: FIELD_Y.document,
        });

        const bytes = await pdfDoc.save();
        objectUrl = URL.createObjectURL(
          new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
        );

        if (!active) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setPdfUrl(objectUrl);
      } finally {
        if (active) setIsGenerating(false);
      }
    }

    void generateCertificate();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [credential.kind, fields]);

  return (
    <Card className="rounded-lg border-[#032a0d]/10 bg-white shadow-sm">
      <CardHeader className="gap-3 border-b border-[#032a0d]/10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 font-serif text-3xl text-[#032a0d]">
            <FileCheck2 className="size-6" />
            Certificate of Authenticity
          </CardTitle>
          <p className="mt-2 text-sm text-neutral-600">
            Filled from verified credential registry data.
          </p>
        </div>

        <Button asChild disabled={!pdfUrl}>
          <a
            href={pdfUrl ?? undefined}
            download={`${sanitizeFileName(fields.document)}-coa.pdf`}
          >
            <Download className="size-4" />
            Download COA
          </a>
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden rounded-lg border border-[#032a0d]/10 bg-[#f7f5ef]">
          {isGenerating ? (
            <div className="flex min-h-96 items-center justify-center gap-2 text-sm text-neutral-600">
              <LoaderCircle className="size-4 animate-spin" />
              Preparing certificate...
            </div>
          ) : pdfUrl ? (
            <iframe
              className="h-[89vh] w-full bg-white rounded-lg"
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              title="Certificate of authenticity preview"
            />
          ) : (
            <div className="flex min-h-96 items-center justify-center text-sm text-neutral-600">
              Certificate preview unavailable.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function drawFitText({
  color,
  font,
  maxWidth,
  page,
  size,
  text,
  x,
  y,
}: {
  color: ReturnType<typeof rgb>;
  font: PDFFont;
  maxWidth: number;
  page: PDFPage;
  size: number;
  text: string;
  x: number;
  y: number;
}) {
  let nextSize = size;

  while (nextSize > 8 && font.widthOfTextAtSize(text, nextSize) > maxWidth) {
    nextSize -= 0.5;
  }

  page.drawText(text, {
    x,
    y,
    size: nextSize,
    font,
    color,
  });
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function sanitizeFileName(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
