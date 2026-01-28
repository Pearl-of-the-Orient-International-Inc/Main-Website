import { v } from "convex/values";
import { mutation, query, MutationCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";
import { authenticate } from "@/lib/utils";

// Type definitions
type Position = "Church Worker" | "Pastor" | "Rev." | "Bishop" | "Others";
type CivilStatus = "Single" | "Married" | "Widowed" | "Separated";
type Gender = "Male" | "Female";
type BranchOfService =
  | "Humanitarian"
  | "Hospital and Care"
  | "Military/PNP"
  | "School"
  | "Corporate"
  | "Disaster & Rescue Operations"
  | "Prison"
  | "Security"
  | "Government"
  | "DSWD"
  | "Others";

type ApplicationStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Rejected";

interface WorkExperience {
  jobDescription: string;
  years: string;
}

interface CharacterReference {
  name: string;
  position: string;
  contactNumber: string;
}

interface ApplicationData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  name: string;
  position?: Position;
  positionOthers?: string;
  address: string;
  cellPhone: string;
  civilStatus: CivilStatus;
  gender: Gender;
  nationality: string;
  birthday: string;
  age: number;
  churchOrganizationAffiliation: string;
  churchAddress: string;
  regionProvince: string;
  emergencyName: string;
  height?: string;
  weight?: string;
  bloodType?: string;
  colorOfEyes?: string;
  colorOfSkin?: string;
  sssNumber?: string;
  tinNumber?: string;
  emergencyCellphone: string;
  elementarySchool?: string;
  secondarySchool?: string;
  tertiarySchool?: string;
  postGraduateStudies?: string;
  ministerialWorkExperience?: WorkExperience[];
  skillsTalents?: string;
  branchOfService?: BranchOfService[];
  branchOfServiceOthers?: string;
  characterReferences?: CharacterReference[];
  photoUrl?: string;
}

interface CreateApplicationArgs extends ApplicationData {
  clerkId: string;
}

interface UpdateApplicationArgs extends Partial<ApplicationData> {
  id: Id<"personalInformation">;
}

// Reusable validation schemas
const positionValidator = v.union(
  v.literal("Church Worker"),
  v.literal("Pastor"),
  v.literal("Rev."),
  v.literal("Bishop"),
  v.literal("Others"),
);

const civilStatusValidator = v.union(
  v.literal("Single"),
  v.literal("Married"),
  v.literal("Widowed"),
  v.literal("Separated"),
);

const branchOfServiceValidator = v.array(
  v.union(
    v.literal("Humanitarian"),
    v.literal("Hospital and Care"),
    v.literal("Military/PNP"),
    v.literal("School"),
    v.literal("Corporate"),
    v.literal("Disaster & Rescue Operations"),
    v.literal("Prison"),
    v.literal("Security"),
    v.literal("Government"),
    v.literal("DSWD"),
    v.literal("Others"),
  ),
);

const workExperienceValidator = v.array(
  v.object({
    jobDescription: v.string(),
    years: v.string(),
  }),
);

const characterReferenceValidator = v.array(
  v.object({
    name: v.string(),
    position: v.string(),
    contactNumber: v.string(),
  }),
);

// Shared args for create/update
const applicationArgs = {
  firstName: v.string(),
  lastName: v.string(),
  emailAddress: v.string(),
  name: v.string(),
  position: v.optional(positionValidator),
  positionOthers: v.optional(v.string()),
  address: v.string(),
  cellPhone: v.string(),
  civilStatus: civilStatusValidator,
  gender: v.union(v.literal("Male"), v.literal("Female")),
  nationality: v.string(),
  birthday: v.string(),
  age: v.number(),
  churchOrganizationAffiliation: v.string(),
  churchAddress: v.string(),
  regionProvince: v.string(),
  emergencyName: v.string(),
  height: v.optional(v.string()),
  weight: v.optional(v.string()),
  bloodType: v.optional(v.string()),
  colorOfEyes: v.optional(v.string()),
  colorOfSkin: v.optional(v.string()),
  sssNumber: v.optional(v.string()),
  tinNumber: v.optional(v.string()),
  emergencyCellphone: v.string(),
  elementarySchool: v.optional(v.string()),
  secondarySchool: v.optional(v.string()),
  tertiarySchool: v.optional(v.string()),
  postGraduateStudies: v.optional(v.string()),
  ministerialWorkExperience: v.optional(workExperienceValidator),
  skillsTalents: v.optional(v.string()),
  branchOfService: v.optional(branchOfServiceValidator),
  branchOfServiceOthers: v.optional(v.string()),
  characterReferences: v.optional(characterReferenceValidator),
  photoUrl: v.optional(v.string()),
};

