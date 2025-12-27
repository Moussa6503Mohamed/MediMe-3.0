import type {
  Appointment,
  Medication,
  MedicalReport,
  FamilyMember,
} from "./types";

export const upcomingAppointments: Appointment[] = [
  {
    id: "1",
    doctor: "Dr. Aisha Ahmed",
    specialty: "Cardiologist",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    time: "10:30 AM",
    location: "CardioCare Clinic",
    avatarUrl: "https://picsum.photos/seed/doc1/40/40",
  },
  {
    id: "2",
    doctor: "Dr. Ben Carter",
    specialty: "Dermatologist",
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    time: "02:00 PM",
    location: "SkinHealth Center",
    avatarUrl: "https://picsum.photos/seed/doc2/40/40",
  },
];

export const currentMedications: Medication[] = [
  {
    id: "med1",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    refill_due: new Date(new Date().setDate(new Date().getDate() + 10)),
  },
  {
    id: "med2",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    refill_due: new Date(new Date().setDate(new Date().getDate() + 18)),
  },
  {
    id: "med3",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    refill_due: new Date(new Date().setDate(new Date().getDate() + 25)),
  },
];

export const recentReports: MedicalReport[] = [
  {
    id: "rep1",
    title: "Annual Blood Panel",
    date: new Date(new Date().setDate(new Date().getDate() - 14)),
    type: "Lab Result",
  },
  {
    id: "rep2",
    title: "Cardiology Consultation",
    date: new Date(new Date().setDate(new Date().getDate() - 30)),
    type: "Doctor's Note",
  },
    {
    id: "rep3",
    title: "X-Ray: Left Knee",
    date: new Date(new Date().setDate(new Date().getDate() - 45)),
    type: "Imaging",
  },
];

export const familyMembers: FamilyMember[] = [
  {
    id: "fam1",
    name: "You",
    relationship: "Self",
    avatarUrl: "https://picsum.photos/seed/user1/40/40",
  },
  {
    id: "fam2",
    name: "Fatima Al-Jamil",
    relationship: "Spouse",
    avatarUrl: "https://picsum.photos/seed/user2/40/40",
  },
  {
    id: "fam3",
    name: "Omar Al-Jamil",
    relationship: "Son",
    avatarUrl: "https://picsum.photos/seed/user3/40/40",
  },
];

export const userProfile = {
  name: "Saleh Al-Jamil",
  email: "saleh.aljamil@example.com",
  avatarUrl: "https://picsum.photos/seed/user1/40/40",
};
