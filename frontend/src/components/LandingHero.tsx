import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dumbbell, LineChart, ListChecks, Users } from "lucide-react";

const features = [
  { icon: Dumbbell, key: "logSets" },
  { icon: LineChart, key: "seeProgress" },
  { icon: ListChecks, key: "reuseTemplates" },
  { icon: Users, key: "followLifters" },
];

const LandingHero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("home");

  return (
    <div className="mt-10 flex flex-col items-center text-center">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("landingHero.title")}
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        {t("landingHero.subtitle")}
      </p>

      <div className="mt-6 flex gap-3">
        <Button size="lg" onClick={() => navigate("/register")}>
          {t("landingHero.joinButton")}
        </Button>
        <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
          {t("landingHero.loginButton")}
        </Button>
      </div>

      <div className="mt-10 grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-2">
        {features.map(({ icon: Icon, key }) => (
          <Card key={key} className="p-4">
            <CardContent className="flex items-start gap-3 p-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold">
                  {t(`landingHero.features.${key}.title`)}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t(`landingHero.features.${key}.description`)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LandingHero;
