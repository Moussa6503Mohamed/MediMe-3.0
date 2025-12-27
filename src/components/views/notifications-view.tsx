"use client";

import { useAppStore } from "@/store/app-store";
import { notifications } from "@/lib/data";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCheck,
  UserPlus,
  AlertTriangle,
  ClipboardList,
  Pill as PillIcon,
  X,
  Check as CheckIcon,
} from "lucide-react";
import { Header } from "./header";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const iconMap: { [key: string]: React.ReactNode } = {
  UserPlus: <UserPlus />,
  AlertTriangle: <AlertTriangle />,
  Check: <CheckIcon />,
  ClipboardList: <ClipboardList />,
  Pill: <PillIcon />,
};

export default function NotificationsView() {
  const { navigate } = useAppStore();
  const { t } = useI18n();
  const { toast } = useToast();

  const handleNotificationClick = (typeKey: string) => {
    const pageMap: { [key: string]: any } = {
      notificationTypeAlert: "medication-manager-view",
      notificationTypeAppointment: "calendar-view",
      notificationTypeUpdate: "reports-list-view",
      notificationTypeMedication: "medication-manager-view",
      notificationTypeInvitation: "invitation-detail-view",
    };
    const targetPage = pageMap[typeKey] || "home";
    toast({ title: `Opening ${t(typeKey as any)}...` });
    setTimeout(() => {
      navigate(targetPage);
    }, 500);
  };
  
  const dismissNotificationItem = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    toast({ title: t("notificationDismissed")});
  };

  return (
    <div className="pb-safe-footer">
      <Header title={t("notifications")} icon={<Bell />} backPage="home" />
      <div className="space-y-3 mb-6">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-start p-4 rounded-xl shadow-sm border cursor-pointer hover:shadow-md transition",
                n.bg, "border-gray-100"
              )}
              onClick={() => handleNotificationClick(n.typeKey)}
            >
              <div className={cn("flex-shrink-0 p-2 rounded-full", n.bg)}>
                <div className={cn("w-5 h-5", n.color)}>{iconMap[n.icon]}</div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  {t(n.typeKey as any)}
                </p>
                <p className="text-gray-700 mt-0.5">
                  {n.customMessage || t(n.messageKey as any)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{n.time}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-gray-600"
                onClick={(e) => dismissNotificationItem(e, n.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground italic p-4 bg-white rounded-xl shadow-sm border">
            {t("allCaughtUp")}
          </p>
        )}
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => toast({title: t("markingAsRead")})}
      >
        <CheckCheck className="w-5 h-5 mr-2" /> Mark All as Read
      </Button>
    </div>
  );
}
