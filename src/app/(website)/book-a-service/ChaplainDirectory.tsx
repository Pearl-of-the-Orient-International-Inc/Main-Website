"use client"

import Image from "next/image"
import React from "react"
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Download,
  FileBadge,
  Info,
  LockKeyhole,
  MapPin,
  Maximize2,
  Minus,
  Plus,
  Shield,
  Star,
  Users,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { PublicServiceChaplain } from "@/lib/api-types"

type Chaplain = PublicServiceChaplain

const buildFullName = (chaplain: Chaplain) =>
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
    .join(" ")

const buildLocation = (chaplain: Chaplain) =>
  [
    chaplain.municipalityCity,
    chaplain.province,
    chaplain.region,
  ]
    .filter(Boolean)
    .join(", ") || "Location not publicly listed"

const buildOfficeTitle = (chaplain: Chaplain) =>
  chaplain.officerAssignments[0]?.officeTitle.name ??
  "Certified Specialist Training Officer Instructor"

const buildBranchList = (chaplain: Chaplain) => {
  const customBranches = (chaplain.preferredBranchOther ?? "")
    .split(/[,|]/)
    .map((item) => item.trim())
    .filter(Boolean)

  return [
    ...chaplain.preferredBranches.map((branch) => branch.title),
    ...customBranches,
  ].filter((branch, index, list) => list.indexOf(branch) === index)
}

const buildProfileImage = (chaplain: Chaplain) =>
  chaplain.user.avatar ??
  chaplain.applicantRequirements[0]?.fileUrl ??
  "/profile-empty.png"

const calendarDays = [
  { label: "27", muted: true },
  { label: "28", muted: true },
  { label: "29", muted: true },
  { label: "30", muted: true },
  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: "4" },
  { label: "5" },
  { label: "6" },
  { label: "7" },
  { label: "8" },
  { label: "9" },
  { label: "10" },
  { label: "11" },
  { label: "12" },
  { label: "13" },
  { label: "14", selected: true },
  { label: "15", available: true },
  { label: "16", available: true },
  { label: "17", available: true },
  { label: "18" },
  { label: "19" },
  { label: "20", available: true },
  { label: "21", available: true },
  { label: "22" },
  { label: "23" },
  { label: "24" },
  { label: "25", available: true },
  { label: "26" },
  { label: "27" },
  { label: "28" },
  { label: "29", available: true },
  { label: "30", available: true },
  { label: "31" },
]

const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
]

const selectedService = {
  title: "Solemnizing of Marriage",
  subtitle: "Marriage Ceremony",
}

