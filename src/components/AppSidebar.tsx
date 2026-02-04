"use client";
import * as React from "react";
import {
  IconBuildingChurch,
  IconBuildingWarehouse,
  IconCalendarEvent,
  IconChartBar,
  IconDatabase,
  IconHeartHandshake,
  IconLayoutDashboard,
  IconLogs,
  IconMessageCircle,
  IconPray,
  IconUserCog,
  IconUsersGroup,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/NavMain";
import { NavSecondary } from "@/components/NavSecondary";
import { HeaderToolbar } from "@/components/HeaderToolbar";
import Image from "next/image";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconLayoutDashboard,
    },
    {
      title: "Members",
      url: "#",
      icon: IconUsersGroup,
      subItems: [
        {
          title: "All Members",
          url: "/admin/members",
        },
        {
          title: "Pending Applications",
          url: "/admin/members/pending",
        },
      ],
    },
    {
      title: "Branch of Services",
      url: "#",
      icon: IconBuildingChurch,
      subItems: [
        {
          title: "Worship Schedules",
          url: "/admin/worship/schedules",
        },
        {
          title: "Service Requests",
          url: "/admin/worship/requests",
        },
        {
          title: "Ministry Assignments",
          url: "/admin/worship/assignments",
        },
      ],
    },
    {
      title: "Organizational Structure",
      url: "/admin/ogranizational-structure",
      icon: IconBuildingWarehouse,
    },
    {
      title: "Events",
      url: "/admin/events",
      icon: IconCalendarEvent,
    },
    {
      title: "Prayer Requests",
      url: "/admin/prayer-requests",
      icon: IconPray,
    },
    {
      title: "Pastoral Care",
      url: "#",
      icon: IconHeartHandshake,
      subItems: [
        {
          title: "Visit Requests",
          url: "/admin/pastoral/visits",
        },
        {
          title: "Counseling Sessions",
          url: "/admin/pastoral/counseling",
        },
      ],
    },
    {
      title: "Announcements",
      url: "/admin/announcements",
      icon: IconMessageCircle,
    },
    {
      title: "Reports & Analytics",
      url: "#",
      icon: IconChartBar,
      subItems: [
        {
          title: "Membership Overview",
          url: "/admin/reports/membership",
        },
        {
          title: "Ministry Activity",
          url: "/admin/reports/ministry",
        },
      ],
    },
    {
      title: "System Logs",
      url: "/admin/system-logs",
      icon: IconLogs,
    },
  ],
  navSecondary: [
    {
      title: "Admin Accounts",
      url: "/admin/accounts",
      icon: IconUserCog,
    },
    {
      title: "Backup Database",
      url: "/admin/backup",
      icon: IconDatabase,
    },
  ],
};

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {state !== "collapsed" ? (
          <HeaderToolbar />
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/admin/dashboard">
                  <Image
                    src="/main/logo.png"
                    alt="Pearl of the Orient"
                    width={20}
                    height={20}
                  />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        {/* {state !== "collapsed" ? (
          <Subscription />
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <SparklesIcon />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )} */}
      </SidebarFooter>
    </Sidebar>
  );
};
