import Link from "next/link";
import { OrdinationApplicationForm } from "./ordination-application-form";

export default function OrdinationApplicationPage() {
  return <div>
    <section className="relative bg-[#032a0d] text-white"><div className="absolute inset-0"><div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-40" /></div>
      <div className="relative mx-auto mt-10 max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><p className="mb-2 text-sm text-white/70"><Link href="/">Home</Link> / Ordination Application</p><h1 className="font-serif text-4xl font-semibold sm:text-5xl">Ordination Application</h1><p className="mt-4 max-w-2xl text-white/80">For active, approved Professional Chaplain members seeking formal ordination review.</p></div>
    </section>
    <OrdinationApplicationForm />
  </div>;
}
