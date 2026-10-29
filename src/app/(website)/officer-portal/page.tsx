"use client";

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FileText, Loader2, MapPin, Search, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';
import { AuthGuard } from '@/components/providers/AuthGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCurrentUserQuery } from '@/features/auth/auth.hooks';
import { toApiError } from '@/lib/http-client';
import { getOfficerMemos, getOfficerScope, getScopedMembers } from '@/features/officer-portal/officer-portal.api';

function OfficerPortalContent() {
  const { data: user, isLoading: isUserLoading } = useCurrentUserQuery();
  const [search, setSearch] = useState('');
  const scopeQuery = useQuery({ queryKey: ['officer', 'scope'], queryFn: getOfficerScope, enabled: user?.role === 'OFFICER' });
  const membersQuery = useQuery({ queryKey: ['officer', 'members', search], queryFn: () => getScopedMembers(search), enabled: Boolean(scopeQuery.data) });
  const memosQuery = useQuery({ queryKey: ['officer', 'memos'], queryFn: getOfficerMemos, enabled: Boolean(scopeQuery.data) });

  const scopeLabels = useMemo(
    () => (scopeQuery.data?.assignments ?? []).map((assignment) =>
      [assignment.officeTitle.name, assignment.region, assignment.province, assignment.cityMunicipality, assignment.barangay]
        .filter(Boolean)
        .join(' · '),
    ),
    [scopeQuery.data?.assignments],
  );

  if (isUserLoading) return <div className="flex min-h-[70vh] items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 size-4 animate-spin" />Checking your account…</div>;
  if (user?.role !== 'OFFICER') return <OfficerAccessState />;
  if (scopeQuery.isError) return <OfficerAccessState accessEnded message={toApiError(scopeQuery.error).message} />;

  return <main className="mx-auto max-w-7xl space-y-6 px-4 py-24 sm:px-6">
    <section className="space-y-2"><p className="text-sm font-medium text-[#032a0d]">Officer workspace</p><h1 className="text-3xl font-semibold">Scoped member coordination</h1><p className="text-muted-foreground">Your members and memo recipients are determined by your current active office assignment.</p></section>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="size-5" />Your authorized scope</CardTitle><CardDescription>Access updates immediately when an administrator changes your assignment.</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-2">{scopeLabels.map((label) => <span key={label} className="rounded-full border bg-muted px-3 py-1.5 text-sm">{label}</span>)}</CardContent></Card>
    <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Users className="size-5" />Scoped members {membersQuery.data ? `(${membersQuery.data.pagination.totalCount})` : ''}</CardTitle><CardDescription>Only active, approved members within your authorized locations appear here.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search name or member ID" /></div>{membersQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading members…</p> : <div className="divide-y rounded-md border">{(membersQuery.data?.data ?? []).map((member) => <div className="p-3" key={member.id}><p className="font-medium">{[member.firstName, member.middleInitial, member.lastName, member.extensionName].filter(Boolean).join(' ')}</p><p className="text-xs text-muted-foreground">{member.uniqueId ?? 'No member ID'} · {[member.region, member.province, member.municipalityCity, member.barangay].filter(Boolean).join(', ')}</p></div>)}{!membersQuery.data?.data.length && <p className="p-4 text-sm text-muted-foreground">No scoped members found.</p>}</div>}</CardContent></Card>
      <div className="space-y-6"><Card><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="size-5" />Create memo</CardTitle><CardDescription>Use the full document editor and template, just like the administrator memo workflow. Your recipients remain automatically scoped.</CardDescription></CardHeader><CardContent><Button asChild className="w-full"><Link href="/officer-portal/memo/create">Open memo editor</Link></Button></CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="size-5" />My memo submissions</CardTitle></CardHeader><CardContent className="space-y-3">{memosQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : (memosQuery.data ?? []).slice(0, 6).map((memo) => <div key={memo.id} className="rounded-md border p-3"><p className="font-medium">{memo.title}</p><p className="text-xs text-muted-foreground">{memo.referenceNumber} · {memo.status} · {memo.recipients.length} recipients</p></div>)}{!memosQuery.data?.length && <p className="text-sm text-muted-foreground">No memo submissions yet.</p>}</CardContent></Card></div>
    </div>
  </main>;
}

export default function OfficerPortalPage() { return <AuthGuard><OfficerPortalContent /></AuthGuard>; }

function OfficerAccessState({
  accessEnded = false,
  message,
}: {
  accessEnded?: boolean;
  message?: string;
}) {
  const title = accessEnded ? 'Officer access is no longer active' : 'Officer workspace';
  const description = accessEnded
    ? message || 'Your office assignment is no longer active. Your normal member account remains available.'
    : 'This workspace becomes available when an administrator gives your member account an active officer assignment.';

  return (
    <main className="relative isolate flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-[#f6f8f5] px-4 py-16 sm:px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(16,91,43,0.14),transparent_32%),radial-gradient(circle_at_85%_85%,rgba(190,151,67,0.16),transparent_30%)]" />
      <section className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-[#0b4d24]/15 bg-white shadow-[0_24px_70px_rgba(3,42,13,0.14)]">
        <div className="bg-[#032a0d] px-7 py-8 text-white sm:px-10 sm:py-10">
          <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20">
            <ShieldCheck className="size-6" />
          </span>
          <p className="text-sm font-medium tracking-[0.18em] text-amber-200 uppercase">Member account</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">{title}</h1>
        </div>
        <div className="space-y-7 px-7 py-8 sm:px-10 sm:py-10">
          <p className="max-w-xl text-base leading-7 text-slate-600">{description}</p>
          <div className="rounded-2xl border border-[#0b4d24]/10 bg-[#f5f8f4] p-5">
            <p className="font-medium text-[#032a0d]">What you can do now</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">You can continue using your personal account, profile, bookings, applications, certifications, and other member services.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#032a0d] px-5 text-sm font-medium text-white transition-colors hover:bg-[#064d18]">
              <ArrowLeft className="size-4" />Back to home
            </Link>
            <Link href="/my-bookings" className="inline-flex h-11 items-center justify-center rounded-xl border border-[#032a0d]/20 px-5 text-sm font-medium text-[#032a0d] transition-colors hover:bg-[#f3f7f2]">
              Open my member services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
