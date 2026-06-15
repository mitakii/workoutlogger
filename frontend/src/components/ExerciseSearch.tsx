import React, { useState } from "react";
import "../index.css";
import { useDebounce } from "react-use";

type SearchBarProps = {
  onSearch: (query: string) => Promise<void>;
};

const ExerciseSeaerch: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  useDebounce(
    async () => {
      if (query === "") return;
      await onSearch(query);
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
