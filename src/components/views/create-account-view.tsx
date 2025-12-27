'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Heart,
  Phone,
  CheckCircle,
  Key,
  Shield,
  UserPlus,
} from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export default function CreateAccountView() {
  const { navigate } = useAppStore();
  const { toast } = useToast();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();

  // Pre-filled demo data
  const [formData, setFormData] = useState<any>({
    fullName: 'Demo User',
    email: 'demo@medime.com',
    password: 'demo123',
    contactNumber: '+15551234567',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    address: '123 Demo St, Medville',
    chronicConditions: ['None'],
    allergies: ['None'],
    insuranceProvider: 'Demo Health',
    insurancePolicyNumber: 'DEMO12345',
  });

  const handleDataChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: formData.fullName });

      const userDocRef = doc(firestore, 'patients', user.uid);

      const patientData = {
        id: user.uid,
        firstName: formData.fullName.split(' ')[0],
        lastName: formData.fullName.split(' ').slice(1).join(' '),
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        contactNumber: formData.contactNumber,
        address: formData.address,
        medicalHistory: `Chronic Conditions: ${
          formData.chronicConditions?.join(', ') || 'None'
        }. Allergies: ${formData.allergies?.join(', ') || 'None'}.`,
        insuranceProvider: formData.insuranceProvider,
        insurancePolicyNumber: formData.insurancePolicyNumber,
      };

      // Use setDoc with the non-blocking helper
      setDoc(userDocRef, patientData, { merge: true }).catch(
        (serverError) => {
          console.error(
            'Failed to save user data to Firestore:',
            serverError
          );
          // Optionally, you can emit a global error here if needed
        }
      );

      toast({
        title: 'Account Created!',
        description: 'Welcome to MediMe.',
      });
      navigate('home');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Account Creation Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4 overflow-y-auto py-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100 my-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <UserPlus className="w-8 h-8 mr-3 text-cyan-600" />
              Create Demo User Account
            </h2>
            <p className="text-gray-600 mt-1">
              Click the button below to create the pre-filled demo user.
            </p>
          </div>
          <Button
            variant="link"
            className="text-primary font-semibold"
            onClick={() => navigate('login-view')}
          >
            Back to Login
          </Button>
        </div>

        <form onSubmit={handleCreateAccount} className="space-y-6">
          {/* Credentials */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4">
              <Key className="w-5 h-5 mr-2 text-primary" /> Account Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="signup-email">Email Address</Label>
                <Input
                  id="signup-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleDataChange('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handleDataChange('password', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4">
              <User className="w-5 h-5 mr-2 text-primary" /> Personal
              Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleDataChange('fullName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="signup-phone">Phone Number</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  required
                  value={formData.contactNumber}
                  onChange={(e) =>
                    handleDataChange('contactNumber', e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="signup-dob">Date of Birth</Label>
                <Input
                  id="signup-dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleDataChange('dateOfBirth', e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="signup-gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleDataChange('gender', value)}
                >
                  <SelectTrigger id="signup-gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other / Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Insurance */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4">
              <Shield className="w-5 h-5 mr-2 text-blue-600" /> Insurance
              Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Insurance Provider</Label>
                <Input
                  type="text"
                  value={formData.insuranceProvider}
                  onChange={(e) =>
                    handleDataChange('insuranceProvider', e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Member ID / Policy Number</Label>
                <Input
                  type="text"
                  value={formData.insurancePolicyNumber}
                  onChange={(e) =>
                    handleDataChange('insurancePolicyNumber', e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              'Creating Account...'
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Create Demo Account in DB
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
