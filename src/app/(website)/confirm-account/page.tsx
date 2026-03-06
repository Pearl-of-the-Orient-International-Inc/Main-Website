import Link from "next/link";
import { Suspense } from "react";
import { ConfirmAccountForm } from "@/components/forms/auth/ConfirmAccountForm";

const Page = () => {
  return (
    <div className="bg-white">
      <section className="relative bg-[#032a0d] text-white">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-40" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 mt-10">
          <p className="text-xs sm:text-sm text-white/70 mb-2">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>{" "}
            <span className="mx-1 sm:mx-2 text-white/50">/</span>{" "}
            <span className="font-medium text-white">Confirm account</span>
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide">
            Confirm account
          </h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-white/80 leading-relaxed">
            We are validating your verification link and activating your account.
          </p>
        </div>
      </section>

      <Suspense fallback={<ConfirmAccountFallback />}>
        <ConfirmAccountForm />
      </Suspense>
    </div>
  );
};

const ConfirmAccountFallback = () => {
  return (
    <section className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto space-y-8 py-10">
      <div className="mx-auto max-w-xl rounded-[calc(var(--radius)+.125rem)] border bg-card p-8 shadow-md shadow-zinc-950/5">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold">Confirm Account</h2>
          <p className="text-sm text-muted-foreground">Loading verification details...</p>
        </div>
      </div>
    </section>
  );
};

export default Page;
