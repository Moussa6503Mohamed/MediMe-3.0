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
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Heart,
  Phone,
  CheckCircle,
  Key,
  Shield,
  UserPlus,
  Mail,
  Lock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  AlertTriangle,
  Stethoscope,
} from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useFirestore } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';
import { Label } from '../ui/label';

const Step1 = ({ data, onChange }: { data: any, onChange: (field: string, value: any) => void }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-bold text-gray-800 flex items-center">
      <User className="w-5 h-5 mr-2 text-cyan-600" /> Basic Information
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <Label>Full Name <span className="text-red-500">*</span></Label>
        <Input type="text" placeholder="John Doe" required value={data.fullName || ''} onChange={e => onChange('fullName', e.target.value)} />
      </div>
      <div>
        <Label>Email Address <span className="text-red-500">*</span></Label>
        <Input type="email" placeholder="your@email.com" required value={data.email || ''} onChange={e => onChange('email', e.target.value)} />
      </div>
      <div>
        <Label>Password <span className="text-red-500">*</span></Label>
        <Input type="password" placeholder="min. 6 characters" required value={data.password || ''} onChange={e => onChange('password', e.target.value)} />
      </div>
      <div>
        <Label>Phone Number <span className="text-red-500">*</span></Label>
        <Input type="tel" placeholder="+1 (555) 000-0000" required value={data.contactNumber || ''} onChange={e => onChange('contactNumber', e.target.value)} />
      </div>
      <div>
        <Label>Date of Birth</Label>
        <Input type="date" value={data.dateOfBirth || ''} onChange={e => onChange('dateOfBirth', e.target.value)} />
      </div>
      <div>
        <Label>Gender</Label>
        <Select value={data.gender || ''} onValueChange={value => onChange('gender', value)}>
          <SelectTrigger>
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
);

const Step2 = ({ data, onChange }: { data: any, onChange: (field: string, value: any) => void }) => (
    <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-purple-600" /> Location & Demographics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label>Country</Label>
                <Select value={data.country || ''} onValueChange={v => onChange('country', v)}>
                    <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Egypt">Egypt</SelectItem>
                        <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                        <SelectItem value="UAE">United Arab Emirates</SelectItem>
                        <SelectItem value="USA">United States</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>City</Label>
                <Input type="text" placeholder="Cairo, Alexandria, etc." value={data.city || ''} onChange={e => onChange('city', e.target.value)} />
            </div>
            <div className="md:col-span-2">
                <Label>Marital Status</Label>
                <Select value={data.maritalStatus || ''} onValueChange={v => onChange('maritalStatus', v)}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    </div>
);


