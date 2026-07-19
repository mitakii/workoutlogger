import { useState } from "react";
import SearchResult from "@/components/search/SearchResult";
import { useParams } from "react-router-dom";
import type { SearchResults, SearchType } from "@/types/types";
import PagePagination from "@/components/PagePagination";
import { useSearch } from "@/hooks/useSearch";
import { Spinner } from "@/components/ui/spinner";
import SearchBar from "../components/SearchBar";
import { useInitialData } from "@/hooks/useInitialData";

const SearchPage = () => {
  const { type } = useParams<{ type: SearchType }>();
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");

  const [searching, setSearching] = useState(false);

  const {
    data: searchData = [],
    isLoading,
    isFetching,
    isError: searchIsError,
  } = useSearch(type!, page, query);

  const { data: initialData = [], isError: initialIsError } = useInitialData(
    type!,
    page
  );

  const showData = searchData.length == 0 ? initialData : searchData;
  const isError = query.trim().length > 0 ? searchIsError : initialIsError;

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
          Something went wrong while searching. Try again later.
        </p>
      )}

      {!isLoading && !isError && searching && showData.length === 0 && (
        <p className="px-4 pt-6 text-center text-muted-foreground text-sm">
          No {type} found.
        </p>
      )}

      {!isError && showData.length > 0 && (
        <SearchResult type={type!} results={showData as SearchResults} />
      )}

      {!isError && (
        <PagePagination
          page={page}
          setPage={setPage}
          pageLength={showData.length}
        />
      )}
    </div>
  );
};

export default SearchPage;
