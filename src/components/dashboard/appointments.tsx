import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { upcomingAppointments } from "@/lib/data";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

export default function Appointments() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {upcomingAppointments.map((appt) => (
            <div key={appt.id} className="flex items-start gap-4">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={appt.avatarUrl} alt={appt.doctor} data-ai-hint="person doctor" />
                <AvatarFallback>
                  {appt.doctor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{appt.doctor}</p>
                <p className="text-sm text-muted-foreground">{appt.specialty}</p>
                <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(appt.date, "EEE, MMM d")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {appt.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Appointments
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
