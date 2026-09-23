"use client";

import { useMemo, useState } from "react";
import { format, isSameDay, startOfDay } from "date-fns";
import { CalendarClock, Clock3, Plus, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  toApiError,
  useCreateChaplainServiceAvailabilityMutation,
  useDeleteChaplainServiceAvailabilityMutation,
  usePublicChaplainServiceAvailabilityQuery,
} from "@/features/member/member.hooks";
import { useToast } from "@/hooks/use-toast";

const combineDateAndTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
  );
};

export function ServiceAvailabilityCard({
  memberId,
  canManage,
}: {
  memberId: string;
  canManage: boolean;
}) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [note, setNote] = useState("");
  const query = usePublicChaplainServiceAvailabilityQuery(memberId);
  const createMutation = useCreateChaplainServiceAvailabilityMutation(memberId);
  const deleteMutation = useDeleteChaplainServiceAvailabilityMutation(memberId);
  const slots = useMemo(() => query.data ?? [], [query.data]);
  const selectedSlots = slots.filter((slot) =>
    isSameDay(new Date(slot.startsAt), selectedDate),
  );
  const availableDates = slots.map((slot) => new Date(slot.startsAt));

  const addSlot = async () => {
    const startsAt = combineDateAndTime(selectedDate, startTime);
    const endsAt = combineDateAndTime(selectedDate, endTime);
    if (startsAt <= new Date() || endsAt <= startsAt) {
      toast({
        title: "Invalid availability",
        description:
          "Choose a future time range with an end time after the start time.",
        variant: "error",
      });
      return;
    }
    try {
      await createMutation.mutateAsync({
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        note: note.trim() || undefined,
      });
      setDialogOpen(false);
      setNote("");
      toast({
        title: "Availability added",
        description: `${format(startsAt, "MMM d, yyyy h:mm a")}–${format(endsAt, "h:mm a")} is now available.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Unable to add availability",
        description: toApiError(error).message,
        variant: "error",
      });
    }
  };

  const removeSlot = async (slotId: string) => {
    try {
      await deleteMutation.mutateAsync(slotId);
      toast({
        title: "Availability removed",
        description: "The time slot is no longer offered.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Unable to remove availability",
        description: toApiError(error).message,
        variant: "error",
      });
    }
  };

  return (
    <>
      <Card className="overflow-hidden pt-0! border-[#032a0d]/15 bg-white shadow-sm">
        <CardHeader className="border-b pt-4 bg-[#f7faf7] flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-[#032a0d]">
              <CalendarClock className="size-5" />
              Service Availability
            </CardTitle>
            <CardDescription className="mt-1">
              Upcoming dates and times available for chaplain service requests.
            </CardDescription>
          </div>
          {canManage ? (
            <Button
              size="sm"
              onClick={() => setDialogOpen(true)}
              className="mt-3 bg-[#032a0d] hover:bg-[#064016] sm:mt-0"
            >
              <Plus className="size-4" />
              Add availability
            </Button>
          ) : null}
        </CardHeader>
        <CardContent className="grid gap-5 p-5 md:grid-cols-[auto_1fr]">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            disabled={{ before: startOfDay(new Date()) }}
            modifiers={{ available: availableDates }}
            modifiersClassNames={{
              available:
                "font-bold text-emerald-700 after:absolute after:bottom-1 after:size-1 after:rounded-full after:bg-emerald-600",
            }}
            className="rounded-md border"
          />
          <div className="min-w-0">
            <h3 className="font-semibold text-[#032a0d]">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h3>
            <div className="mt-3 space-y-2">
              {query.isLoading ? (
                <p className="text-sm text-neutral-500">
                  Loading availability…
                </p>
              ) : selectedSlots.length === 0 ? (
                <div className="rounded-md border border-dashed p-5 text-sm text-neutral-500">
                  No availability listed for this date.
                </div>
              ) : (
                selectedSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center gap-3 rounded-md border border-emerald-100 bg-emerald-50/60 p-3"
                  >
                    <Clock3 className="size-4 shrink-0 text-emerald-800" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-emerald-950">
                        {format(new Date(slot.startsAt), "h:mm a")} –{" "}
                        {format(new Date(slot.endsAt), "h:mm a")}
                      </p>
                      {slot.note ? (
                        <p className="truncate text-xs text-emerald-900/70">
                          {slot.note}
                        </p>
                      ) : null}
                    </div>
                    {canManage ? (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        disabled={deleteMutation.isPending}
                        onClick={() => void removeSlot(slot.id)}
                        aria-label="Remove availability"
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl!">
          <DialogHeader>
            <DialogTitle>Add service availability</DialogTitle>
            <DialogDescription>
              Select a future date and the time range when you can accept a
              service request.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 md:grid-cols-[auto_1fr]">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              disabled={{ before: startOfDay(new Date()) }}
              className="rounded-md border"
            />
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input value={format(selectedDate, "MMMM d, yyyy")} readOnly />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="availability-start">Start time</Label>
                  <Input
                    id="availability-start"
                    type="time"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="availability-end">End time</Label>
                  <Input
                    id="availability-end"
                    type="time"
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="availability-note">Note (optional)</Label>
                <Textarea
                  id="availability-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  maxLength={500}
                  placeholder="e.g. Available for online counseling only"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={createMutation.isPending}
              onClick={() => void addSlot()}
            >
              {createMutation.isPending ? "Saving…" : "Add availability"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
