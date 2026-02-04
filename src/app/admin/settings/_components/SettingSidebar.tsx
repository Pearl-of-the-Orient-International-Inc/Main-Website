"use client";
import * as React from "react";
import {
  IconBan,
  IconBell,
  IconBuilding,
  IconClockEdit,
  IconCode,
  IconCookie,
  IconDeviceDesktopCog,
  IconHelpCircle,
  IconLockAccess,
  IconMail,
  IconMapPin,
  IconMasksTheater,
  IconMessage2Cog,
  IconScale,
  IconSettings,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ArrowLeftIcon } from "lucide-react";
import { NavAccounts } from "../_components/NavAccounts";
import { NavCms } from "../_components/NavCms";

const data = {
  navAccount: [
    {
      title: "General",
      url: "/admin/settings",
      icon: IconSettings,
    },
    {
      title: "Notifications",
      url: "/admin/settings/notification",
      icon: IconBell,
    },
    {
      title: "Sessions",
      url: "/admin/settings/sessions",
      icon: IconDeviceDesktopCog,
      isNew: true,
    },
    {
      title: "Cookie",
      url: "/admin/settings/cookie",
      icon: IconCookie,
      isNew: true,
    },
    {
      title: "Security & Privacy",
      url: "/admin/settings/security",
      icon: IconLockAccess,
      isNew: true,
    },
    {
      title: "Developer",
      url: "/admin/settings/developer",
      icon: IconCode,
      isNew: true,
    },
  ],
  navCms: [
    {
      title: "Platform",
      url: "/admin/settings/cms/platform",
      icon: IconBuilding,
    },
    {
      title: "Contact Information",
      url: "/admin/settings/cms/contact",
      icon: IconMapPin,
    },
    {
      title: "Policies",
      url: "/admin/settings/cms/policies",
      icon: IconScale,
    },
    {
      title: "Branding",
      url: "/admin/settings/cms/branding",
      icon: IconMasksTheater,
    },
    {
      title: "Email",
      url: "/admin/settings/cms/email",
      icon: IconMail,
    },
    {
      title: "FAQs",
      url: "/admin/settings/cms/faqs",
      icon: IconHelpCircle,
    },
    {
      title: "Office Hours",
      url: "/admin/settings/cms/office-hours",
      icon: IconClockEdit,
    },
    {
      title: "Restricted Users",
      url: "/admin/settings/cms/restricted-users",
      icon: IconBan,
      isNew: true,
    },
    {
      title: "Chat Configuration",
      url: "/admin/settings/cms/chat-configuration",
      icon: IconMessage2Cog,
    },
  ],
};

export const SettingSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/admin/dashboard">
                <ArrowLeftIcon className="size-4" />
                Back to app
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavAccounts items={data.navAccount} />
        <NavCms items={data.navCms} />
      </SidebarContent>
    </Sidebar>
  );
};
