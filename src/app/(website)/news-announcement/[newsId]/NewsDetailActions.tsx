"use client";

import { MoreHorizontal, Share2 } from "lucide-react";

export function NewsDetailActions({ title }: { title: string }) {
  const share = async () => {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title,
        url,
      });
      return;
    }

    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => void share()}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-800 shadow-sm transition hover:border-[#032a0d]/30 hover:text-[#032a0d]"
      >
        <Share2 className="size-4" />
        Share
      </button>
      <button
        type="button"
        className="inline-flex size-9 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:border-[#032a0d]/30 hover:text-[#032a0d]"
        aria-label="More actions"
      >
        <MoreHorizontal className="size-5" />
      </button>
    </div>
  );
}
