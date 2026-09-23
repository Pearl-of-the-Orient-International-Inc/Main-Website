"use client";

import {
  BadgeCheck,
  BookOpen,
  Building2,
  Church,
  GraduationCap,
  HandHeart,
  HeartPulse,
  HeartHandshake,
  Home,
  MapPinned,
  MessagesSquare,
  Presentation,
  Scale,
  Search,
  ShieldAlert,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { ChaplainDirectory } from "./ChaplainDirectory";
import type { PublicServiceChaplain } from "@/lib/api-types";

type Service = {
  id: string;
  name: string;
  description: string;
  availability: string | null;
};

const getServiceIcon = (name: string) => {
  const value = name.toLowerCase();

  if (value.includes("pastoral care")) return HeartPulse;
  if (value.includes("follow-up") || value.includes("visitation"))
    return MapPinned;
  if (value.includes("marriage")) return HeartHandshake;
  if (value.includes("counsel")) return MessagesSquare;
  if (value.includes("bible") || value.includes("devotion")) return BookOpen;
  if (value.includes("enhancement")) return Sparkles;
  if (value.includes("funeral") || value.includes("necrological"))
    return Church;
  if (
    value.includes("house") ||
    value.includes("company") ||
    value.includes("dedication")
  )
    return Home;
  if (value.includes("values") || value.includes("life coaching")) return Scale;
  if (value.includes("upliftment") || value.includes("lecture"))
    return Presentation;
  if (value.includes("community") || value.includes("adviser"))
    return UsersRound;
  if (value.includes("drug awareness")) return ShieldAlert;
  if (value.includes("police") || value.includes("military"))
    return BadgeCheck;
  if (value.includes("training") || value.includes("seminar"))
    return GraduationCap;
  if (value.includes("spiritual")) return HandHeart;
  return Building2;
};

export function BookAServiceContent({
  services,
  chaplains,
}: {
  services: Service[];
  chaplains: PublicServiceChaplain[];
}) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [province, setProvince] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [barangay, setBarangay] = useState("");
  const selectedService = services.find((service) => service.id === serviceId);
  const options = (
    key: "region" | "province" | "municipalityCity" | "barangay",
    list = chaplains,
  ) =>
    [
      ...new Set(
        list
          .map((chaplain) => chaplain[key])
          .filter((value): value is string => Boolean(value)),
      ),
    ].sort();
  const regionChaplains = chaplains.filter(
    (chaplain) => !region || chaplain.region === region,
  );
  const provinceChaplains = regionChaplains.filter(
    (chaplain) => !province || chaplain.province === province,
  );
  const municipalityChaplains = provinceChaplains.filter(
    (chaplain) => !municipality || chaplain.municipalityCity === municipality,
  );
  const visibleChaplains = municipalityChaplains.filter((chaplain) => {
    const name = [chaplain.firstName, chaplain.middleInitial, chaplain.lastName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return (
      (!barangay || chaplain.barangay === barangay) &&
      (!search || name.includes(search.toLowerCase()))
    );
  });

  return (
    <main className="mx-auto grid max-w-7xl gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[340px_1fr] lg:px-8">
      <aside className="space-y-5">
        <section className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide">
            1. Select Type of Service
          </h2>
          <p className="mt-2 text-xs text-zinc-600">
            Choose the service you need.
          </p>
          <div className="mt-4 space-y-2">
            {services.map((service) => {
              const Icon = getServiceIcon(service.name);
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setServiceId(service.id)}
                  className={`flex w-full items-center gap-3 rounded-md p-3 text-left transition ${service.id === serviceId ? "bg-[#032a0d] text-white" : "hover:bg-zinc-50 text-zinc-900"}`}
                >
                  <Icon className="size-5 shrink-0" />
                  <span className="text-sm font-semibold">{service.name}</span>
                  <span
                    className={`ml-auto size-4 shrink-0 rounded-full border ${service.id === serviceId ? "border-white bg-white" : "border-zinc-300"}`}
                  />
                </button>
              );
            })}
          </div>
          {services.length === 0 && (
            <p className="py-4 text-sm text-zinc-600">
              No active services are available right now.
            </p>
          )}
        </section>
        <section className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide">
            2. Filter Chaplains by Location
          </h2>
          <p className="mt-2 text-xs text-zinc-600">
            Narrow the commissioned chaplain directory by service area.
          </p>
          <div className="mt-4 space-y-3">
            {[
              ["Region", region, setRegion, options("region")],
              [
                "Province",
                province,
                setProvince,
                options("province", regionChaplains),
              ],
              [
                "Municipality",
                municipality,
                setMunicipality,
                options("municipalityCity", provinceChaplains),
              ],
              [
                "Barangay",
                barangay,
                setBarangay,
                options("barangay", municipalityChaplains),
              ],
            ].map(([label, value, setter, entries]) => (
              <label
                key={label as string}
                className="grid gap-1 text-xs font-medium"
              >
                {label as string}
                <select
                  value={value as string}
                  onChange={(event) => {
                    (setter as (value: string) => void)(event.target.value);
                    if (label === "Region") {
                      setProvince("");
                      setMunicipality("");
                      setBarangay("");
                    }
                    if (label === "Province") {
                      setMunicipality("");
                      setBarangay("");
                    }
                    if (label === "Municipality") setBarangay("");
                  }}
                  className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm font-normal"
                >
                  <option value="">All {label as string}</option>
                  {(entries as string[]).map((entry) => (
                    <option key={entry} value={entry}>
                      {entry}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </section>
      </aside>
      <section>
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide">
              3. Commissioned Chaplains
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-700">
              {selectedService ? (
                <>
                  Choose an approved active specialist for{" "}
                  <span className="font-semibold text-[#032a0d]">
                    {selectedService.name}
                  </span>
                  .
                </>
              ) : (
                "Select a service to view eligible chaplains."
              )}
            </p>
            {selectedService?.availability && (
              <p className="mt-1 text-xs text-zinc-500">
                {selectedService.availability}
              </p>
            )}
          </div>
          <label className="flex h-10 w-full items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-500 lg:max-w-64">
            <span className="sr-only">Search chaplain</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="min-w-0 flex-1 bg-transparent outline-none"
              placeholder="Search chaplain..."
            />
            <Search className="size-4" />
          </label>
        </div>
        <ChaplainDirectory
          chaplains={visibleChaplains}
          service={selectedService ?? null}
        />
      </section>
    </main>
  );
}
