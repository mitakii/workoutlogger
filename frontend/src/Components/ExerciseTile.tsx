import React from "react";
import type { Exercise } from "../Pages/WorkoutPage";

type Props = {
  exercise: Exercise;
  addExercise: (e: Exercise) => void;
};

export const ExerciseTile = ({ exercise, addExercise }: Props) => {
  return (
    <div>
      $`{exercise.name}`
      <div>
        <button onClick={() => addExercise(exercise)}>addExercise</button>
      </div>
    </div>
  );
};

export default ExerciseTile;
