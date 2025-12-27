"use client";

import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  MapPin,
  Heart,
  Phone,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Key,
  Shield,
} from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc }from "firebase/firestore";
import { useFirestore } from "@/firebase";

export default function CreateAccountView() {
  const { navigate } = useAppStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();

  const totalSteps = 4;
  const progressPercent = (step / totalSteps) * 100;

  const stepTitles = [
    "Account Credentials",
    "Personal Information",
    "Medical Information",
    "Emergency Contact & Insurance",
  ];

  const handleDataChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final step: Create account
      setIsLoading(true);
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          await updateProfile(user, { displayName: formData.fullName });

          // Save additional user data to Firestore
          const userDocRef = doc(firestore, "patients", user.uid);
          
          const patientData = {
            id: user.uid,
            firstName: formData.fullName.split(' ')[0],
            lastName: formData.fullName.split(' ').slice(1).join(' '),
            email: formData.email,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            contactNumber: formData.contactNumber,
            address: `${formData.city}, ${formData.country}`,
            medicalHistory: `Chronic Conditions: ${formData.chronicConditions?.join(', ') || 'None'}. Allergies: ${formData.allergies?.join(', ') || 'None'}.`,
            insuranceProvider: formData.insuranceProvider,
            insurancePolicyNumber: formData.insurancePolicyNumber,
          };
          
          await setDoc(userDocRef, patientData);

          toast({
            title: "Account Created!",
            description: "Welcome to MediMe.",
          });
          navigate("home");
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Account Creation Failed",
            description: error.message,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 data={formData} onChange={handleDataChange} />;
      case 2:
        return <Step2 data={formData} onChange={handleDataChange} />;
      case 3:
        return <Step3 data={formData} onChange={handleDataChange} />;
      case 4:
        return <Step4 data={formData} onChange={handleDataChange} />;
      default:
        return <Step1 data={formData} onChange={handleDataChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4 overflow-y-auto py-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100 my-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">
              Account creation - Step {step} of {totalSteps}
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              Create your MediMe account
            </h2>
            <p className="text-sm text-gray-600 mt-1">{stepTitles[step - 1]}</p>
          </div>
          <Button
            variant="link"
            className="text-primary font-semibold"
            onClick={() => navigate("login-view")}
          >
            Cancel
          </Button>
        </div>

        <Progress value={progressPercent} className="mb-6" />

        <form onSubmit={nextStep}>
          {renderStep()}
          <div className="flex items-center space-x-3 pt-6">
            {step > 1 && (
              <Button type="button" onClick={prevStep} variant="outline" size="lg" disabled={isLoading}>
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : (step === totalSteps ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Create Account
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              ))}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Step1 = ({ data, onChange }: { data: any, onChange: (field: string, value: any) => void }) => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800 flex items-center">
        <Key className="w-5 h-5 mr-2 text-primary" /> Account Credentials
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="signup-name">Full Name <span className="text-red-500">*</span></Label>
          <Input id="signup-name" type="text" placeholder="John Doe" required value={data.fullName || ''} onChange={e => onChange('fullName', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="signup-email">Email Address <span className="text-red-500">*</span></Label>
          <Input id="signup-email" type="email" placeholder="your@email.com" required value={data.email || ''} onChange={e => onChange('email', e.target.value)} />
        </div>
         <div>
          <Label htmlFor="signup-phone">Phone Number <span className="text-red-500">*</span></Label>
          <Input id="signup-phone" type="tel" placeholder="+1 (555) 000-0000" required value={data.contactNumber || ''} onChange={e => onChange('contactNumber', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="signup-password">Password <span className="text-red-500">*</span></Label>
          <Input id="signup-password" type="password" placeholder="••••••••" required value={data.password || ''} onChange={e => onChange('password', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="signup-confirm-password">Confirm Password <span className="text-red-500">*</span></Label>
          <Input id="signup-confirm-password" type="password" placeholder="••••••••" required />
        </div>
      </div>
    </div>
  );
  
  const Step2 = ({ data, onChange }: { data: any, onChange: (field: string, value: any) => void }) => (
    <div className="space-y-6">
       <h3 className="text-lg font-bold text-gray-800 flex items-center">
        <User className="w-5 h-5 mr-2 text-primary" /> Personal Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="signup-dob">Date of Birth</Label>
          <Input id="signup-dob" type="date" value={data.dateOfBirth || ''} onChange={e => onChange('dateOfBirth', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="signup-gender">Gender</Label>
          <Select value={data.gender || ''} onValueChange={value => onChange('gender', value)}>
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
         <div className="md:col-span-2">
            <Label htmlFor="signup-address">Address</Label>
            <Input id="signup-address" type="text" placeholder="123 Health St, Medville" value={data.address || ''} onChange={e => onChange('address', e.target.value)} />
        </div>
      </div>
    </div>
  );
  
  const Step3 = ({ data, onChange }: { data: any, onChange: (field: string, value: any) => void }) => (
    <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-600" /> Medical Information
        </h3>
        <div className="space-y-2"><Label>Chronic Conditions</Label><div className="grid grid-cols-2 gap-2">
            {['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Arthritis', 'Thyroid Disorder', 'COPD', 'None'].map(item =>
            <div key={item} className="flex items-center space-x-2"><Checkbox id={`cond-${item}`} /><Label htmlFor={`cond-${item}`} className="text-sm font-normal">{item}</Label></div>)}
        </div></div>

        <div className="space-y-2"><Label>Known Allergies</Label><div className="grid grid-cols-2 gap-2">
            {['Penicillin', 'Peanuts', 'Shellfish', 'Latex', 'Sulfa Drugs', 'None'].map(item =>
            <div key={item} className="flex items-center space-x-2"><Checkbox id={`allergy-${item}`} /><Label htmlFor={`allergy-${item}`} className="text-sm font-normal">{item}</Label></div>)}
        </div></div>
    </div>
  );
  
  const Step4 = ({ data, onChange }: { data: any, onChange: (field: string, value: any) => void }) => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800 flex items-center">
        <Phone className="w-5 h-5 mr-2 text-orange-600" /> Emergency Contact
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div><Label>Contact Name</Label><Input type="text" placeholder="Full name" /></div>
        <div><Label>Contact Phone</Label><Input type="tel" placeholder="+1 (555) 000-0000" /></div>
      </div>
  
      <h3 className="text-lg font-bold text-gray-800 flex items-center">
        <Shield className="w-5 h-5 mr-2 text-blue-600" /> Insurance Information <span className="text-gray-400 text-sm font-normal ml-2">(optional)</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Insurance Provider</Label><Input type="text" placeholder="Blue Cross, Aetna, etc." value={data.insuranceProvider || ''} onChange={e => onChange('insuranceProvider', e.target.value)} /></div>
        <div><Label>Member ID / Policy Number</Label><Input type="text" placeholder="ABC123456789" value={data.insurancePolicyNumber || ''} onChange={e => onChange('insurancePolicyNumber', e.target.value)} /></div>
      </div>
    </div>
  );
