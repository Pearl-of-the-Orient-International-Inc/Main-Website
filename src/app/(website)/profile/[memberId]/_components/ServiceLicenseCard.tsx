"use client";

import { useRef, useState } from "react";
import { BadgeCheck, Download, FileUp, LoaderCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useDeleteCurrentMemberServiceLicenseMutation,
  useUpdateCurrentMemberServiceLicenseMutation,
  useUploadMemberServiceLicenseMutation,
} from "@/features/member/member.hooks";
import { useToast } from "@/hooks/use-toast";

type LicenseAsset = {
  url: string | null;
  fileName: string | null;
  mimeType: "image/png" | "application/pdf" | null;
};

export function ServiceLicenseCard({
  initialLicense,
  canManage,
}: {
  initialLicense: LicenseAsset;
  canManage: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [license, setLicense] = useState(initialLicense);
  const { toast } = useToast();
  const uploadMutation = useUploadMemberServiceLicenseMutation();
  const updateMutation = useUpdateCurrentMemberServiceLicenseMutation();
  const deleteMutation = useDeleteCurrentMemberServiceLicenseMutation();
  const busy =
    uploadMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const uploadLicense = async (file?: File) => {
    if (!file || busy) return;

    if (file.type !== "image/png" && file.type !== "application/pdf") {
      toast({
        title: "Unsupported license file",
        description: "Please upload a PNG image or PDF document.",
        variant: "error",
      });
      return;
    }

    const maxBytes = file.type === "application/pdf" ? 16 * 1024 * 1024 : 8 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast({
        title: "License file is too large",
        description: file.type === "application/pdf" ? "PDF files must be 16MB or smaller." : "PNG files must be 8MB or smaller.",
        variant: "error",
      });
      return;
    }

    try {
      const uploaded = await uploadMutation.mutateAsync(file);
      const fileUrl = uploaded?.serverData?.fileUrl || uploaded?.ufsUrl || uploaded?.url;
      if (!fileUrl) throw new Error("The uploaded license URL was not returned.");

      const saved = await updateMutation.mutateAsync({
        fileUrl,
        fileName: file.name,
        mimeType: file.type as LicenseAsset["mimeType"] & string,
      });
      setLicense({
        url: saved.serviceLicenseUrl,
        fileName: saved.serviceLicenseFileName,
        mimeType: saved.serviceLicenseMimeType,
      });
      toast({
        title: "Service license uploaded",
        description: "Your public license is now available to service requesters.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Unable to upload license",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "error",
      });
    }
  };

  const removeLicense = async () => {
    if (busy) return;
    try {
      await deleteMutation.mutateAsync();
      setLicense({ url: null, fileName: null, mimeType: null });
      toast({ title: "Service license removed", variant: "success" });
    } catch (error) {
      toast({
        title: "Unable to remove license",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "error",
      });
    }
  };

  return (
    <section className="border border-neutral-200 bg-white p-5 shadow-sm">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,application/pdf,.png,.pdf"
        className="hidden"
        onChange={(event) => {
          void uploadLicense(event.currentTarget.files?.[0]);
          event.currentTarget.value = "";
        }}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-[#032a0d]">
            <BadgeCheck className="size-5" />
            Service License
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Public proof of authority or certification for chaplain services.
          </p>
        </div>
        {canManage ? (
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" disabled={busy} onClick={() => inputRef.current?.click()}>
              {busy ? <LoaderCircle className="size-4 animate-spin" /> : <FileUp className="size-4" />}
              {license.url ? "Replace" : "Upload"}
            </Button>
            {license.url ? (
              <Button type="button" variant="outline" disabled={busy} onClick={() => void removeLicense()} className="text-red-700">
                <Trash2 className="size-4" /> Remove
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      {license.url ? (
        <div className="mt-5 rounded-md border border-neutral-200 bg-neutral-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{license.fileName || "Service license"}</p>
              <p className="text-xs uppercase text-neutral-500">{license.mimeType === "application/pdf" ? "PDF document" : "PNG image"}</p>
            </div>
            <Button asChild size="sm" variant="outline">
              <a href={license.url} target="_blank" rel="noreferrer" download={license.fileName || undefined}>
                <Download className="size-4" /> View or download
              </a>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-5 py-8 text-center">
          <FileUp className="mx-auto size-8 text-neutral-400" />
          <p className="mt-3 text-sm font-medium">No service license uploaded</p>
          <p className="mt-1 text-xs text-neutral-500">Accepted formats: PNG up to 8MB or PDF up to 16MB.</p>
        </div>
      )}
    </section>
  );
}
