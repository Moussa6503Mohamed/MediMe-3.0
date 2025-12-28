# MediMe-3.0 Database Schema

## Overview
MediMe-3.0 uses Google Cloud Firestore as its database. This document describes the complete database schema including collections, subcollections, and their relationships.

## Authentication
- **Provider**: Firebase Authentication
- **Methods**: Email/Password, Anonymous
- **User Types**: Patient, Doctor, Admin

## Top-Level Collections

### 1. `/patients/{patientId}`
Stores patient profile information.

**Fields:**
- `id` (string, required): Unique identifier (matches auth UID)
- `firstName` (string, required): Patient's first name
- `lastName` (string, required): Patient's last name
- `dateOfBirth` (string, required): Date of birth (ISO format)
- `gender` (string, required): Patient's gender
- `contactNumber` (string, required): Contact phone number
- `email` (string, required): Email address
- `address` (string, optional): Physical address
- `medicalHistory` (string, optional): Medical history summary
- `insuranceProvider` (string, optional): Insurance company name
- `insurancePolicyNumber` (string, optional): Insurance policy number
- `allergies` (array of strings, optional): List of allergies
- `primaryDoctor` (string, optional): Primary care physician name
- `emergencyContactName` (string, optional): Emergency contact name
- `emergencyContactPhone` (string, optional): Emergency contact phone
- `createdAt` (timestamp): Account creation timestamp
- `updatedAt` (timestamp): Last update timestamp

**Security**: Owned by patient (patientId must match auth UID)

#### Subcollections:

##### `/patients/{patientId}/appointments/{appointmentId}`
Stores patient appointments.

**Fields:**
- `id` (string, required): Unique appointment identifier
- `patientId` (string, required): Reference to patient (immutable)
- `doctorId` (string, required): Reference to doctor (immutable after creation)
- `appointmentDateTime` (string, required): Appointment date/time (ISO format)
- `reasonForVisit` (string, required): Visit reason
- `notes` (string, optional): Additional notes
- `status` (string, required): 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
- `doctorName` (string, optional): Denormalized doctor name
- `specialty` (string, optional): Denormalized doctor specialty
- `createdAt` (timestamp): Creation timestamp
- `updatedAt` (timestamp): Last update timestamp

**Security**: Accessible by patient and assigned doctor

##### `/patients/{patientId}/medications/{medicationId}`
Stores patient medications.

**Fields:**
- `id` (string, required): Unique medication identifier
- `patientId` (string, required): Reference to patient
- `name` (string, required): Medication name
- `dosage` (string, required): Dosage information
- `frequency` (string, required): Dosing frequency
- `route` (string, required): Administration route (oral, topical, etc.)
- `startDate` (string, required): Start date (ISO format)
- `endDate` (string, optional): End date (ISO format)
- `prescribingDoctor` (string, optional): Prescribing physician name
- `stockDoses` (number, optional): Remaining doses
- `totalDoses` (number, optional): Total prescribed doses
- `price` (number, optional): Medication price
- `color` (string, optional): UI color for display
- `notes` (string, optional): Additional notes
- `createdAt` (timestamp): Creation timestamp
- `updatedAt` (timestamp): Last update timestamp

**Security**: Only accessible by patient

##### `/patients/{patientId}/medicalReports/{medicalReportId}`
Stores patient medical reports and lab results.

**Fields:**
- `id` (string, required): Unique report identifier
- `patientId` (string, required): Reference to patient
- `title` (string, required): Report title
- `date` (string, required): Report date (ISO format)
- `type` (string, required): Report type (lab, radiology, etc.)
- `doctor` (string, required): Ordering physician
- `diagnosis` (string, optional): Diagnosis information
- `symptoms` (string, optional): Symptoms noted
- `medications` (array of strings, optional): Related medications
- `reportContent` (string, required): Report content
- `attachments` (array, optional): File attachments
  - `type` (string): File type
  - `name` (string): File name
  - `url` (string): File URL
- `color` (string, optional): UI color for display
- `textColor` (string, optional): UI text color
- `notes` (string, optional): Additional notes
- `createdAt` (timestamp): Creation timestamp
- `updatedAt` (timestamp): Last update timestamp

**Security**: Only accessible by patient

##### `/patients/{patientId}/familyMembers/{familyMemberId}`
Stores references to family members in health circle.

**Fields:**
- `id` (string, required): Unique identifier
- `patientId` (string, required): Reference to the patient this family member represents
- `name` (string, required): Family member's full name
- `relationship` (string, required): Relationship type (spouse, child, parent, etc.)
- `email` (string, optional): Email for invitations
- `createdAt` (timestamp): Creation timestamp

**Security**: Only accessible by patient

---

### 2. `/doctors/{doctorId}`
Stores doctor profile information.

