import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Search,
  Shield,
} from "lucide-react";

import { ChaplainDirectory } from "./ChaplainDirectory";
import {
  bookingSteps,
  branches,
  serviceTypes,
  values,
} from "./book-a-service-data";
import type {
  PublicServiceChaplain,
  PublicServiceChaplainsResponse,
} from "@/lib/api-types";

const apiBaseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_API_BASE_URL_PROD;

async function getServiceChaplains(): Promise<PublicServiceChaplain[]> {
  if (!apiBaseUrl) {
    return [];
  }

  try {
    const response = await fetch(`${apiBaseUrl}/members/public/service-chaplains`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as PublicServiceChaplainsResponse;

    return payload.data.filter(
      (member) =>
        member.memberType ===
        "CERTIFIED_SPECIALIST_TRAINING_OFFICER_INSTRUCTOR",
    );
  } catch {
    return [];
  }
}

const Page = async () => {
  const chaplains = await getServiceChaplains();

  return (
    <div className="">
      <section className="relative overflow-hidden bg-[#032a0d] text-white">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-40" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16 mt-10">
          <p className="text-xs sm:text-sm text-white/70 mb-2">
            <Link href="/">Home</Link>{" "}
            <span className="mx-1 sm:mx-2 text-white/50">/</span>{" "}
            <span className="font-medium text-white">Book a Service</span>
          </p>
          <h1 className="font-serif text-4xl font-semibold tracking-wide sm:text-5xl lg:text-6xl">
            Book a Service
          </h1>
          <p className="mt-4 max-w-2xl border-l-2 border-amber-400 pl-4 text-sm leading-relaxed text-white/85 sm:text-base">
            Connect with our commissioned chaplains and schedule the service you
            need.
          </p>

          <div className="mt-8 rounded-md border border-white/15 bg-white p-4 text-zinc-950 shadow-xl sm:p-5">
            <div className="grid gap-4 md:grid-cols-4">
              {bookingSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#eef4ef] text-[#032a0d]">
                      <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold">
                        {index + 1}. {step.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                        {step.description}
                      </p>
                    </div>
                    {index < bookingSteps.length - 1 && (
                      <ArrowRight className="ml-auto hidden size-4 text-zinc-500 md:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[340px_1fr] lg:px-8">
        <aside className="space-y-5">
          <section className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide">
              1. Select Branch of Service
            </h2>
            <p className="mt-2 text-xs text-zinc-600">
              Choose the branch where the service will be rendered.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {branches.map((branch) => {
                const Icon = branch.icon;
                return (
                  <button
                    key={branch.label}
                    type="button"
                    className={`relative flex min-h-14 items-center gap-3 rounded-md border p-3 text-left text-xs transition ${
                      branch.active
                        ? "border-[#032a0d] bg-[#032a0d] text-white"
                        : "border-zinc-200 bg-white text-zinc-800 hover:border-[#032a0d]/40"
                    }`}
                  >
                    <Icon className="size-5 shrink-0" aria-hidden="true" />
                    <span className="leading-tight">{branch.label}</span>
                    {branch.active && (
                      <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-white text-[#032a0d]">
                        <Check className="size-3" aria-hidden="true" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide">
              2. Select Type of Service
            </h2>
            <p className="mt-2 text-xs text-zinc-600">
              What type of service do you need?
            </p>
            <div className="mt-4 space-y-2">
              {serviceTypes.map((service) => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.title}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-md p-2 text-left transition hover:bg-zinc-50"
                  >
                    <Icon className="size-5 shrink-0 text-[#032a0d]" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold leading-tight">
                        {service.title}
                      </span>
                      <span className="block text-xs text-zinc-600">
                        {service.subtitle}
                      </span>
                    </span>
                    <span
                      className={`size-4 rounded-full border ${
                        service.active
                          ? "border-[#032a0d] bg-[#032a0d] ring-2 ring-[#032a0d]/15"
                          : "border-zinc-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-md border border-zinc-200 bg-[#f8fbf8] p-5 shadow-sm">
            <div className="flex gap-4">
              <BriefcaseBusiness className="size-8 shrink-0 text-[#032a0d]" />
              <div>
                <h2 className="text-sm font-bold">
                  Can&apos;t find the service you need?
                </h2>
                <p className="mt-1 text-xs text-zinc-600">
                  Contact us and we will help you.
                </p>
                <Link
                  href="/contact-us"
                  className="mt-4 inline-flex h-9 items-center rounded bg-[#032a0d] px-5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#064016]"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        </aside>

        <section>
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wide">
                Commissioned Chaplains
              </h2>
              <p className="mt-2 text-sm text-zinc-700">
                Showing only approved active members with member type:{" "}
                <span className="font-semibold text-[#032a0d]">
                  Certified Specialist Training Officer Instructor
                </span>
              </p>
            </div>
            <div className="w-full space-y-3 lg:max-w-64">
              <label className="flex h-10 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-500">
                <span className="sr-only">Search chaplain</span>
                <input
                  className="min-w-0 flex-1 bg-transparent outline-none"
                  placeholder="Search chaplain..."
                />
                <Search className="size-4" aria-hidden="true" />
              </label>
              <button
                type="button"
                className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-700"
              >
                Sort by: Nearest Availability
                <ArrowRight className="size-4 rotate-90" aria-hidden="true" />
              </button>
            </div>
          </div>

          <ChaplainDirectory chaplains={chaplains} />

          <div className="mt-8">
            <div className="grid gap-5 rounded-md border border-zinc-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_1.2fr]">
              <div className="flex gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#032a0d] text-white">
                  <Shield className="size-7" />
                </div>
                <div>
                  <p className="text-sm font-bold">
                    All our chaplains are commissioned, accredited and bound by
                    our core values:
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Your booking will be confirmed upon approval of the
                    chaplain.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-3 border-t border-zinc-200 pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                {values.map((value) => {
                  const Icon = value.icon;
                  return (
                    <div key={value.label} className="text-center">
                      <Icon className="mx-auto size-6 text-[#032a0d]" />
                      <p className="mt-2 text-xs font-semibold">
                        {value.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;
