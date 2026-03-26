import Image from "next/image";
import Link from "next/link";

const messageParagraphs = [
  "It is with deep honor and a shared sense of purpose that we present the Pearl of the Orient International Auxiliary Chaplaincy Handbook. This handbook has been thoughtfully crafted to serve as a guiding resource for all those who are called to support, serve, and uplift the spiritual and emotional well-being of our diverse global community. Whether you are a seasoned chaplain or new to this essential role, this document will provide clarity, inspiration, and practical tool to fulfill your sacred responsibilities.",
  "At Pearl Chaplaincy International, we recognize the profound importance of chaplaincy work in fostering healing, providing spiritual guidance, and promoting peace in times of crisis, joy, and challenge.",
  "The auxiliary chaplaincy, as an integral part of our global mission, stands as a beacon of compassion, care, and support to individuals in need, regardless of their background or circumstances. This handbook is designed to empower you to carry out this important work with confidence, compassion, and clarity, reinforcing the core values of our community.",
];

const biographyParagraphs = [
  "Bishop Dr. Rodel Manzo serves as the Chief Chaplain of Pearl of the Orient International Auxiliary Chaplain Values Educators Inc., providing spiritual oversight, organizational direction, and pastoral leadership to the ministry. His work is centered on strengthening the organization's biblical foundation while guiding chaplains to serve with humility, discipline, and compassion.",
  "With years of ministry experience, he has championed values education, community engagement, and leadership formation across different sectors. His leadership emphasizes prayerful discernment, servant-hearted administration, and the continued development of chaplaincy programs that respond to real needs in both church and civic spaces.",
];

