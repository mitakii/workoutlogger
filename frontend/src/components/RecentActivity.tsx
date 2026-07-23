import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "./ui/card";
import { Spinner } from "./ui/spinner";
import { useUserContext } from "@/context/UserContext";
import { useGetUserSessions } from "@/hooks/react-query";

const RecentActivity = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("home");
  const { user } = useUserContext();
  const {
    data: sessions,
    isLoading,
    isError,
  } = useGetUserSessions({
    username: user?.username ?? "",
    page: 1,
    pageSize: 5,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="mt-4 text-sm text-muted-foreground">
        {t("recentActivity.loadError")}
      </p>
    );
  }

  if (!sessions || sessions.length === 0) return null;

  return (
    <div className="mt-4">
      <h2 className="text-sm font-semibold text-muted-foreground">
        {t("recentActivity.heading")}
      </h2>
      <div className="mt-2 flex flex-col gap-2">
        {sessions.map((session) => (
          <Card
            key={session.workoutId}
            className="p-3 transition-colors hover:bg-accent/50"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">
                  {session.workoutName || t("recentActivity.defaultWorkoutName")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(session.startTime).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <p className="shrink-0 text-xs text-muted-foreground">
                {t("recentActivity.exerciseCount", {
                  count: session.userExercises.length,
                })}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
