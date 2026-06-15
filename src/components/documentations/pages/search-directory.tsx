import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Check,
  ChevronRight,
  Filter,
  ListFilter,
  ShieldCheck,
} from "lucide-react";
import {
  IconBuildingChurch,
  IconIdBadge2,
  IconMapPinFilled,
  IconUsersGroup,
} from "@tabler/icons-react";

import { OnThisPageRegister } from "@/components/documentations/OnThisPageRegister";

const ON_THIS_PAGE = [
  { label: "Overview", href: "#overview" },
  { label: "Search Flow", href: "#search-flow" },
  { label: "Directory Records", href: "#directory-records" },
  { label: "Filters", href: "#filters" },
  { label: "Open a Record", href: "#open-a-record" },
  { label: "Privacy Notes", href: "#privacy-notes" },
  { label: "Troubleshooting", href: "#troubleshooting" },
];

const searchSteps = [
  "Open the search or directory page from the public website navigation.",
  "Enter a name, office, location, branch, or other supported keyword.",
  "Review the matching records shown in the results list.",
  "Use filters when there are too many results.",
  "Open a record to view the public details available for that listing.",
];

const directoryTypes = [
  {
    title: "Members",
    description:
      "Public member records may show basic profile information, membership identity, branch details, and public status.",
    icon: IconUsersGroup,
  },
  {
    title: "Officers",
    description:
      "Officer listings help visitors identify public office holders and assigned organization roles.",
    icon: IconIdBadge2,
  },
  {
    title: "Branches and Areas",
    description:
      "Location-related records help users find records by branch, area, region, province, city, or municipality.",
    icon: IconMapPinFilled,
  },
  {
    title: "Ministry and Church Details",
    description:
      "When available, public records may include church background, ministry affiliation, or related service details.",
    icon: IconBuildingChurch,
  },
];

const filterRows = [
  {
    filter: "Keyword",
    use: "Searches by visible text such as names, titles, office labels, or other indexed public fields.",
    bestFor: "Finding a known person or record quickly.",
  },
  {
    filter: "Location",
    use: "Narrows results by geographic fields such as region, province, city, municipality, or branch area.",
    bestFor: "Finding records connected to a place.",
  },
  {
    filter: "Category",
    use: "Limits the directory to a specific type of listing when the page supports multiple record types.",
    bestFor: "Separating members, officers, offices, or organization records.",
  },
  {
    filter: "Status",
    use: "Shows only records that match the selected public status or membership condition when available.",
    bestFor: "Reviewing currently visible or active listings.",
  },
];

const openRecordSteps = [
  "Select the record card or row from the search results.",
  "Confirm the profile name, public role, or location details.",
  "Check any linked public sections such as certificates, offices, or activity records.",
  "Return to the results list if the opened record is not the one you need.",
];

const privacyNotes = [
  "Only public fields should appear in search and directory results.",
  "Private account information, password data, and protected admin details should never be exposed through public search.",
  "Some records may be hidden if the user is inactive, restricted, pending review, or not approved for public display.",
  "If a public record looks incorrect, an authorized admin should update the source profile rather than editing the directory result directly.",
];

const troubleshooting = [
  {
    title: "No results",
    description:
      "Try a shorter keyword, remove filters, or search by location instead of full name.",
  },
  {
    title: "Too many results",
    description:
      "Add a location, category, office, or status filter to narrow the results.",
  },
  {
    title: "Record looks outdated",
    description:
      "Ask an authorized admin to review the source member, officer, or branch record.",
  },
  {
    title: "Record is missing",
    description:
      "The record may be private, pending approval, inactive, restricted, or not yet published to the public directory.",
  },
];

