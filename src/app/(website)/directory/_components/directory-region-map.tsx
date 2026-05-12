"use client";

import { useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";

import type { PublicDirectoryLocationsData } from "@/lib/api-types";

type RegionCoordinate = {
  latitude: number;
  longitude: number;
};

const PHILIPPINES_CENTER: [number, number] = [12.8797, 121.774];

const regionCoordinates: Record<string, RegionCoordinate> = {
  "National Capital Region": { latitude: 14.5995, longitude: 120.9842 },
  "Cordillera Administrative Region": { latitude: 17.3513, longitude: 121.1719 },
  "Ilocos Region": { latitude: 16.0832, longitude: 120.6199 },
  "Cagayan Valley": { latitude: 16.9754, longitude: 121.8107 },
  "Central Luzon": { latitude: 15.4828, longitude: 120.7120 },
  CALABARZON: { latitude: 14.1008, longitude: 121.0794 },
  MIMAROPA: { latitude: 12.8797, longitude: 121.3542 },
  "Bicol Region": { latitude: 13.4210, longitude: 123.4137 },
  "Western Visayas": { latitude: 11.0049, longitude: 122.5373 },
  "Central Visayas": { latitude: 10.3157, longitude: 123.8854 },
  "Eastern Visayas": { latitude: 11.2433, longitude: 125.0040 },
  "Zamboanga Peninsula": { latitude: 8.1541, longitude: 123.2588 },
  "Northern Mindanao": { latitude: 8.4542, longitude: 124.6319 },
  "Davao Region": { latitude: 7.1907, longitude: 125.4553 },
  SOCCSKSARGEN: { latitude: 6.2707, longitude: 124.6857 },
  CARAGA: { latitude: 8.8015, longitude: 125.7407 },
  "Autonomous Region in Muslim Mindanao": {
    latitude: 7.2047,
    longitude: 124.2310,
  },
};

function getCircleRadius(memberCount: number) {
  return Math.min(30, Math.max(10, 8 + memberCount * 1.25));
}

type DirectoryDetailLevel = "region" | "province" | "municipality" | "barangay";

function getDetailLevel(zoom: number): DirectoryDetailLevel {
  if (zoom >= 11) return "barangay";
  if (zoom >= 9) return "municipality";
  if (zoom >= 7) return "province";
  return "region";
}

function MapZoomTracker({
  onZoomChangeAction,
}: {
  onZoomChangeAction: (zoom: number) => void;
}) {
  useMapEvents({
    zoomend(event) {
      onZoomChangeAction(event.target.getZoom());
    },
  });

  return null;
}

function DetailLevelBadge({ detailLevel }: { detailLevel: DirectoryDetailLevel }) {
  const label =
    detailLevel === "region"
      ? "Region counts"
      : detailLevel === "province"
        ? "Province counts"
        : detailLevel === "municipality"
          ? "Municipality counts"
          : "Barangay counts";

  return (
    <div className="rounded-md border border-[#032a0d]/15 bg-white/92 px-3 py-2 shadow-sm backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#032a0d]/55">
        Map detail
      </p>
      <p className="mt-1 text-sm font-semibold text-[#032a0d]">{label}</p>
      <p className="mt-1 text-xs text-[#032a0d]/68">
        Zoom in to reveal deeper location counts inside each regional marker.
      </p>
    </div>
  );
}

function RegionPopupContent({
  item,
  detailLevel,
}: {
  item: PublicDirectoryLocationsData["regionLocations"][number];
  detailLevel: DirectoryDetailLevel;
}) {
  return (
    <div className="min-w-64 space-y-3">
      <div>
        <p className="font-semibold text-[#032a0d]">{item.region}</p>
        <p className="text-sm text-neutral-600">
          {item.memberCount} active approved members across {item.provinceCount} province
          {item.provinceCount === 1 ? "" : "s"}, {item.municipalityCount} municipality
          {item.municipalityCount === 1 ? "" : "ies"}, and {item.barangayCount} barangay
          {item.barangayCount === 1 ? "" : "s"}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-[#032a0d]/4 px-2.5 py-2">
          <p className="uppercase tracking-[0.16em] text-[#032a0d]/55">Provinces</p>
          <p className="mt-1 font-semibold text-[#032a0d]">{item.provinceCount}</p>
        </div>
        <div className="rounded-md bg-[#032a0d]/4 px-2.5 py-2">
          <p className="uppercase tracking-[0.16em] text-[#032a0d]/55">Municipalities</p>
          <p className="mt-1 font-semibold text-[#032a0d]">{item.municipalityCount}</p>
        </div>
      </div>

      {detailLevel === "region" ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Top Provinces
          </p>
          <div className="mt-2 space-y-1.5">
            {item.provinces.slice(0, 5).map((province) => (
              <div
                key={`${item.region}-${province.province}`}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span>{province.province}</span>
                <span className="font-medium text-[#032a0d]">{province.memberCount}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {detailLevel === "province" ? (
        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Province Counts
          </p>
          {item.provinces.map((province) => (
            <div
              key={`${item.region}-${province.province}`}
              className="rounded-md border border-[#032a0d]/8 bg-[#032a0d]/3 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-[#032a0d]">{province.province}</span>
                <span className="font-semibold text-[#032a0d]">{province.memberCount}</span>
              </div>
              <p className="mt-1 text-xs text-[#032a0d]/65">
                {province.municipalityCount} municipality
                {province.municipalityCount === 1 ? "" : "ies"}, {province.barangayCount} barangay
                {province.barangayCount === 1 ? "" : "s"}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {detailLevel === "municipality" ? (
        <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Municipality Counts
          </p>
          {item.provinces.map((province) => (
            <div key={`${item.region}-${province.province}`} className="space-y-1.5">
              <p className="text-sm font-semibold text-[#032a0d]">{province.province}</p>
              {province.municipalities.length > 0 ? (
                province.municipalities.map((municipality) => (
                  <div
                    key={`${province.province}-${municipality.municipalityCity}`}
                    className="flex items-center justify-between gap-3 rounded-md bg-[#032a0d]/3 px-3 py-2 text-sm"
                  >
                    <span>{municipality.municipalityCity}</span>
                    <span className="font-semibold text-[#032a0d]">
                      {municipality.memberCount}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#032a0d]/55">No municipality details recorded.</p>
              )}
            </div>
          ))}
        </div>
      ) : null}

      {detailLevel === "barangay" ? (
        <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Barangay Counts
          </p>
          {item.provinces.map((province) =>
            province.municipalities.map((municipality) => (
              <div
                key={`${province.province}-${municipality.municipalityCity}`}
                className="space-y-1.5"
              >
                <p className="text-sm font-semibold text-[#032a0d]">
                  {municipality.municipalityCity}, {province.province}
                </p>
                {municipality.barangays.length > 0 ? (
                  municipality.barangays.map((barangay) => (
                    <div
                      key={`${municipality.municipalityCity}-${barangay.barangay}`}
                      className="flex items-center justify-between gap-3 rounded-md bg-[#032a0d]/3 px-3 py-2 text-sm"
                    >
                      <span>{barangay.barangay}</span>
                      <span className="font-semibold text-[#032a0d]">
                        {barangay.memberCount}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#032a0d]/55">No barangay details recorded.</p>
                )}
              </div>
            )),
          )}
        </div>
      ) : null}
    </div>
  );
}

export function DirectoryRegionMap({
  data,
}: {
  data: PublicDirectoryLocationsData;
}) {
  const [zoom, setZoom] = useState(5);
  const detailLevel = getDetailLevel(zoom);
  const plottedRegions = useMemo(
    () =>
      data.regionLocations
        .map((item) => {
          const coordinate = regionCoordinates[item.region];

          if (!coordinate) {
            return null;
          }

          return {
            ...item,
            coordinate,
          };
        })
        .filter(
          (
            item,
          ): item is PublicDirectoryLocationsData["regionLocations"][number] & {
            coordinate: RegionCoordinate;
          } => Boolean(item),
        ),
    [data.regionLocations],
  );

  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute right-3 top-3 z-[650] max-w-56">
        <DetailLevelBadge detailLevel={detailLevel} />
      </div>

      <MapContainer
        center={PHILIPPINES_CENTER}
        zoom={5}
        scrollWheelZoom
        className="h-full w-full"
      >
        <MapZoomTracker onZoomChangeAction={setZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CircleMarker
          center={[data.headquarters.latitude, data.headquarters.longitude]}
          radius={12}
          pathOptions={{
            color: "#b99240",
            fillColor: "#d4a948",
            fillOpacity: 0.9,
            weight: 2,
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            Headquarters
          </Tooltip>
          <Popup>
            <div className="space-y-1">
              <p className="font-semibold">{data.headquarters.name}</p>
              <p className="text-sm text-neutral-600">{data.headquarters.address}</p>
            </div>
          </Popup>
        </CircleMarker>

        {plottedRegions.map((item) => (
          <CircleMarker
            key={item.region}
            center={[item.coordinate.latitude, item.coordinate.longitude]}
            radius={getCircleRadius(item.memberCount)}
            pathOptions={{
              color: "#032a0d",
              fillColor: "#145224",
              fillOpacity: 0.72,
              weight: 2,
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              {item.region}: {item.memberCount} member{item.memberCount === 1 ? "" : "s"}
            </Tooltip>
            <Popup>
              <RegionPopupContent item={item} detailLevel={detailLevel} />
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
