import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUserStatistics, useDailyStatisticsRange } from "@/hooks/react-query";
import { useUserContext } from "@/context/UserContext";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import StatCard from "@/components/statistics/StatCard";
import StreakCard from "@/components/statistics/StreakCard";
import TopLiftsCard from "@/components/statistics/TopLiftsCard";
import VolumeChart from "@/components/statistics/VolumeChart";
import { fmtVol } from "@/lib/utils";

const StatisticsPage = () => {
  const { t } = useTranslation("statistics");
  const { user } = useUserContext();

  const today = useMemo(() => new Date(), []);
  const thirtyDaysAgo = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - 29);
    return d;
  }, [today]);

  const { data: stats, isLoading, isError } = useUserStatistics(user?.id ?? "");
  const { data: dailyData = [], isLoading: dailyLoading } =
    useDailyStatisticsRange(user?.id ?? "", thirtyDaysAgo, today);

  if (!user) return null;

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
        {t("statisticsPage.notAvailable")}
      </p>
    );
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">{t("statisticsPage.title")}</h1>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label={t("statisticsPage.workouts")} value={stats.totalWorkouts ?? 0} />
        <StatCard label={t("statisticsPage.exercises")} value={stats.totalExercises ?? 0} />
        <StatCard label={t("statisticsPage.totalSets")} value={stats.totalSets ?? 0} />
        <StatCard label={t("statisticsPage.totalVolume")} value={fmtVol(stats.totalVolume)} />
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-3">
        <StreakCard
          current={stats.consecutiveWeeksActive ?? 0}
          longest={stats.longestStreak ?? 0}
        />
        <TopLiftsCard
          bench={stats.maxBenchPress ?? 0}
          squat={stats.maxSquat ?? 0}
          deadlift={stats.maxDeadlift ?? 0}
        />
      </div>

      <Separator />

      <div>
        <h2 className="text-sm font-semibold mb-3">{t("statisticsPage.volumeSectionTitle")}</h2>
        {dailyLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : dailyData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            {t("statisticsPage.noVolumeData")}
          </p>
        ) : (
          <VolumeChart data={dailyData} />
        )}
      </div>

      <p className="text-xs text-muted-foreground text-right">
        {t("statisticsPage.lastUpdated")}{" "}
        {new Date(stats.lastUpdated).toLocaleDateString("en", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
};

export default StatisticsPage;
