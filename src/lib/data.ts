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
  
  
  export const familyMembers: FamilyMember[] = [
      { id: 'aa-001', name: 'Mohamed Moussa', relationship: 'Self', dob: 'January 1, 1980', bloodType: 'O+', primaryDoctor: 'Dr. Amr Mostafa' },
      { id: 'ah-002', name: 'Mohamed Ashraf', relationship: 'Brother', dob: 'May 10, 1978', bloodType: 'A-', primaryDoctor: 'Dr. Sara Emad' },
      { id: 'ya-003', name: 'Youssef El Bezry', relationship: 'Child', dob: 'August 15, 2015', bloodType: 'B+', primaryDoctor: 'Dr. Mona Kamal' },
      { id: 'ya-004', name: 'Youssef Awaad', relationship: 'Child', dob: 'March 22, 2017', bloodType: 'O-', primaryDoctor: 'Dr. Mona Kamal' },
  ];
  
  export const savedInsurance: Insurance = { provider: 'Blue Cross Blue Shield', memberId: 'ABC12345678' };
  
  export const medications: Medication[] = [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once Daily', prescribingDoctor: 'Dr. Hussein', stockDoses: 28, totalDoses: 30, color: 'text-cyan-700', price: 25.50 },
      { name: 'Multivitamin', dosage: '1 tab', frequency: 'Daily', prescribingDoctor: 'Dr. Hussein', stockDoses: 5, totalDoses: 90, color: 'text-orange-700', price: 15.00 },
      { name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice Daily', prescribingDoctor: 'Dr. Abdel-Fattah', stockDoses: 1, totalDoses: 14, color: 'text-red-700', price: 30.75 },
  ];
  
  export const dailySchedule: ScheduleItem[] = [
      { id: 'sch-001', date: new Date(), time: '08:00 AM', type: 'Medication', title: 'Lisinopril (10mg)', detail: 'Take with water', isCompleted: true, icon: 'Pill', color: 'bg-cyan-100', textColor: 'text-cyan-800', notes: 'Refill due next week. Check blood pressure before taking.' },
      { id: 'sch-002', date: new Date(), time: '10:30 AM', type: 'Appointment', title: 'Dr. Abdel-Fattah Ahmed', detail: 'Cardiology Checkup · Room 204', isCompleted: false, icon: 'Stethoscope', color: 'bg-purple-100', textColor: 'text-purple-800', location: 'City Hospital, Cardiology Dept, Room 204', doctor: 'Dr. Abdel-Fattah Ahmed', appointmentType: 'Cardiology Checkup', notes: 'Bring last 3 months of blood pressure logs.' },
      { id: 'sch-003', date: new Date(), time: '01:00 PM', type: 'Reminder', title: 'Multivitamin', detail: '1 Tablet with lunch', isCompleted: false, icon: 'Pill', color: 'bg-orange-100', textColor: 'text-orange-800', notes: 'Ensure food is eaten first for better absorption. Low stock - order refill!' },
      { id: 'sch-004', date: new Date(), time: '04:00 PM', type: 'Test', title: 'MRI Scan', detail: 'City Hospital · Radiology Dept', isCompleted: false, icon: 'TestTube', color: 'bg-indigo-100', textColor: 'text-indigo-800', facility: 'City Hospital', department: 'Radiology Dept', instructions: 'Arrive 30 mins early. Do not eat for 4 hours prior. Remove all metal jewelry.' },
      { id: 'sch-005', date: new Date(), time: '08:00 PM', type: 'Medication', title: 'Amoxicillin (500mg)', detail: 'Before bed', isCompleted: false, icon: 'Pill', color: 'bg-red-100', textColor: 'text-red-800', notes: 'Complete the full 7-day course, even if feeling better.' },
  ];
  
  export const doctors: Doctor[] = [
      { id: 'dr-emad', name: 'Dr. Sara Emad', specialization: 'Cardiologist', bio: 'Specializing in complex heart rhythms and preventative care.', location: 'City Hospital', price: 250, nextAvailability: 'Today, 3:00 PM', education: 'MD, Harvard Medical School', experience: '12 Years' },
      { id: 'dr-mostafa', name: 'Dr. Amr Mostafa', specialization: 'General Practitioner', bio: '15 years experience in family and internal medicine.', location: 'Northside Clinic', price: 120, nextAvailability: 'Tomorrow, 9:00 AM', education: 'MD, Cairo University', experience: '15 Years' },
      { id: 'dr-kamal', name: 'Dr. Mona Kamal', specialization: 'Dermatologist', bio: 'Expert in pediatric dermatology and cosmetic procedures.', location: 'DermCare Center', price: 180, nextAvailability: 'Fri, 11:00 AM', education: 'MBBS, USC School of Medicine', experience: '8 Years' },
      { id: 'dr-fathy', name: 'Dr. Hany Fathy', specialization: 'Neurologist', bio: 'Focus on chronic headaches, migraines, and epilepsy.', location: 'Central Medical Center', price: 300, nextAvailability: 'Today, 5:00 PM', education: 'MD, Columbia University', experience: '20 Years' },
  ];
  
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
      { id: 'ph1', name: 'El-Ezaby', address: '123 Main St, Alexandria', delivery: '1-2 Days', fee: 5.00 },
      { id: 'ph2', name: 'Seif Pharmacy', address: '456 Smouha Rd, Alexandria', delivery: 'Same Day (Pickup Only)', fee: 0.00 },
      { id: 'ph3', name: 'El Beesy Pharmacy', address: '789 City Center, Cairo', delivery: '2-3 Days', fee: 7.50 },
  ];
  
  export const medicalRecords = [
      { date: '2023-10-15', description: 'Annual Physical Exam', type: 'Checkup' },
      { date: '2022-07-01', description: 'Tonsillectomy', type: 'Surgery' },
      { date: '2021-03-20', description: 'Flu Shot (2021)', type: 'Immunization' },
  ];
  
  export const notifications: Notification[] = [
      { id: 1, typeKey: 'notificationTypeInvitation', messageKey: 'invitationMessage', customMessage: 'Ahmed El-Sayed has invited you to join their family health circle', time: '30 mins ago', icon: 'UserPlus', color: 'text-green-600', bg: 'bg-green-50' },
      { id: 2, typeKey: 'notificationTypeAlert', messageKey: 'notificationAmoxicillin', time: '1 hour ago', icon: 'AlertTriangle', color: 'text-red-600', bg: 'bg-red-50' },
      { id: 3, typeKey: 'notificationTypeAppointment', messageKey: 'notificationAppointment', time: '2 hours ago', icon: 'Check', color: 'text-purple-600', bg: 'bg-purple-50' },
      { id: 4, typeKey: 'notificationTypeUpdate', messageKey: 'notificationLabResults', time: '3 hours ago', icon: 'ClipboardList', color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { id: 5, typeKey: 'notificationTypeMedication', messageKey: 'notificationMultivitamin', time: '5 hours ago', icon: 'Pill', color: 'text-orange-600', bg: 'bg-orange-50' },
  ];
    
  export const doctorReports: DoctorReport[] = [
      {
          id: 'rep-001',
          date: '2023-11-15',
          title: 'Routine Cardiology Checkup',
          doctor: 'Dr. Abdel-Fattah Ahmed (Cardiologist)',
          location: 'City Hospital',
          symptoms: 'Mild shortness of breath during heavy exertion, occasional chest tightness (Grade 1).',
          diagnosis: 'Stable Angina Pectoris. Condition is well-managed. Continue current medication and lifestyle modifications.',
          medications: ['Lisinopril (10mg) - Continue', 'Aspirin (81mg) - Continue'],
          attachments: [
              { type: 'Lab Result', name: 'Blood Panel - Nov 2023' },
              { type: 'Handwritten Notes', name: 'Doctor\'s Scrawl (PDF)' }
          ],
          color: 'bg-purple-100',
          textColor: 'text-purple-800'
      },
      {
          id: 'rep-002',
          date: '2023-09-01',
          title: 'Annual Physical Exam',
          doctor: 'Dr. Hussein Ahmed (General Practitioner)',
          location: 'Northside Clinic',
          symptoms: 'Fatigue, minor seasonal allergies, general checkup.',
          diagnosis: 'Viral rhinitis (common cold). All vitals are within normal range. Overall good health.',
          medications: ['Multivitamin - Start Daily', 'Zyrtec (as needed)'],
          attachments: [
              { type: 'X-Ray', name: 'Chest X-Ray - Sept 2023' },
              { type: 'Handwritten Notes', name: 'Prescription Scrawl' }
          ],
          color: 'bg-teal-100',
          textColor: 'text-teal-800'
      },
  ];

  export const upcomingAppointments: Omit<Appointment, 'id' | 'avatarUrl'>[] = [
    {
      doctor: "Dr. Abdel-Fattah Ahmed",
      specialty: "Cardiology",
      date: new Date("2024-07-26T10:30:00"),
      time: "10:30 AM",
      location: "City Hospital, Room 204",
    },
    {
      doctor: "Dr. Hussein Ahmed",
      specialty: "General Practice",
      date: new Date("2024-08-05T14:00:00"),
      time: "02:00 PM",
      location: "Northside Clinic",
    },
  ].map(appt => ({ ...appt, id: crypto.randomUUID(), avatarUrl: '' }));
  
  export const currentMedications: Medication[] = [
    {
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once Daily",
      prescribingDoctor: "Dr. Hussein",
      stockDoses: 28,
      totalDoses: 30,
      color: 'text-cyan-700',
      price: 25.50
    },
    {
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "Twice Daily",
      prescribingDoctor: "Dr. Abdel-Fattah",
      stockDoses: 1,
      totalDoses: 14,
      color: 'text-red-700',
      price: 30.75
    },
    {
      name: "Multivitamin",
      dosage: "1 tab",
      frequency: "Daily",
      prescribingDoctor: "Dr. Hussein",
      stockDoses: 5,
      totalDoses: 90,
      color: 'text-orange-700',
      price: 15.00
    },
  ];

  export const recentReports: Omit<MedicalReport, 'id'>[] = [
    {
        title: "Blood Panel Results",
        date: new Date("2024-07-15"),
        type: "Lab Result"
    },
    {
        title: "Cardiology Follow-Up Notes",
        date: new Date("2024-07-10"),
        type: "Doctor's Note"
    },
    {
        title: "Chest X-Ray Analysis",
        date: new Date("2024-07-01"),
        type: "Imaging"
    }
  ].map(report => ({ ...report, id: crypto.randomUUID() }));
  
  
  
  
  
  
