import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import {
  buildLocation,
  buildRecentActivities,
  formatDate,
  formatEnumLabel,
  requirementLabels,
  type PublicMember,
} from "./public-member-profile.shared";

type PdfContext = {
  doc: PDFDocument;
  page: PDFPage;
  regularFont: PDFFont;
  boldFont: PDFFont;
  width: number;
  height: number;
  margin: number;
  y: number;
};

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const BLACK = rgb(0, 0, 0);
const LIGHT_GRAY = rgb(0.82, 0.82, 0.82);
const FONT_SIZE = 10;
const LINE_HEIGHT = 14;

const valueOrDash = (value: string | number | null | undefined) => {
  if (value === 0) return "0";
  const text = String(value ?? "").trim();
  return text || "Not publicly listed";
};

const sanitizeFilename = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

const splitEducationEntries = (value: string | null | undefined) =>
  (value ?? "")
    .split(" | ")
    .map((entry) => entry.trim())
    .filter(Boolean);

const stripHtml = (value: string) =>
  value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const wrapText = (
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
) => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [""];

  const words = normalized.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      lines.push(word);
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
};

const addPage = (ctx: PdfContext) => {
  ctx.page = ctx.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  ctx.width = ctx.page.getWidth();
  ctx.height = ctx.page.getHeight();
  ctx.y = ctx.height - ctx.margin;
};

const ensureSpace = (ctx: PdfContext, neededHeight: number) => {
  if (ctx.y - neededHeight < ctx.margin) {
    addPage(ctx);
  }
};

const drawText = (
  ctx: PdfContext,
  text: string,
  options: {
    font?: PDFFont;
    size?: number;
    x?: number;
    lineHeight?: number;
    maxWidth?: number;
  } = {},
) => {
  const font = options.font ?? ctx.regularFont;
  const size = options.size ?? FONT_SIZE;
  const x = options.x ?? ctx.margin;
  const lineHeight = options.lineHeight ?? LINE_HEIGHT;
  const maxWidth = options.maxWidth ?? ctx.width - ctx.margin * 2;
  const lines = wrapText(text, font, size, maxWidth);

  ensureSpace(ctx, lines.length * lineHeight);

  for (const line of lines) {
    ctx.page.drawText(line, {
      x,
      y: ctx.y,
      size,
      font,
      color: BLACK,
    });
    ctx.y -= lineHeight;
  }
};

const drawSectionTitle = (ctx: PdfContext, title: string) => {
  ensureSpace(ctx, 32);
  ctx.y -= 8;
  ctx.page.drawLine({
    start: { x: ctx.margin, y: ctx.y },
    end: { x: ctx.width - ctx.margin, y: ctx.y },
    thickness: 0.75,
    color: LIGHT_GRAY,
  });
  ctx.y -= 18;
  drawText(ctx, title.toUpperCase(), {
    font: ctx.boldFont,
    size: 11,
    lineHeight: 15,
  });
};

const drawKeyValues = (
  ctx: PdfContext,
  rows: Array<[string, string | number | null | undefined]>,
) => {
  const labelWidth = 145;
  const valueX = ctx.margin + labelWidth;
  const valueWidth = ctx.width - ctx.margin * 2 - labelWidth;

  for (const [label, value] of rows) {
    const valueLines = wrapText(valueOrDash(value), ctx.regularFont, FONT_SIZE, valueWidth);
    const rowHeight = Math.max(LINE_HEIGHT, valueLines.length * LINE_HEIGHT);
    ensureSpace(ctx, rowHeight + 2);

    ctx.page.drawText(label, {
      x: ctx.margin,
      y: ctx.y,
      size: FONT_SIZE,
      font: ctx.boldFont,
      color: BLACK,
    });

    for (const line of valueLines) {
      ctx.page.drawText(line, {
        x: valueX,
        y: ctx.y,
        size: FONT_SIZE,
        font: ctx.regularFont,
        color: BLACK,
      });
      ctx.y -= LINE_HEIGHT;
    }

    if (valueLines.length === 0) ctx.y -= LINE_HEIGHT;
    ctx.y -= 2;
  }
};

