export type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  date: Date;
  time: string;
  location: string;
  avatarUrl: string;
};

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  refill_due: Date;
};

export type MedicalReport = {
  id: string;
  title: string;
  date: Date;
  type: string;
};

export type FamilyMember = {
  id: string;
  name: string;
  relationship: string;
  avatarUrl: string;
};
