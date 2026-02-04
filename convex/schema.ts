import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/** Onboarding step after application submission */
export const onboardingStepValidator = v.union(
  v.literal("application"),
  v.literal("requirements"),
  v.literal("pre_orientation"),
  v.literal("chaplaincy_101"),
  v.literal("oath_taking"),
  v.literal("id_generation")
);

export default defineSchema({
  /** Draft of membership application form (per user, before submit) */
  membershipDrafts: defineTable({
    clerkUserId: v.string(),
    formJson: v.string(),
    step: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_user", ["clerkUserId"]),

  personalInformation: defineTable({
    uniqueId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    emailAddress: v.string(),
    clerkUserId: v.string(),

    // Position
    position: v.optional(
      v.union(
        v.literal("Church Worker"),
        v.literal("Pastor"),
        v.literal("Rev."),
        v.literal("Bishop"),
        v.literal("Others")
      )
    ),
    positionOthers: v.optional(v.string()), // For "Others" specification

    // Contact Information
    address: v.string(),
    phoneNumber: v.string(), // keeping your existing field

    // Personal Details
    civilStatus: v.union(
      v.literal("Single"),
      v.literal("Married"),
      v.literal("Widowed"),
      v.literal("Separated")
    ),
    gender: v.union(v.literal("Male"), v.literal("Female")),
    nationality: v.string(),
    birthday: v.string(), // or v.number() for timestamp
    age: v.number(),

    // Church Affiliation
    churchOrganizationAffiliation: v.string(),
    churchAddress: v.string(),
    regionProvince: v.string(),

    // Physical Characteristics
    height: v.optional(v.string()),
    weight: v.optional(v.string()),
    bloodType: v.optional(v.string()),
    colorOfEyes: v.optional(v.string()),
    colorOfSkin: v.optional(v.string()),

    // Government IDs
    sssNumber: v.optional(v.string()),
    tinNumber: v.optional(v.string()),

    // Emergency Contact
    emergencyName: v.string(),
    emergencyCellphone: v.string(),

    // Educational Attainment
    elementarySchool: v.optional(v.string()),
    secondarySchool: v.optional(v.string()),
    tertiarySchool: v.optional(v.string()),
    postGraduateStudies: v.optional(v.string()),

    // Work Experience (stored as array of objects)
    ministerialWorkExperience: v.optional(
      v.array(
        v.object({
          jobDescription: v.string(),
          years: v.string(),
        })
      )
    ),

    // Skills/Talents
    skillsTalents: v.optional(v.string()),

    // Branch of Service (multiple selections possible)
    branchOfService: v.optional(
      v.array(
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
          v.literal("Others")
        )
      )
    ),
    branchOfServiceOthers: v.optional(v.string()),

    // Character References
    characterReferences: v.optional(
      v.array(
        v.object({
          name: v.string(),
          position: v.string(),
          contactNumber: v.string(),
        })
      )
    ),

    // Metadata
    photoUrl: v.optional(v.string()), // For storing uploaded photo
    signatureUrl: v.optional(v.string()),

    // Application Status
    applicationStatus: v.optional(
      v.union(
        v.literal("Draft"),
        v.literal("Submitted"),
        v.literal("Under Review"),
        v.literal("Approved"),
        v.literal("Rejected")
      )
    ),

    // Endorsement
    endorsedBy: v.optional(v.string()),
    endorsedAt: v.optional(v.number()),

    // Onboarding (post-submission steps)
    onboardingStep: v.optional(onboardingStepValidator),
    /** Requirement key -> Convex storage ID */
    requirementAttachments: v.optional(v.record(v.string(), v.id("_storage"))),

    updatedAt: v.number(),
  })
    .index("by_clerk_user", ["clerkUserId"])
    .index("by_unique_id", ["uniqueId"])
    .index("by_status", ["applicationStatus"]),
});
