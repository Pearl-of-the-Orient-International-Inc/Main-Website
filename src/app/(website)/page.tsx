import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import { ImagesSlider } from "@/components/magic-ui/ImagesSlider";
import Link from "next/link";
import { HeroVideoDialog } from "@/components/magic-ui/HeroVideoDialog";
import { WorldMap } from "@/components/magic-ui/WorldMap";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Timeline } from "@/components/magic-ui/Timeline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { EventResource, PublicEventsResponse } from "@/features/events/event.types";

const images = [
  "/hero-carousels/1.jpg",
  "/hero-carousels/2.jpg",
  "/hero-carousels/3.jpg",
  "/hero-carousels/4.jpg",
  "/hero-carousels/5.jpg",
  "/hero-carousels/6.jpg",
  "/hero-carousels/7.jpg",
];

type HomepageEventItem = {
  id: string;
  title: string;
  date: string;
  image: string;
};

const apiBaseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_API_BASE_URL_PROD;

async function getHomepageEvents(): Promise<HomepageEventItem[]> {
  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  try {
    const response = await fetch(
      `${apiBaseUrl}/events/public?limit=16&sortBy=startsAt&sortOrder=desc`,
      {
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as PublicEventsResponse;

    return payload.data
      .filter((event) => Boolean(event.thumbnailUrl))
      .map(mapEventToHomepageItem);
  } catch {
    return [];
  }
}

const chaplaincyRoadmap = [
  {
    title: "Phase 1",
    content: (
      <div>
        <div className="mb-6 relative w-full lg:h-105 flex items-center justify-center">
          <Image src="/roadmap/phase1.png" alt='Phase 1' fill className='size-full' />
        </div>
        <div className="mb-4">
          <h4 className="text-base md:text-lg font-semibold text-[#032a0d] mb-2">
            Associate Chaplain
          </h4>
          <p className="text-xs md:text-sm text-[#032a0d]/70 font-medium mb-4">
            Status: <span className="text-[#032a0d]">Entrant/Member</span>
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Entrant member</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Chaplaincy orientation</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Submission of requirements</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Chaplaincy 101 (pre-req)</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Oath taking</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Phase 2",
    content: (
      <div>
        <div className="mb-6 relative w-full lg:h-105 flex items-center justify-center">
          <Image src="/roadmap/phase2.png" alt='Phase 2' fill className='size-full' />
        </div>
        <div className="mb-4">
          <h4 className="text-base md:text-lg font-semibold text-[#032a0d] mb-2">
            Professional Chaplain
          </h4>
          <p className="text-xs md:text-sm text-[#032a0d]/70 font-medium mb-4">
            Status: <span className="text-[#032a0d]">Chaplaincy Graduate</span>
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>School of Chaplaincy graduate</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>3 months schooling</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>8 subjects (blended)</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>OJT (pre-req)</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Phase 3",
    content: (
      <div>
        <div className="mb-6 relative w-full lg:h-105 flex items-center justify-center">
          <Image src="/roadmap/phase3.png" alt='Phase 3' fill className='size-full' />
        </div>
        <div className="mb-4">
          <h4 className="text-base md:text-lg font-semibold text-[#032a0d] mb-2">
            Ordained and Commissioned Practitioner
          </h4>
          <p className="text-xs md:text-sm text-[#032a0d]/70 font-medium mb-4">
            Status:{" "}
            <span className="text-[#032a0d]">
              Ordained & Commissioned Chaplain
            </span>
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Graduate of any bachelor degree</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Pre-test and post-test</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>OJT supervised</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Covenant bow</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Phase 4",
    content: (
      <div>
        <div className="mb-6 relative w-full lg:h-105 flex items-center justify-center">
          <Image src="/roadmap/phase4.png" alt='Phase 4' fill className='size-full' />
        </div>
        <div className="mb-4">
          <h4 className="text-base md:text-lg font-semibold text-[#032a0d] mb-2">
            Certified Specialist Training Officer/Instructor
          </h4>
          <p className="text-xs md:text-sm text-[#032a0d]/70 font-medium mb-4">
            Status: <span className="text-[#032a0d]">Certified Minister</span>
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>At least 1 chaplaincy ministry</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Local church partnership</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Public/private institution partnership</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Certified training officer/instructor</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>CRASM optional/pinning</span>
          </div>
        </div>
      </div>
    ),
  },
];

export default async function Page() {
  const items = await getHomepageEvents();
  const carouselColumns = buildEventColumns(items);

  return (
    <main className="min-h-screen">
      <ImagesSlider
        className="relative min-h-screen text-white"
        images={images}
      >
        {/* header fade */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-linear-to-b from-[#032a0d] to-transparent" />

        <div className="relative z-50 mx-auto container pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6">
          {/* viewport 1: title */}
          <div className="flex min-h-[calc(100vh-12rem)] sm:min-h-[calc(100vh-15rem)] flex-col items-center justify-center text-center">
            <div className="font-normal text-sm sm:text-base md:text-lg uppercase tracking-widest px-4">
              Join a community devoted to spiritual growth, leadership
              development, and kingdom service
            </div>
            <h1 className="mt-12 font-serif text-2xl sm:text-3xl capitalize md:text-4xl lg:text-5xl xl:text-6xl px-4">

              The Best Way to Find Yourself Is to Lose Yourself in the Service of Others
            </h1>
            <Button asChild
              size="lg"
              className="mt-4 sm:mt-5 bg-[#032a0d] text-white rounded-full items-center flex hover:bg-[#032a0d]/95 text-sm sm:text-base"
            >
              <Link href="/become-a-member" target="_blank">
                Become a member <ArrowRightIcon className="size-4 sm:size-5" />
              </Link>
            </Button>
          </div>

          {/* viewport 2: content revealed on scroll */}
          <div className="pb-20 sm:pb-32 md:pb-40 px-4 sm:px-6">
            <div className="grid gap-6 sm:gap-8 md:gap-10 md:grid-cols-2 md:items-start">
              <blockquote className="max-w-xl border-l-2 pl-4 sm:pl-6 italic leading-relaxed text-sm sm:text-base">
                &quot;Take heed therefore unto yourselves, and to all the flock,
                over the which of the Holy Ghost hath made you overseers, to
                feed the church of God, which he hath purchased with his own
                blood.&quot; - <b>Acts 20:28</b>
              </blockquote>

              <div className="justify-self-start md:justify-self-end">
                <nav className="space-y-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em]">
                  {[
                    {
                      label: "Our Vision and Mission",
                      href: "/about-pearl-of-the-orient",
                    },
                    {
                      label: "School of Chaplaincy",
                      href: "#",
                    },
                    {
                      label: "Organizational Structure",
                      href: "/organizational-structure",
                    },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block w-fit border-b border-white/60 pb-0.5 text-white/90 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </ImagesSlider>

      {/* CTA */}
      <section className="py-8 sm:py-10 lg:py-12 max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-center color-primary">
          Force for Good
        </h2>
        <p className="mt-4 sm:mt-6 text-center text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed font-serif color-primary px-4">
          Take heed therefore unto yourselves, and to all the flock, over the
          which of the Holy Ghost hath made you overseers, to feed the church of
          God, which he hath purchased with his own blood.
        </p>
        <div className="flex items-center justify-between mt-10">
          <Link href="#" className="flex items-center group gap-3">
            <div className="border-2 border-[#032a0d] rounded-full text-[#032a0d] group-hover:text-white group-hover:bg-[#032a0d] transition-colors flex items-center justify-center size-10">
              <ChevronRightIcon strokeWidth={3} />
            </div>
            <p className="uppercase font-medium group-hover:underline text-[#032a0d]">
              pearl of the orient theological seminary & colleges inc
            </p>
          </Link>
          <Link href="#" className="flex items-center group gap-3">
            <div className="border-2 border-[#032a0d] rounded-full text-[#032a0d] group-hover:text-white group-hover:bg-[#032a0d] transition-colors flex items-center justify-center size-10">
              <ChevronRightIcon strokeWidth={3} />
            </div>
            <p className="uppercase font-medium group-hover:underline text-[#032a0d]">
              About Pearl of the orient
            </p>
          </Link>
        </div>
      </section>

      {/* Learn & Grow */}
      <section
        className="relative min-h-[50vh] sm:min-h-[60vh] bg-cover bg-bottom text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(/main/landing.jpg)`,
        }}
      >
        <div className="relative z-10 mx-auto max-w-6xl py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Category Heading */}
            <div className="text-xs sm:text-sm uppercase tracking-[0.2em] text-white/90">
              Chaplaincy and Values Education
            </div>

            {/* Main Title */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Learn and Grow
            </h2>

            {/* Descriptive Paragraph */}
            <p className="max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-white/95">
              Whatever stage you are in life, Pearl of the Orient International
              Auxiliary Chaplain Values Educators Inc. believes learning should
              encompass your overall development, giving you the tools and
              skills necessary to build a meaningful career, to realize your
              full potential as an individual, and to become a responsible and
              engaged servant leader in your community and the world.
            </p>

            {/* Call-to-Action Link */}
            <HeroVideoDialog
              className="block dark:hidden"
              animationStyle="from-center"
              videoSrc="https://res.cloudinary.com/dovvdfxru/video/upload/v1769411349/V3_The_Pearl_Chaplaincy_Promotional_Video_mwinwn.mp4"
              thumbnailAlt="Hero Video"
            />
          </div>
        </div>
      </section>

      {/* Course Outline */}
      <section
        className="relative min-h-[50vh] sm:min-h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(/main/paper-bg.jpg)`,
        }}
      >
        <div className="max-w-6xl mx-auto py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#032a0d]/70 mb-2">
              Curriculum
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-[#032a0d]">
              Course Outline
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              "Personality development of a chaplain",
              "Pastoral Psychology & biblical counseling",
              "Theology and practice of ordained chaplain",
              "Chaplaincy ministry",
              "Stress management & critical incident",
              "Philippine constitution & family code",
              "Governance & development",
              "Ethics & Accountability of a chaplain",
              "Christian leadership & management",
            ].map((course, index) => (
              <div
                key={index}
                className="group relative p-6 border-2 border-[#032a0d]/20 rounded-lg hover:border-[#032a0d] transition-all duration-300 hover:shadow-lg bg-white"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                    <div className="size-8 rounded-full bg-[#032a0d]/10 group-hover:bg-[#032a0d] transition-colors flex items-center justify-center">
                      <span className="text-sm font-semibold text-[#032a0d] group-hover:text-white transition-colors">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <p className="text-[#032a0d] font-medium leading-relaxed group-hover:text-[#032a0d]/90 transition-colors">
                    {course}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Around The World */}
      <section className="py-12 sm:py-16 md:py-20 min-h-[60vh] sm:min-h-[70vh] md:h-screen overflow-hidden bg-[#032a0d] w-full">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6">
          <div className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-2 sm:mb-4 text-white">
            Around the World
          </div>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-neutral-100 max-w-4xl mx-auto px-4">
            To organize a chaplain team both here and abroad who are Lorem ipsum
            dolor sit, amet consectetur adipisicing elit. Magni non blanditiis
            cumque optio repellat rem, a similique neque excepturi consequuntur.
          </p>
        </div>
        <div className="container mt-4 sm:mt-5 mx-auto px-4">
          <WorldMap
            dots={[
              {
                start: {
                  lat: 64.2008,
                  lng: -149.4937,
                }, // Alaska (Fairbanks)
                end: {
                  lat: 34.0522,
                  lng: -118.2437,
                }, // Los Angeles
              },
              {
                start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
                end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
              },
              {
                start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
              },
              {
                start: { lat: 51.5074, lng: -0.1278 }, // London
                end: { lat: 28.6139, lng: 77.209 }, // New Delhi
              },
              {
                start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
              },
              {
                start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
              },
            ]}
          />
        </div>
      </section>

      {/* News & Events */}
      <section
        className="relative my-4 sm:my-5 py-4 sm:py-5 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.5)), url(/main/news.jpg)`,
        }}
      >
        <div className="relative h-full bg-white py-4 sm:py-5 px-2 sm:px-4">
          {carouselColumns.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="relative w-full"
            >
              <div className="absolute left-0 top-0 z-10 h-full w-4 sm:w-5 bg-white flex items-center justify-center">
                <CarouselPrevious className="static bg-white hover:bg-white shadow-none rounded-none ml-2 sm:ml-4 md:ml-10 size-8 sm:size-10 md:size-12 border-none" />
              </div>

              <div className="absolute right-0 top-0 z-10 h-full w-4 sm:w-5 bg-white flex items-center justify-center">
                <CarouselNext className="static bg-white hover:bg-white shadow-none rounded-none mr-2 sm:mr-4 md:mr-10 size-8 sm:size-10 md:size-12 border-none" />
              </div>

              <CarouselContent className="-ml-2 md:-ml-4">
                {carouselColumns.map((column) => (
                  <CarouselItem
                    key={column.id}
                    className="pl-2 md:pl-4 basis-full md:basis-1/3 lg:basis-1/4"
                  >
                    {column.layout === "single" ? (
                      <SingleCard item={column.items[0]} />
                    ) : (
                      <div className="flex flex-col h-full">
                        {column.items.map((item) => (
                          <StackedCard key={item.id} item={item} />
                        ))}
                      </div>
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <div className="flex min-h-80 items-center justify-center border border-dashed border-[#032a0d]/20 bg-[#032a0d]/3 px-6 text-center">
              <div>
                <p className="font-serif text-2xl text-[#032a0d]">No events yet</p>
                <p className="mt-2 text-sm text-[#032a0d]/70">
                  Public events from the database will appear here once they are published.
                </p>
              </div>
            </div>
          )}
        </div>
        <Button
          size="lg"
          className="mt-4 sm:mt-5 mx-auto flex items-center justify-center bg-[#032a0d] hover:bg-[#032a0d]/90 text-sm sm:text-base"
        >
          View More
        </Button>
      </section>

      {/* Chaplaincy Roadmap */}
      <section
        className="relative min-h-[50vh] sm:min-h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(/main/paper-bg.jpg)`,
        }}
      >
        <div className="max-w-6xl relative overflow-clip mx-auto py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#032a0d]/70 mb-2">
              Chaplaincy Roadmap
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-[#032a0d] px-4">
              Your Journey to Chaplaincy Excellence
            </h2>
            <p className="mt-3 sm:mt-4 max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-[#032a0d]/80 px-4">
              Follow a structured path from entry-level membership to certified
              specialist, developing your skills and commitment to chaplaincy
              ministry at each phase.
            </p>
          </div>
          <Timeline data={chaplaincyRoadmap} />
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <div className="text-sm uppercase tracking-[0.2em] text-[#032a0d]/70 mb-2">
              Frequently Asked Questions
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#032a0d]">
              Common Questions About Chaplaincy
            </h2>
            <p className="mt-4 text-base md:text-lg text-[#032a0d]/70 max-w-2xl mx-auto">
              Find answers to common questions about membership, schooling, and
              chaplaincy ministry.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem
              value="item-1"
              className="border-2 border-[#032a0d]/10 rounded-lg px-4 sm:px-6 bg-white hover:border-[#032a0d]/30 transition-colors"
            >
              <AccordionTrigger className="text-left text-[#032a0d] font-semibold py-4 sm:py-6 hover:no-underline">
                How do I become a member of Pearl of the Orient International
                Auxiliary Chaplain Values Educators Inc.?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 pb-4 sm:pb-6">
                To become a member, you must first complete the entrant member
                process, which includes attending a chaplaincy orientation,
                submitting all required documents, completing Chaplaincy 101 as
                a prerequisite, and participating in the oath-taking ceremony.
                This initial phase establishes you as an Associate Chaplain with
                Entrant/Member status.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border-2 border-[#032a0d]/10 rounded-lg px-4 sm:px-6 bg-white hover:border-[#032a0d]/30 transition-colors"
            >
              <AccordionTrigger className="text-left text-[#032a0d] font-semibold py-4 sm:py-6 hover:no-underline">
                What is the School of Chaplaincy program and how long does it
                take?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 pb-4 sm:pb-6">
                The School of Chaplaincy is a comprehensive 3-month program
                designed to equip individuals for professional chaplaincy
                ministry. The program includes 8 subjects delivered through a
                blended learning approach (combining online and in-person
                sessions). Upon completion and successful OJT (On-the-Job
                Training), graduates achieve Professional Chaplain status as
                Chaplaincy Graduates.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border-2 border-[#032a0d]/10 rounded-lg px-4 sm:px-6 bg-white hover:border-[#032a0d]/30 transition-colors"
            >
              <AccordionTrigger className="text-left text-[#032a0d] font-semibold py-4 sm:py-6 hover:no-underline">
                What are the requirements to become an Ordained and Commissioned
                Chaplain?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 pb-4 sm:pb-6">
                To become an Ordained and Commissioned Chaplain (Phase 3), you
                must be a graduate of any bachelor&apos;s degree program,
                complete both pre-test and post-test assessments, successfully
                complete supervised OJT (On-the-Job Training), and participate
                in the covenant bow ceremony. This phase represents a
                significant commitment to chaplaincy ministry and values
                education.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border-2 border-[#032a0d]/10 rounded-lg px-4 sm:px-6 bg-white hover:border-[#032a0d]/30 transition-colors"
            >
              <AccordionTrigger className="text-left text-[#032a0d] font-semibold py-4 sm:py-6 hover:no-underline">
                How can I become a Certified Specialist Training
                Officer/Instructor?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 pb-4 sm:pb-6">
                To achieve Certified Specialist Training Officer/Instructor
                status (Phase 4), you must have at least one active chaplaincy
                ministry, establish partnerships with local churches, form
                partnerships with public or private institutions, obtain
                certification as a training officer/instructor, and optionally
                complete CRASM (Certified Religious and Spiritual Ministry)
                pinning. This represents the highest level of chaplaincy
                certification.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="border-2 border-[#032a0d]/10 rounded-lg px-4 sm:px-6 bg-white hover:border-[#032a0d]/30 transition-colors"
            >
              <AccordionTrigger className="text-left text-[#032a0d] font-semibold py-4 sm:py-6 hover:no-underline">
                What ministry opportunities are available for chaplains?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 pb-4 sm:pb-6">
                Chaplains can serve in various ministry settings including
                hospitals, schools, military, prisons, corporate environments,
                and community organizations. Our chaplains provide spiritual
                care, values education, counseling, and support services. We
                also facilitate partnerships with local churches and
                institutions to expand ministry reach and impact in communities
                both locally and internationally.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-10 sm:mt-12 text-center">
            <Link href="#">
              <Button
                size="lg"
                className="bg-[#032a0d] hover:bg-[#032a0d]/90 text-white rounded-full px-8 py-6 text-base sm:text-lg"
              >
                View All FAQs
                <ArrowRightIcon className="ml-2 size-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

interface SingleCardProps {
  item: HomepageEventItem;
}

interface StackedCardProps {
  item: HomepageEventItem;
}

const SingleCard = ({ item }: SingleCardProps) => (
  <div className="group relative h-full bg-white border overflow-hidden">
    <div className="relative h-82 w-full overflow-hidden bg-[#032a0d]/5">
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-contain group-hover:scale-105 transition-transform duration-300"
      />

      <div
        className="
        absolute inset-x-0 bottom-0
        translate-y-full opacity-0
        group-hover:translate-y-0 group-hover:opacity-100
        transition-all duration-500
        bg-linear-to-t from-[#032a0d] to-transparent
        px-4 sm:px-6 py-6 sm:py-8 md:py-10 text-center
      "
      >
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          {item.date}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-zinc-100 line-clamp-2">
          {item.title}
        </p>
      </div>
    </div>
  </div>
);

const StackedCard = ({ item }: StackedCardProps) => (
  <div className="group relative bg-white border overflow-hidden">
    <div className="relative h-100 w-full overflow-hidden bg-[#032a0d]/5">
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />

      <div
        className="
        absolute inset-x-0 bottom-0
        translate-y-full opacity-0
        group-hover:translate-y-0 group-hover:opacity-100
        transition-all duration-500
        bg-linear-to-t from-[#032a0d] to-transparent
        px-4 sm:px-6 py-4 sm:py-6 md:py-8 text-center
      "
      >
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
          {item.date}
        </h3>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-zinc-100 line-clamp-2">
          {item.title}
        </p>
      </div>
    </div>
  </div>
);

function mapEventToHomepageItem(event: EventResource): HomepageEventItem {
  return {
    id: event.id,
    title: event.name,
    date: formatEventDate(event.startsAt),
    image: event.thumbnailUrl,
  };
}

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila",
  }).format(new Date(value));
}

function buildEventColumns(items: HomepageEventItem[]) {
  const columns: Array<{
    id: string;
    layout: "single" | "stacked";
    items: HomepageEventItem[];
  }> = [];

  let index = 0;
  let useSingleLayout = true;

  while (index < items.length) {
    const remaining = items.length - index;

    if (useSingleLayout || remaining === 1) {
      columns.push({
        id: `single-${items[index].id}`,
        layout: "single",
        items: [items[index]],
      });
      index += 1;
    } else {
      columns.push({
        id: `stacked-${items[index].id}`,
        layout: "stacked",
        items: items.slice(index, index + Math.min(2, remaining)),
      });
      index += Math.min(2, remaining);
    }

    useSingleLayout = !useSingleLayout;
  }

  return columns;
}
