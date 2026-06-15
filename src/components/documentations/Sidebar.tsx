"use client";

import { DOCS_NAV } from "@/constants";
import { NavItemLink } from "@/components/documentations/NavItemLink";

export const DocsSidebar = () => {
  return (
    <aside className="sticky top-30 rounded-xl max-h-[82vh] no-scrollbar space-y-5 overflow-y-auto border bg-accent/50 p-4">
      <nav className="flex flex-col gap-5">
        {DOCS_NAV.map((group) => (
          <div key={group.group} className="flex flex-col gap-1">
            <p className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">
              {group.group}
            </p>
            {group.items.map((item) => (
              <NavItemLink key={item.href} item={item} />
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};