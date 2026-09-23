"use client";

import Image from "next/image";
import React from "react";
import { format, isSameDay, startOfDay } from "date-fns";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  FileBadge,
  FileQuestion,
  Info,
  LockKeyhole,
  MapPin,
  Shield,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOptionalCurrentUserQuery } from "@/features/auth/auth.hooks";
import {
  useCreateChaplainServiceBookingMutation,
  usePublicChaplainServicesQuery,
} from "@/features/chaplain-service-booking/chaplain-service-booking.hooks";
import type {
  BookingDeliveryMethod,
  BookingService,
} from "@/features/chaplain-service-booking/chaplain-service-booking.types";
import {
  toApiError,
  usePublicChaplainServiceAvailabilityQuery,
} from "@/features/member/member.hooks";
import { useToast } from "@/hooks/use-toast";
import type { PublicServiceChaplain } from "@/lib/api-types";

type Chaplain = PublicServiceChaplain;

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
    .join(" ");

const buildLocation = (chaplain: Chaplain) =>
  [chaplain.municipalityCity, chaplain.province, chaplain.region]
    .filter(Boolean)
    .join(", ") || "Location not publicly listed";

const buildOfficeTitle = (chaplain: Chaplain) =>
  chaplain.officerAssignments[0]?.officeTitle.name ??
  "Certified Specialist Training Officer Instructor";

