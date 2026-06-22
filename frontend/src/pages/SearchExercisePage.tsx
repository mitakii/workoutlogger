import { useState } from "react";
import ExerciseSearch from "../components/ExerciseSearch";
import type { Exercise } from "./WorkoutPage";
import { ExerciseList } from "../components/ExerciseList";
import { useSearchExercise } from "../hooks/react-query";
import { Spinner } from "@/components/ui/spinner";

const SearchExercisePage = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searching, setSearching] = useState(false);
  const { mutateAsync: searchExercise, isPending } = useSearchExercise(10, 1);

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

      {isPending && (
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner />
        </div>
      )}

      {!isPending && exercises.length === 0 && searching && (
        <div>Exercises not found</div>
      )}

      {!isPending && exercises.length > 0 && searching && (
        <ExerciseList exercises={exercises} />
      )}
    </div>
  );
};

export default SearchExercisePage;
