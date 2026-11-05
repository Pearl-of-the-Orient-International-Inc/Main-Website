import { api } from "@/lib/http-client";
import type { PublicEventResponse, PublicEventsResponse } from "./event.types";

export async function getPublicEvents() {
  const { data } = await api.get<PublicEventsResponse>("/events/public", {
    params: { limit: 100, sortBy: "startsAt", sortOrder: "asc" },
  });
  return data.data;
}

export async function getPublicEvent(eventId: string) {
  const { data } = await api.get<PublicEventResponse>(
    `/events/public/${encodeURIComponent(eventId)}`,
  );
  return data.data;
}

export async function joinEvent(eventId: string) {
  const { data } = await api.post<{ code: string; message: string }>(
    `/events/${encodeURIComponent(eventId)}/join`,
  );
  return data;
}

export async function getMyEventRegistration(eventId: string) {
  const { data } = await api.get<{
    code: string;
    message: string;
    data: {
      registrationStatus: string;
      accessDetails: {
        type: string;
        location: string | null;
        onlineLink: string | null;
        meetingPlatform: string | null;
        meetingId: string | null;
        meetingPassword: string | null;
      } | null;
    };
  }>(`/events/${encodeURIComponent(eventId)}/my-registration`);
  return data;
}
