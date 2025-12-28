# Database Structure Diagram

```
MediMe-3.0 Firebase Project
│
├── 🔐 Authentication
│   ├── Patients (email/password)
│   ├── Doctors (email/password)
│   └── Admins (email/password + custom claims)
│       ├── Custom Claims:
│       │   ├── admin: true
│       │   ├── role: 'superadmin' | 'admin' | 'moderator'
│       │   └── permissions: ['manage_users', ...]
│
└── 📦 Firestore Database
    │
    ├── 👤 /patients/{patientId}
    │   ├── Fields: id, firstName, lastName, email, dateOfBirth, etc.
    │   ├── Security: Owner only (or admin with manage_patients)
    │   │
    │   ├── 📅 /appointments/{appointmentId}
    │   │   ├── Fields: patientId, doctorId, dateTime, status, etc.
    │   │   └── Security: Patient, assigned doctor, or admin
    │   │
    │   ├── 💊 /medications/{medicationId}
    │   │   ├── Fields: name, dosage, frequency, etc.
    │   │   └── Security: Patient only (or admin with manage_patients)
    │   │
    │   ├── 📋 /medicalReports/{reportId}
    │   │   ├── Fields: title, type, diagnosis, attachments, etc.
    │   │   └── Security: Patient only (or admin with manage_patients)
    │   │
    │   └── 👨‍👩‍👧‍👦 /familyMembers/{memberId}
    │       ├── Fields: name, relationship, patientId, etc.
    │       └── Security: Patient only
    │
    ├── 👨‍⚕️ /doctors/{doctorId}
    │   ├── Fields: id, firstName, lastName, specialty, etc.
    │   ├── Security: Read by all, write by owner or admin
    │   └── Note: Publicly searchable profiles
    │
    ├── 🔧 /admins/{adminId}  [NEW for MediMe_Admin]
    │   ├── Fields: id, firstName, lastName, role, permissions, etc.
    │   ├── Security: Admin only (read own or manage_admins)
    │   └── Purpose: Admin user management
    │
    ├── ⚙️ /systemSettings/config  [NEW for MediMe_Admin]
    │   ├── Fields: maintenanceMode, allowRegistrations, etc.
    │   ├── Security: Read by admins, write by superadmin only
    │   └── Purpose: Global system configuration
    │
    └── 📜 /auditLogs/{logId}  [NEW for MediMe_Admin]
        ├── Fields: adminId, action, resourceType, timestamp, etc.
        ├── Security: Read by admins, write by Cloud Functions only
        └── Purpose: Compliance and audit trail
```

## Data Flow

### For Patients/Doctors (MediMe-3.0 App)
```
Patient Login
    ↓
Firebase Auth
    ↓
Access Own Data → /patients/{userId}/*
    ↓
Book Appointment → /patients/{userId}/appointments/{id}
    ↓
Doctor Can View → via doctorId field
```

### For Admins (MediMe_Admin Dashboard)
```
Admin Login
    ↓
Firebase Auth + Custom Claims
    ↓
Check Permissions → idToken.claims.permissions
    ↓
Access Based on Permissions:
    ├── manage_patients → View/Edit all /patients/*
    ├── manage_doctors → View/Edit all /doctors/*
    ├── manage_appointments → View/Edit all appointments
    ├── view_analytics → Query aggregated data
    ├── manage_admins → Create/Edit /admins/*
    └── system_settings → Edit /systemSettings/*
    ↓
Log Action → /auditLogs/{id}
```

## Security Hierarchy

```
┌─────────────────────────────────────┐
│         Superadmin                  │
│  • Full system access               │
│  • Manage system settings           │
│  • All permissions                  │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│           Admin                     │
│  • Manage users/doctors/patients    │
│  • View/edit appointments           │
│  • Access analytics                 │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│         Moderator                   │
│  • View analytics only              │
│  • Read-only access                 │
└─────────────────────────────────────┘
             │
┌────────────▼────────────────────────┐
│      Regular Users                  │
│  • Patients: Own data only          │
│  • Doctors: Own profile + assigned  │
│    patient appointments             │
└─────────────────────────────────────┘
```

## Integration Points

### MediMe-3.0 ↔ MediMe_Admin
```
Same Firebase Project
        ↓
Shared Collections:
  • /patients/*
  • /doctors/*
  • /appointments/* (subcollection)
        ↓
Admin-Specific:
  • /admins/*
  • /systemSettings/*
  • /auditLogs/*
        ↓
Real-time Sync
(Changes visible immediately)
```

## Query Patterns

### Patient View
```typescript
// My appointments
collection(db, `patients/${myId}/appointments`)

// My medications
collection(db, `patients/${myId}/medications`)
```

### Doctor View
```typescript
// All my appointments across patients
collectionGroup(db, 'appointments')
  .where('doctorId', '==', myDoctorId)
```

### Admin View (with permissions)
```typescript
// All patients (requires manage_patients)
collection(db, 'patients')

// All appointments (requires manage_appointments)
collectionGroup(db, 'appointments')

// Audit logs (requires admin)
collection(db, 'auditLogs')
  .orderBy('timestamp', 'desc')
```

## Index Strategy

Composite indexes created for:
- Appointments by doctor + date
- Appointments by status + date
- Audit logs by admin + time
- Audit logs by resource + time

Single-field indexes automatically created by Firestore for all fields.
