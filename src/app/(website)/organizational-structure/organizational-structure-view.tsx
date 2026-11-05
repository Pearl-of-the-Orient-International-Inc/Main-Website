"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, MapPin, Network, UserRound } from "lucide-react";
import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  formatMemberType,
  formatPublishedOfficerName,
  type PublicOffice,
} from "@/lib/public-organizational-structure";

type OfficeChartCard = {
  office: PublicOffice;
  officer: PublicOffice["officers"][number] | null;
  displayTitle: string;
};
type OfficeFlowNode = Node<OfficeChartCard, "office">;

const OFFICE_CARD_WIDTH = 220;
const OFFICE_CARD_HEIGHT = 188;
const HORIZONTAL_GAP = 72;
const VERTICAL_GAP = 112;

const nodeTypes = { office: OfficeFlowCard };

export function OrganizationalStructureView({
  offices,
}: {
  offices: PublicOffice[];
}) {
  const [selected, setSelected] = useState<PublicOffice | null>(null);
  const chart = useMemo(() => buildOrganizationChart(offices), [offices]);

  return (
    <main className="bg-[#f7f8f5] py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <Badge className="mb-3 bg-[#032a0d] text-white">
            Approved public directory
          </Badge>
          <h2 className="font-serif text-3xl text-[#032a0d] sm:text-4xl">
            Leadership and reporting lines
          </h2>
          <p className="mt-3 leading-relaxed text-neutral-600">
            Select an office to view its published mandate and current public
            officers. Private and inactive assignments are not displayed.
          </p>
        </div>
      </div>
      {offices.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-dashed bg-white py-14 text-center">
            <CardContent>
              <Network className="mx-auto mb-4 size-10 text-[#032a0d]/50" />
              <h3 className="text-lg font-semibold text-[#032a0d]">
                No structure has been published yet
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Approved organizational information will appear here once
                published by an administrator.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
          <div className="h-[calc(100vh-4rem)] min-h-155 w-full overflow-hidden border-y border-[#032a0d]/10 bg-background">
            <ReactFlow
              nodes={chart.nodes}
              edges={chart.edges}
              nodeTypes={nodeTypes}
              onNodeClick={(_, node) =>
                setSelected((node as OfficeFlowNode).data.office)
              }
              fitView
              fitViewOptions={{ padding: 0.50 }}
              minZoom={0.2}
              maxZoom={1.5}
              nodesConnectable={false}
              nodesDraggable
              panOnDrag
              zoomOnScroll
              zoomOnPinch
              proOptions={{ hideAttribution: true }}
            >
              <Background gap={18} size={1} color="#dce7dc" />
              <Controls position="top-left" showInteractive />
            </ReactFlow>
          </div>
      )}
      <OfficeSheet
        office={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </main>
  );
}

function OfficeFlowCard({ data }: NodeProps<OfficeFlowNode>) {
  const { officer, displayTitle } = data;
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="size-1! border-0! bg-transparent! opacity-0!"
      />
      <div className="relative h-47 w-55 pt-9">
        {officer ? (
          <Avatar className="absolute left-1/2 top-1 z-10 size-16 -translate-x-1/2 border-2 border-[#4a4a4a] bg-white shadow-sm">
            {officer.avatar && (
              <AvatarImage
                src={officer.avatar}
                alt={officer.name}
                className="object-cover"
              />
            )}
            <AvatarFallback className="bg-[#edf4ed] text-[#032a0d]">
              <UserRound className="size-7" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="absolute left-1/2 top-1 z-10 flex size-16 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#4a4a4a] bg-[#edf4ed] text-[#032a0d] shadow-sm">
            <Building2 className="size-7" />
          </div>
        )}
      <div className="flex h-37.5 flex-col items-center rounded-md border border-[#777] border-t-4 border-t-[#4a4a4a] bg-white px-4 pt-12 text-center shadow-sm transition hover:border-[#032a0d] hover:shadow-md">
          <p className="line-clamp-1 text-sm font-medium text-[#333]">
            {officer ? formatPublishedOfficerName(officer.name, officer.currentPositionRole) : "Vacant position"}
          </p>
          {officer && (
            <p className="mt-1 text-[11px] leading-snug text-[#56725b]">
              {formatMemberType(officer.memberType)}
            </p>
          )}
          <p className="mt-2 line-clamp-2 text-xs font-bold italic leading-snug text-[#333]">
            {displayTitle}
          </p>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="size-1! border-0! bg-transparent! opacity-0!"
      />
    </>
  );
}

