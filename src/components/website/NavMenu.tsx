"use client";

import {
  ArrowRightIcon,
  ChevronRightIcon,
  LockKeyholeIcon,
  LogOutIcon,
  SettingsIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BadgeCheckIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  toApiError,
  useCurrentUserQuery,
  useLogoutMutation,
} from "@/features/auth/auth.hooks";
import { useToast } from "@/hooks/use-toast";
import { authStore } from "@/lib/auth-store";

export const NavMenu = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: currentUser, refetch: refetchCurrentUser } =
    useCurrentUserQuery();
  const logoutMutation = useLogoutMutation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    return authStore.subscribe((token) => {
      if (token) {
        void refetchCurrentUser();
      }
    });
  }, [refetchCurrentUser]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isSignedIn = Boolean(currentUser);
  const memberProfileUniqueId = currentUser?.memberProfile?.uniqueId?.trim();
  const memberProfileHref = memberProfileUniqueId
    ? `/profile/${encodeURIComponent(memberProfileUniqueId)}`
    : null;
  const userInitials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
    : "U";

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
        variant: "success",
      });
      setIsOpen(false);
      router.push("/sign-in");
    } catch (error: unknown) {
      const apiError = toApiError(error);
      toast({
        title: "Logout failed",
        description: apiError.message ?? "Unable to logout. Please try again.",
        variant: "error",
      });
    }
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
          <div className="no-scrollbar mt-16 flex-1 overflow-y-auto px-5 py-6 sm:mt-20 sm:px-8 sm:py-8">
            <ul className="space-y-6 font-serif">
              <li>
                <a
                  href="https://seminary.pearlchaplaincy.org"
                  target="_blank"
                  className="block text-xl tracking-wide transition-colors hover:underline sm:text-2xl"
                >
                  School of Chaplaincy
                </a>
              </li>
              <li>
                <a
                  href="/book-a-service"
                  className="block text-xl tracking-wide transition-colors hover:underline sm:text-2xl"
                >
                  Book a Service
                </a>
              </li>
              <li>
                <Link
                  href="/news-announcement"
                  className="block text-xl tracking-wide transition-colors hover:underline sm:text-2xl"
                >
                  News & Announcement
                </Link>
              </li>
              <li>
                <a
                  href="/shop"
                  className="block text-xl tracking-wide transition-colors hover:underline sm:text-2xl"
                >
                  Chaplain Products
                </a>
              </li>
              <li>
                <a
                  href="/become-a-member"
                  className="block text-xl tracking-wide transition-colors hover:underline sm:text-2xl"
                >
                  Become a Member
                </a>
              </li>
            </ul>

            {/* Secondary Links */}
            <div className="mt-10 space-y-4 border-t border-white/10 pt-6 sm:mt-16 sm:pt-8">
              <a
                href="/about-pearl-of-the-orient"
                className="block transition-colors hover:underline"
              >
                About Pearl of the Orient
              </a>
              <a href="office-of-the-chief-chaplain" className="block transition-colors hover:underline">
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
          <div className="mt-auto px-5 py-6 sm:px-8 sm:py-8">
            {!isSignedIn ? (
              <a
                href="/sign-in"
                className="flex items-center gap-1 hover:gap-3 transition-all hover:underline"
              >
                Sign in with your account <ArrowRightIcon className="size-3" />
              </a>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex w-full items-center gap-2 rounded-md bg-[#051b0b] px-3 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#032a0d]">
                    <div className="relative w-fit">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={currentUser?.avatar ?? ""}
                          alt={currentUser?.name ?? "Current user"}
                        />
                        <AvatarFallback className="text-xs">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -top-1.5 -right-1.5">
                        <span className="sr-only">Verified</span>
                        <BadgeCheckIcon className="text-background size-5 fill-green-500" />
                      </span>
                    </div>

                    <div className="min-w-0 text-left">
                      <p className="truncate text-sm">{currentUser?.name}</p>
                      <p className="truncate text-xs">{currentUser?.email}</p>
                    </div>

                    <ChevronRightIcon className="ml-auto size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-60 z-999"
                  align="end"
                  side="right"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={currentUser?.avatar ?? ""}
                        alt={currentUser?.name ?? "Current user"}
                      />
                      <AvatarFallback className="text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col">
                      <span className="text-popover-foreground">{currentUser?.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {currentUser?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {memberProfileHref ? (
                    <DropdownMenuItem asChild>
                      <Link
                        href={memberProfileHref}
                        className="flex w-full items-center gap-2"
                      >
                        <SettingsIcon className="size-4" />
                        <span>Account</span>
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem disabled>
                      <SettingsIcon className="size-4" />
                      <span>No member profile linked</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link
                      href="/security-privacy"
                      className="flex w-full items-center gap-2"
                    >
                      <LockKeyholeIcon className="size-4" />
                      <span>Security & Privacy</span>
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild>
                    <Link
                      href="/notifications"
                      className="flex w-full items-center gap-2"
                    >
                      <BellIcon className="size-4" />
                      <span>Notifications</span>
                    </Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      void handleLogout();
                    }}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOutIcon className="size-4" />
                    <span>{logoutMutation.isPending ? "Logging out..." : "Log out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};
