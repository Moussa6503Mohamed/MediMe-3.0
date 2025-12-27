import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { recentReports } from "@/lib/data";
import { ArrowRight, Download, FileText, FlaskConical, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "../ui/badge";

const reportIcons: { [key: string]: React.ReactNode } = {
  "Lab Result": <FlaskConical className="h-5 w-5 text-primary" />,
  "Doctor's Note": <Stethoscope className="h-5 w-5 text-primary" />,
  "Imaging": <FileText className="h-5 w-5 text-primary" />,
};

export default function Reports() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Medical Reports</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {recentReports.map((report) => (
            <div key={report.id} className="flex items-center gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10">
                {reportIcons[report.type] || <FileText className="h-5 w-5 text-primary" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold truncate">{report.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(report.date, "MMMM d, yyyy")}
                </p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Download report">
                <Download className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
            View All Reports
            <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
