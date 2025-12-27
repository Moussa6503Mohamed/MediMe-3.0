import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { ChevronLeft } from "lucide-react";
import React from "react";

type HeaderProps = {
  title: string;
  icon: React.ReactNode;
  backPage: string;
};

export const Header = ({ title, icon, backPage }: HeaderProps) => {
  const { navigate } = useAppStore();
  return (
    <header className="flex items-center mb-8">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2"
        onClick={() => navigate(backPage)}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <h1 className="text-2xl font-bold text-gray-800 flex items-center">
        <div className="w-6 h-6 mr-2 flex items-center justify-center">{icon}</div> {title}
      </h1>
    </header>
  );
};