const LicensePreview = ({ chaplain }: { chaplain: Chaplain }) => (
  <div className="grid max-h-[82vh] overflow-y-auto rounded-md bg-white lg:grid-cols-[350px_1fr]">
    <aside className="border-b border-zinc-200 bg-zinc-50 p-6 md:border-b-0 md:border-r">
      <div className="text-center">
        <div className="relative mx-auto size-28 overflow-hidden rounded-full bg-zinc-200">
          <Image
            src={buildProfileImage(chaplain)}
            alt={buildFullName(chaplain)}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
        <h3 className="mt-4 font-serif text-xl font-semibold">
          {buildFullName(chaplain)}
        </h3>
        <p className="text-sm text-zinc-700">{buildOfficeTitle(chaplain)}</p>
      </div>

      <div className="mt-6 space-y-5 border-t border-zinc-200 pt-5 text-sm">
        <div className="flex gap-3">
          <Shield className="mt-0.5 size-5 shrink-0 text-[#032a0d]" />
          <div>
            <p className="font-medium">Branch of Service</p>
            <p className="text-zinc-600">
              {buildBranchList(chaplain).join(", ") || "Not publicly listed"}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <LockKeyhole className="mt-0.5 size-5 shrink-0 text-[#032a0d]" />
          <div>
            <p className="font-medium">Chaplain ID</p>
            <p className="text-zinc-600">
              {chaplain.uniqueId ?? chaplain.badgeNumber ?? chaplain.id}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#032a0d]" />
          <div>
            <p className="font-medium">Status</p>
            <span className="mt-1 inline-flex rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold uppercase text-emerald-800">
              Active
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Clock className="mt-0.5 size-5 shrink-0 text-[#032a0d]" />
          <div>
            <p className="font-medium">Commissioned Since</p>
            <p className="text-zinc-600">
              {new Date(chaplain.createdAt).toLocaleDateString("en-PH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#032a0d]" />
          <div>
            <p className="font-medium">Validity</p>
            <p className="text-zinc-600">Verified public member profile</p>
          </div>
        </div>
      </div>

      <div className="mt-7 rounded-md border border-zinc-200 bg-white p-4">
        <div className="flex gap-3">
          <Shield className="size-6 shrink-0 text-[#032a0d]" />
          <div>
            <p className="text-sm font-bold">Verified & Accredited</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
              This chaplain is commissioned, accredited, and bound by our core
              values.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded border border-zinc-400 bg-white px-4 text-xs font-bold uppercase tracking-wide text-zinc-900 transition hover:border-[#032a0d] hover:text-[#032a0d]"
      >
        <Download className="size-4" />
        Download License
      </button>
    </aside>

    <section className="p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-semibold">Certificate of Registration</h3>
        <div className="flex overflow-hidden rounded-md border border-zinc-200">
          <button
            type="button"
            className="flex size-8 items-center justify-center hover:bg-zinc-50"
            aria-label="Zoom out"
          >
            <Minus className="size-4" />
          </button>
          <button
            type="button"
            className="flex size-8 items-center justify-center border-l border-zinc-200 hover:bg-zinc-50"
            aria-label="Zoom in"
          >
            <Plus className="size-4" />
          </button>
          <button
            type="button"
            className="flex size-8 items-center justify-center border-l border-zinc-200 hover:bg-zinc-50"
            aria-label="Expand license"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-md border border-zinc-200 bg-[#fffdf8] shadow-sm">
        <Image
          src="/sample-license.jpg"
          alt={`Certificate of registration for ${buildFullName(chaplain)}`}
          width={1100}
          height={1500}
          className="h-auto w-full"
          priority
        />
      </div>

      <div className="mt-4 flex gap-2 text-xs leading-relaxed text-zinc-600">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          This certificate is issued by the Philippine Statistics Authority
          (PSA). You may verify its authenticity with PSA if needed.
        </p>
      </div>
    </section>
  </div>
)

const AppointmentSheet = ({
  chaplain,
  open,
  onOpenChange,
}: {
  chaplain: Chaplain | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const { toast } = useToast()
  const [selectedTime, setSelectedTime] = React.useState("2:00 PM")
  const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    setSelectedTime("2:00 PM")
    setNotes("")
  }, [open, chaplain?.id])

  if (!chaplain) return null

  const submitAppointment = () => {
    toast({
      title: "Appointment request submitted",
      description: `${buildFullName(chaplain)} will review your request for May 14, 2025 at ${selectedTime}.`,
      variant: "success",
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto p-0 max-w-lg! z-999">
        <SheetHeader className="border-b px-5 py-5 text-center">
          <SheetTitle className="font-serif text-xl">
            Book an Appointment
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5 px-5 py-5">
          <div className="flex gap-4">
            <div className="relative aspect-3/4 w-28 shrink-0 overflow-hidden rounded-md bg-zinc-100">
              <Image
                src={buildProfileImage(chaplain)}
                alt={buildFullName(chaplain)}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="inline-flex rounded bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase text-emerald-800">
                Available
              </span>
              <h3 className="mt-2 font-serif text-xl font-semibold">
                {buildFullName(chaplain)}
              </h3>
              <p className="text-sm text-zinc-700">{buildOfficeTitle(chaplain)}</p>
              <div className="mt-3 space-y-1 text-xs text-zinc-700">
                <p className="flex items-center gap-2">
                  <Users className="size-3.5 text-[#032a0d]" />
                  {buildBranchList(chaplain).join(", ") || "Not publicly listed"}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-[#032a0d]" />
                  {buildLocation(chaplain)}
                </p>
                <p className="flex items-center gap-2">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  Verified specialist
                </p>
              </div>
            </div>
          </div>

          <section className="rounded-md border border-zinc-200 p-4">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wide">
              Selected Service
            </h3>
            <div className="flex items-center gap-3">
              <Shield className="size-7 text-[#032a0d]" />
              <div>
                <p className="text-sm font-semibold">{selectedService.title}</p>
                <p className="text-xs text-zinc-600">
                  {selectedService.subtitle}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide">
              1. Select Date
            </h3>
            <div className="grid gap-4">
              <div className="rounded-md border border-zinc-200 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    type="button"
                    className="rounded p-1 hover:bg-zinc-100"
                    aria-label="Previous month"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                  <p className="text-sm font-semibold">May 2025</p>
                  <button
                    type="button"
                    className="rounded p-1 hover:bg-zinc-100"
                    aria-label="Next month"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-zinc-500">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <span key={day}>{day}</span>
                    ),
                  )}
                </div>
                <div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs">
                  {calendarDays.map((day, index) => (
                    <button
                      key={`${day.label}-${index}`}
                      type="button"
                      className={`relative flex h-9 items-center justify-center rounded ${
                        day.selected
                          ? "bg-[#032a0d] text-white"
                          : day.muted
                            ? "text-zinc-300"
                            : "text-zinc-900 hover:bg-zinc-100"
                      }`}
                    >
                      {day.label}
                      {day.available && (
                        <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[#0f8a3b]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              {/* <div className="flex flex-col items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 p-4 text-center">
                <CalendarCheck className="size-9 text-[#032a0d]" />
                <p className="mt-3 text-xs leading-relaxed text-zinc-700">
                  Schedule may change due to prior commitments.
                </p>
                <p className="mt-4 text-xs text-zinc-600">
                  All times are shown in{" "}
                  <span className="font-bold text-[#032a0d]">
                    GMT +8 (Philippine Time)
                  </span>
                </p>
              </div> */}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide">
              2. Select Time
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`h-9 rounded-md border text-xs font-semibold transition ${
                    selectedTime === time
                      ? "border-[#032a0d] bg-[#032a0d] text-white"
                      : "border-zinc-200 bg-white text-zinc-900 hover:border-[#032a0d]/40"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <p className="mt-3 rounded bg-emerald-50 px-3 py-2 text-xs font-medium text-[#032a0d]">
              Selected: May 14, 2025 (Wednesday) at {selectedTime}
            </p>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wide">
                3. Additional Information (Optional)
              </h3>
              <span className="text-xs text-zinc-500">{notes.length}/250</span>
            </div>
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value.slice(0, 250))}
              placeholder="Add notes or special requests..."
              className="min-h-24 resize-none text-sm"
            />
          </section>

          <div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-zinc-700">
            <Info className="mt-0.5 size-4 shrink-0 text-amber-700" />
            <p>
              Your appointment request will be reviewed and approved by the
              admin. You will be notified via email or SMS once confirmed.
            </p>
          </div>

          <div className="grid grid-cols-[1fr_2fr] gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded border border-zinc-400 bg-white px-4 text-xs font-bold uppercase tracking-wide text-zinc-900 transition hover:border-[#032a0d] hover:text-[#032a0d]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitAppointment}
              className="flex h-11 items-center justify-center gap-2 rounded bg-[#032a0d] px-4 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#064016]"
            >
              <CalendarCheck className="size-4" />
              Submit Appointment Request
            </button>
          </div>
          <p className="text-center text-xs text-zinc-500">
            By submitting, you agree to our terms and conditions.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function ChaplainDirectory({ chaplains }: { chaplains: Chaplain[] }) {
  const [selectedChaplain, setSelectedChaplain] =
    React.useState<Chaplain | null>(null)

  return (
    <>
      <div className="space-y-4">
        {chaplains.length === 0 ? (
          <div className="rounded-md border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
            <p className="font-serif text-2xl text-[#032a0d]">
              No certified service chaplains available yet.
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-600">
              Only approved active members with Certified Specialist Training
              Officer Instructor status appear here.
            </p>
          </div>
        ) : null}

        {chaplains.map((chaplain) => (
          <article
            key={chaplain.id}
            className="grid gap-5 rounded-md border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-[124px_1fr_210px]"
          >
          <div className="relative aspect-3/4 overflow-hidden rounded-md bg-zinc-100">
            <Image
              src={buildProfileImage(chaplain)}
              alt={buildFullName(chaplain)}
              fill
              sizes="124px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <span className="inline-flex rounded bg-emerald-100 px-2 py-1 text-[11px] font-bold uppercase text-emerald-800">
              Available
            </span>
            <h3 className="mt-3 font-serif text-xl font-semibold">
              {buildFullName(chaplain)}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
              <span>{buildOfficeTitle(chaplain)}</span>
              <span className="flex items-center gap-1">
                <Star
                  className="size-4 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                Verified specialist
              </span>
            </div>
            <div className="mt-3 space-y-1 text-sm text-zinc-700">
              <p className="flex items-center gap-2">
                <Users className="size-4 text-[#032a0d]" />
                {buildBranchList(chaplain).join(", ") ||
                  "Branch not publicly listed"}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-[#032a0d]" />
                {buildLocation(chaplain)}
              </p>
            </div>
            <p className="mt-4 text-xs font-semibold text-zinc-700">
              Services Offered:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                "Solemnizing of Marriage",
                "Baptismal Service",
                "Memorial Service",
              ].map((service) => (
                <span
                  key={service}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700"
                >
                  {service}
                </span>
              ))}
              <span className="px-1 py-1 text-xs text-zinc-700">
                + more by request
              </span>
            </div>
          </div>
            <div className="flex flex-col justify-center gap-3 md:items-end">
            <button
              type="button"
              onClick={() => setSelectedChaplain(chaplain)}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-[#032a0d] px-4 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#064016]"
            >
              <CalendarCheck className="size-4" />
              Book an Appointment
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded border border-zinc-400 bg-white px-4 text-xs font-bold uppercase tracking-wide text-zinc-900 transition hover:border-[#032a0d] hover:text-[#032a0d]"
                >
                  <FileBadge className="size-4" />
                  View License
                </button>
              </DialogTrigger>
              <DialogContent className="max-h-[92vh]! mt-8 max-w-6xl! gap-0 overflow-hidden p-0">
                <DialogHeader className="border-b px-6 py-4 text-center">
                  <DialogTitle className="font-serif text-xl">
                    View License
                  </DialogTitle>
                </DialogHeader>
                <LicensePreview chaplain={chaplain} />
              </DialogContent>
            </Dialog>
          </div>
        </article>
      ))}
      </div>
      <AppointmentSheet
        chaplain={selectedChaplain}
        open={Boolean(selectedChaplain)}
        onOpenChange={(open) => {
          if (!open) setSelectedChaplain(null)
        }}
      />
    </>
  )
}