const validateRequiredFields = (
  data: ApplicationData | Doc<"personalInformation">,
): void => {
  const required: Record<
    keyof Pick<
      ApplicationData,
      | "firstName"
      | "lastName"
      | "emailAddress"
      | "name"
      | "address"
      | "cellPhone"
      | "nationality"
      | "churchOrganizationAffiliation"
      | "churchAddress"
      | "regionProvince"
      | "emergencyName"
      | "emergencyCellphone"
    >,
    string
  > = {
    firstName: "First name",
    lastName: "Last name",
    emailAddress: "Email address",
    name: "Name",
    address: "Address",
    cellPhone: "Cell phone",
    nationality: "Nationality",
    churchOrganizationAffiliation: "Church/Organization affiliation",
    churchAddress: "Church address",
    regionProvince: "Region/Province",
    emergencyName: "Emergency contact name",
    emergencyCellphone: "Emergency contact cellphone",
  };

  for (const [field, label] of Object.entries(required)) {
    const value = data[field as keyof typeof data];
    if (!value || (typeof value === "string" && !value.trim())) {
      throw new Error(`${label} is required`);
    }
  }

  if (data.age < 0 || data.age > 150) {
    throw new Error("Please enter a valid age");
  }
};

const validateConditionalFields = (data: Partial<ApplicationData>): void => {
  if (data.position === "Others" && !data.positionOthers?.trim()) {
    throw new Error("Please specify your position");
  }

  if (
    data.branchOfService?.includes("Others") &&
    !data.branchOfServiceOthers?.trim()
  ) {
    throw new Error("Please specify other branch of service");
  }
};

const validateArrayFields = (data: Partial<ApplicationData>): void => {
  if (data.characterReferences) {
    const refs = data.characterReferences;
    if (refs.length < 1)
      throw new Error("At least one character reference is required");
    if (refs.length > 3)
      throw new Error("Maximum of 3 character references allowed");

    refs.forEach((ref: CharacterReference) => {
      if (
        !ref.name.trim() ||
        !ref.position.trim() ||
        !ref.contactNumber.trim()
      ) {
        throw new Error("All character reference fields are required");
      }
    });
  }

  if (data.ministerialWorkExperience) {
    const exp = data.ministerialWorkExperience;
    if (exp.length > 3)
      throw new Error("Maximum of 3 work experiences allowed");

    exp.forEach((e: WorkExperience) => {
      if (!e.jobDescription.trim() || !e.years.trim()) {
        throw new Error("All work experience fields are required");
      }
    });
  }
};

const generateUniqueId = async (db: MutationCtx["db"]): Promise<string> => {
  const lastApplication = await db
    .query("personalInformation")
    .order("desc")
    .first();

  if (lastApplication?.uniqueId) {
    const match = lastApplication.uniqueId.match(/(\d+)$/);
    const lastNumber = match ? parseInt(match[1]) : 0;
    const nextNumber = lastNumber + 1;
    return `POILE-${new Date().getFullYear()}-${nextNumber.toString().padStart(3, "0")}`;
  }

  return `POILE-${new Date().getFullYear()}-001`;
};

