import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { familyMembers } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Users } from "lucide-react";

export default function FamilyCare() {
  const activeMemberId = "fam1";

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Family Care</CardTitle>
        <Button variant="ghost" size="icon">
            <Users className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Viewing health data for:
        </p>
        <div className="space-y-4">
          {familyMembers.map((member) => (
            <button
              key={member.id}
              className={cn(
                "flex w-full items-center gap-4 rounded-lg border p-3 text-left transition-colors",
                activeMemberId === member.id
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "hover:bg-accent/50"
              )}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait" />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-muted-foreground">
                  {member.relationship}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
