"use client";

import {
  ArrowRight,
  CalendarDays,
  Download,
  FileText,
  Megaphone,
} from "lucide-react";
import Link from "next/link";

import type { PublicBulletinEntry } from "@/lib/api-types";

const fallbackImage = "/main/news.jpg";

const stripHtml = (value: string) =>
  value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "Asia/Manila",
      }).format(new Date(value))
    : "Recently published";

const formatType = (value: PublicBulletinEntry["type"]) =>
  value.charAt(0) + value.slice(1).toLowerCase();

function BulletinImage({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className: string;
}) {
  return (
    // A native image allows administrator-provided URLs from any HTTPS host.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || fallbackImage}
      alt={alt}
      className={className}
      onError={(event) => {
        if (event.currentTarget.src.endsWith(fallbackImage)) return;
        event.currentTarget.src = fallbackImage;
      }}
    />
  );
}

export function BulletinBoardView({
  entries,
}: {
  entries: PublicBulletinEntry[];
}) {
  const featured = entries[0] ?? null;

  if (!featured) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-dashed border-[#032a0d]/20 bg-[#f5f7f5] px-6 py-20 text-center">
          <Megaphone className="mx-auto size-10 text-[#032a0d]/35" />
          <h2 className="mt-4 font-serif text-3xl text-[#032a0d]">
            No published bulletins yet
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#032a0d]/65">
            Official notices will appear here after an administrator publishes
            them.
          </p>
        </div>
      </section>
    );
  }

  const featuredContent = stripHtml(featured.content);
  const issuer =
    featured.issuingOffice ||
    featured.authorName ||
    featured.authorUser?.name ||
    "Pearl of the Orient";

  return (
    <section className="bg-[#f4f6f7] py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,2.2fr)_minmax(360px,0.95fr)]">
          <article className="relative min-h-[800px] overflow-hidden rounded-[28px] bg-[#032a0d]">
            <BulletinImage
              src={featured.featuredImageUrl}
              alt={featured.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/15 to-black/5" />

            <div className="absolute inset-x-4 bottom-4 rounded-[24px] border border-white/15 bg-black/55 p-5 text-white shadow-2xl backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-7 lg:p-9">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/75">
                <span className="rounded-full bg-white/15 px-3 py-1">
                  {formatType(featured.type)}
                </span>
                <span>{issuer}</span>
              </div>
              <Link href={`/bulletin-board/${featured.id}`}>
                <h2 className="max-w-5xl font-serif text-3xl font-semibold leading-tight transition hover:text-white/80 sm:text-4xl lg:text-5xl">
                  {featured.title}
                </h2>
              </Link>
              <p className="mt-4 line-clamp-3 max-w-5xl text-sm leading-7 text-white/85 sm:text-base lg:text-lg">
                {featuredContent}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/65">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4" />
                  Posted {formatDate(featured.publicationDate)}
                </span>
                <Link
                  href={`/bulletin-board/${featured.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-[#032a0d] transition hover:bg-white/90"
                >
                  Read full bulletin
                  <ArrowRight className="size-4" />
                </Link>
                {featured.attachmentUrl ? (
                  <a
                    href={featured.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-[#032a0d] transition hover:bg-white/90"
                  >
                    <Download className="size-4" />
                    View attachment
                  </a>
                ) : null}
              </div>
            </div>
          </article>

          <aside className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm">
            <div className="flex items-center justify-between bg-[#032a0d] px-6 py-5 text-white">
              <h2 className="font-serif text-xl font-semibold">Latest</h2>
              <span className="text-xs font-semibold text-white/55">
                Click to read
              </span>
            </div>
            <div className="max-h-[620px] divide-y divide-black/5 overflow-y-auto xl:max-h-[690px]">
              {entries.map((entry) => {
                return (
                  <Link
                    key={entry.id}
                    href={`/bulletin-board/${entry.id}`}
                    className="group flex w-full gap-4 p-5 text-left transition hover:bg-neutral-50 sm:p-6"
                  >
                    <div className="h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#032a0d]/8">
                      <BulletinImage
                        src={entry.featuredImageUrl}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#032a0d]/55">
                        <FileText className="size-3.5" />
                        {formatType(entry.type)}
                      </div>
                      <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-neutral-950 sm:text-lg">
                        {entry.title}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-600">
                        Posted {formatDate(entry.publicationDate)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
