"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePublicHonorRollQuery } from "@/features/member/member.hooks";

const monthLabel = (periodKey?: string) => {
  if (!periodKey) return "This month";
  const [year, month] = periodKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en-PH", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
};

const rankMedal = (rank: number) => {
  const medals: Record<number, { src: string; alt: string }> = {
    1: { src: "/Gold%20Rank%20Medal.png", alt: "Gold first-place medal" },
    2: { src: "/Silver%20Rank%20Medal.png", alt: "Silver second-place medal" },
    3: { src: "/Bronze%20Rank%20Medal.png", alt: "Bronze third-place medal" },
  };
  return medals[rank];
};

// Temporary visual-preview data. It is used only while the live monthly Honor Roll is empty.
// Remove this fallback when the referral flow has been tested with real members and points.
const DEMO_RANKINGS = [
  {
    rank: 1,
    memberNumber: "262-00037",
    name: "Kyle Andre Lim",
    avatar: null,
    points: 32,
    milestones: 6,
  },
  {
    rank: 2,
    memberNumber: "262-00042",
    name: "Leilani C. Junio",
    avatar: null,
    points: 24,
    milestones: 4,
  },
  {
    rank: 3,
    memberNumber: "262-00038",
    name: "Bobby M. Brimon",
    avatar: null,
    points: 16,
    milestones: 3,
  },
  {
    rank: 4,
    memberNumber: "262-00053",
    name: "Kyle Andre D. Lim",
    avatar: null,
    points: 14,
    milestones: 3,
  },
  {
    rank: 5,
    memberNumber: "262-00054",
    name: "Maria L. Santiago",
    avatar: null,
    points: 13,
    milestones: 3,
  },
  {
    rank: 6,
    memberNumber: "262-00055",
    name: "Ronald P. Manalo",
    avatar: null,
    points: 12,
    milestones: 2,
  },
  {
    rank: 7,
    memberNumber: "262-00056",
    name: "Annalyn M. Tibio",
    avatar: null,
    points: 11,
    milestones: 2,
  },
  {
    rank: 8,
    memberNumber: "262-00057",
    name: "Florante A. Zagaña",
    avatar: null,
    points: 10,
    milestones: 2,
  },
  {
    rank: 9,
    memberNumber: "262-00058",
    name: "Chito P. Cruz",
    avatar: null,
    points: 9,
    milestones: 2,
  },
  {
    rank: 10,
    memberNumber: "262-00059",
    name: "Rhenald L. Lagrimas",
    avatar: null,
    points: 8,
    milestones: 2,
  },
];

// Temporary criteria preview based on the approved referral proposal.
// The live administrator-configured criteria will replace this in the next phase.
const TEMPORARY_CRITERIA = [
  { title: "Membership application submitted", points: 3, status: "Active in V1", description: "A referred applicant successfully submits a membership application." },
  { title: "Referred member approved", points: 5, status: "Active in V1", description: "The referred applicant is approved as an active member." },
  { title: "Pre-orientation completed", points: 10, status: "Planned", description: "The referred member completes the pre-orientation requirement." },
  { title: "Orientation attended", points: 15, status: "Planned", description: "The referred member is checked in at orientation." },
  { title: "Chaplaincy 101 completed", points: 20, status: "Planned", description: "The referred member completes Chaplaincy 101." },
  { title: "Oath taking completed", points: 25, status: "Planned", description: "The referred member has a recorded oath-taking completion." },
  { title: "Seminary enrolled", points: 30, status: "Planned", description: "The referred member is formally enrolled in Seminary." },
  { title: "Ordination approved", points: 50, status: "Planned", description: "The referred member receives final ordination approval." },
  { title: "CRASM approved", points: 40, status: "Planned", description: "The referred member receives final CRASM approval." },
];

