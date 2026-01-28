"use client";

import { Button } from "@/components/ui/button";
import { Eye, PenSquare } from "lucide-react";

export function PreviewToggleButton({
  isPreview,
  onToggle,
}: {
  isPreview: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#032a0d]/15 bg-white/80 px-4 py-3 shadow-sm">
      <div className="text-xs sm:text-sm text-[#032a0d]/80">
        <p className="font-medium text-[#032a0d]">
          {isPreview ? "Preview mode" : "Editor mode"}
        </p>
        <p className="text-[11px] text-[#032a0d]/70">
          Toggle between filling out the form and viewing a printed-style
          preview.
        </p>
      </div>
      <Button
        type="button"
        variant={isPreview ? "outline" : "default"}
        size="sm"
        onClick={onToggle}
        className={
          isPreview
            ? "border-[#032a0d]/40 text-[#032a0d] hover:bg-[#032a0d]/5"
            : "bg-[#032a0d] hover:bg-[#032a0d]/90 text-white"
        }
      >
        {isPreview ? (
          <>
            <PenSquare className="size-3.5" />
            Back to edit
          </>
        ) : (
          <>
            <Eye className="size-3.5" />
            Preview form
          </>
        )}
      </Button>
    </div>
  );
}

