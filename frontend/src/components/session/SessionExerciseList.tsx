import type { UserSession } from "@/types/types";
import { UserExerciseTile } from "./UserExerciseTile";

type Props = {
  session: UserSession;
};

const SessionExerciseList = ({ session }: Props) => {
  if (!session) {
    return <div> No active session</div>;
  }

  return (
    <div>
      {session.userExercises.map((e) => (
        <UserExerciseTile
          key={e.id}
          userExercise={e}
          sessionId={session.workoutId}
        />
      ))}
    </div>
  );
};

export default SessionExerciseList;
