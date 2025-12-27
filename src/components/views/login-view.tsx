"use client";

import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Info } from "lucide-react";

export default function LoginView() {
  const { navigate } = useAppStore();
  const [email, setEmail] = useState("demo@medime.com");
  const [password, setPassword] = useState("demo123");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        navigate("home");
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary mb-2">MediMe</h1>
          <p className="text-muted-foreground text-lg">
            Your Personal Health Companion
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-card-foreground mb-6 text-center">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <Label className="font-semibold mb-2 block">Email Address</Label>
              <Input
                type="email"
                id="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <Label className="font-semibold mb-2 block">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-700" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Demo Credentials:</p>
                  <p className="text-xs text-blue-800"><b>Email:</b> demo@medime.com</p>
                  <p className="text-xs text-blue-800"><b>Password:</b> demo123</p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-muted-foreground">
            <p className="text-sm">
              Don't have an account?{" "}
              <span
                className="text-primary font-semibold cursor-pointer"
                onClick={() => navigate("create-account-view")}
              >
                Create one
              </span>
            </p>
          </div>
        </div>

        <div className="text-center mt-8 text-muted-foreground text-xs">
          <p>© 2025 MediMe. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
