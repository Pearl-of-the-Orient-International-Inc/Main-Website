"use client";

import { useState } from "react";
import { OnboardingWizard } from "../_components/onboarding/OnboardingWizard";
import { loadDraft } from "../_components/draftStorage";
import {
  getOrCreateOnboardingMeta,
  saveOnboardingMeta,
} from "../_components/onboarding/storage";
import type {
  FrontendOnboardingApplication,
  FrontendOnboardingMeta,
} from "../_components/onboarding/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/providers/AuthGuard";

export default function OnboardingPage() {
  const router = useRouter();
  const [application, setApplication] = useState<FrontendOnboardingApplication>(
    () => {
      const { form } = loadDraft();
      const meta = getOrCreateOnboardingMeta();
      return { ...form, ...meta };
    },
  );

  const handleMetaChange = (meta: FrontendOnboardingMeta) => {
    saveOnboardingMeta(meta);
    setApplication((prev) => ({ ...prev, ...meta }));
  };

  return (
    <AuthGuard>
      <section className="bg-neutral-300 min-h-screen py-8 sm:py-10 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 border border-black/10 bg-white px-5 py-5 sm:px-8 sm:py-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <Image
                src="/main/logo.png"
                alt="Pearl of the Orient logo"
                width={100}
                height={100}
                className="size-16 sm:size-20"
                priority
              />
              <div>
                <h1 className="font-serif text-xl text-neutral-900 sm:text-3xl">
                  Chaplaincy Ministries
                </h1>
                <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
                  Pearl of the Orient International Auxiliary Chaplain Values
                  Educators Inc.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="mb-4 border-[#032a0d]/30 ml-auto text-[#032a0d] hover:bg-[#032a0d]/5"
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
            </div>
          </div>
          <OnboardingWizard
            application={application}
            onMetaChangeAction={handleMetaChange}
          />
        </div>
      </section>
    </AuthGuard>
  );
}