const drawBullets = (ctx: PdfContext, items: string[]) => {
  if (items.length === 0) {
    drawText(ctx, "No public entries listed.");
    return;
  }

  for (const item of items) {
    const x = ctx.margin + 14;
    const lines = wrapText(item, ctx.regularFont, FONT_SIZE, ctx.width - ctx.margin * 2 - 18);
    ensureSpace(ctx, lines.length * LINE_HEIGHT + 2);
    ctx.page.drawText("•", {
      x: ctx.margin,
      y: ctx.y,
      size: FONT_SIZE,
      font: ctx.regularFont,
      color: BLACK,
    });

    for (const line of lines) {
      ctx.page.drawText(line, {
        x,
        y: ctx.y,
        size: FONT_SIZE,
        font: ctx.regularFont,
        color: BLACK,
      });
      ctx.y -= LINE_HEIGHT;
    }
    ctx.y -= 2;
  }
};

const drawTable = (
  ctx: PdfContext,
  headers: string[],
  rows: string[][],
  columnWidths: number[],
) => {
  if (rows.length === 0) {
    drawText(ctx, "No public entries listed.");
    return;
  }

  const drawHeader = () => {
    ensureSpace(ctx, 24);
    let x = ctx.margin;
    for (let index = 0; index < headers.length; index += 1) {
      ctx.page.drawText(headers[index], {
        x,
        y: ctx.y,
        size: 9,
        font: ctx.boldFont,
        color: BLACK,
      });
      x += columnWidths[index];
    }
    ctx.y -= 8;
    ctx.page.drawLine({
      start: { x: ctx.margin, y: ctx.y },
      end: { x: ctx.width - ctx.margin, y: ctx.y },
      thickness: 0.5,
      color: BLACK,
    });
    ctx.y -= 12;
  };

  drawHeader();

  for (const row of rows) {
    const wrappedCells = row.map((cell, index) =>
      wrapText(valueOrDash(cell), ctx.regularFont, 9, columnWidths[index] - 8),
    );
    const rowHeight =
      Math.max(...wrappedCells.map((cellLines) => cellLines.length)) * 12 + 8;

    if (ctx.y - rowHeight < ctx.margin) {
      addPage(ctx);
      drawHeader();
    }

    const startY = ctx.y;
    let x = ctx.margin;
    for (let cellIndex = 0; cellIndex < wrappedCells.length; cellIndex += 1) {
      let cellY = startY;
      for (const line of wrappedCells[cellIndex]) {
        ctx.page.drawText(line, {
          x,
          y: cellY,
          size: 9,
          font: ctx.regularFont,
          color: BLACK,
        });
        cellY -= 12;
      }
      x += columnWidths[cellIndex];
    }
    ctx.y -= rowHeight;
  }
};

