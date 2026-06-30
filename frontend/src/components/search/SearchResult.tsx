import type { Exercise, SearchType, UserProfile } from "@/types/types";
import React from "react";
import { ExerciseList } from "./exercise/ExerciseList";
import UserList from "./user/UserList";

type Props = {
  type: SearchType;
  results: Exercise[] | UserProfile[];
};

const SearchResult = ({ type, results }: Props) => {
  const resultComponents = {
    exercise: <ExerciseList exercises={results as Exercise[]} />,
    user: <UserList users={results as UserProfile[]} />,
    template: <ExerciseList exercises={results as Exercise[]} />,
  };

  return resultComponents[type] ?? null;
};

export default SearchResult;
