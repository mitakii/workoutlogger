import React from "react";
import type { UserExercise } from "../Context/WorkoutContext";
import { useWorkoutContext } from "../Context/WorkoutContext";
import { UserExerciseTile } from "./UserExerciseTile";

type Props = {
  exercises: UserExercise[] | undefined;
  sessionId: string | undefined;
};

const SessionExerciseList = ({ exercises }: Props) => {
  const { session } = useWorkoutContext();

  if (!session) {
    return <div> No active session</div>;
  }

  return (
    <div>
      exercise list:
      {session.userExercises.map((e) => (
        <div key={e.id}>
          {" "}
          <UserExerciseTile userExercise={e} />
        </div>
      ))}
    </div>
  );
};

export default SessionExerciseList;
