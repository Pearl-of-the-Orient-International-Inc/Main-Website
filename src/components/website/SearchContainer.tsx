"use client";

import {
  ArrowRight,
  CalendarDays,
  FileText,
  Loader2,
  Newspaper,
  Search,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type {
  PublicNewsBlogsResponse,
  PublicServiceChaplainsResponse,
} from "@/lib/api-types";
import type { PublicEventsResponse } from "@/features/events/event.types";

interface SearchContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: "Page" | "News" | "Event" | "Chaplain";
  icon: LucideIcon;
};

const apiBaseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_API_BASE_URL_PROD;

const staticPages: SearchResult[] = [
  {
    id: "home",
    title: "Home",
    description: "Main website page, mission, branches of service, recognition, and FAQs.",
    href: "/",
    type: "Page",
    icon: FileText,
  },
  {
    id: "about",
    title: "About Pearl of the Orient",
    description: "History, mission, core functions, principles, and accreditation.",
    href: "/about-pearl-of-the-orient",
    type: "Page",
    icon: FileText,
  },
  {
    id: "directory",
    title: "Directory",
    description: "Public member directory map and regional member presence.",
    href: "/directory",
    type: "Page",
    icon: FileText,
  },
  {
    id: "book-a-service",
    title: "Book a Service",
    description: "Find certified specialist training officer instructors for service requests.",
    href: "/book-a-service",
    type: "Page",
    icon: FileText,
  },
  {
    id: "news-announcement",
    title: "News Announcement",
    description: "Official news, public updates, and announcements.",
    href: "/news-announcement",
    type: "Page",
    icon: Newspaper,
  },
  {
    id: "office-chief-chaplain",
    title: "Office of the Chief Chaplain",
    description: "Office information and chief chaplain public page.",
    href: "/office-of-the-chief-chaplain",
    type: "Page",
    icon: FileText,
  },
  {
    id: "organizational-structure",
    title: "Organizational Structure",
    description: "Leadership structure and organization offices.",
    href: "/organizational-structure",
    type: "Page",
    icon: FileText,
  },
  {
    id: "shop",
    title: "Chaplain Products",
    description: "Public shop for chaplain products.",
    href: "/shop",
    type: "Page",
    icon: FileText,
  },
  {
    id: "become-member",
    title: "Become a Member",
    description: "Start membership application and onboarding.",
    href: "/become-a-member",
    type: "Page",
    icon: FileText,
  },
];

const normalize = (value: string) => value.trim().toLowerCase();

const includesQuery = (value: string, query: string) =>
  normalize(value).includes(query);

const formatEventDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila",
  }).format(new Date(value));

const buildChaplainName = (
  chaplain: PublicServiceChaplainsResponse["data"][number],
) =>
  [
    chaplain.firstName,
    chaplain.middleInitial
      ? chaplain.middleInitial.endsWith(".")
        ? chaplain.middleInitial
        : `${chaplain.middleInitial}.`
      : null,
    chaplain.lastName,
    chaplain.extensionName,
  ]
    .filter(Boolean)
    .join(" ");

