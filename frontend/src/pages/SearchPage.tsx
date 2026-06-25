import { useState } from "react";
import ExerciseSearch from "../components/SearchBar";
import { Spinner } from "@/components/ui/spinner";

import SearchResult from "@/components/search/SearchResult";
import { useParams } from "react-router-dom";
import { PageSize } from "./UserProfilePage";
import type { SearchResults, SearchType } from "@/types/types";
import PagePagination from "@/components/profile/PagePagination";
import { useSearch } from "@/hooks/useSearch";

const SearchPage = () => {
  const { type } = useParams<{ type: SearchType }>();
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
      <ExerciseSearch onSearch={handleSearch} />

      {(isLoading || isFetching) && (
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner />
        </div>
      )}

      {!isLoading && searching && data.length === 0 && (
        <div>{type} not found</div>
      )}

      {data.length > 0 && (
        <SearchResult type={type!} results={data as SearchResults} />
      )}

      <PagePagination page={page} setPage={setPage} pageLength={data.length} />
    </div>
  );
};

export default SearchPage;
