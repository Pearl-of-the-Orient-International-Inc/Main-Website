
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { NavItem } from "@/constants";

type Props = {
  item: NavItem;
  onNavigate?: () => void;
};

export const NavItemLink = ({ item, onNavigate }: Props) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = item.children?.some((child) => pathname === child.href);

  const linkClass = cn(
    "text-sm font-medium rounded-md px-2 py-1 transition-colors hover:bg-[#032A0D]/80 hover:text-white w-full text-left",
    isActive || isChildActive ? "text-white bg-[#032A0D]/90" : "text-muted-foreground"
  );

  if (!hasChildren) {
    return (
      <Link href={item.href} onClick={onNavigate} className={linkClass}>
        {item.label}
      </Link>
    );
  }

  return (
    <Collapsible defaultOpen={isActive || isChildActive}>
      {/* Entire row is the trigger */}
      <CollapsibleTrigger
        className={cn(
          linkClass,
          "flex items-center justify-between w-full [&[data-state=open]>svg]:rotate-90"
        )}
      >
        {item.label}
        <ChevronRight className="size-3.5 transition-transform duration-200 shrink-0" />
      </CollapsibleTrigger>

      <CollapsibleContent className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3">
  {item.children!.map((child) => (
    <Link
      key={child.href}
      href={child.href}
      onClick={onNavigate}
      className={cn(
        "text-sm px-2 py-1 transition-colors hover:text-[#032A0D]",
        pathname === child.href
          ? "text-[#032A0D] font-medium"
          : "text-muted-foreground"
      )}
    >
      {child.label}
    </Link>
  ))}
</CollapsibleContent>
    </Collapsible>
  );
};