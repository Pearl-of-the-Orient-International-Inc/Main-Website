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
import { InfoIcon, UserRound } from "lucide-react";

interface OfficeData {
  title: string;
  head: string;
  image?: string;
  description: string;
  duties: string[];
  responsibilities: string[];
  members?: {
    area: string;
    name: string;
  }[];
}

const placeholderImage = "/profile-empty.png";

const officeCopy = {
  duties: [
    "Coordinate assigned chaplaincy programs and field activities",
    "Provide reports and updates to the Chief Chaplain",
    "Support member guidance, training, and public service activities",
    "Maintain orderly communication with assigned leaders and partners",
  ],
  responsibilities: [
    "Office planning and day-to-day coordination",
    "Leadership support and member accountability",
    "Program documentation and implementation",
    "Upholding organizational standards, values, and mission",
  ],
};

const createOffice = (
  title: string,
  head: string,
  description: string,
  members?: OfficeData["members"],
): OfficeData => ({
  title,
  head,
  image: placeholderImage,
  description,
  duties: officeCopy.duties,
  responsibilities: officeCopy.responsibilities,
  members,
});

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
  "general-secretary": createOffice(
    "General Secretary",
    "To be announced",
    "The General Secretary manages administrative operations and coordinates official communication between offices.",
  ),
  "legal-adviser": createOffice(
    "Legal Adviser",
    "To be announced",
    "The Legal Adviser provides legal guidance and helps the organization maintain compliance with applicable requirements.",
  ),
  "school-chaplaincy": createOffice(
    "School Chaplaincy",
    "Dr. Lelanie D. Perido",
    "School Chaplaincy provides values formation, counseling support, and spiritual programs for educational communities.",
  ),
  "training-seminars": createOffice(
    "Training and Seminars",
    "Rev. Romel L. Abaca",
    "Training and Seminars prepares learning activities, seminars, and continuing formation programs for chaplains and members.",
  ),
  "follow-up-visitation": createOffice(
    "Follow Up Visitation",
    "To be announced",
    "Follow Up Visitation maintains pastoral contact with members, applicants, and communities after programs or services.",
  ),
  community: createOffice(
    "Community",
    "Dr. Emer Jason R. Grepo",
    "The Community office coordinates community development and outreach work for local service areas.",
  ),
  ordination: createOffice(
    "Ordination",
    "To be announced",
    "The Ordination office assists with preparation, documentation, and coordination for ordination-related activities.",
  ),
  "devotion-bible-study": createOffice(
    "Devotion & Bible Study",
    "To be announced",
    "This office supports devotional gatherings, Bible studies, and spiritual formation activities.",
  ),
  "pastoral-care": createOffice(
    "Pastoral Care",
    "To be announced",
    "Pastoral Care provides spiritual assistance, encouragement, and guidance to members and partner communities.",
  ),
  "solemnize-marriage": createOffice(
    "Solemnize Marriage",
    "To be announced",
    "This office coordinates marriage solemnization support, preparation, and related pastoral documentation.",
  ),
  "pastoral-counseling": createOffice(
    "Pastoral Counseling",
    "To be announced",
    "Pastoral Counseling provides faith-based counseling support and referral coordination when needed.",
  ),
  "spiritual-enhancement": createOffice(
    "Spiritual Enhancement",
    "To be announced",
    "Spiritual Enhancement strengthens spiritual growth through organized formation and renewal activities.",
  ),
  "moral-values": createOffice(
    "Moral Values & Spiritual Upliftment",
    "To be announced",
    "This office promotes moral values, spiritual upliftment, and character formation in service programs.",
  ),
  "house-blessing": createOffice(
    "House/Company Blessing",
    "To be announced",
    "This office coordinates requested blessings for homes, companies, and partner organizations.",
  ),
  "human-resource": createOffice(
    "Human Resource",
    "To be announced",
    "Human Resource manages personnel coordination, member support, and organizational workforce records.",
  ),
  "information-technology": createOffice(
    "Information Technology",
    "To be announced",
    "Information Technology maintains digital systems, technical support, and data-related coordination.",
  ),
  accounting: createOffice(
    "Accounting",
    "To be announced",
    "Accounting handles financial records, reporting, budgeting support, and fiscal documentation.",
  ),
  logistic: createOffice(
    "Logistic",
    "To be announced",
    "Logistic coordinates supplies, movement, event materials, and operational support needs.",
  ),
  maintenance: createOffice(
    "Maintenance",
    "To be announced",
    "Maintenance supports facilities, equipment readiness, and upkeep for organizational activities.",
  ),
  "national-chaplain-directors": createOffice(
    "National Chaplain Directors",
    "Multiple national directors",
    "National Chaplain Directors lead assigned national program areas and coordinate implementation across the organization.",
    [
      { area: "Education", name: "Dr. Lelanie D. Perido" },
      { area: "Humanitarian", name: "Dr. Bobby M. Brimon" },
      { area: "Political Affairs", name: "Dr. Analyn M. Tibio" },
      { area: "Training & Development", name: "Dr. Romel L. Abaca" },
      { area: "Membership & Recruitment", name: "Dr. Lelanie C. Junio" },
      { area: "Operation", name: "Bsp. Dr. Ronaldo P. Manalo" },
      { area: "Security Group/NCR", name: "Rev. Henry S. Bertumen" },
      { area: "Community Development", name: "Dr. Emer Jason R. Grepo" },
      { area: "Senate", name: "Rev. Lauro S. Lamento Jr." },
      { area: "NAPOLCOM", name: "Rev. Abner P. Tuballes" },
      { area: "Sports", name: "Rev. Rhenald L. Lagrimas" },
      { area: "Hospital", name: "Rev. Jun Rosello D. Pongco" },
    ],
  ),
  "regional-director": createOffice(
    "Regional Chaplain Directors",
    "Multiple regional directors",
    "Regional Chaplain Directors supervise regional chaplaincy coordination and local implementation.",
    [
      { area: "Region 1", name: "Rev. Jonathan I. Balintay" },
      { area: "Region II", name: "Rev. Nestor R. Tangunan" },
      { area: "Region III", name: "Rev. Dr. Miller B. Tadeo" },
      { area: "Region IV A", name: "Rev. Conrado C. Perez" },
      { area: "Region IV B", name: "Bsp. Fortunato N. Almasco Jr." },
      { area: "Region 6", name: "Rev. John Rey T. Vallejera" },
      { area: "Negros Oriental", name: "Bsp. BethelJames C. Mascardo" },
      { area: "Negros Occidental", name: "Chap. Faulkner Faith C. Mascardo" },
    ],
  ),
  "regional-deputy-director": createOffice(
    "Regional Deputy Chaplain Directors",
    "Multiple regional deputy directors",
    "Regional Deputy Chaplain Directors assist regional directors with coordination, reports, and field support.",
    [
      { area: "NCR", name: "Rev. Emilio R. Biag" },
      { area: "Region 1", name: "Chap Virlyn C. Balintay" },
      { area: "Region 3", name: "Rev. Rubenson C. Tandoy" },
    ],
  ),
  "provincial-director": createOffice(
    "Provincial Chaplain Directors",
    "Multiple provincial directors",
    "Provincial Chaplain Directors coordinate chaplaincy work across assigned provinces.",
    [
      { area: "Isabela", name: "Rev. Armando E. Junio" },
      { area: "Nueva Ecija", name: "Rev. Rommey Rodriguez" },
      { area: "Tarlac", name: "Rev. Egmedio B. Equila Jr." },
      { area: "Rizal", name: "Rev. Abner P. Tuballes" },
      { area: "Cavite", name: "Rev. Edsel R. Alcantara" },
      { area: "Batangas", name: "Rev. Christopher M. Llegó" },
      { area: "Laguna", name: "Bsp. Eleanor L. Bendaña" },
      { area: "Palawan North", name: "Rev. Teddy S. Martinez" },
      { area: "Palawan South", name: "Rev. Danilo T. Sabico" },
      { area: "Romblon", name: "Chap Andrew Ramon Tiaga" },
      { area: "Cebu", name: "Chap John Manlanat" },
      { area: "Camiguin", name: "Rev. Samuel D. Ebuetada" },
      { area: "Davao Oriental", name: "Rev. Juvanny A. Yap" },
      { area: "Agusan Del Sur", name: "Chap Jerom D. Amoguis" },
      { area: "Agusan Del Norte", name: "Chap Enecito M. Galendez" },
      { area: "Mindoro", name: "Rev. Romel G. Manes" },
      { area: "Bulacan", name: "Rev. Dr. Sonny T. San Pedro" },
      { area: "Aurora", name: "Rev. Dr. Hilario C. Gonzales Jr." },
      { area: "Ilocos Norte", name: "Rev. Roger D. Salvador" },
      { area: "Pampanga", name: "Rev. Willie O. Tolentino" },
    ],
  ),
  "provincial-deputy-director": createOffice(
    "Provincial Deputy Chaplain Directors",
    "Multiple provincial deputy directors",
    "Provincial Deputy Chaplain Directors support provincial directors in assigned provinces.",
    [
      { area: "Tarlac", name: "Rev. Francis A. Dela paz" },
      { area: "Cabanatuan", name: "Rev. Romel Arnel V. Roque" },
      { area: "Bulacan", name: "Rev. Rodrigo C. Torres III" },
    ],
  ),
  "city-chaplain": createOffice(
    "City Chaplains",
    "Multiple city chaplains",
    "City Chaplains coordinate chaplaincy activities and public service support in assigned cities.",
    [
      { area: "Trece Martirez Cavite", name: "Chap Alejandro A. Salamanca" },
      { area: "General Trias Cavite", name: "Chap Norman S. Endozo" },
      { area: "Dasmarinas Cavite", name: "Chap George L. Junio" },
      { area: "Las Piñas", name: "Chap Ronald C. Castillo" },
      { area: "Santa Rosa Laguna", name: "Rev. Ellery S. Garvida" },
      { area: "Cabuyao City, Laguna", name: "Rev. Edgar I. Amarante" },
      { area: "San Pedro City, Laguna", name: "Chap Noel M. Roldan" },
      { area: "Paranaque", name: "Rev. Nodel M. Manzo" },
      { area: "Quezon City", name: "Chap Enrique G. Ancheta" },
      { area: "Angeles Pampanga", name: "Chap Leslie D. Cunanan" },
      { area: "San Fernando Pampanga", name: "Rev. Dr. Eller G. Valencia" },
      { area: "Tarlac", name: "Chap Nemesio Q. Bajana" },
    ],
  ),
  "municipal-chaplain": createOffice(
    "Municipal Chaplains",
    "Multiple municipal chaplains",
    "Municipal Chaplains provide local chaplaincy coordination and community service support.",
    [
      { area: "Silang Cavite", name: "Rev. Roberto D. Malana" },
      { area: "Kawit Cavite", name: "Rev. James Wayne P. Tuballes" },
      { area: "Naic Cavite", name: "Rev. Godolfredo G. Javier Jr." },
      { area: "Alfonso Cavite", name: "Rev. Chelito O. Consegra" },
      { area: "Gerona Tarlac", name: "Rev. Rodrigo S. Fontanilla Jr." },
      { area: "Conception Tarlac", name: "Chap Jessie D. Buniag" },
      { area: "Santiago Isabela", name: "Chap Alfredo G. Casco" },
      { area: "Labrador Pangasinan", name: "Chap Menard Aries Q. Narvas" },
      { area: "Capas", name: "Rev. Elmer C. Victoria" },
      { area: "Concepcion", name: "Rev. Jessie D. Buniag" },
      { area: "Gerona", name: "Rev. Rodrigo S. Fontanilla Jr." },
      { area: "La Paz", name: "Rev. Dr June T. Viuya" },
      { area: "Victoria", name: "Rev. Zosimo Valdez Jr." },
      { area: "Sta Ignacia", name: "Rev. Rodel E. Banaga" },
      { area: "Camiling", name: "Rev. Rionel Eugenio" },
      { area: "San Jose", name: "Rev. Analiza T. Concepcion" },
      { area: "Moncada", name: "Rev. Joel Gamasa" },
      { area: "Camiguin", name: "Chap Erviejon A. Labador" },
      { area: "Narra Palawan", name: "Chap Francisco P. Pedregoza" },
      { area: "Quezon Palawan", name: "Chap Rodrigo A. Laviano" },
      { area: "Roxas Palawan", name: "Chap Ramon S. Bañes" },
      { area: "Dumaran Palawan", name: "Chap Eliezer M. Gomez" },
      { area: "Angono, Rizal", name: "Chap Jemelet M. Reyes" },
    ],
  ),
  "city-municipal-deputy-chaplain": createOffice(
    "City / Municipal Deputy Chaplains",
    "Multiple city and municipal deputy chaplains",
    "City and Municipal Deputy Chaplains assist local chaplains with coordination, member guidance, and service implementation.",
    [
      { area: "NCR", name: "Chap John R. Santos" },
      { area: "Makati", name: "Chap Lorna E. Senting" },
      { area: "Muntinlupa City", name: "Rev. Jondie M. Buhat" },
      { area: "San Jose", name: "Rev. Myrie E. Ramila" },
      { area: "La Paz", name: "Rev. Rico L. Razon" },
      { area: "Victoria", name: "Rev. Marlo V. Dela Cruz" },
      { area: "Capas", name: "Rev. Romuel D. Pimentel" },
      { area: "Sta Ignacia", name: "Rev. Rowena I. Gabriel" },
      { area: "Taguig", name: "Chap Ramil R. Libarra" },
      { area: "Angono, Rizal", name: "Chap Rose Marie R. Reyes" },
      { area: "Northern District Chaplain Director", name: "Rev. Roberto G. Parcasio" },
    ],
  ),
  "barangay-chaplain": createOffice(
    "Barangay Chaplain & Deputy Chaplain",
    "To be announced",
    "Barangay Chaplains and Deputy Chaplains support community-level chaplaincy coordination and outreach.",
  ),
  member: createOffice(
    "Member",
    "Members of the organization",
    "Members participate in chaplaincy service, values education, community work, and organizational programs.",
  ),
  humanitarian: createOffice(
    "Humanitarian",
    "Dr. Bobby M. Brimon",
    "Humanitarian work coordinates relief, care, and service activities for communities in need.",
  ),
  education: createOffice(
    "Education",
    "Dr. Lelanie D. Perido",
    "Education coordinates values formation, school-based programs, and educational partnerships.",
  ),
  "political-affairs": createOffice(
    "Political Affairs & Communication",
    "Dr. Analyn M. Tibio",
    "Political Affairs and Communication manages public communication, civic coordination, and external relations support.",
  ),
  "training-development": createOffice(
    "Training & Development",
    "Dr. Romel L. Abaca",
    "Training and Development strengthens leadership capacity and practical ministry skills.",
  ),
  "social-welfare": createOffice(
    "Social Welfare & Development",
    "To be announced",
    "Social Welfare and Development organizes social service support and community development coordination.",
  ),
  "human-resources-min": createOffice(
    "Human Resources",
    "To be announced",
    "Human Resources for ministerial work supports member coordination, leadership assignments, and service readiness.",
  ),
  "membership-recruitment": createOffice(
    "Membership & Recruitment",
    "Dr. Lelanie C. Junio",
    "Membership and Recruitment manages member growth, applicant coordination, and onboarding support.",
  ),
  "prison-ministry": createOffice(
    "Prison Ministry",
    "To be announced",
    "Prison Ministry provides spiritual support and values formation coordination for correctional settings.",
  ),
  "school-colleges": createOffice(
    "School/Colleges",
    "To be announced",
    "School and Colleges work supports education-based ministry, values formation, and institutional coordination.",
  ),
  "security-group": createOffice(
    "Security Group",
    "Rev. Henry S. Bertumen",
    "Security Group supports safety coordination, order, and operational readiness during activities.",
  ),
  pnp: createOffice(
    "PNP",
    "To be announced",
    "PNP coordination supports chaplaincy partnerships and service activities connected with police communities.",
  ),
  sport: createOffice(
    "Sport",
    "Rev. Rhenald L. Lagrimas",
    "Sport ministry coordinates values-based sports activities and fellowship programs.",
  ),
  "jsl-group": createOffice(
    "JSL Group of Company",
    "Partner organization",
    "JSL Group of Company is listed as a partner organization supporting shared programs and activities.",
  ),
  wcea: createOffice(
    "WCEA",
    "Partner organization",
    "WCEA is listed as a partner organization supporting the chaplaincy mission and shared service programs.",
  ),
  "ayaan-enterprises": createOffice(
    "AYAAN Enterprises Corporation",
    "Partner organization",
    "AYAAN Enterprises Corporation is listed as a partner organization supporting organizational initiatives.",
  ),
  "laa-health": createOffice(
    "L.A.A Health Talk with Dr. Larry",
    "Dr. Larry",
    "L.A.A Health Talk with Dr. Larry supports health-focused partner activities and education.",
  ),
  "natural-bone": createOffice(
    "Natural Bone Restoration",
    "Partner organization",
    "Natural Bone Restoration is listed as a partner organization for wellness-related coordination.",
  ),
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
                  <div id="office-ministry-services" className="scroll-mt-28">
                    <div className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-semibold text-center shadow-sm">
                      MINISTRY/SERVICES
                    </div>
                  </div>
                  <div id="office-administration" className="scroll-mt-28">
                    <div className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-semibold text-center shadow-sm">
                      ADMINISTRATION
                    </div>
                  </div>
                  <div id="office-national-director" className="scroll-mt-28">
                    <div className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-semibold text-center shadow-sm whitespace-nowrap">
                      National Director & Deputy Director
                    </div>
                  </div>
                  <div id="office-churches-ministerial" className="scroll-mt-28">
                    <div className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-semibold text-center shadow-sm">
                      CHURCHES/MINISTERIAL
                    </div>
                  </div>
                  <div id="office-partners-ngo" className="scroll-mt-28">
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
                        label: "National Chaplain Directors",
                        key: "national-chaplain-directors",
                      },
                      {
                        label: "Regional Chaplain Directors",
                        key: "regional-director",
                      },
                      {
                        label: "Regional Deputy Chaplain Directors",
                        key: "regional-deputy-director",
                      },
                      {
                        label: "Provincial Chaplain Directors",
                        key: "provincial-director",
                      },
                      {
                        label: "Provincial Deputy Chaplain Directors",
                        key: "provincial-deputy-director",
                      },
                      {
                        label: "City Chaplains",
                        key: "city-chaplain",
                      },
                      {
                        label: "Municipal Chaplains",
                        key: "municipal-chaplain",
                      },
                      {
                        label: "City / Municipal Deputy Chaplains",
                        key: "city-municipal-deputy-chaplain",
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
                    <button
                      onClick={() => handleOfficeClick("education")}
                      className="w-full bg-white border border-neutral-200 rounded px-2 py-1.5 text-[10px] font-semibold text-center hover:bg-[#032a0d] hover:text-white hover:border-[#032a0d] transition-colors cursor-pointer"
                    >
                      Education
                    </button>
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
                    <button
                      onClick={() => handleOfficeClick("wcea")}
                      className="w-full bg-white border border-neutral-200 rounded px-2 py-1.5 text-[10px] font-semibold text-center hover:bg-[#032a0d] hover:text-white hover:border-[#032a0d] transition-colors cursor-pointer"
                    >
                      WCEA
                    </button>
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

                    {!currentOfficeData.image && (
                      <div className="flex justify-center">
                        <div className="w-32 h-32 bg-neutral-100 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400">
                          <UserRound className="size-14" />
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

                    {currentOfficeData.members && (
                      <div>
                        <h3 className="font-semibold text-[#032a0d] mb-2">
                          Assigned Heads
                        </h3>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {currentOfficeData.members.map((member) => (
                            <div
                              key={`${member.area}-${member.name}`}
                              className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm"
                            >
                              <p className="font-medium text-[#032a0d]">
                                {member.area}
                              </p>
                              <p className="text-neutral-700">{member.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
