"use client";

import { useAppStore } from "@/store/app-store";
import { pharmacies } from "@/lib/data";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  CheckCircle,
  Clock,
  DollarSign,
  Truck,
} from "lucide-react";
import { Header } from "./header";
import { cn } from "@/lib/utils";

export default function SelectPharmacyView() {
  const { navigate, refillCart, selectedPharmacyId, setSelectedPharmacyId } =
    useAppStore();
  const { t } = useI18n();

  return (
    <div>
      <Header
        title={t("selectPharmacy")}
        icon={<MapPin />}
        backPage="refill-cart-view"
      />

      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {t("availablePharmacies")}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        {t("pharmacyOrderPrompt", { count: refillCart.length })}
      </p>

      <div className="space-y-4 mb-8">
        {pharmacies.map((pharmacy) => {
          const isSelected = selectedPharmacyId === pharmacy.id;
          return (
            <div
              key={pharmacy.id}
              className={cn(
                "p-5 rounded-xl shadow-md border cursor-pointer transition-all duration-150 hover:shadow-lg",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-gray-100 bg-white"
              )}
              onClick={() => setSelectedPharmacyId(pharmacy.id)}
            >
              <div className="flex justify-between items-start">
                <h3
                  className={cn(
                    "text-xl font-bold",
                    isSelected ? "text-primary" : "text-gray-800"
                  )}
                >
                  {pharmacy.name}
                </h3>
                {isSelected && (
                  <CheckCircle className="w-6 h-6 text-primary" />
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">{pharmacy.address}</p>
              <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-3">
                <div className="flex items-center space-x-1 text-sm text-gray-700">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <p className="font-medium">
                    {t("deliveryLabel")}: {pharmacy.delivery}
                  </p>
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm font-bold ${
                    pharmacy.fee > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <p>
                    {pharmacy.fee > 0
                      ? `$${pharmacy.fee.toFixed(2)}`
                      : t("freeDelivery")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        onClick={() => navigate("refill-checkout-view")}
        disabled={!selectedPharmacyId}
        className="w-full"
        size="lg"
      >
        <Truck className="w-5 h-5 mr-2" />
        {t("proceedToCheckout")}
      </Button>
    </div>
  );
}
