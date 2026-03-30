import { SignInForm } from "@/components/forms/auth/SignInForm";
import Link from "next/link";

const Page = async ({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const redirectTo =
    typeof resolvedSearchParams?.redirect === "string" &&
    resolvedSearchParams.redirect.startsWith("/")
      ? resolvedSearchParams.redirect
      : "/";

  return (
    <div className="bg-white">
      {/* Hero / Banner */}
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
            <span className="font-medium text-white">Sign in</span>
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide">
            Sign in
          </h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-white/80 leading-relaxed">
            Please sign in using your registered email address and password to
            access your account. You may also continue using Google or Facebook
            for a faster and more convenient sign-in experience.
          </p>
        </div>
      </section>
      <SignInForm redirectTo={redirectTo} />
    </div>
  );
};

export default Page;
