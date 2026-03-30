import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ChevronRight, Clock3, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

type SuccessPageProps = {
  searchParams?: Promise<{
    createdUser?: string;
    verified?: string;
  }>;
};

const getSuccessContent = ({
  createdUser,
  verified,
}: {
  createdUser: boolean;
  verified: boolean;
}) => {
  if (createdUser) {
    return {
      title: "Your membership application has been received.",
      description:
        "We created your pending account and sent your temporary login credentials plus verification link to your email. The admin team will review your application first, and onboarding will only open once your application is approved.",
      steps: [
        "Check your email for your temporary password and verification link.",
        "Your submitted details will stay pending while the admin reviews them.",
        "After approval, you can log in and continue the onboarding flow.",
        "Please keep your phone number and email active for updates.",
      ],
    };
  }

  if (!verified) {
    return {
      title: "Your membership application has been received.",
      description:
        "Your account already exists, so we only sent a verification link to your email. The admin team will review your application first, and onboarding will only open once your application is approved.",
      steps: [
        "Check your email for your verification link.",
        "Your submitted details will stay pending while the admin reviews them.",
        "After approval and email verification, you can log in and continue the onboarding flow.",
        "Please keep your phone number and email active for updates.",
      ],
    };
  }

  return {
    title: "Your membership application has been received.",
    description:
      "Your account is already verified, so your application is now queued for admin review. Onboarding will only open once your application is approved.",
    steps: [
      "Your submitted details will stay pending while the admin reviews them.",
      "After approval, you can log in with your existing account and continue the onboarding flow.",
      "Please keep your phone number and email active for updates.",
      "You can return to the homepage while waiting for the next update.",
    ],
  };
};

export default async function BecomeMemberSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const createdUser = resolvedSearchParams?.createdUser === "1";
  const verified = resolvedSearchParams?.verified === "1";
  const content = getSuccessContent({ createdUser, verified });

  return (
    <section className="min-h-screen bg-neutral-300 py-8 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-4xl px-4">
        <div className="overflow-hidden border border-black/10 bg-white shadow-sm">
          <div className="border-b border-black/10 bg-[#032a0d] px-6 py-5 text-white sm:px-8">
            <div className="flex items-center gap-4">
              <Image
                src="/main/logo.png"
                alt="Pearl of the Orient logo"
                width={88}
                height={88}
                className="size-16 sm:size-20"
                priority
              />
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/70">
                  Membership Application
                </p>
                <h1 className="mt-1 font-serif text-2xl sm:text-3xl">
                  Application Submitted
                </h1>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-6 py-8 sm:px-8">
            <div className="flex items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
              <CheckCircle2 className="mt-0.5 size-6 shrink-0" />
              <div>
                <p className="text-lg font-semibold">{content.title}</p>
                <p className="mt-1 text-sm leading-6 text-emerald-800/90">
                  {content.description}
                </p>
              </div>
            </div>

            <div className="rounded-xl border bg-neutral-50 p-5">
              <div className="flex items-center gap-2 text-[#032a0d]">
                <Clock3 className="size-4" />
                <p className="font-medium">What happens next</p>
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-700">
                {content.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/">
                  <Home className="size-4" />
                  Back to home
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/become-a-member">
                  Back to application form
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