export const SearchContainer = ({ isOpen, onClose }: SearchContainerProps) => {
  const [query, setQuery] = useState("");
  const [dynamicResults, setDynamicResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = normalize(query);

  const pageResults = useMemo(() => {
    if (normalizedQuery.length < 2) {
      return staticPages.slice(0, 5);
    }

    return staticPages.filter(
      (page) =>
        includesQuery(page.title, normalizedQuery) ||
        includesQuery(page.description, normalizedQuery) ||
        includesQuery(page.type, normalizedQuery),
    );
  }, [normalizedQuery]);

  const results = useMemo(
    () => [...pageResults, ...dynamicResults].slice(0, 12),
    [dynamicResults, pageResults],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeout = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || normalizedQuery.length < 2 || !apiBaseUrl) {
      setDynamicResults([]);
      setIsSearching(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      setIsSearching(true);
      setError(null);

      try {
        const encodedQuery = encodeURIComponent(normalizedQuery);
        const [newsResponse, eventsResponse, chaplainsResponse] =
          await Promise.all([
            fetch(`${apiBaseUrl}/news-blogs/public?limit=5&search=${encodedQuery}`, {
              signal: controller.signal,
            }),
            fetch(`${apiBaseUrl}/events/public?limit=5&search=${encodedQuery}`, {
              signal: controller.signal,
            }),
            fetch(`${apiBaseUrl}/members/public/service-chaplains`, {
              signal: controller.signal,
            }),
          ]);

        const nextResults: SearchResult[] = [];

        if (newsResponse.ok) {
          const payload = (await newsResponse.json()) as PublicNewsBlogsResponse;
          nextResults.push(
            ...payload.data.map((item) => ({
              id: `news-${item.id}`,
              title: item.title,
              description: item.caption || "Published public announcement.",
              href: `/news-announcement/${item.id}`,
              type: "News" as const,
              icon: Newspaper,
            })),
          );
        }

        if (eventsResponse.ok) {
          const payload = (await eventsResponse.json()) as PublicEventsResponse;
          nextResults.push(
            ...payload.data.map((item) => ({
              id: `event-${item.id}`,
              title: item.name,
              description: `${formatEventDate(item.startsAt)}${
                item.location ? ` • ${item.location}` : ""
              }`,
              href: "/",
              type: "Event" as const,
              icon: CalendarDays,
            })),
          );
        }

        if (chaplainsResponse.ok) {
          const payload =
            (await chaplainsResponse.json()) as PublicServiceChaplainsResponse;
          nextResults.push(
            ...payload.data
              .filter((chaplain) => {
                const searchable = [
                  buildChaplainName(chaplain),
                  chaplain.user.name,
                  chaplain.uniqueId ?? "",
                  chaplain.badgeNumber ?? "",
                  chaplain.municipalityCity ?? "",
                  chaplain.province ?? "",
                  chaplain.region ?? "",
                  chaplain.officerAssignments[0]?.officeTitle.name ?? "",
                ].join(" ");

                return includesQuery(searchable, normalizedQuery);
              })
              .slice(0, 5)
              .map((chaplain) => {
                const name = buildChaplainName(chaplain);
                const location = [
                  chaplain.municipalityCity,
                  chaplain.province,
                  chaplain.region,
                ]
                  .filter(Boolean)
                  .join(", ");

                return {
                  id: `chaplain-${chaplain.id}`,
                  title: name,
                  description:
                    location ||
                    "Certified Specialist Training Officer Instructor",
                  href: `/profile/${encodeURIComponent(
                    chaplain.uniqueId ?? chaplain.id,
                  )}`,
                  type: "Chaplain" as const,
                  icon: UserRound,
                };
              }),
          );
        }

        setDynamicResults(nextResults);
      } catch (searchError) {
        if (searchError instanceof DOMException && searchError.name === "AbortError") {
          return;
        }

        setDynamicResults([]);
        setError("Search is temporarily unavailable.");
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [isOpen, normalizedQuery]);

  const hasQuery = normalizedQuery.length >= 2;
  const showEmptyState = hasQuery && !isSearching && results.length === 0;

  return (
    <div
      className={`fixed inset-0 z-70 bg-[#032a0d] text-white transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="flex items-start justify-between gap-3 p-4 sm:p-6">
          <div className="w-10 shrink-0" />

          <div className="flex min-w-0 flex-col items-center text-center">
            <Image
              src="/main/logo.png"
              alt="Site seal"
              width={100}
              height={100}
              priority
              className="size-16 sm:size-20 md:size-24"
            />
            <div className="mt-3 max-w-full text-sm font-serif sm:text-lg md:text-2xl">
              PEARL OF THE ORIENT INTERNATIONAL AUXILARY
            </div>
            <div className="text-xs font-serif sm:text-base md:text-xl">
              CHAPLAIN VALUES EDUCATORS INC.
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 sm:size-12 md:size-15"
            aria-label="Close search"
          >
            <X className="size-7 sm:size-8 md:size-10" />
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-10 pt-6 sm:px-6 md:pt-10">
          <form
            onSubmit={(event) => event.preventDefault()}
            className="relative"
          >
            <Search className="pointer-events-none absolute left-0 top-1/2 size-5 -translate-y-1/2 text-white/65 sm:size-6" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pages, news, events, chaplains..."
              className="w-full border-b-2 border-white bg-transparent py-4 pl-9 pr-10 text-lg text-white outline-none transition-colors placeholder:text-white/60 focus:border-white/80 sm:text-2xl"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-0 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </form>

          <div className="mt-6 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-white/55">
            <span>{hasQuery ? "Search Results" : "Popular Links"}</span>
            {isSearching ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-3.5 animate-spin" />
                Searching
              </span>
            ) : null}
          </div>

          {error ? (
            <div className="mt-5 border border-red-200/30 bg-red-950/25 px-4 py-3 text-sm text-red-50">
              {error}
            </div>
          ) : null}

          {showEmptyState ? (
            <div className="mt-8 border border-white/15 bg-white/6 px-5 py-8 text-center">
              <p className="font-serif text-2xl">No results found</p>
              <p className="mt-2 text-sm text-white/70">
                Try shorter keyword or search by page, news title, location, or member name.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              {results.map((result) => {
                const Icon = result.icon;

                return (
                  <Link
                    key={result.id}
                    href={result.href}
                    onClick={onClose}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border border-white/10 bg-white/7 px-4 py-4 transition hover:border-[#d4af5c]/60 hover:bg-white/12 sm:px-5"
                  >
                    <span className="flex size-11 items-center justify-center rounded-full bg-white text-[#032a0d]">
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-serif text-lg leading-tight sm:text-xl">
                          {result.title}
                        </span>
                        <span className="rounded-full border border-[#d4af5c]/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f3d48a]">
                          {result.type}
                        </span>
                      </span>
                      <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-white/70">
                        {result.description}
                      </span>
                    </span>
                    <ArrowRight className="size-5 text-white/50 transition group-hover:translate-x-1 group-hover:text-[#d4af5c]" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
