import { v } from "convex/values";
import { mutation, query, MutationCtx } from "../_generated/server";
import { authenticate } from "@/lib/utils";
import { onboardingStepValidator } from "../schema";

const DRAFT_STEP_MAX = 3;

const requirementKeys = [
  "photo_2x2_1",
  "photo_2x2_2",
  "ordination_certificate",
  "pastors_recommendation_letter",
  "baccalaureate_diploma",
  "marriage_contract",
  "clearance_barangay",
  "clearance_police",
  "clearance_nbi",
  "letter_of_intent",
] as const;

/** Get current user's draft (if any). */
export const getDraft = query({
  args: {},
  handler: async (ctx) => {
    const identity = await authenticate(ctx);
    const draft = await ctx.db
      .query("membershipDrafts")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", identity.subject))
      .first();
    return draft;
  },
});

/** Save draft (form JSON + step). Debounce on client. */
export const saveDraft = mutation({
  args: {
    formJson: v.string(),
    step: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await authenticate(ctx);
    if (args.step < 0 || args.step > DRAFT_STEP_MAX) {
      throw new Error("Invalid step");
    }
    const now = Date.now();
    const existing = await ctx.db
      .query("membershipDrafts")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", identity.subject))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        formJson: args.formJson,
        step: args.step,
        updatedAt: now,
      });
      return { id: existing._id };
    }
    const id = await ctx.db.insert("membershipDrafts", {
      clerkUserId: identity.subject,
      formJson: args.formJson,
      step: args.step,
      updatedAt: now,
    });
    return { id };
  },
});

/** Parse and validate form for submission; throw with message if invalid. */
function validateAndParseForm(formJson: string): Record<string, unknown> {
  let form: Record<string, unknown>;
  try {
    form = JSON.parse(formJson) as Record<string, unknown>;
  } catch {
    throw new Error("Invalid draft data");
  }
  const required = [
    "firstName",
    "lastName",
    "emailAddress",
    "address",
    "phoneNumber",
    "civilStatus",
    "gender",
    "nationality",
    "birthday",
    "age",
    "churchOrganizationAffiliation",
    "churchAddress",
    "regionProvince",
    "emergencyName",
    "emergencyCellphone",
  ] as const;
  for (const key of required) {
    const v = form[key];
    if (v === undefined || v === null || String(v).trim() === "") {
      throw new Error(`Missing required field: ${key}`);
    }
  }
  const civilStatus = form.civilStatus as string;
  if (!["Single", "Married", "Widowed", "Separated"].includes(civilStatus)) {
    throw new Error("Please select a valid civil status");
  }
  const gender = form.gender as string;
  if (!["Male", "Female"].includes(gender)) {
    throw new Error("Please select a valid gender");
  }
  const age = Number(form.age);
  if (Number.isNaN(age) || age < 0 || age > 150) {
    throw new Error("Please enter a valid age");
  }
  const refs = form.characterReferences as
    | Array<{ name: string; position: string; contactNumber: string }>
    | undefined;
  if (refs && refs.length > 0) {
    const filled = refs.filter(
      (r) =>
        r &&
        String(r.name).trim() &&
        String(r.position).trim() &&
        String(r.contactNumber).trim()
    );
    if (filled.length < 1) {
      throw new Error("At least one character reference is required");
    }
    if (filled.length > 3) {
      throw new Error("Maximum of 3 character references allowed");
    }
  }
  return form;
}

async function generateUniqueId(db: MutationCtx["db"]): Promise<string> {
  const last = await db.query("personalInformation").order("desc").first();
  if (last?.uniqueId) {
    const m = last.uniqueId.match(/(\d+)$/);
    const n = m ? parseInt(m[1], 10) : 0;
    return `POILE-${new Date().getFullYear()}-${(n + 1).toString().padStart(3, "0")}`;
  }
  return `POILE-${new Date().getFullYear()}-001`;
}

