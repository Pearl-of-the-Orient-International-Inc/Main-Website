"use client";

import { useMemo, useState, type ChangeEvent } from "react";

import { getBarangays } from "@/constants/barangay";
import { getMunicipalities } from "@/constants/municipality";
import { getProvinces } from "@/constants/province";
import { getRegions } from "@/constants/region";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Field } from "../Field";
import type { ApplicationFormState } from "../types";

type LocationSelection = {
  regionId: number | null;
  provinceId: number | null;
  municipalityId: number | null;
  barangayId: number | null;
};

const EMPTY_LOCATION_SELECTION: LocationSelection = {
  regionId: null,
  provinceId: null,
  municipalityId: null,
  barangayId: null,
};

const normalize = (value: string) => value.trim().toLowerCase();
const PHONE_PATTERN = "09[0-9]{9}";
const sanitizeMobileNumber = (value: string) => value.replace(/\D/g, "").slice(0, 11);

function parseLocationSummary(
  summary: string,
  regions: ReturnType<typeof getRegions>,
): LocationSelection {
  const parts = summary
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return EMPTY_LOCATION_SELECTION;

  const region = regions.find(
    (item) =>
      normalize(item.region_description) === normalize(parts[0]) ||
      normalize(item.region_name) === normalize(parts[0]),
  );
  if (!region) return EMPTY_LOCATION_SELECTION;

  const provincePart = parts[1];
  if (!provincePart) {
    return {
      regionId: region.region_id,
      provinceId: null,
      municipalityId: null,
      barangayId: null,
    };
  }

  const province = getProvinces(region.region_id).find(
    (item) => normalize(item.province_name) === normalize(provincePart),
  );
  if (!province) {
    return {
      regionId: region.region_id,
      provinceId: null,
      municipalityId: null,
      barangayId: null,
    };
  }

  const municipalityPart = parts[2];
  if (!municipalityPart) {
    return {
      regionId: region.region_id,
      provinceId: province.province_id,
      municipalityId: null,
      barangayId: null,
    };
  }

  const municipality = getMunicipalities(province.province_id).find(
    (item) => normalize(item.municipality_name) === normalize(municipalityPart),
  );
  if (!municipality) {
    return {
      regionId: region.region_id,
      provinceId: province.province_id,
      municipalityId: null,
      barangayId: null,
    };
  }

  const barangayPart = parts[3];
  if (!barangayPart) {
    return {
      regionId: region.region_id,
      provinceId: province.province_id,
      municipalityId: municipality.municipality_id,
      barangayId: null,
    };
  }

  const barangay = getBarangays(municipality.municipality_id).find(
    (item) => normalize(item.barangay_name) === normalize(barangayPart),
  );

  return {
    regionId: region.region_id,
    provinceId: province.province_id,
    municipalityId: municipality.municipality_id,
    barangayId: barangay?.barangay_id ?? null,
  };
}

function buildLocationSummary(
  selection: LocationSelection,
  regions: ReturnType<typeof getRegions>,
): string {
  if (selection.regionId === null) return "";
  const region = regions.find((item) => item.region_id === selection.regionId);
  if (!region) return "";

  const province =
    selection.provinceId === null
      ? null
      : getProvinces(selection.regionId).find(
          (item) => item.province_id === selection.provinceId,
        ) ?? null;

  const municipality =
    selection.provinceId === null || selection.municipalityId === null
      ? null
      : getMunicipalities(selection.provinceId).find(
          (item) => item.municipality_id === selection.municipalityId,
        ) ?? null;

  const barangay =
    selection.municipalityId === null || selection.barangayId === null
      ? null
      : getBarangays(selection.municipalityId).find(
          (item) => item.barangay_id === selection.barangayId,
        ) ?? null;

  return [
    region.region_description,
    province?.province_name,
    municipality?.municipality_name,
    barangay?.barangay_name,
  ]
    .filter(Boolean)
    .join(", ");
}

