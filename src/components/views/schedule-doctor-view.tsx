"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { specialties } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Stethoscope,
  MapPin,
  UserCheck,
} from "lucide-react";
import { Header } from "./header";
import { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Doctor } from "@/lib/types";

export default function ScheduleDoctorView() {
  const {
    navigate,
    selectedSpecialty,
    setSelectedSpecialty,
    selectedDate,
    setSelectedDate,
    selectedCity,
  } = useAppStore();
  const { t } = useI18n();
  const firestore = useFirestore();
  const [search, setSearch] = useState("");

  const filteredSpecialties = specialties.filter(s => s.toLowerCase().includes(search.toLowerCase()));

  const doctorsQuery = useMemoFirebase(() => {
    return query(
      collection(firestore, 'doctors'),
      where('specialization', '==', selectedSpecialty)
    );
  }, [firestore, selectedSpecialty]);

  const { data: availableDoctors, isLoading } = useCollection<Doctor>(doctorsQuery);

  return (
    <div className="pb-safe-footer">
      <Header
        title={t("consultDoctor")}
        icon={<Stethoscope />}
        backPage="home"
      />

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {t("findSpecialist")}
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
            <Button variant="outline" onClick={() => navigate('select-location-view')}>
                <MapPin className="w-4 h-4 mr-2" /> {selectedCity}
            </Button>
            <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                />
        </div>
        <Input placeholder={t("searchSpecialty")} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="flex space-x-3 mb-6 overflow-x-auto pb-2">
        {filteredSpecialties.map((spec) => (
          <Button
            key={spec}
            variant={selectedSpecialty === spec ? "default" : "outline"}
            onClick={() => setSelectedSpecialty(spec)}
            className="flex-shrink-0"
          >
            {spec}
          </Button>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {selectedSpecialty} Doctors ({availableDoctors?.length || 0})
      </h2>
      {isLoading && <p>Loading doctors...</p>}
      <div className="space-y-4">
        {availableDoctors && availableDoctors.length > 0 ? (
          availableDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="p-5 rounded-xl shadow-md border border-gray-100 bg-white flex flex-col cursor-pointer transition-all duration-150 hover:shadow-lg hover:scale-[1.02]"
              onClick={() => navigate("doctor-details-view", { activeDoctorId: doctor.id })}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {doctor.specialization}
                  </p>
                  <h3 className="text-xl font-bold text-card-foreground">
                    {doctor.name}
                  </h3>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("nextAvailableLabel")}
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    {doctor.nextAvailability}
                  </p>
                </div>
                <Button size="sm">
                  {t("bookNow")}
                </Button>
              </div>
            </div>
          ))
        ) : (
         !isLoading && <p className="text-muted-foreground italic p-4 bg-gray-50 rounded-xl">
            {t("noDoctorsFound", {
              specialty: selectedSpecialty,
              city: selectedCity,
            })}
          </p>
        )}
      </div>
    </div>
  );
}
