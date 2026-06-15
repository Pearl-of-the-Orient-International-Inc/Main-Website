"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DOCS_NAV } from "@/constants";
import { cn } from "@/lib/utils";

export const DocsMobileNav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="size-9">
          <Menu className="size-5" />
          <span className="sr-only">Toggle navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="px-4 py-5 border-b">
          <SheetTitle className="text-sm font-bold text-left">
            Documentation
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-5 px-4 py-5 overflow-y-auto">
          {DOCS_NAV.map((group) => (
            <div key={group.group} className="flex flex-col gap-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                {group.group}
              </p>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-sm font-medium rounded-md px-2 py-1.5 transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
