import React, { useEffect, useInsertionEffect, useState } from "react";
import ExerciseSearch from "../Components/ExerciseSearch";
import SessionExerciseList from "../Components/SessionExerciseList";
import { useUserContext } from "../Context/UserContext";
import { addUserExercise } from "../Services/UserExerciseService";
import { useWorkoutContext } from "../Context/WorkoutContext";
import type { UserExercise } from "../Context/WorkoutContext";
export type Exercise = {
  name: string;
  id: string;
  description: string;
  imageUrl: string;
};

type Props = {};

const WorkoutPage = (props: Props) => {
  const { user } = useUserContext();
  const { session, refreshSession } = useWorkoutContext();
  const [userExercises, setUserExercises] = useState<UserExercise>();

  const handleAddExercise = async (exercise: Exercise) => {
    if (!session) return;
    try {
      const res = addUserExercise(session?.workoutId, exercise.id);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <ExerciseSearch />
      <SessionExerciseList
        exercises={session?.userExercises}
        sessionId={session?.workoutId}
      />
    </div>
  );
};

export default WorkoutPage;
