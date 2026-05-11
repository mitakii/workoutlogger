import React, { useState } from "react";
import ExerciseSearch from "../Components/ExerciseSearch";
import { addUserExercise } from "../Services/UserExerciseService";
import type { Exercise } from "./WorkoutPage";
import { searchExercise } from "../Services/ExerciseService";
import {
  useWorkoutContext,
  type UserExercise,
} from "../Context/WorkoutContext";
import { useUserContext } from "../Context/UserContext";
import { ExerciseList } from "../Components/ExerciseList";

type Props = {};

const SearchExercisePage = (props: Props) => {
  const { session, refreshSession } = useWorkoutContext();
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
    console.log(session.workoutId);
    try {
      const res = await addUserExercise(session.workoutId, exercise.id);
      await refreshSession(session.workoutId);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <ExerciseSearch onSearch={handleSearch} />
      {exercises.length === 0 ? (
        <div>Exercises not found</div>
      ) : (
        <ExerciseList exercises={exercises} addExercise={handleAddExercise} />
      )}
    </div>
  );
};

export default SearchExercisePage;
