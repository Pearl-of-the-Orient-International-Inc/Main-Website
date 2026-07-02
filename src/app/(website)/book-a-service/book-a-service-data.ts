import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Cross,
  FileBadge,
  HeartHandshake,
  Home,
  LandPlot,
  Medal,
  Shield,
  Sparkles,
  Truck,
  User,
  Users,
  type LucideIcon,
} from "lucide-react"

export type ServiceOption = {
  title: string
  subtitle: string
  icon: LucideIcon
  active?: boolean
}

export type BranchOption = {
  label: string
  icon: LucideIcon
  active?: boolean
}

export type Chaplain = {
  name: string
  role: string
  rating: string
  location: string
  image: string
  branch: string
  chaplainId: string
  status: string
  commissionedSince: string
  validity: string
  services: string[]
  more: string
}

export const bookingSteps = [
  {
    title: "Choose Service",
    description: "Select the type of service.",
    icon: ClipboardList,
  },
  {
    title: "Select Chaplain",
    description: "Find a chaplain under your branch.",
    icon: User,
  },
  {
    title: "Pick Date & Time",
    description: "Choose a convenient schedule.",
    icon: CalendarDays,
  },
  {
    title: "Confirmation",
    description: "Review and confirm your booking.",
    icon: CheckCircle2,
  },
]

export const branches: BranchOption[] = [
  { label: "Humanitarian", icon: Shield, active: true },
  { label: "Hospital and Care", icon: HeartHandshake },
  { label: "Military/PNP", icon: User },
  { label: "School", icon: Building2 },
  { label: "Corporate", icon: BriefcaseBusiness },
  { label: "Disaster & Rescue Operations", icon: Truck },
  { label: "Prison", icon: LandPlot },
  { label: "Security", icon: Shield },
  { label: "Government", icon: Building2 },
  { label: "DSWD", icon: Users },
]

export const serviceTypes: ServiceOption[] = [
  {
    title: "Solemnizing of Marriage",
    subtitle: "Marriage Ceremony",
    icon: HeartHandshake,
    active: true,
  },
  {
    title: "Baptismal Service",
    subtitle: "Baptism / Christening",
    icon: Cross,
  },
  {
    title: "Memorial Service",
    subtitle: "Funeral / Memorial",
    icon: FileBadge,
  },
  {
    title: "Dedication Service",
    subtitle: "Dedication / Thanksgiving",
    icon: Medal,
  },
  {
    title: "House Blessing",
    subtitle: "Blessing of Home / Office",
    icon: Home,
  },
  {
    title: "Thanksgiving Service",
    subtitle: "Thanksgiving / Special Occasions",
    icon: Sparkles,
  },
  {
    title: "Spiritual Counseling",
    subtitle: "Counseling / Pastoral Care",
    icon: HeartHandshake,
  },
  {
    title: "Other Services",
    subtitle: "Please specify your request",
    icon: ClipboardList,
  },
]

export const chaplains: Chaplain[] = [
  {
    name: "Rev. Rodel R. Manzo",
    role: "Bishop / Chief Chaplain",
    rating: "5.0",
    location: "Lipa City, Batangas",
    image: "/officers/Manzo.png",
    branch: "Military/PNP",
    chaplainId: "262-000001",
    status: "Active",
    commissionedSince: "January 31, 2025",
    validity: "January 31, 2025 - December 31, 2027",
    services: [
      "Solemnizing of Marriage",
      "Baptismal Service",
      "Memorial Service",
    ],
    more: "+3 more",
  },
  {
    name: "Rev. Mary Grace D. Torres",
    role: "Senior Chaplain",
    rating: "4.9",
    location: "San Pedro, Laguna",
    image: "/chief.jpg",
    branch: "Humanitarian",
    chaplainId: "POO-CHAP-0002",
    status: "Active",
    commissionedSince: "March 12, 2025",
    validity: "March 12, 2025 - December 31, 2027",
    services: [
      "Solemnizing of Marriage",
      "Baptismal Service",
      "House Blessing",
    ],
    more: "+2 more",
  },
  {
    name: "Rev. Jonathan P. Dela Cruz",
    role: "Chaplain",
    rating: "4.8",
    location: "Batangas City, Batangas",
    image: "/chief.jpg",
    branch: "Humanitarian",
    chaplainId: "POO-CHAP-0003",
    status: "Active",
    commissionedSince: "April 18, 2025",
    validity: "April 18, 2025 - December 31, 2027",
    services: [
      "Memorial Service",
      "Thanksgiving Service",
      "Spiritual Counseling",
    ],
    more: "+2 more",
  },
  {
    name: "Rev. Anna L. Reyes",
    role: "Chaplain",
    rating: "4.9",
    location: "Calamba City, Laguna",
    image: "/officers/Manzo.png",
    branch: "Humanitarian",
    chaplainId: "POO-CHAP-0004",
    status: "Active",
    commissionedSince: "May 9, 2025",
    validity: "May 9, 2025 - December 31, 2027",
    services: ["Baptismal Service", "Dedication Service", "House Blessing"],
    more: "+2 more",
  },
  {
    name: "Rev. Carlo M. Bautista",
    role: "Chaplain",
    rating: "4.7",
    location: "Binan City, Laguna",
    image: "/chief.jpg",
    branch: "Humanitarian",
    chaplainId: "POO-CHAP-0005",
    status: "Active",
    commissionedSince: "June 6, 2025",
    validity: "June 6, 2025 - December 31, 2027",
    services: [
      "Solemnizing of Marriage",
      "Memorial Service",
      "Spiritual Counseling",
    ],
    more: "+2 more",
  },
]

export const values = [
  { label: "Faith", icon: Cross },
  { label: "Compassion", icon: HeartHandshake },
  { label: "Integrity", icon: Shield },
  { label: "Service", icon: Users },
  { label: "Excellence", icon: BadgeCheck },
]
