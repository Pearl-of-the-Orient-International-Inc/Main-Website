import { PDFDocument, type PDFPage, type PDFFont, StandardFonts, rgb } from "pdf-lib";

type MembershipCertificateInput = {
  templateUrl: string;
  recipientName: string;
  issuedDateLabel: string;
  issuedDay?: string;
  issuedMonth?: string;
  issuedYear?: string;
  memberId?: string;
};

function toOrdinal(day: string): string {
  const n = Number(day);
  if (!Number.isFinite(n) || n <= 0) return day;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  const mod10 = n % 10;
  if (mod10 === 1) return `${n}st`;
  if (mod10 === 2) return `${n}nd`;
  if (mod10 === 3) return `${n}rd`;
  return `${n}th`;
}

function drawCenteredText(params: {
  page: PDFPage;
  text: string;
  y: number;
  size: number;
  color?: ReturnType<typeof rgb>;
  font: PDFFont;
}) {
  const { page, text, y, size, color = rgb(0, 0.23, 0.13) } = params;
  const pageWidth = page.getWidth();
  const textWidth = params.font.widthOfTextAtSize(text, size);
  const x = (pageWidth - textWidth) / 2;
  page.drawText(text, { x, y, size, font: params.font, color });
}

function drawCenteredInRange(params: {
  page: PDFPage;
  text: string;
  y: number;
  minX: number;
  maxX: number;
  size: number;
  font: PDFFont;
  color?: ReturnType<typeof rgb>;
}) {
  const { page, text, y, minX, maxX, size, font, color = rgb(0.1, 0.1, 0.1) } =
    params;
  const textWidth = font.widthOfTextAtSize(text, size);
  const x = minX + (maxX - minX - textWidth) / 2;
  page.drawText(text, { x, y, size, font, color });
}

export async function generateMembershipCertificatePdf({
  templateUrl,
  recipientName,
  issuedDateLabel,
  issuedDay,
  issuedMonth,
  issuedYear,
  memberId,
}: MembershipCertificateInput): Promise<Blob> {
  const templateBytes = await fetch(templateUrl).then(async (res) => {
    if (!res.ok) {
      throw new Error("Failed to load certificate template.");
    }
    return new Uint8Array(await res.arrayBuffer());
  });

  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPages()[0];
  const serifBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const serif = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const width = page.getWidth();
  const height = page.getHeight();
  const nameLineY = 270;
  const nameFontSize = 20;

  drawCenteredText({
    page,
    text: recipientName.toUpperCase(),
    y: nameLineY + 10,
    size: nameFontSize,
    font: serifBold,
  });

  const dayText = issuedDay ? toOrdinal(issuedDay) : issuedDateLabel;
  const monthText = issuedMonth ?? "";
  const yearText = issuedYear ?? "";
  const dateY = 165;

  drawCenteredInRange({
    page,
    text: dayText,
    y: dateY,
    minX: 218,
    maxX: 380,
    size: 13,
    font: serif,
  });
  drawCenteredInRange({
    page,
    text: monthText,
    y: dateY,
    minX: 270,
    maxX: 505,
    size: 13,
    font: serif,
  });
  drawCenteredInRange({
    page,
    text: yearText,
    y: dateY,
    minX: 380,
    maxX: 723,
    size: 13,
    font: serif,
  });

  if (memberId) {
    page.drawText(`Member ID: ${memberId}`, {
      x: width * 0.72,
      y: height * 0.06,
      size: 9,
      font: serif,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  const modified = await pdfDoc.save();
  const bytes = new Uint8Array(modified);
  return new Blob([bytes], { type: "application/pdf" });
}
