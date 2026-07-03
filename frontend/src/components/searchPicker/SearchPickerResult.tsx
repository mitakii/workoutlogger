import type {
  Exercise,
  SearchPickerType,
  SearchPickerResults,
} from "@/types/types";
import React from "react";
import { WorkoutSetExerciseList } from "./workoutExercise/WorkoutSetExerciseList";
import TemplateSetExerciseList from "./templateExercise/TemplateSetExerciseList";

type Props = {
  results: SearchPickerResults;
  type: SearchPickerType;
  id: string;
};

const SearchPickerResult = ({ results, type, id }: Props) => {
  const resultComponents = {
    workoutExercise: (
      <WorkoutSetExerciseList
        exercises={results as Exercise[]}
        workoutId={id}
      />
    ),
    templateExercise: (
      <TemplateSetExerciseList
        exercises={results as Exercise[]}
        templateId={id}
      />
    ),
  };

  return resultComponents[type] ?? null;
};

export default SearchPickerResult;
