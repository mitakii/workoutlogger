import { useState } from "react";
import SearchResult from "@/components/search/SearchResult";
import { useParams } from "react-router-dom";
import type { SearchResults, SearchType } from "@/types/types";
import PagePagination from "@/components/profile/PagePagination";
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
  } = useSearch(type!, page, query);

  const { data: initialData = [] } = useInitialData(type!, page);

  const showData = searchData.length == 0 ? initialData : searchData;

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

      {!isLoading && searching && showData.length === 0 && (
        <div>{type} not found</div>
      )}

      {showData.length > 0 && (
        <SearchResult type={type!} results={showData as SearchResults} />
      )}

      <PagePagination
        page={page}
        setPage={setPage}
        pageLength={showData.length}
      />
    </div>
  );
};

export default SearchPage;
