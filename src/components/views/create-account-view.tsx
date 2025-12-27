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
} from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

export default function CreateAccountView() {
  const { navigate } = useAppStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { toast } = useToast();
  const { t } = useI18n();

  const totalSteps = 4;
  const progressPercent = (step / totalSteps) * 100;

  const stepTitles = [
    "Basic Information",
    "Location & Demographics",
    "Medical Information",
    "Emergency Contact & Insurance",
  ];

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final step
      toast({
        title: "Account Created!",
        description: "Welcome to MediMe.",
      });
      // In a real app, you'd save the user and log them in
      navigate("home");
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
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      default:
        return <Step1 />;
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
            onClick={() => navigate("home")}
          >
            Cancel
          </Button>
        </div>

        <Progress value={progressPercent} className="mb-6" />

        <form onSubmit={nextStep}>
          {renderStep()}
          <div className="flex items-center space-x-3 pt-6">
            {step > 1 && (
              <Button type="button" onClick={prevStep} variant="outline" size="lg">
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              size="lg"
            >
              {step === totalSteps ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Create Account
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Step1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800 flex items-center">
        <User className="w-5 h-5 mr-2 text-primary" /> Basic Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="signup-name">Full Name <span className="text-red-500">*</span></Label>
          <Input id="signup-name" type="text" placeholder="John Doe" required />
        </div>
        <div>
          <Label htmlFor="signup-email">Email Address <span className="text-red-500">*</span></Label>
          <Input id="signup-email" type="email" placeholder="your@email.com" required />
        </div>
        <div>
          <Label htmlFor="signup-phone">Phone Number <span className="text-red-500">*</span></Label>
          <Input id="signup-phone" type="tel" placeholder="+1 (555) 000-0000" required />
        </div>
        <div>
          <Label htmlFor="signup-dob">Date of Birth</Label>
          <Input id="signup-dob" type="date" />
        </div>
        <div>
          <Label htmlFor="signup-gender">Gender</Label>
          <Select>
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
  );
  
  const Step2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-purple-600" /> Location & Demographics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <Label htmlFor="signup-country">Country</Label>
            <Select>
                <SelectTrigger id="signup-country"><SelectValue placeholder="Select country" /></SelectTrigger>
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
            <Label htmlFor="signup-city">City</Label>
            <Input id="signup-city" type="text" placeholder="Cairo, Alexandria, etc." />
        </div>
        <div className="md:col-span-2">
            <Label htmlFor="signup-marital">Marital Status</Label>
            <Select>
                <SelectTrigger id="signup-marital"><SelectValue placeholder="Select status" /></SelectTrigger>
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
  
  const Step3 = () => (
    <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-600" /> Medical Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
                <Label>Blood Type</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                </SelectContent></Select>
            </div>
            <div><Label>Height (cm)</Label><Input type="number" min="0" placeholder="170" /></div>
            <div><Label>Weight (kg)</Label><Input type="number" min="0" placeholder="70" /></div>
        </div>

        <div className="space-y-2"><Label>Chronic Conditions</Label><div className="grid grid-cols-2 gap-2">
            {['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Arthritis', 'Thyroid Disorder', 'COPD', 'None'].map(item =>
            <div key={item} className="flex items-center space-x-2"><Checkbox id={`cond-${item}`} /><Label htmlFor={`cond-${item}`} className="text-sm font-normal">{item}</Label></div>)}
        </div></div>

        <div className="space-y-2"><Label>Known Allergies</Label><div className="grid grid-cols-2 gap-2">
            {['Penicillin', 'Peanuts', 'Shellfish', 'Latex', 'Sulfa Drugs', 'None'].map(item =>
            <div key={item} className="flex items-center space-x-2"><Checkbox id={`allergy-${item}`} /><Label htmlFor={`allergy-${item}`} className="text-sm font-normal">{item}</Label></div>)}
        </div></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Previous Operations <span className="text-gray-400">(optional)</span></Label><Textarea rows={2} placeholder="List any surgeries" /></div>
            <div><Label>Transplants <span className="text-gray-400">(optional)</span></Label><Select><SelectTrigger><SelectValue placeholder="Select if applicable" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Kidney">Kidney</SelectItem>
                    <SelectItem value="Liver">Liver</SelectItem>
                    <SelectItem value="Heart">Heart</SelectItem>
                    <SelectItem value="Lung">Lung</SelectItem>
                </SelectContent></Select>
            </div>
        </div>
        
        <div className="flex items-center space-x-2"><Checkbox id="organ-donor" /><Label htmlFor="organ-donor">Register as an organ donor</Label></div>
    </div>
  );
  
  const Step4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800 flex items-center">
        <Phone className="w-5 h-5 mr-2 text-orange-600" /> Emergency Contact
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div><Label>Contact Name</Label><Input type="text" placeholder="Full name" /></div>
        <div><Label>Contact Phone</Label><Input type="tel" placeholder="+1 (555) 000-0000" /></div>
      </div>
  
      <h3 className="text-lg font-bold text-gray-800 flex items-center">
        <Heart className="w-5 h-5 mr-2 text-blue-600" /> Insurance Information <span className="text-gray-400 text-sm font-normal ml-2">(optional)</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Insurance Provider</Label><Input type="text" placeholder="Blue Cross, Aetna, etc." /></div>
        <div><Label>Member ID</Label><Input type="text" placeholder="ABC123456789" /></div>
      </div>
    </div>
  );
