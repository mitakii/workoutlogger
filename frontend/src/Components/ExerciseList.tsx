import React from "react";
import type { Exercise } from "../Pages/WorkoutPage";
import ExerciseTile from "./ExerciseTile";

type Props = {
  exercises: Exercise[];
  addExercise: (e: Exercise) => void;
};

export const ExerciseList = ({ exercises, addExercise }: Props) => {
  return (
    <div>
      {exercises.map((e) => (
        <div key={e.id}>
          <ExerciseTile exercise={e} addExercise={addExercise} />
        </div>
      ))}
    </div>
  );
};