/** Submit application: validate draft, create/update personalInformation, set onboarding to requirements, remove draft. */
export const submitApplication = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await authenticate(ctx);
    const draft = await ctx.db
      .query("membershipDrafts")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", identity.subject))
      .first();
    if (!draft) {
      throw new Error("No draft found. Please complete the form first.");
    }
    const form = validateAndParseForm(draft.formJson);

    const existing = await ctx.db
      .query("personalInformation")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    const now = Date.now();
    const age = Number(form.age);
    const payload = {
      firstName: String(form.firstName).trim(),
      lastName: String(form.lastName).trim(),
      emailAddress: String(form.emailAddress).trim(),
      address: String(form.address).trim(),
      phoneNumber: String(form.phoneNumber).trim(),
      civilStatus: form.civilStatus as
        | "Single"
        | "Married"
        | "Widowed"
        | "Separated",
      gender: form.gender as "Male" | "Female",
      nationality: String(form.nationality).trim(),
      birthday: String(form.birthday).trim(),
      age: Number.isNaN(age) ? 0 : age,
      churchOrganizationAffiliation: String(
        form.churchOrganizationAffiliation
      ).trim(),
      churchAddress: String(form.churchAddress).trim(),
      regionProvince: String(form.regionProvince).trim(),
      emergencyName: String(form.emergencyName).trim(),
      emergencyCellphone: String(form.emergencyCellphone).trim(),
      position: [
        "Church Worker",
        "Pastor",
        "Rev.",
        "Bishop",
        "Others",
      ].includes(String(form.position || ""))
        ? (form.position as
            | "Church Worker"
            | "Pastor"
            | "Rev."
            | "Bishop"
            | "Others")
        : undefined,
      positionOthers: (form.positionOthers as string) || undefined,
      height: (form.height as string) || undefined,
      weight: (form.weight as string) || undefined,
      bloodType: (form.bloodType as string) || undefined,
      colorOfEyes: (form.colorOfEyes as string) || undefined,
      colorOfSkin: (form.colorOfSkin as string) || undefined,
      sssNumber: (form.sssNumber as string) || undefined,
      tinNumber: (form.tinNumber as string) || undefined,
      elementarySchool: (form.elementarySchool as string) || undefined,
      secondarySchool: (form.secondarySchool as string) || undefined,
      tertiarySchool: (form.tertiarySchool as string) || undefined,
      postGraduateStudies: (form.postGraduateStudies as string) || undefined,
      ministerialWorkExperience: form.ministerialWorkExperience as
        | { jobDescription: string; years: string }[]
        | undefined,
      skillsTalents: (form.skillsTalents as string) || undefined,
      branchOfService: Array.isArray(form.branchOfService)
        ? (form.branchOfService as string[])
        : undefined,
      branchOfServiceOthers:
        (form.branchOfServiceOthers as string) || undefined,
      characterReferences: form.characterReferences as
        | { name: string; position: string; contactNumber: string }[]
        | undefined,
      photoUrl: (form.photoUrl as string) || undefined,
      signatureUrl: (form.signatureUrl as string) || undefined,
      applicationStatus: "Submitted" as const,
      onboardingStep: "requirements" as const,
      updatedAt: now,
    };

    if (existing) {
      if (["Approved", "Rejected"].includes(existing.applicationStatus || "")) {
        throw new Error(
          `Cannot update a ${existing.applicationStatus?.toLowerCase()} application`
        );
      }
      await ctx.db.patch(existing._id, payload);
      await ctx.db.delete(draft._id);
      return {
        success: true,
        applicationId: existing._id,
        uniqueId: existing.uniqueId,
        message: "Application submitted successfully",
      };
    }

    const uniqueId = await generateUniqueId(ctx.db);
    const applicationId = await ctx.db.insert("personalInformation", {
      uniqueId,
      clerkUserId: identity.subject,
      ...payload,
    });
    await ctx.db.delete(draft._id);
    return {
      success: true,
      applicationId,
      uniqueId,
      message: "Application submitted successfully",
    };
  },
});

/** Get current user's application (for onboarding). */
export const getApplication = query({
  args: {},
  handler: async (ctx) => {
    const identity = await authenticate(ctx);
    const app = await ctx.db
      .query("personalInformation")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", identity.subject))
      .first();
    return app;
  },
});

/** Generate upload URL for requirement files. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await authenticate(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

/** Save a requirement attachment for the current user's application. */
export const saveRequirementAttachment = mutation({
  args: {
    requirementKey: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    if (
      !requirementKeys.includes(
        args.requirementKey as (typeof requirementKeys)[number]
      )
    ) {
      throw new Error("Invalid requirement key");
    }
    const identity = await authenticate(ctx);
    const app = await ctx.db
      .query("personalInformation")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", identity.subject))
      .first();
    if (!app) {
      throw new Error("No application found. Submit the application first.");
    }
    const attachments = { ...(app.requirementAttachments || {}) };
    attachments[args.requirementKey] = args.storageId;
    await ctx.db.patch(app._id, {
      requirementAttachments: attachments,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

/** Advance onboarding step (e.g. after completing requirements). */
export const setOnboardingStep = mutation({
  args: {
    step: onboardingStepValidator,
  },
  handler: async (ctx, args) => {
    const identity = await authenticate(ctx);
    const app = await ctx.db
      .query("personalInformation")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", identity.subject))
      .first();
    if (!app) {
      throw new Error("No application found");
    }
    await ctx.db.patch(app._id, {
      onboardingStep: args.step,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

/** Get URL for a stored file (for display/download). */
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await authenticate(ctx);
    return await ctx.storage.getUrl(args.storageId);
  },
});

/** Public profile by uniqueId (for QR scan / member profile page). No auth required. */
export const getApplicationByUniqueId = query({
  args: { uniqueId: v.string() },
  handler: async (ctx, args) => {
    const app = await ctx.db
      .query("personalInformation")
      .withIndex("by_unique_id", (q) => q.eq("uniqueId", args.uniqueId))
      .first();
    if (!app) return null;
    return {
      uniqueId: app.uniqueId,
      firstName: app.firstName,
      lastName: app.lastName,
      photoUrl: app.photoUrl,
      position: app.position,
      positionOthers: app.positionOthers,
      churchOrganizationAffiliation: app.churchOrganizationAffiliation,
      churchAddress: app.churchAddress,
      regionProvince: app.regionProvince,
      address: app.address,
      applicationStatus: app.applicationStatus,
      skillsTalents: app.skillsTalents,
      branchOfService: app.branchOfService,
      branchOfServiceOthers: app.branchOfServiceOthers,
      // Education
      elementarySchool: app.elementarySchool,
      secondarySchool: app.secondarySchool,
      tertiarySchool: app.tertiarySchool,
      postGraduateStudies: app.postGraduateStudies,
      // Physical
      bloodType: app.bloodType,
      height: app.height,
      weight: app.weight,
      colorOfEyes: app.colorOfEyes,
      colorOfSkin: app.colorOfSkin,
      // Character references & ministry experience
      characterReferences: app.characterReferences,
      ministerialWorkExperience: app.ministerialWorkExperience,
    };
  },
});
