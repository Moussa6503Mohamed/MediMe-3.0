"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { locations } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { MapPin, Check } from "lucide-react";
import { Header } from "./header";

export default function SelectLocationView() {
  const {
    navigate,
    selectedCountry,
    setSelectedCountry,
    selectedCity,
    setSelectedCity,
    selectedArea,
    setSelectedArea,
  } = useAppStore();
  const { t } = useI18n();

  const countries = Object.keys(locations);
  const cities = Object.keys(locations[selectedCountry] || {});
  const areas = (locations[selectedCountry]?.[selectedCity] || []) as string[];

  return (
    <div>
      <Header
        title={t("selectLocation")}
        icon={<MapPin />}
        backPage="schedule-doctor-view"
      />
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t("country")}</h2>
        <div className="flex flex-wrap gap-2">
          {countries.map((country) => (
            <Button
              key={country}
              variant={selectedCountry === country ? "default" : "outline"}
              onClick={() => {
                setSelectedCountry(country as any);
                setSelectedCity(Object.keys(locations[country as "Egypt" | "USA"])[0]);
                setSelectedArea(t("anyArea"));
              }}
            >
              {country}
            </Button>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t("city")}</h2>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <Button
              key={city}
              variant={selectedCity === city ? "default" : "outline"}
              onClick={() => {
                setSelectedCity(city);
                setSelectedArea(t("anyArea"));
              }}
            >
              {city}
            </Button>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t("area")}</h2>
        <div className="flex flex-wrap gap-2">
          {areas.map((area) => (
            <Button
              key={area}
              variant={selectedArea === area ? "default" : "outline"}
              onClick={() => setSelectedArea(area)}
            >
              {area}
            </Button>
          ))}
        </div>
      </div>

      <Button
        onClick={() => navigate("schedule-doctor-view")}
        className="w-full"
        size="lg"
      >
        <Check className="w-5 h-5 mr-2" /> {t("confirmLocation")}
      </Button>
    </div>
  );
}
