"use client";

import { useAppStore } from "@/store/app-store";
import { savedInsurance } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Shield,
  CreditCard,
  Link,
  LogOut,
  Plus,
  Mail,
  Apple,
  Facebook,
} from "lucide-react";
import { Header } from "./header";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getAuth, signOut } from "firebase/auth";

export default function ProfileView() {
  const { navigate } = useAppStore();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth);
    navigate("login-view");
  };
  
  const userInitials = currentUser?.displayName?.split(' ').map((n: string) => n[0]).join('') || 'U';

  return (
    <div className="pb-safe-footer">
      <Header title="My Profile" icon={<User />} backPage="home" />

      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl mb-6 text-center">
        <Avatar className="w-20 h-20 rounded-full border-4 border-primary shadow-lg mx-auto mb-4">
          <AvatarFallback>
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold text-gray-800">{currentUser?.displayName}</h2>
        <p className="text-gray-600 mt-1">{currentUser?.email}</p>
        <p className="text-sm text-gray-500 mt-2">Member ID: {currentUser?.uid.slice(0, 8)}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" /> Insurance Information
        </h3>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provider
              </p>
              <p className="text-base font-semibold text-gray-800">
                {savedInsurance?.provider || "Not Set"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member ID
              </p>
              <p className="text-base font-semibold text-gray-800">
                {savedInsurance?.memberId || "Not Set"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => toast({ title: "Edit insurance information" })}
          >
            Edit Insurance
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-purple-600" /> Payment Methods
        </h3>
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl text-white shadow-md">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-xs opacity-80">Card Number</p>
                <p className="text-lg font-semibold tracking-widest">
                  •••• •••• •••• 4242
                </p>
              </div>
              <span className="text-sm font-bold">VISA</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-80">Card Holder</p>
                <p className="font-semibold">{currentUser?.displayName}</p>
              </div>
              <div>
                <p className="text-xs opacity-80">Expires</p>
                <p className="font-semibold">12/26</p>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => toast({ title: "Add new payment method" })}>
            <Plus className="w-4 h-4 mr-2" /> Add Payment Method
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Link className="w-5 h-5 mr-2 text-green-600" /> Linked Accounts
        </h3>
        <div className="space-y-3">
            {[
                { name: "Google Account", icon: <Mail className="w-5 h-5 text-red-600"/>, connected: true},
                { name: "Apple ID", icon: <Apple className="w-5 h-5 text-black"/>, connected: false},
                { name: "Facebook", icon: <Facebook className="w-5 h-5 text-blue-600"/>, connected: true},
            ].map(acc => (
                <div key={acc.name} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">{acc.icon}</div>
                        <div>
                            <p className="font-semibold text-gray-800">{acc.name}</p>
                            <p className={`text-sm ${acc.connected ? 'text-green-600' : 'text-gray-500'}`}>{acc.connected ? "Connected" : "Not Connected"}</p>
                        </div>
                    </div>
                    <Button variant={acc.connected ? 'destructive' : 'secondary'} size="sm" onClick={() => toast({ title: `${acc.connected ? 'Disconnecting' : 'Connecting'} ${acc.name}...`})}>
                        {acc.connected ? "Disconnect" : "Connect"}
                    </Button>
                </div>
            ))}
        </div>
      </div>

      <div className="pt-2 mb-8">
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="w-5 h-5 mr-2" />
          Log out
        </Button>
      </div>
    </div>
  );
}
