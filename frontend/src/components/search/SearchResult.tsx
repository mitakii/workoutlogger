import type {
  Exercise,
  SearchResults,
  SearchType,
  UserProfile,
  UserTemplate,
} from "@/types/types";
import React from "react";
import { WorkoutExerciseList } from "../searchPicker/workoutExercise/WorkoutExerciseList";
import UserList from "./user/UserList";
import TemplateExerciseList from "../searchPicker/templateExercise/TemplateExerciseList";
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
