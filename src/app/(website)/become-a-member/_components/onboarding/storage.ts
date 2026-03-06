"use client";

import type { OnboardingStepId } from "../constants";
import type { FrontendOnboardingMeta } from "./types";

const ONBOARDING_META_STORAGE_KEY = "pearl-member-onboarding-meta";

function randomSegment(): string {
  return Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
}

function buildMemberUniqueId(): string {
  const now = new Date();
  const year = now.getFullYear();
  return `POI-${year}-${randomSegment()}`;
}

function buildLocalId(): string {
  return `local-${Date.now()}-${randomSegment()}`;
}

function defaultMeta(): FrontendOnboardingMeta {
  return {
    localId: buildLocalId(),
    uniqueId: buildMemberUniqueId(),
    applicationStatus: "Submitted",
    onboardingStep: "requirements",
    requirementAttachments: {},
  };
}

export function loadOnboardingMeta(): FrontendOnboardingMeta | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ONBOARDING_META_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FrontendOnboardingMeta>;
    if (!parsed || typeof parsed !== "object") return null;

    const fallback = defaultMeta();
    return {
      localId:
        typeof parsed.localId === "string" && parsed.localId.trim()
          ? parsed.localId
          : fallback.localId,
      uniqueId:
        typeof parsed.uniqueId === "string" && parsed.uniqueId.trim()
          ? parsed.uniqueId
          : fallback.uniqueId,
      applicationStatus:
        parsed.applicationStatus === "Approved" ||
        parsed.applicationStatus === "Under Review"
          ? parsed.applicationStatus
          : "Submitted",
      onboardingStep: (parsed.onboardingStep ?? "requirements") as OnboardingStepId,
      requirementAttachments:
        parsed.requirementAttachments &&
        typeof parsed.requirementAttachments === "object"
          ? parsed.requirementAttachments
          : {},
    };
  } catch {
    return null;
  }
}

export function saveOnboardingMeta(meta: FrontendOnboardingMeta): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      ONBOARDING_META_STORAGE_KEY,
      JSON.stringify(meta),
    );
  } catch {
    // ignore storage errors
  }
}

export function getOrCreateOnboardingMeta(): FrontendOnboardingMeta {
  const existing = loadOnboardingMeta();
  if (existing) return existing;
  const created = defaultMeta();
  saveOnboardingMeta(created);
  return created;
}
