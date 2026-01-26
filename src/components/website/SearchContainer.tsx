"use client";

import { X } from "lucide-react";
import Image from "next/image";

interface SearchContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchContainer = ({ isOpen, onClose }: SearchContainerProps) => {
  return (
    <>
      {/* Full Screen Overlay */}
      <div
        className={`fixed inset-0 z-70 bg-[#032a0d] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between p-6">
            {/* Empty space for layout balance */}
            <div className="w-10"></div>

            <div className="flex flex-col items-center">
              <Image
                src="/main/logo.png"
                alt="Site seal"
                width={100}
                height={100}
                priority
              />
              <div className="mt-3 text-2xl font-serif">
                PEARL OF THE ORIENT INTERNATIONAL AUXILARY
              </div>
              <div className="font-serif text-xl">
                CHAPLAIN VALUES EDUCATORS INC.
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex size-15 items-center justify-center rounded-md text-white transition-colors cursor-pointer"
              aria-label="Close search"
            >
              <X className="size-10" />
            </button>
          </div>

          {/* Search Form - Centered */}
          <div className="flex flex-1 items-center justify-center px-6">
            <div className="w-full max-w-4xl">
              <form onSubmit={(e) => e.preventDefault()}>
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Type in your search...."
                  className="w-full border-b-2 text-lg border-white bg-transparent px-1 py-3 text-white placeholder-white/60 outline-none transition-colors focus:border-white/80"
                  autoFocus
                />

                {/* Search Button */}
                <button
                  type="submit"
                  className="mt-6 w-full bg-[#ac863f] py-4 font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#ac863f]/90"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Bottom spacing */}
          <div className="h-32"></div>
        </div>
      </div>
    </>
  );
};
