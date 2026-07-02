import type {
  Exercise,
  SearchPickerType,
  SearchPickerResults,
} from "@/types/types";
import React from "react";
import { WorkoutExerciseList } from "./workoutExercise/WorkoutExerciseList";
import TemplateExerciseList from "./templateExercise/TemplateExerciseList";

type Props = {
  results: SearchPickerResults;
  type: SearchPickerType;
  id: string;
};

const SearchPickerResult = ({ results, type, id }: Props) => {
  const resultComponents = {
    workoutExercise: (
      <WorkoutExerciseList exercises={results as Exercise[]} workoutId={id} />
    ),
    templateExercise: (
      <TemplateExerciseList exercises={results as Exercise[]} templateId={id} />
    ),
  };

  return resultComponents[type] ?? null;
};

export default SearchPickerResult;
