import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";
import WelcomeBanner from "@/components/dashboard/welcome-banner";
import Appointments from "@/components/dashboard/appointments";
import Medications from "@/components/dashboard/medications";
import FamilyCare from "@/components/dashboard/family-care";
import AiDoctorBot from "@/components/ai-doctor-bot";
import Reports from "@/components/dashboard/reports";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <SidebarInset>
            <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
              <WelcomeBanner />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="flex flex-col gap-6 lg:col-span-2">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Appointments />
                    <Medications />
                  </div>
                  <AiDoctorBot />
                </div>
                <div className="flex flex-col gap-6 lg:col-span-1">
                  <FamilyCare />
                  <Reports />
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
