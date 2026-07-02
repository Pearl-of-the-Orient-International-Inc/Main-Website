"use client";

import Image from "next/image";
import { ZoomInIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type RecognitionImage = {
  src: string;
  alt: string;
};

type RecognitionGalleryProps = {
  images: RecognitionImage[];
};

export function RecognitionGallery({ images }: RecognitionGalleryProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
      {images.map((image) => (
        <Dialog key={image.src}>
          <DialogTrigger className="group relative overflow-hidden border border-[#032a0d]/10 bg-white p-3 text-left shadow-[0_16px_45px_rgba(3,42,13,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#032a0d]/25 hover:shadow-[0_22px_55px_rgba(3,42,13,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#032a0d] focus-visible:ring-offset-2 sm:p-4">
            <span className="relative block aspect-[4/3] w-full overflow-hidden bg-[#032a0d]/5">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 544px, (min-width: 768px) 50vw, 100vw"
                className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-[#032a0d]/0 opacity-0 transition-all duration-300 group-hover:bg-[#032a0d]/20 group-hover:opacity-100">
                <span className="flex items-center gap-2 bg-white/95 px-4 py-2 text-sm font-semibold text-[#032a0d] shadow-lg">
                  <ZoomInIcon className="size-4" />
                  View full size
                </span>
              </span>
            </span>
          </DialogTrigger>

          <DialogContent
            className="max-h-[92vh] max-w-[96vw] overflow-hidden border-white/10 bg-white p-2 sm:p-3 md:max-w-6xl"
            showCloseButton
          >
            <DialogTitle className="sr-only">{image.alt}</DialogTitle>
            <div className="relative h-[82vh] w-full bg-[#032a0d]/5">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="96vw"
                className="object-contain"
                priority
              />
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
