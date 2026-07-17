import { useParams } from "react-router-dom";
import { useExerciseStatistics } from "@/hooks/react-query";
import { useUserContext } from "@/context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import StatCard from "@/components/statistics/StatCard";
import StatRow from "@/components/statistics/StatRow";
import { fmtVol } from "@/lib/utils";

const ExerciseStatisticsPage = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { user } = useUserContext();
  const { data: stats, isLoading, isError } = useExerciseStatistics(
    user?.id ?? "",
    exerciseId ?? ""
  );

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
        No statistics found for this exercise. Add it to a workout first.
      </p>
    );
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-xl font-bold">Exercise Statistics</h1>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Max Weight" value={`${stats.maxWeight ?? 0} kg`} />
        <StatCard label="Total Sets" value={stats.totalSets ?? 0} />
        <StatCard label="Volume" value={fmtVol(stats.totalVolume)} />
      </div>

      <Separator />

      <Card>
        <CardHeader className="pb-1 pt-4">
          <CardTitle className="text-sm">Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {(stats.maxDuration ?? 0) > 0 && (
            <StatRow label="Max Duration" value={`${stats.maxDuration!.toFixed(0)} min`} />
          )}
          {(stats.maxDistanceKm ?? 0) > 0 && (
            <StatRow label="Max Distance" value={`${stats.maxDistanceKm!.toFixed(2)} km`} />
          )}
          {(stats.totalDuration ?? 0) > 0 && (
            <StatRow label="Total Duration" value={`${stats.totalDuration!.toFixed(0)} min`} />
          )}
          {(stats.totalDistanceKm ?? 0) > 0 && (
            <StatRow label="Total Distance" value={`${stats.totalDistanceKm!.toFixed(2)} km`} />
          )}
          <StatRow label="Total Volume" value={fmtVol(stats.totalVolume)} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseStatisticsPage;
