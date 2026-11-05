import { officeDirectoryPages } from "../_components/office-directory-data";
import { OfficeDirectoryPage } from "../_components/office-directory-page";
import {
  formatPublishedOfficerName,
  getPublicOrganizationalStructure,
} from "@/lib/public-organizational-structure";

export const dynamic = "force-dynamic";

const Page = async () => {
  const offices = await getPublicOrganizationalStructure();
  const people = offices
    .filter((office) => office.level !== "CHIEF_CHAPLAIN")
    .flatMap((office) => office.officers.map((officer) => ({
      name: formatPublishedOfficerName(officer.name, officer.currentPositionRole),
      role: officer.scopeLabel
        ? `${office.name}, ${officer.scopeLabel}`
        : office.name,
      group: office.name,
      image: officer.avatar ?? undefined,
      memberNumber: officer.memberNumber,
      memberType: officer.memberType,
      jurisdiction: officer.jurisdiction,
    })));

  return (
    <OfficeDirectoryPage
      data={{
        ...officeDirectoryPages["office-national-director"],
        people,
        emptyMessage: "No public director assignments have been published yet.",
        collapsibleGroups: true,
      }}
    />
  );
};

export default Page;
