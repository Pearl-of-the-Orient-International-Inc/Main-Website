import type { ReactNode } from "react";
import { HelpCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Field({
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("block space-y-1.5 text-xs sm:text-sm", className)}>
      <span className="flex items-center gap-2">
        <span className={error ? "font-medium text-red-600" : "font-medium text-[#032a0d]"}>
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
        </span>
        {hint ? (
          <Tooltip>
            <TooltipTrigger type="button">
              <HelpCircleIcon className="size-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>{hint}</TooltipContent>
          </Tooltip>
        ) : null}
      </span>
      {children}
    </label>
  );
}
