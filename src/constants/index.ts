import {
  Box,
  BrainCog,
  Clock,
  FileText,
  HelpCircle,
  Mail,
  Scale,
  ShieldUser,
  ShoppingBag,
  Store,
  TriangleAlert,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export type NavGroup = {
  group: string;
  items: NavItem[];
};

export const DOCS_NAV: NavGroup[] = [
  {
    group: "Start Here",
    items: [
      { label: "Introduction", href: "/documentation" },
      { label: "Getting Around", href: "/documentation/getting-around" },
      {
        label: "Sign In and Account Access",
        href: "/documentation/account-access",
      },
      {
        label: "Public Website Navigation",
        href: "/documentation/website-navigation",
      },
      {
        label: "Search and Directory",
        href: "/documentation/search-directory",
      },
    ],
  },
  {
    group: "Members",
    items: [
      {
        label: "Become a Member",
        href: "/documentation/become-a-member",
        children: [
          {
            label: "Online Application",
            href: "/documentation/become-a-member",
          },
          {
            label: "Submission of Requirements",
            href: "/documentation/become-a-member/requirements",
          },
          {
            label: "Pre-orientation Course",
            href: "/documentation/become-a-member/pre-orientation",
          },
          {
            label: "Payment / Checkout",
            href: "/documentation/become-a-member/payment-checkout",
          },
          {
            label: "Online Interview",
            href: "/documentation/become-a-member/online-interview",
          },
          {
            label: "Member ID / QR and Certificate",
            href: "/documentation/become-a-member/id-generation",
          },
          {
            label: "Chaplaincy 101 Training",
            href: "/documentation/become-a-member/chaplaincy-101",
          },
          {
            label: "Oath Taking",
            href: "/documentation/become-a-member/oath-taking",
          },
        ],
      },
      {
        label: "View Profile and Public Record",
        href: "/documentation#member-profile",
      },
      {
        label: "Attach Certificates",
        href: "/documentation#member-attach-certificates",
      },
      {
        label: "Download Membership Certificate",
        href: "/documentation#member-certificate",
      },
      { label: "Renew Membership", href: "/documentation#member-renewal" },
    ],
  },
  {
    group: "Officers",
    items: [
      { label: "Officer Dashboard", href: "/documentation#officer-dashboard" },
      {
        label: "Assigned Office and Role",
        href: "/documentation#officer-assignment",
      },
      {
        label: "Manage Assigned Members",
        href: "/documentation#officer-members",
      },
      {
        label: "Review Member Profiles",
        href: "/documentation#officer-member-profiles",
      },
      {
        label: "Use Organization Chart",
        href: "/documentation#officer-organization-chart",
      },
      {
        label: "Handle Ministry Activity",
        href: "/documentation#officer-ministry-activity",
      },
      {
        label: "Reports and Follow-ups",
        href: "/documentation#officer-reports",
      },
    ],
  },
  {
    group: "Admin Portal",
    items: [
      { label: "Dashboard Overview", href: "/documentation#dashboard-guide" },
      {
        label: "Members",
        href: "/documentation#members-guide",
        children: [
          {
            label: "Manage All Members",
            href: "/documentation#admin-all-members",
          },
          {
            label: "Review Pending Applications",
            href: "/documentation#admin-pending-applications",
          },
          {
            label: "Approve or Reject Applications",
            href: "/documentation#admin-approve-applications",
          },
          {
            label: "Process Renewals",
            href: "/documentation#admin-renewal-members",
          },
          {
            label: "Generate QR Codes",
            href: "/documentation#admin-member-qr-codes",
          },
          {
            label: "Assign Offices",
            href: "/documentation#admin-office-assignment",
          },
        ],
      },
      {
        label: "Certifications",
        href: "/documentation#admin-certifications",
        children: [
          {
            label: "Upload Certificate Layout",
            href: "/documentation#admin-upload-certificate-layout",
          },
          {
            label: "Place Certificate Fields",
            href: "/documentation#admin-certificate-placement",
          },
          {
            label: "Batch Generate Certificates",
            href: "/documentation#admin-batch-certificates",
          },
        ],
      },
      {
        label: "Branch of Services",
        href: "/documentation#branch-services-guide",
      },
      {
        label: "Organizational Structure",
        href: "/documentation#organizational-structure-guide",
      },
      {
        label: "Create News and Blogs",
        href: "/documentation#news-and-blogs-guide",
      },
      {
        label: "Events",
        href: "/documentation#events-guide",
        children: [
          {
            label: "Create an Event",
            href: "/documentation#admin-create-event",
          },
          {
            label: "Edit Event Details",
            href: "/documentation#admin-edit-event",
          },
          {
            label: "Invite Attendees",
            href: "/documentation#admin-invite-attendees",
          },
          {
            label: "Use Calendar View",
            href: "/documentation#admin-events-calendar",
          },
        ],
      },
      { label: "Memo and Announcements", href: "/documentation#memo-guide" },
      { label: "Reports and Analytics", href: "/documentation#reports-guide" },
      { label: "Admin Accounts", href: "/documentation#admin-accounts-guide" },
      { label: "System Logs", href: "/documentation#system-logs-guide" },
      { label: "Backup Database", href: "/documentation#backup-guide" },
    ],
  },
  {
    group: "Admin Settings",
    items: [
      {
        label: "Profile and Preferences",
        href: "/documentation#admin-profile-settings",
      },
      { label: "Security and MFA", href: "/documentation#admin-security" },
      {
        label: "Email Configuration",
        href: "/documentation#admin-email-configuration",
      },
      { label: "Branding and Logo", href: "/documentation#admin-branding" },
      {
        label: "Platform Information",
        href: "/documentation#admin-platform-information",
      },
      {
        label: "FAQs and Office Hours",
        href: "/documentation#admin-faqs-office-hours",
      },
      {
        label: "Policies and Cookies",
        href: "/documentation#admin-policies-cookies",
      },
      {
        label: "Restricted Users",
        href: "/documentation#admin-restricted-users",
      },
    ],
  },
  {
    group: "Seminary",
    items: [
      { label: "Seminary Website", href: "/documentation#seminary-website" },
      { label: "Apply for Admission", href: "/documentation#seminary-apply" },
      {
        label: "Admission Steps",
        href: "/documentation#seminary-admission-steps",
      },
      { label: "Student Resources", href: "/documentation#seminary-resources" },
      {
        label: "Seminary Admin",
        href: "/documentation#seminary-admin",
        children: [
          {
            label: "Admissions",
            href: "/documentation#seminary-admin-admissions",
          },
          {
            label: "Students and Faculty",
            href: "/documentation#seminary-admin-users",
          },
          {
            label: "Enrollment",
            href: "/documentation#seminary-admin-enrollment",
          },
          {
            label: "Programs and Courses",
            href: "/documentation#seminary-admin-courses",
          },
          {
            label: "Assignments and Exams",
            href: "/documentation#seminary-admin-lms",
          },
          {
            label: "Grades and Transcripts",
            href: "/documentation#seminary-admin-grades",
          },
          {
            label: "Attendance and Timetable",
            href: "/documentation#seminary-admin-attendance",
          },
          {
            label: "Fees and Payments",
            href: "/documentation#seminary-admin-fees",
          },
          {
            label: "Document Requests",
            href: "/documentation#seminary-admin-document-requests",
          },
          { label: "Reports", href: "/documentation#seminary-admin-reports" },
        ],
      },
    ],
  },
  {
    group: "Help",
    items: [
      { label: "Forgot Password", href: "/documentation#forgot-password" },
      { label: "Confirm Account", href: "/documentation#confirm-account" },
      {
        label: "Troubleshooting Uploads",
        href: "/documentation#troubleshooting-uploads",
      },
      { label: "Contact Support", href: "/documentation#contact-support" },
    ],
  },
];

export const paymentMethods = [
  {
    name: "Visa",
    src: "https://assets.xendit.co/payment-channels/logos/visa-logo.svg",
  },
  {
    name: "Mastercard",
    src: "https://assets.xendit.co/payment-channels/logos/mastercard-logo.svg",
  },
  {
    name: "JCB",
    src: "https://s.alicdn.com/@img/imgextra/i3/O1CN01tkTNhl1ZaEMHoGWsA_!!6000000003210-2-tps-137-112.png",
  },
  {
    name: "GCash",
    src: "https://assets.xendit.co/payment-channels/logos/gcash-logo.svg",
  },
  {
    name: "GrabPay",
    src: "https://assets.xendit.co/payment-channels/logos/grabpay-logo.svg",
  },
  {
    name: "7 Eleven",
    src: "https://assets.xendit.co/payment-channels/logos/7eleven-logo.svg",
  },
  {
    name: "Cebuana",
    src: "https://assets.xendit.co/payment-channels/logos/cebuana-logo.svg",
  },
  {
    name: "M Lhuillier",
    src: "https://assets.xendit.co/payment-channels/logos/mlhuillier-logo.svg",
  },
  {
    name: "ECPay Loans",
    src: "https://assets.xendit.co/payment-channels/logos/ecpay-logo.svg",
  },
  {
    name: "Palawan Express",
    src: "https://assets.xendit.co/payment-channels/logos/palawan-logo.svg",
  },
  {
    name: "LBC",
    src: "https://assets.xendit.co/payment-channels/logos/lbc-logo.svg",
  },
  {
    name: "ShopeePay",
    src: "https://assets.xendit.co/payment-channels/logos/shopeepay-logo.svg",
  },
  {
    name: "Maya",
    src: "https://assets.xendit.co/payment-channels/logos/paymaya-logo.svg",
  },
  {
    name: "QRPH",
    src: "https://assets.xendit.co/payment-channels/logos/qrph-c567ff0f-ab6d-4662-86bf-24c6c731d8a8-logo.svg",
  },
  {
    name: "RCBC",
    src: "https://assets.xendit.co/payment-channels/logos/rcbc-logo.svg",
  },
  {
    name: "Chinabank",
    src: "https://assets.xendit.co/payment-channels/logos/chinabank-logo.svg",
  },
  {
    name: "Unionbank",
    src: "https://assets.xendit.co/payment-channels/logos/ubp-logo.svg",
  },
  {
    name: "BPI",
    src: "https://assets.xendit.co/payment-channels/logos/bpi-logo.svg",
  },
  {
    name: "BDO",
    src: "https://assets.xendit.co/payment-channels/logos/bdo-logo.svg",
  },
];

export const isAllowedFileType = (file: File): boolean => {
  // List of allowed MIME types
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
    "text/csv",
    "application/json",
    "application/xml",
  ];

  // List of disallowed file extensions (images, audio, video)
  const disallowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".mp3",
    ".wav",
    ".ogg",
    ".m4a",
    ".flac",
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
    ".webm",
  ];

  // Check MIME type
  if (allowedTypes.includes(file.type)) {
    return true;
  }

  // Check file extension as fallback
  const fileName = file.name.toLowerCase();
  return !disallowedExtensions.some((ext) => fileName.endsWith(ext));
};

