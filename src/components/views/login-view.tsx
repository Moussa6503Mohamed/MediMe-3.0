"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/app-store";

export default function LoginView() {
  const { login } = useAuth();
  const { navigate } = useAppStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock login
    const user = {
      email: "demo@medime.com",
      name: "Saleh Al-Jamil",
    };
    login(user);
    navigate("home");
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
                defaultValue="demo@medime.com"
                required
              />
            </div>

            <div className="mb-6">
              <Label className="font-semibold mb-2 block">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="••••••••"
                defaultValue="demo123"
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Sign In
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
