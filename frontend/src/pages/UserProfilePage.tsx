import PagePagination from "@/components/profile/PagePagination";
import ProfileWorkoutsList from "@/components/profile/ProfileWorkoutsList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { useGetUserByUsername, useGetUserSessions } from "@/hooks/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const PageSize = 10;

const UserProfilePage = () => {
  const { token } = useParams<{ token?: string }>();
  const { data: userProfile, isLoading } = useGetUserByUsername(token ?? "");
  const [page, setPage] = useState<number>(1);
  const { data: sessions, isLoading: sessionsLoading } = useGetUserSessions({
    username: userProfile?.username ?? "",
    page,
    pageSize: 10,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-128">
        <Spinner />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      <div className="flex items-start gap-4 mt-4">
        <Avatar
          className="h-20 w-20 shrink-0"
          onClick={() => console.log(userProfile)}
        >
          <AvatarImage src={`${userProfile?.pfpUrl}`} />
          <AvatarFallback>{userProfile?.username.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <h2 className="font-semibold text-sm">{userProfile?.username}</h2>
            </div>
          </div>
        </div>
        <div className="mt-3 text-wrap">{userProfile?.description}</div>
      </div>
      <div>
        {sessionsLoading ? (
          <div className="flex items-center justify-center ">
            <Spinner />
          </div>
        ) : !sessions ? (
          <div>No workouts yet</div>
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
