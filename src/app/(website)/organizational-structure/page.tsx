"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";
import { InfoIcon } from 'lucide-react';

// Office data structure
interface OfficeData {
  title: string;
  head: string;
  image?: string;
  description: string;
  duties: string[];
  responsibilities: string[];
}

// Mock data for offices (you can replace this with real data)
const officesData: Record<string, OfficeData> = {
  "chief-chaplain": {
    title: "Chief Chaplain",
    head: "Bishop Dr. Rodel Manzo",
    image: "/officers/Manzo.png",
    description:
      "The Chief Chaplain provides overall spiritual leadership and strategic direction for the organization.",
    duties: [
      "Oversee all chaplaincy operations",
      "Provide spiritual guidance to leadership",
      "Represent the organization in official matters",
      "Ensure quality of chaplaincy services",
    ],
    responsibilities: [
      "Strategic planning and vision setting",
      "Leadership development and mentoring",
      "Stakeholder relations and partnerships",
      "Policy formulation and implementation",
    ],
  },
  "general-secretary": {
    title: "General Secretary",
    head: "[Name]",
    description:
      "The General Secretary manages administrative operations and coordinates between departments.",
    duties: [
      "Coordinate departmental activities",
      "Manage organizational communications",
      "Maintain official records and documents",
      "Support the Chief Chaplain in operations",
    ],
    responsibilities: [
      "Administrative oversight",
      "Meeting coordination and minutes",
      "Documentation and record keeping",
      "Inter-departmental communication",
    ],
  },
  "legal-adviser": {
    title: "Legal Adviser",
    head: "Atty. [Name]",
    description:
      "The Legal Adviser provides legal counsel and ensures compliance with all regulations.",
    duties: [
      "Provide legal advice and counsel",
      "Review contracts and agreements",
      "Ensure regulatory compliance",
      "Handle legal matters and disputes",
    ],
    responsibilities: [
      "Legal risk assessment",
      "Contract negotiation and review",
      "Compliance monitoring",
      "Legal documentation",
    ],
  },
  "school-chaplaincy": {
    title: "School Chaplaincy",
    head: "[Name]",
    description:
      "Provides spiritual support and guidance within educational institutions.",
    duties: [
      "Conduct spiritual programs in schools",
      "Provide counseling to students and staff",
      "Organize religious activities",
      "Support school community spiritual needs",
    ],
    responsibilities: [
      "Student spiritual development",
      "Faculty and staff support",
      "Program development and implementation",
      "Partnership with school administration",
    ],
  },
  "training-seminars": {
    title: "Training and Seminars",
    head: "[Name]",
    description:
      "Organizes and conducts training programs and seminars for chaplains and members.",
    duties: [
      "Develop training curricula",
      "Organize seminars and workshops",
      "Coordinate with trainers and speakers",
      "Evaluate training effectiveness",
    ],
    responsibilities: [
      "Capacity building programs",
      "Resource material development",
      "Training schedule management",
      "Participant assessment and feedback",
    ],
  },
  "human-resource": {
    title: "Human Resource",
    head: "[Name]",
    description:
      "Manages personnel matters, recruitment, and staff development.",
    duties: [
      "Handle recruitment and onboarding",
      "Manage employee records",
      "Oversee performance evaluations",
      "Address personnel concerns",
    ],
    responsibilities: [
      "Staff hiring and retention",
      "Benefits and compensation management",
      "Employee development programs",
      "HR policy implementation",
    ],
  },
  "information-technology": {
    title: "Information Technology",
    head: "[Name]",
    description:
      "Maintains and develops the organization's technology infrastructure and systems.",
    duties: [
      "Manage IT infrastructure",
      "Provide technical support",
      "Develop and maintain systems",
      "Ensure data security",
    ],
    responsibilities: [
      "Technology strategy and planning",
      "System maintenance and upgrades",
      "Cybersecurity management",
      "Digital transformation initiatives",
    ],
  },
  accounting: {
    title: "Accounting",
    head: "[Name]",
    description:
      "Manages financial records, reporting, and ensures fiscal responsibility.",
    duties: [
      "Process financial transactions",
      "Prepare financial reports",
      "Manage accounts payable/receivable",
      "Conduct budget monitoring",
    ],
    responsibilities: [
      "Financial record keeping",
      "Budget preparation and monitoring",
      "Financial compliance",
      "Audit coordination",
    ],
  },
  // Add more offices as needed...
};

