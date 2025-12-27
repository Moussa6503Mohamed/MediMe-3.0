import { type User } from "firebase/auth";

export type Appointment = {
    id: string;
    doctor: string;
    specialty: string;
    date: Date;
    time: string;
    location: string;
  };
  
  export type Medication = {
    name: string;
    dosage: string;
    frequency: string;
    prescribingDoctor: string;
    stockDoses: number;
    totalDoses: number;
    color: string;
    price: number;
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
    dob: string;
    bloodType: string;
    primaryDoctor: string;
  };
  
  export type Doctor = {
    id: string;
    name: string;
    specialization: string;
    bio: string;
    location: string;
    price: number;
    nextAvailability: string;
    education: string;
    experience: string;
  };
  
  export type Specialty = string;
  
  export type Locations = {
    [country: string]: {
      [city: string]: string[];
    };
  };
  
  export type Pharmacy = {
    id: string;
    name: string;
    address: string;
    delivery: string;
    fee: number;
  };
  
  export type ScheduleItem = {
    id: string;
    date: Date;
    time: string;
    type: "Medication" | "Appointment" | "Reminder" | "Test";
    title: string;
    detail: string;
    isCompleted: boolean;
    icon: string;
    color: string;
    textColor: string;
    notes?: string;
    location?: string;
    doctor?: string;
    appointmentType?: string;
    facility?: string;
    department?: string;
    instructions?: string;
  };
  
  export type Notification = {
    id: number;
    typeKey: string;
    messageKey: string;
    customMessage?: string;
    time: string;
    icon: string;
    color: string;
    bg: string;
  };
  
  export type ActionButton = {
    id: string;
    labelKey: string;
    icon: React.ReactNode;
    color: string;
    descriptionKey: string;
    nav: string;
  };
  
  export type Insurance = {
    provider: string;
    memberId: string;
  };

  export type DoctorReport = {
    id: string;
    date: string;
    title: string;
    doctor: string;
    location: string;
    symptoms: string;
    diagnosis: string;
    medications: string[];
    attachments: {
      type: string;
      name: string;
    }[];
    color: string;
    textColor: string;
  };
  
  export type OrderDetails = {
    medications: string[];
    pharmacyName: string;
    deliveryAddress: string;
    deliveryTime: string;
    total: string;
    orderNumber: number;
  };

  export type CurrentUser = User;
  
