import type {
    Doctor,
    Specialty,
    Locations,
    Pharmacy,
    Notification,
    Insurance,
  } from "./types";
  
  export const savedInsurance: Insurance | null = {
    provider: 'Blue Cross Blue Shield',
    memberId: 'ABC12345678',
  };
  
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
  
  export const pharmacies: Pharmacy[] = [
      { id: 'ph-01', name: 'El-Ezaby Pharmacy', address: '123 Main St, Smouha', delivery: 'Today, 4-6 PM', fee: 5.00 },
      { id: 'ph-02', name: 'Seif Pharmacy', address: '456 Side St, Maadi', delivery: 'Today, 5-7 PM', fee: 0.00 },
  ];
    
  export const notifications: Notification[] = [
    {
      id: 1,
      typeKey: "notificationTypeAlert",
      messageKey: "notificationAmoxicillin",
      time: "5m ago",
      icon: "AlertTriangle",
      color: "text-red-800",
      bg: "bg-red-50"
    },
    {
      id: 2,
      typeKey: "notificationTypeAppointment",
      messageKey: "notificationAppointment",
      time: "30m ago",
      icon: "Check",
      color: "text-green-800",
      bg: "bg-green-50"
    },
    {
      id: 3,
      typeKey: "notificationTypeUpdate",
      messageKey: "notificationLabResults",
      time: "1h ago",
      icon: "ClipboardList",
      color: "text-blue-800",
      bg: "bg-blue-50"
    },
    {
      id: 4,
      typeKey: "notificationTypeMedication",
      messageKey: "notificationMultivitamin",
      time: "3h ago",
      icon: "Pill",
      color: "text-yellow-800",
      bg: "bg-yellow-50"
    },
     {
      id: 5,
      typeKey: "notificationTypeInvitation",
      customMessage: "Ahmed El-Sayed has invited you to join their family health circle.",
      messageKey: "invitationMessage",
      time: "1d ago",
      icon: "UserPlus",
      color: "text-emerald-800",
      bg: "bg-emerald-50"
    }
  ];
  
