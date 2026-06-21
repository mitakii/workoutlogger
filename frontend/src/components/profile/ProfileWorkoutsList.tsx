import type { UserSession } from "@/types/types";
import ProfileWorkoutTile from "./ProfileWorkoutTile";
import { Spinner } from "../ui/spinner";

type Props = {
  sessions: UserSession[];
};

const ProfileWorkoutsList = ({ sessions }: Props) => {
  if (!sessions)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <div>
      {sessions.map((session) => (
        <ProfileWorkoutTile key={session.workoutId} session={session} />
      ))}
    </div>
  );
};

export default ProfileWorkoutsList;
