"use client";

import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/hooks/use-i18n";
import { User, Mail, Users, UserPlus, Send, Info } from "lucide-react";
import { Header } from "./header";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useFirestore } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection } from "firebase/firestore";
import React, { useState } from "react";

export default function AddMemberForm() {
  const { navigate } = useAppStore();
  const { t } = useI18n();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const firestore = useFirestore();

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [relationship, setRelationship] = useState("");

  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to add a family member.",
        variant: "destructive",
      });
      return;
    }

    if (!name || !contact || !relationship) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }

    const familyMembersCol = collection(
      firestore,
      "patients",
      currentUser.uid,
      "familyMembers"
    );

    // In a real app, you would likely have a more complex invitation flow
    // where you look up the user by email/phone and add their patientId.
    // For this demo, we'll create a placeholder.
    addDocumentNonBlocking(familyMembersCol, {
      name: name,
      relationship: relationship,
      email: contact.includes("@") ? contact : null,
      patientId: `invited_${Date.now()}`, // Placeholder ID
    });

    toast({
      title: t("invitationSent"),
      description: t("invitationMessage"),
    });
    setTimeout(() => navigate("family-list"), 1500);
  };

  return (
    <div className="pb-safe-footer">
      <Header
        title={t("addMemberTitle")}
        icon={<UserPlus />}
        backPage="family-list"
      />

      <form onSubmit={handleSendInvitation} className="space-y-6">
        <div>
          <label
            htmlFor="invite-name"
            className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
          >
            <User className="w-4 h-4 mr-2 text-orange-600" /> {t("memberName")}
          </label>
          <Input
            type="text"
            id="invite-name"
            required
            placeholder={t("memberNamePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="invite-contact"
            className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
          >
            <Mail className="w-4 h-4 mr-2 text-orange-600" />{" "}
            {t("contactInfo")}
          </label>
          <Input
            type="text"
            id="invite-contact"
            required
            placeholder={t("phoneEmailPlaceholder")}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">{t("phoneOrEmail")}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Users className="w-4 h-4 mr-2 text-orange-600" />{" "}
            {t("relationshipLabel")}
          </label>
          <Select
            required
            onValueChange={setRelationship}
            value={relationship}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectRelationship")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Spouse">{t("relationshipSpouse")}</SelectItem>
              <SelectItem value="Child">{t("relationshipChild")}</SelectItem>
              <SelectItem value="Parent">Parent</SelectItem>
              <SelectItem value="Sibling">Sibling</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-1">How it works:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>An invitation link will be sent to the contact</li>
                <li>They can join your family health circle</li>
                <li>You'll see the invitation status in notifications</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
          size="lg"
        >
          <Send className="w-5 h-5 mr-2" />
          {t("sendInvitation")}
        </Button>
      </form>
    </div>
  );
}
    