const Step3 = ({ data, onChange }: { data: any, onChange: (field: string, value: any) => void }) => (
    <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-600" /> Medical Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
                <Label>Blood Type</Label>
                <Select value={data.bloodType || ''} onValueChange={v => onChange('bloodType',v)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Height (cm)</Label>
                <Input type="number" min="0" placeholder="170" value={data.height || ''} onChange={e => onChange('height', e.target.value)} />
            </div>
            <div>
                <Label>Weight (kg)</Label>
                <Input type="number" min="0" placeholder="70" value={data.weight || ''} onChange={e => onChange('weight', e.target.value)} />
            </div>
        </div>
        <div className="md:col-span-2">
            <Label>Previous Operations <span className="text-gray-400">(optional)</span></Label>
            <Input type="text" placeholder="List any surgeries" value={data.previousOperations || ''} onChange={e => onChange('previousOperations', e.target.value)} />
        </div>
        <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center mt-6">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" /> Known Allergies
            </h3>
            <p className="text-sm text-gray-500 mb-2">Please list any known allergies, separated by commas.</p>
            <Input type="text" placeholder="e.g., Penicillin, Peanuts, Shellfish" value={data.allergies || ''} onChange={e => onChange('allergies', e.target.value)} />
        </div>
    </div>
);

const Step4 = ({ data, onChange }: { data: any, onChange: (field: string, value: any) => void }) => (
    <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-orange-600" /> Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <Label>Contact Name</Label>
                <Input type="text" placeholder="Full name" value={data.emergencyContactName || ''} onChange={e => onChange('emergencyContactName', e.target.value)} />
            </div>
            <div>
                <Label>Contact Phone</Label>
                <Input type="tel" placeholder="+1 (555) 000-0000" value={data.emergencyContactPhone || ''} onChange={e => onChange('emergencyContactPhone', e.target.value)} />
            </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Stethoscope className="w-5 h-5 mr-2 text-teal-600" /> Primary Doctor <span className="text-gray-400 text-sm font-normal ml-2">(optional)</span>
        </h3>
        <Input type="text" placeholder="Dr. John Smith" value={data.primaryDoctor || ''} onChange={e => onChange('primaryDoctor', e.target.value)} />

        <h3 className="text-lg font-bold text-gray-800 flex items-center mt-6">
            <Shield className="w-5 h-5 mr-2 text-blue-600" /> Insurance Information <span className="text-gray-400 text-sm font-normal ml-2">(optional)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Insurance Provider</Label><Input type="text" placeholder="Blue Cross, Aetna, etc." value={data.insuranceProvider || ''} onChange={e => onChange('insuranceProvider', e.target.value)} /></div>
            <div><Label>Member ID</Label><Input type="text" placeholder="ABC123456789" value={data.insuranceMemberId || ''} onChange={e => onChange('insuranceMemberId', e.target.value)} /></div>
        </div>
    </div>
);


export default function CreateAccountView() {
  const { navigate } = useAppStore();
  const { toast } = useToast();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    contactNumber: '',
    dateOfBirth: '',
    gender: '',
    country: '',
    city: '',
    maritalStatus: '',
    bloodType: '',
    height: '',
    weight: '',
    previousOperations: '',
    allergies: '',
    primaryDoctor: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    insuranceProvider: '',
    insuranceMemberId: ''
  });

  const handleDataChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  
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
        firstName: formData.fullName.split(' ')[0] || '',
        lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        contactNumber: formData.contactNumber,
        country: formData.country,
        city: formData.city,
        maritalStatus: formData.maritalStatus,
        bloodType: formData.bloodType,
        height: formData.height,
        weight: formData.weight,
        previousOperations: formData.previousOperations,
        allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
        primaryDoctor: formData.primaryDoctor,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        insuranceProvider: formData.insuranceProvider,
        insuranceMemberId: formData.insuranceMemberId,
      };

      setDocumentNonBlocking(userDocRef, patientData, { merge: true });

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

  const renderStep = () => {
      switch(step) {
          case 1: return <Step1 data={formData} onChange={handleDataChange} />;
          case 2: return <Step2 data={formData} onChange={handleDataChange} />;
          case 3: return <Step3 data={formData} onChange={handleDataChange} />;
          case 4: return <Step4 data={formData} onChange={handleDataChange} />;
          default: return <Step1 data={formData} onChange={handleDataChange} />;
      }
  }
  
  const totalSteps = 4;

  return (
    <div className="min-h-full bg-gradient-to-br from-purple-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100 my-4">
        <div className="flex items-center justify-between mb-4">
            <div>
                <p className="text-sm text-gray-500">Account creation - Step {step} of {totalSteps}</p>
                <h2 className="text-3xl font-bold text-gray-900">Create your MediMe account</h2>
            </div>
            <Button variant="link" className="text-cyan-700 font-semibold" onClick={() => navigate('login-view')}>Cancel</Button>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div className="bg-cyan-600 h-2.5 rounded-full" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>

        <form onSubmit={handleCreateAccount}>
            {renderStep()}

            <div className="flex items-center space-x-3 pt-6">
                {step > 1 && (
                    <Button type="button" variant="outline" onClick={prevStep} className="px-6 py-4">
                        <ChevronLeft className="w-5 h-5 mr-2" /> Back
                    </Button>
                )}
                {step < totalSteps && (
                    <Button type="button" onClick={nextStep} className="flex-1 py-4">
                        Next <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                )}
                {step === totalSteps && (
                    <Button type="submit" className="flex-1 py-4" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : (<><CheckCircle className="w-5 h-5 mr-2" />Create Account</>)}
                    </Button>
                )}
            </div>
        </form>
      </div>
    </div>
  );
}
