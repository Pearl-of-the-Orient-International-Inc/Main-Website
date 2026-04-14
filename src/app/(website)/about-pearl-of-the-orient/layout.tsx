"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface SideLinks {
  href: string;
  title: string;
}

const sideLinks: SideLinks[] = [
  {
    href: "/about-pearl-of-the-orient",
    title: "Overview",
  },
  {
    href: "/about-pearl-of-the-orient/government-accreditation",
    title: "Government Accreditation",
  },
  {
    href: "/about-pearl-of-the-orient/history",
    title: "History of Chaplaincy",
  },
  {
    href: "/about-pearl-of-the-orient/core-functions",
    title: "Core Functions of Modern Chaplaincy",
  },
  {
    href: "/about-pearl-of-the-orient/biblical-principle",
    title: "The Chaplaincy Biblical Principle",
  },
  {
    href: "/about-pearl-of-the-orient/philippine-constitution",
    title: "The Philippine Constitution",
  },
  {
    href: "/about-pearl-of-the-orient/biblical-theological-philosophical",
    title: "Biblical, Theological and Philosophical Foundation of a Chaplain",
  },
  {
    href: "/about-pearl-of-the-orient/pearl-chaplaincy-101-training",
    title: "Pearl Chaplaincy 101 Training",
  },
];

const AboutLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  // Get current page title from sideLinks
  const currentPage = sideLinks.find((link) => link.href === pathname);
  const currentPageTitle = currentPage?.title || "Overview";

  return (
    <div className="bg-white min-h-screen">
      {/* Hero / Banner */}
      <section className="relative bg-[#032a0d] text-white">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-40" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 mt-10">
          {/* Dynamic Breadcrumbs */}
          <p className="text-xs sm:text-sm text-white/70 mb-2">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-1 sm:mx-2 text-white/50">/</span>
            {pathname === "/about-pearl-of-the-orient" ? (
              <span className="font-medium text-white">
                About Pearl of the Orient
              </span>
            ) : (
              <>
                <Link
                  href="/about-pearl-of-the-orient"
                  className="hover:text-white transition-colors"
                >
                  About Pearl of the Orient
                </Link>
                <span className="mx-1 sm:mx-2 text-white/50">/</span>
                <span className="font-medium text-white">
                  {currentPageTitle}
                </span>
              </>
            )}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide">
            About Pearl of the Orient
          </h1>
          <blockquote className="italic border-l-3 pl-3 mt-5 text-sm sm:text-base">
            &quot;The Best Way to Find Yourself Is to Lose Yourself in the Service of Others.&quot;
          </blockquote>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Left: About content */}
            <div className="lg:col-span-2 space-y-10 sm:space-y-12">
              {children}
            </div>
            {/* Right: Quick links */}
            <aside className="lg:col-span-1">
              <div className="border border-[#032a0d]/20 bg-neutral-50 rounded-lg p-4 sm:p-5">
                <h3 className="text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase text-[#032a0d] mb-4 border-b border-[#032a0d]/20 pb-2">
                  About Pearl of the Orient
                </h3>
                <ul className="space-y-2 text-sm">
                  {sideLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "hover:text-[#032a0d] hover:underline underline-offset-2",
                          pathname === link.href &&
                            "font-semibold text-[#032a0d]",
                        )}
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-[#032a0d]/15 pt-4">
                  <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[#032a0d] mb-2">
                    Related Pages
                  </h4>
                  <ul className="space-y-1.5 text-sm">
                    <li>
                      <Link
                        href="/organizational-structure"
                        className="hover:text-[#032a0d] hover:underline underline-offset-2"
                      >
                        Organizational Structure
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/"
                        className="hover:text-[#032a0d] hover:underline underline-offset-2"
                      >
                        About the Chief Chaplain
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/"
                        className="hover:text-[#032a0d] hover:underline underline-offset-2"
                      >
                        Chaplaincy Roadmap
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutLayout;
