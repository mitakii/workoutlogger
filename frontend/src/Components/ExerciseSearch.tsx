import React, { useState } from "react";
import "../index.css";
import { searchExercise } from "../Services/ExerciseService";
import { useUserContext } from "../Context/UserContext";
import type { UserExercise } from "../Context/WorkoutContext";
import type { Exercise } from "../Pages/WorkoutPage";
import { useDebounce } from "react-use";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

const ExerciseSeaerch: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  useDebounce(
    () => {
      if (query === "") return;
      onSearch(query);
    },
    200,
    [query]
  );

  return (
    <div>
      <input
        type="text"
        onChange={({ currentTarget }) => {
          setQuery(currentTarget.value);
        }}
      />
    </div>
  );
};

export default ExerciseSeaerch;
