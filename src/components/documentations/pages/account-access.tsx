import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertCircle,
  Check,
  ChevronRight,
  KeyRound,
  MailCheck,
  ShieldCheck,
} from "lucide-react";
import {
  IconLockFilled,
  IconMailFilled,
  IconUserCheck,
} from "@tabler/icons-react";

import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

import { OnThisPageRegister } from "@/components/documentations/OnThisPageRegister";

const ON_THIS_PAGE = [
  { label: "Overview", href: "#overview" },
  { label: "Before Signing In", href: "#before-signing-in" },
  { label: "Sign In", href: "#sign-in" },
  { label: "Social Sign In", href: "#social-sign-in" },
  { label: "Confirm Account", href: "#confirm-account" },
  { label: "Forgot Password", href: "#forgot-password" },
  { label: "Access by Role", href: "#access-by-role" },
  { label: "Troubleshooting", href: "#troubleshooting" },
];

const signInSteps = [
  "Open the Sign In page from the website menu or any protected workflow.",
  "Enter the email address registered to your Pearl of the Orient account.",
  "Enter your password. Use the eye button if you need to check what you typed.",
  "Select Sign In and wait for the system to validate your account.",
  "If you came from an onboarding or protected page, the system returns you to that workflow after successful sign-in.",
];

const beforeSigningIn = [
  {
    title: "Use your registered email",
    description:
      "The account form expects the email address already connected to your member, officer, admin, or seminary profile.",
    icon: IconMailFilled,
  },
  {
    title: "Confirm your account first",
    description:
      "If the system says email verification is required, open the verification email and complete account confirmation.",
    icon: IconUserCheck,
  },
  {
    title: "Keep your password private",
    description:
      "Do not share passwords with other users. Admins should create or assign access through authorized account tools.",
    icon: IconLockFilled,
  },
];

const accessRows = [
  {
    role: "Public visitor",
    access:
      "Can browse public pages and start membership or seminary application flows.",
    afterSignIn:
      "May be redirected to onboarding or profile-related pages after creating an account.",
  },
  {
    role: "Member",
    access:
      "Can view profile information, onboarding status, requirements, certificates, and renewal-related pages.",
    afterSignIn:
      "Usually continues to profile, onboarding, or member task pages.",
  },
  {
    role: "Officer",
    access:
      "Can access officer-related records and assigned office workflows when permissions are granted.",
    afterSignIn:
      "Starts from officer dashboard or assigned member review pages.",
  },
  {
    role: "Admin",
    access:
      "Can manage members, events, certificates, reports, accounts, settings, logs, and backups.",
    afterSignIn:
      "Starts from the admin dashboard or the protected page originally requested.",
  },
  {
    role: "Seminary staff",
    access:
      "Can manage admissions, enrollment, students, faculty, academic records, documents, and fees.",
    afterSignIn:
      "Starts from the seminary admin dashboard or requested protected seminary page.",
  },
];

const resetSteps = [
  "Open Forgot Password from the sign-in form.",
  "Enter the email address connected to your account.",
  "Request a reset code and check your email inbox.",
  "Enter the 6-digit verification code.",
  "Create and confirm your new password.",
  "Return to Sign In and log in with the new password.",
];

const troubleshooting = [
  {
    title: "Missing credentials",
    description:
      "If the form warns about missing credentials, enter both email address and password before submitting.",
  },
  {
    title: "Verification required",
    description:
      "If says verification is required, confirm the account through the verification email before trying again.",
  },
  {
    title: "Forgotten password",
    description:
      "Use Forgot Password to request a code, reset your password, and return to the sign-in page.",
  },
  {
    title: "Wrong page after sign-in",
    description:
      "If you expected to return to a protected page, open the original link again after signing in.",
  },
];

