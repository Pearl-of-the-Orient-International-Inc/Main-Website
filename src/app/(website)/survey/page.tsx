import Link from "next/link";
import { SurveyForm } from "./SurveyForm";

export const metadata = {
  title: "Community Feedback Survey | Pearl of the Orient",
  description: "Share feedback about your experience with Pearl of the Orient.",
};

export default function SurveyPage() {
  return (
    <div>
      <section className="relative bg-[#032a0d] text-white">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-40" />
        </div>
        <div className="relative mx-auto mt-10 max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <p className="mb-2 text-xs text-white/70 sm:text-sm">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span className="mx-2 text-white/50">/</span>
            <span className="font-medium text-white">Survey</span>
          </p>
          <h1 className="font-serif text-3xl font-semibold tracking-wide sm:text-4xl md:text-5xl lg:text-6xl">Community Feedback Survey</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">
            Help us understand your experience and identify ways to improve our chaplaincy programs, services, and community support.
          </p>
        </div>
      </section>
      <SurveyForm />
    </div>
  );
}
