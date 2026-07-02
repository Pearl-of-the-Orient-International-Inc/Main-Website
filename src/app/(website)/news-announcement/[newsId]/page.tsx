import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  FileText,
  Handshake,
  MapPin,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";
import { NewsDetailActions } from "./NewsDetailActions";
import type { PublicNewsBlog, PublicNewsBlogResponse } from "@/lib/api-types";

const apiBaseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_API_BASE_URL_PROD;

async function getPublicNewsBlog(
  newsId: string,
): Promise<PublicNewsBlog | null> {
  if (!apiBaseUrl) {
    return null;
  }

  try {
    const response = await fetch(
      `${apiBaseUrl}/news-blogs/public/${encodeURIComponent(newsId)}`,
      {
        next: { revalidate: 300 },
      },
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as PublicNewsBlogResponse;
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

const formatDate = (value: string | null | undefined) => {
  if (!value) return "Recently published";

  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Manila",
  }).format(new Date(value));
};

const formatFileSizeLabel = () => "Public attachment";

const getPrimaryMediaUrl = (item: PublicNewsBlog) =>
  item.media.find((media) => media.kind === "IMAGE")?.fileUrl ??
  "/main/news.jpg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ newsId: string }>;
}) {
  const { newsId } = await params;
  const item = await getPublicNewsBlog(newsId);

  if (!item) {
    return {
      title: "Announcement Not Found",
    };
  }

  return {
    title: `${item.title} | News Announcement`,
    description: stripHtml(item.caption).slice(0, 160),
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ newsId: string }>;
}) {
  const { newsId } = await params;
  const item = await getPublicNewsBlog(newsId);

  if (!item) {
    notFound();
  }

  const publishedDate = formatDate(item.publishedAt ?? item.createdAt);
  const primaryMediaUrl = getPrimaryMediaUrl(item);
  const attachments = item.media.filter((media) => media.fileUrl !== primaryMediaUrl);
  const expectItems = [
    {
      title: "Official Update",
      description: "Published by organization administrators",
      icon: Sparkles,
    },
    {
      title: "Community Notice",
      description: "Information for members and partners",
      icon: Users,
    },
    {
      title: "Shared Mission",
      description: "News connected to public chaplaincy service",
      icon: Handshake,
    },
    {
      title: "Spiritual Service",
      description: "Updates for ministry and formation",
      icon: Tag,
    },
  ];

  return (
    <main className="min-h-screen bg-white py-6">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link
            href="/news-announcement"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 transition hover:text-[#032a0d]"
          >
            <ArrowLeft className="size-4" />
            Back to all announcements
          </Link>
          <NewsDetailActions title={item.title} />
        </div>

        <section className="overflow-hidden rounded-xl border border-neutral-200 bg-[#032a0d] shadow-sm">
          <div className="relative min-h-[22rem] overflow-hidden sm:min-h-[27rem]">
            <Image
              src={primaryMediaUrl}
              alt={item.title}
              fill
              priority
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#032a0d]/92 via-[#032a0d]/60 to-[#032a0d]/20" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-2xl px-5 py-8 text-white sm:px-8">
                <div className="inline-flex rounded border border-[#d4a948]/60 bg-[#032a0d]/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#f1d28f]">
                  Important Announcement
                </div>
                <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                  {item.title}
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/86">
                  {stripHtml(item.caption).slice(0, 170)}
                  {stripHtml(item.caption).length > 170 ? "..." : ""}
                </p>
                <div className="mt-5 space-y-2 text-sm text-white/90">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-[#d4a948]" />
                    {publishedDate}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4 text-[#d4a948]" />
                    Pearl of the Orient Official Announcement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <p className="mt-5 flex items-center gap-2 text-sm text-neutral-600">
          <CalendarDays className="size-4" />
          Posted on {publishedDate}
        </p>

        <article
          className="prose prose-neutral mt-5 max-w-none text-sm leading-relaxed prose-a:text-[#032a0d] prose-a:underline prose-headings:font-serif prose-headings:text-[#032a0d]"
          dangerouslySetInnerHTML={{ __html: item.caption }}
        />

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="size-5 text-[#032a0d]" />
            <h2 className="font-semibold text-neutral-950">What to Expect</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {expectItems.map((expectItem) => {
              const Icon = expectItem.icon;

              return (
                <div
                  key={expectItem.title}
                  className="rounded-lg border border-neutral-200 bg-white p-5 text-center shadow-sm"
                >
                  <Icon className="mx-auto size-8 text-[#032a0d]" />
                  <h3 className="mt-3 text-sm font-semibold text-neutral-950">
                    {expectItem.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-600">
                    {expectItem.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="size-5 text-[#032a0d]" />
            <h2 className="font-semibold text-neutral-950">Event Details</h2>
          </div>
          <div className="grid gap-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm sm:grid-cols-2">
            <div className="flex gap-3">
              <CalendarDays className="mt-1 size-5 text-[#032a0d]" />
              <div>
                <p className="text-sm font-semibold">Date</p>
                <p className="text-sm text-neutral-600">{publishedDate}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Tag className="mt-1 size-5 text-[#032a0d]" />
              <div>
                <p className="text-sm font-semibold">Category</p>
                <p className="text-sm text-neutral-600">Announcement</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-1 size-5 text-[#032a0d]" />
              <div>
                <p className="text-sm font-semibold">Venue</p>
                <p className="text-sm text-neutral-600">
                  Pearl of the Orient public channel
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Users className="mt-1 size-5 text-[#032a0d]" />
              <div>
                <p className="text-sm font-semibold">Audience</p>
                <p className="text-sm text-neutral-600">
                  Members, chaplains, partners, and communities
                </p>
              </div>
            </div>
          </div>
        </section>

        {item.hashtags.length > 0 ? (
          <section className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <Tag className="size-5 text-[#032a0d]" />
              <h2 className="font-semibold text-neutral-950">Tags</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#032a0d]/15 bg-[#032a0d]/5 px-3 py-1 text-sm text-[#032a0d]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="size-5 text-[#032a0d]" />
            <h2 className="font-semibold text-neutral-950">
              Attached Documents
            </h2>
          </div>
          {attachments.length > 0 ? (
            <div className="space-y-3">
              {attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm transition hover:border-[#032a0d]/25"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded bg-[#032a0d]/8 text-[#032a0d]">
                      <FileText className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-neutral-950">
                        {attachment.fileName}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {formatFileSizeLabel()}
                      </p>
                    </div>
                  </div>
                  <Download className="size-4 shrink-0 text-neutral-500" />
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-5 py-6 text-sm text-neutral-600">
              No attached documents for this announcement.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
