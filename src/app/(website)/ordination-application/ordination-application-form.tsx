"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, CheckCircle2, FileText, Info, Loader2, ShieldCheck, Upload, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useOptionalCurrentUserQuery } from "@/features/auth/auth.hooks";
import { getCurrentOrdinationApplication, saveOrdinationApplication, submitOrdinationApplication, uploadOrdinationDocument, type OrdinationDocument } from "@/features/ordination/ordination";
import { useToast } from "@/hooks/use-toast";
import { toApiError } from "@/lib/http-client";

const documentTypes = [
  ["ELIGIBILITY_EVIDENCE", "Pearl Chaplaincy membership / eligibility evidence", true],
  ["GOVERNMENT_ID", "Government ID or PSA birth certificate", true],
  ["LETTER_OF_INTENT", "Statement of faith or letter of intent", false],
  ["RECOMMENDATION", "Church or ministry recommendation", false],
  ["OTHER", "Training, seminary credential, resume, or supporting file", false],
] as const;

const requirements = [
  "Active member of Pearl Chaplain Service.",
  "At least a Bachelor of Theology or AB Theology graduate.",
  "Church with at least 20 bona fide members, with its name, address, and contact details.",
  "Three to five years of pastoral ministry experience.",
  "Endorsement from the local church and a statement of faith.",
  "Attendance at the PSA-CRASM seminar and payment of the processing fee.",
  "Original PSA birth certificate for verification.",
];

type FormState = { ministryBackground: string; callingStatement: string; proposedMinistry: string; additionalInformation: string; informationAccurate: boolean; codeOfConductAccepted: boolean; backgroundCheckConsent: boolean };
const emptyForm: FormState = { ministryBackground: "", callingStatement: "", proposedMinistry: "", additionalInformation: "", informationAccurate: false, codeOfConductAccepted: false, backgroundCheckConsent: false };

