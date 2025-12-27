"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserPlus,
  Check,
  X,
  MapPin,
  Calendar,
  MessageSquare,
  Info,
} from "lucide-react";
import { Header } from "./header";
import { useToast } from "@/hooks/use-toast";

export default function InvitationDetailView() {
  const { navigate } = useAppStore();
  const { t } = useI18n();
  const { toast } = useToast();

  const invitation = {
    id: 1,
    inviterName: "Ahmed El-Sayed",
    relationship: "Brother",
    inviterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzY2NzU0MzU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    inviterLocation: "Cairo, Egypt",
    message:
      "Would like to add you to their family health circle to share medical information and coordinate care.",
    sentDate: "December 13, 2025",
  };

  const handleAccept = () => {
    toast({
      title: "Invitation Accepted!",
      description: "You are now part of the family circle.",
    });
    setTimeout(() => navigate("family-list"), 1500);
  };

  const handleDecline = () => {
    toast({
      title: "Invitation Declined",
    });
    navigate("notifications-view");
  };

  return (
    <div className="pb-safe-footer">
      <Header
        title={t("notificationTypeInvitation")}
        icon={<UserPlus />}
        backPage="notifications-view"
      />

      <div className="p-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center text-center mb-4">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg mb-3">
            <AvatarImage src={invitation.inviterAvatar} data-ai-hint="male portrait" />
            <AvatarFallback>{invitation.inviterName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-gray-800">
            {invitation.inviterName}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{invitation.relationship}</p>
        </div>

        <div className="space-y-3 mt-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-green-600" />
            <span>{invitation.inviterLocation}</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-green-600" />
            <span>Invited on {invitation.sentDate}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-green-600" /> Invitation
          Message
        </h3>
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-700">{invitation.message}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-600" /> What This Means
        </h3>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <ul className="text-sm text-gray-700 space-y-2">
            {[
              `You'll be added to ${invitation.inviterName}'s family health circle`,
              "They can view your medical records and appointments",
              "You can coordinate healthcare together",
              "You can leave the family circle anytime",
            ].map((item, i) => (
              <li key={i} className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <Button onClick={handleAccept} className="w-full bg-gradient-to-r from-green-600 to-emerald-600" size="lg">
          <Check className="w-5 h-5 mr-2" />
          Accept Invitation
        </Button>
        <Button onClick={handleDecline} variant="outline" className="w-full" size="lg">
          <X className="w-5 h-5 mr-2" />
          Decline
        </Button>
      </div>
    </div>
  );
}
