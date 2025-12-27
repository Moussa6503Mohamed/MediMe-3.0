"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { pharmacies, medications } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  CreditCard,
  DollarSign,
  MapPin,
  Clock,
  Wallet,
  Truck,
} from "lucide-react";
import { Header } from "./header";
import { DetailField } from "./detail-field";
import { useToast } from "@/hooks/use-toast";

export default function RefillCheckoutView() {
  const { navigate, selectedPharmacyId, refillCart, setLastOrder, setRefillCart, setSelectedPharmacyId } = useAppStore();
  const { t } = useI18n();
  const { toast } = useToast();

  const pharmacy = pharmacies.find((p) => p.id === selectedPharmacyId);

  if (!pharmacy) {
    return <div>{t("noPharmacySelected")}</div>;
  }

  const subtotal = refillCart.reduce((total, medName) => {
    const med = medications.find((m) => m.name === medName);
    return total + (med ? med.price : 0);
  }, 0);

  const deliveryFee = pharmacy.fee;
  const netTotal = subtotal + deliveryFee;

  const placeOrder = () => {
    const orderDetails = {
        medications: refillCart,
        pharmacyName: pharmacy.name,
        deliveryAddress: pharmacy.address,
        deliveryTime: pharmacy.delivery,
        total: netTotal.toFixed(2),
        orderNumber: Math.floor(Math.random() * 100000) + 10000,
      };
      
    setLastOrder(orderDetails);
    setRefillCart([]);
    setSelectedPharmacyId(null);
    
    toast({
      title: t("refillOrderPlaced"),
    });
    navigate("refill-confirmation-view");
  };

  return (
    <div>
      <Header
        title={t("checkout")}
        icon={<CreditCard />}
        backPage="select-pharmacy-view"
      />
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {t("orderFrom")} {pharmacy.name}
        </h2>
        <div className="space-y-2 text-gray-700">
          <div className="flex justify-between">
            <p>
              {t("itemsSubtotal")} ({refillCart.length})
            </p>
            <p className="font-semibold">${subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <p>{t("deliveryFee")}</p>
            <p
              className={`font-semibold ${
                deliveryFee > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : "FREE"}
            </p>
          </div>
          <div className="flex justify-between text-2xl font-bold pt-2">
            <p>{t("total")}</p>
            <p>${netTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Truck className="w-6 h-6 mr-2 text-primary" /> {t("deliveryDetails")}
        </h3>
        <div className="space-y-4">
            <DetailField label={t("deliveryAddress")} value={`101 Mock Street, ${pharmacy.address.split(', ')[1]}`} icon={<MapPin className="text-red-500" />} />
            <DetailField label={t("estimatedDelivery")} value={pharmacy.delivery} icon={<Clock />} />
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Wallet className="w-6 h-6 mr-2 text-indigo-600" /> {t("paymentMethod")}
        </h3>
        <div className="p-4 bg-indigo-50 rounded-xl shadow-inner border border-indigo-200">
            <p className="text-lg font-semibold text-indigo-800">Visa ending in 4242</p>
            <p className="text-sm text-indigo-600">{t("chargeOnShipment", {amount: `$${netTotal.toFixed(2)}`})}</p>
        </div>
      </div>
      <Button onClick={placeOrder} size="lg" className="w-full font-extrabold text-lg bg-green-600 hover:bg-green-700">
        <CheckCircle className="w-5 h-5 mr-2" /> {t("placeOrderNow")}
      </Button>
    </div>
  );
}
