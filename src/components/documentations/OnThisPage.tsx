/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ArrowUpRightIcon, ChevronDownIcon, ListTree } from "lucide-react";
import { useDocsContext } from "@/lib/docs-context";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  IconMoodEmptyFilled,
  IconMoodSadFilled,
  IconMoodSmileFilled,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  RiClaudeFill,
  RiGeminiFill,
  RiOpenaiFill,
  RiPerplexityFill,
  RiChat3Line,
} from "react-icons/ri";
import { SiZedindustries } from "react-icons/si";
import { FaRegFilePdf } from "react-icons/fa6";
import { IoMdShare } from "react-icons/io";
import { useTheme } from "next-themes";

type Feedback = "helpful" | "neutral" | "unhelpful" | null;

export const OnThisPage = () => {
  const { theme } = useTheme();
  const { items } = useDocsContext();
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!items.length) return;

    const headingIds = items.map((item) => item.href.replace("#", ""));

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px", // offset for sticky header
        threshold: 0,
      },
    );

    headingIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Set first item as default active
    if (!activeId && headingIds[0]) {
      setActiveId(headingIds[0]);
    }

    return () => observer.disconnect();
  }, [items]);

  const feedbackOptions: {
    value: Feedback;
    icon: React.ReactNode;
    label: string;
  }[] = [
    {
      value: "helpful",
      icon: <IconMoodSmileFilled className="size-5.5" />,
      label: "Helpful",
    },
    {
      value: "neutral",
      icon: <IconMoodEmptyFilled className="size-5.5" />,
      label: "Neutral",
    },
    {
      value: "unhelpful",
      icon: <IconMoodSadFilled className="size-5.5" />,
      label: "Unhelpful",
    },
  ];

  if (!items.length) return null;

  return (
    <aside className="sticky top-30 max-h-[82vh] overflow-y-auto no-scrollbar flex flex-col gap-6">
      {/* On This Page */}
      <div>
        <p className="text-xs flex items-center gap-2 font-semibold uppercase text-muted-foreground mb-3">
          <ListTree className="size-4" />
          On This Page
        </p>
        <nav className="flex flex-col gap-1">
          {items.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = activeId === id;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm py-0.5 transition-colors",
                  isActive
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-primary hover:border-primary/50",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={
              theme === "dark" || theme === "system" ? "secondary" : "outline"
            }
            size="sm"
            className="p-0! justify-start w-fit"
          >
            <div className="flex items-center gap-2 border-r px-3">
              <RiOpenaiFill className="size-4" />
              <p className="-mt-0.5 text-sm">Open in ChatGPT</p>
            </div>
            <ChevronDownIcon className="size-4 mr-2 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="lg:w-65">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                const encodedUrl = encodeURIComponent(window.location.href);
                window.open(
                  `https://chatgpt.com/?prompt=Read+${encodedUrl}`,
                  "_blank",
                );
              }}
            >
              <RiOpenaiFill className="size-4" />
              <p className="-mt-0.5 text-sm">Open in ChatGPT</p>
              <ArrowUpRightIcon className="size-4 ml-auto" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const encodedUrl = encodeURIComponent(window.location.href);
                window.open(
                  `https://claude.ai/new?q=Read+${encodedUrl}`,
                  "_blank",
                );
              }}
            >
              <RiClaudeFill className="size-4" />
              <p className="-mt-0.5 text-sm">Open in Claude</p>
              <ArrowUpRightIcon className="size-4 ml-auto" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const encodedUrl = encodeURIComponent(window.location.href);
                window.open(
                  `https://gemini.google.com/app?q=Read+${encodedUrl}`,
                  "_blank",
                );
              }}
            >
              <RiGeminiFill className="size-4" />
              <p className="-mt-0.5 text-sm">Open in Gemini</p>
              <ArrowUpRightIcon className="size-4 ml-auto" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const encodedUrl = encodeURIComponent(window.location.href);
                window.open(
                  `https://www.perplexity.ai/?q=Read+${encodedUrl}`,
                  "_blank",
                );
              }}
            >
              <RiPerplexityFill className="size-4" />
              <p className="-mt-0.5 text-sm">Open in Perplexity</p>
              <ArrowUpRightIcon className="size-4 ml-auto" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const encodedUrl = encodeURIComponent(window.location.href);
                window.open(`zed://open?prompt=Read+${encodedUrl}`, "_blank");
              }}
            >
              <SiZedindustries className="size-4" />
              <p className="-mt-0.5 text-sm">Open in Zed</p>
              <ArrowUpRightIcon className="size-4 ml-auto" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const encodedUrl = encodeURIComponent(window.location.href);
                window.open(
                  `https://t3.chat/new?q=Read+${encodedUrl}`,
                  "_blank",
                );
              }}
            >
              <RiChat3Line className="size-4" />
              <p className="-mt-0.5 text-sm">Open in T3 Chat</p>
              <ArrowUpRightIcon className="size-4 ml-auto" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <FaRegFilePdf className="size-4" />
              <p className="-mt-0.5 text-sm">Export as PDF</p>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                const url = window.location.href;
                const title = document.title;

                if (navigator.share) {
                  await navigator.share({ title, url });
                } else {
                  await navigator.clipboard.writeText(url);
                  // optional: show a toast here
                }
              }}
            >
              <IoMdShare className="size-4" />
              <p className="-mt-0.5 text-sm">Share to Socials</p>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Divider */}
      <div className="border-t" />

      {/* Feedback */}
      <div>
        {feedback ? (
          <p className="text-xs text-muted-foreground">
            Thanks for your feedback!
          </p>
        ) : (
          <>
            <p className="text-xs font-semibold text-muted-foreground mb-3">
              Was this helpful?
            </p>
            <div className="flex border bg-accent/90 border-zinc-300 rounded-full w-fit px-1 py-0.5 items-center">
              {feedbackOptions.map(({ value, icon, label }) => (
                <button
                  key={value}
                  onClick={() => setFeedback(value)}
                  aria-label={label}
                  className={cn(
                    "size-8 flex items-center justify-center transition-colors",
                    "text-muted-foreground hover:text-primary",
                    feedback === value && "text-primary",
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