export function OrdinationApplicationForm() {
  const { toast } = useToast();
  const user = useOptionalCurrentUserQuery();
  const query = useQuery({ queryKey: ["ordination", "current"], queryFn: getCurrentOrdinationApplication, enabled: Boolean(user.data) });
  const [form, setForm] = useState<FormState>(emptyForm);
  const [documents, setDocuments] = useState<OrdinationDocument[]>([]);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    const application = query.data?.application;
    if (!application || hydrated.current) return;
    hydrated.current = true;
    setForm({ ministryBackground: application.ministryBackground, callingStatement: application.callingStatement, proposedMinistry: application.proposedMinistry, additionalInformation: application.additionalInformation ?? "", informationAccurate: application.informationAccurate, codeOfConductAccepted: application.codeOfConductAccepted, backgroundCheckConsent: application.backgroundCheckConsent });
    setDocuments(application.documents ?? []);
  }, [query.data?.application]);

  if (user.isLoading || query.isLoading) return <LoadingState />;
  if (!user.data) return <OrdinationPageShell><State title="Sign in required" message="Sign in using your active Professional Chaplain member account to check ordination eligibility." href="/sign-in" action="Sign in" /></OrdinationPageShell>;
  if (query.isError) return <OrdinationPageShell><State title="Unable to load application" message="Your ordination eligibility could not be checked right now." /></OrdinationPageShell>;
  if (!query.data?.eligible) return <OrdinationPageShell><State title="Not currently eligible" message={query.data?.eligibilityReason ?? "Only active, approved Professional Chaplains may apply."} /></OrdinationPageShell>;

  const application = query.data.application;
  const editable = !application || ["DRAFT", "ADDITIONAL_INFORMATION_REQUIRED", "RETURNED_FOR_CORRECTION"].includes(application.status);
  const save = async (submit: boolean) => {
    setBusy(true);
    try {
      const payload = { ...form, additionalInformation: form.additionalInformation || null, documents };
      await (submit ? submitOrdinationApplication(payload) : saveOrdinationApplication(payload));
      toast({ title: submit ? "Application submitted" : "Draft saved", description: submit ? "Your application is ready for administrator review." : "You can return and complete it later.", variant: "success" });
      await query.refetch();
    } catch (error) {
      toast({ title: submit ? "Submission failed" : "Save failed", description: toApiError(error).message, variant: "error" });
    } finally { setBusy(false); }
  };
  const upload = async (type: OrdinationDocument["type"], file?: File) => {
    if (!file) return;
    setUploading(type);
    try {
      const item = await uploadOrdinationDocument(file);
      if (!item) throw new Error("Upload failed");
      setDocuments((current) => [...current.filter((document) => document.type !== type), { type, fileUrl: item.ufsUrl, fileName: item.name, mimeType: item.type }]);
      toast({ title: "Document uploaded", variant: "success" });
    } catch (error) {
      toast({ title: "Upload failed", description: error instanceof Error ? error.message : "Try again.", variant: "error" });
    } finally { setUploading(null); }
  };

  return <OrdinationPageShell>
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border border-black/10 bg-white p-5"><div><p className="text-sm text-neutral-500">Eligibility verified</p><h2 className="font-semibold text-[#032a0d]">Professional Chaplain</h2></div><Badge className="bg-[#032a0d] text-white hover:bg-[#032a0d]">{formatStatus(application?.status ?? "NEW_APPLICATION")}</Badge></div>
        {application?.requestedInformation ? <div className="flex gap-3 border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"><AlertCircle className="size-5 shrink-0 text-amber-700" /><div><p className="font-semibold">Administrator requested changes</p><p className="mt-1">{application.requestedInformation}</p></div></div> : null}
        {!editable ? <div className="border border-black/10 bg-white p-8 text-center"><CheckCircle2 className="mx-auto size-10 text-[#032a0d]" /><h2 className="mt-3 text-xl font-semibold">Application {formatStatus(application?.status ?? "").toLowerCase()}</h2><p className="mt-2 text-sm text-neutral-600">You will be notified when your review status changes.</p></div> : <form className="overflow-hidden border border-black/10 bg-white" onSubmit={(event) => { event.preventDefault(); void save(true); }}>
          <div className="bg-[#032a0d] px-5 py-4 text-white"><h2 className="text-lg">Ordination &amp; Commissioning Application</h2></div>
          <div className="space-y-8 p-5 sm:p-6">
            <FormSection title="Ministry Experience">
              <Field label="Christian ministry and chaplaincy experience" required hint="Include ministry role, church or community service, and relevant experience."><Textarea value={form.ministryBackground} onChange={(event) => setForm({ ...form, ministryBackground: event.target.value })} rows={7} minLength={50} required /></Field>
              <Field label="Current or proposed ministry assignment" required hint="Minimum 30 characters."><Textarea value={form.proposedMinistry} onChange={(event) => setForm({ ...form, proposedMinistry: event.target.value })} rows={5} minLength={30} required /></Field>
            </FormSection>
            <FormSection title="Calling and Commitment">
              <Field label="Calling and purpose for ordination" required hint="Explain why you are seeking ordination and commissioning as a chaplain."><Textarea value={form.callingStatement} onChange={(event) => setForm({ ...form, callingStatement: event.target.value })} rows={7} minLength={50} required /></Field>
              <Field label="Additional information" hint="Optional: include ministry training, educational background, or other relevant information."><Textarea value={form.additionalInformation} onChange={(event) => setForm({ ...form, additionalInformation: event.target.value })} rows={4} /></Field>
            </FormSection>
            <FormSection title="Required Documents">
              <p className="-mt-1 text-sm text-neutral-600">Upload PDF or image files up to 16 MB. Membership evidence and government ID / PSA birth certificate are required for submission.</p>
              <div className="grid gap-3 sm:grid-cols-2">{documentTypes.map(([type, label, required]) => {
                const document = documents.find((item) => item.type === type);
                return <label key={type} className="relative flex min-h-30 cursor-pointer flex-col justify-center border border-dashed border-[#032a0d]/25 p-4 transition-colors hover:bg-[#032a0d]/5"><Input type="file" accept="image/*,.pdf" className="sr-only" onChange={(event) => void upload(type, event.target.files?.[0])} /><span className="flex items-start gap-2 font-medium text-[#032a0d]"><Upload className="mt-0.5 size-4 shrink-0" />{label}{required ? <span className="text-red-600">*</span> : null}</span><span className="mt-2 truncate text-xs text-neutral-500">{uploading === type ? "Uploading..." : document?.fileName ?? "Choose file"}</span>{document ? <button type="button" className="absolute right-2 top-2 rounded p-1 hover:bg-black/5" aria-label={`Remove ${label}`} onClick={(event) => { event.preventDefault(); setDocuments((current) => current.filter((item) => item.type !== type)); }}><X className="size-4" /></button> : null}</label>;
              })}</div>
            </FormSection>
            <FormSection title="Applicant Declaration">
              <div className="space-y-4 text-sm text-neutral-700"><p>I affirm my commitment to serve God and humanity through chaplaincy ministry, and to uphold Pearl Chaplaincy values, ethics, policies, standards, professional boundaries, and lawful authority.</p><Declaration checked={form.informationAccurate} onCheckedChange={(checked) => setForm({ ...form, informationAccurate: checked })}>I certify that the information and documents are complete and accurate.</Declaration><Declaration checked={form.codeOfConductAccepted} onCheckedChange={(checked) => setForm({ ...form, codeOfConductAccepted: checked })}>I agree to uphold the organization&apos;s code of conduct and ordination standards.</Declaration><Declaration checked={form.backgroundCheckConsent} onCheckedChange={(checked) => setForm({ ...form, backgroundCheckConsent: checked })}>I consent to eligibility and background verification for this application.</Declaration></div>
            </FormSection>
            <div className="flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-neutral-500 sm:text-sm">Save a draft at any time. Required fields and documents must be complete before submission.</p><div className="flex flex-col gap-2 sm:flex-row"><Button type="button" variant="outline" disabled={busy || Boolean(uploading)} onClick={() => void save(false)}>Save draft</Button><Button type="submit" disabled={busy || Boolean(uploading) || documents.length < 2} className="bg-[#032a0d] hover:bg-[#032a0d]/90">{busy ? <Loader2 className="animate-spin" /> : <FileText />} Submit for review</Button></div></div>
          </div>
        </form>}
      </div>
      <OrdinationSidebar />
    </div>
  </OrdinationPageShell>;
}

function OrdinationPageShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  return <main className="bg-neutral-300 px-4 py-8 sm:py-10 lg:py-14"><div className="mx-auto max-w-7xl"><div className="mb-5 border border-black/10 bg-white px-5 py-5 sm:px-8 sm:py-6"><div className="flex items-center gap-4 sm:gap-6"><Image src="/main/logo.png" alt="Pearl of the Orient logo" width={100} height={100} className="size-16 sm:size-20" priority /><div className="min-w-0"><h1 className="font-serif text-xl text-neutral-900 sm:text-3xl">Chaplaincy Ministries</h1><p className="mt-1 text-xs text-neutral-600 sm:text-sm">Pearl of the Orient International Auxiliary Chaplain Values Educators Inc.</p></div><Button type="button" variant="outline" onClick={() => router.push("/")} className="ml-auto shrink-0 border-[#032a0d]/30 text-[#032a0d] hover:bg-[#032a0d]/5"><ArrowLeft className="size-4" /> Back</Button></div></div>{children}</div></main>;
}

function OrdinationSidebar() {
  return <aside className="self-start lg:sticky lg:top-6"><div className="overflow-hidden border border-black/10 bg-white"><div className="bg-[#032a0d] px-5 py-4 text-white"><h2 className="text-lg">Description</h2></div><div className="space-y-5 p-5 text-sm text-neutral-700"><p>Complete this application for ordination and commissioning review. Submission does not automatically grant ordination or commissioning.</p><div className="space-y-3"><h3 className="font-serif text-base text-[#032a0d]">How the application works</h3><ol className="space-y-2 text-xs sm:text-sm"><li><strong className="text-[#032a0d]">1. Eligibility review</strong> Your active Professional Chaplain membership is verified.</li><li><strong className="text-[#032a0d]">2. Ministry record</strong> Provide your experience, proposed service, and calling.</li><li><strong className="text-[#032a0d]">3. Documents and declaration</strong> Attach evidence and confirm your commitments.</li><li><strong className="text-[#032a0d]">4. Committee evaluation</strong> The ordination committee reviews your submission and contacts you about next steps.</li></ol></div><div className="space-y-3 border-t border-black/10 pt-5"><h3 className="font-serif text-base text-[#032a0d]">Requirements for Ordination &amp; CRASM</h3><ol className="space-y-2 text-xs sm:text-sm">{requirements.map((requirement, index) => <li key={requirement} className="flex gap-2"><span className="font-semibold text-[#032a0d]">{index + 1}.</span><span>{requirement}</span></li>)}</ol></div><Notice icon={<Info className="size-4 shrink-0" />}>Your progress is saved as a draft when you use <strong>Save draft</strong>.</Notice><Notice icon={<ShieldCheck className="size-4 shrink-0" />}>Fields marked with an asterisk (<span className="text-red-600">*</span>) and the two required document types must be completed before submission.</Notice></div></div></aside>;
}

function FormSection({ title, children }: { title: string; children: ReactNode }) { return <section className="space-y-4"><h3 className="font-serif text-xl text-[#032a0d]">{title}</h3><div className="h-px bg-black/10" />{children}</section>; }
function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) { return <label className="block space-y-1.5 text-sm"><span className="font-medium text-[#032a0d]">{label}{required ? <span className="ml-0.5 text-red-600">*</span> : null}</span>{children}{hint ? <span className="block text-xs text-neutral-500">{hint}</span> : null}</label>; }
function Declaration({ checked, onCheckedChange, children }: { checked: boolean; onCheckedChange: (checked: boolean) => void; children: ReactNode }) { return <label className="flex items-start gap-3"><Checkbox checked={checked} onCheckedChange={(value) => onCheckedChange(value === true)} /><span>{children}</span></label>; }
function Notice({ icon, children }: { icon: ReactNode; children: ReactNode }) { return <div className="flex gap-2 border border-dashed border-[#032a0d]/25 bg-[#032a0d]/5 px-3 py-3 text-xs text-[#032a0d]/80">{icon}<p>{children}</p></div>; }
function LoadingState() { return <main className="flex min-h-96 items-center justify-center bg-neutral-100"><Loader2 className="size-7 animate-spin text-[#032a0d]" /></main>; }
function State({ title, message, href, action }: { title: string; message: string; href?: string; action?: string }) { return <div className="border border-black/10 bg-white p-8 text-center"><AlertCircle className="mx-auto size-10 text-amber-700" /><h2 className="mt-4 text-2xl font-semibold text-[#032a0d]">{title}</h2><p className="mt-2 text-sm text-neutral-600">{message}</p>{href ? <Button asChild className="mt-6 bg-[#032a0d] hover:bg-[#032a0d]/90"><Link href={href}>{action}</Link></Button> : null}</div>; }
function formatStatus(status: string) { return status.split("_").filter(Boolean).map((word) => word.charAt(0) + word.slice(1).toLowerCase()).join(" "); }
