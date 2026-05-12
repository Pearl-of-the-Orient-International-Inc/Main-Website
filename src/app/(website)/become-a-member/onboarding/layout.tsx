"use client";

import { type ReactNode } from "react";
import { AuthGuard } from "@/components/providers/AuthGuard";

export default function BecomeMemberOnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
