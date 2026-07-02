import React, { useState } from "react";
import { useDebounce } from "react-use";
import { Input } from "./ui/input";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  useDebounce(
    async () => {
      if (query === "") return;
      onSearch(query);
    },
    200,
    [query]
  );

  return (
    <div>
      <Input
        type="text"
        value={query}
        placeholder="Search..."
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(e.currentTarget.value);
        }}
      />
    </div>
  );
};

export default SearchBar;
