import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  current: number;
  longest: number;
};

const StreakCard = ({ current, longest }: Props) => {
  const { t } = useTranslation("statistics");

  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm">{t("streakCard.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-xs text-muted-foreground">{t("streakCard.current")}</p>
          <p className="text-xl font-bold">
            {current}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              {t("streakCard.weeksUnit")}
            </span>
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t("streakCard.longest")}</p>
          <p className="text-xl font-bold">
            {longest}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              {t("streakCard.weeksUnit")}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCard;
