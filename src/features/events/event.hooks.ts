import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as eventApi from "./event.api";

export const usePublicEventsQuery = () =>
  useQuery({ queryKey: ["events", "public"], queryFn: eventApi.getPublicEvents });

export const usePublicEventQuery = (eventId: string) =>
  useQuery({
    queryKey: ["events", "public", eventId],
    queryFn: () => eventApi.getPublicEvent(eventId),
    enabled: Boolean(eventId),
  });

export const useJoinEventMutation = () =>
  {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: eventApi.joinEvent,
      onSuccess: async (_response, eventId) => {
        await queryClient.invalidateQueries({
          queryKey: ["events", "my-registration", eventId],
        });
      },
    });
  };

export const useMyEventRegistrationQuery = (eventId: string, enabled: boolean) =>
  useQuery({
    queryKey: ["events", "my-registration", eventId],
    queryFn: () => eventApi.getMyEventRegistration(eventId),
    enabled: Boolean(eventId) && enabled,
    retry: false,
  });
