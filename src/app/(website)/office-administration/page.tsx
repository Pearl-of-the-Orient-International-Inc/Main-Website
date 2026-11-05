import { officeDirectoryPages } from "../_components/office-directory-data";
import { OfficeDirectoryPage } from "../_components/office-directory-page";

const apiBaseUrl = process.env.NODE_ENV === "development"
  ? process.env.NEXT_PUBLIC_API_BASE_URL_DEV
  : process.env.NEXT_PUBLIC_API_BASE_URL_PROD;

export const dynamic = "force-dynamic";

type AdministrationStaff = {
  id: string;
  name: string;
  avatar: string | null;
  position: string;
};

const positionLabels: Record<string, string> = {
  CLERK: "Clerk",
  HR: "Human Resources",
  IT: "Information Technology",
  ACCOUNTING_FINANCE: "Accounting & Finance",
  OPERATIONS: "Operations",
  SECRETARIAT: "Secretariat",
};

const formatPosition = (position: string) =>
  positionLabels[position] ?? position
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");

const Page = async () => {
  let staff: AdministrationStaff[] = [];

  if (apiBaseUrl) {
    try {
      const response = await fetch(`${apiBaseUrl}/users/public/administration`, {
        cache: "no-store",
      });
      if (response.ok) {
        const payload = await response.json() as { data?: AdministrationStaff[] };
        staff = payload.data ?? [];
      }
    } catch {
      // Keep the public page available when the API is temporarily unavailable.
    }
  }

  return (
    <OfficeDirectoryPage
      data={{
        ...officeDirectoryPages["office-administration"],
        people: staff.map((person) => ({
          name: person.name,
          role: formatPosition(person.position),
          image: person.avatar ?? undefined,
        })),
        emptyMessage: "No active administration staff have been published yet.",
      }}
    />
  );
};

export default Page;
