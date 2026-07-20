import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dumbbell, LineChart, ListChecks, Users } from "lucide-react";

const features = [
  {
    icon: Dumbbell,
    title: "Log every set",
    description: "Track weight, reps, and exercises as you train.",
  },
  {
    icon: LineChart,
    title: "See your progress",
    description: "Weight progression charts and lifetime statistics.",
  },
  {
    icon: ListChecks,
    title: "Reuse templates",
    description: "Save workouts as templates and start them in one tap.",
  },
  {
    icon: Users,
    title: "Follow other lifters",
    description: "Browse public profiles and compare your progress.",
  },
];

const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-10 flex flex-col items-center text-center">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Track your training. See it add up.
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Log workouts, follow your strength over time, and pick up where you
        left off — every session, every set.
      </p>

      <div className="mt-6 flex gap-3">
        <Button size="lg" onClick={() => navigate("/register")}>
          Join us
        </Button>
        <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
          Log in
        </Button>
      </div>

      <div className="mt-10 grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-2">
        {features.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="p-4">
            <CardContent className="flex items-start gap-3 p-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LandingHero;
