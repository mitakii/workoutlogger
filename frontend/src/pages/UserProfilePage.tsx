import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetUserByUsername,
  useGetUserSessions,
  useUserStatistics,
} from "../hooks/react-query";
import { useUserContext } from "@/context/UserContext";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import StatCard from "@/components/statistics/StatCard";
import StreakCard from "@/components/statistics/StreakCard";
import TopLiftsCard from "@/components/statistics/TopLiftsCard";
import ProfileWorkoutsList from "@/components/profile/ProfileWorkoutsList";
import PagePagination from "@/components/PagePagination";
import { PAGE_SIZE } from "@/lib/constants";
import { fmtVol } from "@/lib/utils";

const UserProfilePage = () => {
  const { username } = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const { user: loggedInUser } = useUserContext();

  const {
    data: userProfile,
    isLoading,
    isError,
  } = useGetUserByUsername(username ?? "");

  const [page, setPage] = useState<number>(1);
  const {
    data: sessions,
    isLoading: sessionsLoading,
    isError: sessionsError,
  } = useGetUserSessions({
    username: userProfile?.username ?? "",
    page,
    pageSize: PAGE_SIZE,
  });

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useUserStatistics(userProfile?.id ?? "");

  const isOwnProfile =
    !!loggedInUser && !!userProfile && loggedInUser.id === userProfile.id;

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-128">
        <Spinner />
      </div>
    );

  if (isError || !userProfile)
    return (
      <p className="px-4 pt-6 text-center text-muted-foreground text-sm">
        User not found.
      </p>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 pb-10 space-y-6">
      <Card className="mt-4">
        <CardContent className="flex items-start gap-4">
          <Avatar className="h-20 w-20 shrink-0">
            <AvatarImage src={userProfile.pfpUrl} />
            <AvatarFallback>{userProfile.username.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex flex-col gap-2">
            <h2 className="font-semibold text-sm">{userProfile.username}</h2>
            {userProfile.description && (
              <p className="text-sm text-wrap">{userProfile.description}</p>
            )}
          </div>
          {isOwnProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/settings")}
            >
              Edit Profile
            </Button>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-3">Statistics</h2>
        <Separator className="mb-3" />
        {statsLoading ? (
          <div className="flex items-center justify-center py-6">
            <Spinner />
          </div>
        ) : statsError || !stats ? (
          <p className="text-sm text-muted-foreground">No statistics yet.</p>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Workouts" value={stats.totalWorkouts ?? 0} />
              <StatCard label="Total Volume" value={fmtVol(stats.totalVolume)} />
            </div>
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
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Workouts</h2>
        <Separator className="mb-3" />
        {sessionsLoading ? (
          <div className="flex items-center justify-center py-6">
            <Spinner />
          </div>
        ) : sessionsError ? (
          <p className="text-sm text-muted-foreground">
            Failed to load workouts.
          </p>
        ) : !sessions || sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No workouts yet.</p>
        ) : (
          <div>
            <ProfileWorkoutsList sessions={sessions} />
            <PagePagination
              pageLength={sessions.length}
              page={page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
