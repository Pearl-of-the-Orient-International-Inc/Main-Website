"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CalendarDays, Grid2X2, List, Newspaper, Tag } from "lucide-react";
import type { PublicNewsBlog } from "@/lib/api-types";

type ViewMode = "grid" | "list";

type Props = {
  items: PublicNewsBlog[];
};

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

const getPrimaryMediaUrl = (item: PublicNewsBlog) =>
  item.media.find((media) => media.kind === "IMAGE")?.fileUrl ??
  "/main/news.jpg";

function NewsCard({ item }: { item: PublicNewsBlog }) {
  const excerpt = stripHtml(item.caption);

  return (
    <article className="group overflow-hidden border border-[#032a0d]/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#032a0d]/25 hover:shadow-[0_20px_50px_rgba(3,42,13,0.1)]">
      <Link
        href={`/news-announcement/${item.id}`}
        className="relative block h-56 overflow-hidden bg-[#032a0d]/8"
      >
        <Image
          src={getPrimaryMediaUrl(item)}
          alt={item.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#032a0d]/60">
          <CalendarDays className="size-4" />
          {formatDate(item.publishedAt ?? item.createdAt)}
        </div>
        <Link href={`/news-announcement/${item.id}`}>
          <h2 className="mt-3 font-serif text-2xl leading-tight text-[#032a0d] hover:underline">
            {item.title}
          </h2>
        </Link>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-700">
          {excerpt || "Published announcement from Pearl of the Orient."}
        </p>
        {item.hashtags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.hashtags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-[#032a0d]/6 px-3 py-1 text-xs text-[#032a0d]"
              >
                <Tag className="size-3" />
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function NewsListItem({ item }: { item: PublicNewsBlog }) {
  const excerpt = stripHtml(item.caption);

  return (
    <article className="grid gap-4 border border-[#032a0d]/10 bg-white p-4 shadow-sm transition hover:border-[#032a0d]/25 hover:shadow-[0_16px_45px_rgba(3,42,13,0.08)] md:grid-cols-[240px_1fr]">
      <Link
        href={`/news-announcement/${item.id}`}
        className="relative h-48 overflow-hidden bg-[#032a0d]/8 md:h-full"
      >
        <Image
          src={getPrimaryMediaUrl(item)}
          alt={item.title}
          fill
          sizes="(min-width: 768px) 240px, 100vw"
          className="object-cover"
        />
      </Link>
      <div className="min-w-0 py-1">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-[#032a0d]/60">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4" />
            {formatDate(item.publishedAt ?? item.createdAt)}
          </span>
          <span className="inline-flex items-center gap-2">
            <Newspaper className="size-4" />
            Announcement
          </span>
        </div>
        <Link href={`/news-announcement/${item.id}`}>
          <h2 className="mt-3 font-serif text-2xl leading-tight text-[#032a0d] hover:underline md:text-3xl">
            {item.title}
          </h2>
        </Link>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-700">
          {excerpt || "Published announcement from Pearl of the Orient."}
        </p>
        {item.hashtags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.hashtags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#032a0d]/6 px-3 py-1 text-xs text-[#032a0d]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function NewsAnnouncementView({ items }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#032a0d]/55">
              Published Updates
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#032a0d]">
              Latest News and Announcements
            </h2>
          </div>

          <div className="inline-flex w-fit overflow-hidden border border-[#032a0d]/15 bg-white">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`inline-flex h-10 items-center gap-2 px-4 text-sm font-semibold transition ${
                viewMode === "grid"
                  ? "bg-[#032a0d] text-white"
                  : "text-[#032a0d] hover:bg-[#032a0d]/5"
              }`}
            >
              <Grid2X2 className="size-4" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`inline-flex h-10 items-center gap-2 border-l border-[#032a0d]/15 px-4 text-sm font-semibold transition ${
                viewMode === "list"
                  ? "bg-[#032a0d] text-white"
                  : "text-[#032a0d] hover:bg-[#032a0d]/5"
              }`}
            >
              <List className="size-4" />
              List
            </button>
          </div>
        </div>

        {items.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <NewsListItem key={item.id} item={item} />
              ))}
            </div>
          )
        ) : (
          <div className="border border-dashed border-[#032a0d]/20 bg-white px-6 py-16 text-center">
            <p className="font-serif text-2xl text-[#032a0d]">
              No published announcements yet.
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[#032a0d]/70">
              Published public news and announcement posts will appear here once
              available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
