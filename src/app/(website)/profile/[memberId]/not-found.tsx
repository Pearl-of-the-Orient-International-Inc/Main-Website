import Image from "next/image";
import Link from "next/link";
import { House } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MemberProfileNotFound() {
  return (
    <main className="min-h-screen flex items-center flex-col justify-center bg-[radial-gradient(circle_at_center,rgba(22,163,74,0.08),transparent_18%),linear-gradient(135deg,#fafaf9_0%,#ffffff_36%,#f5f5f4_100%)] px-4 py-20">
      <div className="mx-auto flex max-w-5xl items-center justify-center">
        <section className="w-full text-center">
          <div className="mx-auto max-w-xl">
            <Image
              src="/profile-empty.png"
              alt="Profile not found"
              width={280}
              height={280}
              className="mx-auto h-auto w-full max-w-70"
              priority
            />
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
              Profile Not Found
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-neutral-600 sm:text-base">
              The member profile you&apos;re looking for does not exist, may
              have been removed, or the link may be incorrect.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Button
                asChild
                className="h-11 min-w-52.5 rounded-md bg-[#0b5d34] px-6 hover:bg-[#094f2d]"
              >
                <Link href="/">
                  <House className="size-4" />
                  Go to homepage
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
