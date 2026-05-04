import React, { useEffect, useInsertionEffect, useState } from "react";
import ExerciseSearch from "../Components/ExerciseSearch";
import SessionExerciseList from "../Components/SessionExerciseList";
import { useUserContext } from "../Context/UserContext";
import { addUserExercise } from "../Services/UserExerciseService";
import { useWorkoutContext } from "../Context/WorkoutContext";
import type { UserExercise } from "../Context/WorkoutContext";
import { searchExercise } from "../Services/ExerciseService";

export type Exercise = {
  name: string;
  id: string;
  description: string;
  imageUrl: string | null;
};

type Props = {};

const WorkoutPage = (props: Props) => {
  const { user } = useUserContext();
  const { session, refreshSession } = useWorkoutContext();
  const [userExercises, setUserExercises] = useState<UserExercise[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const handleSearch = async (debounceValue: string) => {
    try {
      const result = await searchExercise(debounceValue, 10, 1);
      setExercises(result);
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddExercise = async (exercise: Exercise) => {
    if (!session) return;
    try {
      const res = await addUserExercise(session?.workoutId, exercise.id);
      setUserExercises((prev) => [...prev, res]);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <ExerciseSearch onSearch={handleSearch} />
      <SessionExerciseList
        exercises={session?.userExercises}
        sessionId={session?.workoutId}
      />
    </div>
  );
};

export default WorkoutPage;
