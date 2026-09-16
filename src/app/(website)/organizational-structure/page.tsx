import Link from "next/link";
import { OrganizationalStructureView } from "./organizational-structure-view";
import type { PublicOffice } from "./organizational-structure-view";

const apiBaseUrl = process.env.NODE_ENV === "development"
  ? process.env.NEXT_PUBLIC_API_BASE_URL_DEV
  : process.env.NEXT_PUBLIC_API_BASE_URL_PROD;

async function getOrganizationalStructure(): Promise<PublicOffice[]> {
  if (!apiBaseUrl) return [];
  try {
    const response = await fetch(`${apiBaseUrl}/offices/public/organizational-structure`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    const payload = (await response.json()) as { data: PublicOffice[] };
    return payload.data;
  } catch {
    return [];
  }
}

export default async function OrganizationalStructurePage() {
  const offices = await getOrganizationalStructure();
  return (
    <div>
      <section className="relative bg-[#032a0d] text-white">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-40" />
        </div>
        <div className="relative mx-auto mt-10 max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <p className="mb-2 text-xs text-white/70 sm:text-sm">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span className="mx-2 text-white/50">/</span>
            <span className="font-medium text-white">Organizational Structure</span>
          </p>
          <h1 className="font-serif text-3xl font-semibold tracking-wide sm:text-4xl md:text-5xl lg:text-6xl">Organizational Structure</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">
            Explore the approved offices, reporting relationships, and officers of Pearl of the Orient International Auxiliary Chaplain Values Educators Inc.
          </p>
        </div>
      </section>
      <OrganizationalStructureView offices={offices} />
    </div>
  );
}
