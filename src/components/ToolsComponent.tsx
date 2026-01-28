"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpFromLineIcon,
  FileQuestionIcon,
  MessageSquareTextIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ToolsComponent = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger the compact state after scrolling 200px
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed top-1/2 right-0 z-40">
      {isScrolled && (
        <Card className="p-0! rounded-r-none border-r-none shadow-r-none">
          <CardContent className="p-0!">
            <div className="space-y-2 p-1">
              <Button
                variant="ghost"
                className="rounded-none w-full text-[11px] h-12 flex flex-col"
              >
                <MessageSquareTextIcon className="size-4" />
                Messenger
              </Button>
              <Separator />
              <Link href="/survey" target="_blank">
                <Button
                  variant="ghost"
                  className="rounded-none w-full text-[11px] h-12 flex flex-col"
                >
                  <FileQuestionIcon className="size-4" />
                  Survey
                </Button>
              </Link>
              <Separator />
              <Button
                variant="ghost"
                className="rounded-none w-full text-[11px] h-12 flex flex-col"
                onClick={scrollToTop}
              >
                <ArrowUpFromLineIcon className="size-4" />
                Back to Top
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