const SearchDirectory = () => {
  return (
    <article className="mx-auto max-w-5xl pb-12">
      <OnThisPageRegister items={ON_THIS_PAGE} />

      <section id="overview" className="scroll-mt-36">
        <h1 className="mt-3 text-2xl font-bold tracking-tighter text-foreground">
          Search and Directory
        </h1>
        <div className="mt-6 space-y-5 text-muted-foreground">
          <p>
            This guide explains how visitors use search and directory pages to
            find public records on the Pearl of the Orient website. Directory
            results are meant for public discovery, identity checking, and
            record lookup.
          </p>
          <p>
            Search results depend on the fields the system has published for
            public viewing. Some records may exist in the admin portal but stay
            hidden from public search because of status, privacy, or approval
            rules.
          </p>
        </div>
      </section>

      <section id="search-flow" className="mt-14 scroll-mt-36">
        <FullScreenShotSection
          title="Search Flow"
          description="Use the search box to find public records by keyword. Results can be scanned from the list, filtered when needed, and opened for more details."
          imageSrc="/docs-screenshots/search.png"
          imageAlt="Placeholder screenshot for search and directory results"
        >
          <ol className="mt-5 space-y-3">
            {searchSteps.map((step) => (
              <li key={step} className="flex gap-2 text-sm">
                <Check className="mt-1 size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </FullScreenShotSection>
      </section>

      <section id="directory-records" className="mt-14 scroll-mt-36">
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          Directory Records
        </h2>
        <p className="mt-3 text-muted-foreground">
          The directory can contain different public record types depending on
          what the organization publishes.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {directoryTypes.map((record) => {
            const Icon = record.icon;

            return (
              <div key={record.title} className="rounded-lg border bg-card p-5">
                <div className="flex size-11 items-center justify-center rounded-md border bg-background text-[#0f6b2a]">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 font-semibold text-card-foreground">
                  {record.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {record.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="filters" className="mt-14 scroll-mt-36">
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          Filters
        </h2>
        <p className="mt-3 text-muted-foreground">
          Filters help reduce a large result set to the records most likely to
          match the visitor&apos;s intent.
        </p>

        <div className="mt-6 overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/60 text-foreground">
              <tr>
                <th className="border-b px-4 py-3 font-semibold">Filter</th>
                <th className="border-b px-4 py-3 font-semibold">Use</th>
                <th className="border-b px-4 py-3 font-semibold">Best for</th>
              </tr>
            </thead>
            <tbody>
              {filterRows.map((row) => (
                <tr key={row.filter} className="border-b last:border-b-0">
                  <td className="px-4 py-4 font-medium text-foreground">
                    {row.filter}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {row.use}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {row.bestFor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="open-a-record" className="mt-14 scroll-mt-36">
        <FullScreenShotSection
          title="Open a Record"
          description="A directory result may open a public profile or detail page. This gives visitors more context than the result list while keeping protected account data hidden."
          imageSrc="/docs-screenshots/directory.png"
          imageAlt="Placeholder screenshot for a public directory record detail page"
        >
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {openRecordSteps.map((step) => (
              <li key={step} className="flex gap-2 text-sm">
                <Check className="mt-1 size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ul>
        </FullScreenShotSection>
      </section>

      <section id="privacy-notes" className="mt-14 scroll-mt-36">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-[#0f6b2a]/10 text-[#0f6b2a]">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tighter text-foreground">
                Privacy Notes
              </h2>
              <p className="text-muted-foreground">
                Public search should show only information intended for public
                viewing.
              </p>
            </div>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {privacyNotes.map((note) => (
              <li key={note} className="flex items-start gap-2 text-sm">
                <Filter className="mt-1 size-4 shrink-0 text-[#0f6b2a]" />
                <span className="text-muted-foreground">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="troubleshooting" className="mt-14 scroll-mt-36">
        <div className="rounded-lg border bg-muted/30 p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground">
              <ListFilter className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tighter text-foreground">
                Troubleshooting
              </h2>
              <p className="text-muted-foreground">
                Use these checks when search results do not match what the
                visitor expects.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {troubleshooting.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border bg-background p-4"
              >
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-14 space-y-8">
        <Link
          href="/documentation#become-a-member"
          className="group flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:border-[#0f6b2a]/50 hover:bg-[#0f6b2a]/5"
        >
          <div>
            <p className="text-xs font-medium text-muted-foreground">Next</p>
            <p className="text-lg font-semibold text-foreground">
              Become a Member
            </p>
          </div>
          <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Last updated June 7, 2026
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            &copy; 2026 Pearl of the Orient International Auxiliary Chaplain
            Values Educators Inc.
          </p>
        </div>
      </footer>
    </article>
  );
};

const FullScreenShotSection = ({
  title,
  description,
  imageSrc,
  imageAlt,
  children,
}: {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  children: ReactNode;
}) => {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <ScreenshotPlaceholder src={imageSrc} alt={imageAlt} />
      <div className="border-t p-6">
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          {title}
        </h2>
        <p className="mt-3 text-muted-foreground">{description}</p>
        {children}
      </div>
    </div>
  );
};

const ScreenshotPlaceholder = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="bg-background">
      <div className="relative aspect-video min-h-70">
        <Image src={src} alt={alt} fill />
      </div>
    </div>
  );
};

export default SearchDirectory;
