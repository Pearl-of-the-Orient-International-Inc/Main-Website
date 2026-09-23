export interface BookingService {
  id: string;
  name: string;
  description: string;
  availability: string | null;
}

export type BookingDeliveryMethod = "ON_SITE" | "ONLINE" | "PHONE";

export interface CreateChaplainServiceBookingRequest {
  serviceId: string;
  providerMemberId: string;
  availabilitySlotId: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  preferredAt: string;
  deliveryMethod: BookingDeliveryMethod;
  locationDetails: string;
  notes?: string;
}

export interface ChaplainServiceBookingResult {
  id: string;
  preferredAt: string;
  status: "PENDING";
  deliveryMethod: BookingDeliveryMethod;
  locationDetails: string;
  createdAt: string;
  service: { id: string; name: string };
  providerMember: {
    id: string;
    uniqueId: string | null;
    firstName: string;
    middleInitial: string | null;
    lastName: string;
    extensionName: string | null;
  };
}

export type ChaplainServiceBookingStatus =
  | "PENDING"
  | "AWAITING_CHAPLAIN_APPROVAL"
  | "CONFIRMED"
  | "RESCHEDULED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

export interface ProviderChaplainServiceBooking {
  id: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  preferredAt: string;
  deliveryMethod: BookingDeliveryMethod;
  locationDetails: string;
  notes: string | null;
  status: ChaplainServiceBookingStatus;
  statusReason: string | null;
  providerServiceFee: number | null;
  providerCommissionAmount: number | null;
  providerCommissionStatus: "NOT_APPLICABLE" | "PENDING" | "SETTLED" | "WAIVED";
  requesterPaymentStatus: "NOT_REQUIRED" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  createdAt: string;
  service: { id: string; name: string; commissionPercent: number | null };
  history: Array<{
    id: string;
    status: ChaplainServiceBookingStatus;
    reason: string | null;
    createdAt: string;
  }>;
}

export interface UpdateProviderBookingStatusRequest {
  id: string;
  status: "CONFIRMED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  reason?: string;
}

export type RequesterChaplainServiceBooking = ProviderChaplainServiceBooking & {
  providerMember: {
    id: string;
    uniqueId: string | null;
    firstName: string;
    middleInitial: string | null;
    lastName: string;
    extensionName: string | null;
  };
};
