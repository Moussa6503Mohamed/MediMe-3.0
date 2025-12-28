# Database Quick Start Guide

## For Developers

### 1. View Database Schema
```bash
cat database/schema.md
# or
npm run db:help
```

### 2. Database is Already Configured!

The database is **already set up** using Firebase Firestore. No manual setup is required for basic usage.

- **Firebase Project**: `studio-7006252920-e1e93`
- **Database**: Firestore (already configured)
- **Security Rules**: Already deployed in `firestore.rules`
- **Collections**: Will be created automatically on first use

### 3. Using the Database in Code

The database is already integrated in the application:

```typescript
import { initializeFirebase } from '@/firebase';

const { firestore } = initializeFirebase();

// Example: Get a patient document
import { doc, getDoc } from 'firebase/firestore';
const patientRef = doc(firestore, 'patients', userId);
const patientSnap = await getDoc(patientRef);

// Example: Query appointments
import { collection, query, where, getDocs } from 'firebase/firestore';
const appointmentsRef = collection(firestore, `patients/${patientId}/appointments`);
const q = query(appointmentsRef, where('status', '==', 'scheduled'));
const snapshot = await getDocs(q);
```

### 4. Optional: Initialize Sample Data (Development Only)

If you want to add sample doctors and admin users for testing:

```bash
# Install firebase-admin (if not already installed)
npm install firebase-admin

# Run the initialization script
npm run db:init
```

This will create:
- System settings
- 3 sample doctors
- 1 super admin account

**Default admin credentials:**
- Email: `admin@medime-admin.com`
- Password: `Admin@123456`

⚠️ **Important**: This should only be run in development/testing environments!

## For MediMe_Admin Integration

### Step 1: Use Same Firebase Project

Configure MediMe_Admin to use the same Firebase project:

```typescript
// In MediMe_Admin app
const firebaseConfig = {
  apiKey: "AIzaSyDfqmN9xmC-JvCmi2xGH7cVszIgLsuFUdk",
  authDomain: "studio-7006252920-e1e93.firebaseapp.com",
  projectId: "studio-7006252920-e1e93",
  storageBucket: "studio-7006252920-e1e93.firebasestorage.app",
  messagingSenderId: "970409829804",
  appId: "1:970409829804:web:193453d213858e30f8c609"
};
```

### Step 2: Check Admin Authentication

Admins must have custom claims set:

```typescript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;
const idTokenResult = await user.getIdTokenResult();

// Check if user is admin
const isAdmin = idTokenResult.claims.admin === true;
const role = idTokenResult.claims.role; // 'superadmin' | 'admin' | 'moderator'
const permissions = idTokenResult.claims.permissions; // Array of permissions
```

### Step 3: Access Control

The security rules automatically enforce admin permissions:

- **Admins with `manage_patients`**: Can read/update all patient data
- **Admins with `manage_doctors`**: Can read/update all doctor data
- **Admins with `manage_appointments`**: Can view/modify all appointments
- **Admins with `manage_admins`**: Can create/manage other admin accounts
- **Superadmins**: Can modify system settings

### Step 4: Audit Logging

All admin actions should be logged:

```typescript
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

await addDoc(collection(firestore, 'auditLogs'), {
  adminId: currentUser.uid,
  adminEmail: currentUser.email,
  action: 'update_patient',
  resourceType: 'patient',
  resourceId: patientId,
  details: { fieldsUpdated: ['firstName', 'email'] },
  timestamp: serverTimestamp(),
});
```

## Database Collections

### For Patients/Doctors (MediMe-3.0)
- `/patients/{patientId}` - Patient profiles
- `/patients/{patientId}/appointments/{appointmentId}` - Appointments
- `/patients/{patientId}/medications/{medicationId}` - Medications
- `/patients/{patientId}/medicalReports/{reportId}` - Medical reports
- `/patients/{patientId}/familyMembers/{memberId}` - Family members
- `/doctors/{doctorId}` - Doctor profiles

### For Admins (MediMe_Admin)
- `/admins/{adminId}` - Admin user profiles
- `/systemSettings/config` - Global system configuration
- `/auditLogs/{logId}` - Audit trail of admin actions

## Data Types

All TypeScript types are defined in `/src/lib/types.ts`:

```typescript
import type { 
  Patient, 
  Doctor, 
  Appointment, 
  Medication, 
  MedicalReport,
  Admin,
  SystemSettings,
  AuditLog 
} from '@/lib/types';
```

## Security

- Patient data is protected by user authentication
- Admins need custom claims to access patient/doctor data
- All admin actions are logged to audit trail
- Security rules are enforced server-side in Firestore
- Data is encrypted at rest and in transit

## Common Operations

### For Patients
```typescript
// Get my appointments
const myAppointments = collection(db, `patients/${userId}/appointments`);
const snapshot = await getDocs(myAppointments);

// Add new medication
await addDoc(collection(db, `patients/${userId}/medications`), {
  name: 'Aspirin',
  dosage: '100mg',
  frequency: 'Once daily',
  // ... other fields
});
```

### For Doctors
```typescript
// Get all my appointments across all patients
const appointmentsQuery = query(
  collectionGroup(db, 'appointments'),
  where('doctorId', '==', myDoctorId)
);
const myPatientAppointments = await getDocs(appointmentsQuery);
```

### For Admins
```typescript
// List all patients (admin only)
const patientsRef = collection(db, 'patients');
const allPatients = await getDocs(patientsRef);

// Get system settings (admin only)
const settingsRef = doc(db, 'systemSettings', 'config');
const settings = await getDoc(settingsRef);

// Query audit logs (admin only)
const logsQuery = query(
  collection(db, 'auditLogs'),
  where('adminId', '==', myAdminId),
  orderBy('timestamp', 'desc'),
  limit(50)
);
const myLogs = await getDocs(logsQuery);
```

## Troubleshooting

### "Permission denied" error
- Verify user is authenticated: `auth.currentUser !== null`
- For admin operations, verify custom claims are set
- Check Firestore security rules in `/firestore.rules`

### "Missing index" error
- Click the error link to auto-create the index in Firebase Console
- Or add the index manually in `/firestore.indexes.json`

### Custom claims not working
- User must sign out and back in after claims are set
- Force token refresh: `await user.getIdToken(true)`

## Need Help?

- Read full documentation: `database/README.md`
- View schema: `database/schema.md`
- Check security rules: `firestore.rules`
- Firebase Console: https://console.firebase.google.com/project/studio-7006252920-e1e93

---

**Remember**: The database is already set up and ready to use! Just start building features using the Firebase SDK as shown in the examples above.
