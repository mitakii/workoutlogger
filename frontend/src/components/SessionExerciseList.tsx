import { UserExerciseTile } from "./UserExerciseTile";
import type { UserExercise } from "../types/types";
import { useLastSession } from "../hooks/react-query";

type Props = {
  exercises: UserExercise[] | undefined;
  sessionId: string | undefined;
};

const SessionExerciseList = ({ exercises }: Props) => {
  const { data: session } = useLastSession();

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
