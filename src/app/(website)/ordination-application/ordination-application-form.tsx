"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import { useOptionalCurrentUserQuery } from "@/features/auth/auth.hooks";
import { getCurrentOrdinationApplication, saveOrdinationApplication, submitOrdinationApplication, uploadOrdinationDocument, type OrdinationDocument } from "@/features/ordination/ordination";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { toApiError } from "@/lib/http-client";

const docTypes = [
  ["ELIGIBILITY_EVIDENCE", "Professional Chaplain eligibility evidence"],
  ["GOVERNMENT_ID", "Government-issued ID"],
  ["LETTER_OF_INTENT", "Letter of intent"],
  ["RECOMMENDATION", "Pastoral recommendation"],
  ["OTHER", "Other supporting document"],
] as const;

export function OrdinationApplicationForm() {
  const { toast } = useToast();
  const user = useOptionalCurrentUserQuery();
  const query = useQuery({ queryKey: ["ordination", "current"], queryFn: getCurrentOrdinationApplication, enabled: Boolean(user.data) });
  const [form, setForm] = React.useState({ ministryBackground: "", callingStatement: "", proposedMinistry: "", additionalInformation: "", informationAccurate: false, codeOfConductAccepted: false, backgroundCheckConsent: false });
  const [documents, setDocuments] = React.useState<OrdinationDocument[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [uploading, setUploading] = React.useState<string | null>(null);
  const hydrated = React.useRef(false);

  React.useEffect(() => {
    const application = query.data?.application;
    if (!application || hydrated.current) return;
    hydrated.current = true;
    setForm({ ministryBackground: application.ministryBackground, callingStatement: application.callingStatement, proposedMinistry: application.proposedMinistry, additionalInformation: application.additionalInformation ?? "", informationAccurate: application.informationAccurate, codeOfConductAccepted: application.codeOfConductAccepted, backgroundCheckConsent: application.backgroundCheckConsent });
    setDocuments(application.documents ?? []);
  }, [query.data?.application]);

  if (user.isLoading || query.isLoading) return <div className="flex min-h-96 items-center justify-center"><Loader2 className="size-7 animate-spin text-[#032a0d]" /></div>;
  if (!user.data) return <State title="Sign in required" message="Sign in using your member account to check ordination eligibility." href="/sign-in" action="Sign in" />;
  if (query.isError) return <State title="Unable to load application" message="Your ordination eligibility could not be checked right now." />;
  if (!query.data?.eligible) return <State title="Not currently eligible" message={query.data?.eligibilityReason ?? "Only Professional Chaplain members may apply."} />;

  const application = query.data.application;
  const editable = !application || ["DRAFT", "ADDITIONAL_INFORMATION_REQUIRED", "RETURNED_FOR_CORRECTION"].includes(application.status);
  const payload = { ...form, additionalInformation: form.additionalInformation || null, documents };
  const save = async (submit: boolean) => { setBusy(true); try { await (submit ? submitOrdinationApplication(payload) : saveOrdinationApplication(payload)); toast({ title: submit ? "Application submitted" : "Draft saved", description: submit ? "Your application is ready for administrator review." : "You can return and complete it later.", variant: "success" }); await query.refetch(); } catch (error) { toast({ title: submit ? "Submission failed" : "Save failed", description: toApiError(error).message, variant: "error" }); } finally { setBusy(false); } };
  const upload = async (type: OrdinationDocument["type"], file?: File) => { if (!file) return; setUploading(type); try { const item = await uploadOrdinationDocument(file); if (!item) throw new Error("Upload failed"); setDocuments((current) => [...current.filter((doc) => doc.type !== type), { type, fileUrl: item.ufsUrl, fileName: item.name, mimeType: item.type }]); toast({ title: "Document uploaded", variant: "success" }); } catch (error) { toast({ title: "Upload failed", description: error instanceof Error ? error.message : "Try again.", variant: "error" }); } finally { setUploading(null); } };

  return <main className="bg-[#f7f8f5] px-4 py-12 sm:px-6"><div className="mx-auto max-w-4xl space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-5"><div><p className="text-sm text-zinc-500">Eligibility verified</p><h2 className="font-semibold text-[#032a0d]">Professional Chaplain</h2></div><Badge>{application?.status?.replaceAll("_", " ") ?? "NEW APPLICATION"}</Badge></div>
    {application?.requestedInformation && <div className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm"><AlertCircle className="size-5 shrink-0 text-amber-700" /><div><p className="font-semibold">Administrator requested changes</p><p className="mt-1">{application.requestedInformation}</p></div></div>}
    {!editable && <div className="rounded-xl border bg-white p-8 text-center"><CheckCircle2 className="mx-auto size-10 text-[#032a0d]" /><h2 className="mt-3 text-xl font-semibold">Application {application?.status.toLowerCase().replaceAll("_", " ")}</h2><p className="mt-2 text-sm text-zinc-600">You will be notified when the review status changes. Approval does not grant administrator access or an officer role.</p></div>}
    {editable && <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); void save(true); }}>
      <section className="space-y-4 rounded-xl border bg-white p-6"><h2 className="font-serif text-2xl text-[#032a0d]">Application information</h2>
        <Field label="Ministry background" hint="Minimum 50 characters"><Textarea value={form.ministryBackground} onChange={(e) => setForm({ ...form, ministryBackground: e.target.value })} rows={6} required minLength={50} /></Field>
        <Field label="Calling and purpose for ordination" hint="Minimum 50 characters"><Textarea value={form.callingStatement} onChange={(e) => setForm({ ...form, callingStatement: e.target.value })} rows={6} required minLength={50} /></Field>
        <Field label="Proposed ministry after ordination" hint="Minimum 30 characters"><Textarea value={form.proposedMinistry} onChange={(e) => setForm({ ...form, proposedMinistry: e.target.value })} rows={5} required minLength={30} /></Field>
        <Field label="Additional information (optional)"><Textarea value={form.additionalInformation} onChange={(e) => setForm({ ...form, additionalInformation: e.target.value })} rows={4} /></Field>
      </section>
      <section className="rounded-xl border bg-white p-6"><h2 className="font-serif text-2xl text-[#032a0d]">Supporting documents</h2><p className="mt-1 text-sm text-zinc-500">Eligibility evidence and a government ID are required. PDF or image, up to 16 MB.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{docTypes.map(([type, label]) => { const doc = documents.find((item) => item.type === type); return <label key={type} className="relative flex min-h-28 cursor-pointer flex-col justify-center rounded-lg border border-dashed p-4 hover:bg-zinc-50"><Input type="file" accept="image/*,.pdf" className="sr-only" onChange={(e) => void upload(type, e.target.files?.[0])} /><span className="flex items-center gap-2 font-medium"><Upload className="size-4" />{label}{["ELIGIBILITY_EVIDENCE", "GOVERNMENT_ID"].includes(type) && " *"}</span><span className="mt-2 truncate text-xs text-zinc-500">{uploading === type ? "Uploading…" : doc?.fileName ?? "Choose file"}</span>{doc && <button type="button" className="absolute right-2 top-2" onClick={(e) => { e.preventDefault(); setDocuments((current) => current.filter((item) => item.type !== type)); }}><X className="size-4" /></button>}</label>; })}</div></section>
      <section className="space-y-4 rounded-xl border bg-white p-6"><h2 className="font-serif text-2xl text-[#032a0d]">Declarations</h2>{([["informationAccurate", "I certify that the information and documents are complete and accurate."], ["codeOfConductAccepted", "I agree to uphold the organization’s code of conduct and ordination standards."], ["backgroundCheckConsent", "I consent to eligibility and background verification for this application."]] as const).map(([key, label]) => <label key={key} className="flex items-start gap-3 text-sm"><Checkbox checked={form[key]} onCheckedChange={(checked) => setForm({ ...form, [key]: checked === true })} /><span>{label}</span></label>)}</section>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="outline" disabled={busy || Boolean(uploading)} onClick={() => void save(false)}>Save draft</Button><Button type="submit" disabled={busy || Boolean(uploading) || documents.length < 2}>{busy ? <Loader2 className="animate-spin" /> : <FileText />}Submit for review</Button></div>
    </form>}
  </div></main>;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) { return <label className="block space-y-2"><span className="font-medium">{label}</span>{children}{hint && <span className="block text-xs text-zinc-500">{hint}</span>}</label>; }
function State({ title, message, href, action }: { title: string; message: string; href?: string; action?: string }) { return <main className="bg-[#f7f8f5] px-4 py-20"><div className="mx-auto max-w-lg rounded-xl border bg-white p-8 text-center"><AlertCircle className="mx-auto size-10 text-amber-700" /><h2 className="mt-4 text-2xl font-semibold text-[#032a0d]">{title}</h2><p className="mt-2 text-sm text-zinc-600">{message}</p>{href && <Link href={href} className="mt-6 inline-flex rounded bg-[#032a0d] px-5 py-2.5 text-sm font-semibold text-white">{action}</Link>}</div></main>; }
