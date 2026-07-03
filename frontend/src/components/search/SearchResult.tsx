import type {
  Exercise,
  SearchResults,
  SearchType,
  UserProfile,
  UserTemplate,
} from "@/types/types";
import React from "react";
import { WorkoutSetExerciseList } from "../searchPicker/workoutExercise/WorkoutSetExerciseList";
import UserList from "./user/UserList";
import TemplateSetExerciseList from "../searchPicker/templateExercise/TemplateSetExerciseList";
import TemplateList from "./template/TemplateList";

type Props = {
  type: SearchType;
  results: SearchResults;
};

const SearchResult = ({ type, results }: Props) => {
  const resultComponents = {
    user: <UserList users={results as UserProfile[]} />,
    template: <TemplateList templates={results as UserTemplate[]} />,
  };

  return resultComponents[type] ?? null;
};

export default SearchResult;
