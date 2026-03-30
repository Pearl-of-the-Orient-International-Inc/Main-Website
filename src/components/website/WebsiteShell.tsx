"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { ScrollProgress } from "@/components/magic-ui/ScrollProgress";
import { ToolsComponent } from "@/components/ToolsComponent";
import { CookieConsent } from "@/components/website/CookieConsent";
import { Footer } from "@/components/website/Footer";
import { Navbar } from "@/components/website/Navbar";

export function WebsiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPlainMembershipRoute =
    pathname === "/become-a-member" ||
    pathname === "/become-a-member/onboarding" ||
    pathname === "/become-a-member/success";

  if (isPlainMembershipRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollProgress className="top-0 z-60" />
      <Navbar />
      {children}
      <Footer />
      <CookieConsent />
      <ToolsComponent />
    </>
  );
}
