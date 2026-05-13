"use client";

import dynamic from "next/dynamic";

import type { PublicDirectoryLocationsData } from "@/lib/api-types";

const DirectoryRegionMap = dynamic(
  () =>
    import("./directory-region-map").then((module) => module.DirectoryRegionMap),
  {
    ssr: false,
  },
);

export function DirectoryRegionMapClient({
  data,
}: {
  data: PublicDirectoryLocationsData;
}) {
  return <DirectoryRegionMap data={data} />;
}
