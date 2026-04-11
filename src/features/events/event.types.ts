export type EventCategory =
  | "CONFERENCE"
  | "OUTREACH"
  | "TRAINING"
  | "WORSHIP"
  | "ORIENTATION"
  | "SEMINAR"
  | "FELLOWSHIP"
  | "PRAYER"
  | "OTHER";

export type EventType = "ONSITE" | "ONLINE";

export type EventStatus = "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";

export type EventVisibility = "PUBLIC" | "PRIVATE";

export type EventMeetingPlatform =
  | "ZOOM"
  | "GOOGLE_MEET"
  | "MICROSOFT_TEAMS"
  | "OTHER";

export interface EventResource {
  id: string;
  name: string;
  category: EventCategory;
  type: EventType;
  location: string | null;
  onlineLink: string | null;
  meetingPlatform: EventMeetingPlatform | null;
  meetingId: string | null;
  meetingPassword: string | null;
  description: string;
  thumbnailUrl: string;
  organizer: string;
  startsAt: string;
  endsAt: string;
  status: EventStatus;
  visibility: EventVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface EventPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PublicEventsResponse {
  code: string;
  message: string;
  data: EventResource[];
  pagination: EventPagination;
}
