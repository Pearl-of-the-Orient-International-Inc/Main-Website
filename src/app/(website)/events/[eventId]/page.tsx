"use client";

import Link from "next/link";
import { CalendarDays, CheckCircle2, MapPin, Video } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useOptionalCurrentUserQuery } from "@/features/auth/auth.hooks";
import {
  useJoinEventMutation,
  useMyEventRegistrationQuery,
  usePublicEventQuery,
} from "@/features/events/event.hooks";
import { toApiError } from "@/lib/http-client";
import { useToast } from "@/hooks/use-toast";

const formatDateTime = (value: string) => new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short" }).format(new Date(value));

export default function EventDetailPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;
  const { data: event, isLoading, isError } = usePublicEventQuery(eventId ?? "");
  const { data: currentUser } = useOptionalCurrentUserQuery();
  const joinMutation = useJoinEventMutation();
  const { toast } = useToast();
  const canJoin = currentUser?.role === "MEMBER" || currentUser?.role === "OFFICER";
  const registrationQuery = useMyEventRegistrationQuery(eventId ?? "", canJoin);
  const registration = registrationQuery.data?.data;

  const join = async () => {
    if (!event) return;
    try {
      const result = await joinMutation.mutateAsync(event.id);
      toast({ title: "Registration submitted", description: result.message, variant: "success" });
    } catch (error) {
      toast({ title: "Unable to join", description: toApiError(error).message || "Your registration could not be submitted.", variant: "error" });
    }
  };

  if (isLoading) return <main className="min-h-screen pt-28 text-center text-neutral-500">Loading event…</main>;
  if (isError || !event) return <main className="min-h-screen pt-28 text-center text-neutral-500">This public event is unavailable.</main>;
  const isUnavailable =
    event.status === "COMPLETED" ||
    event.status === "CANCELLED" ||
    new Date(event.endsAt).getTime() < Date.now();

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
            <Link href="/events" className="transition-colors hover:text-white">Events</Link>
            <span className="mx-2 text-white/50">/</span>
            <span className="font-medium text-white">{event.name}</span>
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6c35c]">{event.category.replace(/_/g, " ")}</p>
          <h1 className="mt-2 max-w-4xl font-serif text-3xl font-semibold tracking-wide sm:text-4xl md:text-5xl lg:text-6xl">{event.name}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">Public event information. Registration is available to active approved members and is subject to administrator approval.</p>
        </div>
      </section>

      <main className="mx-auto min-h-screen max-w-5xl px-5 pb-20 pt-10 sm:px-8">
        <div className="overflow-hidden border bg-white shadow-sm">
          <img src={event.thumbnailUrl || "/main/news.jpg"} alt="" className="aspect-video w-full object-cover" />
          <div className="grid gap-8 p-6 lg:grid-cols-[1fr_18rem] lg:p-9">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a7a18]">{event.category.replace(/_/g, " ")}</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-[#032a0d]">{event.name}</h1>
            <p className="mt-5 whitespace-pre-wrap leading-7 text-neutral-700">{event.description}</p>
          </div>
          <aside className="h-fit space-y-4 border bg-neutral-50 p-5">
            <p className="flex gap-2 text-sm text-neutral-700"><CalendarDays className="size-5 text-[#032a0d]" />{formatDateTime(event.startsAt)}</p>
            <p className="flex gap-2 text-sm text-neutral-700">{event.type === "ONLINE" ? <Video className="size-5 text-[#032a0d]" /> : <MapPin className="size-5 text-[#032a0d]" />}{event.type === "ONLINE" ? "Online joining details are shared after approval." : event.location || "Venue to be announced"}</p>
            <p className="border-t pt-4 text-sm text-neutral-600">Hosted by {event.organizer}</p>
            {isUnavailable ? (
              <Button disabled className="w-full">
                {event.status === "CANCELLED" ? "Event cancelled" : "Event ended"}
              </Button>
            ) : registration?.accessDetails?.onlineLink ? (
              <Button asChild className="w-full bg-[#032a0d] hover:bg-[#043512]">
                <a href={registration.accessDetails.onlineLink} target="_blank" rel="noreferrer">Join online event</a>
              </Button>
            ) : canJoin ? (
              <Button onClick={join} disabled={joinMutation.isPending || registration?.registrationStatus === "PENDING_APPROVAL"} className="w-full bg-[#032a0d] hover:bg-[#043512]">
                {joinMutation.isPending
                  ? "Submitting…"
                  : registration?.registrationStatus === "PENDING_APPROVAL"
                    ? "Awaiting approval"
                    : registration?.registrationStatus === "APPROVED"
                      ? "Approved"
                      : "Request to join"}
              </Button>
            ) : <Link href={`/sign-in?redirectTo=${encodeURIComponent(`/events/${event.id}`)}`} className="block"><Button className="w-full bg-[#032a0d] hover:bg-[#043512]">Sign in to join</Button></Link>}
            {registration?.accessDetails?.meetingId ? <p className="text-xs text-neutral-600">Meeting ID: {registration.accessDetails.meetingId}</p> : null}
            {registration?.accessDetails?.meetingPassword ? <p className="text-xs text-neutral-600">Passcode: {registration.accessDetails.meetingPassword}</p> : null}
            <p className="flex gap-2 text-xs text-neutral-500"><CheckCircle2 className="size-4 shrink-0 text-[#032a0d]" />Registration requires administrator approval. Attendance is confirmed after the event before a certificate can be generated.</p>
          </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
