"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface OfficePerson {
  name: string;
  role: string;
  group?: string;
  image?: string;
  imageType?: "person" | "logo";
  memberNumber?: string | null;
  memberType?: string;
  jurisdiction?: string | null;
}

export interface OfficeDirectoryPageData {
  title: string;
  description: string;
  people: OfficePerson[];
  emptyMessage?: string;
  collapsibleGroups?: boolean;
}

const placeholderImage = "/profile-empty.png";

export const OfficeDirectoryPage = ({
  data,
}: {
  data: OfficeDirectoryPageData;
}) => {
  const groups = data.people.reduce<Array<{ title: string | null; people: OfficePerson[] }>>(
    (currentGroups, person) => {
      const groupTitle = person.group ?? null;
      const existingGroup = currentGroups.find((group) => group.title === groupTitle);

      if (existingGroup) {
        existingGroup.people.push(person);
        return currentGroups;
      }

      return [...currentGroups, { title: groupTitle, people: [person] }];
    },
    [],
  );

  return (
    <div>
      <section className="relative bg-[#032a0d] text-white">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-40" />
        </div>

        <div className="relative mx-auto mt-10 max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <p className="mb-2 text-xs text-white/70 sm:text-sm">
            <Link href="/">Home</Link>{" "}
            <span className="mx-1 text-white/50 sm:mx-2">/</span>{" "}
            <Link href="/organizational-structure">Organizational Structure</Link>{" "}
            <span className="mx-1 text-white/50 sm:mx-2">/</span>{" "}
            <span className="font-medium text-white">{data.title}</span>
          </p>
          <h1 className="font-serif text-3xl font-semibold tracking-wide sm:text-4xl md:text-5xl lg:text-6xl">
            {data.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            {data.description}
          </p>
        </div>
      </section>

      <section className="bg-white pb-16 pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-5 items-center justify-center rounded-full bg-green-100">
                <span className="size-2.5 rounded-full bg-green-600" />
              </span>
              <h2 className="text-2xl font-bold text-slate-950">
                {data.title}
              </h2>
            </div>
            <Link
              href="/organizational-structure"
              className="inline-flex w-fit items-center justify-center rounded-full bg-green-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/20 transition-colors hover:bg-green-800"
            >
              View Organizational Structure
            </Link>
          </div>

          <div className="space-y-10">
            {groups.length ? groups.map((group) => (
              data.collapsibleGroups && group.title ? (
                <Collapsible
                  key={group.title}
                  defaultOpen
                  className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
                >
                  <CollapsibleTrigger
                    aria-label={`Toggle ${group.title} officers`}
                    className="group flex w-full items-center justify-between gap-4 border-l-4 border-[#032a0d] px-5 py-5 text-left transition-colors hover:bg-neutral-50 sm:px-6"
                  >
                    <span>
                      <span className="block font-serif text-2xl font-semibold text-[#032a0d]">
                        {group.title}
                      </span>
                      <span className="mt-1 block text-sm text-neutral-600">
                        Published officers · {group.people.length} {group.people.length === 1 ? "profile" : "profiles"}
                      </span>
                    </span>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#032a0d]/15 bg-[#edf4ed]">
                      <ChevronDown className="size-5 text-[#032a0d] transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-t border-neutral-200 px-5 py-5 sm:px-6 sm:py-6">
                    <OfficeDirectoryGrid people={group.people} />
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <section key={group.title ?? "directory"} className="space-y-4">
                  {group.title && (
                    <h3 className="text-lg font-semibold text-[#032a0d]">
                      {group.title}
                    </h3>
                  )}
                  <OfficeDirectoryGrid people={group.people} />
                </section>
              )
            )) : (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center text-neutral-600">
                {data.emptyMessage ?? "No public officers have been published for this office yet."}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

function OfficeDirectoryGrid({ people }: { people: OfficePerson[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {people.map((person) => (
        <OfficeDirectoryCard
          key={`${person.name}-${person.role}`}
          person={person}
        />
      ))}
    </div>
  );
}

function OfficeDirectoryCard({ person }: { person: OfficePerson }) {
  const isLogoCard = person.imageType === "logo";

  const content = (
    <>
      <div className="border-b border-neutral-200 bg-neutral-50 p-5">
        {isLogoCard ? (
          <div className="flex aspect-4/3 items-center justify-center rounded-xl border border-dashed border-green-800/25 bg-white p-6">
            {person.image ? (
              <div className="relative h-full w-full">
                <Image
                  src={person.image}
                  alt={`${person.name} logo`}
                  fill
                  unoptimized
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex size-28 flex-col items-center justify-center rounded-full border border-green-800/20 bg-green-50 text-center text-2xl font-bold text-green-900">
                {getInitials(person.name)}
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-green-800/70">
                  Logo
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-white">
            <Image
              src={person.image ?? placeholderImage}
              alt={person.name}
              fill
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3
          title={person.name}
          className="truncate text-xl font-bold leading-snug text-slate-950"
        >
          {person.name}
        </h3>
        <p
          title={person.role}
          className="mt-2 truncate text-base leading-relaxed text-slate-500"
        >
          {person.role}
        </p>
      </div>
    </>
  );

  const className = "block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors hover:border-green-300 hover:shadow-md";

  return person.memberNumber ? (
    <Link target="_blank" href={`/profile/${person.memberNumber}`} className={className}>
      {content}
    </Link>
  ) : (
    <article className={className}>{content}</article>
  );
}

function getInitials(value: string) {
  const uppercaseWords = value.match(/\b[A-Z]{2,}\b/g);

  if (uppercaseWords?.length) {
    return uppercaseWords
      .slice(0, 2)
      .map((word) => word[0])
      .join("");
  }

  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}