**Fields:**
- `id` (string, required): Unique identifier (matches auth UID)
- `firstName` (string, required): Doctor's first name
- `lastName` (string, required): Doctor's last name
- `name` (string, optional): Full name (denormalized)
- `specialty` (string, required): Medical specialty
- `specialization` (string, optional): Specialization detail
- `contactNumber` (string, required): Contact phone number
- `email` (string, required): Email address
- `address` (string, optional): Practice address
- `location` (string, optional): Practice location/city
- `hospitalAffiliation` (string, optional): Affiliated hospital
- `bio` (string, optional): Professional biography
- `education` (string, optional): Educational background
- `experience` (string, optional): Years/type of experience
- `price` (number, optional): Consultation fee
- `nextAvailability` (string, optional): Next available slot
- `createdAt` (timestamp): Account creation timestamp
- `updatedAt` (timestamp): Last update timestamp

**Security**: Readable by all authenticated users, writable only by owner

---

### 3. `/admins/{adminId}` (NEW)
Stores administrator profile information for MediMe_Admin integration.

**Fields:**
- `id` (string, required): Unique identifier (matches auth UID)
- `firstName` (string, required): Admin's first name
- `lastName` (string, required): Admin's last name
- `email` (string, required): Email address
- `role` (string, required): Admin role ('superadmin' | 'admin' | 'moderator')
- `permissions` (array of strings, required): List of permissions
  - 'manage_users'
  - 'manage_doctors'
  - 'manage_patients'
  - 'manage_appointments'
  - 'view_analytics'
  - 'manage_admins'
  - 'system_settings'
- `active` (boolean, required): Account active status
- `lastLogin` (timestamp, optional): Last login timestamp
- `createdAt` (timestamp): Account creation timestamp
- `updatedAt` (timestamp): Last update timestamp
- `createdBy` (string, optional): Admin who created this account

**Security**: Only accessible by admins with 'manage_admins' permission

---

### 4. `/systemSettings` (NEW)
Global system settings for admin management.

**Document**: `/systemSettings/config`

**Fields:**
- `maintenanceMode` (boolean): System maintenance status
- `allowNewRegistrations` (boolean): Allow new user registrations
- `adminEmailDomain` (string): Allowed email domain for admin accounts
- `maxAppointmentsPerDay` (number): System-wide appointment limit
- `notificationSettings` (object): Notification configurations
- `updatedAt` (timestamp): Last update timestamp
- `updatedBy` (string): Admin who made last update

**Security**: Only accessible by superadmins

---

### 5. `/auditLogs/{logId}` (NEW)
Audit trail for admin actions.

**Fields:**
- `id` (string, required): Unique log identifier
- `adminId` (string, required): Admin who performed action
- `adminEmail` (string, required): Admin email
- `action` (string, required): Action type
- `resourceType` (string, required): Affected resource type
- `resourceId` (string, optional): Affected resource ID
- `details` (object, optional): Action details
- `ipAddress` (string, optional): Request IP address
- `timestamp` (timestamp, required): Action timestamp

**Security**: Only readable by admins, auto-generated by Cloud Functions

---

## Relationships

### One-to-Many
- Patient → Appointments (1:N)
- Patient → Medications (1:N)
- Patient → MedicalReports (1:N)
- Patient → FamilyMembers (1:N)
- Doctor → Appointments (1:N)

### Many-to-Many (via references)
- Patient ↔ Doctor (through appointments)
- Patient ↔ Patient (through familyMembers)

---

## Indexes

### Composite Indexes Required:
1. **Appointments by Doctor and Date**
   - Collection: `patients/{patientId}/appointments`
   - Fields: `doctorId` (Ascending), `appointmentDateTime` (Ascending)

2. **Appointments by Status and Date**
   - Collection: `patients/{patientId}/appointments`
   - Fields: `status` (Ascending), `appointmentDateTime` (Ascending)

3. **Audit Logs by Admin and Time**
   - Collection: `auditLogs`
   - Fields: `adminId` (Ascending), `timestamp` (Descending)

---

## MediMe_Admin Integration

### Admin Access Patterns:
1. **User Management**: Admins can view/edit patient and doctor profiles
2. **Appointment Management**: Admins can view/modify all appointments
3. **Analytics**: Admins can query aggregated data
4. **System Configuration**: Superadmins can modify system settings
5. **Audit Trail**: All admin actions are logged

### Integration Points:
- Shared Firebase project
- Admin authentication separate from patient/doctor auth
- Role-based access control (RBAC) via custom claims
- Audit logging for compliance
- Real-time sync between MediMe-3.0 and MediMe_Admin

---

## Data Migration

For existing data:
1. Run database initialization script
2. Create admin users
3. Set up custom claims for admin roles
4. Configure security rules
5. Initialize system settings

---

## Backup and Recovery

- Automated daily backups via Firebase
- Point-in-time recovery available
- Export functionality for compliance
- Data retention policies per healthcare regulations

---

## Security Considerations

1. **Patient Data Protection**: HIPAA-compliant access controls
2. **Admin Segregation**: Separate admin authentication realm
3. **Audit Logging**: All admin actions logged
4. **Encryption**: Data encrypted at rest and in transit
5. **Access Control**: Role-based permissions enforced
6. **Data Retention**: Configurable retention policies

---

## Future Enhancements

1. Add pharmacy collection for medication ordering
2. Add insurance claims management
3. Add telemedicine session data
4. Add billing/invoicing collections
5. Add analytics/reporting collections
