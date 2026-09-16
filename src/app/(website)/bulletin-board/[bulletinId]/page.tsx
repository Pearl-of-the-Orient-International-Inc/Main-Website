import {
  ArrowLeft,
  CalendarDays,
  Download,
  FileText,
  Megaphone,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import type {
  PublicBulletinEntry,
  PublicBulletinEntryResponse,
} from "@/lib/api-types";

const apiBaseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_API_BASE_URL_PROD;

async function getPublicBulletin(
  bulletinId: string,
): Promise<PublicBulletinEntry | null> {
  if (!apiBaseUrl) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/bulletins/public/${encodeURIComponent(bulletinId)}`,
      { next: { revalidate: 300 } },
    );

    if (!response.ok) return null;

    const payload = (await response.json()) as PublicBulletinEntryResponse;
    return payload.data;
  } catch {
    return null;
  }
}

const stripHtml = (value: string) =>
  value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Manila",
      }).format(new Date(value))
    : "Recently published";

const formatType = (value: PublicBulletinEntry["type"]) =>
  value.charAt(0) + value.slice(1).toLowerCase();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bulletinId: string }>;
}) {
  const { bulletinId } = await params;
  const entry = await getPublicBulletin(bulletinId);

  if (!entry) return { title: "Bulletin Not Found" };

  return {
    title: `${entry.title} | Kapelyan`,
    description: stripHtml(entry.content).slice(0, 160),
  };
}

export default async function BulletinDetailPage({
  params,
}: {
  params: Promise<{ bulletinId: string }>;
}) {
  const { bulletinId } = await params;
  const entry = await getPublicBulletin(bulletinId);

  if (!entry) notFound();

  const plainContent = stripHtml(entry.content);
  const publicationDate = formatDate(entry.publicationDate);
  const issuer =
    entry.issuingOffice ||
    entry.authorName ||
    entry.authorUser?.name ||
    "Pearl of the Orient";

  return (
    <div className="min-h-screen bg-[#f4f6f7]">
      <section className="relative bg-[#032a0d] text-white">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-40" />
        </div>

        <div className="relative mx-auto mt-10 max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <p className="mb-2 text-xs text-white/70 sm:text-sm">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>{" "}
            <span className="mx-1 text-white/50 sm:mx-2">/</span>{" "}
            <Link
              href="/bulletin-board"
              className="transition-colors hover:text-white"
            >
              Kapelyan
            </Link>{" "}
            <span className="mx-1 text-white/50 sm:mx-2">/</span>{" "}
            <span className="font-medium text-white">Bulletin Article</span>
          </p>
          <h1 className="font-serif text-3xl font-semibold tracking-wide sm:text-4xl md:text-5xl lg:text-6xl">
            Kapelyan: The Voice of Chaplaincy
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            Read the full official notice and supporting information from Pearl
            of the Orient.
          </p>
        </div>
      </section>

      <main className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/bulletin-board"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#032a0d] transition hover:opacity-70"
          >
            <ArrowLeft className="size-4" />
            Back to Kapelyan
          </Link>

          <article className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm">
            <header className="relative min-h-[430px] overflow-hidden bg-[#032a0d] sm:min-h-[560px]">
              {/* Administrator-provided images can come from any HTTPS host. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entry.featuredImageUrl || "/main/news.jpg"}
                alt={entry.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/45 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10 lg:p-14">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-white/75">
                  <span className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm">
                    {formatType(entry.type)}
                  </span>
                  <span>{issuer}</span>
                </div>
                <h1 className="mt-4 max-w-5xl font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                  {entry.title}
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
                  {plainContent.slice(0, 220)}
                  {plainContent.length > 220 ? "…" : ""}
                </p>
              </div>
            </header>

            <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:p-14">
              <div>
                <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-black/10 pb-6 text-sm text-neutral-600">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="size-4 text-[#032a0d]" />
                    Published {publicationDate}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <UserRound className="size-4 text-[#032a0d]" />
                    {issuer}
                  </span>
                </div>

                <div
                  className="prose prose-neutral max-w-none leading-8 prose-a:text-[#032a0d] prose-a:underline prose-headings:font-serif prose-headings:text-[#032a0d] prose-li:my-1"
                  dangerouslySetInnerHTML={{ __html: entry.content }}
                />
              </div>

              <aside className="space-y-5">
                <div className="rounded-2xl bg-[#032a0d] p-5 text-white">
                  <Megaphone className="size-6 text-[#d4a948]" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                    Kapelyan
                  </p>
                  <h2 className="mt-1 font-serif text-2xl">
                    The Voice of Chaplaincy
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    Official notices and announcements from Pearl of the Orient.
                  </p>
                </div>

                <div className="rounded-2xl border border-black/10 p-5">
                  <div className="flex items-center gap-2 text-[#032a0d]">
                    <FileText className="size-5" />
                    <h2 className="font-semibold">Attachment</h2>
                  </div>
                  {entry.attachmentUrl ? (
                    <a
                      href={entry.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[#032a0d]/6 p-3 text-sm font-semibold text-[#032a0d] transition hover:bg-[#032a0d]/10"
                    >
                      <span className="min-w-0 truncate">
                        {entry.attachmentFileName || "View document"}
                      </span>
                      <Download className="size-4 shrink-0" />
                    </a>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-neutral-500">
                      No document is attached to this bulletin.
                    </p>
                  )}
                </div>
              </aside>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
