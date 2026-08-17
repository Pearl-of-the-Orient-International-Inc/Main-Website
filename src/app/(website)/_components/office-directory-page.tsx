import Image from "next/image";
import Link from "next/link";

export interface OfficePerson {
  name: string;
  role: string;
  group?: string;
  image?: string;
  imageType?: "person" | "logo";
}

export interface OfficeDirectoryPageData {
  title: string;
  description: string;
  people: OfficePerson[];
}

const placeholderImage = "/profile-empty.png";

export const OfficeDirectoryPage = ({
  data,
}: {
  data: OfficeDirectoryPageData;
}) => {
  const groups = data.people.reduce<Array<{ title: string | null; people: OfficePerson[] }>>(
    (currentGroups, person) => {
      const groupTitle = person.group ?? null;
      const existingGroup = currentGroups.find((group) => group.title === groupTitle);

      if (existingGroup) {
        existingGroup.people.push(person);
        return currentGroups;
      }

      return [...currentGroups, { title: groupTitle, people: [person] }];
    },
    [],
  );

  return (
    <div>
      <section className="relative bg-[#032a0d] text-white">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-40" />
        </div>

        <div className="relative mx-auto mt-10 max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <p className="mb-2 text-xs text-white/70 sm:text-sm">
            <Link href="/">Home</Link>{" "}
            <span className="mx-1 text-white/50 sm:mx-2">/</span>{" "}
            <Link href="/organizational-structure">Organizational Structure</Link>{" "}
            <span className="mx-1 text-white/50 sm:mx-2">/</span>{" "}
            <span className="font-medium text-white">{data.title}</span>
          </p>
          <h1 className="font-serif text-3xl font-semibold tracking-wide sm:text-4xl md:text-5xl lg:text-6xl">
            {data.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            {data.description}
          </p>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100">
                <span className="size-2.5 rounded-full bg-emerald-600" />
              </span>
              <h2 className="text-2xl font-bold text-slate-950">
                {data.title}
              </h2>
            </div>
            <Link
              href="/organizational-structure"
              className="inline-flex w-fit items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-colors hover:bg-emerald-800"
            >
              View Organizational Structure
            </Link>
          </div>

          <div className="space-y-10">
            {groups.map((group) => (
              <section key={group.title ?? "directory"} className="space-y-4">


                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {group.people.map((person) => (
                    <OfficeDirectoryCard
                      key={`${person.name}-${person.role}`}
                      person={person}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

function OfficeDirectoryCard({ person }: { person: OfficePerson }) {
  const isLogoCard = person.imageType === "logo";

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors hover:border-emerald-300">
      <div className="border-b border-neutral-200 bg-neutral-50 p-5">
        {isLogoCard ? (
          <div className="flex aspect-4/3 items-center justify-center rounded-xl border border-dashed border-emerald-800/25 bg-white p-6">
            {person.image ? (
              <div className="relative h-full w-full">
                <Image
                  src={person.image}
                  alt={`${person.name} logo`}
                  fill
                  unoptimized
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex size-28 flex-col items-center justify-center rounded-full border border-emerald-800/20 bg-emerald-50 text-center text-2xl font-bold text-emerald-900">
                {getInitials(person.name)}
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-800/70">
                  Logo
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-white">
            <Image
              src={person.image ?? placeholderImage}
              alt={person.name}
              fill
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold leading-snug text-slate-950">
          {person.name}
        </h3>
        <p className="mt-2 text-base leading-relaxed text-slate-500">
          {person.role}
        </p>
      </div>
    </article>
  );
}

function getInitials(value: string) {
  const uppercaseWords = value.match(/\b[A-Z]{2,}\b/g);

  if (uppercaseWords?.length) {
    return uppercaseWords
      .slice(0, 2)
      .map((word) => word[0])
      .join("");
  }

  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}
