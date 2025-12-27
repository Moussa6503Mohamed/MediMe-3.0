"use client";

import { useAppStore } from "@/store/app-store";
import { familyMembers } from "@/lib/data";
import { useI18n } from "@/hooks/use-i18n";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Users } from "lucide-react";
import { Header } from "./header";

export default function FamilyListView() {
  const { navigate } = useAppStore();
  const { t } = useI18n();

  return (
    <div className="pb-safe-footer">
      <Header title={t("familyMembers")} icon={<Users />} backPage="home" />

      <div className="space-y-4 mb-8">
        {familyMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-gray-100 cursor-pointer transition-transform duration-150 hover:shadow-lg hover:scale-[1.02]"
            onClick={() => navigate("member-summary-view", { viewingMemberId: member.id })}
          >
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait" />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {member.name}
                </p>
                <p className="text-sm text-gray-500">
                  {t(member.relationship.toLowerCase() as any)}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        ))}
      </div>

      <Button
        onClick={() => navigate("add-member-form")}
        className="w-full"
        size="lg"
      >
        <Plus className="w-5 h-5 mr-2" /> {t("addNewMember")}
      </Button>
    </div>
  );
}
