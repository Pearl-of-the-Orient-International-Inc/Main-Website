export interface AccountSessionLocation {
  city: string | null;
  region: string | null;
  country: string | null;
  label: string;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
}

export interface AccountSession {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  expiredAt: string;
  isCurrent: boolean;
  location: AccountSessionLocation;
}

export interface UserSessionsResponse {
  code: string;
  message: string;
  data: {
    currentSession: AccountSession | null;
    sessions: AccountSession[];
  };
}

export interface ChangePasswordRequest {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export interface TwoFactorSetupData {
  secret: string;
  otpauthUrl: string;
  qrCodeDataUrl: string;
}

export interface TwoFactorSetupResponse {
  code: string;
  message: string;
  data: TwoFactorSetupData;
}

export interface EnableTwoFactorRequest {
  token: string;
}

export interface ActivityLog {
  id: string;
  actorId: string;
  userId: string | null;
  actorName: string | null;
  actorEmail: string | null;
  actorAvatar: string | null;
  actionType: string;
  actionLabel: string;
  moduleLabel: string;
  targetLabel: string | null;
  description: string | null;
  result: string;
  timestamp: string;
  ipAddress: string;
  deviceLabel: string;
  metadata: string[];
}

export interface ActivityLogsResponse {
  code: string;
  message: string;
  data: ActivityLog[];
}
