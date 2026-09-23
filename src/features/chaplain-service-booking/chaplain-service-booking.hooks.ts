import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createChaplainServiceBooking,
  getPublicChaplainServices,
  getCurrentProviderBookings,
  getCurrentRequesterBookings,
  cancelCurrentRequesterBooking,
  updateCurrentProviderBookingStatus,
} from "./chaplain-service-booking.api";

export const usePublicChaplainServicesQuery = (enabled = true) =>
  useQuery({
    queryKey: ["chaplain-services", "public"],
    queryFn: getPublicChaplainServices,
    enabled,
    staleTime: 60_000,
  });

export const useCreateChaplainServiceBookingMutation = () =>
  useMutation({
    mutationFn: createChaplainServiceBooking,
    meta: { feature: "chaplainServiceBooking.create" },
  });

const providerBookingsKey = ["chaplain-service-bookings", "provider"];

export const useCurrentProviderBookingsQuery = (enabled = true) =>
  useQuery({
    queryKey: providerBookingsKey,
    queryFn: getCurrentProviderBookings,
    enabled,
    staleTime: 15_000,
  });

export const useUpdateCurrentProviderBookingStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCurrentProviderBookingStatus,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: providerBookingsKey });
    },
    meta: { feature: "chaplainServiceBooking.providerUpdate" },
  });
};

const requesterBookingsKey = ["chaplain-service-bookings", "requester"];

export const useCurrentRequesterBookingsQuery = (enabled = true) =>
  useQuery({
    queryKey: requesterBookingsKey,
    queryFn: getCurrentRequesterBookings,
    staleTime: 15_000,
    enabled,
  });

export const useCancelCurrentRequesterBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelCurrentRequesterBooking,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: requesterBookingsKey });
    },
    meta: { feature: "chaplainServiceBooking.requesterCancel" },
  });
};
