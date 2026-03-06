"use client";

import { useEffect, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Info,
  Link2,
  UserRound,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  toApiError,
  useCurrentMemberOnlineInterviewAppointmentQuery,
  useUpsertCurrentMemberOnlineInterviewAppointmentMutation,
} from "@/features/member/member.hooks";
import { useToast } from "@/hooks/use-toast";
import type { InterviewDay } from "@/features/member/member.types";

type Props = {
  onContinueAction: () => Promise<void> | void;
};

type StoredInterviewDraft = {
  instructorId: string;
  day: "saturday" | "sunday" | "";
  slot: string;
  booked: boolean;
  zoomLink: string;
  meetingId: string;
  passcode: string;
};

const INTERVIEWERS = [
  {
    id: "ptr-rodel",
    name: "Bishop Dr. Rodel Manzo",
    role: "Chief Chaplain",
  },
  {
    id: "ptr-maria",
    name: "Ptr. Maria Santos",
    role: "Formation Interviewer",
  },
  {
    id: "ptr-jose",
    name: "Ptr. Jose Dela Cruz",
    role: "Ministry Interviewer",
  },
] as const;

const INTERVIEW_DAYS: { id: "saturday" | "sunday"; label: string; description: string }[] = [
  { id: "saturday", label: "Saturday", description: "Weekend schedule" },
  { id: "sunday", label: "Sunday", description: "Weekend schedule" },
];

const TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const defaultDraft = (): StoredInterviewDraft => ({
  instructorId: "",
  day: "",
  slot: "",
  booked: false,
  zoomLink: "",
  meetingId: "",
  passcode: "",
});

function generateMeetingId(): string {
  const first = Math.floor(100 + Math.random() * 900);
  const second = Math.floor(1000 + Math.random() * 9000);
  const third = Math.floor(1000 + Math.random() * 9000);
  return `${first} ${second} ${third}`;
}

