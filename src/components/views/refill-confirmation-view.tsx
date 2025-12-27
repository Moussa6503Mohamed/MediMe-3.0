"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ThumbsUp,
  DollarSign,
  Store,
  MapPin,
  Clock,
  Pill,
  Home,
} from "lucide-react";
import { DetailField } from "./detail-field";

export default function RefillConfirmationView() {
  const { navigate, lastOrder } = useAppStore();
  const { t } = useI18n();

  if (!lastOrder) {
    return <div>{t("orderSummary")}</div>;
  }

  const {
    medications,
    pharmacyName,
    deliveryAddress,
    deliveryTime,
    total,
    orderNumber,
  } = lastOrder;

  return (
    <div className="text-center py-12">
      <div className="p-6 inline-block bg-green-100 rounded-full mb-6">
        <ThumbsUp className="w-12 h-12 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-3">{t("orderPlaced")}</h1>
      <p className="text-lg text-gray-600 mb-8">{t("orderProcessing")}</p>

      <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 text-left">
        <div className="flex justify-between mb-3 border-b border-gray-100 pb-2">
          <p className="font-semibold text-gray-800">{t("orderNumber")}</p>
          <p className="font-bold text-primary">{orderNumber}</p>
        </div>
        <div className="space-y-3">
          <DetailField
            label={t("totalCharged")}
            value={`$${total}`}
            icon={<DollarSign className="text-green-500" />}
          />
          <DetailField
            label={t("deliveryPharmacy")}
            value={pharmacyName}
            icon={<Store className="text-cyan-500" />}
          />
          <DetailField
            label={t("deliveryAddress")}
            value={deliveryAddress.split(',')[0] + '...'}
            icon={<MapPin className="text-red-500" />}
          />
          <DetailField
            label={t("estDeliveryTime")}
            value={deliveryTime}
            icon={<Clock />}
          />
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="font-semibold text-gray-800">{t('medications')}:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
                {medications.map(med => <li key={med} className="text-sm text-gray-600">{t(med.toLowerCase() as any)}</li>)}
            </ul>
        </div>
      </div>
      <div className="space-y-3">
        <Button onClick={() => navigate('medication-manager-view')} className="w-full" size="lg">
            <Pill className="w-5 h-5 mr-2" />{t('backToMeds')}
        </Button>
        <Button onClick={() => navigate('home')} variant="outline" className="w-full" size="lg">
            <Home className="w-5 h-5 mr-2" />{t('goHome')}
        </Button>
      </div>
    </div>
  );
}
