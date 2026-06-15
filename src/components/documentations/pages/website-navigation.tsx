import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Check,
  ChevronRight,
  Home,
  Menu,
  MousePointerClick,
  Search,
} from "lucide-react";
import {
  IconCalendarEvent,
  IconFileTextFilled,
  IconNews,
  IconSchoolFilled,
  IconUsersGroup,
} from "@tabler/icons-react";

import { OnThisPageRegister } from "@/components/documentations/OnThisPageRegister";

const ON_THIS_PAGE = [
  { label: "Overview", href: "#overview" },
  { label: "Homepage", href: "#homepage" },
  { label: "Main Menu", href: "#main-menu" },
  { label: "Public Pages", href: "#public-pages" },
  { label: "Mobile Navigation", href: "#mobile-navigation" },
  { label: "Good Habits", href: "#good-habits" },
];

const menuSteps = [
  "Open the public website from the main domain.",
  "Use the header menu to move between public sections.",
  "Choose the page that matches the information you need.",
  "Use visible buttons or page links to start membership, seminary, or profile workflows.",
  "Return to the homepage when you need to restart from the main public entry point.",
];

const publicPages = [
  {
    title: "Home",
    description:
      "Use the homepage as the main entry point for announcements, featured sections, and primary actions.",
    icon: Home,
  },
  {
    title: "Members and Directory",
    description:
      "Browse public member records, officer information, and organization-related directory details.",
    icon: IconUsersGroup,
  },
  {
    title: "News and Blogs",
    description:
      "Read published organization updates, public articles, and news items from the website.",
    icon: IconNews,
  },
  {
    title: "Events",
    description:
      "Review public events and use event details to understand schedules, venues, and attendance information.",
    icon: IconCalendarEvent,
  },
  {
    title: "Become a Member",
    description:
      "Start the membership application flow and continue through required personal, church, and ministry details.",
    icon: IconFileTextFilled,
  },
  {
    title: "Seminary",
    description:
      "Open seminary information, admission entry points, student resources, and related public pages.",
    icon: IconSchoolFilled,
  },
];

const mobileTips = [
  "Use the menu button when the full navigation is hidden on smaller screens.",
  "Close the menu after selecting a page so the selected content is visible.",
  "Scroll to reveal page sections that may sit below large headers or media areas.",
  "Use the same public page names on mobile and desktop; only the layout changes.",
];

const goodHabits = [
  "Start from the homepage when you are not sure which section contains the information.",
  "Use the page title and visible section headings to confirm you are in the correct place.",
  "Open Sign In only when the task requires an account or protected access.",
  "Use directory search when you are looking for a specific member, officer, or public record.",
];

