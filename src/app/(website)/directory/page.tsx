import Link from "next/link";
import {
  Clock3,
  Cross,
  IdCardIcon,
  MapPinned,
  ShieldCheck,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DirectoryRegionMap } from "./_components/directory-region-map";
import type {
  PublicDirectoryLocationsData,
  PublicDirectoryLocationsResponse,
} from "@/lib/api-types";

const apiBaseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_API_BASE_URL_PROD;

async function getDirectoryLocations(): Promise<PublicDirectoryLocationsData | null> {
  if (!apiBaseUrl) {
    return null;
  }

  try {
    const response = await fetch(
      `${apiBaseUrl}/members/public/directory-locations`,
      {
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as PublicDirectoryLocationsResponse;
    return payload.data;
  } catch {
    return null;
  }
}

export default async function DirectoryPage() {
  const directoryData = await getDirectoryLocations();
  const headquarters = directoryData?.headquarters ?? {
    name: "Pearl of the Orient Headquarter",
    address:
      "Blk 151 Lot 14-20 Phase 1, Mabuhay City, Dasmarinas City, Cavite, Philippines",
    latitude: 14.3298,
    longitude: 120.9367,
  };

  return (
    <div className="pb-10">
      {/* Hero / Banner */}
      <section className="relative bg-[#032a0d] text-white">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-40" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 mt-10">
          <p className="text-xs sm:text-sm text-white/70 mb-2">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>{" "}
            <span className="mx-1 sm:mx-2 text-white/50">/</span>{" "}
            <span className="font-medium text-white">Directory</span>
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl font-semibold">
            Directory
          </h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-white/80 leading-relaxed">
            Explore a live map directory of our national presence, anchored in
            Dasmarinas City and expanded through active approved members across
            the Philippines.
          </p>
        </div>
      </section>
      <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto space-y-8">
        <div className="mb-6 mt-6 overflow-hidden border border-black/10 bg-white shadow-sm">
          <div className="bg-[#032a0d] px-5 py-4 text-white sm:px-6">
            <p className="text-xs uppercase text-[#d4a948]">
              National Chaplaincy Directory
            </p>
            <h2 className="mt-3 mb-2 text-2xl sm:text-4xl tracking-tight">
              Find our headquarters and see where members are serving.
            </h2>
          </div>

          <div className="border-t border-black/10 bg-white px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3 rounded border border-dashed border-[#032a0d]/25 bg-[#032a0d]/5 px-4 py-4">
              <div className="rounded-full bg-[#d4a948]/18 p-2.5 text-[#032a0d]">
                <Cross className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#032a0d]">
                  Visiting the ministry office
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#032a0d]/72">
                  Please coordinate ahead for membership inquiries, orientation
                  support, chaplaincy training schedules, or partnership visits.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="border border-[#032a0d]/10 bg-white px-5 py-5 shadow-sm">
              <p className="text-xs uppercase  text-[#032a0d]/55">
                Active Approved Members
              </p>
              <p className="mt-3 font-serif text-3xl text-[#032a0d]">
                {directoryData?.summary.totalMembers.toLocaleString() ?? "0"}
              </p>
            </div>
            <div className="border border-[#032a0d]/10 bg-white px-5 py-5 shadow-sm">
              <p className="text-xs uppercase  text-[#032a0d]/55">
                Regions Represented
              </p>
              <p className="mt-3 font-serif text-3xl text-[#032a0d]">
                {directoryData?.summary.regionsRepresented.toLocaleString() ??
                  "0"}
              </p>
            </div>
            <div className="border border-[#032a0d]/10 bg-white px-5 py-5 shadow-sm">
              <p className="text-xs uppercase  text-[#032a0d]/55">
                Provinces Represented
              </p>
              <p className="mt-3 font-serif text-3xl text-[#032a0d]">
                {directoryData?.summary.provincesRepresented.toLocaleString() ??
                  "0"}
              </p>
            </div>
            <div className="border border-[#032a0d]/10 bg-white px-5 py-5 shadow-sm">
              <p className="text-xs uppercase  text-[#032a0d]/55">
                Mapped Locations
              </p>
              <p className="mt-3 font-serif text-3xl text-[#032a0d]">
                {directoryData?.summary.membersWithRegion.toLocaleString() ??
                  "0"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
            <section className="overflow-hidden border border-[#032a0d]/10 bg-white shadow-[0_20px_60px_rgba(3,42,13,0.08)]">
              <div className="border-b border-[#032a0d]/8 p-5">
                <p className="text-xs uppercase  text-[#032a0d]/55">
                  Interactive National Map
                </p>
                <h2 className="mt-2 font-serif text-2xl text-[#032a0d] sm:text-3xl">
                  Zoom into our regional member presence
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#032a0d]/72">
                  The gold marker identifies the headquarter, while the green
                  circles show active approved members by region. Larger circles
                  indicate a larger member presence.
                </p>
              </div>
              <div className="directory-map h-112 w-full bg-[#e9efe7] sm:h-136">
                {directoryData ? (
                  <DirectoryRegionMap data={directoryData} />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center">
                    <div>
                      <p className="font-serif text-2xl text-[#032a0d]">
                        Map data is temporarily unavailable
                      </p>
                      <p className="mt-2 text-sm text-[#032a0d]/70">
                        Contact details and headquarters information remain
                        available below.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <aside className="space-y-6">
              <div className="border border-[#032a0d]/10 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-[#032a0d]/6 p-2.5 text-[#032a0d]">
                    <MapPinned className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase  text-[#032a0d]/55">
                      Headquarter
                    </p>
                    <h3 className="mt-2 font-serif text-xl text-[#032a0d]">
                      {headquarters.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#032a0d]/75">
                      {headquarters.address}
                    </p>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${headquarters.latitude}&mlon=${headquarters.longitude}#map=15/${headquarters.latitude}/${headquarters.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex text-sm font-medium text-[#032a0d] underline decoration-[#d4a948] underline-offset-4"
                    >
                      Open in OpenStreetMap
                    </a>
                  </div>
                </div>
              </div>

              <div className="border border-[#032a0d]/10 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-[#032a0d]/6 p-2.5 text-[#032a0d]">
                    <Clock3 className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase  text-[#032a0d]/55">
                      Office Hours
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[#032a0d]/75">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: By appointment
                      <br />
                      Closed on public holidays
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-[#032a0d]/10 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-[#032a0d]/6 p-2.5 text-[#032a0d]">
                    <IdCardIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase  text-[#032a0d]/55">
                      Contact
                    </p>
                    <div className="mt-3 space-y-2 text-sm text-[#032a0d]/75">
                      <a
                        href="mailto:poile2005official@gmail.com"
                        className="block transition-colors hover:text-[#032a0d]"
                      >
                        poile2005official@gmail.com
                      </a>
                      <a
                        href="tel:+639194589099"
                        className="block transition-colors hover:text-[#032a0d]"
                      >
                        (+63) 919-458-9099
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-[#032a0d]/10 bg-[#032a0d] p-6 text-white shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-white/10 p-2.5 text-[#f1d28f]">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase  text-white/60">
                      Directory Note
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/78">
                      Regional markers are based on active approved members with
                      recorded Philippine address data in the system.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <section className="mt-10">
            <div className="mb-5">
              <p className="text-xs uppercase  text-[#032a0d]/55">
                Regional Directory
              </p>
              <h2 className="mt-2 font-serif text-3xl text-[#032a0d]">
                Member presence by region
              </h2>
            </div>

            {directoryData?.regionLocations.length ? (
              <div className="overflow-hidden border border-[#032a0d]/10 bg-white shadow-[0_20px_60px_rgba(3,42,13,0.06)]">
                <Accordion
                  type="single"
                  collapsible
                  className="divide-y divide-[#032a0d]/8"
                >
                  {directoryData.regionLocations.map((region) => (
                    <AccordionItem
                      key={region.region}
                      value={region.region}
                      className="border-b-0 px-5 py-0 sm:px-6"
                    >
                      <AccordionTrigger className="py-3 hover:no-underline">
                        <div className="flex w-full min-w-0 flex-col gap-3 pr-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0 text-left">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-[#032a0d]/55">
                              Region
                            </p>
                            <h3 className="mt-1 font-serif text-[1.9rem] leading-none text-[#032a0d] sm:text-[2.15rem]">
                              {region.region}
                            </h3>
                            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#032a0d]/70">
                              <span className="rounded-full border border-[#032a0d]/10 bg-[#032a0d]/3 px-2.5 py-0.5">
                                {region.provinceCount} province
                                {region.provinceCount === 1 ? "" : "s"}{" "}
                                represented
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 rounded-full bg-[#032a0d] px-3 py-1.5 text-xs font-semibold text-white">
                            {region.memberCount} member
                            {region.memberCount === 1 ? "" : "s"}
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="pb-4">
                        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                          {region.provinces.map((province) => (
                            <div
                              key={`${region.region}-${province.province}`}
                              className="flex items-center justify-between gap-3 rounded-xl bg-[#032a0d]/3 px-3 py-2 text-sm"
                            >
                              <span className="text-[#032a0d]/80">
                                {province.province}
                              </span>
                              <span className="font-semibold text-[#032a0d]">
                                {province.memberCount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ) : (
              <div className="border border-dashed border-[#032a0d]/20 bg-white px-6 py-12 text-center">
                <p className="font-serif text-2xl text-[#032a0d]">
                  No regional member map is available yet.
                </p>
                <p className="mt-2 text-sm text-[#032a0d]/70">
                  The public directory will show regional presence once approved
                  member location data is available.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
