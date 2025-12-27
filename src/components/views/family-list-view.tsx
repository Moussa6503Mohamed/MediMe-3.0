"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Users, User } from "lucide-react";
import { Header } from "./header";
import { useAuth } from "@/hooks/use-auth";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { FamilyMember } from "@/lib/types";

function FamilyMemberItem({ member }: { member: FamilyMember }) {
  const { navigate } = useAppStore();
  const { t } = useI18n();

  return (
    <div
      key={member.id}
      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-gray-100 cursor-pointer transition-transform duration-150 hover:shadow-lg hover:scale-[1.02]"
      onClick={() =>
        navigate("member-summary-view", { viewingMemberId: member.id })
      }
    >
      <div className="flex items-center space-x-4">
        <Avatar className="w-12 h-12">
          <AvatarFallback>
            {member.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold text-gray-800">{member.name}</p>
          <p className="text-sm text-gray-500">
            {t(
              (member.relationship?.toLowerCase() ??
                "self") as keyof (typeof translations)["en"]
            )}
          </p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
  );
}


export default function FamilyListView() {
  const { navigate } = useAppStore();
  const { t } = useI18n();
  const { currentUser } = useAuth();
  const firestore = useFirestore();

  const familyMembersQuery = useMemoFirebase(() => {
    if (!currentUser) return null;
    return collection(firestore, 'patients', currentUser.uid, 'familyMembers');
  }, [firestore, currentUser]);

  const { data: familyMembers, isLoading } = useCollection<FamilyMember>(familyMembersQuery);

  const selfMember: FamilyMember = {
    id: currentUser?.uid || '',
    name: currentUser?.displayName || 'Me',
    relationship: 'Self',
    patientId: currentUser?.uid || '',
  }

  return (
    <div className="pb-safe-footer">
      <Header title={t("familyMembers")} icon={<Users />} backPage="home" />

      <div className="space-y-4 mb-8">
        {isLoading && <p>Loading family members...</p>}
        
        {/* Always show the current user */}
        <FamilyMemberItem member={selfMember} />

        {familyMembers && familyMembers.map((member) => (
          <FamilyMemberItem key={member.id} member={member} />
        ))}
        {!isLoading && familyMembers && familyMembers.length === 0 && (
            <div className="text-center p-8 bg-gray-50 rounded-xl">
                <Users className="mx-auto w-12 h-12 text-gray-400" />
                <p className="mt-4 text-gray-500">Your family circle is empty.</p>
                <p className="text-sm text-gray-400">Add family members to manage their health.</p>
            </div>
        )}
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
    