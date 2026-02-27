"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

export default function MemberProfilePage() {
  const { memberId } = useParams<{ memberId: string }>();

  let imageUrl: string = "/temporary-members/Slide1.PNG";

  if (memberId) {
    const parts = memberId.split("-");
    const numericPart = parts[1];
    const memberNumber = parseInt(numericPart, 10);

    if (!isNaN(memberNumber)) {
      const slideIndex = memberNumber - 10;

      if (slideIndex >= 1 && slideIndex <= 25) {
        imageUrl = `/temporary-members/Slide${slideIndex}.PNG`;
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative w-full lg:max-w-6xl lg:h-[65vh] h-screen">
        <Image
          src={imageUrl}
          alt="Member Slide"
          fill
          className="object-contain size-full"
          priority
        />
      </div>
    </div>
  );
}
