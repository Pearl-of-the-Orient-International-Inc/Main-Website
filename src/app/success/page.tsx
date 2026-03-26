import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ChevronRight, FileText, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function BecomeMemberSuccessPage() {
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
                <p className="text-lg font-semibold">
                  Thank you. Your membership form has been received.
                </p>
                <p className="mt-1 text-sm leading-6 text-emerald-800/90">
                  This is a temporary confirmation page while the next public
                  follow-up flow is being finalized.
                </p>
              </div>
            </div>

            <div className="rounded-xl border bg-neutral-50 p-5">
              <div className="flex items-center gap-2 text-[#032a0d]">
                <FileText className="size-4" />
                <p className="font-medium">What happens next</p>
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-700">
                <li>Your submitted details will be reviewed by the ministry team.</li>
                <li>You may be contacted for the next steps in the membership process.</li>
                <li>Please keep your phone number and email available for updates.</li>
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
                  Submit another response
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
