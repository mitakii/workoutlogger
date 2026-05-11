import React from "react";
import type { UserExercise } from "../Context/WorkoutContext";

type Props = {
  userExercise: UserExercise;
};

export const UserExerciseTile = ({ userExercise }: Props) => {
  return <div>$`{userExercise.exerciseName}` test </div>;
};
