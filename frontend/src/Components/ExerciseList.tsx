import React from "react";
import type { Exercise } from "../Pages/WorkoutPage";
import ExerciseTile from "./ExerciseTile";
import { useAddUserExercise, useLastSession } from "../hooks/react-query";

type Props = {
  exercises: Exercise[];
};

export const ExerciseList = ({ exercises }: Props) => {
  const { data: session } = useLastSession();
  const { mutateAsync: addUserExercise } = useAddUserExercise();
  const handleAddExercise = async (exercise: Exercise) => {
    if (!session) return;
    try {
      const res = await addUserExercise({
        workoutId: session.workoutId,
        exerciseId: exercise.id,
      });
      //await refreshSession(session.workoutId);
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  return (
    <div>
      {exercises.map((e) => (
        <div key={e.id}>
          <ExerciseTile exercise={e} addExercise={handleAddExercise} />
        </div>
      ))}
    </div>
  );
};
