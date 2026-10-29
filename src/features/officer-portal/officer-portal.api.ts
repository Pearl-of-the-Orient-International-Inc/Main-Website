import { api } from '@/lib/http-client';

export type OfficerScope = {
  memberId: string;
  assignments: Array<{
    id: string;
    officeTitle: { id: string; name: string; level: string };
    region: string | null;
    province: string | null;
    cityMunicipality: string | null;
    barangay: string | null;
  }>;
};

export type ScopedMember = {
  id: string; uniqueId: string | null; firstName: string; middleInitial: string | null; lastName: string; extensionName: string | null; memberType: string;
  region: string | null; province: string | null; municipalityCity: string | null; barangay: string | null; user: { avatar: string | null };
};

export type OfficerMemo = { id: string; referenceNumber: string; title: string; category: string; status: string; documentName: string; createdAt: string; recipients: unknown[] };

export async function getOfficerScope() {
  const { data } = await api.get<{ data: OfficerScope }>('/members/officer-scope');
  return data.data;
}

export async function getScopedMembers(search = '') {
  const { data } = await api.get<{ data: ScopedMember[]; pagination: { totalCount: number } }>('/members/officer-scope/members', { params: { limit: 100, search: search || undefined } });
  return data;
}

export async function getOfficerMemos() {
  const { data } = await api.get<{ data: OfficerMemo[] }>('/memo-announcements/officer');
  return data.data;
}

export async function createOfficerMemo(payload: { title: string; category: string; summary?: string; content?: string; documentName?: string; docxBase64?: string }) {
  const { data } = await api.post<{ data: OfficerMemo }>('/memo-announcements/officer', payload);
  return data.data;
}
