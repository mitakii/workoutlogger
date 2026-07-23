import React, { useState } from "react";
import { useDebounce } from "react-use";
import { useTranslation } from "react-i18next";
import { Input } from "./ui/input";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const { t } = useTranslation("search");
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
        placeholder={t("searchBar.placeholder")}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(e.currentTarget.value);
        }}
      />
    </div>
  );
};

export default SearchBar;
