export type PublicOfficeSection = {
  id?: string;
  title: string;
  type: "list" | "richtext";
  items?: { id?: string; content: string }[];
  content?: string;
};

export type PublicOffice = {
  id: string;
  name: string;
  level: string;
  description: string | null;
  sections: PublicOfficeSection[];
  sortOrder: number;
  reportsToId: string | null;
  officers: {
    id: string;
    memberId: string;
    memberNumber: string | null;
    name: string;
    avatar: string | null;
    memberType: string;
    currentPositionRole: string | null;
    scopeLabel: string | null;
    jurisdiction: string | null;
    startDate: string;
  }[];
};

const apiBaseUrl = process.env.NODE_ENV === "development"
  ? process.env.NEXT_PUBLIC_API_BASE_URL_DEV
  : process.env.NEXT_PUBLIC_API_BASE_URL_PROD;

/** Returns only offices and assignments published for the public website. */
export async function getPublicOrganizationalStructure(): Promise<PublicOffice[]> {
  if (!apiBaseUrl) return [];

  try {
    const response = await fetch(`${apiBaseUrl}/offices/public/organizational-structure`, {
      cache: "no-store",
    });
    if (!response.ok) return [];

    const payload = (await response.json()) as { data?: PublicOffice[] };
    return payload.data ?? [];
  } catch {
    return [];
  }
}

export function formatPublishedOfficerName(
  name: string,
  currentPositionRole: string | null,
) {
  const role = currentPositionRole?.trim().toLowerCase();
  if (!role) return name;

  const prefix = role === "pastor"
    ? "Ptr."
    : role === "rev" || role === "rev."
      ? "Rev."
      : role === "bishop"
        ? "Bishop"
        : "Chap.";

  return `${prefix} ${name}`;
}

export function formatMemberType(memberType: string) {
  return memberType
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}
