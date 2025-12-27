"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  CalendarDays,
  Pill,
  FileText,
  Users,
  Bot,
  Settings,
  HeartPulse,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="h-16 items-center justify-center p-4">
        <div className="flex items-center gap-2">
          <HeartPulse className="size-8 text-primary" />
          <h1 className="text-xl font-semibold text-primary">MediMe</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              href="/"
              isActive={pathname === "/"}
              tooltip="Dashboard"
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              href="#"
              isActive={pathname === "/appointments"}
              tooltip="Appointments"
            >
              <CalendarDays />
              <span>Appointments</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              href="#"
              isActive={pathname === "/medications"}
              tooltip="Medications"
            >
              <Pill />
              <span>Medications</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              href="#"
              isActive={pathname === "/reports"}
              tooltip="Reports"
            >
              <FileText />
              <span>Reports</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              href="#"
              isActive={pathname === "/family"}
              tooltip="Family Care"
            >
              <Users />
              <span>Family Care</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              href="#"
              isActive={pathname === "/ai-doctor"}
              tooltip="AI DoctorBot"
            >
              <Bot />
              <span>AI DoctorBot</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              href="#"
              isActive={pathname === "/settings"}
              tooltip="Settings"
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
