import PagePagination from "@/components/PagePagination";
import SearchBar from "@/components/SearchBar";
import SearchResult from "@/components/search/SearchResult";
import { Spinner } from "@/components/ui/spinner";
import { useSearch } from "@/hooks/useSearch";
import type { SearchPickerType, SearchPickerResults } from "@/types/types";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import SearchPickerResult from "@/components/searchPicker/SearchPickerResult";
import { useTranslation } from "react-i18next";

const SearchPickerPage = () => {
  const { t } = useTranslation("searchPicker");
  const { type } = useParams<{ type: SearchPickerType }>();
  const { id } = useParams();

  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");

  const [searching, setSearching] = useState(false);

  const {
    data = [],
    isLoading,
    isFetching,
    isError,
  } = useSearch(type!, page, query);

  const handleSearch = (debounceValue: string) => {
    setSearching(true);
    setQuery(debounceValue);
  };

  return (
    <div className="p-2 max-w-3xl mx-auto">
      <SearchBar onSearch={handleSearch} />

      {(isLoading || isFetching) && (
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner />
        </div>
      )}

      {!isLoading && isError && (
        <p className="px-4 pt-6 text-center text-muted-foreground text-sm">
          {t("searchPickerPage.error")}
        </p>
      )}

      {!isLoading && !isError && searching && data.length === 0 && (
        <p className="px-4 pt-6 text-center text-muted-foreground text-sm">
          {t("searchPickerPage.noResults", { type })}
        </p>
      )}

      {!isError && data.length > 0 && (
        <SearchPickerResult
          type={type!}
          results={data as SearchPickerResults}
          id={id!}
        />
      )}

      {!isError && (
        <PagePagination page={page} setPage={setPage} pageLength={data.length} />
      )}
    </div>
  );
};

export default SearchPickerPage;
