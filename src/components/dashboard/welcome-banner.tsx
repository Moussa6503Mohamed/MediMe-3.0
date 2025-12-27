import { userProfile } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

export default function WelcomeBanner() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Card className="border-0 bg-primary/10 shadow-none">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold text-primary">
          {getGreeting()}, {userProfile.name.split(" ")[0]}!
        </h2>
        <p className="mt-1 text-muted-foreground">
          Here's your health summary. Stay on top of your well-being.
        </p>
      </CardContent>
    </Card>
  );
}