const trimStrings = <T extends Record<string, unknown>>(obj: T): T => {
  const trimmed = {} as T;

  (Object.entries(obj) as [keyof T, T[keyof T]][]).forEach(([key, value]) => {
    if (value !== undefined) {
      trimmed[key] = (
        typeof value === "string" ? value.trim() : value
      ) as T[keyof T];
    }
  });

  return trimmed;
};

// Mutations and Queries
export const create = mutation({
  args: {
    clerkId: v.string(),
    ...applicationArgs,
  },
  handler: async (ctx, args: CreateApplicationArgs) => {
    const identity = await authenticate(ctx);

    if (args.clerkId !== identity.subject) {
      throw new Error("Unauthorized: ClerkId mismatch");
    }

    const existingApplication = await ctx.db
      .query("personalInformation")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (existingApplication) {
      throw new Error(
        "Application already exists. Please update your existing application instead.",
      );
    }

    validateRequiredFields(args);
    validateConditionalFields(args);
    validateArrayFields(args);

    const uniqueId = await generateUniqueId(ctx.db);
    const now = Date.now();
    const { ...data } = args;

    const applicationId = await ctx.db.insert("personalInformation", {
      uniqueId,
      clerkUserId: identity.subject,
      ...trimStrings(data),
      phoneNumber: args.cellPhone.trim(),
      applicationStatus: "Draft" as ApplicationStatus,
      updatedAt: now,
    });

    return {
      success: true,
      applicationId,
      uniqueId,
      message: "Membership application created successfully",
    };
  },
});

export const get = query({
  args: {},
  handler: async (ctx): Promise<Doc<"personalInformation">[]> => {
    const identity = await authenticate(ctx);

    return await ctx.db
      .query("personalInformation")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", identity.subject))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("personalInformation") },
  handler: async (ctx, args): Promise<Doc<"personalInformation">> => {
    const identity = await authenticate(ctx);
    const application = await ctx.db.get(args.id);

    if (!application) throw new Error("Application not found");
    if (application.clerkUserId !== identity.subject) {
      throw new Error("Unauthorized: You can only access your own application");
    }

    return application;
  },
});

export const update = mutation({
  args: {
    id: v.id("personalInformation"),
    ...Object.fromEntries(
      Object.entries(applicationArgs).map(([k, validator]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val = validator as any;
        return [k, val.isOptional ? val : val.optional()];
      }),
    ),
  },
  handler: async (ctx, args: UpdateApplicationArgs) => {
    const identity = await authenticate(ctx);
    const { id, ...updateData } = args;

    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Application not found");
    if (existing.clerkUserId !== identity.subject) {
      throw new Error("Unauthorized: You can only update your own application");
    }
    if (["Approved", "Rejected"].includes(existing.applicationStatus || "")) {
      throw new Error(
        `Cannot update a ${existing.applicationStatus?.toLowerCase()} application`,
      );
    }

    validateConditionalFields(updateData);
    validateArrayFields(updateData);

    const trimmed = trimStrings(updateData);
    if (trimmed.cellPhone) {
      (trimmed as Record<string, unknown>).phoneNumber = trimmed.cellPhone;
    }

    await ctx.db.patch(id, { ...trimmed, updatedAt: Date.now() });

    return { success: true, message: "Application updated successfully" };
  },
});

export const submit = mutation({
  args: { id: v.id("personalInformation") },
  handler: async (ctx, args) => {
    const identity = await authenticate(ctx);
    const application = await ctx.db.get(args.id);

    if (!application) throw new Error("Application not found");
    if (application.clerkUserId !== identity.subject) {
      throw new Error("Unauthorized: You can only submit your own application");
    }
    if (application.applicationStatus !== "Draft") {
      throw new Error("Application has already been submitted");
    }

    validateRequiredFields(application);
    validateArrayFields(application);

    await ctx.db.patch(args.id, {
      applicationStatus: "Submitted" as ApplicationStatus,
      updatedAt: Date.now(),
    });

    return { success: true, message: "Application submitted successfully" };
  },
});
