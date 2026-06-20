import React, { useState } from "react";
import ExerciseSearch from "../components/ExerciseSearch";
import type { Exercise } from "./WorkoutPage";
import { useUserContext } from "../context/UserContext";
import { ExerciseList } from "../components/ExerciseList";
import { useSearchExercise } from "../hooks/react-query";

type Props = {};

const SearchExercisePage = (props: Props) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searching, setSearching] = useState(false);
  const { mutateAsync: searchExercise } = useSearchExercise(10, 1);

  const handleSearch = async (debounceValue: string) => {
    try {
      setSearching(true);
      const result = await searchExercise(debounceValue);
      setExercises(result);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="p-2 max-w-3xl mx-auto">
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
