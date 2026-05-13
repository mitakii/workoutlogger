import React from "react";
import type { Exercise } from "../Pages/WorkoutPage";
import ExerciseTile from "./ExerciseTile";
import { useWorkoutContext } from "../Context/WorkoutContext";
import { addUserExercise } from "../Services/UserExerciseService";

type Props = {
  exercises: Exercise[];
};

export const ExerciseList = ({ exercises }: Props) => {
  const { session, refreshSession } = useWorkoutContext();
  const handleAddExercise = async (exercise: Exercise) => {
    if (!session) return;
    try {
      const res = await addUserExercise(session.workoutId, exercise.id);
      await refreshSession(session.workoutId);
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