export default function MembershipBuildersPage() {
  const [rankingScope, setRankingScope] = useState<"month" | "all">("month");
  const honorRollQuery = usePublicHonorRollQuery(undefined, rankingScope);
  const [isCriteriaOpen, setIsCriteriaOpen] = useState(false);
  const honorRoll = honorRollQuery.data;
  const isDemo =
    !honorRollQuery.isLoading &&
    !honorRollQuery.isError &&
    !honorRoll?.rankings.length;
  const rankings = honorRoll?.rankings.length
    ? honorRoll.rankings
    : DEMO_RANKINGS;
  const podiumRankings = [rankings[1], rankings[0], rankings[2]].filter(
    (entry): entry is (typeof rankings)[number] => Boolean(entry),
  );

  return (
    <main className="min-h-screen bg-[#032a0d] pt-20">
      <div className="w-full">
        <section className="bg-white">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Membership%20Builders%20Honor%20Roll%20Banner.png"
              alt="Membership Builders Honor Roll"
              className="block h-auto w-full"
            />
            <Sheet open={isCriteriaOpen} onOpenChange={setIsCriteriaOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="absolute left-[5%] top-[72%] h-14 border-white/65 bg-white/92 px-7 text-base font-semibold text-[#032a0d] shadow-lg hover:bg-white sm:h-16 sm:px-9 sm:text-lg"
                >
                  View point criteria
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                showCloseButton={false}
                className="w-full overflow-y-auto border-none p-0 sm:max-w-xl"
              >
                <div className="relative shrink-0 overflow-hidden bg-[#032a0d] px-6 py-8 text-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/Forest%20green%20and%20gold%20honor%20roll%20backdrop.png" alt="" className="absolute inset-0 size-full object-cover opacity-45" />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsCriteriaOpen(false)}
                    className="absolute top-4 right-4 z-20 h-11 bg-white/95 px-4 text-[#032a0d] shadow-lg hover:bg-white"
                  >
                    <X className="size-4" /> Close
                  </Button>
                  <SheetHeader className="relative z-10 p-0 pt-12 pr-10">
                    <p className="text-xs font-semibold tracking-[0.16em] text-amber-200 uppercase">Membership Builders</p>
                    <SheetTitle className="font-serif text-3xl text-white">Referral point criteria</SheetTitle>
                    <SheetDescription className="text-sm leading-6 text-green-50">How members earn points by helping referred applicants progress through verified milestones.</SheetDescription>
                  </SheetHeader>
                </div>
                <div className="space-y-3 bg-stone-50 p-5 sm:p-6">
                  <div className="border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                    <strong>Temporary preview:</strong> These values are for reviewing the experience. Only the two entries marked Active in V1 currently award points.
                  </div>
                  {TEMPORARY_CRITERIA.map((criterion) => (
                    <article key={criterion.title} className="flex gap-4 border border-[#032a0d]/12 bg-white p-4 shadow-sm">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#032a0d] text-lg font-bold text-amber-200">+{criterion.points}</div>
                      <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-neutral-950">{criterion.title}</h3><span className={criterion.status === "Active in V1" ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800" : "rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600"}>{criterion.status}</span></div><p className="mt-1 text-sm leading-5 text-neutral-600">{criterion.description}</p></div>
                    </article>
                  ))}
                  <p className="px-1 pt-2 text-xs leading-5 text-neutral-500">Recognition certificates are not automatically issued by this criteria list. A monthly Top 3 is reviewed and locked by an administrator first.</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {!honorRollQuery.isLoading && !honorRollQuery.isError ? (
            <section className="border-b border-[#032a0d]/10 bg-linear-to-b from-[#f7faf7] to-white px-5 py-10 sm:py-14">
              <div className="mx-auto max-w-6xl">
                <div className="mx-auto mb-8 max-w-xl text-center">
                  <p className="text-xs font-semibold tracking-[0.16em] text-[#56755f] uppercase">
                    Top membership builders
                  </p>
                  <h2 className="mt-2 font-serif text-2xl text-[#032a0d] sm:text-3xl">
                    {rankingScope === "month"
                      ? "This month’s leading members"
                      : "All-time leading members"}
                  </h2>
                  <p className="mt-2 mb-5 text-sm text-neutral-600">
                    Every point represents a verified milestone reached by a
                    referred member.
                  </p>
                </div>

                <div className="grid items-end mt-16 gap-3 sm:grid-cols-3 sm:gap-5">
                  {podiumRankings.map((entry) => {
                    const isFirst = entry.rank === 1;
                    const pedestalClass = isFirst
                      ? "min-h-48 border-[#b9912d]/35 bg-linear-to-b from-[#fff9e7] to-[#f8ebc1]"
                      : entry.rank === 2
                        ? "min-h-36 border-slate-300 bg-linear-to-b from-slate-50 to-slate-100"
                        : "min-h-28 border-[#bd8054]/30 bg-linear-to-b from-[#fff5ef] to-[#f4d9c9]";
                    const medal = rankMedal(entry.rank);

                    return (
                      <article
                        key={`podium-${entry.rank}-${entry.memberNumber ?? entry.name}`}
                        className={`relative flex flex-col items-center text-center ${isFirst ? "sm:-translate-y-7" : ""}`}
                      >
                        <div
                          className={`relative z-10 flex size-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white shadow-lg ${isFirst ? "sm:size-24" : ""}`}
                        >
                          {entry.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={entry.avatar}
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            <span className="font-serif text-3xl font-bold text-[#032a0d]">
                              {entry.name.slice(0, 1)}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 max-w-full truncate px-2 font-semibold text-neutral-950">
                          {entry.name}
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500">
                          {entry.memberNumber ?? "Verified member"}
                        </p>
                        <div
                          className={`mt-4 flex w-full flex-col items-center justify-center rounded-t-2xl border px-4 py-5 shadow-sm ${pedestalClass}`}
                        >
                          {medal ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={medal.src}
                              alt={medal.alt}
                              className="size-14 object-contain drop-shadow-sm"
                            />
                          ) : null}
                          <p className="mt-3 text-2xl font-bold text-[#032a0d]">
                            {entry.points}
                          </p>
                          <p className="text-xs font-medium text-neutral-600">
                            referral points
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : null}

          <div className="mx-auto max-w-7xl p-6 sm:p-12">
            <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#032a0d]">
                  {rankingScope === "month"
                    ? "Current standings"
                    : "Cumulative standings"}
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-neutral-950">
                  {rankingScope === "month"
                    ? monthLabel(honorRoll?.periodKey)
                    : "All time"}
                </h2>
              </div>
              <div className="flex flex-col items-start gap-3 sm:items-end">
                <div
                  className="flex rounded-md border p-1"
                  role="tablist"
                  aria-label="Honor Roll period"
                >
                  <Button
                    type="button"
                    role="tab"
                    aria-selected={rankingScope === "month"}
                    size="sm"
                    variant={rankingScope === "month" ? "default" : "ghost"}
                    className={
                      rankingScope === "month"
                        ? "bg-[#032a0d] hover:bg-[#032a0d]/90"
                        : ""
                    }
                    onClick={() => setRankingScope("month")}
                  >
                    This month
                  </Button>
                  <Button
                    type="button"
                    role="tab"
                    aria-selected={rankingScope === "all"}
                    size="sm"
                    variant={rankingScope === "all" ? "default" : "ghost"}
                    className={
                      rankingScope === "all"
                        ? "bg-[#032a0d] hover:bg-[#032a0d]/90"
                        : ""
                    }
                    onClick={() => setRankingScope("all")}
                  >
                    All time
                  </Button>
                </div>
              </div>
            </div>

            {honorRollQuery.isLoading ? (
              <div className="py-16 text-center text-neutral-500">
                Loading the Honor Roll…
              </div>
            ) : honorRollQuery.isError ? (
              <div className="py-16 text-center text-neutral-600">
                The Honor Roll is temporarily unavailable. Please try again
                shortly.
              </div>
            ) : (
              <>
                {isDemo ? (
                  <div className="mt-6 border border-dashed border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                    <strong>Preview data:</strong> These sample members and
                    points are temporary so you can review the layout. They are
                    not real standings.
                  </div>
                ) : null}
                <ol className="mt-6 space-y-3">
                  {rankings.map((entry) => (
                    <li
                      key={`${entry.rank}-${entry.memberNumber ?? entry.name}`}
                      className="flex items-center gap-4 border border-neutral-200 bg-neutral-50 p-4 sm:p-5"
                    >
                      {rankMedal(entry.rank) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={rankMedal(entry.rank).src}
                          alt={rankMedal(entry.rank).alt}
                          className="size-12 shrink-0 object-contain"
                        />
                      ) : (
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#032a0d]/20 bg-white text-sm font-bold text-[#032a0d]">
                          #{entry.rank}
                        </div>
                      )}
                      {entry.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={entry.avatar}
                          alt=""
                          className="size-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-12 items-center justify-center rounded-full bg-[#032a0d]/10 font-semibold text-[#032a0d]">
                          {entry.name.slice(0, 1)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-neutral-950">
                          {entry.name}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {entry.milestones} referral milestone
                          {entry.milestones === 1 ? "" : "s"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#032a0d]">
                          {entry.points}
                        </p>
                        <p className="text-xs text-neutral-500">points</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            )}

            <div className="mt-8 border-t border-neutral-200 pt-6 text-center text-sm text-neutral-600">
              Are you an active approved member? Your referral link is on your
              public profile.{" "}
              <Link
                href="/directory"
                className="font-semibold text-[#032a0d] underline underline-offset-2"
              >
                Open member directory
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