const AccountAccess = () => {
  return (
    <article className="mx-auto max-w-5xl pb-12">
      <OnThisPageRegister items={ON_THIS_PAGE} />

      <section id="overview" className="scroll-mt-36">
        <h1 className="mt-3 text-2xl font-bold tracking-tighter text-foreground">
          Sign In and Account Access
        </h1>
        <div className="mt-6 space-y-5 text-muted-foreground">
          <p>
            This guide explains how users access their Pearl of the Orient
            account, what to check before signing in, and what to do when an
            account requires verification or password recovery.
          </p>
          <p>
            Account access depends on the user role. Members, officers, admins,
            and seminary staff may use the same sign-in form, but the pages they
            can open after signing in depend on their permissions.
          </p>
        </div>
      </section>

      <section id="before-signing-in" className="mt-12 scroll-mt-36">
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          Before Signing In
        </h2>
        <p className="mt-3 text-muted-foreground">
          Check these items before asking support for help. Most access issues
          come from email, verification, or role permission problems.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {beforeSigningIn.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-lg border bg-card p-5">
                <div className="flex size-10 items-center justify-center rounded-md border bg-background text-[#0f6b2a]">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold text-card-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="sign-in" className="mt-14 scroll-mt-36">
        <FullScreenShotSection
          title="Sign In with Email and Password"
          description="Use the sign-in form when you already have an account. The form asks for email and password, includes a show/hide password button, and displays status messages when credentials are missing or invalid."
          imageSrc="/docs-screenshots/sign-in.png"
          imageAlt="Placeholder screenshot for the sign-in form"
        >
          <ol className="mt-5 space-y-3">
            {signInSteps.map((step) => (
              <li key={step} className="flex gap-2 text-sm">
                <Check className="mt-1 size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </FullScreenShotSection>
      </section>

      <section id="social-sign-in" className="mt-14 scroll-mt-36">
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3">
            <FcGoogle className="shrink-0 size-5" />
            <div>
              <p className="font-semibold text-foreground">Google</p>
              <p className="text-sm text-muted-foreground">
                Visible as a quick sign-in option.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3">
            <FaFacebook className="shrink-0 size-5 text-[#0866FF]" />
            <div>
              <p className="font-semibold text-foreground">Facebook</p>
              <p className="text-sm text-muted-foreground">
                Visible as a quick sign-in option.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="confirm-account" className="mt-14 scroll-mt-36">
        <ul className="mt-5 space-y-3">
          <li className="flex gap-3 text-sm leading-6">
            <MailCheck className="mt-0.5 size-4 shrink-0 text-[#0f6b2a]" />
            <span className="text-muted-foreground">
              Open the verification link sent to the registered email address.
            </span>
          </li>
          <li className="flex gap-3 text-sm leading-6">
            <KeyRound className="mt-0.5 size-4 shrink-0 text-[#0f6b2a]" />
            <span className="text-muted-foreground">
              If the link is missing a token or has expired, request a new
              verification email from an authorized workflow or admin.
            </span>
          </li>
          <li className="flex gap-3 text-sm leading-6">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#0f6b2a]" />
            <span className="text-muted-foreground">
              After successful verification, return to Sign In and use your
              email and password.
            </span>
          </li>
        </ul>
      </section>

      <section id="forgot-password" className="mt-14 scroll-mt-36">
        <FullScreenShotSection
          title="Forgot Password"
          description="Use the Forgot Password page when a user cannot remember their password. The reset UI asks for an email address, opens a verification-code dialog, and then allows a new password after the code is complete."
          imageSrc="/docs-screenshots/forgot-password.png"
          imageAlt="Placeholder GIF for forgot password flow"
        >
          <ol className="mt-5 space-y-3">
            {resetSteps.map((step) => (
              <li key={step} className="flex gap-2 text-sm">
                <Check className="mt-1 size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </FullScreenShotSection>
      </section>

      <section id="access-by-role" className="mt-14 scroll-mt-36">
        <h2 className="text-2xl font-bold tracking-tighter text-foreground">
          Access by Role
        </h2>
        <p className="mt-3 text-muted-foreground">
          Signing in does not automatically give every user access to every
          page. Access depends on the account type and assigned permissions.
        </p>

        <div className="mt-6 overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/60 text-foreground">
              <tr>
                <th className="border-b px-4 py-3 font-semibold">Role</th>
                <th className="border-b px-4 py-3 font-semibold">
                  Expected access
                </th>
                <th className="border-b px-4 py-3 font-semibold">
                  After sign-in
                </th>
              </tr>
            </thead>
            <tbody>
              {accessRows.map((row) => (
                <tr key={row.role} className="border-b last:border-b-0">
                  <td className="px-4 py-4 font-medium text-foreground">
                    {row.role}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {row.access}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {row.afterSignIn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="troubleshooting" className="mt-14 scroll-mt-36">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-[#0f6b2a]/10 text-[#0f6b2a]">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tighter text-foreground">
                Troubleshooting
              </h2>
              <p className="text-muted-foreground">
                Use these checks when a user cannot access the expected page.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {troubleshooting.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border bg-background p-4"
              >
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-14 space-y-8">
        <Link
          href="/documentation/website-navigation"
          className="group flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:border-[#0f6b2a]/50 hover:bg-[#0f6b2a]/5"
        >
          <div>
            <p className="text-xs font-medium text-muted-foreground">Next</p>
            <p className="text-lg font-semibold text-foreground">
              Public Website Navigation
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
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    </div>
  );
};

export default AccountAccess;
