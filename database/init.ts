/**
 * Database Initialization Script for MediMe-3.0
 * 
 * ⚠️ OPTIONAL: This script is only needed if you want to populate sample data.
 * The database works without running this script.
 * 
 * This script initializes the Firestore database with:
 * - System settings
 * - Sample data for development
 * - Admin user setup instructions
 * 
 * Prerequisites:
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Set up Firebase credentials (see database/README.md)
 * 
 * Usage:
 * npm run db:init
 * 
 * Note: TypeScript errors are expected if firebase-admin is not installed.
 * This is intentional - the script is optional for development.
 */

import { initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
let app: App;
try {
  // For production, use service account
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    app = initializeApp({
      credential: cert(serviceAccount)
    });
  } else {
    // For development/emulator
    app = initializeApp();
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Initialize system settings
 */
async function initializeSystemSettings() {
  console.log('Initializing system settings...');
  
  const systemSettingsRef = db.collection('systemSettings').doc('config');
  
  await systemSettingsRef.set({
    maintenanceMode: false,
    allowNewRegistrations: true,
    adminEmailDomain: 'medime-admin.com',
    maxAppointmentsPerDay: 50,
    notificationSettings: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      appointmentReminders: true,
      medicationReminders: true,
    },
    updatedAt: Timestamp.now(),
    updatedBy: 'system',
    version: '1.0.0',
  });
  
  console.log('✓ System settings initialized');
}

/**
 * Create sample doctor data
 */
async function createSampleDoctors() {
  console.log('Creating sample doctors...');
  
  const doctors = [
    {
      id: 'sample-doctor-1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      specialization: 'Interventional Cardiology',
      contactNumber: '+1-555-0101',
      email: 'sarah.johnson@medime.com',
      location: 'New York',
      address: '123 Medical Center Dr, New York, NY 10001',
      hospitalAffiliation: 'New York General Hospital',
      bio: 'Board-certified cardiologist with 15 years of experience in interventional cardiology.',
      education: 'MD from Harvard Medical School',
      experience: '15 years',
      price: 200,
      nextAvailability: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
    {
      id: 'sample-doctor-2',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      name: 'Dr. Ahmed Hassan',
      specialty: 'General Practitioner',
      specialization: 'Family Medicine',
      contactNumber: '+20-100-123-4567',
      email: 'ahmed.hassan@medime.com',
      location: 'Alexandria',
      address: '456 Health St, Smouha, Alexandria, Egypt',
      hospitalAffiliation: 'Alexandria Medical Center',
      bio: 'Experienced family medicine physician serving the Alexandria community.',
      education: 'MD from Alexandria University',
      experience: '10 years',
      price: 150,
      nextAvailability: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
    {
      id: 'sample-doctor-3',
      firstName: 'Maria',
      lastName: 'Garcia',
      name: 'Dr. Maria Garcia',
      specialty: 'Pediatrician',
      specialization: 'Child Development',
      contactNumber: '+1-555-0203',
      email: 'maria.garcia@medime.com',
      location: 'Los Angeles',
      address: '789 Kids Care Ave, Los Angeles, CA 90001',
      hospitalAffiliation: 'Children\'s Hospital LA',
      bio: 'Dedicated pediatrician specializing in child development and preventive care.',
      education: 'MD from UCLA Medical School',
      experience: '12 years',
      price: 175,
      nextAvailability: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
  ];
  
  for (const doctor of doctors) {
    await db.collection('doctors').doc(doctor.id).set(doctor);
    console.log(`✓ Created doctor: ${doctor.name}`);
  }
}

/**
 * Create admin user with custom claims
 */
async function createAdminUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: 'superadmin' | 'admin' | 'moderator'
) {
  console.log(`Creating admin user: ${email}...`);
  
  try {
    // Create auth user
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: true,
      displayName: `${firstName} ${lastName}`,
    });
    
    // Set custom claims
    const permissions = role === 'superadmin' 
      ? ['manage_users', 'manage_doctors', 'manage_patients', 'manage_appointments', 'view_analytics', 'manage_admins', 'system_settings']
      : role === 'admin'
      ? ['manage_users', 'manage_doctors', 'manage_patients', 'manage_appointments', 'view_analytics']
      : ['view_analytics'];
    
    await auth.setCustomUserClaims(userRecord.uid, {
      admin: true,
      role,
      permissions,
    });
    
    // Create admin profile document
    await db.collection('admins').doc(userRecord.uid).set({
      id: userRecord.uid,
      firstName,
      lastName,
      email,
      role,
      permissions,
      active: true,
      lastLogin: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: 'system',
    });
    
    console.log(`✓ Created admin user: ${email} (${role})`);
    console.log(`  UID: ${userRecord.uid}`);
    
    return userRecord;
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      console.log(`⚠ User ${email} already exists`);
    } else {
      console.error(`Error creating admin user ${email}:`, error);
      throw error;
    }
  }
}

/**
 * Create audit log entry
 */
async function logAuditEvent(
  adminId: string,
  adminEmail: string,
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: any
) {
  const logRef = db.collection('auditLogs').doc();
  
  await logRef.set({
    id: logRef.id,
    adminId,
    adminEmail,
    action,
    resourceType,
    resourceId: resourceId || null,
    details: details || null,
    ipAddress: null, // Would be populated by Cloud Functions in production
    timestamp: Timestamp.now(),
  });
}

/**
 * Main initialization function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('MediMe-3.0 Database Initialization');
  console.log('='.repeat(60));
  console.log();
  
  try {
    // Initialize system settings
    await initializeSystemSettings();
    console.log();
    
    // Create sample doctors
    await createSampleDoctors();
    console.log();
    
    // Create default admin users
    console.log('Creating admin users...');
    
    // Create super admin
    const superAdmin = await createAdminUser(
      'admin@medime-admin.com',
      'Admin@123456', // Change this in production!
      'Super',
      'Admin',
      'superadmin'
    );
    
    if (superAdmin) {
      // Log the initialization
      await logAuditEvent(
        superAdmin.uid,
        'admin@medime-admin.com',
        'database_initialization',
        'system',
        undefined,
        { message: 'Database initialized successfully' }
      );
    }
    
    console.log();
    console.log('='.repeat(60));
    console.log('✓ Database initialization complete!');
    console.log('='.repeat(60));
    console.log();
    console.log('Default Admin Credentials:');
    console.log('  Email: admin@medime-admin.com');
    console.log('  Password: Admin@123456');
    console.log();
    console.log('⚠ IMPORTANT: Change the admin password immediately!');
    console.log();
    console.log('Next Steps:');
    console.log('1. Update Firestore security rules for admin access');
    console.log('2. Deploy Cloud Functions for audit logging');
    console.log('3. Configure MediMe_Admin to use this Firebase project');
    console.log('4. Change default admin password');
    console.log();
    
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
}

// Run initialization
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { initializeSystemSettings, createSampleDoctors, createAdminUser, logAuditEvent };
