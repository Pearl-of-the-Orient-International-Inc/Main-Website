"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { NavMenu } from "@/components/website/NavMenu";
import { SearchContainer } from "@/components/website/SearchContainer";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger the compact state after scrolling 20px
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when search is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-white transition-all duration-300 ${
        isScrolled
          ? "h-14 sm:h-16"
          : "h-32 sm:h-36 md:h-40"
      }`}
    >
      {/* ::before pseudo element - Extended gradient background */}
      <div
        className={`pointer-events-none absolute left-0 top-0 w-full transition-all duration-300 ${
          isScrolled
            ? "h-full bg-[#032a0d]"
            : "h-[calc(100%+150px)] bg-linear-to-b from-[rgb(3,42,13)] from-60% to-transparent"
        }`}
      />

      <div className="relative px-3 sm:px-6 md:px-10 flex h-full w-full items-start py-2 sm:py-3 md:py-5 justify-between transition-all duration-300">
        {/* Menu Button */}
        <NavMenu />

        {/* Center Logo/Text - Transitions between two states */}
        <div className="flex-1 flex justify-center">
          {/* Full logo layout (visible when not scrolled) */}
          <div
            className={`flex flex-col items-center text-center transition-all duration-300 max-w-full ${
              isScrolled
                ? "pointer-events-none opacity-0 absolute"
                : "pointer-events-auto opacity-100"
            }`}
          >
            <Image
              src="/main/logo.png"
              alt="Site seal"
              width={100}
              height={100}
              priority
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-[100px] xl:h-[100px]"
            />
            <div className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-2xl font-serif px-2">
              PEARL OF THE ORIENT INTERNATIONAL AUXILARY
            </div>
            <div className="font-serif text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-xl px-2">
              CHAPLAIN VALUES EDUCATORS INC.
            </div>
          </div>

          {/* Compact text layout (visible when scrolled) */}
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-300 max-w-[90%] ${
              isScrolled
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <div className="font-serif text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base tracking-wide px-2 wrap-break-word">
              PEARL OF THE ORIENT INTERNATIONAL AUXILARY CHAPLAIN VALUES
              EDUCATORS INC.
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Search
          className="size-5 sm:size-6 md:size-7 cursor-pointer shrink-0"
          onClick={() => setIsSearchOpen(true)}
        />
        <SearchContainer
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </div>
    </header>
  );
};
