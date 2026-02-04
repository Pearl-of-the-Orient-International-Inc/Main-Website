"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BecomeMemberHero } from "../_components/BecomeMemberHero";
import { OnboardingWizard } from "../_components/onboarding/OnboardingWizard";
import { api } from '../../../../../convex/_generated/api';

export default function OnboardingPage() {
  const router = useRouter();
  const application = useQuery(api.backend.membership.getApplication);

  useEffect(() => {
    if (application === undefined) return;
    if (!application) {
      router.replace("/become-a-member");
      return;
    }
    if (application.applicationStatus !== "Submitted" && application.applicationStatus !== "Under Review" && application.applicationStatus !== "Approved") {
      router.replace("/become-a-member");
    }
  }, [application, router]);

  if (application === undefined) {
    return (
      <div className="bg-neutral-50 min-h-screen">
        <BecomeMemberHero />
        <section className="py-10 sm:py-12 lg:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-[#032a0d]/15 bg-white shadow-sm p-8 text-center text-[#032a0d]/70">
              Loading…
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <div className="bg-neutral-50">
      <BecomeMemberHero />
      <OnboardingWizard application={application} />
    </div>
  );
}