function generatePasscode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function OnboardingStepOnlineInterview({
  onContinueAction,
}: Props) {
  const { toast } = useToast();
  const { data: currentOnlineInterview } =
    useCurrentMemberOnlineInterviewAppointmentQuery();
  const upsertOnlineInterviewMutation =
    useUpsertCurrentMemberOnlineInterviewAppointmentMutation();
  const [draft, setDraft] = useState<StoredInterviewDraft>(defaultDraft);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const appointment = currentOnlineInterview?.data;
    if (!appointment) return;

    setDraft({
      instructorId: appointment.interviewerId,
      day: appointment.day === "SATURDAY" ? "saturday" : "sunday",
      slot: appointment.timeSlot,
      booked: Boolean(appointment.zoomLink),
      zoomLink: appointment.zoomLink,
      meetingId: appointment.meetingId ?? "",
      passcode: appointment.passcode ?? "",
    });
  }, [currentOnlineInterview]);

  const updateDraft = (next: Partial<StoredInterviewDraft>) =>
    setDraft((prev) => ({ ...prev, ...next }));

  const selectedInstructor =
    INTERVIEWERS.find((item) => item.id === draft.instructorId) ?? null;

  const isScheduleComplete =
    Boolean(draft.instructorId) && Boolean(draft.day) && Boolean(draft.slot);
  const canContinue = draft.booked && Boolean(draft.zoomLink);

  const handleBookAppointment = () => {
    if (!isScheduleComplete) return;
    const meetingId = generateMeetingId();
    const passcode = generatePasscode();
    const cleanMeetingId = meetingId.replace(/\s/g, "");
    const zoomLink = `https://zoom.us/j/${cleanMeetingId}?pwd=${passcode}`;
    updateDraft({
      booked: true,
      meetingId,
      passcode,
      zoomLink,
    });
    toast({
      title: "Interview appointment confirmed",
      description: "Review and continue to save this schedule.",
      variant: "success",
    });
    setCopied(false);
  };

  const handleCopyLink = async () => {
    if (!draft.zoomLink || typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(draft.zoomLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const handleContinue = async () => {
    if (!canContinue) return;
    setError(null);
    setLoading(true);
    try {
      const selectedDay = draft.day === "saturday" ? "SATURDAY" : "SUNDAY";
      if (!draft.instructorId || !draft.day || !draft.slot || !draft.zoomLink) {
        throw new Error(
          "Select interviewer, day, slot, and confirm appointment first.",
        );
      }

      const instructorName =
        INTERVIEWERS.find((item) => item.id === draft.instructorId)?.name ??
        draft.instructorId;

      await upsertOnlineInterviewMutation.mutateAsync({
        interviewerId: draft.instructorId,
        interviewerName: instructorName,
        day: selectedDay as InterviewDay,
        timeSlot: draft.slot,
        zoomLink: draft.zoomLink,
        meetingId: draft.meetingId || undefined,
        passcode: draft.passcode || undefined,
      });

      await Promise.resolve(onContinueAction());
    } catch (e) {
      const apiError = toApiError(e);
      setError(apiError.message ?? (e instanceof Error ? e.message : "Failed to continue"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
      <div className="overflow-hidden border border-black/10 bg-white">
        <div className="bg-[#032a0d] px-5 py-4 text-white">
          <h2 className="text-lg">Online Interview (Appointment)</h2>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <section className="rounded border border-black/10 bg-neutral-50 px-4 py-4">
            <h3 className="font-serif text-xl text-[#032a0d]">
              Schedule Guidelines
            </h3>
            <p className="mt-1 text-sm text-[#032a0d]/80">
              Interview days are limited to Saturday and Sunday, between 8:00
              AM and 5:00 PM, with 1-hour appointment intervals.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#032a0d]/20 bg-[#032a0d]/5 px-3 py-1 text-xs font-medium text-[#032a0d]">
                Saturday & Sunday
              </span>
              <span className="rounded-full border border-[#032a0d]/20 bg-[#032a0d]/5 px-3 py-1 text-xs font-medium text-[#032a0d]">
                8:00 AM - 5:00 PM
              </span>
              <span className="rounded-full border border-[#032a0d]/20 bg-[#032a0d]/5 px-3 py-1 text-xs font-medium text-[#032a0d]">
                1-hour interval
              </span>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl text-[#032a0d]">
              Select Interviewer
            </h3>
            <div className="h-px bg-black/10" />
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {INTERVIEWERS.map((person) => {
                const selected = draft.instructorId === person.id;
                return (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() =>
                      updateDraft({
                        instructorId: person.id,
                        booked: false,
                        zoomLink: "",
                        meetingId: "",
                        passcode: "",
                      })
                    }
                    className={[
                      "rounded border px-3 py-3 text-left transition-colors",
                      selected
                        ? "border-[#032a0d]/40 bg-[#032a0d]/5 text-[#032a0d]"
                        : "border-black/10 bg-white text-[#032a0d]/80 hover:bg-[#032a0d]/3",
                    ].join(" ")}
                  >
                    <p className="inline-flex items-center gap-2 text-sm font-semibold">
                      <UserRound className="size-4 text-[#032a0d]/70" />
                      {person.name}
                    </p>
                    <p className="mt-1 text-xs text-[#032a0d]/70">{person.role}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl text-[#032a0d]">Select Day</h3>
            <div className="h-px bg-black/10" />
            <div className="grid gap-2 sm:grid-cols-2">
              {INTERVIEW_DAYS.map((day) => {
                const selected = draft.day === day.id;
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() =>
                      updateDraft({
                        day: day.id,
                        booked: false,
                        zoomLink: "",
                        meetingId: "",
                        passcode: "",
                      })
                    }
                    className={[
                      "rounded border px-3 py-3 text-left transition-colors",
                      selected
                        ? "border-[#032a0d]/40 bg-[#032a0d]/5 text-[#032a0d]"
                        : "border-black/10 bg-white text-[#032a0d]/80 hover:bg-[#032a0d]/3",
                    ].join(" ")}
                  >
                    <p className="inline-flex items-center gap-2 text-sm font-semibold">
                      <CalendarClock className="size-4 text-[#032a0d]/70" />
                      {day.label}
                    </p>
                    <p className="mt-1 text-xs text-[#032a0d]/70">{day.description}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl text-[#032a0d]">Select Time Slot</h3>
            <div className="h-px bg-black/10" />
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {TIME_SLOTS.map((slot) => {
                const selected = draft.slot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() =>
                      updateDraft({
                        slot,
                        booked: false,
                        zoomLink: "",
                        meetingId: "",
                        passcode: "",
                      })
                    }
                    className={[
                      "rounded border px-3 py-2 text-sm transition-colors",
                      selected
                        ? "border-[#032a0d]/40 bg-[#032a0d]/5 text-[#032a0d]"
                        : "border-black/10 bg-white text-[#032a0d]/80 hover:bg-[#032a0d]/3",
                    ].join(" ")}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="size-3.5 text-[#032a0d]/70" />
                      {slot}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3 rounded border border-black/10 bg-neutral-50 px-4 py-4">
            <h3 className="font-serif text-xl text-[#032a0d]">
              Appointment Summary
            </h3>
            <div className="h-px bg-black/10" />
            <div className="grid gap-2 text-sm text-[#032a0d]/85 sm:grid-cols-3">
              <p>
                <span className="font-semibold text-[#032a0d]">Interviewer:</span>{" "}
                {selectedInstructor?.name ?? "Not selected"}
              </p>
              <p>
                <span className="font-semibold text-[#032a0d]">Day:</span>{" "}
                {draft.day ? draft.day[0].toUpperCase() + draft.day.slice(1) : "Not selected"}
              </p>
              <p>
                <span className="font-semibold text-[#032a0d]">Time:</span>{" "}
                {draft.slot || "Not selected"}
              </p>
            </div>
            <Button
              type="button"
              onClick={handleBookAppointment}
              disabled={!isScheduleComplete}
              className="bg-[#032a0d] hover:bg-[#032a0d]/90"
            >
              Confirm Interview Appointment
            </Button>
            {!isScheduleComplete && (
              <p className="text-xs text-[#032a0d]/70">
                Select interviewer, day, and slot before confirming.
              </p>
            )}
          </section>

          {draft.booked && draft.zoomLink && (
            <section className="rounded border border-emerald-700/20 bg-emerald-50 px-4 py-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900">
                <CheckCircle2 className="size-4" />
                Appointment confirmed. Zoom meeting details are now released.
              </p>
              <div className="mt-3 space-y-2 text-sm text-emerald-950">
                <p>
                  <span className="font-semibold">Meeting ID:</span>{" "}
                  {draft.meetingId}
                </p>
                <p>
                  <span className="font-semibold">Passcode:</span> {draft.passcode}
                </p>
                <p className="break-all">
                  <span className="font-semibold">Zoom Link:</span>{" "}
                  <a
                    href={draft.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {draft.zoomLink}
                  </a>
                </p>
              </div>
              <div className="mt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="border-emerald-700/30 bg-white text-emerald-900 hover:bg-emerald-100"
                >
                  <Link2 className="size-4" />
                  {copied ? "Link copied" : "Copy Zoom link"}
                </Button>
              </div>
            </section>
          )}

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500 sm:text-sm">
              Continue to Member ID / Certificate generation after your online
              interview appointment is confirmed.
            </p>
            <Button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue || loading}
              className="bg-[#032a0d] hover:bg-[#032a0d]/90"
            >
              {loading ? "Saving..." : "Continue to Member ID Generation"}
            </Button>
          </div>
        </div>
      </div>

      <aside className="self-start lg:sticky lg:top-6">
        <div className="overflow-hidden border border-black/10 bg-white">
          <div className="bg-[#032a0d] px-5 py-4 text-white">
            <h2 className="text-lg">Interview Checklist</h2>
          </div>
          <div className="space-y-3 p-5 text-sm text-neutral-700">
            <StatusCard
              title="Interviewer"
              complete={Boolean(draft.instructorId)}
              pendingLabel="Pending"
              completeLabel="Selected"
            />
            <StatusCard
              title="Day & Time Slot"
              complete={Boolean(draft.day) && Boolean(draft.slot)}
              pendingLabel="Pending"
              completeLabel="Selected"
            />
            <StatusCard
              title="Zoom Meeting Link"
              complete={draft.booked && Boolean(draft.zoomLink)}
              pendingLabel="Pending release"
              completeLabel="Released"
            />
            <div className="flex gap-2 rounded border border-dashed border-[#032a0d]/25 bg-[#032a0d]/5 px-3 py-3 text-xs text-[#032a0d]/80">
              <Info className="mt-0.5 size-4 shrink-0 text-[#032a0d]" />
              <p>
                Save your selected interviewer, day, slot, and Zoom details to continue.
              </p>
            </div>
            {draft.zoomLink && (
              <div className="rounded border border-[#032a0d]/20 bg-[#032a0d]/5 px-3 py-3">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-[#032a0d]">
                  <Video className="size-4" />
                  Zoom meeting is available
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function StatusCard({
  title,
  complete,
  pendingLabel,
  completeLabel,
}: {
  title: string;
  complete: boolean;
  pendingLabel: string;
  completeLabel: string;
}) {
  return (
    <div
      className={[
        "rounded border px-3 py-3",
        complete
          ? "border-emerald-300 bg-emerald-50"
          : "border-black/10 bg-neutral-50",
      ].join(" ")}
    >
      <p className="font-semibold text-[#032a0d]">{title}</p>
      <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[#032a0d]/75">
        <span
          className={[
            "size-2 rounded-full",
            complete ? "bg-emerald-600" : "bg-neutral-500",
          ].join(" ")}
        />
        {complete ? completeLabel : pendingLabel}
      </p>
    </div>
  );
}
