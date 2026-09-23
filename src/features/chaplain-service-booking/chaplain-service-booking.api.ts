import { api, ensureAccessToken } from "@/lib/http-client";
import type {
  BookingService,
  ChaplainServiceBookingResult,
  CreateChaplainServiceBookingRequest,
  ProviderChaplainServiceBooking,
  RequesterChaplainServiceBooking,
  UpdateProviderBookingStatusRequest,
} from "./chaplain-service-booking.types";

export async function getPublicChaplainServices() {
  const { data } = await api.get<{ data: BookingService[] }>(
    "/chaplain-services/public",
  );
  return data.data;
}

export async function getCurrentRequesterBookings() {
  await ensureAccessToken();
  const { data } = await api.get<{ data: RequesterChaplainServiceBooking[] }>(
    "/chaplain-services/my-bookings",
  );
  return data.data;
}

export async function cancelCurrentRequesterBooking({ id, reason }: { id: string; reason: string }) {
  const { data } = await api.patch<{ data: RequesterChaplainServiceBooking }>(
    `/chaplain-services/my-bookings/${encodeURIComponent(id)}/cancel`,
    { reason },
  );
  return data.data;
}

export async function createChaplainServiceBooking(
  payload: CreateChaplainServiceBookingRequest,
) {
  const { data } = await api.post<{ data: ChaplainServiceBookingResult }>(
    "/chaplain-services/public/bookings",
    payload,
  );
  return data.data;
}

export async function getCurrentProviderBookings() {
  const { data } = await api.get<{ data: ProviderChaplainServiceBooking[] }>(
    "/chaplain-services/current/bookings",
  );
  return data.data;
}

export async function updateCurrentProviderBookingStatus({
  id,
  ...payload
}: UpdateProviderBookingStatusRequest) {
  const { data } = await api.patch<{ data: ProviderChaplainServiceBooking }>(
    `/chaplain-services/current/bookings/${encodeURIComponent(id)}/status`,
    payload,
  );
  return data.data;
}
