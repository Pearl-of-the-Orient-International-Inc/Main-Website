import { Button } from "@/components/ui/button";
import {
  Ambulance,
  ArrowRightIcon,
  BriefcaseBusiness,
  ChevronRightIcon,
  Cross,
  Ellipsis,
  Fence,
  GraduationCap,
  HandHeart,
  Landmark,
  MapPinned,
  ShieldCheck,
  ShieldIcon,
  type LucideIcon,
} from "lucide-react";
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
import { RecognitionGallery } from "@/components/website/RecognitionGallery";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DirectoryRegionMapClient } from "./directory/_components/directory-region-map-client";
import type {
  PublicDirectoryLocationsData,
  PublicDirectoryLocationsResponse,
} from "@/lib/api-types";
import type {
  EventResource,
  PublicEventsResponse,
} from "@/features/events/event.types";

const images = [
  "/hero-carousels/1.jpg",
  "/hero-carousels/2.jpg",
  "/hero-carousels/3.jpg",
  "/hero-carousels/4.jpg",
  "/hero-carousels/5.jpg",
  "/hero-carousels/6.jpg",
  "/hero-carousels/7.jpg",
];

const recognitionImages = [
  {
    src: "/recognition/1.png",
    alt: "Pearl of the Orient certificate of recognition",
  },
  {
    src: "/recognition/2.jpg",
    alt: "Pearl of the Orient recognition document",
  },
  {
    src: "/recognition/3.png",
    alt: "Pearl of the Orient certificate and recognition",
  },
  {
    src: "/recognition/4.jpg",
    alt: "Pearl of the Orient certificate of accreditation",
  },
];

const branchesOfService: Array<{
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
}> = [
  {
    title: "Humanitarian",
    description: "Serving communities in need with love and compassion.",
    image:
      "https://images.pexels.com/photos/6299634/pexels-photo-6299634.jpeg?auto=compress&cs=tinysrgb&w=900",
    icon: HandHeart,
  },
  {
    title: "Military/PNP",
    description: "Standing with those who protect and serve our nation.",
    image:
      "https://images.pexels.com/photos/13366452/pexels-photo-13366452.jpeg?auto=compress&cs=tinysrgb&w=900",
    icon: ShieldCheck,
  },
  {
    title: "Corporate",
    description: "Supporting professionals and workplaces with values and care.",
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900",
    icon: BriefcaseBusiness,
  },
  {
    title: "Prison",
    description: "Bringing hope, restoration, and second chances behind the walls.",
    image:
      "https://images.pexels.com/photos/20620622/pexels-photo-20620622.jpeg?auto=compress&cs=tinysrgb&w=900",
    icon: Fence,
  },
  {
    title: "Government",
    description: "Upholding integrity and service in the public sector.",
    image:
      "https://images.pexels.com/photos/16151491/pexels-photo-16151491.jpeg?auto=compress&cs=tinysrgb&w=900",
    icon: Landmark,
  },
  {
    title: "Others",
    description: "Reaching unique groups and special communities with Christ's love.",
    image:
      "https://images.pexels.com/photos/6646770/pexels-photo-6646770.jpeg?auto=compress&cs=tinysrgb&w=900",
    icon: Ellipsis,
  },
  {
    title: "Hospital and Care",
    description: "Providing spiritual comfort and strength in times of illness and recovery.",
    image:
      "https://images.pexels.com/photos/6129685/pexels-photo-6129685.jpeg?auto=compress&cs=tinysrgb&w=900",
    icon: Cross,
  },
  {
    title: "School",
    description: "Nurturing young minds and fostering character through faith.",
    image:
      "https://images.pexels.com/photos/5212329/pexels-photo-5212329.jpeg?auto=compress&cs=tinysrgb&w=900",
    icon: GraduationCap,
  },
  {
    title: "Disaster & Rescue Operations",
    description: "Standing in the frontlines of crisis to bring hope and healing.",
    image:
      "https://images.pexels.com/photos/16105713/pexels-photo-16105713.jpeg?auto=compress&cs=tinysrgb&w=900",
    icon: Ambulance,
  },
  {
    title: "Security",
    description: "Upholding safety and peace through integrity, vigilance, and compassion.",
    image:
      "https://images.pexels.com/photos/34680721/pexels-photo-34680721.jpeg?auto=compress&cs=tinysrgb&w=900",
    icon: ShieldIcon,
  },
  {
    title: "DSWD",
    description: "Partnering in service to empower and uplift lives and families.",
    image:
      "https://images.pexels.com/photos/8205208/pexels-photo-8205208.jpeg?auto=compress&cs=tinysrgb&w=900",
    icon: HandHeart,
  },
];