const Page = () => {
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOfficeClick = (officeKey: string) => {
    setSelectedOffice(officeKey);
    setDialogOpen(true);
  };

  const currentOfficeData = selectedOffice
    ? officesData[selectedOffice]
    : null;

  return (
    <div className="">
      {/* Hero / Banner */}
      <section className="relative bg-[#032a0d] text-white">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-40" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 mt-10">
          <p className="text-xs sm:text-sm text-white/70 mb-2">
            <Link href="/">Home</Link>{" "}
            <span className="mx-1 sm:mx-2 text-white/50">/</span>{" "}
            <span className="font-medium text-white">
              Organizational Structure
            </span>
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide">
            Organizational Structure
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/80 leading-relaxed">
            This page presents the organizational structure of Pearl of the
            Orient International Auxiliary Chaplain Values Educators Inc.,
            highlighting the key leadership roles, ministry services,
            administrative offices, church and ministerial work, and partner
            organizations that support our chaplaincy mission.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Visual Organizational Chart */}
          <div className="mb-12 sm:mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#032a0d] mb-6 sm:mb-8 text-center">
              Organizational Chart
            </h2>
            <div className='flex text-sm text-destructive justify-center items-center gap-2 mb-10'>
              <InfoIcon className='size-4' />
              <p>Click on any office to view details</p>
            </div>

            <div>
              <div className="min-w-200">
                {/* Chief Chaplain - Top Level */}
                <div className="flex justify-center mb-8">
                  <button
                    onClick={() => handleOfficeClick("chief-chaplain")}
                    className="bg-white border-2 border-[#032a0d] rounded-lg px-6 py-3 font-semibold text-sm text-center shadow-md hover:bg-[#032a0d] hover:text-white transition-colors cursor-pointer"
                  >
                    CHIEF CHAPLAIN
                  </button>
                </div>

                {/* Connecting Line */}
                <div className="flex justify-center mb-8">
                  <div className="w-0.5 h-8 bg-[#032a0d]"></div>
                </div>

                {/* Second Level - General Secretary & Legal Adviser */}
                <div className="flex justify-center gap-8 mb-8">
                  <div className="flex-1 max-w-50">
                    <button
                      onClick={() => handleOfficeClick("general-secretary")}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-xs font-semibold text-center shadow-sm hover:bg-[#032a0d] hover:text-white hover:border-[#032a0d] transition-colors cursor-pointer"
                    >
                      GENERAL SECRETARY
                    </button>
                  </div>
                  <div className="flex-1 max-w-50">
                    <button
                      onClick={() => handleOfficeClick("legal-adviser")}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-xs font-semibold text-center shadow-sm hover:bg-[#032a0d] hover:text-white hover:border-[#032a0d] transition-colors cursor-pointer"
                    >
                      LEGAL ADVISER
                    </button>
                  </div>
                </div>

                {/* Connecting Line */}
                <div className="flex justify-center mb-8">
                  <div className="w-0.5 h-8 bg-[#032a0d]"></div>
                </div>

                {/* Third Level - Main Departments */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  <div>
                    <div className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-semibold text-center shadow-sm">
                      MINISTRY/SERVICES
                    </div>
                  </div>
                  <div>
                    <div className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-semibold text-center shadow-sm">
                      ADMINISTRATION
                    </div>
                  </div>
                  <div>
                    <div className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-semibold text-center shadow-sm whitespace-nowrap">
                      National Director & Deputy Director
                    </div>
                  </div>
                  <div>
                    <div className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-semibold text-center shadow-sm">
                      CHURCHES/MINISTERIAL
                    </div>
                  </div>
                  <div>
                    <div className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-semibold text-center shadow-sm">
                      PARTNERS-NGO
                    </div>
                  </div>
                </div>

                {/* Fourth Level - Sub-departments */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Ministry/Services Column */}
                  <div className="space-y-2">
                    {[
                      { label: "School Chaplaincy", key: "school-chaplaincy" },
                      {
                        label: "Training and Seminars",
                        key: "training-seminars",
                      },
                      {
                        label: "Follow Up Visitation",
                        key: "follow-up-visitation",
                      },
                      { label: "Community", key: "community" },
                      { label: "Ordination", key: "ordination" },
                      {
                        label: "Devotion & Bible Study",
                        key: "devotion-bible-study",
                      },
                      { label: "Pastoral Care", key: "pastoral-care" },
                      {
                        label: "Solemnize Marriage",
                        key: "solemnize-marriage",
                      },
                      {
                        label: "Pastoral Counseling",
                        key: "pastoral-counseling",
                      },
                      {
                        label: "Spiritual Enhancement",
                        key: "spiritual-enhancement",
                      },
                      {
                        label: "Moral Values & Spiritual Upliftment",
                        key: "moral-values",
                      },
                      {
                        label: "House/Company Blessing",
                        key: "house-blessing",
                      },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => handleOfficeClick(item.key)}
                        className="w-full bg-white border border-neutral-200 rounded px-2 py-1.5 text-[10px] text-center hover:bg-[#032a0d] hover:text-white hover:border-[#032a0d] transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Administration Column */}
                  <div className="space-y-2">
                    {[
                      { label: "Human Resource", key: "human-resource" },
                      {
                        label: "Information Technology",
                        key: "information-technology",
                      },
                      { label: "Accounting", key: "accounting" },
                      { label: "Logistic", key: "logistic" },
                      { label: "Maintenance", key: "maintenance" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => handleOfficeClick(item.key)}
                        className="w-full bg-white border border-neutral-200 rounded px-2 py-1.5 text-[10px] text-center hover:bg-[#032a0d] hover:text-white hover:border-[#032a0d] transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* National Director Column */}
                  <div className="space-y-2">
                    {[
                      {
                        label: "Regional Director & Director",
                        key: "regional-director",
                      },
                      {
                        label: "Provincial Director & Director",
                        key: "provincial-director",
                      },
                      {
                        label: "City & Municipality Chaplain & Deputy Chaplain",
                        key: "city-chaplain",
                      },
                      {
                        label: "Barangay Chaplain & Deputy Chaplain",
                        key: "barangay-chaplain",
                      },
                      { label: "Member", key: "member" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => handleOfficeClick(item.key)}
                        className="w-full bg-white border border-neutral-200 rounded px-2 py-1.5 text-[10px] text-center hover:bg-[#032a0d] hover:text-white hover:border-[#032a0d] transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Churches/Ministerial Column */}
                  <div className="space-y-2">
                    <div className="bg-white border border-neutral-200 rounded px-2 py-1.5 text-[10px] font-semibold text-center">
                      Education
                    </div>
                    {[
                      { label: "Humanitarian", key: "humanitarian" },
                      {
                        label: "Political Affairs & Communication",
                        key: "political-affairs",
                      },
                      {
                        label: "Training & Development",
                        key: "training-development",
                      },
                      {
                        label: "Social Welfare & Development",
                        key: "social-welfare",
                      },
                      { label: "Human Resources", key: "human-resources-min" },
                      {
                        label: "Membership & Recruitment",
                        key: "membership-recruitment",
                      },
                      { label: "Prison Ministry", key: "prison-ministry" },
                      { label: "School/Colleges", key: "school-colleges" },
                      { label: "Security Group", key: "security-group" },
                      { label: "PNP", key: "pnp" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => handleOfficeClick(item.key)}
                        className="w-full bg-white border border-neutral-200 rounded px-2 py-1.5 text-[10px] text-center hover:bg-[#032a0d] hover:text-white hover:border-[#032a0d] transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                    <div className="bg-white border border-neutral-200 rounded px-2 py-1.5 text-[10px] font-semibold text-center mt-2">
                      Operation
                    </div>
                    <button
                      onClick={() => handleOfficeClick("sport")}
                      className="w-full bg-white border border-neutral-200 rounded px-2 py-1.5 text-[10px] text-center hover:bg-[#032a0d] hover:text-white hover:border-[#032a0d] transition-colors cursor-pointer"
                    >
                      Sport
                    </button>
                  </div>

                  {/* Partners-NGO Column */}
                  <div className="space-y-2">
                    <div className="bg-white border border-neutral-200 rounded px-2 py-1.5 text-[10px] font-semibold text-center">
                      WCEA
                    </div>
                    {[
                      { label: "JSL Group of company", key: "jsl-group" },
                      {
                        label: "AYAAN Enterprises Corporation",
                        key: "ayaan-enterprises",
                      },
                      {
                        label: "L.A.A Health Talk with Dr. Larry",
                        key: "laa-health",
                      },
                      {
                        label: "Natural Bone Restoration",
                        key: "natural-bone",
                      },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => handleOfficeClick(item.key)}
                        className="w-full bg-white border border-neutral-200 rounded px-2 py-1.5 text-[10px] text-center hover:bg-[#032a0d] hover:text-white hover:border-[#032a0d] transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dialog for Office Details */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-2xl! max-h-[90vh] overflow-y-auto">
              {currentOfficeData && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-serif text-[#032a0d]">
                      {currentOfficeData.title}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      {currentOfficeData.head}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 mt-4">
                    {/* Image placeholder */}
                    {currentOfficeData.image && (
                      <div className="flex justify-center">
                        <div className="w-32 h-32 bg-neutral-200 rounded-full flex items-center justify-center overflow-hidden">
                          <Image
                            src={currentOfficeData.image}
                            alt={currentOfficeData.head}
                            width={128}
                            height={128}
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <h3 className="font-semibold text-[#032a0d] mb-2">
                        Description
                      </h3>
                      <p className="text-sm text-neutral-700 leading-relaxed">
                        {currentOfficeData.description}
                      </p>
                    </div>

                    {/* Duties */}
                    <div>
                      <h3 className="font-semibold text-[#032a0d] mb-2">
                        Duties
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-neutral-700">
                        {currentOfficeData.duties.map((duty, index) => (
                          <li key={index}>{duty}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Responsibilities */}
                    <div>
                      <h3 className="font-semibold text-[#032a0d] mb-2">
                        Responsibilities
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-neutral-700">
                        {currentOfficeData.responsibilities.map(
                          (responsibility, index) => (
                            <li key={index}>{responsibility}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {!currentOfficeData && (
                <div className="text-center py-8">
                  <p className="text-neutral-600">
                    Information for this office is not yet available.
                  </p>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Accordion Section */}
          <div>
            <header className="mb-6 sm:mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#032a0d]">
                Detailed Structure
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#032a0d]/80 leading-relaxed">
                Explore how leadership, ministries, administration, and partner
                organizations are grouped under the Chief Chaplain. Use the
                sections below to view responsibilities and service areas for
                each part of the organization.
              </p>
            </header>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50/80">
              <Accordion
                type="single"
                collapsible
                className="w-full divide-y divide-neutral-200"
              >
                {/* Top-Level Leadership */}
                <AccordionItem value="leadership">
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-semibold text-[#032a0d]  hover:no-underline">
                    Chief Chaplain & Core Leadership
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 sm:pb-6 text-sm text-neutral-800">
                    <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                      <li>Chief Chaplain</li>
                      <li>General Secretary</li>
                      <li>Legal Adviser</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* Ministry / Services */}
                <AccordionItem value="ministry-services">
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-semibold text-[#032a0d]  hover:no-underline">
                    Ministry / Services
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 sm:pb-6 text-sm text-neutral-800">
                    <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                      <li>School Chaplaincy</li>
                      <li>Training and Seminars</li>
                      <li>Follow Up Visitation</li>
                      <li>Community</li>
                      <li>Ordination</li>
                      <li>Devotion &amp; Bible Study</li>
                      <li>Pastoral Care</li>
                      <li>Solemnize Marriage</li>
                      <li>Pastoral Counseling</li>
                      <li>Spiritual Enhancement</li>
                      <li>Moral Values &amp; Spiritual Upliftment</li>
                      <li>House / Company Blessing</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* Administration */}
                <AccordionItem value="administration">
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-semibold text-[#032a0d]  hover:no-underline">
                    Administration
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 sm:pb-6 text-sm text-neutral-800">
                    <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                      <li>Human Resource</li>
                      <li>Information Technology</li>
                      <li>Accounting</li>
                      <li>Logistic</li>
                      <li>Maintenance</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* National & Deputy Directors */}
                <AccordionItem value="directors">
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-semibold text-[#032a0d]  hover:no-underline">
                    National Director &amp; Deputy Director
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 sm:pb-6 text-sm text-neutral-800">
                    <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                      <li>Regional Director &amp; Director</li>
                      <li>Provincial Director &amp; Director</li>
                      <li>
                        City &amp; Municipality Chaplain &amp; Deputy Chaplain
                      </li>
                      <li>Barangay Chaplain &amp; Deputy Chaplain</li>
                      <li>Member</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* Churches / Ministerial */}
                <AccordionItem value="churches-ministerial">
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-semibold text-[#032a0d]  hover:no-underline">
                    Churches / Ministerial
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 sm:pb-6 text-sm text-neutral-800 space-y-4">
                    <div>
                      <h4 className="font-semibold text-[#032a0d] mb-2">
                        Education
                      </h4>
                      <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                        <li>Humanitarian</li>
                        <li>Political Affairs &amp; Communication</li>
                        <li>Training &amp; Development</li>
                        <li>Social Welfare &amp; Development</li>
                        <li>Human Resources</li>
                        <li>Membership &amp; Recruitment</li>
                        <li>Prison Ministry</li>
                        <li>School / Colleges</li>
                        <li>Security Group</li>
                        <li>PNP</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#032a0d] mb-2">
                        Operation
                      </h4>
                      <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                        <li>Sport</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Partners / NGO */}
                <AccordionItem value="partners-ngo">
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-semibold text-[#032a0d]  hover:no-underline">
                    Partners – NGO
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 sm:pb-6 text-sm text-neutral-800 space-y-3">
                    <p className="font-semibold text-[#032a0d]">WCEA</p>
                    <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                      <li>JSL Group of Company</li>
                      <li>AYAAN Enterprises Corporation</li>
                      <li>L.A.A Health Talk with Dr. Larry</li>
                      <li>Natural Bone Restoration</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* Offices A–Z */}
                <AccordionItem value="offices-az">
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-semibold text-[#032a0d]  hover:no-underline">
                    Offices (A–Z)
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 sm:pb-6 text-sm text-neutral-800">
                    <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                      <li>Accounting</li>
                      <li>AYAAN Enterprises Corporation</li>
                      <li>Barangay Chaplain &amp; Deputy Chaplain</li>
                      <li>Chief Chaplain</li>
                      <li>
                        City &amp; Municipality Chaplain &amp; Deputy Chaplain
                      </li>
                      <li>Community</li>
                      <li>Devotion &amp; Bible Study</li>
                      <li>Follow Up Visitation</li>
                      <li>General Secretary</li>
                      <li>House / Company Blessing</li>
                      <li>Human Resource</li>
                      <li>Human Resources</li>
                      <li>Humanitarian</li>
                      <li>Information Technology</li>
                      <li>JSL Group of Company</li>
                      <li>L.A.A Health Talk with Dr. Larry</li>
                      <li>Legal Adviser</li>
                      <li>Logistic</li>
                      <li>Maintenance</li>
                      <li>Member</li>
                      <li>Membership &amp; Recruitment</li>
                      <li>Moral Values &amp; Spiritual Upliftment</li>
                      <li>Natural Bone Restoration</li>
                      <li>Ordination</li>
                      <li>Pastoral Care</li>
                      <li>Pastoral Counseling</li>
                      <li>PNP</li>
                      <li>Political Affairs &amp; Communication</li>
                      <li>Prison Ministry</li>
                      <li>Provincial Director &amp; Director</li>
                      <li>Regional Director &amp; Director</li>
                      <li>School Chaplaincy</li>
                      <li>School / Colleges</li>
                      <li>Security Group</li>
                      <li>Social Welfare &amp; Development</li>
                      <li>Solemnize Marriage</li>
                      <li>Spiritual Enhancement</li>
                      <li>Sport</li>
                      <li>Training &amp; Development</li>
                      <li>Training and Seminars</li>
                      <li>WCEA</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
