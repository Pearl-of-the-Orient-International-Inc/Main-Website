"use client";

import Link from "next/link";
import {
  BadgeCheck,
  CalendarCheck2,
  Clock3,
  FileCheck2,
  IdCard,
  Info,
  MapPinCheckInside,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  uniqueId: string;
};

export function OnboardingStepOathTaking({ uniqueId }: Props) {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
      <div className="overflow-hidden border border-black/10 bg-white">
        <div className="bg-[#032a0d] px-5 py-4 text-white">
          <h2 className="text-lg">Final Step: Oath Taking</h2>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <section className="rounded border border-black/10 bg-neutral-50 px-4 py-4">
            <div className="flex items-start gap-3">
              <CalendarCheck2 className="mt-0.5 size-5 shrink-0 text-[#032a0d]" />
              <div className="space-y-1">
                <h3 className="font-serif text-xl text-[#032a0d]">
                  Oath Taking Ceremony
                </h3>
                <p className="text-sm text-[#032a0d]/80">
                  Attend the oath taking ceremony to formally complete your
                  onboarding. This schedule is managed by the admin and
                  leadership team. The confirmed schedule will be sent to your
                  registered email.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl text-[#032a0d]">What Happens Next</h3>
            <div className="h-px bg-black/10" />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded border border-black/10 bg-white px-3 py-3">
                <div className="mb-2 inline-flex rounded-full border border-[#032a0d]/20 bg-[#032a0d]/5 p-2">
                  <Clock3 className="size-4 text-[#032a0d]" />
                </div>
                <p className="text-sm font-semibold text-[#032a0d]">
                  Wait for Schedule
                </p>
                <p className="mt-1 text-xs text-[#032a0d]/70">
                  Pearl of the Orient will assign your ceremony date and time
                  and send it via email.
                </p>
              </div>

              <div className="rounded border border-black/10 bg-white px-3 py-3">
                <div className="mb-2 inline-flex rounded-full border border-[#032a0d]/20 bg-[#032a0d]/5 p-2">
                  <MapPinCheckInside className="size-4 text-[#032a0d]" />
                </div>
                <p className="text-sm font-semibold text-[#032a0d]">
                  Receive Venue Details
                </p>
                <p className="mt-1 text-xs text-[#032a0d]/70">
                  You will get official instructions for location and attendance.
                </p>
              </div>

              <div className="rounded border border-black/10 bg-white px-3 py-3">
                <div className="mb-2 inline-flex rounded-full border border-[#032a0d]/20 bg-[#032a0d]/5 p-2">
                  <CalendarCheck2 className="size-4 text-[#032a0d]" />
                </div>
                <p className="text-sm font-semibold text-[#032a0d]">
                  Complete Oath Taking
                </p>
                <p className="mt-1 text-xs text-[#032a0d]/70">
                  After completion, your credentials become claimable.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl text-[#032a0d]">
              Release of Credentials
            </h3>
            <div className="h-px bg-black/10" />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded border border-black/10 bg-white px-3 py-3">
                <div className="mb-2 inline-flex rounded-full border border-[#032a0d]/20 bg-[#032a0d]/5 p-2">
                  <BadgeCheck className="size-4 text-[#032a0d]" />
                </div>
                <p className="text-sm font-semibold text-[#032a0d]">
                  Certificate of Authority
                </p>
                <p className="mt-1 text-xs text-[#032a0d]/70">
                  Issued by the organization after oath taking attendance.
                </p>
              </div>

              <div className="rounded border border-black/10 bg-white px-3 py-3">
                <div className="mb-2 inline-flex rounded-full border border-[#032a0d]/20 bg-[#032a0d]/5 p-2">
                  <FileCheck2 className="size-4 text-[#032a0d]" />
                </div>
                <p className="text-sm font-semibold text-[#032a0d]">
                  Certificate of Appointment
                </p>
                <p className="mt-1 text-xs text-[#032a0d]/70">
                  Official appointment document for your chaplaincy role.
                </p>
              </div>

              <div className="rounded border border-black/10 bg-white px-3 py-3">
                <div className="mb-2 inline-flex rounded-full border border-[#032a0d]/20 bg-[#032a0d]/5 p-2">
                  <IdCard className="size-4 text-[#032a0d]" />
                </div>
                <p className="text-sm font-semibold text-[#032a0d]">Physical ID</p>
                <p className="mt-1 text-xs text-[#032a0d]/70">
                  Printed ID card is claimable after ceremony attendance.
                </p>
              </div>
            </div>
            <div className="rounded border border-blue-300 bg-blue-50 px-3 py-3 text-xs text-[#032a0d]/80">
              Certificate of Authority, Certificate of Appointment, and
              Physical ID can be claimed upon attending oath taking.
            </div>
          </section>

          <div className="rounded border border-[#032a0d]/15 bg-[#032a0d]/5 px-4 py-3 text-sm text-[#032a0d]/80">
            You have completed all prior onboarding steps. Member ID reference:{" "}
            <span className="font-semibold text-[#032a0d]">{uniqueId}</span>.
          </div>

          <div className="flex justify-end">
            <Button asChild className="bg-[#032a0d] hover:bg-[#032a0d]/90">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </div>

      <aside className="self-start lg:sticky lg:top-6">
        <div className="overflow-hidden border border-black/10 bg-white">
          <div className="bg-[#032a0d] px-5 py-4 text-white">
            <h2 className="text-lg">Oath Taking Status</h2>
          </div>
          <div className="space-y-3 p-5 text-sm text-neutral-700">
            <div className="rounded border border-black/10 bg-neutral-50 px-3 py-3">
              <p className="font-semibold text-[#032a0d]">Schedule</p>
              <p className="mt-0.5 text-xs text-[#032a0d]/70">
                Pending admin assignment
              </p>
            </div>
            <div className="rounded border border-black/10 bg-neutral-50 px-3 py-3">
              <p className="font-semibold text-[#032a0d]">Venue</p>
              <p className="mt-0.5 text-xs text-[#032a0d]/70">
                To be announced by leadership
              </p>
            </div>
            <div className="rounded border border-black/10 bg-neutral-50 px-3 py-3">
              <p className="font-semibold text-[#032a0d]">Email Notification</p>
              <p className="mt-0.5 text-xs text-[#032a0d]/70">
                Schedule details (date, time, and venue) will be sent to your
                registered email address.
              </p>
            </div>
            <div className="rounded border border-black/10 bg-neutral-50 px-3 py-3">
              <p className="font-semibold text-[#032a0d]">Member ID</p>
              <p className="mt-0.5 text-xs font-medium text-[#032a0d]/80">
                {uniqueId}
              </p>
            </div>
            <div className="rounded border border-blue-300 bg-blue-50 px-3 py-3">
              <p className="font-semibold text-[#032a0d]">Credentials Release</p>
              <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[#032a0d]/75">
                <span className="size-2 rounded-full bg-blue-600" />
                Claimable upon oath taking attendance
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