export function StepPersonalDetails({
  form,
  updateFieldAction,
  handlePhotoChangeAction,
}: {
  form: ApplicationFormState;
  updateFieldAction: <K extends keyof ApplicationFormState>(
    key: K,
    value: ApplicationFormState[K],
  ) => void;
  handlePhotoChangeAction: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const regions = useMemo(() => getRegions(), []);
  const [selectedLocation, setSelectedLocation] = useState<LocationSelection>(
    EMPTY_LOCATION_SELECTION,
  );
  const [hasTouchedLocation, setHasTouchedLocation] = useState(false);

  const parsedLocation = useMemo(
    () => parseLocationSummary(form.regionProvince, regions),
    [form.regionProvince, regions],
  );
  const activeLocation = hasTouchedLocation ? selectedLocation : parsedLocation;

  const provinces = useMemo(
    () => getProvinces(activeLocation.regionId),
    [activeLocation.regionId],
  );
  const municipalities = useMemo(
    () => getMunicipalities(activeLocation.provinceId),
    [activeLocation.provinceId],
  );
  const barangays = useMemo(
    () => getBarangays(activeLocation.municipalityId),
    [activeLocation.municipalityId],
  );

  const applyLocationSelection = (next: LocationSelection) => {
    setHasTouchedLocation(true);
    setSelectedLocation(next);
    updateFieldAction("regionProvince", buildLocationSummary(next, regions));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" required>
          <Input
            value={form.firstName}
            onChange={(e) => updateFieldAction("firstName", e.target.value)}
            placeholder="e.g. Juan"
          />
        </Field>
        <Field label="Last name" required>
          <Input
            value={form.lastName}
            onChange={(e) => updateFieldAction("lastName", e.target.value)}
            placeholder="e.g. Dela Cruz"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email address" required>
          <Input
            type="email"
            value={form.emailAddress}
            onChange={(e) => updateFieldAction("emailAddress", e.target.value)}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Mobile / phone number" required>
          <Input
            type="tel"
            inputMode="numeric"
            maxLength={11}
            pattern={PHONE_PATTERN}
            value={form.phoneNumber}
            onChange={(e) =>
              updateFieldAction(
                "phoneNumber",
                sanitizeMobileNumber(e.target.value),
              )
            }
            placeholder="e.g. 09152479693"
          />
        </Field>
      </div>

      <Field label="Home address" required>
        <Input
          value={form.address}
          onChange={(e) => updateFieldAction("address", e.target.value)}
          placeholder="House no., street, subdivision / village"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Civil status" required>
          <Select
            value={form.civilStatus}
            onValueChange={(value) =>
              updateFieldAction(
                "civilStatus",
                value as ApplicationFormState["civilStatus"],
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single">Single</SelectItem>
              <SelectItem value="Married">Married</SelectItem>
              <SelectItem value="Widowed">Widowed</SelectItem>
              <SelectItem value="Separated">Separated</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Gender" required>
          <Select
            value={form.gender}
            onValueChange={(value) =>
              updateFieldAction("gender", value as ApplicationFormState["gender"])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Nationality" required>
          <Input
            value={form.nationality}
            onChange={(e) => updateFieldAction("nationality", e.target.value)}
            placeholder="e.g. Filipino"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date of birth" required>
          <Input
            type="date"
            value={form.birthday}
            onChange={(e) => updateFieldAction("birthday", e.target.value)}
          />
        </Field>
        <Field label="Age" required>
          <Input
            type="text"
            value={form.age}
            readOnly
            aria-readonly="true"
            placeholder="Auto-computed from date of birth"
            className="bg-neutral-100 text-neutral-700"
          />
        </Field>
      </div>

      <Field
        label="Location (Region / Province / Municipality / Barangay)"
        required
      >
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Select
              value={
                activeLocation.regionId !== null
                  ? String(activeLocation.regionId)
                  : undefined
              }
              onValueChange={(value) => {
                applyLocationSelection({
                  regionId: Number(value),
                  provinceId: null,
                  municipalityId: null,
                  barangayId: null,
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.region_id} value={String(region.region_id)}>
                    {region.region_description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={
                activeLocation.provinceId !== null
                  ? String(activeLocation.provinceId)
                  : undefined
              }
              onValueChange={(value) => {
                applyLocationSelection({
                  regionId: activeLocation.regionId,
                  provinceId: Number(value),
                  municipalityId: null,
                  barangayId: null,
                });
              }}
              disabled={activeLocation.regionId === null}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem
                    key={province.province_id}
                    value={String(province.province_id)}
                  >
                    {province.province_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={
                activeLocation.municipalityId !== null
                  ? String(activeLocation.municipalityId)
                  : undefined
              }
              onValueChange={(value) => {
                applyLocationSelection({
                  regionId: activeLocation.regionId,
                  provinceId: activeLocation.provinceId,
                  municipalityId: Number(value),
                  barangayId: null,
                });
              }}
              disabled={activeLocation.provinceId === null}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select municipality / city" />
              </SelectTrigger>
              <SelectContent>
                {municipalities.map((municipality) => (
                  <SelectItem
                    key={municipality.municipality_id}
                    value={String(municipality.municipality_id)}
                  >
                    {municipality.municipality_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={
                activeLocation.barangayId !== null
                  ? String(activeLocation.barangayId)
                  : undefined
              }
              onValueChange={(value) => {
                applyLocationSelection({
                  regionId: activeLocation.regionId,
                  provinceId: activeLocation.provinceId,
                  municipalityId: activeLocation.municipalityId,
                  barangayId: Number(value),
                });
              }}
              disabled={activeLocation.municipalityId === null}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select barangay" />
              </SelectTrigger>
              <SelectContent>
                {barangays.map((barangay) => (
                  <SelectItem
                    key={barangay.barangay_id}
                    value={String(barangay.barangay_id)}
                  >
                    {barangay.barangay_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            value={form.regionProvince}
            readOnly
            aria-readonly="true"
            placeholder="Location summary will be auto-generated"
            className="bg-neutral-100 text-neutral-700"
          />
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Emergency contact name" required>
          <Input
            value={form.emergencyName}
            onChange={(e) => updateFieldAction("emergencyName", e.target.value)}
            placeholder="Full name of emergency contact"
          />
        </Field>
        <Field label="Emergency contact mobile" required>
          <Input
            type="tel"
            inputMode="numeric"
            maxLength={11}
            pattern={PHONE_PATTERN}
            value={form.emergencyCellphone}
            onChange={(e) =>
              updateFieldAction(
                "emergencyCellphone",
                sanitizeMobileNumber(e.target.value),
              )
            }
            placeholder="e.g. 09152479693"
          />
        </Field>
      </div>

      <Field
        label="Recent ID photo"
        hint="A clear 2x2 or profile photo. This will appear on your membership record."
      >
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChangeAction}
            className="text-xs sm:text-sm"
          />
          {form.photoUrl && (
            <div className="h-16 w-16 overflow-hidden rounded-md border border-[#032a0d]/20 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.photoUrl}
                alt="Applicant photo preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </Field>
    </div>
  );
}
