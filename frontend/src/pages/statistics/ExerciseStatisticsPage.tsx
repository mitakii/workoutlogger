import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useExerciseStatistics, useGetExercise } from "@/hooks/react-query";
import { useUserContext } from "@/context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import StatCard from "@/components/statistics/StatCard";
import StatRow from "@/components/statistics/StatRow";
import WeightProgressionChart from "@/components/statistics/WeightProgressionChart";
import { fmtVol } from "@/lib/utils";

const ExerciseStatisticsPage = () => {
  const { t } = useTranslation("statistics");
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { user } = useUserContext();
  const { data: stats, isLoading, isError } = useExerciseStatistics(
    user?.id ?? "",
    exerciseId ?? ""
  );
  const { data: exercise } = useGetExercise(exerciseId ?? "");

  const progressionData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.totalProgression)
      .map(([date, weight]) => ({ date, weight }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [stats]);

  if (isLoading) {
    return (
      <div className="flex justify-center pt-20">
        <Spinner />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <p className="px-4 pt-6 text-center text-muted-foreground text-sm">
        {t("exerciseStatisticsPage.notFound")}
      </p>
    );
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-4">
        {exercise?.imageUrl ? (
          <img
            src={exercise.imageUrl}
            alt={exercise.name}
            className="h-16 w-16 shrink-0 rounded-lg bg-muted object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Dumbbell className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-bold truncate">
            {exercise?.name ?? t("exerciseStatisticsPage.defaultTitle")}
          </h1>
          {exercise?.description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {exercise.description}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label={t("exerciseStatisticsPage.maxWeight")}
          value={`${stats.maxWeight ?? 0} ${t("exerciseStatisticsPage.kgUnit")}`}
        />
        <StatCard label={t("exerciseStatisticsPage.totalSets")} value={stats.totalSets ?? 0} />
        <StatCard label={t("exerciseStatisticsPage.volume")} value={fmtVol(stats.totalVolume)} />
      </div>

      <Separator />

      <Card>
        <CardHeader className="pb-1 pt-4">
          <CardTitle className="text-sm">{t("exerciseStatisticsPage.breakdownTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {(stats.maxDuration ?? 0) > 0 && (
            <StatRow
              label={t("exerciseStatisticsPage.maxDuration")}
              value={`${stats.maxDuration!.toFixed(0)} ${t("exerciseStatisticsPage.minUnit")}`}
            />
          )}
          {(stats.maxDistanceKm ?? 0) > 0 && (
            <StatRow
              label={t("exerciseStatisticsPage.maxDistance")}
              value={`${stats.maxDistanceKm!.toFixed(2)} ${t("exerciseStatisticsPage.kmUnit")}`}
            />
          )}
          {(stats.totalDuration ?? 0) > 0 && (
            <StatRow
              label={t("exerciseStatisticsPage.totalDuration")}
              value={`${stats.totalDuration!.toFixed(0)} ${t("exerciseStatisticsPage.minUnit")}`}
            />
          )}
          {(stats.totalDistanceKm ?? 0) > 0 && (
            <StatRow
              label={t("exerciseStatisticsPage.totalDistance")}
              value={`${stats.totalDistanceKm!.toFixed(2)} ${t("exerciseStatisticsPage.kmUnit")}`}
            />
          )}
          <StatRow label={t("exerciseStatisticsPage.totalVolumeRow")} value={fmtVol(stats.totalVolume)} />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h2 className="text-sm font-semibold mb-3">
          {t("exerciseStatisticsPage.progressionSectionTitle")}
        </h2>
        {progressionData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            {t("exerciseStatisticsPage.noProgressionData")}
          </p>
        ) : (
          <WeightProgressionChart data={progressionData} />
        )}
      </div>
    </div>
  );
};

export default ExerciseStatisticsPage;
