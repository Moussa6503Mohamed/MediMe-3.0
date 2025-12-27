# MediMe-3.0 Database Setup

This directory contains database schema, initialization scripts, and documentation for the MediMe-3.0 Healthcare Platform.

## Overview

MediMe-3.0 uses **Google Cloud Firestore** as its primary database. The database is designed to:
- Store patient, doctor, and admin data securely
- Support role-based access control (RBAC)
- Enable integration with MediMe_Admin dashboard
- Maintain audit trails for compliance
- Scale horizontally as the platform grows

## Files

- `schema.md` - Complete database schema documentation
- `init.ts` - Database initialization script
- `README.md` - This file

## Database Structure

### Collections

1. **`/patients/{patientId}`** - Patient profiles and health data
   - Subcollections: `appointments`, `medications`, `medicalReports`, `familyMembers`

2. **`/doctors/{doctorId}`** - Doctor profiles and credentials

3. **`/admins/{adminId}`** - Admin users for MediMe_Admin dashboard

4. **`/systemSettings`** - Global system configuration

5. **`/auditLogs/{logId}`** - Audit trail for admin actions

## Setup Instructions

### Prerequisites

1. Firebase project configured (already done in this repo)
2. Node.js 20+ installed
3. Firebase Admin SDK access (for initialization)

### Initial Setup

#### Option 1: Using Firebase Console (Recommended for Development)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `studio-7006252920-e1e93`
3. Navigate to Firestore Database
4. The database will be created automatically on first use
5. Security rules are already configured in `firestore.rules`

#### Option 2: Using Initialization Script

1. Set up Firebase Admin credentials:
   ```bash
   # For local development with emulator
   export FIRESTORE_EMULATOR_HOST="localhost:8080"
   
   # For production (requires service account)
   export FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
   ```

2. Install dependencies:
   ```bash
   npm install firebase-admin
   ```

3. Run the initialization script:
   ```bash
   npx tsx database/init.ts
   ```

4. The script will:
   - Initialize system settings
   - Create sample doctor profiles
   - Create a default admin user
   - Set up audit logging

### Default Admin Credentials

After running the initialization script:

```
Email: admin@medime-admin.com
Password: Admin@123456
Role: superadmin
```

**⚠️ IMPORTANT: Change the password immediately after first login!**

## MediMe_Admin Integration

### Setup Steps

1. **Same Firebase Project**: MediMe_Admin should use the same Firebase project ID: `studio-7006252920-e1e93`

2. **Authentication**: 
   - Admins authenticate using Firebase Auth with custom claims
   - Custom claims include:
     - `admin: true` - Identifies user as admin
     - `role: 'superadmin' | 'admin' | 'moderator'` - Admin role
     - `permissions: string[]` - Array of permissions

3. **Security Rules**: 
   - Firestore rules enforce role-based access
   - Admins can access all patient/doctor data (with proper permissions)
   - All admin actions should be logged to `auditLogs` collection

4. **API Integration**:
   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';
   
   // Use the same firebaseConfig from firebase-config.json
   const app = initializeApp(firebaseConfig);
   const auth = getAuth(app);
   const db = getFirestore(app);
   
   // Check if user is admin
   const user = auth.currentUser;
   const idTokenResult = await user.getIdTokenResult();
   const isAdmin = idTokenResult.claims.admin === true;
   const role = idTokenResult.claims.role;
   const permissions = idTokenResult.claims.permissions;
   ```

### Admin Permissions

- `manage_users` - Create/update/delete user accounts
- `manage_doctors` - Manage doctor profiles and credentials
- `manage_patients` - Access and modify patient records
- `manage_appointments` - View and manage all appointments
- `view_analytics` - Access system analytics and reports
- `manage_admins` - Create and manage other admin accounts
- `system_settings` - Modify global system configuration

### Role Hierarchy

1. **Superadmin** - Full access to all features and settings
2. **Admin** - Manage users, doctors, patients, appointments, and view analytics
3. **Moderator** - View-only access to analytics

## Security

### Firestore Security Rules

Security rules are defined in `/firestore.rules` and enforce:

1. **Patient Data**: Only accessible by the patient owner or admins with `manage_patients` permission
2. **Doctor Profiles**: Publicly readable, editable by owner or admins with `manage_doctors` permission
3. **Appointments**: Accessible by patient, assigned doctor, or admins with `manage_appointments` permission
4. **Admin Profiles**: Only accessible by admins with `manage_admins` permission
5. **System Settings**: Only readable by admins, writable by superadmins
6. **Audit Logs**: Read-only for admins, write-only via Cloud Functions

### Custom Claims Management

To add custom claims to a user (requires Firebase Admin SDK):

```typescript
import { getAuth } from 'firebase-admin/auth';

const auth = getAuth();

// Set admin claims
await auth.setCustomUserClaims(userId, {
  admin: true,
  role: 'admin',
  permissions: ['manage_users', 'view_analytics']
});
```

### Audit Logging

All admin actions should be logged to the `auditLogs` collection:

```typescript
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

await addDoc(collection(db, 'auditLogs'), {
  adminId: user.uid,
  adminEmail: user.email,
  action: 'update_patient',
  resourceType: 'patient',
  resourceId: patientId,
  details: { fields: ['firstName', 'lastName'] },
  timestamp: serverTimestamp(),
});
```

## Database Maintenance

### Backups

Firebase provides automatic daily backups. For manual backups:

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Click "Import/Export"
4. Export to Cloud Storage bucket

### Indexes

Composite indexes are automatically created when needed. Monitor the Firebase Console for index creation prompts.

### Data Retention

- Patient data: Retained indefinitely (per healthcare regulations)
- Audit logs: Retained for 7 years (configurable)
- Session data: Auto-expires after 30 days

## Development

### Local Testing with Emulator

1. Install Firebase emulator:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. Start emulator:
   ```bash
   firebase emulators:start --only firestore,auth
   ```

3. Configure app to use emulator:
   ```typescript
   if (process.env.NODE_ENV === 'development') {
     connectFirestoreEmulator(db, 'localhost', 8080);
     connectAuthEmulator(auth, 'http://localhost:9099');
   }
   ```

### Sample Queries

```typescript
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

// Get all appointments for a specific doctor
const q = query(
  collectionGroup(db, 'appointments'),
  where('doctorId', '==', doctorId),
  limit(50)
);
const snapshot = await getDocs(q);

// Get all patients (admin only)
const patientsRef = collection(db, 'patients');
const patientsSnapshot = await getDocs(patientsRef);

// Get system settings (admin only)
const settingsRef = doc(db, 'systemSettings', 'config');
const settingsSnap = await getDoc(settingsRef);
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Check Firestore security rules
   - Verify user has proper custom claims
   - Ensure user is authenticated

2. **Missing Index**
   - Click the error link to create the index in Firebase Console
   - Wait 1-2 minutes for index to build

3. **Admin Claims Not Working**
   - User must sign out and sign back in after claims are set
   - Token refresh may take up to 1 hour
   - Force token refresh: `await user.getIdToken(true)`

## Support

For issues or questions:
1. Check the [schema documentation](./schema.md)
2. Review Firebase security rules in `/firestore.rules`
3. Check Firebase Console for error logs
4. Contact the development team

## License

This database schema and setup is part of the MediMe-3.0 Healthcare Platform.
