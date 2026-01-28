import Link from "next/link";
import { MapPin, Clock, IdCardIcon } from "lucide-react";

const DirectoryPage = () => {
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
            <span className="font-medium text-white">Directory</span>
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide">
            Directory
          </h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-white/80 leading-relaxed">
            Find our location, contact details, and how to reach Pearl of the
            Orient International Auxiliary Chaplain Values Educators Inc.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Short info block */}
            <section>
              <h3 className="font-serif text-lg sm:text-xl text-[#032a0d] mb-2">
                Visiting Us
              </h3>
              <p className="text-sm sm:text-base text-[#032a0d]/80 leading-relaxed">
                For chaplaincy inquiries, membership, or partnership, please
                contact us in advance. We welcome visitors by appointment and
                are happy to assist with orientation, training schedules, and
                general information about our ministries.
              </p>
            </section>
            {/* Embedded Map */}
            <section>
              <div className="rounded-lg border border-[#032a0d]/15 overflow-hidden bg-neutral-100 aspect-video min-h-70 sm:min-h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d123700.89283771999!2d120.8925331!3d14.3315833!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d71ac0ec20bd%3A0x6d4c26f82be599db!2sPearl%20of%20the%20Orient%20International%20Leaders%20%26%20Educators!5e0!3m2!1sen!2sph!4v1769570230492!5m2!1sen!2sph"
                  className="w-full h-full min-h-70 sm:min-h-80 border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </section>

            {/* Contact & visit info */}
            <section className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-[#032a0d]/15 bg-neutral-50/70 px-5 py-6">
                <h3 className="text-sm uppercase text-[#032a0d]/80 mb-3 flex items-center gap-2">
                  <MapPin className="size-4 shrink-0" />
                  Address
                </h3>
                <p className="text-sm sm:text-base text-[#032a0d]/80 leading-relaxed">
                  <b>Pearl of the Orient Headquarter</b>
                  <br />
                  Blk 151 Lot 14-20 Phase 1, Mabuhay City, Dasmarinas City, Cavite, Philippines
                </p>
              </div>

              <div className="rounded-lg border border-[#032a0d]/15 bg-neutral-50/70 px-5 py-6">
                <h3 className="text-sm uppercase text-[#032a0d]/80 mb-3 flex items-center gap-2">
                  <Clock className="size-4 shrink-0" />
                  Office Hours
                </h3>
                <p className="text-sm sm:text-base text-[#032a0d]/80 leading-relaxed">
                  Monday – Friday: 9:00 AM – 6:00 PM
                  <br />
                  Saturday: By appointment
                  <br />
                  Closed on public holidays
                </p>
              </div>

              <div className="rounded-lg border border-[#032a0d]/15 bg-neutral-50/70 px-5 py-6 sm:col-span-2">
                <h3 className="text-sm uppercase text-[#032a0d]/80 mb-3 flex items-center gap-2">
                  <IdCardIcon className="size-4 shrink-0" />Contact
                </h3>
                <div className="flex flex-wrap gap-6 text-sm sm:text-base text-[#032a0d]/80">
                  <a
                    href="mailto:poile2005official@gmail.com"
                    className="flex items-center gap-2 hover:text-[#032a0d] hover:underline underline-offset-2"
                  >
                    <b>Email:</b> poile2005official@gmail.com
                  </a>
                  <a
                    href="tel:+639194589099"
                    className="flex items-center gap-2 hover:text-[#032a0d] hover:underline underline-offset-2"
                  >
                    <b>Contact Number:</b> (+63) 919-458-9099
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DirectoryPage;