export const isVideoFile = (file: File): boolean => {
  const allowedVideoTypes = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-msvideo",
  ];

  const allowedExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
  const fileName = file.name.toLowerCase();

  return (
    allowedVideoTypes.includes(file.type) ||
    allowedExtensions.some((ext) => fileName.endsWith(ext))
  );
};

export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const MAX_VIDEO_SIZE_MB = 5;
export const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

export const sidebarItems = [
  { id: "general", label: "General", icon: Store },
  { id: "email", label: "Email Configuration", icon: Mail },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
  { id: "officeHours", label: "Office Hours", icon: Clock },
  { id: "refund", label: "Refund Policy", icon: Box },
  { id: "legalNotice", label: "Legal Notice", icon: Scale },
  { id: "productListingPolicy", label: "Product Listing", icon: ShoppingBag },
  {
    id: "intellectualPropertyProtection",
    label: "Intellectual Property",
    icon: BrainCog,
  },
  {
    id: "privacyPolicy",
    label: "Privacy Policy",
    icon: ShieldUser,
  },
  {
    id: "termsOfUse",
    label: "Terms of Use",
    icon: FileText,
  },
  {
    id: "integrityCompliance",
    label: "Integrity Compliance",
    icon: TriangleAlert,
  },
];

export * from "./barangay";
export * from "./region";
export * from "./municipality";
export * from "./province";
