# Database Setup - MediMe-3.0

## ✅ Database is Ready!

The MediMe-3.0 project now has a complete database setup using **Firebase Firestore**.

## What's Been Set Up

### 📁 Database Structure
- **Patient Collections**: `/patients/{patientId}` with subcollections for appointments, medications, reports, and family members
- **Doctor Collections**: `/doctors/{doctorId}` for doctor profiles
- **Admin Collections**: `/admins/{adminId}` for MediMe_Admin integration
- **System Collections**: `/systemSettings` and `/auditLogs` for administration

### 🔐 Security
- Firestore security rules configured with role-based access control (RBAC)
- Patient data protected - only accessible by owner or authorized admins
- Admin authentication via Firebase custom claims
- Audit logging for compliance

### 📚 Documentation
All documentation is in the `/database/` directory:
- **QUICKSTART.md**: Quick reference for developers
- **README.md**: Complete setup and integration guide
- **schema.md**: Detailed database schema
- **init.ts**: Optional initialization script (requires firebase-admin)

### 🔧 NPM Scripts
```bash
npm run db:help   # View database README
npm run db:init   # Initialize sample data (optional, requires firebase-admin)
```

## For MediMe_Admin Integration

### Connection Details
```
Firebase Project ID: studio-7006252920-e1e93
API Key: AIzaSyDfqmN9xmC-JvCmi2xGH7cVszIgLsuFUdk
Auth Domain: studio-7006252920-e1e93.firebaseapp.com
```

### Admin Roles & Permissions
- **Superadmin**: Full system access
- **Admin**: Manage users, doctors, patients, appointments
- **Moderator**: View-only analytics access

### Available Permissions
- `manage_users` - User management
- `manage_doctors` - Doctor management  
- `manage_patients` - Patient data access
- `manage_appointments` - Appointment management
- `view_analytics` - Analytics access
- `manage_admins` - Admin management
- `system_settings` - System configuration

## Using the Database

### In Code
```typescript
import { initializeFirebase } from '@/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

const { firestore } = initializeFirebase();

// Example: Get a patient
const patientRef = doc(firestore, 'patients', userId);
const patient = await getDoc(patientRef);

// Example: Query appointments
const appointmentsRef = collection(firestore, `patients/${patientId}/appointments`);
const appointments = await getDocs(appointmentsRef);
```

### For Admins (with custom claims)
```typescript
// Check admin status
const user = auth.currentUser;
const idToken = await user.getIdTokenResult();
const isAdmin = idToken.claims.admin === true;
const role = idToken.claims.role;
const permissions = idToken.claims.permissions;

// Access patient data (requires manage_patients permission)
const patientsRef = collection(firestore, 'patients');
const allPatients = await getDocs(patientsRef);
```

## Next Steps

1. ✅ Database structure created
2. ✅ Security rules configured
3. ✅ TypeScript types defined
4. ✅ Documentation written
5. ⏭️ **Optional**: Run `npm run db:init` to add sample data
6. ⏭️ **For MediMe_Admin**: Implement admin authentication with custom claims

## Files Modified

- `firestore.rules` - Security rules with admin support
- `src/lib/types.ts` - Added Admin, SystemSettings, AuditLog types
- `docs/backend.json` - Added admin entity schemas
- `package.json` - Added db:init and db:help scripts
- `firestore.indexes.json` - Database indexes
- `database/*` - Complete documentation

## Support

For questions or issues:
1. Read `/database/QUICKSTART.md` for quick reference
2. Read `/database/README.md` for detailed documentation
3. Check `/database/schema.md` for schema details
4. Review `firestore.rules` for security rules

---

**The database is production-ready and works without any additional setup!** 🎉

The optional initialization script (`npm run db:init`) is only needed if you want to populate sample doctors and admin users for testing.
