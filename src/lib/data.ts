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
  
  export const dailySchedule: ScheduleItem[] = [
    {
      id: "appt-1",
      date: new Date(),
      time: "10:00 AM",
      type: "Appointment",
      title: "Cardiology Checkup",
      detail: "Dr. Amr Mostafa",
      isCompleted: true,
      icon: "Stethoscope",
      color: "bg-blue-100",
      textColor: "text-blue-800",
      location: "City Hospital, Cardiology Dept, Room 204",
      doctor: "Dr. Amr Mostafa",
      appointmentType: "Cardiology Checkup",
      facility: "City Hospital",
      department: "Cardiology",
      notes: "Bring last 3 months of blood pressure logs.",
    },
    {
      id: "med-1",
      date: new Date(),
      time: "12:00 PM",
      type: "Medication",
      title: "Multivitamin",
      detail: "1 Tablet",
      isCompleted: false,
      icon: "Pill",
      color: "bg-yellow-100",
      textColor: "text-yellow-800",
      notes: "Ensure food is eaten first for better absorption. Low stock - order refill!",
    },
    {
      id: "test-1",
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: "09:00 AM",
      type: "Test",
      title: "MRI Scan",
      detail: "City Hospital, Radiology Dept",
      isCompleted: false,
      icon: "TestTube",
      color: "bg-purple-100",
      textColor: "text-purple-800",
      location: "City Hospital, Radiology Dept",
      facility: "City Hospital",
      department: "Radiology",
      instructions: "Arrive 30 mins early. Do not eat for 4 hours prior. Remove all metal jewelry."
    },
  ];
  
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

  export const upcomingAppointments: Omit<Appointment, 'id' | 'patientId' | 'appointmentDateTime' | 'status' | 'reasonForVisit'>[] = [];
  
  export const currentMedications: Medication[] = [];

  export const recentReports: Omit<MedicalReport, 'id'>[] = [];
  
  export const notifications: Notification[] = [];
  
  
  
  
