
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  CalendarCheck2,
  ClipboardEdit,
  UsersRound, // For Team Availability (manager)
  Settings,
  Coffee,
  MessageSquare,
  Users, // For Team Management (manager)
  UserCircle, // For My Profile (employee)
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { APP_NAME, Routes } from "@/lib/constants";
import { useMessaging } from "@/contexts/messaging-context"; 
import { Badge } from "@/components/ui/badge"; 

interface NavItem {
  href?: string;
  label: string;
  icon: React.ElementType;
  roles?: ('manager' | 'employee')[];
  managerOnly?: boolean;
  employeeOnly?: boolean;
  generateHref?: (userId: string) => string; // For dynamic hrefs like My Profile
}

const navItems: NavItem[] = [
  { href: Routes.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { href: Routes.MESSAGES, label: "Messages", icon: MessageSquare },
  // Employee specific
  { href: Routes.MY_AVAILABILITY, label: "My Availability", icon: CalendarCheck2, employeeOnly: true },
  { label: "My Profile", icon: UserCircle, employeeOnly: true, generateHref: (userId) => `${Routes.TEAM}/${userId}` },
  // Manager specific
  { href: Routes.MANAGE_SHIFTS, label: "Manage Shifts", icon: ClipboardEdit, managerOnly: true },
  { href: Routes.TEAM, label: "Team Management", icon: Users, managerOnly: true },
  { href: Routes.TEAM_AVAILABILITY, label: "Team Availability", icon: UsersRound, managerOnly: true },
  // Common
  { href: Routes.SETTINGS, label: "Settings", icon: Settings },
];

export function MainSidebarContent() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { getUnreadMessageCount } = useMessaging(); 

  if (!user) return null;

  const unreadCount = getUnreadMessageCount();

  const filteredNavItems = navItems.filter(item => {
    if (item.managerOnly && user.role !== 'manager') return false;
    if (item.employeeOnly && user.role !== 'employee') return false;
    return true;
  });

  return (
    <>
      <SidebarGroup>
         <Link href={Routes.DASHBOARD} className="flex items-center gap-2 px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring rounded-md">
            <Coffee className="h-8 w-8 text-sidebar-primary" />
            <span className="text-xl font-semibold text-sidebar-foreground">{APP_NAME}</span>
          </Link>
      </SidebarGroup>

      <SidebarMenu>
        {filteredNavItems.map((item) => {
          const href = item.generateHref ? item.generateHref(user.id) : item.href;
          if (!href) return null; // Should not happen if generateHref is for employeeOnly and user is employee

          return (
            <SidebarMenuItem key={item.label}>
              <Link href={href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === href || (href !== Routes.DASHBOARD && pathname.startsWith(href))}
                  tooltip={{ children: item.label, className: "bg-popover text-popover-foreground border-border" }}
                  className="relative"
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                    {item.href === Routes.MESSAGES && unreadCount > 0 && (
                      <Badge variant="destructive" className="absolute top-1 right-1 h-5 w-5 p-0 flex items-center justify-center text-xs group-data-[collapsible=icon]:hidden">
                        {unreadCount}
                      </Badge>
                    )}
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </>
  );
}
