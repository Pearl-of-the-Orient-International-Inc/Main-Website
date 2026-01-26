"use client";

import { useState } from "react";

export const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
                  Learn & Grow
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
                  href="#"
                  className="block text-2xl tracking-wide transition-colors hover:underline"
                >
                  Become a Member
                </a>
              </li>
            </ul>

            {/* Secondary Links */}
            <div className="mt-16 space-y-4 border-t border-white/10 pt-8">
              <a href="#" className="block transition-colors hover:underline">
                About Pearl of the Orient
              </a>
              <a href="#" className="block transition-colors hover:underline">
                School of Chaplaincy
              </a>
              <a href="#" className="block transition-colors hover:underline">
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
              <a href="#" className="block transition-colors hover:underline">
                Directory
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