const Page = () => {
  return (
    <main className="bg-[#f8f7f2] text-[#24334d]">
      <section className="relative overflow-hidden bg-[#032a0d] text-white">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-20" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),linear-gradient(135deg,rgba(0,0,0,0.18),transparent_60%)]" />

        <div className="relative mx-auto mt-10 max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <p className="mb-3 text-xs text-white/70 sm:text-sm">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>{" "}
            <span className="mx-2 text-white/50">/</span>
            <span className="font-medium text-white">
              Office of the Chief Chaplain
            </span>
          </p>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h1 className="max-w-4xl font-serif text-4xl font-semibold sm:text-5xl lg:text-5xl">
                Office of the Chief Chaplain
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">
                A page dedicated to the message, leadership, and ministry
                profile of the Chief Chaplain, presented in a formal editorial
                layout inspired by your sample design.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm sm:p-6">
              <p className="text-xs font-semibold uppercase text-[#d7e6cf]">
                In Focus
              </p>
              <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                Bishop Dr. Rodel Manzo
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Chief Chaplain of Pearl of the Orient International Auxiliary
                Chaplain Values Educators Inc.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto px-6 max-w-7xl space-y-8">
          <article
            id="message"
            className="overflow-hidden rounded-xl border border-[#dbe3d6] bg-white shadow-[0_18px_60px_rgba(3,42,13,0.08)]"
          >
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <div className="border-b border-[#e7ece4] bg-[#fbfcf8] lg:border-b-0 lg:border-r">
                <div className="relative mx-auto h-full w-full max-w-184 overflow-hidden bg-[#edf3e8]">
                  {/* <Image
                    src="/officers/Manzo.png"
                    alt="Bishop Dr. Rodel Manzo"
                    fill
                    className="object-contain object-center"
                    priority
                  /> */}
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-12">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-bold tracking-tight text-[#162038] sm:text-4xl lg:text-4xl">
                    Message from the Chief Chaplain
                  </h2>
                </div>

                <div className="mt-5 space-y-5 text-base leading-loose text-[#667a97] sm:text-lg">
                  {messageParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[#e7ece4] px-6 py-8 sm:px-8 lg:px-12 lg:py-10">
              <div className="space-y-5 text-base leading-loose text-[#667a97] sm:text-lg">
                <p>
                  Within these pages, you will find detailed guidelines on the
                  roles and responsibilities of an auxiliary chaplain, ethical
                  considerations, spiritual care strategies, and best practices
                  for supporting individuals from various cultural, religious,
                  and socio-economic backgrounds. We emphasize the importance of
                  listening with empathy, offering support without judgment, and
                  helping others find the strength and peace they need through
                  faith, love, and understanding.
                </p>
                <p>
                  The Pearl of the Orient International Auxiliary Chaplaincy
                  Value Educator is built upon a foundation of unity, respect,
                  and the shared belief in the inherent dignity of every person.
                  As you engage in this meaningful work, you will be helping to
                  create spaces where individuals can experience the
                  transformative power of spiritual care, offering comfort and
                  guidance in times of uncertainty, grief, and joy. You are not
                  only a spiritual guide, but also a friend, a counselor, and a
                  trusted confidant for those you serve.
                </p>
                <p>
                  We invite you to use this handbook not just as a tool for your
                  work, but as an inspiration to continually deepen your
                  spiritual practice, strengthen your connection to our
                  community, and remain mindful of the profound impact you have
                  on the lives of those you serve. Together, we can nurture a
                  world that is more compassionate, more understanding, and more
                  supportive of the diverse spiritual needs of individuals
                  everywhere.
                </p>
                <p>
                  Thank you for your dedication to the mission of the Pearl
                  International Auxiliary Chaplaincy. Through your compassion
                  and service, we continue to build a better world, one soul at
                  a time.
                </p>
                <p>With deep gratitude and blessings,</p>
              </div>

              <div className="mt-8 flex flex-col gap-5 border-t border-[#dbe3d6] pt-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-2xl font-semibold text-[#162038]">
                    Bishop Dr. Rodel Manzo, Phd.,EdD.,Dmin.,MPA.
                  </p>
                  <p className="mt-2 text-lg font-medium text-[#667a97]">
                    Chief Chaplain
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-xl border border-[#e0e6da] bg-white shadow-[0_18px_60px_rgba(3,42,13,0.06)]">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-6 sm:p-8 lg:p-12">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-bold tracking-tight text-[#162038] sm:text-4xl lg:text-4xl">
                    About the Chief Chaplain
                  </h2>
                </div>

                <div className="mt-5 space-y-5 text-base leading-loose text-[#667a97] sm:text-lg">
                  {biographyParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="flex items-start justify-center lg:justify-end">
                <div className="relative h-full w-full max-w-184 overflow-hidden bg-[linear-gradient(180deg,#f7f4eb_0%,#eef2e7_100%)]">
                  <Image
                    src="/officers/Manzo.png"
                    alt="Chief Chaplain portrait"
                    fill
                    className="object-contain object-bottom"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-[#e7ece4] px-6 py-8 sm:px-8 lg:px-12 lg:py-10">
              <h2 className="text-3xl font-bold tracking-tight text-[#162038] sm:text-4xl lg:text-4xl">
                Dedication
              </h2>
              <div className="space-y-7 mt-5 text-base leading-loose text-[#667a97] sm:text-lg">
                <p>
                  The role of a chaplain is one of profound significance, rooted
                  in service, compassion, and the unwavering commitment to guide
                  others spiritually through life&apos;s challenges. To those
                  who have gone before, we honor your tireless dedication to the
                  souls entrusted to your care. Your sacrifices and selfless
                  service laid the foundation for the work that continues today.
                  Your prayers, counsel, and ministry have left a lasting
                  imprint on the lives of many.
                </p>
                <p>
                  To those serving in the present, your mission is just as vital
                  and timeless. You are a beacon of hope in times of distress,
                  offering comfort in moments of despair, and pointing others to
                  the divine through your words and actions. Your role is not
                  just to minister, but to listen, understand, and bring peace
                  in turbulent times. The needs of the faithful may shift, but
                  your core mission remains: to embody God&apos;s love and
                  extend His grace to those in need.
                </p>
                <p>
                  To the chaplains of the future, the path before you will
                  undoubtedly present new challenges, yet your calling remains
                  constant. As you step into this sacred role, may you always
                  remember the power of empathy, the strength in humility, and
                  the importance of prayerful discernment. You will be entrusted
                  with the care of souls, and with that, comes the sacred
                  responsibility to lead by example, uphold the truth, and
                  inspire hope.
                </p>
                <p>
                  May each chaplain, past, present, and future, find strength in
                  knowing that your service is part of a greater purpose, and
                  that in each word spoken, each prayer offered, and each act of
                  compassion, you reflect the eternal love of God. May you
                  continue to walk humbly, faithfully, and courageously, knowing
                  that you are instruments of peace and light in a world that
                  desperately needs it.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Page;
