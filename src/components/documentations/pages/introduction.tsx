import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";

import { OnThisPageRegister } from "@/components/documentations/OnThisPageRegister";
import {
  IconAppsFilled,
  IconContainerFilled,
  IconFileUploadFilled,
  IconLayoutDashboardFilled,
  IconPinFilled,
  IconSchoolFilled,
  IconSettingsFilled,
  IconShieldCheckFilled,
  IconSitemapFilled,
  IconUserFilled,
} from "@tabler/icons-react";

const ON_THIS_PAGE = [
  { label: "Welcome", href: "#welcome" },
  { label: "Quick Actions", href: "#quick-actions" },
  { label: "Explore by Feature", href: "#features" },
  { label: "User Roles", href: "#roles" },
  { label: "Documentation Map", href: "#documentation-map" },
];

const quickActions = [
  {
    title: "Become a Member",
    description:
      "Follow the membership application, submit your details, and continue through onboarding.",
    href: "/documentation/become-a-member",
    icon: IconAppsFilled,
  },
  {
    title: "Upload Requirements",
    description:
      "Attach documents, review missing items, and keep your application moving forward.",
    href: "/documentation/become-a-member/application-requirements",
    icon: IconFileUploadFilled,
  },
  {
    title: "Attach Certificates",
    description:
      "Add certificate records to a member profile so recognitions stay complete and visible.",
    href: "/documentation/attach-certificates",
    icon: IconPinFilled,
  },
];

const features = [
  {
    title: "Membership",
    description:
      "Application steps, onboarding, payment, oath taking, certificate access, and renewal guidance.",
    icon: IconUserFilled,
  },
  {
    title: "Member Profiles",
    description:
      "Profile viewing, public records, certificate attachments, QR codes, and member history.",
    icon: IconContainerFilled,
  },
  {
    title: "Admin Operations",
    description:
      "Members, pending applications, events, news, memos, reports, accounts, logs, and backups.",
    icon: IconLayoutDashboardFilled,
  },
  {
    title: "Officer Workflows",
    description:
      "Assigned offices, member follow-ups, organizational structure, and ministry activity reviews.",
    icon: IconShieldCheckFilled,
  },
  {
    title: "Seminary",
    description:
      "Admissions, enrollment, students, faculty, learning materials, grades, documents, and fees.",
    icon: IconSchoolFilled,
  },
  {
    title: "Settings and CMS",
    description:
      "Branding, platform information, FAQs, office hours, policies, email, security, and access.",
    icon: IconSettingsFilled,
  },
];

const roleRows = [
  {
    role: "Public visitor",
    canDo:
      "Browse pages, search public information, view directory records, and start membership.",
    start: "Public Website Navigation",
  },
  {
    role: "Member",
    canDo:
      "Manage application progress, upload files, view profile details, and access certificates.",
    start: "Become a Member",
  },
  {
    role: "Officer",
    canDo:
      "Review assigned members, office responsibilities, and ministry follow-up items.",
    start: "Officer Dashboard",
  },
  {
    role: "Admin",
    canDo:
      "Manage records, approvals, events, certificates, accounts, reports, and CMS settings.",
    start: "Dashboard Overview",
  },
  {
    role: "Seminary user",
    canDo:
      "Apply for admission or manage academic, enrollment, LMS, and fee workflows.",
    start: "Seminary Website",
  },
];

const documentationMap = [
  "Use the left sidebar to jump between documentation groups.",
  "Use the right panel to move through headings on the current page.",
  "Use quick actions when you already know the task you want to complete.",
  "Review role-based sections when training a member, officer, admin, or seminary user.",
];

const Introduction = () => {
  return (
    <article className="mx-auto max-w-5xl pb-12">
      <OnThisPageRegister items={ON_THIS_PAGE} />

      <section id="welcome" className="scroll-mt-36">
        <h1 className="mt-3 text-2xl font-bold tracking-tighter text-foreground">
          Welcome to the Documentation
        </h1>
        <div className="mt-6 space-y-5 text-muted-foreground">
          <p>
            This documentation helps users understand how to navigate the Pearl
            of the Orient platform, complete membership tasks, manage records,
            and use the admin and seminary portals with confidence.
          </p>
          <p>
            It is written for the people who use the system every day: public
            visitors, applicants, members, officers, administrators, and
            seminary staff. Start with the section that matches your role, then
            use the sidebar to move into more specific workflows.
          </p>
        </div>
      </section>

      <section id="quick-actions" className="mt-12 scroll-mt-36">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter text-foreground">
              Quick Actions
            </h2>
            <p className="mt-2 text-muted-foreground">
              Common tasks users usually need first.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-lg border bg-card p-5 shadow-sm transition-colors hover:border-[#0f6b2a]/50 hover:bg-[#0f6b2a]/5"
              >
                <div className="flex size-11 items-center justify-center rounded-md border bg-background text-[#0f6b2a]">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-card-foreground">
                  {action.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {action.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#0f6b2a]">
                  Open guide
                  <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="features" className="mt-14 scroll-mt-36">
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          Explore by Feature
        </h2>
        <div className="mt-7 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="flex gap-4">
                <div className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="roles" className="mt-14 scroll-mt-36">
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          User Roles
        </h2>
        <p className="mt-3 text-muted-foreground">
          Use this table to find the best starting point for each type of user.
        </p>

        <div className="mt-6 overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/60 text-foreground">
              <tr>
                <th className="border-b px-4 py-3 font-semibold">Role</th>
                <th className="border-b px-4 py-3 font-semibold">
                  What this user can do
                </th>
                <th className="border-b px-4 py-3 font-semibold">
                  Recommended guide
                </th>
              </tr>
            </thead>
            <tbody>
              {roleRows.map((row) => (
                <tr key={row.role} className="border-b last:border-b-0">
                  <td className="px-4 py-4 font-medium text-foreground">
                    {row.role}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {row.canDo}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {row.start}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="documentation-map" className="mt-14 scroll-mt-36">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-[#0f6b2a]/10 text-[#0f6b2a]">
              <IconSitemapFilled className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tighter text-foreground">
                Documentation Map
              </h2>
              <p className="text-muted-foreground">
                The guide is organized around real platform workflows rather
                than technical setup steps.
              </p>
            </div>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {documentationMap.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Search className="mt-1 size-4 shrink-0 text-[#0f6b2a]" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="mt-14 space-y-8">
        <Link
          href="/documentation#getting-around"
          className="group flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:border-[#0f6b2a]/50 hover:bg-[#0f6b2a]/5"
        >
          <div>
            <p className="text-xs font-medium text-muted-foreground">Next</p>
            <p className="text-lg font-semibold text-foreground">
              Getting Around
            </p>
          </div>
          <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Last updated June 7, 2026
          </p>
          <p className="text-sm font-medium text-muted-foreground">&copy; 2026 Pearl of the Orient International Auxiliary Chaplain Values Educators Inc.</p>
        </div>
      </footer>
    </article>
  );
};

export default Introduction;
