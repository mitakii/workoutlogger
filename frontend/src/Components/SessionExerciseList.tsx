import React from "react";
import type { UserExercise } from "../Context/WorkoutContext";

type Props = {
  exercises: UserExercise[] | undefined;
  sessionId: string | undefined;
};

const SessionExerciseList = (props: Props) => {
  return <div>SessionExerciseLIst</div>;
};

export default SessionExerciseList;
