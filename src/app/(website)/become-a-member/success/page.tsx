import Link from "next/link";
import { CheckCircle2, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BecomeMemberSuccessPage() {
  return (
    <section className="min-h-screen bg-neutral-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-3xl items-center justify-center">
        <div className="w-full overflow-hidden border border-black/10 bg-white shadow-sm">
          <div className="bg-[#032a0d] px-6 py-5 text-white sm:px-8">
            <p className="text-sm uppercase tracking-[0.24em] text-white/70">
              Membership Application
            </p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
              Application received
            </h1>
          </div>

          <div className="space-y-6 px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
              <CheckCircle2 className="mt-0.5 size-6 shrink-0" />
              <div className="space-y-1">
                <p className="font-semibold">Your membership form was submitted successfully.</p>
                <p className="text-sm text-emerald-900/80">
                  Our team will review your application and contact you through the email
                  address you provided.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-black/10 bg-neutral-50 p-4">
                <p className="text-sm font-semibold text-neutral-900">What happens next</p>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  After review, you may receive instructions for requirements,
                  orientation, payment, interview scheduling, and the rest of the
                  onboarding flow.
                </p>
              </div>

              <div className="rounded-xl border border-black/10 bg-neutral-50 p-4">
                <p className="text-sm font-semibold text-neutral-900">Keep an eye on your email</p>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  Please watch for updates from Pearl of the Orient regarding the next
                  steps of your application.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-black/10 pt-6 sm:flex-row">
              <Button asChild className="bg-[#032a0d] hover:bg-[#032a0d]/90">
                <Link href="/">
                  <ArrowLeft className="size-4" />
                  Back to home
                </Link>
              </Button>

              <Button asChild variant="outline">
                <Link href="/become-a-member">
                  <FileText className="size-4" />
                  Open application page
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
