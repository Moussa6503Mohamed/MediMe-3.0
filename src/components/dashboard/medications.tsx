import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { currentMedications } from "@/lib/data";
import { ArrowRight, Bell, Pill } from "lucide-react";
import { Badge } from "../ui/badge";

export default function Medications() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Medication Tracker</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {currentMedications.slice(0, 3).map((med) => (
            <div key={med.id} className="flex items-center gap-4">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10">
                <Pill className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{med.name}</p>
                <p className="text-sm text-muted-foreground">
                  {med.dosage} - {med.frequency}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                Take
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Manage Medications
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
