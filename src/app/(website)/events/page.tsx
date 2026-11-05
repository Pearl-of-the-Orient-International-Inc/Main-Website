"use client";

import Link from "next/link";
import { CalendarDays, MapPin, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePublicEventsQuery } from "@/features/events/event.hooks";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(value));

const isNoLongerAvailable = (event: { status: string; endsAt: string }) =>
  event.status === "COMPLETED" ||
  event.status === "CANCELLED" ||
  new Date(event.endsAt).getTime() < Date.now();

export default function EventsPage() {
  const { data: events = [], isLoading, isError } = usePublicEventsQuery();

  return (
    <div>
      <section className="relative bg-[#032a0d] text-white">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-40" />
        </div>
        <div className="relative mx-auto mt-10 max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-8 lg:py-16">
          <p className="mb-2 text-xs text-white/70 sm:text-sm">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span className="mx-2 text-white/50">/</span>
            <span className="font-medium text-white">Events</span>
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6c35c]">Community calendar</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-wide sm:text-4xl md:text-5xl lg:text-6xl">Events, trainings & seminars</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">Explore public events. Active approved members can request to join; registration is reviewed by an administrator.</p>
        </div>
      </section>

      <main className="mx-auto min-h-screen max-w-7xl px-5 pb-20 pt-10 sm:px-8">
        {isLoading ? <p className="text-neutral-500">Loading events…</p> : null}
        {isError ? <p className="text-red-700">Events could not be loaded right now.</p> : null}
        {!isLoading && !isError && !events.length ? <p className="text-neutral-500">No public events are available right now.</p> : null}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article key={event.id} className="overflow-hidden border bg-white shadow-sm">
              <img src={event.thumbnailUrl || "/main/news.jpg"} alt="" className="aspect-video w-full object-cover" />
              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#9a7a18]">{event.category.replace(/_/g, " ")}</p>
                  <h2 className="mt-1 text-xl font-semibold text-[#032a0d]">{event.name}</h2>
                </div>
                <p className="line-clamp-3 text-sm text-neutral-600">{event.description}</p>
                <div className="space-y-2 text-sm text-neutral-600">
                  <p className="flex gap-2"><CalendarDays className="size-4 text-[#032a0d]" />{formatDate(event.startsAt)}</p>
                  <p className="flex gap-2">{event.type === "ONLINE" ? <Video className="size-4 text-[#032a0d]" /> : <MapPin className="size-4 text-[#032a0d]" />}{event.type === "ONLINE" ? "Online access after approval" : event.location || "Venue to be announced"}</p>
                </div>
                {isNoLongerAvailable(event) ? (
                  <Button disabled className="w-full">
                    {event.status === "CANCELLED" ? "Event cancelled" : "Event ended"}
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-[#032a0d] hover:bg-[#043512]"><Link href={`/events/${event.id}`}>View event</Link></Button>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