const buildBranchList = (chaplain: Chaplain) => {
  const customBranches = (chaplain.preferredBranchOther ?? "")
    .split(/[,|]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return [
    ...chaplain.preferredBranches.map((branch) => branch.title),
    ...customBranches,
  ].filter((branch, index, list) => list.indexOf(branch) === index);
};

const buildProfileImage = (chaplain: Chaplain) =>
  chaplain.user.avatar ??
  chaplain.applicantRequirements[0]?.fileUrl ??
  "/profile-empty.png";

const LicensePreview = ({ chaplain }: { chaplain: Chaplain }) => {
  const licenseUrl = chaplain.serviceLicenseUrl?.trim() || null;
  const isPdf = chaplain.serviceLicenseMimeType === "application/pdf";

  return (
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
            <ShieldCheck className="size-6 shrink-0 text-[#032a0d]" />
            <div>
              <p className="text-sm font-bold">Verified & Accredited</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                This chaplain is commissioned, accredited, and bound by our core
                values.
              </p>
            </div>
          </div>
        </div>
      </aside>

      <section className="p-6">
        {licenseUrl ? (
          <>
            <div className="relative h-[75vh] max-h-135 overflow-y-auto overflow-x-hidden rounded-md border border-zinc-200 bg-[#fffdf8] shadow-sm">
              {isPdf ? (
                <iframe
                  src={licenseUrl}
                  title={`Service license for ${buildFullName(chaplain)}`}
                  className="h-full w-full"
                />
              ) : (
                <Image
                  src={licenseUrl}
                  alt={`Service license for ${buildFullName(chaplain)}`}
                  width={1100}
                  height={1000}
                  className="h-auto w-full object-contain"
                />
              )}
            </div>
            <div className="mt-4 flex gap-2 text-xs leading-relaxed text-zinc-600">
              <Info className="mt-0.5 size-4 shrink-0" />
              <p>
                This is the license uploaded by the chaplain for public
                verification.
              </p>
            </div>
          </>
        ) : (
          <div className="flex min-h-120 flex-col items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-6 text-center">
            <FileQuestion className="size-12 text-zinc-400" />
            <h4 className="mt-4 font-serif text-xl font-semibold text-[#032a0d]">
              No license uploaded
            </h4>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-600">
              This chaplain has not uploaded a public PNG or PDF service license
              yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export const AppointmentSheet = ({
  chaplain,
  service,
  open,
  onOpenChange,
}: {
  chaplain: Chaplain | null;
  service?: BookingService | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { toast } = useToast();
  const memberId = chaplain?.uniqueId ?? chaplain?.id ?? "";
  const availabilityQuery = usePublicChaplainServiceAvailabilityQuery(
    memberId,
    open && Boolean(memberId),
  );
  const servicesQuery = usePublicChaplainServicesQuery(open && !service);
  const bookingMutation = useCreateChaplainServiceBookingMutation();
  const { data: currentUser } = useOptionalCurrentUserQuery();
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [selectedSlotId, setSelectedSlotId] = React.useState("");
  const [selectedServiceId, setSelectedServiceId] = React.useState(
    service?.id ?? "",
  );
  const [requesterName, setRequesterName] = React.useState("");
  const [requesterEmail, setRequesterEmail] = React.useState("");
  const [requesterPhone, setRequesterPhone] = React.useState("");
  const [deliveryMethod, setDeliveryMethod] =
    React.useState<BookingDeliveryMethod>("ON_SITE");
  const [locationDetails, setLocationDetails] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const services = React.useMemo(
    () => (service ? [service] : (servicesQuery.data ?? [])),
    [service, servicesQuery.data],
  );
  const slots = React.useMemo(
    () =>
      [...(availabilityQuery.data ?? [])].sort(
        (left, right) =>
          new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
      ),
    [availabilityQuery.data],
  );
  const availableDates = slots.map((slot) => new Date(slot.startsAt));
  const selectedDaySlots = selectedDate
    ? slots.filter((slot) => isSameDay(new Date(slot.startsAt), selectedDate))
    : [];
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);
  const selectedService = services.find(
    (item) => item.id === selectedServiceId,
  );

  React.useEffect(() => {
    if (!open) return;
    setSelectedDate(undefined);
    setSelectedSlotId("");
    setSelectedServiceId(service?.id ?? "");
    setRequesterName("");
    setRequesterEmail("");
    setRequesterPhone("");
    setDeliveryMethod("ON_SITE");
    setLocationDetails("");
    setNotes("");
  }, [open, chaplain?.id, service?.id]);

  React.useEffect(() => {
    if (!open || !currentUser) return;
    setRequesterName((current) => current || currentUser.name);
    setRequesterEmail((current) => current || currentUser.email);
  }, [open, currentUser]);

  React.useEffect(() => {
    if (!open || slots.length === 0 || selectedDate) return;
    const first = slots[0];
    setSelectedDate(new Date(first.startsAt));
    setSelectedSlotId(first.id);
  }, [open, selectedDate, slots]);

  React.useEffect(() => {
    if (!open || selectedServiceId || services.length === 0) return;
    setSelectedServiceId(services[0].id);
  }, [open, selectedServiceId, services]);

  if (!chaplain) return null;

  const submitAppointment = async () => {
    if (
      !selectedService ||
      !selectedSlot ||
      !requesterName.trim() ||
      !requesterEmail.trim() ||
      !requesterPhone.trim() ||
      !locationDetails.trim()
    ) {
      toast({
        title: "Complete the booking details",
        description:
          "Select a service and availability, then provide your contact and delivery details.",
        variant: "warning",
      });
      return;
    }

    try {
      const booking = await bookingMutation.mutateAsync({
        serviceId: selectedService.id,
        providerMemberId: chaplain.id,
        availabilitySlotId: selectedSlot.id,
        requesterName: requesterName.trim(),
        requesterEmail: requesterEmail.trim(),
        requesterPhone: requesterPhone.trim(),
        preferredAt: selectedSlot.startsAt,
        deliveryMethod,
        locationDetails: locationDetails.trim(),
        notes: notes.trim() || undefined,
      });
      toast({
        title: "Appointment request submitted",
        description: `${selectedService.name} with ${buildFullName(chaplain)} was requested for ${format(new Date(booking.preferredAt), "MMMM d, yyyy 'at' h:mm a")}.`,
        variant: "success",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Unable to submit appointment",
        description: toApiError(error).message,
        variant: "error",
      });
    }
  };

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
              <p className="text-sm text-zinc-700">
                {buildOfficeTitle(chaplain)}
              </p>
              <div className="mt-3 space-y-1 text-xs text-zinc-700">
                <p className="flex items-center gap-2">
                  <Users className="size-3.5 text-[#032a0d]" />
                  {buildBranchList(chaplain).join(", ") ||
                    "Not publicly listed"}
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
            <div className="flex items-start gap-3">
              <Shield className="size-7 text-[#032a0d]" />
              <div className="min-w-0 flex-1">
                {service ? (
                  <>
                    <p className="text-sm font-semibold">{service.name}</p>
                    <p className="mt-1 text-xs text-zinc-600">
                      {service.description}
                    </p>
                  </>
                ) : (
                  <select
                    value={selectedServiceId}
                    onChange={(event) => setSelectedServiceId(event.target.value)}
                    className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
                    aria-label="Select service"
                  >
                    <option value="">Select a service</option>
                    {services.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide">
              1. Select Date
            </h3>
            {availabilityQuery.isLoading ? (
              <div className="rounded-md border border-dashed p-6 text-center text-sm text-zinc-500">
                Loading the chaplain&apos;s availability...
              </div>
            ) : slots.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-center text-sm text-zinc-500">
                This chaplain has no upcoming availability.
              </div>
            ) : (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (!date) return;
                  setSelectedDate(date);
                  const firstSlot = slots.find((slot) =>
                    isSameDay(new Date(slot.startsAt), date),
                  );
                  setSelectedSlotId(firstSlot?.id ?? "");
                }}
                disabled={(date) =>
                  date < startOfDay(new Date()) ||
                  !availableDates.some((available) => isSameDay(available, date))
                }
                modifiers={{ available: availableDates }}
                modifiersClassNames={{
                  available:
                    "font-bold text-emerald-700 after:absolute after:bottom-1 after:size-1 after:rounded-full after:bg-emerald-600",
                }}
                className="w-full rounded-md border"
              />
            )}
          </section>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide">
              2. Select Time
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {selectedDaySlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`min-h-11 rounded-md border px-3 text-xs font-semibold transition ${
                    selectedSlotId === slot.id
                      ? "border-[#032a0d] bg-[#032a0d] text-white"
                      : "border-zinc-200 bg-white text-zinc-900 hover:border-[#032a0d]/40"
                  }`}
                >
                  {format(new Date(slot.startsAt), "h:mm a")} -{" "}
                  {format(new Date(slot.endsAt), "h:mm a")}
                </button>
              ))}
            </div>
            {selectedSlot ? (
              <p className="mt-3 rounded bg-emerald-50 px-3 py-2 text-xs font-medium text-[#032a0d]">
                Selected: {format(new Date(selectedSlot.startsAt), "EEEE, MMMM d, yyyy 'from' h:mm a")} to {format(new Date(selectedSlot.endsAt), "h:mm a")}
              </p>
            ) : (
              <p className="mt-3 text-xs text-zinc-500">
                Select an available date and time.
              </p>
            )}
          </section>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide">
              3. Contact Details
            </h3>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="booking-requester-name">Full name</Label>
                <Input
                  id="booking-requester-name"
                  value={requesterName}
                  onChange={(event) => setRequesterName(event.target.value)}
                  maxLength={180}
                  autoComplete="name"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="booking-requester-email">Email</Label>
                  <Input
                    id="booking-requester-email"
                    type="email"
                    value={requesterEmail}
                    onChange={(event) => setRequesterEmail(event.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="booking-requester-phone">Phone</Label>
                  <Input
                    id="booking-requester-phone"
                    type="tel"
                    value={requesterPhone}
                    onChange={(event) => setRequesterPhone(event.target.value)}
                    maxLength={30}
                    autoComplete="tel"
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide">
              4. Service Delivery
            </h3>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="booking-delivery-method">Delivery method</Label>
                <select
                  id="booking-delivery-method"
                  value={deliveryMethod}
                  onChange={(event) =>
                    setDeliveryMethod(event.target.value as BookingDeliveryMethod)
                  }
                  className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm"
                >
                  <option value="ON_SITE">On-site / In person</option>
                  <option value="ONLINE">Online</option>
                  <option value="PHONE">Phone</option>
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="booking-location-details">
                  {deliveryMethod === "ON_SITE"
                    ? "Service location"
                    : deliveryMethod === "ONLINE"
                      ? "Online platform or meeting preference"
                      : "Phone contact instructions"}
                </Label>
                <Textarea
                  id="booking-location-details"
                  value={locationDetails}
                  onChange={(event) => setLocationDetails(event.target.value)}
                  maxLength={1000}
                  placeholder={
                    deliveryMethod === "ON_SITE"
                      ? "Complete address or venue"
                      : deliveryMethod === "ONLINE"
                        ? "e.g. Zoom, Google Meet, or Messenger"
                        : "Best phone number and calling instructions"
                  }
                  className="min-h-20 resize-none text-sm"
                />
              </div>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wide">
                5. Supporting Notes (Optional)
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
              disabled={bookingMutation.isPending}
              className="h-11 rounded border border-zinc-400 bg-white px-4 text-xs font-bold uppercase tracking-wide text-zinc-900 transition hover:border-[#032a0d] hover:text-[#032a0d]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void submitAppointment()}
              disabled={bookingMutation.isPending || slots.length === 0}
              className="flex h-11 items-center justify-center gap-2 rounded bg-[#032a0d] px-4 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#064016] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CalendarCheck className="size-4" />
              {bookingMutation.isPending
                ? "Submitting..."
                : "Submit Appointment Request"}
            </button>
          </div>
          <p className="text-center text-xs text-zinc-500">
            By submitting, you agree to our terms and conditions.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export function ChaplainDirectory({
  chaplains,
  service,
}: {
  chaplains: Chaplain[];
  service: BookingService | null;
}) {
  const [selectedChaplain, setSelectedChaplain] =
    React.useState<Chaplain | null>(null);

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
            <div className="relative aspect-3/4 overflow-hidden">
              <Image
                src={buildProfileImage(chaplain)}
                alt={buildFullName(chaplain)}
                fill
                className="object-contain"
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
        service={service}
        open={Boolean(selectedChaplain)}
        onOpenChange={(open) => {
          if (!open) setSelectedChaplain(null);
        }}
      />
    </>
  );
}
