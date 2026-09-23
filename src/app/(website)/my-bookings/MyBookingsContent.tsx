"use client";

import { format } from "date-fns";
import { CalendarCheck, Clock3, MapPin, ReceiptText, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCancelCurrentRequesterBookingMutation, useCurrentRequesterBookingsQuery } from "@/features/chaplain-service-booking/chaplain-service-booking.hooks";
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";
import type { RequesterChaplainServiceBooking } from "@/features/chaplain-service-booking/chaplain-service-booking.types";
import { useToast } from "@/hooks/use-toast";
import { toApiError } from "@/lib/http-client";

const displayStatus = (value: string) => value.replaceAll("_", " ");
const chaplainName = (booking: RequesterChaplainServiceBooking) => [booking.providerMember.firstName, booking.providerMember.middleInitial, booking.providerMember.lastName, booking.providerMember.extensionName].filter(Boolean).join(" ");
const cancellable = (status: string) => ["PENDING", "AWAITING_CHAPLAIN_APPROVAL", "RESCHEDULED", "CONFIRMED"].includes(status);

export function MyBookingsContent() {
  const currentUserQuery = useCurrentUserQuery();
  const query = useCurrentRequesterBookingsQuery(Boolean(currentUserQuery.data));
  const cancelMutation = useCancelCurrentRequesterBookingMutation();
  const { toast } = useToast();
  const [cancelling, setCancelling] = useState<RequesterChaplainServiceBooking | null>(null);
  const [reason, setReason] = useState("");

  const cancelBooking = async () => {
    if (!cancelling || !reason.trim()) return;
    try {
      await cancelMutation.mutateAsync({ id: cancelling.id, reason: reason.trim() });
      toast({ variant: "success", title: "Booking cancelled", description: "The requester and assigned chaplain records were updated." });
      setCancelling(null);
      setReason("");
    } catch (error) {
      toast({ variant: "error", title: "Unable to cancel booking", description: toApiError(error).message });
    }
  };

  const isLoading = currentUserQuery.isLoading || (Boolean(currentUserQuery.data) && query.isLoading);
  const requestError = currentUserQuery.error ?? query.error;
  const apiError = requestError ? toApiError(requestError) : null;
  const isAuthenticationError = apiError?.code === "UNAUTHORIZED" || apiError?.code === "FORBIDDEN";

  return <main className="min-h-[60vh] bg-neutral-50 py-10 sm:py-12">
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      {isLoading ? <Card><CardContent className="py-12 text-center text-neutral-500">Loading your bookings...</CardContent></Card> : requestError ? <Card><CardContent className="py-12 text-center"><p className="font-medium text-red-700">{apiError?.message ?? "Unable to load your bookings."}</p>{isAuthenticationError ? <Button asChild className="mt-4"><Link href="/sign-in">Sign in</Link></Button> : <Button className="mt-4" onClick={() => void Promise.all([currentUserQuery.refetch(), query.refetch()])}>Try again</Button>}</CardContent></Card> : (query.data?.length ?? 0) === 0 ? <Card><CardContent className="py-16 text-center"><CalendarCheck className="mx-auto size-12 text-neutral-300"/><h2 className="mt-4 text-xl font-semibold">No bookings yet</h2><p className="mt-2 text-neutral-500">Your submitted service appointments will appear here.</p><Button asChild className="mt-5"><Link href="/book-a-service">Book a service</Link></Button></CardContent></Card> : <div className="space-y-5">{query.data?.map((booking) => <Card key={booking.id} className="overflow-hidden pt-0"><CardHeader className="border-b bg-[#f7faf7] pt-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-[#032a0d]">{booking.service.name}</CardTitle><CardDescription className="mt-1">Requested {format(new Date(booking.createdAt), "MMM d, yyyy")}</CardDescription></div><Badge>{displayStatus(booking.status)}</Badge></div></CardHeader><CardContent className="space-y-5">
        <div className="grid gap-3 text-sm sm:grid-cols-2"><p className="flex gap-2"><UserRound className="size-4 text-[#032a0d]" />{chaplainName(booking)}</p><p className="flex gap-2"><Clock3 className="size-4 text-[#032a0d]" />{format(new Date(booking.preferredAt), "EEEE, MMM d, yyyy 'at' h:mm a")}</p><p className="flex gap-2"><MapPin className="size-4 text-[#032a0d]" />{displayStatus(booking.deliveryMethod)} · {booking.locationDetails}</p><p className="flex gap-2"><ReceiptText className="size-4 text-[#032a0d]" />{booking.providerServiceFee === null ? "No service fee recorded" : `₱${booking.providerServiceFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} · {displayStatus(booking.requesterPaymentStatus)}</p></div>
        {booking.notes ? <p className="rounded-md bg-neutral-50 p-3 text-sm text-neutral-600">{booking.notes}</p> : null}
        <div><h3 className="font-semibold">Status history</h3><div className="mt-3 space-y-3">{booking.history.map((entry) => <div key={entry.id} className="border-l-2 border-[#032a0d] pl-3 text-sm"><p className="font-medium">{displayStatus(entry.status)}</p><p className="text-xs text-neutral-500">{format(new Date(entry.createdAt), "MMM d, yyyy h:mm a")}{entry.reason ? ` · ${entry.reason}` : ""}</p></div>)}</div></div>
        {cancellable(booking.status) ? <div className="flex justify-end"><Button variant="outline" onClick={() => setCancelling(booking)}><X className="size-4" />Cancel booking</Button></div> : null}
      </CardContent></Card>)}</div>}
    </section>
    <Dialog open={Boolean(cancelling)} onOpenChange={(open) => !open && setCancelling(null)}><DialogContent><DialogHeader><DialogTitle>Cancel booking?</DialogTitle></DialogHeader><div className="grid gap-2"><Label htmlFor="requester-cancel-reason">Reason</Label><Textarea id="requester-cancel-reason" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Tell us why you need to cancel." /></div><DialogFooter><Button variant="outline" onClick={() => setCancelling(null)}>Go back</Button><Button variant="destructive" disabled={!reason.trim() || cancelMutation.isPending} onClick={() => void cancelBooking()}>Cancel booking</Button></DialogFooter></DialogContent></Dialog>
  </main>;
}