const WebsiteNavigation = () => {
  return (
    <article className="mx-auto max-w-5xl pb-12">
      <OnThisPageRegister items={ON_THIS_PAGE} />

      <section id="overview" className="scroll-mt-36">
        <h1 className="mt-3 text-2xl font-bold tracking-tighter text-foreground">
          Public Website Navigation
        </h1>
        <div className="mt-6 space-y-5 text-muted-foreground">
          <p>
            This guide explains how visitors move through the public Pearl of
            the Orient website. Use it when a user needs to find public
            information, start an application, open a directory page, or move
            from public browsing into account-based workflows.
          </p>
          <p>
            Public pages are available before signing in. Some buttons may lead
            to protected pages, application forms, or account access when the
            next step requires a user record.
          </p>
        </div>
      </section>

      <section id="homepage" className="mt-14 scroll-mt-36">
        <FullScreenShotSection
          title="Homepage Entry Points"
          description="The homepage introduces the organization and gives visitors the main actions they need: browse public information, search records, read updates, open seminary pages, or begin membership."
          imageSrc="/docs-screenshots/navigation.png"
          imageAlt="Placeholder screenshot for the public website homepage"
        >
          <ol className="mt-5 space-y-3">
            {menuSteps.map((step) => (
              <li key={step} className="flex gap-2 text-sm">
                <Check className="mt-1 size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </FullScreenShotSection>
      </section>

      <section id="main-menu" className="mt-14 scroll-mt-36">
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          Main Menu
        </h2>
        <p className="mt-3 text-muted-foreground">
          The public header is the fastest way to move between the website
          areas. Menu labels should be treated as destination names: choose the
          one that matches the information or task the visitor needs.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-5">
            <div className="flex size-10 items-center justify-center rounded-md border bg-background text-[#0f6b2a]">
              <Menu className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold text-card-foreground">
              Browse Sections
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Move through organization pages, events, news, directory records,
              and seminary information.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <div className="flex size-10 items-center justify-center rounded-md border bg-background text-[#0f6b2a]">
              <Search className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold text-card-foreground">
              Find Records
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use search and directory pages when looking for a specific
              profile, officer, branch, or public listing.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <div className="flex size-10 items-center justify-center rounded-md border bg-background text-[#0f6b2a]">
              <MousePointerClick className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold text-card-foreground">
              Start Actions
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Follow buttons for application, sign-in, seminary admission, or
              other workflows that continue beyond public browsing.
            </p>
          </div>
        </div>
      </section>

      <section id="public-pages" className="mt-14 scroll-mt-36">
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          Public Pages
        </h2>
        <p className="mt-3 text-muted-foreground">
          These are the common public destinations visitors may open without
          account access.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {publicPages.map((page) => {
            const Icon = page.icon;

            return (
              <div key={page.title} className="rounded-lg border bg-card p-5">
                <div className="flex size-11 items-center justify-center rounded-md border bg-background text-[#0f6b2a]">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 font-semibold text-card-foreground">
                  {page.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {page.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="mobile-navigation" className="mt-14 scroll-mt-36">
        <FullScreenShotSection
          title="Mobile Navigation"
          description="On smaller screens, public navigation may collapse into a menu button. The available pages stay the same, but visitors open them from a compact menu instead of a full header."
          imageSrc="/docs-screenshots/mobile-nav.png"
          imageAlt="Placeholder GIF for public website mobile navigation"
        >
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {mobileTips.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm">
                <Check className="mt-1 size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </FullScreenShotSection>
      </section>

      <section id="good-habits" className="mt-14 scroll-mt-36">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-2xl font-bold tracking-tighter text-foreground">
            Good Habits
          </h2>
          <p className="mt-3 text-muted-foreground">
            These habits help visitors avoid opening the wrong page or starting
            the wrong workflow.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {goodHabits.map((habit) => (
              <li key={habit} className="flex items-start gap-2 text-sm">
                <Check className="mt-1 size-4 shrink-0 text-[#0f6b2a]" />
                <span className="text-muted-foreground">{habit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="mt-14 space-y-8">
        <Link
          href="/documentation/search-directory"
          className="group flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:border-[#0f6b2a]/50 hover:bg-[#0f6b2a]/5"
        >
          <div>
            <p className="text-xs font-medium text-muted-foreground">Next</p>
            <p className="text-lg font-semibold text-foreground">
              Search and Directory
            </p>
          </div>
          <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Last updated June 7, 2026
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            &copy; 2026 Pearl of the Orient International Auxiliary Chaplain
            Values Educators Inc.
          </p>
        </div>
      </footer>
    </article>
  );
};

const FullScreenShotSection = ({
  title,
  description,
  imageSrc,
  imageAlt,
  children,
}: {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  children: ReactNode;
}) => {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <ScreenshotPlaceholder src={imageSrc} alt={imageAlt} />
      <div className="border-t p-6">
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          {title}
        </h2>
        <p className="mt-3 text-muted-foreground">{description}</p>
        {children}
      </div>
    </div>
  );
};

const ScreenshotPlaceholder = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="bg-background">
      <div className="relative aspect-video min-h-70">
        <Image src={src} alt={alt} fill className="" />
      </div>
    </div>
  );
};

export default WebsiteNavigation;