function buildOrganizationChart(offices: PublicOffice[]) {
  const nodes: OfficeFlowNode[] = [];
  const edges: Edge[] = [];
  const officeById = new Map(offices.map((office) => [office.id, office]));
  const depthByOfficeId = new Map<string, number>();
  const getDepth = (office: PublicOffice, ancestry = new Set<string>()): number => {
    const cached = depthByOfficeId.get(office.id);
    if (cached !== undefined) return cached;
    if (!office.reportsToId || ancestry.has(office.id)) {
      depthByOfficeId.set(office.id, 0);
      return 0;
    }
    const parent = officeById.get(office.reportsToId);
    const depth = parent ? getDepth(parent, new Set(ancestry).add(office.id)) + 1 : 0;
    depthByOfficeId.set(office.id, depth);
    return depth;
  };

  const cardsByOfficeId = new Map<string, OfficeFlowNode[]>();
  const cardsByDepth = new Map<number, OfficeFlowNode[]>();

  for (const office of [...offices].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))) {
    const officers = office.officers.length ? office.officers : [null];
    const officeCards = officers.map((officer) => ({
      id: officer ? `assignment-${officer.id}` : `office-${office.id}`,
      type: "office" as const,
      position: { x: 0, y: 0 },
      data: {
        office,
        officer,
        displayTitle: officer?.scopeLabel ? `${office.name} • ${officer.scopeLabel}` : office.name,
      },
    }));
    cardsByOfficeId.set(office.id, officeCards);
    const depth = getDepth(office);
    cardsByDepth.set(depth, [...(cardsByDepth.get(depth) ?? []), ...officeCards]);
  }

  for (const [depth, cards] of cardsByDepth.entries()) {
    cards.forEach((card, index) => {
      card.position = {
        x: (index - (cards.length - 1) / 2) * (OFFICE_CARD_WIDTH + HORIZONTAL_GAP),
        y: depth * (OFFICE_CARD_HEIGHT + VERTICAL_GAP),
      };
      nodes.push(card);
    });
  }

  for (const office of offices) {
    if (!office.reportsToId) continue;
    const parentCards = cardsByOfficeId.get(office.reportsToId) ?? [];
    const childCards = cardsByOfficeId.get(office.id) ?? [];
    if (!parentCards.length) continue;
    childCards.forEach((child, index) => {
      const parent = parentCards[index % parentCards.length];
      edges.push({
        id: `${parent.id}-${child.id}`,
        source: parent.id,
        target: child.id,
        type: "smoothstep",
        animated: false,
        style: { stroke: "#6f8e74", strokeWidth: 1.5 },
      });
    });
  }

  return { nodes, edges };
}

function OfficeSheet({
  office,
  onOpenChange,
}: {
  office: PublicOffice | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={Boolean(office)} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-xl"
      >
        {office && (
          <>
            <SheetHeader className="border-b border-[#032a0d]/10 px-6 py-6 pr-14">
              <SheetTitle className="font-serif text-3xl text-[#032a0d]">
                {office.name}
              </SheetTitle>
              <SheetDescription>{formatLevel(office.level)}</SheetDescription>
            </SheetHeader>
            <div className="space-y-6 px-6 py-6">
              {office.description && (
                <p className="leading-relaxed text-neutral-700">
                  {office.description}
                </p>
              )}
              <div className="space-y-3">
                <h3 className="font-semibold text-[#032a0d]">
                  Published officers
                </h3>
                {office.officers.length ? (
                  office.officers.map((officer) => (
                    <Link
                      key={officer.id}
                      href={`/profile/${officer.memberId}`}
                      className="flex items-center gap-3 rounded-lg border p-3 transition hover:bg-neutral-50"
                    >
                      <Avatar className="size-11 border">
                        {officer.avatar && (
                          <AvatarImage
                            src={officer.avatar}
                            alt={officer.name}
                            className="object-cover"
                          />
                        )}
                        <AvatarFallback>
                          <UserRound className="size-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                  <p className="font-medium">{formatPublishedOfficerName(officer.name, officer.currentPositionRole)}</p>
                        {officer.jurisdiction && (
                          <p className="flex items-center gap-1 text-xs text-neutral-500">
                            <MapPin className="size-3" />
                            {officer.jurisdiction}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">
                    No officer is currently published for this office.
                  </p>
                )}
              </div>
              {office.sections?.map((section) => (
                <section
                  key={section.id ?? section.title}
                  className="border-t pt-5"
                >
                  <h3 className="mb-2 font-semibold text-[#032a0d]">
                    {section.title}
                  </h3>
                  {section.type === "richtext" ? (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: section.content ?? "",
                      }}
                    />
                  ) : (
                    <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
                      {(section.items ?? []).map((item) => (
                        <li key={item.id ?? item.content}>{item.content}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function formatLevel(level: string) {
  return level
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}
