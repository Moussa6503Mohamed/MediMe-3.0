"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { doctorReports } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Upload } from "lucide-react";
import { Header } from "./header";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function ReportsListView() {
  const { navigate } = useAppStore();
  const { t } = useI18n();
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  return (
    <div className="pb-safe-footer">
      <Header
        title={t("myReports")}
        icon={<FileText />}
        backPage="home"
      />

      <Button asChild className="w-full mb-6" size="lg">
        <label htmlFor="report-file-input">
          <Upload className="w-5 h-5 mr-2" />
          {t("uploadNewReport")}
        </label>
      </Button>
      <input
        type="file"
        id="report-file-input"
        className="hidden"
        onChange={handleFileUpload}
      />

      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {t("pastConsultations")} ({doctorReports.length})
      </h2>
      <div className="space-y-4">
        {doctorReports.map((report) => (
          <div
            key={report.id}
            className={cn(
              "p-5 rounded-xl shadow-md border bg-card flex flex-col cursor-pointer transition-all duration-150 hover:shadow-lg hover:scale-[1.02]",
              report.color
            )}
            onClick={() => navigate("report-detail-view", { activeReportId: report.id })}
          >
            <div className="flex items-center space-x-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                  report.color
                )}
              >
                <FileText className={cn("w-6 h-6", report.textColor)} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {new Date(report.date).toLocaleDateString()}
                </p>
                <h3 className="text-xl font-bold text-card-foreground">
                  {report.title}
                </h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
              {report.diagnosis}
            </p>
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-muted-foreground">
              <p>{report.doctor}</p>
              <p className="font-semibold text-primary">View Report</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