type HomepageEventItem = {
  id: string;
  title: string;
  date: string;
  image: string;
};

const eventFallbackImage = "/main/news.jpg";

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
      .filter((event) => event.status !== "CANCELLED")
      .map(mapEventToHomepageItem);
  } catch {
    return [];
  }
}

async function getDirectoryLocations(): Promise<PublicDirectoryLocationsData | null> {
  if (!apiBaseUrl) {
    return null;
  }

  try {
    const response = await fetch(
      `${apiBaseUrl}/members/public/directory-locations`,
      {
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as PublicDirectoryLocationsResponse;
    return payload.data;
  } catch {
    return null;
  }
}

const chaplaincyRoadmap = [
  {
    title: "Phase 1",
    content: (
      <div>
        <div className="relative mb-6 flex aspect-4/3 w-full items-center justify-center lg:aspect-auto lg:h-105">
          <Image src="/roadmap/phase1.png" alt="Phase 1" fill className="object-contain" />
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
        <div className="relative mb-6 flex aspect-[4/3] w-full items-center justify-center lg:aspect-auto lg:h-105">
          <Image src="/roadmap/phase2.png" alt="Phase 2" fill className="object-contain" />
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
        <div className="relative mb-6 flex aspect-[4/3] w-full items-center justify-center lg:aspect-auto lg:h-105">
          <Image src="/roadmap/phase3.png" alt="Phase 3" fill className="object-contain" />
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
        <div className="relative mb-6 flex aspect-[4/3] w-full items-center justify-center lg:aspect-auto lg:h-105">
          <Image src="/roadmap/phase4.png" alt="Phase 4" fill className="object-contain" />
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

const membershipBenefits = [
  {
    number: "01",
    title: "Chaplaincy Training and Education",
    items: [
      "Chaplaincy 101 seminars",
      "School of Chaplaincy Education course to professionalize chaplains",
      "Leadership development programs",
      "Counseling and spiritual care training",
      "Trainers training courses",
      "Community and institutional chaplaincy orientation",
    ],
  },
  {
    number: "02",
    title: "Spiritual Growth and Development",
    items: [
      "Strengthen faith and calling",
      "Develop compassion and servant leadership",
      "Grow in prayer, counseling, and ministry skills",
      "Build strong moral and spiritual values",
    ],
  },
  {
    number: "03",
    title: "Leadership Opportunities",
    items: [
      "Community chaplains",
      "Government chaplains, national or local",
      "School chaplains",
      "Military chaplains",
      "Outreach chaplains",
      "Prayer leaders",
      "National, regional, provincial, and local officers",
    ],
  },
  {
    number: "04",
    title: "Community Service and Outreach",
    items: [
      "Hospital chaplains",
      "Prison chaplains",
      "Disaster response and relief operations",
      "Drug awareness education advocacy and training",
      "Feeding and humanitarian missions",
    ],
  },
  {
    number: "05",
    title: "Networking and Fellowship",
    items: [
      "Fellowship with fellow chaplains and ministers",
      "Conferences and conventions",
      "Collaboration with churches and different organizations",
      "Professional and spiritual support system",
    ],
  },
  {
    number: "06",
    title: "Recognition and Certification",
    items: [
      "Certificates of training",
      "Chaplaincy recognition",
      "Ministry and chaplain appointment",
      "License for CRASM",
      "Chaplaincy ordination and commissioning",
      "Leadership endorsements and appointments",
    ],
  },
  {
    number: "07",
    title: "Opportunities for Ministry Expansion",
    items: [
      "Church planting ministries",
      "School and campus chaplaincy",
      "Community outreach programs",
      "Counseling and care ministries",
    ],
  },
  {
    number: "08",
    title: "Interfaith and Community Engagement",
    items: [
      "Unity and respect among different faith communities",
      "Peace-building, cooperation, and collaboration",
      "Service-centered ministry for all people",
    ],
  },
  {
    number: "09",
    title: "Personal and Professional Development",
    items: [
      "Communication skills",
      "Public speaking",
      "Counseling ability",
      "Crisis response and leadership skills",
    ],
  },
  {
    number: "10",
    title: "Mission and Purpose",
    items: [
      "Bring hope, compassion, spiritual care, and transformation to communities through chaplaincy service.",
    ],
  },
];

export default async function Page() {
  const items = await getHomepageEvents();
  const directoryData = await getDirectoryLocations();
  const carouselColumns = buildEventColumns(items);
  const headquarters = directoryData?.headquarters ?? {
    name: "Pearl of the Orient Headquarter",
    address:
      "Blk 151 Lot 14-20 Phase 1, Mabuhay City, Dasmarinas City, Cavite, Philippines",
    latitude: 14.3298,
    longitude: 120.9367,
  };

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
        <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
          <Link href="#" className="group flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-[#032a0d] text-[#032a0d] transition-colors group-hover:bg-[#032a0d] group-hover:text-white sm:size-10">
              <ChevronRightIcon strokeWidth={3} />
            </div>
            <p className="text-sm font-medium uppercase text-[#032a0d] group-hover:underline sm:text-base">
              pearl of the orient theological seminary & colleges inc
            </p>
          </Link>
          <Link href="#" className="group flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-[#032a0d] text-[#032a0d] transition-colors group-hover:bg-[#032a0d] group-hover:text-white sm:size-10">
              <ChevronRightIcon strokeWidth={3} />
            </div>
            <p className="text-sm font-medium uppercase text-[#032a0d] group-hover:underline sm:text-base">
              About Pearl of the orient
            </p>
          </Link>
        </div>
      </section>

      {/* Learn & Grow */}
      <section
        className="relative min-h-[50vh] sm:min-h-[60vh] bg-cover bg-bottom text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(/chaplaincy101.png)`,
        }}
      >
        <div className="relative z-10 mx-auto max-w-6xl py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Category Heading */}
            <div className="text-xs sm:text-sm uppercase text-white/90">
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

      {/* Branches of Service */}
      <section
        className="relative min-h-[50vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(/main/paper-bg.jpg)`,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
          <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10 md:mb-12">
            <div className="mb-2 text-xs font-semibold uppercase text-[#032a0d]/70 sm:text-sm">
              Branches of Service
            </div>
            <h2 className="font-serif text-3xl font-medium leading-tight text-[#032a0d] sm:text-4xl md:text-5xl lg:text-6xl">
              Serving with Compassion. Across{" "}
              <span className="text-[#b98f38]">Every</span> Sector.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#032a0d]/80 sm:text-base md:text-lg">
              Our chaplains are called to bring hope, support, and spiritual
              care to every community and workplace.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {branchesOfService.map((branch) => {
              const Icon = branch.icon;

              return (
                <article
                  key={branch.title}
                  className="group relative overflow-hidden rounded-lg border border-[#032a0d]/10 bg-white shadow-[0_14px_35px_rgba(3,42,13,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#b98f38]/50 hover:shadow-[0_22px_50px_rgba(3,42,13,0.14)]"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-[#032a0d]/10">
                    <Image
                      src={branch.image}
                      alt={`${branch.title} service`}
                      fill
                      sizes="(min-width: 1280px) 190px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#032a0d]/20" />
                  </div>

                  <div className="relative px-4 pb-5 pt-9 text-center">
                    <div className="absolute left-1/2 top-0 flex size-15 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#b98f38] bg-[#032a0d] text-[#d4af5c] shadow-lg">
                      <Icon className="size-7" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-serif text-xl font-semibold leading-tight text-[#032a0d]">
                      {branch.title}
                    </h3>
                    <p className="mt-3 min-h-18 text-sm leading-relaxed text-[#032a0d]/80">
                      {branch.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* National Directory Map */}
      <section className="overflow-hidden bg-[#032a0d] py-12 text-white sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#d4a948] sm:text-sm">
              National Chaplaincy Directory
            </div>
            <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Around the Philippines
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
              Explore our headquarters and regional member presence through the
              same interactive map used in the public directory.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="border border-white/10 bg-white/8 px-5 py-5 backdrop-blur-sm">
              <p className="text-xs uppercase text-white/60">
                Active Approved Members
              </p>
              <p className="mt-3 font-serif text-3xl text-white">
                {directoryData?.summary.totalMembers.toLocaleString() ?? "0"}
              </p>
            </div>
            <div className="border border-white/10 bg-white/8 px-5 py-5 backdrop-blur-sm">
              <p className="text-xs uppercase text-white/60">
                Regions Represented
              </p>
              <p className="mt-3 font-serif text-3xl text-white">
                {directoryData?.summary.regionsRepresented.toLocaleString() ??
                  "0"}
              </p>
            </div>
            <div className="border border-white/10 bg-white/8 px-5 py-5 backdrop-blur-sm">
              <p className="text-xs uppercase text-white/60">
                Provinces Represented
              </p>
              <p className="mt-3 font-serif text-3xl text-white">
                {directoryData?.summary.provincesRepresented.toLocaleString() ??
                  "0"}
              </p>
            </div>
            <div className="border border-white/10 bg-white/8 px-5 py-5 backdrop-blur-sm">
              <p className="text-xs uppercase text-white/60">
                Mapped Locations
              </p>
              <p className="mt-3 font-serif text-3xl text-white">
                {directoryData?.summary.membersWithRegion.toLocaleString() ??
                  "0"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
            <section className="overflow-hidden border border-white/12 bg-white text-[#032a0d] shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
              <div className="border-b border-[#032a0d]/8 p-5 sm:p-6">
                <p className="text-xs uppercase text-[#032a0d]/55">
                  Interactive National Map
                </p>
                <h3 className="mt-2 font-serif text-2xl text-[#032a0d] sm:text-3xl">
                  Zoom into our regional member presence
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#032a0d]/72">
                  The gold marker identifies the headquarter, while the green
                  circles show active approved members by region.
                </p>
              </div>
              <div className="directory-map h-[24rem] w-full bg-[#e9efe7] sm:h-112 lg:h-136">
                {directoryData ? (
                  <DirectoryRegionMapClient data={directoryData} />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center">
                    <div>
                      <p className="font-serif text-2xl text-[#032a0d]">
                        Map data is temporarily unavailable
                      </p>
                      <p className="mt-2 text-sm text-[#032a0d]/70">
                        Headquarters information remains available beside the
                        map.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <aside className="space-y-6">
              <div className="border border-white/10 bg-white p-6 text-[#032a0d] shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-[#032a0d]/6 p-2.5 text-[#032a0d]">
                    <MapPinned className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase text-[#032a0d]/55">
                      Headquarter
                    </p>
                    <h3 className="mt-2 font-serif text-xl text-[#032a0d]">
                      {headquarters.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#032a0d]/75">
                      {headquarters.address}
                    </p>
                    <Link
                      href="/directory"
                      className="mt-4 inline-flex text-sm font-medium text-[#032a0d] underline decoration-[#d4a948] underline-offset-4"
                    >
                      View full directory
                    </Link>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 bg-[#051f0b] p-6 shadow-sm">
                <p className="text-xs uppercase text-white/60">
                  Directory Note
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/78">
                  Regional markers are based on active approved members with
                  recorded Philippine address data in the system.
                </p>
              </div>
            </aside>
          </div>
        </div>
        <div className="hidden">
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
            <div className="text-xs sm:text-sm uppercase text-[#032a0d]/70 mb-2">
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

      {/* Certificate and Recognition */}
      <section
        className="relative isolate overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.72), rgba(255,255,255,0.86)), url(/main/paper-bg.jpg)`,
        }}
      >
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
          <div className="mx-auto mb-8 max-w-4xl text-center sm:mb-10 md:mb-12">
            <div className="mb-3 inline-flex items-center border border-[#032a0d]/15 bg-white/85 px-4 py-1 text-xs font-semibold uppercase text-[#032a0d]/70 shadow-sm backdrop-blur-sm sm:text-sm">
              Certificate and Recognition
            </div>
            <h2 className="px-4 font-serif text-3xl font-medium text-[#032a0d] sm:text-4xl md:text-5xl lg:text-6xl">
              Recognitions and Accreditations
            </h2>
            <p className="mx-auto mt-3 max-w-3xl px-4 text-sm text-[#032a0d]/80 sm:mt-4 sm:text-base md:text-lg">
              Certificates, recognitions, and supporting documents that reflect
              Pearl of the Orient&apos;s commitment to chaplaincy values
              education, service, and organizational excellence.
            </p>
          </div>

          <RecognitionGallery images={recognitionImages} />
        </div>
      </section>

      {/* Benefits of Being a Member of Pearl of the Orient International Auxiliary Chaplain Values Educators Inc  Inter-Faith Organization */}
      <section
        className="relative isolate min-h-[50vh] overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url(/main/paper-bg.jpg)`,
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/65 via-white/40 to-[#f7f1de]/80" />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
          <div className="mx-auto mb-8 max-w-4xl text-center sm:mb-10 md:mb-12">
            <div className="mb-3 inline-flex items-center rounded-full border border-[#032a0d]/15 bg-white/80 px-4 py-1 text-xs font-semibold uppercase text-[#032a0d]/70 shadow-sm backdrop-blur-sm sm:text-sm">
              Membership Benefits
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-[#032a0d] px-4">
              Benefits of Being a Member
            </h2>
            <p className="mt-3 sm:mt-4 max-w-4xl mx-auto text-sm sm:text-base md:text-lg text-[#032a0d]/80 px-4">
              Membership in Pearl of the Orient International Auxiliary
              Chaplain Values Educators Inc. Inter-Faith Organization provides
              opportunities for spiritual growth, leadership development,
              community service, and chaplaincy training and education.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 sm:mb-10 lg:grid-cols-[1.05fr_0.95fr] sm:gap-8">
            <div className="relative overflow-hidden rounded-2xl border border-[#032a0d]/10 bg-white/95 p-6 shadow-[0_20px_60px_rgba(3,42,13,0.08)] backdrop-blur-sm sm:rounded-[2rem] sm:p-8">
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#032a0d] via-[#b98f38] to-[#032a0d]" />
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-[#032a0d] text-sm font-semibold text-white">
                  PM
                </div>
                <div className="text-xs font-semibold uppercase text-[#032a0d]/60 sm:text-sm">
                  Membership Motto
                </div>
              </div>
              <p className="max-w-2xl font-serif text-2xl leading-tight text-[#032a0d] sm:text-3xl md:text-4xl">
                Called to Serve, Equipped to Care, United in Compassion.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-[#032a0d] p-6 text-white shadow-[0_24px_60px_rgba(3,42,13,0.2)] sm:rounded-[2rem] sm:p-8">
              <div className="relative mb-4 text-xs font-semibold uppercase text-white/70 sm:text-sm">
                Shared Mission
              </div>
              <p className="relative font-serif text-xl leading-relaxed md:text-2xl">
                Bring hope, compassion, spiritual care, and transformation to
                communities through chaplaincy service.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            {membershipBenefits.map((benefit, index) => (
              <div
                key={benefit.number}
                className={`group relative overflow-hidden rounded-2xl border border-[#032a0d]/10 bg-white/95 p-5 shadow-[0_16px_45px_rgba(3,42,13,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#032a0d]/30 hover:shadow-[0_22px_55px_rgba(3,42,13,0.12)] sm:rounded-[1.75rem] sm:p-6 ${
                  index === membershipBenefits.length - 1 ? "md:col-span-2" : ""
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#032a0d] via-[#b98f38] to-transparent opacity-80" />
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#032a0d] font-semibold text-white shadow-sm">
                      {benefit.number}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-3 pr-6 font-serif text-xl text-[#032a0d] sm:text-2xl">
                      {benefit.title}
                    </h3>
                    <div className="space-y-2.5">
                      {benefit.items.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 text-sm text-[#032a0d]/80 sm:text-base"
                        >
                          <span className="mt-2 block size-2 shrink-0 rounded-full bg-[#b98f38]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <div className="text-sm uppercase text-[#032a0d]/70 mb-2">
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
    <div className="relative h-64 w-full overflow-hidden bg-[#032a0d]/5 sm:h-72 md:h-82">
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
    <div className="relative h-64 w-full overflow-hidden bg-[#032a0d]/5 sm:h-80 md:h-100">
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
    image: event.thumbnailUrl?.trim() || eventFallbackImage,
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
