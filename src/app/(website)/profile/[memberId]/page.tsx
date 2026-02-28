"use client";

import { AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const DEFAULT_MEMBER_SLIDE = "/temporary-members/Slide1.PNG";

function getMemberSlideImage(memberId?: string) {
  if (!memberId) return DEFAULT_MEMBER_SLIDE;

  const [, numericPart] = memberId.split("-");
  const memberNumber = Number.parseInt(numericPart ?? "", 10);

  if (Number.isNaN(memberNumber)) return DEFAULT_MEMBER_SLIDE;

  const slideIndex = memberNumber - 10;

  if (slideIndex >= 1 && slideIndex <= 26) {
    return `/temporary-members/Slide${slideIndex}.PNG`;
  }

  return DEFAULT_MEMBER_SLIDE;
}

export default function MemberProfilePage() {
  const { memberId } = useParams<{ memberId: string }>();
  const imageUrl = getMemberSlideImage(memberId);

  return (
    <div className="min-h-screen bg-neutral-100">
      <section className="relative overflow-hidden bg-[#032a0d] text-white pt-14 sm:pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <p className="text-xs text-white/70 sm:text-sm">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="mx-2 text-white/50">/</span>
            <span className="font-medium text-white">Member Profile</span>
          </p>
          <div className="mt-4 flex flex-col gap-5 sm:mt-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl font-semibold tracking-wide sm:text-4xl md:text-5xl">
                Member Verification
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">
                Official verification page for member ID{" "}
                <span className="font-semibold text-white">{memberId}</span>.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-6xl space-y-5 px-4 sm:px-6 lg:px-8">
          <Alert className="border-amber-300/80 bg-amber-50 text-amber-900">
            <AlertCircle className="size-4 text-amber-700" />
            <AlertTitle className="text-amber-900">
              Temporary Page Notice
            </AlertTitle>
            <AlertDescription className="text-amber-800">
              This page is currently under development and temporary. Once
              development is complete, you will be able to view full member
              records, certificates, profile details, credentials, and more.
            </AlertDescription>
          </Alert>

          <div className="rounded-2xl border border-[#032a0d]/15 bg-white p-3 shadow-sm sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#032a0d]/20 bg-[#032a0d]/5 px-3 py-1 text-xs font-medium text-[#032a0d] sm:text-sm">
                <ShieldCheck className="size-4" />
                Active Membership Verification
              </p>
              <p className="text-xs text-[#032a0d]/70 sm:text-sm">
                Reference: {memberId}
              </p>
            </div>

            <div className="relative w-full overflow-hidden rounded-xl border border-[#032a0d]/10 bg-neutral-50 aspect-16/10 sm:aspect-video">
              <Image
                src={imageUrl}
                alt={`Member verification for ${memberId}`}
                fill
                className="size-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
