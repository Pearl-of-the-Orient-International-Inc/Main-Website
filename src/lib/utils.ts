/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MutationCtx, QueryCtx } from "../../convex/_generated/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AuthIdentity {
  subject: string;
  email?: string;
  name?: string;
}

export const authenticate = async (
  ctx: QueryCtx | MutationCtx,
): Promise<AuthIdentity> => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized: You must be logged in");
  return identity as AuthIdentity;
};

export const getClerkErrorMessage = (err: any) => {
  if (err?.errors?.length > 0) {
    return err.errors[0].longMessage || err.errors[0].message;
  }

  if (typeof err?.message === "string") {
    return err.message;
  }

  return "Something went wrong. Please try again.";
};
