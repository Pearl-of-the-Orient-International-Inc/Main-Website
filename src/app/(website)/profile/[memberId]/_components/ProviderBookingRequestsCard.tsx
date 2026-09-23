"use client";

import { format } from "date-fns";
import { CalendarCheck, Check, Clock3, MapPin, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCurrentProviderBookingsQuery,
  useUpdateCurrentProviderBookingStatusMutation,
} from "@/features/chaplain-service-booking/chaplain-service-booking.hooks";
import type {
  ProviderChaplainServiceBooking,
} from "@/features/chaplain-service-booking/chaplain-service-booking.types";
import { useToast } from "@/hooks/use-toast";
import { toApiError } from "@/lib/http-client";

export function ProviderBookingRequestsCard() {
  const query = useCurrentProviderBookingsQuery();
  const mutation = useUpdateCurrentProviderBookingStatusMutation();
  const { toast } = useToast();
  const [reasonAction, setReasonAction] = useState<{
    booking: ProviderChaplainServiceBooking;
    status: "REJECTED" | "CANCELLED";
  } | null>(null);
  const [reason, setReason] = useState("");
  const bookings = query.data ?? [];
  const activeBookings = bookings.filter((booking) =>
    ["AWAITING_CHAPLAIN_APPROVAL", "RESCHEDULED", "CONFIRMED"].includes(booking.status),
  );
  const previousBookings = bookings.filter((booking) =>
    !["PENDING", "AWAITING_CHAPLAIN_APPROVAL", "RESCHEDULED", "CONFIRMED"].includes(booking.status),
  );

  const update = async (
    booking: ProviderChaplainServiceBooking,
    status: "CONFIRMED" | "REJECTED" | "COMPLETED" | "CANCELLED",
    actionReason?: string,
  ) => {
    try {
      await mutation.mutateAsync({ id: booking.id, status, reason: actionReason });
      toast({
        title: status === "CONFIRMED" ? "Booking approved" : "Booking updated",
        description: `${booking.service.name} is now ${status.toLowerCase()}.`,
        variant: "success",
      });
      setReasonAction(null);
      setReason("");
    } catch (error) {
      toast({
        title: "Unable to update booking",
        description: toApiError(error).message,
        variant: "error",
      });
    }
  };

  return (
    <>
      <Card className="overflow-hidden border-[#032a0d]/15 bg-white pt-0! shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-[#f7faf7] pt-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-[#032a0d]"><CalendarCheck className="size-5" />Booking Requests</CardTitle>
            <CardDescription className="mt-1">Approve or reject service requests assigned to you.</CardDescription>
          </div>
          <Badge variant="outline">{activeBookings.length} active</Badge>
        </CardHeader>
        <CardContent className="space-y-3 p-5">
          {query.isLoading ? <p className="text-sm text-neutral-500">Loading booking requests...</p> : query.isError ? (
            <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{toApiError(query.error).message}</p>
          ) : activeBookings.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-neutral-500">No active booking requests.</div>
          ) : activeBookings.map((booking) => (
            <article key={booking.id} className="rounded-md border border-neutral-200 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-[#032a0d]">{booking.service.name}</h3><Badge variant={booking.status === "CONFIRMED" ? "default" : "secondary"}>{booking.status === "AWAITING_CHAPLAIN_APPROVAL" ? "ACTION REQUIRED" : booking.status.replaceAll("_", " ")}</Badge></div>
                  <p className="mt-1 text-sm font-medium">{booking.requesterName}</p>
                  <p className="text-xs text-neutral-500">{booking.requesterEmail} · {booking.requesterPhone}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {booking.status === "AWAITING_CHAPLAIN_APPROVAL" || booking.status === "RESCHEDULED" ? <>
                    <Button size="sm" variant="outline" disabled={mutation.isPending} onClick={() => setReasonAction({ booking, status: "REJECTED" })}><X className="size-4" />Reject</Button>
                    <Button size="sm" disabled={mutation.isPending} onClick={() => void update(booking, "CONFIRMED")}><Check className="size-4" />Approve</Button>
                  </> : null}
                  {booking.status === "CONFIRMED" ? <>
                    <Button size="sm" variant="outline" disabled={mutation.isPending} onClick={() => setReasonAction({ booking, status: "CANCELLED" })}><X className="size-4" />Cancel</Button>
                    <Button size="sm" disabled={mutation.isPending} onClick={() => void update(booking, "COMPLETED")}><Check className="size-4" />Complete</Button>
                  </> : null}
                </div>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-neutral-600 sm:grid-cols-2">
                <p className="flex gap-2"><Clock3 className="mt-0.5 size-4 shrink-0 text-[#032a0d]" />{format(new Date(booking.preferredAt), "MMM d, yyyy 'at' h:mm a")}</p>
                <p className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-[#032a0d]" />{booking.deliveryMethod.replaceAll("_", " ")} · {booking.locationDetails}</p>
              </div>
              {booking.notes ? <p className="mt-3 rounded bg-neutral-50 p-3 text-sm text-neutral-600">{booking.notes}</p> : null}
              <div className="mt-3 grid gap-2 rounded bg-neutral-50 p-3 text-xs text-neutral-600 sm:grid-cols-2">
                <p>Service fee: {booking.providerServiceFee === null ? "Not recorded" : `₱${booking.providerServiceFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}</p>
                <p>Organization commission due from you: {booking.providerCommissionAmount === null ? "Not applicable" : `₱${booking.providerCommissionAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} · ${booking.providerCommissionStatus.replaceAll("_", " ")}`}</p>
              </div>
            </article>
          ))}
          {previousBookings.length > 0 ? <div className="space-y-2 border-t pt-4"><h3 className="font-semibold text-[#032a0d]">Previous requests</h3>{previousBookings.map((booking) => <div key={booking.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 text-sm"><div><p className="font-medium">{booking.service.name} · {booking.requesterName}</p><p className="text-xs text-neutral-500">{format(new Date(booking.preferredAt), "MMM d, yyyy h:mm a")}</p></div><Badge variant="outline">{booking.status.replaceAll("_", " ")}</Badge></div>)}</div> : null}
        </CardContent>
      </Card>

      <Dialog open={Boolean(reasonAction)} onOpenChange={(open) => !open && setReasonAction(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{reasonAction?.status === "CANCELLED" ? "Cancel confirmed booking?" : "Reject booking request?"}</DialogTitle></DialogHeader>
          <div className="grid gap-2"><Label htmlFor="provider-booking-action-reason">Reason</Label><Textarea id="provider-booking-action-reason" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explain why this booking cannot proceed." /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReasonAction(null)}>Go back</Button>
            <Button variant="destructive" disabled={!reason.trim() || mutation.isPending} onClick={() => reasonAction && void update(reasonAction.booking, reasonAction.status, reason.trim())}>{reasonAction?.status === "CANCELLED" ? "Cancel booking" : "Reject request"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
