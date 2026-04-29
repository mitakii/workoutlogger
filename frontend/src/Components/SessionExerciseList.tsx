import React from "react";
import type { UserExercise } from "../Context/WorkoutContext";
import { useWorkoutContext } from "../Context/WorkoutContext";

type Props = {
  exercises: UserExercise[] | undefined;
  sessionId: string | undefined;
};

const SessionExerciseList = (props: Props) => {
  const { session } = useWorkoutContext();

  return <div>{session == null ? <div>nuhuh</div> : session?.workoutId}</div>;
};

export default SessionExerciseList;
