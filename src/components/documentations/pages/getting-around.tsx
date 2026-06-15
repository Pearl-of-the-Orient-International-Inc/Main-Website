import Link from "next/link";
import { ChevronRight, Compass, Menu, Search } from "lucide-react";
import {
  IconCalendarEvent,
  IconFileTextFilled,
  IconLayoutDashboardFilled,
  IconListSearch,
  IconSchoolFilled,
  IconSettingsFilled,
  IconSitemapFilled,
  IconUserFilled,
  IconWorldFilled,
} from "@tabler/icons-react";

import { OnThisPageRegister } from "@/components/documentations/OnThisPageRegister";

const ON_THIS_PAGE = [
  { label: "Overview", href: "#overview" },
  { label: "Main Areas", href: "#main-areas" },
  { label: "Navigation Tools", href: "#navigation-tools" },
  { label: "Role Paths", href: "#role-paths" },
  { label: "Common Destinations", href: "#common-destinations" },
  { label: "Navigation Tips", href: "#navigation-tips" },
  { label: "When You Get Lost", href: "#when-you-get-lost" },
];

const mainAreas = [
  {
    title: "Public Website",
    description:
      "Browse organization pages, directory records, public profiles, and membership entry points.",
    icon: IconWorldFilled,
  },
  {
    title: "Member Area",
    description:
      "Continue applications, submit requirements, view onboarding progress, and check certificates.",
    icon: IconUserFilled,
  },
  {
    title: "Admin Portal",
    description:
      "Manage members, events, news, memos, certificates, reports, accounts, settings, and logs.",
    icon: IconLayoutDashboardFilled,
  },
  {
    title: "Seminary Portal",
    description:
      "Handle admissions, enrollment, students, faculty, learning materials, grades, and fees.",
    icon: IconSchoolFilled,
  },
];

const navigationTools = [
  {
    tool: "Left sidebar",
    use: "Moves between major documentation groups and task guides.",
    bestFor: "Jumping to another topic quickly.",
  },
  {
    tool: "Right panel",
    use: "Shows headings available on the current documentation page.",
    bestFor: "Scanning long pages without scrolling manually.",
  },
  {
    tool: "Top header",
    use: "Keeps the documentation area accessible while browsing.",
    bestFor: "Returning to main documentation navigation.",
  },
  {
    tool: "Quick action cards",
    use: "Open common tasks such as membership, uploads, certificates, and events.",
    bestFor: "Starting a known workflow immediately.",
  },
];

const rolePaths = [
  {
    role: "Applicant",
    domain: "Public website and member onboarding",
    steps: [
      "Open Become a Member",
      "Complete application requirements",
      "Review submitted details",
      "Continue to onboarding",
    ],
    note: "Best path when someone is applying for the first time.",
  },
  {
    role: "Member",
    domain: "Member profile and public record",
    steps: [
      "Open member profile",
      "Review public record",
      "Check certificates",
      "Start renewal when needed",
    ],
    note: "Best path for maintaining personal membership information.",
  },
  {
    role: "Officer",
    domain: "Officer workspace and assigned office",
    steps: [
      "Open officer dashboard",
      "Review assigned office",
      "Check assigned members",
      "Use reports for follow-ups",
    ],
    note: "Best path for reviewing responsibilities and follow-up work.",
  },
  {
    role: "Admin",
    domain: "Admin portal",
    steps: [
      "Open dashboard",
      "Manage members",
      "Create or review events",
      "Check reports",
      "Update settings",
    ],
    note: "Best path for daily operational work and record management.",
  },
  {
    role: "Seminary Staff",
    domain: "Seminary admin portal",
    steps: [
      "Open seminary dashboard",
      "Review admissions",
      "Manage enrollment",
      "Update academics",
      "Check fees",
    ],
    note: "Best path for school administration and academic workflows.",
  },
];

const destinations = [
  {
    title: "Membership application",
    href: "/documentation/become-a-member",
    icon: IconFileTextFilled,
  },
  {
    title: "Application requirements",
    href: "/documentation/become-a-member/application-requirements",
    icon: IconListSearch,
  },
  {
    title: "Attach certificates",
    href: "/documentation/attach-certificates",
    icon: IconSitemapFilled,
  },
  {
    title: "Create an event",
    href: "/documentation/events/create-an-event",
    icon: IconCalendarEvent,
  },
  {
    title: "Admin settings",
    href: "/documentation/admin/settings",
    icon: IconSettingsFilled,
  },
];

const navigationTips = [
  "Start from your role first, then choose the task you need to complete.",
  "Use page headings when a guide is long and you only need one section.",
  "Check the current page title before following steps, especially in admin workflows.",
  "Use tables to compare roles, permissions, and destinations before opening another guide.",
  "Return to the introduction when you need a broad map of the documentation.",
];

