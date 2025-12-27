"use client";

import { useAppStore } from "@/store/app-store";
import { medications } from "@/lib/data";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Pill, Plus, ShoppingCart, Square, Check } from "lucide-react";
import { Header } from "./header";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function MedicationManagerView() {
  const { navigate, refillCart, setRefillCart } = useAppStore();
  const { t } = useI18n();
  const { toast } = useToast();

  const toggleInCart = (medName: string) => {
    const newCart = refillCart.includes(medName)
      ? refillCart.filter((m) => m !== medName)
      : [...refillCart, medName];
    setRefillCart(newCart);
    toast({
        title: newCart.includes(medName) ? t("addedToCart") : t("removedFromCart"),
        description: medName,
    })
  };

  const lowStockMeds = medications.filter((m) => m.stockDoses <= 7);
  const normalStockMeds = medications.filter((m) => m.stockDoses > 7);

  const MedCard = ({ med, isLowStock }: { med: (typeof medications)[0], isLowStock: boolean }) => {
    const isInCart = refillCart.includes(med.name);
    return (
      <div
        className={cn(
          "p-4 rounded-xl shadow-md border flex items-center justify-between",
          isLowStock && !isInCart ? "bg-red-50 border-red-200" : "",
          isInCart ? "bg-primary/10 border-primary" : "bg-card border-border"
        )}
      >
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            <Pill className={cn("w-5 h-5", med.color)} />
            <p className={cn("text-lg font-bold", med.color)}>
              {t(med.name.toLowerCase() as any)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {med.dosage} · {t(med.frequency.toLowerCase().replace(" ", "") as any)}
          </p>
          {isLowStock && (
             <p className="text-xs font-semibold text-red-600 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" /> {t("lowStock")}: {med.stockDoses} {t("dosesLeft")}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center space-y-2 ml-4">
            {isLowStock && (
                <Button
                    size="sm"
                    className={cn("w-20", isInCart ? "" : "bg-destructive hover:bg-destructive/90")}
                    onClick={() => toggleInCart(med.name)}
                >
                    {isInCart ? t("inCart") : t("refill")}
                </Button>
            )}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-safe-footer">
      <Header
        title={t("myMedication")}
        icon={<Pill />}
        backPage="home"
      />

      <Button
        onClick={() => navigate("add-medication-form")}
        className="w-full mb-6"
        size="lg"
      >
        <Plus className="w-5 h-5 mr-2" /> {t("addMedication")}
      </Button>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2 text-destructive" />{" "}
            {t("refill")} ({lowStockMeds.length})
          </h2>
          <Button
            onClick={() => refillCart.length > 0 ? navigate("refill-cart-view") : toast({title: t("refillCartEmpty")})}
            disabled={refillCart.length === 0}
            size="sm"
          >
            {t("refillCart")} ({refillCart.length})
          </Button>
        </div>
        <div className="space-y-4">
            {lowStockMeds.length > 0 ? lowStockMeds.map(med => <MedCard key={med.name} med={med} isLowStock={true} />) : <p className="text-muted-foreground italic p-4 bg-gray-50 rounded-xl">{t('emptyCart')}</p>}
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">
        All Medications ({normalStockMeds.length})
      </h2>
      <div className="space-y-4">
      {normalStockMeds.map(med => (
          <div key={med.name} className="p-4 rounded-xl shadow-sm border border-gray-100 bg-white flex items-center justify-between hover:bg-gray-50">
            <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                    <Pill className={cn("w-5 h-5", med.color)} />
                    <p className="text-lg font-bold text-gray-800">{t(med.name.toLowerCase() as any)} ({med.dosage})</p>
                </div>
                <p className="text-sm text-gray-500">{t(med.frequency.toLowerCase().replace(' ', '') as any)}</p>
                <Progress value={(med.stockDoses / med.totalDoses) * 100} className="mt-2 h-2" />
                <p className="text-xs text-gray-400">{med.stockDoses} / {med.totalDoses} doses left</p>
            </div>
        </div>
      ))}
      </div>
    </div>
  );
}
