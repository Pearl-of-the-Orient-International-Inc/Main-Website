"use client";

import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, ChevronDownIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { BadgeCheckIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';

export const NavMenu = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (!isLoaded) {
    return <Loader2Icon className="animate-spin size-8" />;
  }

  return (
    <>
      <style jsx>{`
        @keyframes hamburgerToX-top {
          0% {
            width: 35px;
            transform: translateY(0) rotate(0);
          }
          50% {
            width: 35px;
            transform: translateY(7px) rotate(0);
          }
          100% {
            width: 35px;
            transform: translateY(7px) rotate(45deg);
          }
        }

        @keyframes hamburgerToX-middle {
          0% {
            width: 26px;
            opacity: 1;
          }
          50% {
            width: 35px;
            opacity: 1;
          }
          100% {
            width: 35px;
            opacity: 0;
          }
        }

        @keyframes hamburgerToX-bottom {
          0% {
            width: 19px;
            transform: translateY(0) rotate(0);
          }
          50% {
            width: 35px;
            transform: translateY(-7px) rotate(0);
          }
          100% {
            width: 35px;
            transform: translateY(-7px) rotate(-45deg);
          }
        }

        @keyframes xToHamburger-top {
          0% {
            width: 35px;
            transform: translateY(7px) rotate(45deg);
          }
          50% {
            width: 35px;
            transform: translateY(0) rotate(0);
          }
          100% {
            width: 35px;
            transform: translateY(0) rotate(0);
          }
        }

        @keyframes xToHamburger-middle {
          0% {
            width: 35px;
            opacity: 0;
          }
          50% {
            width: 35px;
            opacity: 1;
          }
          100% {
            width: 26px;
            opacity: 1;
          }
        }

        @keyframes xToHamburger-bottom {
          0% {
            width: 35px;
            transform: translateY(-7px) rotate(-45deg);
          }
          50% {
            width: 35px;
            transform: translateY(0) rotate(0);
          }
          100% {
            width: 14px;
            transform: translateY(0) rotate(0);
          }
        }

        .line-top {
          animation: ${isOpen ? "hamburgerToX-top" : "xToHamburger-top"} 0.6s
            ease-in-out forwards;
        }

        .line-middle {
          animation: ${isOpen ? "hamburgerToX-middle" : "xToHamburger-middle"}
            0.6s ease-in-out forwards;
        }

        .line-bottom {
          animation: ${isOpen ? "hamburgerToX-bottom" : "xToHamburger-bottom"}
            0.6s ease-in-out forwards;
        }

        .line-top.initial {
          width: 35px;
        }

        .line-middle.initial {
          width: 26px;
        }

        .line-bottom.initial {
          width: 14px;
        }
      `}</style>

      {/* Hamburger Menu Button */}
      <button
        onClick={toggleMenu}
        className="nav-toggler group z-60 flex mt-1 cursor-pointer flex-col items-start justify-center gap-1.25"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <span
          className={`line-top ${!isOpen && "initial"} h-0.5 bg-white transition-colors group-hover:bg-white/80`}
        ></span>
        <span
          className={`line-middle ${!isOpen && "initial"} h-0.5 bg-white transition-colors group-hover:bg-white/80`}
        ></span>
        <span
          className={`line-bottom ${!isOpen && "initial"} h-0.5 bg-white transition-colors group-hover:bg-white/80`}
        ></span>
      </button>

      {/* Overlay Background */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={toggleMenu}
      />

      {/* Sidebar Menu */}
      <nav
        className={`fixed left-0 top-0 z-50 h-full w-full max-w-110 bg-[#032a0d] text-white transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Main Navigation Links */}
          <div className="flex-1 overflow-y-auto px-8 py-8 mt-20">
            <ul className="space-y-6 font-serif">
              <li>
                <a
                  href="#"
                  className="block text-2xl tracking-wide transition-colors hover:underline"
                >
                  School of Chaplaincy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block text-2xl tracking-wide transition-colors hover:underline"
                >
                  Chaplain Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block text-2xl tracking-wide transition-colors hover:underline"
                >
                  News & Announcement
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block text-2xl tracking-wide transition-colors hover:underline"
                >
                  Seminary & Community
                </a>
              </li>
              <li>
                <a
                  href="/become-a-member"
                  className="block text-2xl tracking-wide transition-colors hover:underline"
                >
                  Become a Member
                </a>
              </li>
            </ul>

            {/* Secondary Links */}
            <div className="mt-16 space-y-4 border-t border-white/10 pt-8">
              <a
                href="/about-pearl-of-the-orient"
                className="block transition-colors hover:underline"
              >
                About Pearl of the Orient
              </a>
              <a href="#" className="block transition-colors hover:underline">
                Office of the Chief Chaplain
              </a>
              <a
                href="/organizational-structure"
                className="block transition-colors hover:underline"
              >
                Organizational Structure
              </a>
              <a href="#" className="block transition-colors hover:underline">
                What We Believe
              </a>
              <a href="#" className="block transition-colors hover:underline">
                Contact & Inquiries
              </a>
              <a href="#" className="block transition-colors hover:underline">
                Certifications
              </a>
              <a href="#" className="block transition-colors hover:underline">
                Frequently Asked Questions
              </a>
              <a
                href="/directory"
                className="block transition-colors hover:underline"
              >
                Directory
              </a>
            </div>
          </div>
          <div className="mt-auto px-8 py-8">
            {!isSignedIn && (
              <a
                href="/sign-in"
                className="flex items-center gap-1 hover:gap-3 transition-all hover:underline"
              >
                Sign in with your account <ArrowRightIcon className="size-3" />
              </a>
            )}
            <Link href="#" className="flex bg-[#051b0b] px-3 py-3 rounded-md transition-colors items-center gap-2">
              <div className="relative w-fit">
                <Avatar className="size-10">
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={user?.fullName || "User Name"}
                  />
                  <AvatarFallback className="text-xs">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -top-1.5 -right-1.5">
                  <span className="sr-only">Verified</span>
                  <BadgeCheckIcon className="text-background size-5 fill-green-500" />
                </span>
              </div>

              <div>
                <p className="text-sm">{user?.fullName ?? "User Name"}</p>
                <p className="text-xs">
                  {user?.emailAddresses[0].emailAddress ?? "User Email"}
                </p>
              </div>

              <ChevronDownIcon className='ml-auto size-4' />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};
