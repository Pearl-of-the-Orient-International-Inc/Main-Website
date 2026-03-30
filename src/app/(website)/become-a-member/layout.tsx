"use client";

import { type ReactNode } from "react";
import { AuthGuard } from "@/components/providers/AuthGuard";

export default function BecomeMemberLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
