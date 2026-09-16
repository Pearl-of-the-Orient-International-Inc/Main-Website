"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, MapPin, Network, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type PublicOfficeSection = { id?: string; title: string; type: "list" | "richtext"; items?: { id?: string; content: string }[]; content?: string };
export type PublicOffice = {
  id: string; name: string; level: string; description: string | null;
  sections: PublicOfficeSection[]; sortOrder: number; reportsToId: string | null;
  officers: { id: string; memberId: string; name: string; avatar: string | null; jurisdiction: string | null; startDate: string }[];
};

export function OrganizationalStructureView({ offices }: { offices: PublicOffice[] }) {
  const [selected, setSelected] = useState<PublicOffice | null>(null);
  const officeIds = useMemo(() => new Set(offices.map((office) => office.id)), [offices]);
  const childrenByParent = useMemo(() => {
    const map = new Map<string, PublicOffice[]>();
    for (const office of offices) {
      if (!office.reportsToId || !officeIds.has(office.reportsToId)) continue;
      map.set(office.reportsToId, [...(map.get(office.reportsToId) ?? []), office]);
    }
    return map;
  }, [officeIds, offices]);
  const roots = offices.filter((office) => !office.reportsToId || !officeIds.has(office.reportsToId));

  return (
    <main className="bg-[#f7f8f5] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <Badge className="mb-3 bg-[#032a0d] text-white">Approved public directory</Badge>
          <h2 className="font-serif text-3xl text-[#032a0d] sm:text-4xl">Leadership and reporting lines</h2>
          <p className="mt-3 leading-relaxed text-neutral-600">Select an office to view its published mandate and current public officers. Private and inactive assignments are not displayed.</p>
        </div>
        {roots.length === 0 ? (
          <Card className="border-dashed bg-white py-14 text-center"><CardContent>
            <Network className="mx-auto mb-4 size-10 text-[#032a0d]/50" />
            <h3 className="text-lg font-semibold text-[#032a0d]">No structure has been published yet</h3>
            <p className="mt-2 text-sm text-neutral-600">Approved organizational information will appear here once published by an administrator.</p>
          </CardContent></Card>
        ) : (
          <div className="space-y-8">{roots.map((office) => (
            <OfficeBranch key={office.id} office={office} childrenByParent={childrenByParent} onSelect={setSelected} visited={new Set()} />
          ))}</div>
        )}
      </div>
      <OfficeDialog office={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </main>
  );
}

function OfficeBranch({ office, childrenByParent, onSelect, visited }: { office: PublicOffice; childrenByParent: Map<string, PublicOffice[]>; onSelect: (office: PublicOffice) => void; visited: Set<string> }) {
  if (visited.has(office.id)) return null;
  const nextVisited = new Set(visited).add(office.id);
  const children = childrenByParent.get(office.id) ?? [];
  return <section className="relative">
    <button type="button" onClick={() => onSelect(office)} className="mx-auto block w-full max-w-xl text-left"><OfficeCard office={office} /></button>
    {children.length > 0 && <div className="relative mt-8 grid gap-6 before:absolute before:-top-8 before:left-1/2 before:h-8 before:w-px before:bg-[#032a0d]/25 md:grid-cols-2 xl:grid-cols-3">
      {children.map((child) => <div key={child.id} className="relative before:absolute before:-top-4 before:left-1/2 before:h-4 before:w-px before:bg-[#032a0d]/25">
        <OfficeBranch office={child} childrenByParent={childrenByParent} onSelect={onSelect} visited={nextVisited} />
      </div>)}
    </div>}
  </section>;
}

function OfficeCard({ office }: { office: PublicOffice }) {
  const lead = office.officers[0];
  return <Card className="h-full overflow-hidden border-neutral-200 bg-white transition hover:-translate-y-0.5 hover:border-[#032a0d]/40 hover:shadow-lg">
    <CardHeader className="border-b bg-[#032a0d] text-white">
      <div className="mb-2 flex items-center justify-between gap-3"><Building2 className="size-5" /><span className="text-[11px] uppercase tracking-wider text-white/70">{formatLevel(office.level)}</span></div>
      <CardTitle className="text-xl">{office.name}</CardTitle>
    </CardHeader>
    <CardContent className="pt-5">{lead ? <div className="flex items-center gap-3">
      <Avatar className="size-12 border">{lead.avatar && <AvatarImage src={lead.avatar} alt={lead.name} className="object-cover" />}<AvatarFallback><UserRound className="size-5" /></AvatarFallback></Avatar>
      <div className="min-w-0"><p className="truncate font-semibold text-[#032a0d]">{lead.name}</p><p className="text-xs text-neutral-500">{office.officers.length > 1 ? `and ${office.officers.length - 1} other officer(s)` : "Current officer"}</p></div>
    </div> : <p className="text-sm text-neutral-500">No officer is currently published.</p>}</CardContent>
  </Card>;
}

function OfficeDialog({ office, onOpenChange }: { office: PublicOffice | null; onOpenChange: (open: boolean) => void }) {
  return <Dialog open={Boolean(office)} onOpenChange={onOpenChange}><DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">{office && <>
    <DialogHeader><DialogTitle className="font-serif text-2xl text-[#032a0d]">{office.name}</DialogTitle><DialogDescription>{formatLevel(office.level)}</DialogDescription></DialogHeader>
    {office.description && <p className="leading-relaxed text-neutral-700">{office.description}</p>}
    <div className="space-y-3"><h3 className="font-semibold text-[#032a0d]">Published officers</h3>
      {office.officers.length ? office.officers.map((officer) => <Link key={officer.id} href={`/profile/${officer.memberId}`} className="flex items-center gap-3 rounded-lg border p-3 transition hover:bg-neutral-50">
        <Avatar className="size-11 border">{officer.avatar && <AvatarImage src={officer.avatar} alt={officer.name} className="object-cover" />}<AvatarFallback><UserRound className="size-4" /></AvatarFallback></Avatar>
        <div><p className="font-medium">{officer.name}</p>{officer.jurisdiction && <p className="flex items-center gap-1 text-xs text-neutral-500"><MapPin className="size-3" />{officer.jurisdiction}</p>}</div>
      </Link>) : <p className="text-sm text-neutral-500">No officer is currently published for this office.</p>}
    </div>
    {office.sections?.map((section) => <section key={section.id ?? section.title} className="border-t pt-4"><h3 className="mb-2 font-semibold text-[#032a0d]">{section.title}</h3>
      {section.type === "richtext" ? <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: section.content ?? "" }} /> : <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">{(section.items ?? []).map((item) => <li key={item.id ?? item.content}>{item.content}</li>)}</ul>}
    </section>)}
  </>}</DialogContent></Dialog>;
}

function formatLevel(level: string) { return level.split("_").map((part) => part.charAt(0) + part.slice(1).toLowerCase()).join(" "); }