const GettingAround = () => {
  return (
    <article className="mx-auto max-w-5xl pb-12">
      <OnThisPageRegister items={ON_THIS_PAGE} />

      <section id="overview" className="scroll-mt-36">
        <h1 className="mt-3 text-2xl font-bold tracking-tighter text-foreground">
          Getting Around
        </h1>
        <div className="mt-6 space-y-5 text-muted-foreground">
          <p>
            This page explains how to move through the documentation and how to
            decide which part of the Pearl of the Orient platform you should
            open next. Use it when you know the kind of task you need to
            complete, but you are not yet sure where that task belongs.
          </p>
          <p>
            The platform is organized by role and workflow. Public visitors,
            members, officers, admins, and seminary staff may see different
            pages, but the documentation keeps those paths connected so users
            can follow the correct guide without guessing.
          </p>
        </div>
      </section>

      <section id="main-areas" className="mt-12 scroll-mt-36">
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          Main Areas
        </h2>
        <p className="mt-3 text-muted-foreground">
          Think of the system as four connected areas. Each area has its own
          purpose, but records may flow from one area to another.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {mainAreas.map((area) => {
            const Icon = area.icon;

            return (
              <div key={area.title} className="rounded-lg border bg-card p-5">
                <div className="flex size-11 items-center justify-center rounded-md border bg-background text-[#0f6b2a]">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-card-foreground">
                  {area.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="navigation-tools" className="mt-14 scroll-mt-36">
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          Navigation Tools
        </h2>
        <p className="mt-3 text-muted-foreground">
          Use these documentation tools to move around faster and keep your
          place while reading.
        </p>

        <div className="mt-6 overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/60 text-foreground">
              <tr>
                <th className="border-b px-4 py-3 font-semibold">Tool</th>
                <th className="border-b px-4 py-3 font-semibold">Use</th>
                <th className="border-b px-4 py-3 font-semibold">Best for</th>
              </tr>
            </thead>
            <tbody>
              {navigationTools.map((tool) => (
                <tr key={tool.tool} className="border-b last:border-b-0">
                  <td className="px-4 py-4 font-medium text-foreground">
                    {tool.tool}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {tool.use}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {tool.bestFor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="role-paths" className="mt-14 scroll-mt-36">
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          Role Paths
        </h2>
        <div className="mt-7 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {rolePaths.map((item) => (
            <div key={item.role} className="flex gap-4">
              <div className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground">
                <Compass className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{item.role}</h3>
                <p className="mt-1 text-sm font-medium text-[#0f6b2a]">
                  Domain: {item.domain}
                </p>
                <ul className="mt-3 space-y-2">
                  {item.steps.map((step) => (
                    <li key={step} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#0f6b2a]" />
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="common-destinations" className="mt-14 scroll-mt-36">
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          Common Destinations
        </h2>
        <p className="mt-3 text-muted-foreground">
          These shortcuts point to guides users often need after reading this
          page.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {destinations.map((destination) => {
            const Icon = destination.icon;

            return (
              <Link
                key={destination.title}
                href={destination.href}
                className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-[#0f6b2a]/50 hover:bg-[#0f6b2a]/5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-background text-[#0f6b2a]">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-card-foreground">
                    {destination.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Open documentation guide
                  </p>
                </div>
                <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </section>

      <section id="navigation-tips" className="mt-14 scroll-mt-36">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-[#0f6b2a]/10 text-[#0f6b2a]">
              <Menu className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tighter text-foreground">
                Navigation Tips
              </h2>
              <p className="text-muted-foreground">
                Use these habits when moving through the documentation or the
                main system.
              </p>
            </div>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {navigationTips.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm">
                <Search className="mt-1 size-4 shrink-0 text-[#0f6b2a]" />
                <span className="text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="when-you-get-lost" className="mt-14 scroll-mt-36">
        <div className="rounded-lg border bg-muted/30 p-6">
          <h2 className="text-2xl font-bold tracking-tighter text-foreground">
            When You Get Lost
          </h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            <p>
              If you are not sure where to go next, return to the documentation
              sidebar and choose the group that matches your role first. After
              that, choose the action you are trying to complete, such as
              uploading requirements, creating an event, or reviewing a member
              record.
            </p>
            <p>
              If the guide mentions a page you cannot access, your account may
              not have permission for that area. Contact an authorized admin and
              include the page name you were trying to open.
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-14 space-y-8">
        <Link
          href="/documentation/account-access"
          className="group flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:border-[#0f6b2a]/50 hover:bg-[#0f6b2a]/5"
        >
          <div>
            <p className="text-xs font-medium text-muted-foreground">Next</p>
            <p className="text-lg font-semibold text-foreground">
              Sign In and Account Access
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

export default GettingAround;
