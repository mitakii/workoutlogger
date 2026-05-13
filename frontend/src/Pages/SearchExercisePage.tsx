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
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (debounceValue: string) => {
    try {
      setSearching(true);
      const result = await searchExercise(debounceValue, 10, 1);
      setExercises(result);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <ExerciseSearch onSearch={handleSearch} />
      {exercises.length === 0 && searching ? (
        <div>Exercises not found</div>
      ) : (
        <ExerciseList exercises={exercises} />
      )}
    </div>
  );
};

export default SearchExercisePage;
