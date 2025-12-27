import type {
    Appointment,
    Medication,
    MedicalReport,
    FamilyMember,
    Doctor,
    Specialty,
    Locations,
    Pharmacy,
    ScheduleItem,
    Notification,
    Insurance,
    DoctorReport,
  } from "./types";
  
  
  export const familyMembers: FamilyMember[] = [];
  
  export const savedInsurance: Insurance | null = null;
  
  export const medications: Medication[] = [];
  
  export const dailySchedule: ScheduleItem[] = [];
  
  export const doctors: Doctor[] = [];
  
  export const specialties: Specialty[] = ['General Practitioner', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 'Ophthalmologist', 'Orthopedic Surgeon', 'Psychiatrist', 'Gynecologist', 'Endocrinologist', 'Gastroenterologist', 'Urologist'];
  
  export const locations: Locations = {
      'Egypt': {
          'Alexandria': ['Sedigaber', 'Smouha', 'Louran', 'Miami', 'Any Area'],
          'Cairo': ['Maadi', 'Zamalek', 'Heliopolis', 'Any Area'],
      },
      'USA': {
          'New York': ['Manhattan', 'Brooklyn', 'Queens', 'Any Area'],
          'Los Angeles': ['Hollywood', 'Santa Monica', 'Venice', 'Any Area'],
      }
  };
  
  export const pharmacies: Pharmacy[] = [];
    
  export const doctorReports: DoctorReport[] = [];

  export const upcomingAppointments: Omit<Appointment, 'id' | 'avatarUrl'>[] = [];
  
  export const currentMedications: Medication[] = [];

  export const recentReports: Omit<MedicalReport, 'id'>[] = [];
  
  export const notifications: Notification[] = [];
  
  
  
  

