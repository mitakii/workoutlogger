import { UserExerciseTile } from "./UserExerciseTile";
import { useLastSession } from "../hooks/react-query";

const SessionExerciseList = () => {
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
