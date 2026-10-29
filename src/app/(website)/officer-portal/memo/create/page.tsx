"use client";

import { DocxEditor, type DocxEditorRef } from "@eigenpal/docx-js-editor";
import "@eigenpal/docx-js-editor/styles.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Loader2, Save, Send, ShieldCheck } from "lucide-react";

import { AuthGuard } from "@/components/providers/AuthGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";
import {
  createOfficerMemo,
  getOfficerScope,
} from "@/features/officer-portal/officer-portal.api";
import { useToast } from "@/hooks/use-toast";
import { toApiError } from "@/lib/http-client";

const templatePaths = {
  ANNOUNCEMENT: "/memo-templates/Announcement.docx",
  GENERAL_OFFICE: "/memo-templates/General_Office.docx",
  INCIDENT_REPORT: "/memo-templates/Incident_Report.docx",
  MEETING_NOTICE: "/memo-templates/Meeting_Notice.docx",
  POLICY_CHANGE: "/memo-templates/Policy_Change.docx",
  BLANK: "/memo-templates/Blank_Others.docx",
} as const;

type TemplateType = keyof typeof templatePaths;

const templateOptions: Array<{ value: TemplateType; label: string }> = [
  { value: "ANNOUNCEMENT", label: "Announcement" },
  { value: "GENERAL_OFFICE", label: "General Office" },
  { value: "INCIDENT_REPORT", label: "Incident Report" },
  { value: "MEETING_NOTICE", label: "Meeting Notice" },
  { value: "POLICY_CHANGE", label: "Policy Change" },
  { value: "BLANK", label: "Blank Template" },
];

const toBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let index = 0; index < bytes.byteLength; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return window.btoa(binary);
};

const fileNameFor = (title: string) => {
  const safeTitle = title
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `${safeTitle || "officer-memo"}-${Date.now()}.docx`;
};

function OfficerMemoEditor() {
  const { toast } = useToast();
  const editorRef = useRef<DocxEditorRef | null>(null);
  const searchParams = useSearchParams();
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUserQuery();
  const [title, setTitle] = useState("");
  const initialType = searchParams.get("type");
  const [templateType, setTemplateType] = useState<TemplateType>(
    initialType && initialType in templatePaths
      ? (initialType as TemplateType)
      : "ANNOUNCEMENT",
  );
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scopeQuery = useQuery({
    queryKey: ["officer", "scope"],
    queryFn: getOfficerScope,
    enabled: currentUser?.role === "OFFICER",
  });
  const createMutation = useMutation({ mutationFn: createOfficerMemo });

  const templatePath = templatePaths[templateType];
  const scopeLabel = useMemo(
    () =>
      (scopeQuery.data?.assignments ?? [])
        .map((assignment) =>
          [
            assignment.officeTitle.name,
            assignment.region,
            assignment.province,
            assignment.cityMunicipality,
            assignment.barangay,
          ]
            .filter(Boolean)
            .join(" · "),
        )
        .join(" / "),
    [scopeQuery.data?.assignments],
  );

  useEffect(() => {
    let isCurrent = true;
    setIsLoadingTemplate(true);
    setBuffer(null);
    void (async () => {
      try {
        const response = await fetch(templatePath);
        if (!response.ok) throw new Error("Unable to load the memo template.");
        const nextBuffer = await response.arrayBuffer();
        if (isCurrent) setBuffer(nextBuffer);
      } catch (error) {
        toast({
          variant: "error",
          title: "Template unavailable",
          description:
            error instanceof Error ? error.message : "Unable to load the memo template.",
        });
      } finally {
        if (isCurrent) setIsLoadingTemplate(false);
      }
    })();
    return () => {
      isCurrent = false;
    };
  }, [templatePath, toast]);

  const submitForReview = async () => {
    if (!title.trim()) {
      toast({ variant: "warning", title: "Memo title required", description: "Enter a title before submitting." });
      return;
    }
    if (!editorRef.current) return;

    try {
      setIsSubmitting(true);
      const savedBuffer = await editorRef.current.save();
      if (!savedBuffer) throw new Error("The memo document could not be saved.");
      const memo = await createMutation.mutateAsync({
        title: title.trim(),
        category: templateType,
        documentName: fileNameFor(title),
        docxBase64: toBase64(savedBuffer),
      });
      toast({
        variant: "success",
        title: "Memo submitted for review",
        description: `${memo.referenceNumber} is now waiting for an administrator decision.`,
      });
      window.location.assign("/officer-portal");
    } catch (error) {
      toast({ variant: "error", title: "Memo submission failed", description: toApiError(error).message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || isLoadingTemplate || !buffer) {
    return <main className="flex min-h-[70vh] items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 size-4 animate-spin" />Loading memo editor…</main>;
  }

  if (currentUser?.role !== "OFFICER" || scopeQuery.isError) {
    return <main className="mx-auto max-w-xl px-6 py-28 text-center"><ShieldCheck className="mx-auto size-8 text-[#032a0d]" /><h1 className="mt-4 text-2xl font-semibold">Officer access required</h1><p className="mt-2 text-muted-foreground">An active officer assignment is required to compose a scoped memo.</p><Button asChild className="mt-6"><Link href="/officer-portal">Back to Officer Workspace</Link></Button></main>;
  }

  return <main className="min-h-screen bg-[#f4f7f3]">
    <div className="border-b bg-white px-4 py-3 shadow-sm sm:px-6">
      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm"><Link href="/officer-portal"><ArrowLeft className="size-4" />Back</Link></Button>
        <div className="min-w-52 flex-1"><Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Memo title" maxLength={200} /></div>
        <Select value={templateType} onValueChange={(value) => { setTemplateType(value as TemplateType); window.location.assign(`/officer-portal/memo/create?type=${value}`); }}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent>{templateOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select>
        <Button onClick={() => void submitForReview()} disabled={isSubmitting || createMutation.isPending}><Send className="size-4" />{isSubmitting ? "Submitting…" : "Submit for review"}</Button>
      </div>
      <div className="mx-auto mt-2 flex max-w-[1800px] items-center gap-2 text-xs text-muted-foreground"><Badge variant="outline">Scoped recipients</Badge><span>{scopeLabel || "Loading assignment scope…"}</span></div>
    </div>
    <div className="h-[calc(100vh-112px)] overflow-hidden"><DocxEditor ref={editorRef} className="h-full" documentBuffer={buffer} documentName={fileNameFor(title || "officer-memo")} showToolbar showRuler showZoomControl showPrintButton={false} mode="editing" author={currentUser?.name} renderLogo={() => <Image src="/main/logo.png" alt="Pearl of the Orient" width={30} height={30} className="size-10 rounded-sm object-cover" />} renderTitleBarRight={() => <div className="flex items-center gap-2"><Badge variant="secondary">Draft for review</Badge><Button size="sm" onClick={() => void submitForReview()} disabled={isSubmitting}><Save className="size-4" />{isSubmitting ? "Submitting…" : "Submit"}</Button></div>} /></div>
  </main>;
}

export default function OfficerMemoCreatePage() {
  return <AuthGuard><OfficerMemoEditor /></AuthGuard>;
}