export async function downloadPublicProfilePdf({
  member,
  fullName,
  publicProfileUrl,
}: {
  member: PublicMember;
  fullName: string;
  publicProfileUrl: string;
}) {
  const doc = await PDFDocument.create();
  const regularFont = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const firstPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const ctx: PdfContext = {
    doc,
    page: firstPage,
    regularFont,
    boldFont,
    width: firstPage.getWidth(),
    height: firstPage.getHeight(),
    margin: 48,
    y: firstPage.getHeight() - 48,
  };

  const location = buildLocation(member);
  const certificateUrl = member.idGenerationAsset?.certificateUrl ?? null;
  const recentActivities = buildRecentActivities(member, certificateUrl);
  const serviceBranches = [
    ...member.preferredBranches.map((branch) => branch.title),
    ...(member.preferredBranchOther ?? "")
      .split(/[,|]/)
      .map((branch) => branch.trim())
      .filter(Boolean),
  ].filter((branch, index, list) => list.indexOf(branch) === index);

  drawText(ctx, "PEARL OF THE ORIENT", {
    font: boldFont,
    size: 16,
    lineHeight: 20,
  });
  drawText(ctx, "Public Member Profile", {
    font: boldFont,
    size: 14,
    lineHeight: 18,
  });
  drawText(ctx, `Generated ${formatDate(new Date().toISOString())}`, {
    size: 9,
    lineHeight: 12,
  });
  drawText(ctx, publicProfileUrl, { size: 9, lineHeight: 12 });

  drawSectionTitle(ctx, "Identity");
  drawKeyValues(ctx, [
    ["Full name", fullName],
    ["Member ID", member.uniqueId],
    ["Badge number", member.badgeNumber],
    ["Membership type", formatEnumLabel(member.memberType)],
    ["Status", formatEnumLabel(member.status)],
    ["Account status", formatEnumLabel(member.user.accountStatus)],
    ["Active member", member.isActive ? "Yes" : "No"],
    ["Email verified", member.user.isEmailVerified ? "Yes" : "No"],
    ["Location", location],
    ["Member since", formatDate(member.createdAt)],
    ["Last updated", formatDate(member.updatedAt)],
  ]);

  drawSectionTitle(ctx, "Church / Organization");
  drawKeyValues(ctx, [
    ["Affiliation", member.churchAffiliation],
    ["Address", member.churchAddress],
    [
      "Current position / role",
      member.currentPositionRoleOther ?? member.currentPositionRole,
    ],
  ]);

  drawSectionTitle(ctx, "Education");
  drawKeyValues(ctx, [
    ["Elementary school", member.elementarySchool],
    ["Secondary school", member.secondarySchool],
  ]);
  drawText(ctx, "Tertiary / College", { font: boldFont });
  drawBullets(ctx, splitEducationEntries(member.tertiaryCollege));
  drawText(ctx, "Post-graduate studies", { font: boldFont });
  drawBullets(ctx, splitEducationEntries(member.postGraduateStudies));

  drawSectionTitle(ctx, "Service Branches");
  drawBullets(ctx, serviceBranches);

  drawSectionTitle(ctx, "Office Assignments");
  drawTable(
    ctx,
    ["Office", "Level", "Area", "Start date"],
    member.officerAssignments.map((assignment) => [
      assignment.officeTitle.name,
      formatEnumLabel(assignment.officeTitle.level),
      [
        assignment.department,
        assignment.barangay,
        assignment.cityMunicipality,
        assignment.province,
        assignment.region,
      ]
        .filter(Boolean)
        .join(", "),
      formatDate(assignment.startDate),
    ]),
    [150, 90, 190, 70],
  );

  drawSectionTitle(ctx, "Onboarding and Training");
  drawKeyValues(ctx, [
    [
      "Current onboarding step",
      member.onboardingProgress
        ? formatEnumLabel(member.onboardingProgress.currentStep)
        : null,
    ],
    [
      "Pre-orientation completed",
      formatDate(member.onboardingProgress?.preOrientationCompletedAt),
    ],
    [
      "Chaplaincy training completed",
      formatDate(member.chaplaincyTrainingProgress?.completedAt),
    ],
  ]);

  drawSectionTitle(ctx, "Certificates");
  const certificateRows = [
    ...(member.idGenerationAsset?.certificateUrl
      ? [
          [
            "Official generated certificate",
            "System generated",
            formatDate(member.idGenerationAsset.generatedAt),
          ],
        ]
      : []),
    ...member.certificates.map((certificate) => [
      certificate.title,
      certificate.credentialId,
      formatDate(certificate.dateReceived),
    ]),
  ];
  drawTable(ctx, ["Title", "Credential ID", "Date"], certificateRows, [245, 145, 110]);

  drawSectionTitle(ctx, "Approved Public Documents");
  drawTable(
    ctx,
    ["Document", "File name", "Updated"],
    member.applicantRequirements.map((requirement) => [
      requirementLabels[requirement.type] ?? formatEnumLabel(requirement.type),
      requirement.fileName ?? "Published file",
      formatDate(requirement.updatedAt),
    ]),
    [190, 210, 100],
  );

  drawSectionTitle(ctx, "Public Records");
  drawTable(
    ctx,
    ["Title", "Type", "Date", "Location"],
    member.publicRecords.map((record) => [
      `${record.title}: ${stripHtml(record.shortDescription)}`,
      formatEnumLabel(record.type),
      formatDate(record.eventAt),
      record.location,
    ]),
    [210, 115, 85, 90],
  );

  drawSectionTitle(ctx, "Recent Timeline");
  drawBullets(
    ctx,
    recentActivities.map(
      (activity) =>
        `${formatDate(activity.date)} - ${activity.title}. ${activity.description}`,
    ),
  );

  const pageCount = doc.getPageCount();
  doc.getPages().forEach((page, index) => {
    page.drawText(`Page ${index + 1} of ${pageCount}`, {
      x: PAGE_WIDTH - 105,
      y: 24,
      size: 8,
      font: regularFont,
      color: BLACK,
    });
  });

  const pdfBytes = await doc.save();
  const pdfArrayBuffer = new ArrayBuffer(pdfBytes.byteLength);
  new Uint8Array(pdfArrayBuffer).set(pdfBytes);
  const blob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${sanitizeFilename(fullName) || "public-profile"}-public-profile.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
