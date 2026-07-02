import PagePagination from "@/components/profile/PagePagination";
import SearchBar from "@/components/SearchBar";
import SearchResult from "@/components/search/SearchResult";
import { Spinner } from "@/components/ui/spinner";
import { useSearch } from "@/hooks/useSearch";
import type { SearchPickerType, SearchPickerResults } from "@/types/types";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import SearchPickerResult from "@/components/searchPicker/SearchPickerResult";

const SearchPickerPage = () => {
  const { type } = useParams<{ type: SearchPickerType }>();
  const { id } = useParams();

  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");

  const [searching, setSearching] = useState(false);

  const { data = [], isLoading, isFetching } = useSearch(type!, page, query);

  const handleSearch = async (debounceValue: string) => {
    try {
      setSearching(true);
      setQuery(debounceValue);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="p-2 max-w-3xl mx-auto">
      <SearchBar onSearch={handleSearch} />

      {(isLoading || isFetching) && (
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner />
        </div>
      )}

      {!isLoading && searching && data.length === 0 && (
        <div>{type} not found</div>
      )}

      {data.length > 0 && (
        <SearchPickerResult
          type={type!}
          results={data as SearchPickerResults}
          id={id!}
        />
      )}

      <PagePagination page={page} setPage={setPage} pageLength={data.length} />
    </div>
  );
};

export default SearchPickerPage;
