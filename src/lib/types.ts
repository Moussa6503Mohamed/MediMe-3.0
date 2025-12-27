import { type User } from "firebase/auth";

export type Appointment = {
    id: string;
    patientId: string;
    doctorId: string;
    appointmentDateTime: string; // ISO string
    reasonForVisit: string;
    notes?: string;
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
    doctorName?: string;
    specialty?: string;
  };
  
  export type Medication = {
    id: string;
    patientId: string;
    name: string;
    dosage: string;
    frequency: string;
    prescribingDoctor?: string;
    stockDoses: number;
    totalDoses: number;
    price: number;
    color?: string;
  };
  
  export type MedicalReport = {
    id: string;
    patientId: string;
    title: string;
    date: string; // ISO String
    type: string;
    doctor: string;
    diagnosis: string;
    symptoms: string;
    medications: string[];
    attachments: { type: string; name: string }[];
    color: string;
    textColor: string;
  };
  
  export type FamilyMember = {
    id: string;
    name: string;
    relationship: string;
    patientId: string;
    email?: string;
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
    
  export type Insurance = {
    provider: string;
    memberId: string;
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

  export type Patient = {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    contactNumber: string;
    email: string;
  };
    
