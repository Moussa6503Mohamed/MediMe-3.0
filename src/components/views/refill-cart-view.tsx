"use client";

import { useAppStore } from "@/store/app-store";
import { medications } from "@/lib/data";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import { Pill, ShoppingCart, Truck, Trash2 } from "lucide-react";
import { Header } from "./header";

export default function RefillCartView() {
  const { navigate, refillCart, setRefillCart } = useAppStore();
  const { t } = useI18n();

  const medsInCart = medications.filter((m) => refillCart.includes(m.name));
  const subtotal = medsInCart.reduce((acc, med) => acc + med.price, 0);

  const handleRemove = (medName: string) => {
    setRefillCart(refillCart.filter((m) => m !== medName));
  };

  return (
    <div>
      <Header
        title={t("refillCart")}
        icon={<ShoppingCart />}
        backPage="medication-manager-view"
      />
      <div className="space-y-4 mb-8">
        {medsInCart.length > 0 ? (
          medsInCart.map((med) => (
            <div
              key={med.name}
              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <Pill className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {t(med.name.toLowerCase() as any)} ({med.dosage})
                  </p>
                  <p className="text-sm text-gray-500">{t(med.frequency.toLowerCase().replace(" ", "") as any)}</p>
                </div>
              </div>
              <div className="text-right flex items-center space-x-4">
                <p className="text-lg font-bold text-gray-800">
                  ${med.price.toFixed(2)}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(med.name)}
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground italic">{t("emptyCart")}</p>
        )}
      </div>

      {medsInCart.length > 0 && (
        <>
          <div className="p-6 bg-gray-50 rounded-2xl shadow-inner mb-8">
            <div className="flex justify-between text-xl font-bold text-gray-800">
              <p>
                {t("subtotal")} ({medsInCart.length} {t("cartItems")})
              </p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">{t("deliveryNote")}</p>
          </div>
          <Button
            onClick={() => navigate("select-pharmacy-view")}
            className="w-full"
            size="lg"
          >
            <Truck className="w-5 h-5 mr-2" />
            {t("proceedToPharmacySelection")}
          </Button>
        </>
      )}
    </div>
  );
}
