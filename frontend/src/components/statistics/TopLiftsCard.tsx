import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  bench: number;
  squat: number;
  deadlift: number;
};

const TopLiftsCard = ({ bench, squat, deadlift }: Props) => {
  const { t } = useTranslation("statistics");

  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm">{t("topLiftsCard.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {[
          { label: t("topLiftsCard.bench"), value: bench },
          { label: t("topLiftsCard.squat"), value: squat },
          { label: t("topLiftsCard.deadlift"), value: deadlift },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold">
              {value} {t("topLiftsCard.kgUnit")}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopLiftsCard;
